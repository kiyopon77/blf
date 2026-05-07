from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.payment import MilestoneType, MilestoneStatus, MilestoneRatio


class PaymentUpdate(BaseModel):
    paid_amount: Optional[float] = None
    total_amount: Optional[float] = None
    mratio: Optional[MilestoneRatio] = None
    status: Optional[MilestoneStatus] = None
    paid_at: Optional[datetime] = None
    due_date: Optional[datetime] = None


class PaymentResponse(BaseModel):
    payment_id: int
    sale_id: int
    milestone: MilestoneType

    total_amount: Optional[float] = None
    paid_amount: Optional[float] = None
    mratio: Optional[MilestoneRatio] = None

    status: MilestoneStatus
    paid_at: Optional[datetime] = None
    due_date: Optional[datetime] = None

    class Config:
        from_attributes = True