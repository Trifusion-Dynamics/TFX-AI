"""
User model.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
import uuid

from app.db.declarative_base import Base


class UserRole(PyEnum):
    USER = "USER"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    avatar = Column(String(500), nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    refresh_token = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    leads = relationship("Lead", back_populates="user", cascade="all, delete-orphan")
    blog_posts = relationship("BlogPost", back_populates="author", cascade="all, delete-orphan")
    newsletter = relationship("Newsletter", back_populates="user", cascade="all, delete-orphan")
    ai_usages = relationship("AIToolUsage", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email}, role={self.role})>"
