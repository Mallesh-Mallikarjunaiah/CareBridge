# backend/app/middleware/auth_middleware.py
# ──────────────────────────────────────────────
# CareBridge — Auth Middleware (Route Protection)
# ──────────────────────────────────────────────
# This middleware protects routes that require login.
#
# HOW IT WORKS:
#   1. Frontend sends request with header:
#      Authorization: Bearer eyJhbGciOiJ...
#
#   2. This middleware intercepts the request
#
#   3. Extracts the token from the header
#
#   4. Verifies the token using auth_service
#
#   5. If valid → fetches user from Firestore
#      and passes user data to the endpoint
#
#   6. If invalid → returns 401 Unauthorized
#
# USAGE IN ENDPOINTS:
#   @router.get("/protected")
#   async def protected_route(current_user: dict = Depends(get_current_user)):
#       return {"message": f"Hello {current_user['full_name']}"}
# ──────────────────────────────────────────────

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import verify_access_token
from app.services.firebase import get_user_by_id


# ──────────────────────────────────────────────
# HTTPBearer extracts the token from the header
# Header format: Authorization: Bearer <token>
# It automatically returns 403 if no token is sent
# ──────────────────────────────────────────────
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency that extracts and verifies the JWT token,
    then returns the current logged-in user.
    
    This is used as a DEPENDENCY in protected endpoints:
    
        @router.get("/dashboard")
        async def dashboard(current_user: dict = Depends(get_current_user)):
            # current_user contains the full user profile
            return {"welcome": current_user["full_name"]}
    
    Flow:
        1. Extract token from Authorization header
        2. Verify token with auth_service
        3. Get user_id from token payload
        4. Fetch full user profile from Firestore
        5. Return user profile to the endpoint
    
    Raises:
        HTTPException 401: If token is missing, invalid, or expired
        HTTPException 401: If user not found in database
    
    Returns:
        dict: Full user profile from Firestore
    """

    # Step 1: Get the token string
    token = credentials.credentials

    # Step 2: Verify the token and extract payload
    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please login again.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Step 3: Get user_id from the token payload
    user_id = payload.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload. Please login again.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Step 4: Fetch full user profile from Firestore
    user = await get_user_by_id(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found. Account may have been deleted.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Step 5: Check if user account is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated. Contact support.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Step 6: Remove password hash before returning
    # NEVER send password hash to the frontend
    user.pop("password_hash", None)

    return user