
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.sale import SaleStatus

class SaleCreate(BaseModel):
    floor_id: int
    broker_id: int
    customer_id: int
    total_value: float
    commission_percent: Optional[float] = None

class SaleStatusUpdate(BaseModel):
    status: SaleStatus

class SaleResponse(BaseModel):
    sale_id: int
    floor_id: int
    broker_id: int
    customer_id: int
    total_value: float
    commission_percent: Optional[float] = None
    status: SaleStatus
    initiated_at: datetime

    class Config:
        from_attributes = True

class SaleDetailResponse(BaseModel):
    sale_id: int
    total_value: float
    commission_percent: Optional[float] = None
    status: SaleStatus
    initiated_at: datetime

    # nested
    broker_name: str
    customer_name: str
    customer_kyc_status: str
    floor_no: int
    plot_code: str

    class Config:
        from_attributes = True
        
class SaleUpdate(BaseModel):
    total_value: Optional[float] = None
    initiated_at: Optional[datetime] = None
    commission_percent: Optional[float] = None