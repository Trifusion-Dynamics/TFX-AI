"""
Project model.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from enum import Enum as PyEnum
import uuid

from app.db.declarative_base import Base


class ProjectCategory(PyEnum):
    AI = "AI"
    WEB = "WEB"
    SAAS = "SAAS"
    OTHER = "OTHER"


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=True)
    tech_stack = Column(JSONB, nullable=True)
    featured_image = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    project_url = Column(String(500), nullable=True)
    order_index = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Project(id={self.id}, title={self.title}, category={self.category})>"
