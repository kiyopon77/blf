from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse, CustomerPanUpdate
from typing import List

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=List[CustomerResponse])
def get_customers(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Customer).all()


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(data: CustomerCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    existing = db.query(Customer).filter(Customer.pan == data.pan).first()
    if existing:
        raise HTTPException(status_code=400, detail="PAN already exists")
    customer = Customer(**data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: int, data: CustomerUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(customer, key, value)
    db.commit()
    db.refresh(customer)
    return customer

@router.patch("/{customer_id}/pan", response_model=CustomerResponse)
def update_customer_pan(
    customer_id: int,
    data: CustomerPanUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    existing = db.query(Customer).filter(
        Customer.pan == data.pan,
        Customer.customer_id != customer_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="PAN already exists")

    customer.pan = data.pan
    db.commit()
    db.refresh(customer)
    return customer