from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user, ensure_society_access
from app.models.coapplicant import CoApplicant
from app.models.customer import Customer
from app.schemas.coapplicant import (
    CoApplicantCreate,
    CoApplicantUpdate,
    CoApplicantResponse
)

router = APIRouter(prefix="/coapplicants", tags=["Co-Applicants"])


#  Create Co-Applicant
@router.post("", response_model=CoApplicantResponse, status_code=status.HTTP_201_CREATED)
def create_coapplicant(
    data: CoApplicantCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    customer = db.query(Customer).filter(Customer.customer_id == data.customer_id).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # 🔐 society check
    ensure_society_access(user, customer.society_id)

    coapp = CoApplicant(**data.model_dump())

    db.add(coapp)
    db.commit()
    db.refresh(coapp)

    return coapp


#  Get All Co-Applicants (by customer)
@router.get("/customer/{customer_id}", response_model=List[CoApplicantResponse])
def get_coapplicants_by_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    ensure_society_access(user, customer.society_id)

    return db.query(CoApplicant).filter(CoApplicant.customer_id == customer_id).all()


#  Get Single
@router.get("/{coapplicant_id}", response_model=CoApplicantResponse)
def get_coapplicant(
    coapplicant_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    coapp = db.query(CoApplicant).filter(CoApplicant.coapplicant_id == coapplicant_id).first()

    if not coapp:
        raise HTTPException(status_code=404, detail="Co-applicant not found")

    ensure_society_access(user, coapp.customer.society_id)

    return coapp


#  Update
@router.put("/{coapplicant_id}", response_model=CoApplicantResponse)
def update_coapplicant(
    coapplicant_id: int,
    data: CoApplicantUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    coapp = db.query(CoApplicant).filter(CoApplicant.coapplicant_id == coapplicant_id).first()

    if not coapp:
        raise HTTPException(status_code=404, detail="Co-applicant not found")

    ensure_society_access(user, coapp.customer.society_id)

    for key, value in data.model_dump(exclude_none=True).items():
        setattr(coapp, key, value)

    db.commit()
    db.refresh(coapp)

    return coapp


#  Delete
@router.delete("/{coapplicant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coapplicant(
    coapplicant_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    coapp = db.query(CoApplicant).filter(CoApplicant.coapplicant_id == coapplicant_id).first()

    if not coapp:
        raise HTTPException(status_code=404, detail="Co-applicant not found")

    ensure_society_access(user, coapp.customer.society_id)

    db.delete(coapp)
    db.commit()