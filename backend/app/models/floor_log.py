from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class FloorStatusLog(Base):
    __tablename__ = "floor_status_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.floor_id", ondelete="CASCADE"), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    old_status = Column(String(20))
    new_status = Column(String(20))
    changed_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User")
    floor = relationship("Floor")