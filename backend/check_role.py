
import asyncio
from sqlalchemy import select
from app.db.base import AsyncSessionLocal
from app.models.user import User

async def check_admin_role():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == "admin@tfxai.com"))
        user = result.scalar_one_or_none()
        if user:
            print(f"User: {user.email}")
            print(f"Role object: {user.role}")
            print(f"Role value: {user.role.value}")
            print(f"Role name: {user.role.name}")
        else:
            print("Admin user not found")

if __name__ == "__main__":
    asyncio.run(check_admin_role())
