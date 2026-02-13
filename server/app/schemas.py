from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# Auth Schemas
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    success: bool
    token: str
    user: UserResponse


class AuthResponse(BaseModel):
    success: bool
    error: Optional[str] = None
    token: Optional[str] = None
    user: Optional[UserResponse] = None


# Profile Schemas
class ProfileUpdate(BaseModel):
    allergies: Optional[List[str]] = None
    goals: Optional[str] = None
    dietary_restrictions: Optional[List[str]] = Field(None, alias="dietaryRestrictions")
    
    class Config:
        populate_by_name = True  # Allow both field name and alias


class ProfileResponse(BaseModel):
    allergies: List[str]
    goals: Optional[str]
    dietary_restrictions: List[str]

    class Config:
        from_attributes = True


class ProfileUpdateResponse(BaseModel):
    success: bool
    profile: ProfileResponse
