from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.sale import Sale, SaleStatus
from app.models.floor import Floor, InventoryStatus
from app.models.payment import Payment, MilestoneType, MilestoneStatus
from app.models.broker import Broker
from app.models.customer import Customer
from app.schemas.sale import SaleCreate, SaleStatusUpdate, SaleResponse, SaleDetailResponse
from app.schemas.payment import PaymentResponse
from typing import List

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.get("", response_model=List[SaleResponse])
def get_sales(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Sale).all()


@router.get("/{sale_id}", response_model=SaleDetailResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return SaleDetailResponse(
        sale_id=sale.sale_id,
        total_value=float(sale.total_value),
        commission_percent=float(sale.commission_percent) if sale.commission_percent else None,
        status=sale.status,
        initiated_at=sale.initiated_at,
        broker_name=sale.broker.broker_name,
        customer_name=sale.customer.full_name,
        customer_kyc_status=sale.customer.kyc_status,
        floor_no=sale.floor.floor_no,
        plot_code=sale.floor.plot.plot_code
    )


@router.post("", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(data: SaleCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # check floor is available
    floor = db.query(Floor).filter(Floor.floor_id == data.floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    if floor.status != InventoryStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail=f"Floor is not available — current status: {floor.status}")

    # create sale
    sale = Sale(**data.model_dump())
    db.add(sale)
    db.flush()  # get sale_id without committing

    # update floor status to HOLD
    floor.status = InventoryStatus.HOLD
    floor.active_sale_id = sale.sale_id

    # auto create all 6 milestone payment records
    for milestone in MilestoneType:
        payment = Payment(
            sale_id=sale.sale_id,
            milestone=milestone,
            status=MilestoneStatus.PENDING
        )
        db.add(payment)

    db.commit()
    db.refresh(sale)
    return sale


@router.put("/{sale_id}/status", response_model=SaleResponse)
def update_sale_status(sale_id: int, data: SaleStatusUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    sale.status = data.status

    # update floor status accordingly
    floor = db.query(Floor).filter(Floor.floor_id == sale.floor_id).first()
    if data.status == SaleStatus.SOLD:
        floor.status = InventoryStatus.SOLD
    elif data.status == SaleStatus.CANCELLED:
        floor.status = InventoryStatus.CANCELLED
        floor.active_sale_id = None

    db.commit()
    db.refresh(sale)
    return sale


@router.get("/{sale_id}/payments", response_model=List[PaymentResponse])
def get_sale_payments(sale_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale.payments