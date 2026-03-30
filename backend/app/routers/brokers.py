from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, get_effective_society_id, ensure_society_access
from app.models.broker import Broker
from app.schemas.broker import BrokerCreate, BrokerUpdate, BrokerResponse
from typing import List, Optional

router = APIRouter(prefix="/brokers", tags=["Brokers"])


@router.get("", response_model=List[BrokerResponse])
def get_brokers(
    society_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    scoped_society_id = get_effective_society_id(user, society_id)
    query = db.query(Broker)
    if scoped_society_id is not None:
        query = query.filter(Broker.society_id == scoped_society_id)
    return query.all()


@router.get("/{broker_id}", response_model=BrokerResponse)
def get_broker(broker_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    broker = db.query(Broker).filter(Broker.broker_id == broker_id).first()
    if not broker:
        raise HTTPException(status_code=404, detail="Broker not found")
    ensure_society_access(user, broker.society_id)
    return broker


@router.post("", response_model=BrokerResponse, status_code=status.HTTP_201_CREATED)
def create_broker(data: BrokerCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    broker = Broker(**data.model_dump())
    db.add(broker)
    db.commit()
    db.refresh(broker)
    return broker


@router.put("/{broker_id}", response_model=BrokerResponse)
def update_broker(broker_id: int, data: BrokerUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    broker = db.query(Broker).filter(Broker.broker_id == broker_id).first()
    if not broker:
        raise HTTPException(status_code=404, detail="Broker not found")

    update_data = data.model_dump(exclude_none=True)

    # prevent user_id being set to null
    if "user_id" in update_data and update_data["user_id"] is None:
        raise HTTPException(status_code=400, detail="user_id cannot be null")

    for key, value in update_data.items():
        setattr(broker, key, value)
    db.commit()
    db.refresh(broker)
    return broker


@router.delete("/{broker_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_broker(broker_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    broker = db.query(Broker).filter(Broker.broker_id == broker_id).first()
    if not broker:
        raise HTTPException(status_code=404, detail="Broker not found")
    db.delete(broker)
    db.commit()