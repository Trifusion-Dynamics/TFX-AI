from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class JobStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
    DRAFT = "draft"

class JobBase(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    salary_range: Optional[str] = None
    status: JobStatus = JobStatus.OPEN

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    salary_range: Optional[str] = None
    status: Optional[JobStatus] = None

class JobResponse(JobBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobApplicationBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    job_id: str

class JobApplicationResponse(JobApplicationBase):
    id: str
    job_id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
