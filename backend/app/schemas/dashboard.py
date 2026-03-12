from pydantic import BaseModel

class DashboardResponse(BaseModel):
    total_plots: int
    total_floors: int
    available: int
    hold: int
    sold: int
    cancelled: int