# backend/app/services/firebase.py
# ──────────────────────────────────────────────
# CareBridge — Firebase / Firestore Service
# ──────────────────────────────────────────────
# Handles all database operations:
# - Initialize Firebase connection
# - Create, Read, Update users
# - Check for duplicate email/username/mobile
# ──────────────────────────────────────────────

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone
from typing import Optional
from app.config import settings


# ══════════════════════════════════════════════
#  INITIALIZE FIREBASE
# ══════════════════════════════════════════════
# Firebase Admin SDK connects our backend to Firestore.
# It uses a service account JSON file for authentication.
#
# Firestore structure:
#   └── users (collection)
#       ├── auto_id_1 (document)
#       │   ├── full_name: "Mallesh M"
#       │   ├── email: "mallesh@example.com"
#       │   ├── username: "mallesh_m"
#       │   ├── mobile_number: "9876543210"
#       │   ├── password_hash: "$2b$12$..."
#       │   ├── is_active: true
#       │   ├── created_at: "2025-03-07T..."
#       │   └── updated_at: "2025-03-07T..."
#       ├── auto_id_2 (document)
#       │   └── ...
# ──────────────────────────────────────────────

def initialize_firebase():
    """
    Initialize Firebase Admin SDK.
    This runs ONCE when the server starts.
    
    It checks if Firebase is already initialized
    to avoid duplicate initialization errors.
    """
    try:
        # Check if already initialized
        firebase_admin.get_app()
    except ValueError:
        # Not initialized yet — initialize now
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred, {
            "projectId": settings.FIREBASE_PROJECT_ID
        })


def get_db():
    """
    Get Firestore database client.
    
    Returns:
        Firestore client instance
    """
    initialize_firebase()
    return firestore.client()


# ══════════════════════════════════════════════
#  USER OPERATIONS
# ══════════════════════════════════════════════


async def create_user(user_data: dict) -> dict:
    """
    Save a new user to Firestore.
    
    Used during REGISTRATION:
        1. auth.py validates the data
        2. auth_service.py hashes the password
        3. This function saves everything to Firestore
    
    Args:
        user_data: dict containing:
            - full_name
            - email
            - mobile_number
            - username
            - password_hash (already hashed!)
    
    Returns:
        dict with user data + generated document ID
    """
    db = get_db()

    # Add timestamps
    now = datetime.now(timezone.utc).isoformat()
    user_data["created_at"] = now
    user_data["updated_at"] = now
    user_data["is_active"] = True

    # Save to Firestore — auto-generates a unique document ID
    doc_ref = db.collection("users").document()
    doc_ref.set(user_data)

    # Add the generated ID to the user data
    user_data["id"] = doc_ref.id

    return user_data


async def get_user_by_email(email: str) -> Optional[dict]:
    """
    Find a user by their email address.
    
    Used during:
        - Registration: Check if email already exists
        - Login: Find user by email
    
    Args:
        email: The email to search for
    
    Returns:
        User dict if found, None if not found
    """
    db = get_db()

    # Query Firestore: find documents where email == given email
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", email).limit(1).get()

    for doc in query:
        user = doc.to_dict()
        user["id"] = doc.id
        return user

    return None


async def get_user_by_username(username: str) -> Optional[dict]:
    """
    Find a user by their username.
    
    Used during:
        - Registration: Check if username already exists
        - Login: Find user by username
    
    Args:
        username: The username to search for
    
    Returns:
        User dict if found, None if not found
    """
    db = get_db()

    users_ref = db.collection("users")
    query = users_ref.where("username", "==", username).limit(1).get()

    for doc in query:
        user = doc.to_dict()
        user["id"] = doc.id
        return user

    return None


async def get_user_by_mobile(mobile_number: str) -> Optional[dict]:
    """
    Find a user by their mobile number.
    
    Used during:
        - Registration: Check if mobile number already exists
    
    Args:
        mobile_number: The mobile number to search for
    
    Returns:
        User dict if found, None if not found
    """
    db = get_db()

    users_ref = db.collection("users")
    query = users_ref.where("mobile_number", "==", mobile_number).limit(1).get()

    for doc in query:
        user = doc.to_dict()
        user["id"] = doc.id
        return user

    return None


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """
    Find a user by their Firestore document ID.
    
    Used during:
        - Auth middleware: Get user profile from JWT token's user_id
        - GET /api/auth/me: Return current user profile
    
    Args:
        user_id: The Firestore document ID
    
    Returns:
        User dict if found, None if not found
    """
    db = get_db()

    doc = db.collection("users").document(user_id).get()

    if doc.exists:
        user = doc.to_dict()
        user["id"] = doc.id
        return user

    return None


async def update_user(user_id: str, update_data: dict) -> Optional[dict]:
    """
    Update a user's profile in Firestore.
    
    Used during:
        - PUT /api/auth/update-profile
    
    Args:
        user_id: The Firestore document ID
        update_data: dict of fields to update
    
    Returns:
        Updated user dict if found, None if not found
    """
    db = get_db()

    doc_ref = db.collection("users").document(user_id)
    doc = doc_ref.get()

    if not doc.exists:
        return None

    # Add updated timestamp
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    # Update only the provided fields
    doc_ref.update(update_data)

    # Return the updated user
    updated_doc = doc_ref.get()
    user = updated_doc.to_dict()
    user["id"] = doc_ref.id

    return user


async def get_user_by_username_or_email(username_or_email: str) -> Optional[dict]:
    """
    Find a user by either username or email.
    
    Used during LOGIN — the user can type either their
    username or email in the login form.
    
    Flow:
        1. First try to find by username
        2. If not found, try to find by email
        3. If still not found, return None
    
    Args:
        username_or_email: Could be either a username or email
    
    Returns:
        User dict if found, None if not found
    """
    # Try username first
    user = await get_user_by_username(username_or_email)
    if user:
        return user

    # Try email
    user = await get_user_by_email(username_or_email)
    if user:
        return user

    return None