from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Broker(Base):
    __tablename__ = "brokers"

    broker_id = Column(Integer, primary_key=True, index=True)
    broker_name = Column(String(100), nullable=True)
    company = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100), unique=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)  # changed from rm_id
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="brokers")
    sales = relationship("Sale", back_populates="broker")