from sqlalchemy import Column, Integer, String, Numeric, CHAR, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Plot(Base):
    __tablename__ = "plots"

    plot_id = Column(Integer, primary_key=True, index=True)
    society_id = Column(Integer, ForeignKey("society.society_id"), nullable=False)
    plot_code = Column(String(20), unique=True, nullable=False)
    area_sqyd = Column(Numeric(10, 2), nullable=True)
    area_sqft = Column(Numeric(10, 2), nullable=True)
    type = Column(CHAR(1), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    society = relationship("Society", back_populates="plots")
    floors = relationship("Floor", back_populates="plot", cascade="all, delete")