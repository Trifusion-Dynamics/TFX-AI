"""
User schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class UserResponse(BaseModel):
    """User response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    name: str
    email: str
    role: str
    avatar: Optional[str]
    is_verified: bool
    created_at: datetime


class UserUpdateRequest(BaseModel):
    """User update request."""
    model_config = ConfigDict(from_attributes=True)
    
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar: Optional[str] = Field(None, max_length=500)


class UserRoleUpdateRequest(BaseModel):
    """User role update request."""
    model_config = ConfigDict(from_attributes=True)
    
    role: str = Field(..., description="User role: USER or ADMIN")
