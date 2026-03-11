from sqlalchemy import Column, Integer, Numeric, Enum, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class MilestoneType(str, enum.Enum):
    TOKEN = "TOKEN"
    ATS = "ATS"
    SUPERSTRUCTURE = "SUPERSTRUCTURE"
    PROPERTY_ID = "PROPERTY_ID"
    REGISTRY = "REGISTRY"
    POSSESSION = "POSSESSION"

class MilestoneStatus(str, enum.Enum):
    PENDING = "PENDING"
    DONE = "DONE"

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.sale_id", ondelete="CASCADE"), nullable=False)
    milestone = Column(Enum(MilestoneType, name="milestone_type"), nullable=False)
    amount = Column(Numeric(14, 2))
    status = Column(Enum(MilestoneStatus, name="milestone_status"), default=MilestoneStatus.PENDING)
    paid_at = Column(TIMESTAMP, nullable=True)

    sale = relationship("Sale", back_populates="payments")

    __table_args__ = (UniqueConstraint("sale_id", "milestone"),)