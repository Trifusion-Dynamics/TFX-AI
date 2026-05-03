"""
Testimonial schemas.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class TestimonialCreateRequest(BaseModel):
    """Testimonial creation request."""
    model_config = ConfigDict(from_attributes=True)
    
    name: str = Field(..., min_length=2, max_length=100)
    role: Optional[str] = Field(None, max_length=100)
    company: Optional[str] = Field(None, max_length=150)
    content: str = Field(..., min_length=20)
    rating: int = Field(..., ge=1, le=5)
    avatar: Optional[str] = Field(None, max_length=500)


class TestimonialResponse(BaseModel):
    """Testimonial response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    name: str
    role: Optional[str]
    company: Optional[str]
    avatar: Optional[str]
    content: str
    rating: int
    is_published: bool
    order: int
    created_at: datetime
    updated_at: datetime


class TestimonialListResponse(BaseModel):
    """Testimonial list response."""
    model_config = ConfigDict(from_attributes=True)
    
    testimonials: List[TestimonialResponse]
    total: int
