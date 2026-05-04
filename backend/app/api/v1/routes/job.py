from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from typing import List
from app.core.dependencies import get_db, get_current_admin
from app.models.job import Job, JobApplication
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobApplicationCreate, JobApplicationResponse
from app.schemas.common import ApiResponse
from app.services.email_service import email_service
import uuid

router = APIRouter()

# Public Routes
@router.get("/", response_model=ApiResponse[List[JobResponse]])
async def get_jobs(db: AsyncSession = Depends(get_db)):
    """Get all open jobs."""
    result = await db.execute(select(Job).where(Job.status == "OPEN").order_by(desc(Job.created_at)))
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

@router.post("/{job_id}/apply", response_model=ApiResponse[JobApplicationResponse])
async def apply_job(job_id: str, data: JobApplicationCreate, db: AsyncSession = Depends(get_db)):
    """Apply for a job."""
    # Check if job exists and is open
    job_result = await db.execute(select(Job).where(Job.id == job_id))
    job = job_result.scalar_one_or_none()
    if not job or job.status != "OPEN":
        raise HTTPException(status_code=400, detail="Job not available for application")
    
    # Override job_id in data with path parameter
    application_data = data.model_dump()
    application_data["job_id"] = job_id
    application = JobApplication(**application_data)
    db.add(application)
    await db.commit()
    await db.refresh(application)
    
    # Send email notifications
    await email_service.send_admin_notification(
        applicant_name=application.full_name,
        applicant_email=application.email,
        job_title=job.title,
        application_id=application.id
    )
    
    await email_service.send_application_confirmation(
        applicant_email=application.email,
        applicant_name=application.full_name,
        job_title=job.title
    )
    
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
    result = await db.execute(
        select(JobApplication).options(selectinload(JobApplication.job)).order_by(desc(JobApplication.created_at))
    )
    apps = result.scalars().all()
    return ApiResponse(success=True, message="Applications retrieved successfully", data=apps)

@router.get("/admin/applications/{application_id}", response_model=ApiResponse[JobApplicationResponse])
async def get_application(application_id: str, db: AsyncSession = Depends(get_db), admin: str = Depends(get_current_admin)):
    """Get a specific job application (Admin only)."""
    result = await db.execute(
        select(JobApplication).options(selectinload(JobApplication.job)).where(JobApplication.id == application_id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApiResponse(success=True, message="Application retrieved successfully", data=app)

@router.patch("/admin/applications/{application_id}", response_model=ApiResponse[JobApplicationResponse])
async def update_application_status(
    application_id: str, 
    status: str, 
    db: AsyncSession = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    """Update application status (Admin only)."""
    result = await db.execute(select(JobApplication).where(JobApplication.id == application_id))
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app.status = status
    await db.commit()
    await db.refresh(app)
    return ApiResponse(success=True, message="Application status updated", data=app)

@router.delete("/admin/applications/{application_id}", response_model=ApiResponse)
async def delete_application(application_id: str, db: AsyncSession = Depends(get_db), admin: str = Depends(get_current_admin)):
    """Delete a job application (Admin only)."""
    result = await db.execute(select(JobApplication).where(JobApplication.id == application_id))
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    await db.delete(app)
    await db.commit()
    return ApiResponse(success=True, message="Application deleted successfully")
