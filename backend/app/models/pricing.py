"""
Pricing model.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, Numeric, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from enum import Enum as PyEnum
import uuid

from app.db.declarative_base import Base


class BillingCycle(PyEnum):
    MONTHLY = "MONTHLY"
    YEARLY = "YEARLY"
    ONE_TIME = "ONE_TIME"


class PricingPlan(Base):
    __tablename__ = "pricing_plans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    slug = Column(String(150), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    billing_cycle = Column(Enum(BillingCycle), default=BillingCycle.ONE_TIME, nullable=False)
    features = Column(ARRAY(Text), nullable=False)
    is_popular = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    order = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<PricingPlan(id={self.id}, name={self.name}, price={self.price})>"
