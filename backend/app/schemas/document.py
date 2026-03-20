from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentResponse(BaseModel):
    document_id: int
    label: str
    file_name: str
    file_type: str
    entity_type: str
    entity_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True