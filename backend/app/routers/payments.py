from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.payment import Payment, MilestoneStatus
from app.schemas.payment import PaymentUpdate, PaymentResponse

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.put("/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, data: PaymentUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment.status = data.status
    payment.amount = data.amount

    # auto set paid_at when marked DONE
    if data.status == MilestoneStatus.DONE:
        payment.paid_at = data.paid_at or datetime.utcnow()
    else:
        payment.paid_at = None

    db.commit()
    db.refresh(payment)
    return payment