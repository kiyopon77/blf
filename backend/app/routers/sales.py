from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, get_effective_society_id, ensure_society_access
from app.models.sale import Sale, SaleStatus
from app.models.floor import Floor, InventoryStatus
from app.models.plot import Plot
from app.models.payment import Payment, MilestoneType, MilestoneStatus
from app.models.broker import Broker
from app.models.customer import Customer
from app.schemas.sale import SaleCreate, SaleStatusUpdate, SaleResponse, SaleDetailResponse, SaleUpdate, FloorInfoResponse, FloorCodeSaleResponse
from app.schemas.payment import PaymentResponse
from typing import List, Optional

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.get("", response_model=List[SaleResponse])
def get_sales(
    society_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    scoped_society_id = get_effective_society_id(user, society_id)
    query = db.query(Sale)
    if scoped_society_id is not None:
        query = query.join(Floor, Sale.floor_id == Floor.floor_id).join(Plot, Floor.plot_id == Plot.plot_id).filter(
            Plot.society_id == scoped_society_id
        )
    return query.all()


@router.get("/floor-code-info", response_model=List[FloorCodeSaleResponse])
def get_floor_code_info_with_sales(
    society_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    scoped_society_id = get_effective_society_id(user, society_id)
    query = db.query(Sale, Floor, Plot).join(
        Floor, Sale.floor_id == Floor.floor_id
    ).join(
        Plot, Floor.plot_id == Plot.plot_id
    )

    if scoped_society_id is not None:
        query = query.filter(Plot.society_id == scoped_society_id)

    rows = query.order_by(Plot.plot_code.asc(), Floor.floor_no.asc()).all()

    return [
        FloorCodeSaleResponse(
            sale_id=sale.sale_id,
            floor_id=floor.floor_id,
            plot_id=plot.plot_id,
            society_id=plot.society_id,
            plot_code=plot.plot_code,
            floor_no=floor.floor_no,
            floor_code=f"{plot.plot_code}-{floor.floor_no}",
            broker_id=sale.broker_id,
            customer_id=sale.customer_id,
            total_value=float(sale.total_value),
            commission_percent=float(sale.commission_percent) if sale.commission_percent is not None else None,
            status=sale.status,
            initiated_at=sale.initiated_at,
        )
        for sale, floor, plot in rows
    ]


@router.get("/{sale_id}", response_model=SaleDetailResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    ensure_society_access(user, sale.floor.plot.society_id)
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
        plot_code=sale.floor.plot.plot_code,
        floor=FloorInfoResponse(
            floor_id=sale.floor.floor_id,
            plot_id=sale.floor.plot_id,
            floor_no=sale.floor.floor_no,
            status=sale.floor.status.value,
            active_sale_id=sale.floor.active_sale_id
        )
    )


@router.post("", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(data: SaleCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # check floor is available
    floor = db.query(Floor).filter(Floor.floor_id == data.floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    ensure_society_access(user, floor.plot.society_id)
    if floor.status != InventoryStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail=f"Floor is not available — current status: {floor.status}")

    broker = db.query(Broker).filter(Broker.broker_id == data.broker_id).first()
    if not broker:
        raise HTTPException(status_code=404, detail="Broker not found")

    customer = db.query(Customer).filter(Customer.customer_id == data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    if broker.society_id != floor.plot.society_id or customer.society_id != floor.plot.society_id:
        raise HTTPException(status_code=400, detail="Broker/Customer must belong to the same society as floor")

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
    if floor and floor.active_sale_id == sale.sale_id:
        if data.status == SaleStatus.SOLD:
            floor.status = InventoryStatus.SOLD
            floor.active_sale_id = sale.sale_id
        elif data.status == SaleStatus.CANCELLED:
            # Keep sale record details unchanged, but release floor for a new sale.
            floor.status = InventoryStatus.AVAILABLE
            floor.active_sale_id = None
        elif data.status == SaleStatus.HOLD:
            floor.status = InventoryStatus.HOLD
            floor.active_sale_id = sale.sale_id
        elif data.status == SaleStatus.INVESTOR_UNIT:
            floor.status = InventoryStatus.INVESTOR_UNIT
            floor.active_sale_id = sale.sale_id

    db.commit()
    db.refresh(sale)
    return sale


@router.get("/{sale_id}/payments", response_model=List[PaymentResponse])
def get_sale_payments(sale_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    ensure_society_access(user, sale.floor.plot.society_id)
    return sale.payments



@router.put("/{sale_id}", response_model=SaleResponse)
def update_sale(sale_id: int, data: SaleUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(sale, key, value)
    db.commit()
    db.refresh(sale)
    return sale


@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sale(sale_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    floor = db.query(Floor).filter(Floor.floor_id == sale.floor_id).first()
    if floor and floor.active_sale_id == sale.sale_id:
        floor.status = InventoryStatus.AVAILABLE
        floor.active_sale_id = None

    db.delete(sale)
    db.commit()