from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserProfile
from app.schemas import ProfileUpdate, ProfileResponse, ProfileUpdateResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("/", response_model=ProfileUpdateResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile"""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        # Return default profile if none exists
        return ProfileUpdateResponse(
            success=True,
            profile=ProfileResponse(
                allergies=[],
                goals=None,
                dietary_restrictions=[]
            )
        )
    
    return ProfileUpdateResponse(
        success=True,
        profile=ProfileResponse(
            allergies=profile.allergies or [],
            goals=profile.goals,
            dietary_restrictions=profile.dietary_restrictions or []
        )
    )


@router.put("/", response_model=ProfileUpdateResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        # Create new profile
        profile = UserProfile(
            user_id=current_user.id,
            allergies=profile_data.allergies or [],
            goals=profile_data.goals,
            dietary_restrictions=profile_data.dietary_restrictions or []
        )
        db.add(profile)
    else:
        # Update existing profile
        if profile_data.allergies is not None:
            profile.allergies = profile_data.allergies
        if profile_data.goals is not None:
            profile.goals = profile_data.goals
        if profile_data.dietary_restrictions is not None:
            profile.dietary_restrictions = profile_data.dietary_restrictions
    
    db.commit()
    db.refresh(profile)
    
    return ProfileUpdateResponse(
        success=True,
        profile=ProfileResponse(
            allergies=profile.allergies or [],
            goals=profile.goals,
            dietary_restrictions=profile.dietary_restrictions or []
        )
    )
