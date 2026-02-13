from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

# Use NullPool to avoid connection issues on startup
# This allows the app to start even if database is not available
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    poolclass=NullPool,  # Don't maintain a connection pool
    echo=settings.ENVIRONMENT == "development",
    connect_args={
        "connect_timeout": 5  # 5 second timeout
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
