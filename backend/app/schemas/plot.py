from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PlotBase(BaseModel):
    plot_code: str
    length: float
    breadth: float

class PlotCreate(PlotBase):
    pass

class PlotUpdate(BaseModel):
    length: Optional[float] = None
    breadth: Optional[float] = None

class PlotResponse(PlotBase):
    plot_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class FloorMatrixItem(BaseModel):
    floor_no: int
    status: str
    floor_id: int
    active_sale_id: Optional[int] = None

    class Config:
        from_attributes = True

class PlotMatrixResponse(BaseModel):
    plot_id: int
    plot_code: str
    floors: list[FloorMatrixItem]

    class Config:
        from_attributes = True