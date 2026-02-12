from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserSignup, UserLogin, TokenResponse, AuthResponse
from app.auth import verify_password, get_password_hash, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """Create a new user account"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Validate password length
    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
    # Create new user
    password_hash = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=password_hash,
        name=user_data.name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    token = create_access_token(data={"user_id": new_user.id})
    
    return TokenResponse(
        success=True,
        token=token,
        user=new_user
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    # Find user
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Generate token
    token = create_access_token(data={"user_id": user.id})
    
    return TokenResponse(
        success=True,
        token=token,
        user=user
    )


@router.get("/verify", response_model=AuthResponse)
async def verify_token(current_user: User = Depends(get_current_user)):
    """Verify JWT token and return user info"""
    from app.schemas import UserResponse
    return AuthResponse(
        success=True,
        user=UserResponse(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            created_at=current_user.created_at
        )
    )
