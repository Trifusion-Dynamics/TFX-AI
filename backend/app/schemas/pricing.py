"""
Pricing schemas.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class PricingPlanCreateRequest(BaseModel):
    """Pricing plan creation request."""
    model_config = ConfigDict(from_attributes=True)
    
    name: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10)
    price: float = Field(..., ge=0)
    currency: str = Field(default="INR", max_length=10)
    billing_cycle: str = Field(default="ONE_TIME", description="Billing cycle: MONTHLY, YEARLY, ONE_TIME")
    features: List[str] = Field(..., min_items=1)
    is_popular: Optional[bool] = None
    order: Optional[int] = Field(None, ge=0)
    
    @field_validator('features')
    @classmethod
    def validate_features(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one feature is required')
        return [feature.strip() for feature in v if feature.strip()]


class PricingPlanResponse(BaseModel):
    """Pricing plan response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    name: str
    slug: str
    description: str
    price: float
    currency: str
    billing_cycle: str
    features: List[str]
    is_popular: bool
    is_active: bool
    order: int
    created_at: datetime
    updated_at: datetime


class PricingPlanListResponse(BaseModel):
    """Pricing plan list response."""
    model_config = ConfigDict(from_attributes=True)
    
    plans: List[PricingPlanResponse]
    total: int
