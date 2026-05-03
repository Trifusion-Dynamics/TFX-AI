"""
Blog schemas.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class BlogCreateRequest(BaseModel):
    """Blog creation request."""
    model_config = ConfigDict(from_attributes=True)
    
    title: str = Field(..., min_length=2, max_length=300)
    content: str = Field(..., min_length=200)
    excerpt: Optional[str] = Field(None, max_length=500)
    tags: Optional[List[str]] = Field(default=[])
    category: Optional[str] = Field(None, max_length=100)
    thumbnail: Optional[str] = Field(None, max_length=500)
    read_time: Optional[int] = Field(None, ge=1)
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        if v:
            return [tag.strip() for tag in v if tag.strip()]
        return []


class BlogUpdateRequest(BaseModel):
    """Blog update request."""
    model_config = ConfigDict(from_attributes=True)
    
    title: Optional[str] = Field(None, min_length=2, max_length=300)
    content: Optional[str] = Field(None, min_length=200)
    excerpt: Optional[str] = Field(None, max_length=500)
    tags: Optional[List[str]] = Field(None)
    category: Optional[str] = Field(None, max_length=100)
    thumbnail: Optional[str] = Field(None, max_length=500)
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    read_time: Optional[int] = Field(None, ge=1)
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        if v:
            return [tag.strip() for tag in v if tag.strip()]
        return v


class BlogResponse(BaseModel):
    """Blog response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    slug: str
    content: str
    excerpt: Optional[str]
    thumbnail: Optional[str]
    tags: List[str]
    category: Optional[str]
    is_published: bool
    is_featured: bool
    views: int
    read_time: int
    author_id: UUID
    created_at: datetime
    updated_at: datetime
    author_name: Optional[str] = None


class BlogListResponse(BaseModel):
    """Blog list response."""
    model_config = ConfigDict(from_attributes=True)
    
    blogs: List[BlogResponse]
    total: int
