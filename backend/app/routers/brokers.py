from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.broker import Broker
from app.schemas.broker import BrokerCreate, BrokerUpdate, BrokerResponse
from typing import List

router = APIRouter(prefix="/brokers", tags=["Brokers"])


@router.get("", response_model=List[BrokerResponse])
def get_brokers(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Broker).all()


@router.get("/{broker_id}", response_model=BrokerResponse)
def get_broker(broker_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    broker = db.query(Broker).filter(Broker.broker_id == broker_id).first()
    if not broker:
        raise HTTPException(status_code=404, detail="Broker not found")
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
    for key, value in data.model_dump(exclude_none=True).items():
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