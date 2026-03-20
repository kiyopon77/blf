from pydantic import BaseModel, model_validator
from datetime import datetime
from typing import Optional

# conversion constants
SQYD_TO_SQFT = 9.0
SQFT_TO_SQYD = 1 / 9.0

class PlotBase(BaseModel):
    plot_code: str
    area_sqyd: Optional[float] = None
    area_sqft: Optional[float] = None

class PlotCreate(PlotBase):

    @model_validator(mode="after")
    def fill_missing_area(self):
        if self.area_sqyd and not self.area_sqft:
            self.area_sqft = round(self.area_sqyd * SQYD_TO_SQFT, 2)
        elif self.area_sqft and not self.area_sqyd:
            self.area_sqyd = round(self.area_sqft * SQFT_TO_SQYD, 2)
        elif not self.area_sqyd and not self.area_sqft:
            raise ValueError("Provide either area_sqyd or area_sqft")
        return self

class PlotUpdate(BaseModel):
    area_sqyd: Optional[float] = None
    area_sqft: Optional[float] = None

    @model_validator(mode="after")
    def fill_missing_area(self):
        if self.area_sqyd and not self.area_sqft:
            self.area_sqft = round(self.area_sqyd * SQYD_TO_SQFT, 2)
        elif self.area_sqft and not self.area_sqyd:
            self.area_sqyd = round(self.area_sqft * SQFT_TO_SQYD, 2)
        return self

class PlotResponse(BaseModel):
    plot_id: int
    plot_code: str
    area_sqyd: Optional[float] = None
    area_sqft: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FloorMatrixItem(BaseModel):
    floor_id: int
    floor_no: int
    status: str
    active_sale_id: Optional[int] = None

    class Config:
        from_attributes = True

class PlotMatrixResponse(BaseModel):
    plot_id: int
    plot_code: str
    area_sqyd: Optional[float] = None
    area_sqft: Optional[float] = None
    floors: list[FloorMatrixItem]

    class Config:
        from_attributes = True