"""
Script to create a sample job for testing the career application system.
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import AsyncSessionLocal
from app.models.job import Job

async def create_sample_job():
    """Create a sample job for testing."""
    async with AsyncSessionLocal() as session:
        try:
            # Check if sample job already exists
            from sqlalchemy import select, text
            existing_job = await session.execute(
                select(Job).where(Job.title == "Senior AI Engineer")
            )
            if existing_job.scalar_one_or_none():
                print("Sample job already exists!")
                return
            
            # Create sample job
            job = Job(
                title="Senior AI Engineer",
                description="We are looking for a talented AI Engineer to join our team and help build cutting-edge AI solutions.",
                requirements="• 3+ years of experience in AI/ML development\n• Strong Python programming skills\n• Experience with TensorFlow/PyTorch\n• Knowledge of NLP and computer vision\n• Excellent problem-solving skills",
                location="Remote / Bangalore",
                type="Full-time",
                salary_range="$80,000 - $120,000",
                status="OPEN"
            )
            
            session.add(job)
            await session.commit()
            await session.refresh(job)
            
            print(f"Sample job created successfully! Job ID: {job.id}")
            print(f"You can now test applications at: http://localhost:3000/career")
            
        except Exception as e:
            print(f"Error creating sample job: {e}")
            await session.rollback()

if __name__ == "__main__":
    asyncio.run(create_sample_job())
