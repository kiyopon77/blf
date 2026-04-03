from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    society_id = Column(Integer, ForeignKey("society.society_id"), nullable=False)
    full_name = Column(String(100), nullable=True)
    pan = Column(String(20), unique=True, nullable=True)
    phone = Column(String(20))
    email = Column(String(100))
    address = Column(Text)
    kyc_status = Column(String(20), default="PENDING")
    created_at = Column(TIMESTAMP, server_default=func.now())

    society = relationship("Society", back_populates="customers")
    sales = relationship("Sale", back_populates="customer")