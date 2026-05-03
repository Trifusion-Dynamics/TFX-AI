"""
Project schemas.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class ProjectCreateRequest(BaseModel):
    """Project creation request."""
    model_config = ConfigDict(from_attributes=True)
    
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=50)
    short_desc: Optional[str] = Field(None, max_length=300)
    tech_stack: List[str] = Field(..., min_items=1)
    category: str = Field(..., description="Project category: AI, WEB, SAAS, OTHER")
    live_url: Optional[str] = Field(None, max_length=500)
    github_url: Optional[str] = Field(None, max_length=500)
    thumbnail: Optional[str] = Field(None, max_length=500)
    is_featured: Optional[bool] = None
    
    @field_validator('tech_stack')
    @classmethod
    def validate_tech_stack(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one technology is required')
        return [tech.strip() for tech in v if tech.strip()]


class ProjectUpdateRequest(BaseModel):
    """Project update request."""
    model_config = ConfigDict(from_attributes=True)
    
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, min_length=50)
    short_desc: Optional[str] = Field(None, max_length=300)
    tech_stack: Optional[List[str]] = Field(None)
    category: Optional[str] = None
    live_url: Optional[str] = Field(None, max_length=500)
    github_url: Optional[str] = Field(None, max_length=500)
    thumbnail: Optional[str] = Field(None, max_length=500)
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    
    @field_validator('tech_stack')
    @classmethod
    def validate_tech_stack(cls, v):
        if v is not None and (not v or len(v) == 0):
            raise ValueError('At least one technology is required')
        if v:
            return [tech.strip() for tech in v if tech.strip()]
        return v


class ProjectResponse(BaseModel):
    """Project response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    slug: str
    description: Optional[str]
    category: Optional[str]
    tech_stack: Optional[List[str]]
    featured_image: Optional[str]
    is_featured: bool
    is_published: bool
    project_url: Optional[str]
    order_index: int
    created_at: datetime
    updated_at: datetime


class ProjectFilter(BaseModel):
    """Project filter schema."""
    model_config = ConfigDict(from_attributes=True)
    
    category: Optional[str] = None
    is_featured: Optional[bool] = None
    search: Optional[str] = None


class ProjectListResponse(BaseModel):
    """Project list response."""
    model_config = ConfigDict(from_attributes=True)
    
    projects: List[ProjectResponse]
    total: int
