"""
AI tool usage model.
"""

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.db.declarative_base import Base


class AIToolUsage(Base):
    __tablename__ = "ai_tool_usages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tool_name = Column(String(100), nullable=False, index=True)
    input_data = Column(JSONB, nullable=True)
    output_data = Column(JSONB, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="ai_usages")
    
    def __repr__(self):
        return f"<AIToolUsage(id={self.id}, tool_name={self.tool_name}, user_id={self.user_id})>"
