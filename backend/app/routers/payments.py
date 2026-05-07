from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user, ensure_society_access
from app.models.payment import Payment, MilestoneStatus
from app.schemas.payment import PaymentUpdate, PaymentResponse

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.put("/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, data: PaymentUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):

    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    ensure_society_access(user, payment.sale.floor.plot.society_id)

    if data.total_amount is not None:
        payment.total_amount = data.total_amount

    if data.paid_amount is not None:
        payment.paid_amount = data.paid_amount

    if data.due_date is not None:
        payment.due_date = data.due_date

    if data.mratio is not None:
        payment.mratio = data.mratio

    
    if payment.total_amount and payment.paid_amount:
        if payment.paid_amount >= payment.total_amount:
            payment.status = MilestoneStatus.DONE
            payment.paid_at = data.paid_at or datetime.utcnow()
        else:
            payment.status = MilestoneStatus.PENDING
            payment.paid_at = None
    else:
        # fallback manual override when status is provided
        if data.status is not None:
            payment.status = data.status
            if data.status == MilestoneStatus.DONE:
                payment.paid_at = data.paid_at or datetime.utcnow()
            else:
                payment.paid_at = None

    db.commit()
    db.refresh(payment)
    return payment