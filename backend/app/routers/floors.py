from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.floor import Floor
from app.models.floor_log import FloorStatusLog
from app.models.user import User
from app.schemas.floor import FloorCreate, FloorStatusUpdate, FloorResponse
from app.schemas.floor_log import FloorLogResponse
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
def update_floor_status(
    floor_id: int,
    data: FloorStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    floor = db.query(Floor).filter(Floor.floor_id == floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")

    old_status = floor.status

    # log the change
    log = FloorStatusLog(
        floor_id=floor_id,
        changed_by=current_user.user_id,
        old_status=str(old_status.value) if old_status else None,
        new_status=str(data.status.value)
    )
    db.add(log)

    floor.status = data.status
    db.commit()
    db.refresh(floor)
    return floor


@router.get("/{floor_id}/logs", response_model=List[FloorLogResponse])
def get_floor_logs(
    floor_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    floor = db.query(Floor).filter(Floor.floor_id == floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")

    logs = db.query(FloorStatusLog).filter(
        FloorStatusLog.floor_id == floor_id
    ).order_by(FloorStatusLog.changed_at.desc()).all()

    result = []
    for log in logs:
        user_obj = db.query(User).filter(User.user_id == log.changed_by).first()
        result.append(FloorLogResponse(
            log_id=log.log_id,
            floor_id=log.floor_id,
            changed_by=log.changed_by,
            changed_by_name=user_obj.full_name if user_obj else None,
            old_status=log.old_status,
            new_status=log.new_status,
            changed_at=log.changed_at
        ))
    return result