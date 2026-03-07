# backend/app/models/schemas.py
# ──────────────────────────────────────────────
# CareBridge — Pydantic Data Models (Schemas)
# ──────────────────────────────────────────────
# These schemas define the SHAPE of data flowing
# through the API. They validate incoming requests
# and format outgoing responses automatically.
# ──────────────────────────────────────────────

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ══════════════════════════════════════════════
#  AUTH SCHEMAS — Registration & Login
# ══════════════════════════════════════════════

class UserRegister(BaseModel):
    """
    Data required when a NEW user signs up.
    Frontend sends this to POST /api/auth/register
    """
    full_name: str = Field(
        ...,                          # ... means REQUIRED
        min_length=2,
        max_length=100,
        examples=["Mallesh M"]
    )
    email: str = Field(
        ...,
        min_length=5,
        max_length=100,
        examples=["mallesh@example.com"]
    )
    mobile_number: str = Field(
        ...,
        min_length=10,
        max_length=15,
        examples=["9876543210"]
    )
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        examples=["mallesh_m"]
    )
    password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        examples=["StrongPass123"]
    )
    confirm_password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        examples=["StrongPass123"]
    )


class UserLogin(BaseModel):
    """
    Data required when an EXISTING user logs in.
    Frontend sends this to POST /api/auth/login
    Can login with either username or email.
    """
    username_or_email: str = Field(
        ...,
        min_length=3,
        max_length=100,
        examples=["mallesh_m"]
    )
    password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        examples=["StrongPass123"]
    )


class UserResponse(BaseModel):
    """
    Data returned to the frontend about a user.
    NOTE: Password is NEVER included in responses.
    """
    id: str
    full_name: str
    email: str
    mobile_number: str
    username: str
    is_active: bool = True
    created_at: Optional[str] = None


class TokenResponse(BaseModel):
    """
    Data returned after successful login or registration.
    Contains the JWT token and user profile.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserUpdate(BaseModel):
    """
    Data for updating user profile.
    All fields are optional — only send what you want to change.
    """
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[str] = Field(None, min_length=5, max_length=100)
    mobile_number: Optional[str] = Field(None, min_length=10, max_length=15)


# ══════════════════════════════════════════════
#  PATIENT & DOCUMENT SCHEMAS
# ══════════════════════════════════════════════

class DischargeSummary(BaseModel):
    """
    Represents a discharge summary document.
    Created after uploading and AI processing.
    """
    id: Optional[str] = None
    patient_id: str
    original_text: str
    simplified_text: Optional[str] = None
    medications: Optional[List[dict]] = None
    follow_ups: Optional[List[dict]] = None
    warning_signs: Optional[List[str]] = None
    created_at: Optional[str] = None


class Medication(BaseModel):
    """
    Individual medication extracted from discharge summary.
    """
    name: str
    dosage: str
    schedule: str                    # e.g., "Twice daily"
    purpose: Optional[str] = None    # e.g., "For blood pressure"
    warnings: Optional[str] = None   # e.g., "Take with food"


class FollowUp(BaseModel):
    """
    Follow-up appointment extracted from discharge summary.
    """
    type: str                        # e.g., "Cardiology checkup"
    doctor: Optional[str] = None
    when: str                        # e.g., "Within 2 weeks"
    location: Optional[str] = None
    notes: Optional[str] = None


# ══════════════════════════════════════════════
#  CHECK-IN SCHEMAS
# ══════════════════════════════════════════════

class CheckInCreate(BaseModel):
    """
    Data submitted during a daily patient check-in.
    Frontend sends this to POST /api/checkins/
    """
    symptoms: List[str] = Field(
        default=[],
        examples=[["Headache", "Fatigue", "Nausea"]]
    )
    mood: str = Field(
        ...,
        examples=["Good"]
    )
    notes: Optional[str] = Field(
        None,
        max_length=500,
        examples=["Feeling better today but still tired"]
    )


class CheckInResponse(BaseModel):
    """
    Check-in data returned from the API.
    """
    id: str
    patient_id: str
    symptoms: List[str]
    mood: str
    notes: Optional[str] = None
    created_at: Optional[str] = None


# ══════════════════════════════════════════════
#  ALERT SCHEMAS
# ══════════════════════════════════════════════

class Alert(BaseModel):
    """
    Alert generated by AI after analyzing check-in symptoms.
    Severity levels: low, medium, high, critical
    """
    id: Optional[str] = None
    patient_id: str
    severity: str                    # low | medium | high | critical
    message: str
    recommendation: Optional[str] = None
    triggered_at: Optional[str] = None


# ══════════════════════════════════════════════
#  COMMON SCHEMAS
# ══════════════════════════════════════════════

class MessageResponse(BaseModel):
    """
    Simple message response for success/error messages.
    Used across multiple endpoints.
    """
    message: str
    status: str = "success"          # success | error