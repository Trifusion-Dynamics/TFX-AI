"""
TFX AI Backend Startup Script
"""

import asyncio
import uvicorn
from app.core.config import settings
from app.db.base import init_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def startup():
    """
    Initialize database and start the application.
    """
    try:
        # Initialize database
        await init_db()
        logger.info("Database initialized successfully")
        
        # Create admin user
        from app.db.base import AsyncSessionLocal
        from app.db.init_db import seed_database
        async with AsyncSessionLocal() as db:
            await seed_database(db)
        logger.info("Database seeded successfully")
        
    except Exception as e:
        logger.error(f"Startup error: {e}")
        raise


if __name__ == "__main__":
    # Run startup
    asyncio.run(startup())
    
    # Start FastAPI application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.app_port,
        reload=settings.is_development,
        log_level="info"
    )
