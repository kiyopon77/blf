from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, get_effective_society_id, ensure_society_access
from app.models.plot import Plot
from app.models.floor import Floor
from app.models.sale import Sale
from app.models.broker import Broker
from app.models.user import User
from app.models.floor_log import FloorStatusLog
from app.schemas.plot import PlotCreate, PlotUpdate, PlotResponse, PlotMatrixResponse, FloorMatrixItem
from app.schemas.floor import FloorResponse
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/plots", tags=["Plots"])  # ← this must be before any @router.get


@router.get("/matrix", response_model=list[PlotMatrixResponse])
def get_plots_matrix(
    society_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    scoped_society_id = get_effective_society_id(user, society_id)
    plots_query = db.query(Plot)
    if scoped_society_id is not None:
        plots_query = plots_query.filter(Plot.society_id == scoped_society_id)

    plots = plots_query.all()
    result = []

    for plot in plots:
        floors = db.query(Floor).filter(
            Floor.plot_id == plot.plot_id
        ).order_by(Floor.floor_no).all()

        floor_items = []
        for floor in floors:
            sale_status = None
            broker_name = None
            
            last_changed_by = None
            last_changed_at = None

            if floor.active_sale_id:
                sale = db.query(Sale).filter(Sale.sale_id == floor.active_sale_id).first()
                if sale:
                    sale_status = sale.status
                    broker = db.query(Broker).filter(Broker.broker_id == sale.broker_id).first()
                    if broker:
                        broker_name = broker.broker_name
                        

            last_log = db.query(FloorStatusLog).filter(
                FloorStatusLog.floor_id == floor.floor_id
            ).order_by(FloorStatusLog.changed_at.desc()).first()

            if last_log:
                last_changed_at = last_log.changed_at
                user_obj = db.query(User).filter(User.user_id == last_log.changed_by).first()
                if user_obj:
                    last_changed_by = user_obj.full_name

            floor_items.append(FloorMatrixItem(
                floor_id=floor.floor_id,
                floor_no=floor.floor_no,
                status=floor.status,
                active_sale_id=floor.active_sale_id,
                sale_status=sale_status,
                broker_name=broker_name,
                last_changed_by=last_changed_by,
                last_changed_at=last_changed_at
            ))

        result.append(PlotMatrixResponse(
            plot_id=plot.plot_id,
            plot_code=plot.plot_code,
            area_sqyd=float(plot.area_sqyd) if plot.area_sqyd else None,
            area_sqft=float(plot.area_sqft) if plot.area_sqft else None,
            type=plot.type,
            floors=floor_items
        ))

    return result


@router.get("", response_model=List[PlotResponse])
def get_plots(
    society_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    scoped_society_id = get_effective_society_id(user, society_id)
    query = db.query(Plot)
    if scoped_society_id is not None:
        query = query.filter(Plot.society_id == scoped_society_id)
    return query.all()


@router.get("/{plot_id}", response_model=PlotResponse)
def get_plot(plot_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    ensure_society_access(user, plot.society_id)
    return plot


@router.get("/{plot_id}/floors", response_model=List[FloorResponse])
def get_plot_floors(plot_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plot = db.query(Plot).filter(Plot.plot_id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    ensure_society_access(user, plot.society_id)
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