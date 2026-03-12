from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.payment import MilestoneType, MilestoneStatus

class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    status: MilestoneStatus
    paid_at: Optional[datetime] = None

class PaymentResponse(BaseModel):
    payment_id: int
    sale_id: int
    milestone: MilestoneType
    amount: Optional[float] = None
    status: MilestoneStatus
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True