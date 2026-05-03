"""
Newsletter schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict


class NewsletterSubscribeRequest(BaseModel):
    """Newsletter subscription request."""
    model_config = ConfigDict(from_attributes=True)
    
    email: str = Field(..., min_length=5, max_length=255)


class NewsletterUnsubscribeRequest(BaseModel):
    """Newsletter unsubscribe request."""
    model_config = ConfigDict(from_attributes=True)
    
    email: str = Field(..., min_length=5, max_length=255)


class NewsletterResponse(BaseModel):
    """Newsletter response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    email: str
    is_active: bool
    subscribed_at: datetime
