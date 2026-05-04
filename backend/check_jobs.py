import asyncio
from app.db import AsyncSessionLocal
from app.models.job import Job
from sqlalchemy import select

async def check_jobs():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Job))
        jobs = result.scalars().all()
        print(f"Total jobs in DB: {len(jobs)}")
        for job in jobs:
            print(f"- {job.title} ({job.status})")

if __name__ == "__main__":
    asyncio.run(check_jobs())
