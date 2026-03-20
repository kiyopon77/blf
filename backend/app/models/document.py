from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, index=True)
    label = Column(String(100), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    entity_type = Column(String(20), nullable=False)  # 'customer' or 'sale'
    entity_id = Column(Integer, nullable=False)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())