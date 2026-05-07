"""
AI tools schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, Any, Dict
from datetime import datetime
from uuid import UUID
from pydantic import ConfigDict
from enum import Enum


class TextType(str, Enum):
    BLOG_INTRO = "blog_intro"
    SOCIAL_POST = "social_post"
    EMAIL = "email"
    TAGLINE = "tagline"
    DESCRIPTION = "description"


class TextTone(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    CREATIVE = "creative"
    PERSUASIVE = "persuasive"


class TextLength(str, Enum):
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"


class ResumeAnalyzerRequest(BaseModel):
    """Resume analyzer request."""
    model_config = ConfigDict(from_attributes=True)
    
    resume_text: str = Field(..., min_length=100, max_length=5000)


class TextGeneratorRequest(BaseModel):
    """Text generator request."""
    model_config = ConfigDict(from_attributes=True)
    
    topic: str = Field(..., max_length=200)
    type: TextType = Field(..., description="Type of text to generate")
    tone: TextTone = Field(default=TextTone.PROFESSIONAL, description="Tone of the text")
    length: TextLength = Field(default=TextLength.MEDIUM, description="Length of the text")


class QABotRequest(BaseModel):
    """Q&A bot request."""
    model_config = ConfigDict(from_attributes=True)
    
    question: str = Field(..., max_length=500)
    context: Optional[str] = Field(None, max_length=2000)


class ChatbotRequest(BaseModel):
    """Chatbot request."""
    model_config = ConfigDict(from_attributes=True)
    
    message: str = Field(..., min_length=1, max_length=500)
    conversation_history: Optional[list[dict]] = Field(default_factory=list)
    visitor_name: Optional[str] = Field(None, max_length=100)
    page_context: Optional[str] = Field(None, max_length=100)


class ChatbotResponse(BaseModel):
    """Chatbot response."""
    model_config = ConfigDict(from_attributes=True)
    
    reply: str
    intent: str
    suggested_actions: list[str]
    should_capture_lead: bool
    lead_capture_prompt: Optional[str] = None


class AIToolResponse(BaseModel):
    """AI tool response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    tool_name: str
    result: Any
    created_at: datetime
