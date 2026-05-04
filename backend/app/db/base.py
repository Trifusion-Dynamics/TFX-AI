"""
Database configuration and session management.
"""

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Create async SQLAlchemy engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.is_development,
    future=True,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={
        "statement_cache_size": 0,
        "ssl": True if "neon.tech" in (settings.database_url or "") else False
    }
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Create declarative base
Base = declarative_base()

# Metadata with naming conventions
metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s"
    }
)

Base.metadata = metadata


async def get_db() -> AsyncSession:
    """
    Dependency to get database session.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """
    Initialize database tables.
    """
    try:
        async with engine.begin() as conn:
            # Import all models to ensure they are registered
            from app.models import user, lead, service, project, blog, newsletter, testimonial, pricing, case_study, ai_tool_usage, site_config  # noqa
            
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
            logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
        raise


async def close_db():
    """
    Close database connections.
    """
    await engine.dispose()
    logger.info("Database connections closed")
