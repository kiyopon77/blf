from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class RelationshipManager(Base):
    __tablename__ = "relationship_managers"

    rm_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=True)   # was nullable=False
    email = Column(String(100), unique=True, nullable=True)  # was nullable=False
    phone = Column(String(20))
    created_at = Column(TIMESTAMP, server_default=func.now())

    brokers = relationship("Broker", back_populates="rm")