from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class BrokerBase(BaseModel):
    broker_name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    rm_id: int

class BrokerCreate(BrokerBase):
    pass

class BrokerUpdate(BaseModel):
    broker_name: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None

class BrokerResponse(BrokerBase):
    broker_id: int
    created_at: datetime

    class Config:
        from_attributes = True