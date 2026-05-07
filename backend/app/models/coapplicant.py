from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class KYCStatus(str, enum.Enum):
    PENDING = "PENDING"
    DONE = "DONE"


class CoApplicant(Base):
    __tablename__ = "coapplicant"

    coapplicant_id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.customer_id"), nullable=False)

    full_name = Column(String(100))
    pan = Column(String(20), unique=True, nullable=True)
    phone = Column(String(20))
    email = Column(String(100))
    address = Column(String)

    kyc_status = Column(Enum(KYCStatus, name="kyc_status"), default=KYCStatus.PENDING)

    customer = relationship("Customer", back_populates="coapplicants")