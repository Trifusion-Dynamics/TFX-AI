"""
Lead schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class LeadCreate(BaseModel):
    """Lead creation schema."""
    model_config = ConfigDict(from_attributes=True)
    
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=5, max_length=300)
    message: str = Field(..., min_length=10)
    source: Optional[str] = Field("contact", max_length=50)
    status: Optional[str] = Field("new", max_length=20)


class LeadCreateRequest(BaseModel):
    """Lead creation request."""
    model_config = ConfigDict(from_attributes=True)
    
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=5, max_length=300)
    message: str = Field(..., min_length=10)


class LeadResponse(BaseModel):
    """Lead response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    name: str
    email: str
    phone: Optional[str]
    subject: str
    message: str
    status: str
    source: str
    user_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime


class LeadStatusUpdateRequest(BaseModel):
    """Lead status update request."""
    model_config = ConfigDict(from_attributes=True)
    
    status: str = Field(..., description="Lead status: NEW, IN_PROGRESS, RESOLVED, CLOSED")


class LeadStatsResponse(BaseModel):
    """Lead statistics response."""
    model_config = ConfigDict(from_attributes=True)
    
    total: int
    by_status: Dict[str, int]
    last_30_days: List[Dict[str, Any]]
