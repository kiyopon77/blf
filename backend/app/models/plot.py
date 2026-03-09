from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Plot(Base):
    __tablename__ = "plots"

    plot_id = Column(Integer, primary_key=True, index=True)
    plot_code = Column(String(20), unique=True, nullable=False)
    length = Column(Numeric(10, 2), nullable=False)
    breadth = Column(Numeric(10, 2), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    floors = relationship("Floor", back_populates="plot", cascade="all, delete")