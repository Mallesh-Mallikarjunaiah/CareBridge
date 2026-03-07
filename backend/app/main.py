# backend/app/main.py
# ──────────────────────────────────────────────
# CareBridge — FastAPI Entry Point
# ──────────────────────────────────────────────
# This is the MAIN file that starts the server.
# It connects all routers and configures the app.
#
# Run with:
#   uvicorn app.main:app --reload --port 8000
#
# Then open:
#   http://localhost:8000       → Welcome message
#   http://localhost:8000/docs  → Swagger API docs
# ──────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.config import settings

# Load environment variables from .env file
load_dotenv()


# ══════════════════════════════════════════════
#  CREATE THE FASTAPI APP
# ══════════════════════════════════════════════

app = FastAPI(
    title="CareBridge API",
    description=(
        "AI-Powered Patient Discharge Summary Simplifier. "
        "Bridging the gap between medical jargon and patient understanding."
    ),
    version="1.0.0",
    docs_url="/docs",        # Swagger UI at /docs
    redoc_url="/redoc"       # ReDoc at /redoc
)


# ══════════════════════════════════════════════
#  CORS MIDDLEWARE
# ══════════════════════════════════════════════
# CORS (Cross-Origin Resource Sharing) allows
# the frontend (localhost:5173) to talk to the
# backend (localhost:8000).
#
# Without this, the browser blocks all requests
# from frontend to backend for security reasons.
# ──────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",     # Vite React dev server
        "http://localhost:3000",     # Alternative React port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],             # Allow all HTTP methods
    allow_headers=["*"],             # Allow all headers (including Authorization)
)


# ══════════════════════════════════════════════
#  REGISTER ROUTERS
# ══════════════════════════════════════════════
# Each router handles a specific feature.
# prefix = URL path prefix for all endpoints in that router
# tags = grouping in Swagger docs
# ──────────────────────────────────────────────

from app.routers import auth

# Auth endpoints: /api/auth/register, /api/auth/login, etc.
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"]
)

# ──────────────────────────────────────────────
# FUTURE ROUTERS (uncomment when ready)
# ──────────────────────────────────────────────
# from app.routers import documents, checkins, alerts, calendar, cheatsheet
#
# app.include_router(
#     documents.router,
#     prefix="/api/documents",
#     tags=["Documents"]
# )
#
# app.include_router(
#     checkins.router,
#     prefix="/api/checkins",
#     tags=["Check-Ins"]
# )
#
# app.include_router(
#     alerts.router,
#     prefix="/api/alerts",
#     tags=["Alerts"]
# )
#
# app.include_router(
#     calendar.router,
#     prefix="/api/calendar",
#     tags=["Calendar"]
# )
#
# app.include_router(
#     cheatsheet.router,
#     prefix="/api/cheatsheet",
#     tags=["Cheat Sheet"]
# )


# ══════════════════════════════════════════════
#  ROOT ENDPOINTS
# ══════════════════════════════════════════════

@app.get("/", tags=["Health"])
def root():
    """Welcome endpoint — confirms the API is running"""
    return {
        "message": "Welcome to CareBridge API",
        "version": "1.0.0",
        "docs": "Visit /docs for API documentation",
        "status": "running"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV
    }