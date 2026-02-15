from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, profile
from app.database import engine, Base


def create_tables():
    """Create database tables if they don't exist"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created/verified successfully")
    except Exception as e:
        print(f"⚠️  Warning: Could not create database tables: {e}")
        print("   Make sure PostgreSQL is running and database is configured correctly")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    create_tables()
    yield
    # Shutdown (if needed)
    pass


app = FastAPI(
    title="Aisle Scan API",
    description="Backend API for Aisle Scan mobile app",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(profile.router)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Try to connect to database
        with engine.connect() as conn:
            return {
                "status": "ok",
                "message": "Aisle Scan API is running",
                "database": "connected"
            }
        except Exception as e:
            return {
                "status": "ok",
                "message": "Aisle Scan API is running",
                "database": "disconnected",
                "error": str(e)
            }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
