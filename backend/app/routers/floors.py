from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, get_effective_society_id, ensure_society_access
from app.models.floor import Floor
from app.models.plot import Plot
from app.models.sale import Sale
from app.models.floor_log import FloorStatusLog
from app.models.user import User
from app.schemas.floor import FloorCreate, FloorStatusUpdate, FloorResponse, FloorUpdate
from app.schemas.floor_log import FloorLogResponse
from typing import List, Optional

router = APIRouter(prefix="/floors", tags=["Floors"])


@router.get("", response_model=List[FloorResponse])
def get_floors(
    society_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    scoped_society_id = get_effective_society_id(user, society_id)
    query = db.query(Floor)
    if scoped_society_id is not None:
        query = query.join(Plot, Floor.plot_id == Plot.plot_id).filter(Plot.society_id == scoped_society_id)
    return query.all()


@router.get("/{floor_id}", response_model=FloorResponse)
def get_floor(floor_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    floor = db.query(Floor).filter(Floor.floor_id == floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    ensure_society_access(user, floor.plot.society_id)
    return floor


@router.post("", response_model=FloorResponse, status_code=status.HTTP_201_CREATED)
def create_floor(data: FloorCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    floor = Floor(**data.model_dump())
    db.add(floor)
    db.commit()
    db.refresh(floor)
    return floor


@router.put("/{floor_id}", response_model=FloorResponse)
def update_floor(
    floor_id: int,
    data: FloorUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    floor = db.query(Floor).filter(Floor.floor_id == floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")

    for key, value in data.model_dump(exclude_none=True).items():
        setattr(floor, key, value)

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
    ensure_society_access(current_user, floor.plot.society_id)

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
    ensure_society_access(user, floor.plot.society_id)

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


@router.delete("/{floor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_floor(
    floor_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    floor = db.query(Floor).filter(Floor.floor_id == floor_id).first()
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")

    if floor.active_sale_id is not None:
        raise HTTPException(status_code=400, detail="Cannot delete floor with an active sale")

    has_sale_history = db.query(Sale).filter(Sale.floor_id == floor_id).first()
    if has_sale_history:
        raise HTTPException(status_code=400, detail="Cannot delete floor with existing sale history")

    db.delete(floor)
    db.commit()