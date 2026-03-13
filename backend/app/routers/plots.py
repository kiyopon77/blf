from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.plot import Plot
from app.models.floor import Floor
from app.schemas.plot import PlotCreate, PlotUpdate, PlotResponse
from app.schemas.floor import FloorResponse
from typing import List

router = APIRouter(prefix="/plots", tags=["Plots"])


@router.get("", response_model=List[PlotResponse])
def get_plots(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Plot).all()


@router.get("/{plot_id}", response_model=PlotResponse)
def get_plot(plot_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return plot


@router.get("/{plot_id}/floors", response_model=List[FloorResponse])
def get_plot_floors(plot_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return db.query(Floor).filter(Floor.plot_id == plot_id).all()


@router.post("", response_model=PlotResponse, status_code=status.HTTP_201_CREATED)
def create_plot(data: PlotCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    existing = db.query(Plot).filter(Plot.plot_code == data.plot_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Plot code already exists")
    plot = Plot(**data.model_dump())
    db.add(plot)
    db.commit()
    db.refresh(plot)
    return plot


@router.put("/{plot_id}", response_model=PlotResponse)
def update_plot(plot_id: int, data: PlotUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(plot, key, value)
    db.commit()
    db.refresh(plot)
    return plot


@router.delete("/{plot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plot(plot_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    db.delete(plot)
    db.commit()