"""
Case study model.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.sql import func
import uuid

from app.db.declarative_base import Base


class CaseStudy(Base):
    __tablename__ = "case_studies"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(300), nullable=False)
    slug = Column(String(350), unique=True, nullable=False, index=True)
    client_name = Column(String(150), nullable=False)
    industry = Column(String(100), nullable=False)
    thumbnail = Column(String(500), nullable=True)
    problem = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    tech_stack = Column(ARRAY(Text), nullable=False)
    metrics = Column(JSONB, nullable=True)
    is_published = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    order = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<CaseStudy(id={self.id}, title={self.title}, client_name={self.client_name})>"
