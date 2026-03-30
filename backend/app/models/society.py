from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Society(Base):
    __tablename__ = "society"

    society_id = Column(Integer, primary_key=True, index=True)
    society_name = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    users = relationship("User", back_populates="society")
    brokers = relationship("Broker", back_populates="society")
    plots = relationship("Plot", back_populates="society", cascade="all, delete")
    customers = relationship("Customer", back_populates="society")