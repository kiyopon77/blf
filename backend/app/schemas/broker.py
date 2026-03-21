from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BrokerBase(BaseModel):
    broker_name: Optional[str] = None
    phone: Optional[str] = None
    user_id: int

class BrokerCreate(BrokerBase):
    pass

class BrokerUpdate(BaseModel):
    broker_name: Optional[str] = None
    phone: Optional[str] = None
    user_id: Optional[int] = None

class BrokerResponse(BrokerBase):
    broker_id: int
    created_at: datetime

    class Config:
        from_attributes = True