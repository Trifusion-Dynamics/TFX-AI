"""
TFX AI Backend - FastAPI Application Entry Point
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import time
from datetime import datetime
from uuid import uuid4
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.db.base import init_db, close_db, AsyncSessionLocal, engine
from app.db.init_db import seed_database
from app.api.v1.routes import (
    auth,
    user,
    contact,
    service,
    project,
    blog,
    newsletter,
    testimonial,
    pricing,
    case_study,
    ai_tools,
    admin,
    job,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.is_development else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events.
    """
    # Startup
    logger.info(f"Starting {settings.app_name} Backend...")
    logger.info(f"Environment: {settings.app_env}")
    logger.info(f"Database URL: {settings.database_url.split('@')[-1]}")  # Hide credentials
    
    try:
        await init_db()
        logger.info("Database initialized successfully")
        
        # Seed database with initial data
        async with AsyncSessionLocal() as db:
            await seed_database(db)
            logger.info("Database seeded successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
    
    # Startup banner
    print(f"""
    +----------------------------------+
    |      TFX AI Backend Running      |
    |   Port: {settings.app_port}                   |
    |   Env:  {settings.app_env}                    |
    |   Docs: /docs                    |
    +----------------------------------+
    """)
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    await engine.dispose()
    print("Database connections closed.")
    logger.info("Application shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="TFX AI Backend",
    description="TFX AI Agency Backend API",
    version="1.0.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)

# Set up slowapi
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.client_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register exception handlers
register_exception_handlers(app)

# Add request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """
    Add unique request ID to response headers.
    """
    request_id = str(uuid4())
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

# Add timing middleware
@app.middleware("http")
async def add_timing_and_logging(request: Request, call_next):
    """
    Add timing and logging middleware.
    """
    start_time = time.time()
    method = request.method
    path = request.url.path
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    status = response.status_code
    time_ms = round(process_time * 1000, 2)
    
    # Add timing header
    response.headers["X-Process-Time"] = str(process_time)
    
    # Log request
    logger.info(f"[{method}] {path} - {status} - {time_ms}ms")
    
    return response


# Root endpoint
@app.get("/", response_model=dict)
async def root():
    """
    Root endpoint.
    """
    return {
        "message": "TFX AI API v1",
        "status": "running",
        "version": "1.0.0",
        "environment": settings.app_env
    }


# Health check endpoint
@app.get("/health", response_model=dict)
async def health_check():
    """
    Health check endpoint.
    """
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.app_env
    }


# Include all routers under /api/v1 prefix
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(contact.router, prefix="/api/v1/contact", tags=["Contact"])
app.include_router(service.router, prefix="/api/v1/services", tags=["Services"])
app.include_router(project.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(blog.router, prefix="/api/v1/blog", tags=["Blog"])
app.include_router(newsletter.router, prefix="/api/v1/newsletter", tags=["Newsletter"])
app.include_router(testimonial.router, prefix="/api/v1/testimonials", tags=["Testimonials"])
app.include_router(pricing.router, prefix="/api/v1/pricing", tags=["Pricing"])
app.include_router(case_study.router, prefix="/api/v1/case-studies", tags=["Case Studies"])
app.include_router(ai_tools.router, prefix="/api/v1/ai-tools", tags=["AI Tools"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(job.router, prefix="/api/v1/jobs", tags=["Jobs"])

# Graceful shutdown event handler
@app.on_event("shutdown")
async def shutdown():
    """Handle graceful shutdown."""
    await engine.dispose()
    print("Database connections closed.")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.app_port,
        reload=settings.is_development,
        log_level="info"
    )
