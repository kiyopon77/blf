
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.sale import SaleStatus
from app.models.payment import MilestoneType, MilestoneStatus, MilestoneRatio
from app.schemas.payment import PaymentResponse

class SalePaymentInput(BaseModel):
    milestone: MilestoneType
    total_amount: Optional[float] = None
    paid_amount: Optional[float] = None
    mratio: Optional[MilestoneRatio] = None
    status: Optional[MilestoneStatus] = None
    paid_at: Optional[datetime] = None
    due_date: Optional[datetime] = None


class SaleCreate(BaseModel):
    floor_id: int
    broker_id: int
    customer_id: int
    total_value: float
    commission_amount: Optional[float] = None
    payments: Optional[list[SalePaymentInput]] = None

class SaleStatusUpdate(BaseModel):
    status: SaleStatus

class SaleResponse(BaseModel):
    sale_id: int
    floor_id: int
    broker_id: int
    customer_id: int
    total_value: float
    commission_amount: Optional[float] = None
    status: SaleStatus
    initiated_at: datetime

    class Config:
        from_attributes = True


class FloorInfoResponse(BaseModel):
    floor_id: int
    plot_id: int
    floor_no: int
    status: str
    active_sale_id: Optional[int] = None

class SaleDetailResponse(BaseModel):
    sale_id: int
    total_value: float
    commission_amount: Optional[float] = None
    status: SaleStatus
    initiated_at: datetime

    # nested
    broker_name: str
    customer_name: str
    customer_kyc_status: str
    floor_no: int
    plot_code: str
    floor: FloorInfoResponse
    payments: list[PaymentResponse]
    total_paid_amount: float
    total_amount: float

    class Config:
        from_attributes = True


class FloorCodeSaleResponse(BaseModel):
    sale_id: int
    floor_id: int
    plot_id: int
    society_id: int
    plot_code: str
    floor_no: int
    floor_code: str
    broker_id: int
    customer_id: int
    total_value: float
    commission_amount: Optional[float] = None
    status: SaleStatus
    initiated_at: datetime
        
class SaleUpdate(BaseModel):
    total_value: Optional[float] = None
    initiated_at: Optional[datetime] = None
    commission_amount: Optional[float] = None