from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.plot import Plot
from app.models.floor import Floor
from app.schemas.plot import PlotCreate, PlotUpdate, PlotResponse, PlotMatrixResponse, FloorMatrixItem
from app.schemas.floor import FloorResponse
from typing import List

router = APIRouter(prefix="/plots", tags=["Plots"])


# ── Matrix (must be before /{plot_id}) ─────────────────
@router.get("/matrix", response_model=list[PlotMatrixResponse])
def get_plots_matrix(db: Session = Depends(get_db), user=Depends(get_current_user)):
    plots = db.query(Plot).all()
    result = []
    for plot in plots:
        floors = db.query(Floor).filter(Floor.plot_id == plot.plot_id).order_by(Floor.floor_no).all()
        result.append(PlotMatrixResponse(
            plot_id=plot.plot_id,
            plot_code=plot.plot_code,
            floors=[
                FloorMatrixItem(
                    floor_no=floor.floor_no,
                    floor_id=floor.floor_id,
                    status=floor.status,
                    active_sale_id=floor.active_sale_id
                ) for floor in floors
            ]
        ))
    return result


# ── List all plots ──────────────────────────────────────
@router.get("", response_model=List[PlotResponse])
def get_plots(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Plot).all()


# ── Single plot ─────────────────────────────────────────
@router.get("/{plot_id}", response_model=PlotResponse)
def get_plot(plot_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return plot


# ── Floors of a plot ────────────────────────────────────
@router.get("/{plot_id}/floors", response_model=List[FloorResponse])
def get_plot_floors(plot_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return db.query(Floor).filter(Floor.plot_id == plot_id).all()


# ── Create ──────────────────────────────────────────────
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


# ── Update ──────────────────────────────────────────────
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


# ── Delete ──────────────────────────────────────────────
@router.delete("/{plot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plot(plot_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    db.delete(plot)
    db.commit()