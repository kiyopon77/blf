from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from enum import Enum


class KYCStatus(str, Enum):
    PENDING = "PENDING"
    DONE = "DONE"


class BrokerBase(BaseModel):
    society_id: int
    broker_name: Optional[str] = None
    phone: Optional[str] = None

    # NEW
    company_name: Optional[str] = None
    email: Optional[EmailStr] = None
    kyc_status: Optional[KYCStatus] = KYCStatus.PENDING

    user_id: int


class BrokerCreate(BrokerBase):
    pass


class BrokerUpdate(BaseModel):
    broker_name: Optional[str] = None
    phone: Optional[str] = None

    # NEW
    company_name: Optional[str] = None
    email: Optional[EmailStr] = None
    kyc_status: Optional[KYCStatus] = None

    user_id: Optional[int] = None
    society_id: Optional[int] = None


class BrokerResponse(BrokerBase):
    broker_id: int
    created_at: datetime

    class Config:
        from_attributes = True