#!/usr/bin/env python3
"""
Simple database setup script for TFX AI
Creates schema and seeds data
"""

import asyncio
import asyncpg
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.db.init_db import seed_database

async def create_database():
    """Create database schema and seed data"""
    print("🚀 Setting up TFX AI Database...")
    
    try:
        # Create async engine
        engine = create_async_engine(
            settings.database_url,
            echo=True,
            pool_pre_ping=True,
            pool_recycle=3600,
        )
        
        print("✅ Database engine created")
        
        # Import all models to create tables
        from app.models.user import User, UserRole
        from app.models.site_config import SiteConfig
        from app.models.service import Service
        from app.models.project import Project, ProjectCategory
        from app.models.pricing import PricingPlan, BillingCycle
        from app.models.testimonial import Testimonial
        from app.models.blog import BlogPost
        from app.models.case_study import CaseStudy
        from app.models.lead import Lead, LeadStatus
        from app.models.newsletter import Newsletter
        from app.models.ai_tool_usage import AIToolUsage
        
        # Create all tables
        from app.db.declarative_base import Base
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        print("✅ Database schema created successfully")
        
        # Seed data
        from app.db.base import AsyncSessionLocal
        async with AsyncSessionLocal() as db:
            await seed_database(db)
        
        print("✅ Database seeded successfully")
        print("🎉 TFX AI Database setup complete!")
        
        await engine.dispose()
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(create_database())
