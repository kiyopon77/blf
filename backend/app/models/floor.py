from sqlalchemy import Column, Integer, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class InventoryStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    HOLD = "HOLD"
    SOLD = "SOLD"
    CANCELLED = "CANCELLED"
    INVESTOR_UNIT = "INVESTOR_UNIT"  # ← add this

class Floor(Base):
    __tablename__ = "floors"

    floor_id = Column(Integer, primary_key=True, index=True)
    plot_id = Column(Integer, ForeignKey("plots.plot_id", ondelete="CASCADE"), nullable=False)
    floor_no = Column(Integer, nullable=True)  # was nullable=False
    status = Column(Enum(InventoryStatus, name="inventory_status"), default=InventoryStatus.AVAILABLE)
    active_sale_id = Column(Integer, ForeignKey("sales.sale_id"), nullable=True)

    plot = relationship("Plot", back_populates="floors")
    sale = relationship(
        "Sale",
        foreign_keys=[active_sale_id],
        primaryjoin="Floor.active_sale_id == Sale.sale_id"
    )

    __table_args__ = (UniqueConstraint("plot_id", "floor_no"),)