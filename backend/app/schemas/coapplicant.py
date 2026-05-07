from pydantic import BaseModel
from typing import Optional
from app.models.coapplicant import KYCStatus


class CoApplicantBase(BaseModel):
    customer_id: int
    full_name: str
    pan: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class CoApplicantCreate(CoApplicantBase):
    pass


class CoApplicantUpdate(BaseModel):
    full_name: Optional[str] = None
    pan: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    kyc_status: Optional[KYCStatus] = None


class CoApplicantResponse(BaseModel):
    coapplicant_id: int
    customer_id: int
    full_name: str
    pan: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    kyc_status: KYCStatus

    class Config:
        from_attributes = True