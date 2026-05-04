from sqlalchemy import Column, String, Text, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.declarative_base import Base
import enum
from datetime import datetime
import uuid

class JobStatus(enum.Enum):
    OPEN = "open"
    CLOSED = "closed"
    DRAFT = "draft"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    type = Column(String(50), nullable=True) # Full-time, Part-time, etc.
    salary_range = Column(String(100), nullable=True)
    status = Column(Enum(JobStatus), default=JobStatus.OPEN)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    resume_url = Column(String(511), nullable=True)
    cover_letter = Column(Text, nullable=True)
    status = Column(String(50), default="pending") # pending, reviewed, rejected, accepted
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="applications")
