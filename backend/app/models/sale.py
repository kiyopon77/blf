from sqlalchemy import Column, Integer, Numeric, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class SaleStatus(str, enum.Enum):
    HOLD = "HOLD"
    SOLD = "SOLD"
    CANCELLED = "CANCELLED"
    INVESTOR_UNIT = "INVESTOR UNIT"  # ← add this

class Sale(Base):
    __tablename__ = "sales"

    sale_id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.floor_id"), unique=True, nullable=False)
    broker_id = Column(Integer, ForeignKey("brokers.broker_id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"), nullable=False)
    total_value = Column(Numeric(14, 2), nullable=False)
    commission_percent = Column(Numeric(5, 2))
    status = Column(Enum(SaleStatus, name="sale_status"), default=SaleStatus.HOLD)
    initiated_at = Column(TIMESTAMP, server_default=func.now())

    floor = relationship(
        "Floor",
        foreign_keys=[floor_id],
        primaryjoin="Sale.floor_id == Floor.floor_id"
    )
    broker = relationship("Broker", back_populates="sales")
    customer = relationship("Customer", back_populates="sales")
    payments = relationship("Payment", back_populates="sale", cascade="all, delete")