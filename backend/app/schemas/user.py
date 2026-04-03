from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime
from typing import Optional

class UserRole(str, Enum):
    admin = "admin"
    rm = "rm"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.rm
    society_id: Optional[int] = None    # ← added

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    society_id: Optional[int] = None

class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    role: UserRole
    is_active: bool
    society_id: Optional[int] = None    # ← added
    created_at: datetime

    class Config:
        from_attributes = True