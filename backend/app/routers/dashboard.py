from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.plot import Plot
from app.models.floor import Floor, InventoryStatus
from app.models.society import Society
from app.schemas.dashboard import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _build_dashboard_response(db: Session, society_id: int | None = None) -> DashboardResponse:
    total_plots_query = db.query(Plot)
    floor_query = db.query(Floor)

    if society_id is not None:
        society = db.query(Society).filter(Society.society_id == society_id).first()
        if not society:
            raise HTTPException(status_code=404, detail="Society not found")

        total_plots_query = total_plots_query.filter(Plot.society_id == society_id)
        floor_query = floor_query.join(Plot, Floor.plot_id == Plot.plot_id).filter(Plot.society_id == society_id)

    total_plots = total_plots_query.count()
    total_floors = floor_query.count()
    available = floor_query.filter(Floor.status == InventoryStatus.AVAILABLE).count()
    hold = floor_query.filter(Floor.status == InventoryStatus.HOLD).count()
    sold = floor_query.filter(Floor.status == InventoryStatus.SOLD).count()
    cancelled = floor_query.filter(Floor.status == InventoryStatus.CANCELLED).count()
    investor_unit = floor_query.filter(Floor.status == InventoryStatus.INVESTOR_UNIT).count()

    return DashboardResponse(
        total_plots=total_plots,
        total_floors=total_floors,
        available=available,
        hold=hold,
        sold=sold,
        cancelled=cancelled,
        investor_unit=investor_unit,
    )


@router.get("", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return _build_dashboard_response(db)


@router.get("/{society_id}", response_model=DashboardResponse)
def get_dashboard_by_society(
    society_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return _build_dashboard_response(db, society_id=society_id)