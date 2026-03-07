# backend/app/routers/auth.py
# ──────────────────────────────────────────────
# CareBridge — Authentication Router
# ──────────────────────────────────────────────
# Endpoints:
#   POST /api/auth/register  → New user sign up
#   POST /api/auth/login     → User login
#   GET  /api/auth/me        → Get current user profile
#   PUT  /api/auth/update    → Update user profile
# ──────────────────────────────────────────────

from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import (
    UserRegister,
    UserLogin,
    UserResponse,
    UserUpdate,
    TokenResponse,
    MessageResponse
)
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token
)
from app.services.firebase import (
    create_user,
    get_user_by_email,
    get_user_by_username,
    get_user_by_mobile,
    get_user_by_username_or_email,
    update_user
)
from app.middleware.auth_middleware import get_current_user


router = APIRouter()


# ══════════════════════════════════════════════
#  POST /api/auth/register — New User Sign Up
# ══════════════════════════════════════════════

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Creates a new user account with email, mobile, username, and password"
)
async def register(user_data: UserRegister):
    """
    REGISTRATION FLOW:
    
    1. Validate passwords match
    2. Check if email already exists → 400 error
    3. Check if username already exists → 400 error
    4. Check if mobile already exists → 400 error
    5. Hash the password
    6. Save user to Firestore
    7. Generate JWT token
    8. Return token + user profile
    """

    # ── Step 1: Check passwords match ──
    if user_data.password != user_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    # ── Step 2: Check if email already exists ──
    existing_email = await get_user_by_email(user_data.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please login instead."
        )

    # ── Step 3: Check if username already exists ──
    existing_username = await get_user_by_username(user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken. Please choose another."
        )

    # ── Step 4: Check if mobile number already exists ──
    existing_mobile = await get_user_by_mobile(user_data.mobile_number)
    if existing_mobile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered."
        )

    # ── Step 5: Hash the password ──
    hashed = hash_password(user_data.password)

    # ── Step 6: Prepare user data for Firestore ──
    new_user = {
        "full_name": user_data.full_name,
        "email": user_data.email,
        "mobile_number": user_data.mobile_number,
        "username": user_data.username,
        "password_hash": hashed
    }

    # ── Step 7: Save to Firestore ──
    created_user = await create_user(new_user)

    # ── Step 8: Generate JWT token ──
    token = create_access_token(
        user_id=created_user["id"],
        username=created_user["username"]
    )

    # ── Step 9: Return token + user profile ──
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=created_user["id"],
            full_name=created_user["full_name"],
            email=created_user["email"],
            mobile_number=created_user["mobile_number"],
            username=created_user["username"],
            is_active=created_user.get("is_active", True),
            created_at=created_user.get("created_at")
        )
    )


# ══════════════════════════════════════════════
#  POST /api/auth/login — User Login
# ══════════════════════════════════════════════

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login with username/email and password",
    description="Authenticates user and returns a JWT token"
)
async def login(login_data: UserLogin):
    """
    LOGIN FLOW:
    
    1. Find user by username or email
    2. If not found → 401 error
    3. Verify password against stored hash
    4. If wrong password → 401 error
    5. Generate JWT token
    6. Return token + user profile
    """

    # ── Step 1: Find user by username or email ──
    user = await get_user_by_username_or_email(login_data.username_or_email)

    # ── Step 2: User not found ──
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your username/email and password."
        )

    # ── Step 3: Check if account is active ──
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated. Please contact support."
        )

    # ── Step 4: Verify password ──
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your username/email and password."
        )

    # ── Step 5: Generate JWT token ──
    token = create_access_token(
        user_id=user["id"],
        username=user["username"]
    )

    # ── Step 6: Return token + user profile ──
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            full_name=user["full_name"],
            email=user["email"],
            mobile_number=user["mobile_number"],
            username=user["username"],
            is_active=user.get("is_active", True),
            created_at=user.get("created_at")
        )
    )


# ══════════════════════════════════════════════
#  GET /api/auth/me — Get Current User Profile
# ══════════════════════════════════════════════

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current logged-in user profile",
    description="Returns the profile of the currently authenticated user"
)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    GET PROFILE FLOW:
    
    1. Auth middleware verifies JWT token
    2. Auth middleware fetches user from Firestore
    3. This endpoint receives the user data
    4. Returns the user profile

    The heavy lifting is done by get_current_user middleware.
    If token is invalid, middleware returns 401 before reaching here.
    """

    return UserResponse(
        id=current_user["id"],
        full_name=current_user["full_name"],
        email=current_user["email"],
        mobile_number=current_user["mobile_number"],
        username=current_user["username"],
        is_active=current_user.get("is_active", True),
        created_at=current_user.get("created_at")
    )


# ══════════════════════════════════════════════
#  PUT /api/auth/update — Update User Profile
# ══════════════════════════════════════════════

@router.put(
    "/update",
    response_model=UserResponse,
    summary="Update user profile",
    description="Update the current user's profile information"
)
async def update_profile(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    UPDATE PROFILE FLOW:
    
    1. Auth middleware verifies the user is logged in
    2. Validate new email/mobile aren't taken by others
    3. Update only the fields that were provided
    4. Return updated user profile
    """

    # Build update dict with only provided fields
    updates = {}

    if update_data.full_name is not None:
        updates["full_name"] = update_data.full_name

    if update_data.email is not None:
        # Check if new email is already taken by another user
        existing = await get_user_by_email(update_data.email)
        if existing and existing["id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use by another account."
            )
        updates["email"] = update_data.email

    if update_data.mobile_number is not None:
        # Check if new mobile is already taken by another user
        existing = await get_user_by_mobile(update_data.mobile_number)
        if existing and existing["id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mobile number already in use by another account."
            )
        updates["mobile_number"] = update_data.mobile_number

    # Nothing to update
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update. Provide at least one field."
        )

    # Update in Firestore
    updated_user = await update_user(current_user["id"], updates)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    return UserResponse(
        id=updated_user["id"],
        full_name=updated_user["full_name"],
        email=updated_user["email"],
        mobile_number=updated_user["mobile_number"],
        username=updated_user["username"],
        is_active=updated_user.get("is_active", True),
        created_at=updated_user.get("created_at")
    )