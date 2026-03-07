# backend/app/main.py
# ──────────────────────────────────────────────
# CareBridge — FastAPI Entry Point
# ──────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

load_dotenv()

# ══════════════════════════════════════════════
#  CREATE THE FASTAPI APP
# ══════════════════════════════════════════════

app = FastAPI(
    title="CareBridge API",
    description="AI-Powered Patient Discharge Summary Simplifier.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ══════════════════════════════════════════════
#  CORS MIDDLEWARE
# ══════════════════════════════════════════════

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ══════════════════════════════════════════════
#  SERVE STATIC FILES (Audio)
# ══════════════════════════════════════════════

# Create audio directory if it doesn't exist
os.makedirs("audio", exist_ok=True)
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# ══════════════════════════════════════════════
#  REGISTER ROUTERS
# ══════════════════════════════════════════════

# Auth router (our JWT auth system)
from app.routers import auth
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Document & Chat routers (teammate's work)
# Wrapped in try/except so the app doesn't crash
# if teammate's dependencies aren't installed yet
try:
    from app.routers import documents
    app.include_router(documents.router, prefix="/api", tags=["Documents"])
    print("✅ Documents router loaded")
except ImportError as e:
    print(f"⚠️  Documents router skipped (missing dependency: {e})")

try:
    from app.routers import chat
    app.include_router(chat.router, prefix="/api", tags=["Chat"])
    print("✅ Chat router loaded")
except ImportError as e:
    print(f"⚠️  Chat router skipped (missing dependency: {e})")

# ══════════════════════════════════════════════
#  ROOT ENDPOINTS
# ══════════════════════════════════════════════

@app.get("/", tags=["Health"])
def root():
    return {
        "message": "CareBridge API is running 🏥",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}