# backend/app/config.py
# ──────────────────────────────────────────────
# CareBridge — Central Configuration File
# ──────────────────────────────────────────────
# This file loads all environment variables from .env
# and makes them available across the entire backend.
# Every other file imports settings from here.
# ──────────────────────────────────────────────

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    All environment variables are defined here.
    Pydantic automatically reads them from the .env file.
    If a variable is missing in .env, it uses the default value.
    """

    # ──────────── App Settings ────────────
    APP_NAME: str = "CareBridge"
    APP_ENV: str = "development"              # development | production
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173"  # Frontend URL

    # ──────────── JWT Authentication ────────────
    JWT_SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # ──────────── Google Gemini AI ────────────
    GEMINI_API_KEY: str = ""

    # ──────────── Firebase / Firestore ────────────
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_CREDENTIALS_PATH: str = "./firebase-service-account.json"

    # ──────────── Google Cloud Storage ────────────
    GCS_BUCKET_NAME: str = "carebridge-uploads"

    # ──────────── Google Calendar API ────────────
    GOOGLE_CALENDAR_CREDENTIALS_PATH: str = "./google-calendar-credentials.json"

    class Config:
        # This tells Pydantic to read from .env file
        env_file = ".env"
        # This makes variable names case-insensitive
        env_file_encoding = "utf-8"


# ──────────────────────────────────────────────
# Create a single instance that all files import
# Usage in other files:
#   from app.config import settings
#   print(settings.JWT_SECRET_KEY)
# ──────────────────────────────────────────────
settings = Settings()