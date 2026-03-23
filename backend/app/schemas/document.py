from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.document import EntityType

class DocumentResponse(BaseModel):
    document_id: int
    label: str
    file_name: str
    file_type: str
    entity: EntityType
    sale_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True