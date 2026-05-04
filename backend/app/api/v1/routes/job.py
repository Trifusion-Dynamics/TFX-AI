from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from app.core.dependencies import get_db, get_current_admin
from app.models.job import Job, JobApplication
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobApplicationCreate, JobApplicationResponse
from app.schemas.common import ApiResponse
import uuid

router = APIRouter()

# Public Routes
@router.get("/", response_model=ApiResponse[List[JobResponse]])
async def get_jobs(db: AsyncSession = Depends(get_db)):
    """Get all open jobs."""
    result = await db.execute(select(Job).where(Job.status == "open").order_by(desc(Job.created_at)))
    jobs = result.scalars().all()
    return ApiResponse(success=True, message="Jobs retrieved successfully", data=jobs)

@router.get("/{job_id}", response_model=ApiResponse[JobResponse])
async def get_job(job_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific job."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return ApiResponse(success=True, message="Job retrieved successfully", data=job)

@router.post("/apply", response_model=ApiResponse[JobApplicationResponse])
async def apply_job(data: JobApplicationCreate, db: AsyncSession = Depends(get_db)):
    """Apply for a job."""
    # Check if job exists and is open
    job_result = await db.execute(select(Job).where(Job.id == data.job_id))
    job = job_result.scalar_one_or_none()
    if not job or job.status != "open":
        raise HTTPException(status_code=400, detail="Job not available for application")
    
    application = JobApplication(**data.model_dump())
    db.add(application)
    await db.commit()
    await db.refresh(application)
    
    return ApiResponse(success=True, message="Application submitted successfully", data=application)

# Admin Routes
@router.post("/admin", response_model=ApiResponse[JobResponse])
async def create_job(data: JobCreate, db: AsyncSession = Depends(get_db), admin: str = Depends(get_current_admin)):
    """Create a new job (Admin only)."""
    job = Job(**data.model_dump())
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return ApiResponse(success=True, message="Job created successfully", data=job)

@router.patch("/admin/{job_id}", response_model=ApiResponse[JobResponse])
async def update_job(job_id: str, data: JobUpdate, db: AsyncSession = Depends(get_db), admin: str = Depends(get_current_admin)):
    """Update a job (Admin only)."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    
    await db.commit()
    await db.refresh(job)
    return ApiResponse(success=True, message="Job updated successfully", data=job)

@router.delete("/admin/{job_id}", response_model=ApiResponse)
async def delete_job(job_id: str, db: AsyncSession = Depends(get_db), admin: str = Depends(get_current_admin)):
    """Delete a job (Admin only)."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    await db.delete(job)
    await db.commit()
    return ApiResponse(success=True, message="Job deleted successfully")

@router.get("/admin/applications", response_model=ApiResponse[List[JobApplicationResponse]])
async def get_applications(db: AsyncSession = Depends(get_db), admin: str = Depends(get_current_admin)):
    """Get all job applications (Admin only)."""
    result = await db.execute(select(JobApplication).order_by(desc(JobApplication.created_at)))
    apps = result.scalars().all()
    return ApiResponse(success=True, message="Applications retrieved successfully", data=apps)
