from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, get_effective_society_id, ensure_society_access
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse, CustomerPanUpdate
from typing import List, Optional


router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=List[CustomerResponse])
def get_customers(
    society_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    scoped_society_id = get_effective_society_id(user, society_id)
    query = db.query(Customer)
    if scoped_society_id is not None:
        query = query.filter(Customer.society_id == scoped_society_id)
    return query.all()


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    ensure_society_access(user, customer.society_id)
    return customer


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(data: CustomerCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    data_dict = data.model_dump()
    data_dict["society_id"] = get_effective_society_id(user, data.society_id)

    existing = db.query(Customer).filter(Customer.pan == data.pan).first()
    if existing:
        raise HTTPException(status_code=400, detail="PAN already exists")
    customer = Customer(**data_dict)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: int, data: CustomerUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    ensure_society_access(user, customer.society_id)
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

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()