from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.society import Society
from app.schemas.society import SocietyCreate, SocietyUpdate, SocietyResponse
from typing import List

router = APIRouter(prefix="/societies", tags=["Societies"])


@router.get("", response_model=List[SocietyResponse])
def get_societies(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Society).all()


@router.get("/{society_id}", response_model=SocietyResponse)
def get_society(society_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    society = db.query(Society).filter(Society.society_id == society_id).first()
    if not society:
        raise HTTPException(status_code=404, detail="Society not found")
    return society


@router.post("", response_model=SocietyResponse, status_code=status.HTTP_201_CREATED)
def create_society(data: SocietyCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    society = Society(**data.model_dump())
    db.add(society)
    db.commit()
    db.refresh(society)
    return society


@router.put("/{society_id}", response_model=SocietyResponse)
def update_society(society_id: int, data: SocietyUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    society = db.query(Society).filter(Society.society_id == society_id).first()
    if not society:
        raise HTTPException(status_code=404, detail="Society not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(society, key, value)
    db.commit()
    db.refresh(society)
    return society


@router.delete("/{society_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_society(society_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    society = db.query(Society).filter(Society.society_id == society_id).first()
    if not society:
        raise HTTPException(status_code=404, detail="Society not found")
    db.delete(society)
    db.commit()