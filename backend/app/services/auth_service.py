# backend/app/services/auth_service.py
# ──────────────────────────────────────────────
# CareBridge — Authentication Service
# ──────────────────────────────────────────────
# Handles two critical security functions:
# 1. Password Hashing  — never store plain passwords
# 2. JWT Token Management — create & verify tokens
# ──────────────────────────────────────────────

import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from app.config import settings


# ══════════════════════════════════════════════
#  PASSWORD HASHING (using bcrypt directly)
# ══════════════════════════════════════════════
# bcrypt is a one-way hashing algorithm.
# "One-way" means:
#   - You CAN turn a password INTO a hash
#   - You CANNOT turn a hash BACK into a password
#
# Example:
#   "MyPassword123" → "$2b$12$LJ3m5..." (hash)
#   "$2b$12$LJ3m5..." → ??? (impossible to reverse)
# ──────────────────────────────────────────────


def hash_password(plain_password: str) -> str:
    """
    Takes a plain text password and returns a hashed version.
    
    Used during REGISTRATION:
        User types: "MyPassword123"
        We store:   "$2b$12$LJ3m5ZrT..."
    
    Args:
        plain_password: The password the user typed
    
    Returns:
        Hashed password string (safe to store in database)
    """
    # Convert string to bytes (bcrypt requires bytes)
    password_bytes = plain_password.encode("utf-8")

    # Generate salt and hash the password
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)

    # Return as string (for storing in Firestore)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Checks if a plain password matches a stored hash.
    
    Used during LOGIN:
        User types: "MyPassword123"
        We compare with stored hash: "$2b$12$LJ3m5ZrT..."
        Returns True if they match, False if they don't
    
    Args:
        plain_password: The password the user just typed
        hashed_password: The hash stored in Firestore
    
    Returns:
        True if password matches, False otherwise
    """
    try:
        password_bytes = plain_password.encode("utf-8")
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False


# ══════════════════════════════════════════════
#  JWT TOKEN MANAGEMENT
# ══════════════════════════════════════════════
# JWT (JSON Web Token) is like a digital ID card:
#
#   1. User logs in with correct password
#   2. Server creates a JWT containing user_id
#   3. Server sends JWT to frontend
#   4. Frontend stores JWT and sends it with every request
#   5. Server verifies JWT to identify the user
#
# Token structure (3 parts separated by dots):
#   header.payload.signature
#   eyJhbG...eyJ1c2...SflKxw...
#
# Payload contains:
#   { "sub": "user_123", "exp": 1699999999 }
#   sub = subject (who is this token for)
#   exp = expiration (when does this token expire)
# ──────────────────────────────────────────────


def create_access_token(user_id: str, username: str) -> str:
    """
    Creates a JWT token after successful login/registration.
    
    The token contains:
        - sub: user_id (to identify who this token belongs to)
        - username: for quick access without DB lookup
        - exp: expiration time (default 24 hours)
    
    Args:
        user_id: The Firestore document ID of the user
        username: The user's username
    
    Returns:
        JWT token string like "eyJhbGciOiJ..."
    """
    # Set token expiration time
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    )

    # Data to encode inside the token
    payload = {
        "sub": user_id,          # Subject — who is this for
        "username": username,     # Username for quick access
        "exp": expire,            # Expiration timestamp
        "iat": datetime.now(timezone.utc)  # Issued at timestamp
    }

    # Create the token using our secret key
    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return token


def verify_access_token(token: str) -> Optional[dict]:
    """
    Verifies a JWT token and extracts the payload.
    
    Used by auth_middleware on EVERY protected request:
        1. Frontend sends: Authorization: Bearer eyJhbG...
        2. Middleware extracts the token
        3. This function verifies it's valid and not expired
        4. Returns the payload (user_id, username) if valid
        5. Returns None if invalid or expired
    
    Args:
        token: The JWT token string from the Authorization header
    
    Returns:
        dict with user_id and username if valid
        None if token is invalid, expired, or tampered with
    """
    try:
        # Decode the token using our secret key
        # This also automatically checks if the token is expired
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )

        # Extract user info from payload
        user_id: str = payload.get("sub")
        username: str = payload.get("username")

        # If user_id is missing, token is invalid
        if user_id is None:
            return None

        return {
            "user_id": user_id,
            "username": username
        }

    except JWTError:
        # Token is invalid, expired, or tampered with
        return None