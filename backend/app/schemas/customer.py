from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CustomerBase(BaseModel):
    society_id: int
    full_name: Optional[str] = None
    pan: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    kyc_status: Optional[str] = None

class CustomerResponse(CustomerBase):
    customer_id: int
    kyc_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class CustomerPanUpdate(BaseModel):
    pan: str