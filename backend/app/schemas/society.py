from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SocietyCreate(BaseModel):
    society_name: Optional[str] = None
    address: Optional[str] = None

class SocietyUpdate(BaseModel):
    society_name: Optional[str] = None
    address: Optional[str] = None

class SocietyResponse(BaseModel):
    society_id: int
    society_name: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True