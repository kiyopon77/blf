from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.floor import Floor
from app.schemas.floor import FloorCreate, FloorStatusUpdate, FloorResponse
from typing import List

router = APIRouter(prefix="/floors", tags=["Floors"])


@router.get("", response_model=List[FloorResponse])
def get_floors(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Floor).all()


@router.get("/{floor_id}", response_model=FloorResponse)
def get_floor(floor_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    floor = db.query(Floor).filter(Floor.floor_id == floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    return floor


@router.post("", response_model=FloorResponse, status_code=status.HTTP_201_CREATED)
def create_floor(data: FloorCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    floor = Floor(**data.model_dump())
    db.add(floor)
    db.commit()
    db.refresh(floor)
    return floor


@router.put("/{floor_id}/status", response_model=FloorResponse)
def update_floor_status(floor_id: int, data: FloorStatusUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    floor = db.query(Floor).filter(Floor.floor_id == floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    floor.status = data.status
    db.commit()
    db.refresh(floor)
    return floor