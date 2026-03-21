from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FloorLogResponse(BaseModel):
    log_id: int
    floor_id: int
    changed_by: int
    changed_by_name: Optional[str] = None
    old_status: Optional[str] = None
    new_status: Optional[str] = None
    changed_at: datetime

    class Config:
        from_attributes = True