from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.rm import RelationshipManager
from app.schemas.rm import RMCreate, RMUpdate, RMResponse
from typing import List

router = APIRouter(prefix="/rms", tags=["Relationship Managers"])


@router.get("", response_model=List[RMResponse])
def get_rms(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(RelationshipManager).all()


@router.get("/{rm_id}", response_model=RMResponse)
def get_rm(rm_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    rm = db.query(RelationshipManager).filter(RelationshipManager.rm_id == rm_id).first()
    if not rm:
        raise HTTPException(status_code=404, detail="RM not found")
    return rm


@router.post("", response_model=RMResponse, status_code=status.HTTP_201_CREATED)
def create_rm(data: RMCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    existing = db.query(RelationshipManager).filter(RelationshipManager.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    rm = RelationshipManager(**data.model_dump())
    db.add(rm)
    db.commit()
    db.refresh(rm)
    return rm


@router.put("/{rm_id}", response_model=RMResponse)
def update_rm(rm_id: int, data: RMUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    rm = db.query(RelationshipManager).filter(RelationshipManager.rm_id == rm_id).first()
    if not rm:
        raise HTTPException(status_code=404, detail="RM not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(rm, key, value)
    db.commit()
    db.refresh(rm)
    return rm


@router.delete("/{rm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rm(rm_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    rm = db.query(RelationshipManager).filter(RelationshipManager.rm_id == rm_id).first()
    if not rm:
        raise HTTPException(status_code=404, detail="RM not found")
    db.delete(rm)
    db.commit()