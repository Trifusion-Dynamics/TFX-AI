"""
Testimonial model.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.declarative_base import Base


class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=True)
    company = Column(String(150), nullable=True)
    avatar = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    order = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Testimonial(id={self.id}, name={self.name}, rating={self.rating})>"
