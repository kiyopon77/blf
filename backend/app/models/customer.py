from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=True)  # was nullable=False
    pan = Column(String(20), unique=True, nullable=True)  # was nullable=False
    phone = Column(String(20))
    email = Column(String(100))
    address = Column(Text)
    kyc_status = Column(String(20), default="PENDING")
    created_at = Column(TIMESTAMP, server_default=func.now())

    sales = relationship("Sale", back_populates="customer")