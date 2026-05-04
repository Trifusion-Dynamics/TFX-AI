
import asyncio
from sqlalchemy import select, delete
from app.db.base import AsyncSessionLocal
from app.models.user import User
from app.models.lead import Lead

async def cleanup_db():
    async with AsyncSessionLocal() as db:
        # Delete duplicate leads
        # We'll just delete all seeded leads and let the seeder re-add them correctly
        seeded_emails = ["alice@example.com", "bob@example.com", "charlie@example.com"]
        await db.execute(delete(Lead).where(Lead.email.in_(seeded_emails)))
        
        # Check for multiple admins
        result = await db.execute(select(User).where(User.email == "admin@tfxai.com"))
        admins = result.scalars().all()
        if len(admins) > 1:
            print(f"Found {len(admins)} admins. Deleting duplicates...")
            # Keep the first one
            for admin in admins[1:]:
                await db.delete(admin)
        
        await db.commit()
        print("Cleanup complete.")

if __name__ == "__main__":
    asyncio.run(cleanup_db())
