from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime
from typing import Optional

class UserRole(str, Enum):
    admin = "admin"
    user = "user"

# Login request
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Token response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole

# User creation (admin creates users)
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.user

# User response (never expose password)
class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True