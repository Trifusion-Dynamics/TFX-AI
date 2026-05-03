"""
Service schemas.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class ServiceCreateRequest(BaseModel):
    """Service creation request."""
    model_config = ConfigDict(from_attributes=True)
    
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=50)
    short_desc: Optional[str] = Field(None, max_length=300)
    features: List[str] = Field(..., min_items=1)
    icon: Optional[str] = Field(None, max_length=100)
    order: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    
    @field_validator('features')
    @classmethod
    def validate_features(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one feature is required')
        return [feature.strip() for feature in v if feature.strip()]


class ServiceUpdateRequest(BaseModel):
    """Service update request."""
    model_config = ConfigDict(from_attributes=True)
    
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, min_length=50)
    short_desc: Optional[str] = Field(None, max_length=300)
    features: Optional[List[str]] = Field(None)
    icon: Optional[str] = Field(None, max_length=100)
    order: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    
    @field_validator('features')
    @classmethod
    def validate_features(cls, v):
        if v is not None and (not v or len(v) == 0):
            raise ValueError('At least one feature is required')
        if v:
            return [feature.strip() for feature in v if feature.strip()]
        return v


class ServiceResponse(BaseModel):
    """Service response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    slug: str
    description: str
    short_desc: Optional[str]
    icon: Optional[str]
    features: List[str]
    is_active: bool
    order: int
    created_at: datetime
    updated_at: datetime


class ServiceListResponse(BaseModel):
    """Service list response."""
    model_config = ConfigDict(from_attributes=True)
    
    services: List[ServiceResponse]
    total: int
