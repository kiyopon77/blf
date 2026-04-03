from pydantic import BaseModel
from typing import Optional
from app.models.floor import InventoryStatus

class FloorBase(BaseModel):
    plot_id: int
    floor_no: int
    floor_value: Optional[float] = None

class FloorCreate(FloorBase):
    pass


class FloorUpdate(BaseModel):
    floor_no: Optional[int] = None
    floor_value: Optional[float] = None

class FloorStatusUpdate(BaseModel):
    status: InventoryStatus

class FloorResponse(BaseModel):
    floor_id: int
    plot_id: int
    floor_no: int
    floor_value: Optional[float] = None
    status: InventoryStatus
    active_sale_id: Optional[int] = None

    class Config:
        from_attributes = True