from sqlalchemy import Column, Integer, String, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class EntityType(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    SALE = "SALE"

class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, index=True)
    label = Column(String(100), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    entity = Column(Enum(EntityType, name="entity_type"), default=EntityType.CUSTOMER)
    sale_id = Column(Integer, ForeignKey("sales.sale_id"), nullable=False)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())

    sale = relationship("Sale")