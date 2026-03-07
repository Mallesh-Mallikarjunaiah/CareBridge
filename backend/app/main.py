from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="CareBridge API",
    description="AI-Powered Patient Discharge Summary Simplifier.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

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

# Auth router (teammates)
from app.routers import auth
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Your routers
from app.routers import documents, chat
app.include_router(documents.router, prefix="/api", tags=["Documents"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

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