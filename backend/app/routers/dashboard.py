from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.plot import Plot
from app.models.floor import Floor, InventoryStatus
from app.schemas.dashboard import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    total_plots = db.query(Plot).count()
    total_floors = db.query(Floor).count()
    available = db.query(Floor).filter(Floor.status == InventoryStatus.AVAILABLE).count()
    hold = db.query(Floor).filter(Floor.status == InventoryStatus.HOLD).count()
    sold = db.query(Floor).filter(Floor.status == InventoryStatus.SOLD).count()
    cancelled = db.query(Floor).filter(Floor.status == InventoryStatus.CANCELLED).count()
    investor_unit = db.query(Floor).filter(Floor.status == InventoryStatus.INVESTOR_UNIT).count()

    return DashboardResponse(
        total_plots=total_plots,
        total_floors=total_floors,
        available=available,
        hold=hold,
        sold=sold,
        cancelled=cancelled,
        investor_unit=investor_unit
    )