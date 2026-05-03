"""
Case study schemas.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class CaseStudyCreateRequest(BaseModel):
    """Case study creation request."""
    model_config = ConfigDict(from_attributes=True)
    
    title: str = Field(..., min_length=2, max_length=300)
    client_name: str = Field(..., min_length=2, max_length=150)
    industry: str = Field(..., min_length=2, max_length=100)
    problem: str = Field(..., min_length=50)
    solution: str = Field(..., min_length=50)
    result: str = Field(..., min_length=30)
    tech_stack: List[str] = Field(..., min_items=1)
    metrics: Optional[Dict[str, Any]] = None
    thumbnail: Optional[str] = Field(None, max_length=500)
    
    @field_validator('tech_stack')
    @classmethod
    def validate_tech_stack(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one technology is required')
        return [tech.strip() for tech in v if tech.strip()]


class CaseStudyResponse(BaseModel):
    """Case study response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    slug: str
    client_name: str
    industry: str
    thumbnail: Optional[str]
    problem: str
    solution: str
    result: str
    tech_stack: List[str]
    metrics: Optional[Dict[str, Any]]
    is_published: bool
    is_featured: bool
    order: int
    created_at: datetime
    updated_at: datetime


class CaseStudyListResponse(BaseModel):
    """Case study list response."""
    model_config = ConfigDict(from_attributes=True)
    
    case_studies: List[CaseStudyResponse]
    total: int
