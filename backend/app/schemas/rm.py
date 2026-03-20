from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class RMBase(BaseModel):
    name: Optional[str] = None      # was str
    email: Optional[EmailStr] = None 
    phone: Optional[str] = None

class RMCreate(RMBase):
    pass

class RMUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class RMResponse(RMBase):
    rm_id: int
    created_at: datetime

    class Config:
        from_attributes = True