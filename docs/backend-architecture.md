# 🔧 Backend Architecture Documentation

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [📁 Project Structure](#-project-structure)
- [🔄 Request Flow](#-request-flow)
- [🗄️ Database Layer](#️-database-layer)
- [🔐 Authentication System](#-authentication-system)
- [🚀 API Design Patterns](#-api-design-patterns)
- [🧩 Service Layer](#-service-layer)
- [⚡ Performance Optimization](#-performance-optimization)
- [🔍 Error Handling](#-error-handling)
- [📊 Monitoring & Logging](#-monitoring--logging)

## 🏗️ Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Application                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   API       │  │   Core      │  │     Services        │   │
│  │   Layer     │  │   Layer     │  │     Layer           │   │
│  │             │  │             │  │                     │   │
│  │ - Routes    │  │ - Config    │  │ - Business Logic   │   │
│  │ - Middleware│  │ - Security  │  │ - Data Processing  │   │
│  │ - Validation│  │ - Deps      │  │ - External APIs    │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Models    │  │   Schemas   │  │     Utils           │   │
│  │   Layer     │  │   Layer     │  │     Layer           │   │
│  │             │  │             │  │                     │   │
│  │ - SQLAlchemy│  │ - Pydantic  │  │ - Helpers           │   │
│  │ - Tables    │  │ - Validation│  │ - Email             │   │
│  │ - Relations │  │ - Serialization│ │ - File Upload       │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Database Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ PostgreSQL  │  │   Redis     │  │   External APIs     │   │
│  │             │  │   Cache     │  │                     │   │
│  │ - Users     │  │ - Sessions  │  │ - Gemini AI         │   │
│  │ - Projects  │  │ - Rate Limit│  │ - Cloudinary        │   │
│  │ - AI Usage  │  │ - Temp Data │  │ - Email Service     │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Layered Architecture**: Clear separation of concerns
2. **Dependency Injection**: Loose coupling, easy testing
3. **Async/Await**: Non-blocking I/O operations
4. **Type Safety**: Full type hints with Pydantic
5. **Security First**: Authentication, validation, rate limiting
6. **Scalability**: Connection pooling, caching, monitoring

## 📁 Project Structure Deep Dive

### API Layer (`app/api/v1/`)

#### Route Organization

```python
# app/api/v1/__init__.py
from fastapi import APIRouter
from . import auth, users, projects, ai_tools, services, pricing, testimonials, blog, admin

api_router = APIRouter(prefix="/api/v1")

# Include all route modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(ai_tools.router, prefix="/ai-tools", tags=["AI Tools"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(pricing.router, prefix="/pricing", tags=["Pricing"])
api_router.include_router(testimonials.router, prefix="/testimonials", tags=["Testimonials"])
api_router.include_router(blog.router, prefix="/blog", tags=["Blog"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
```

#### Route Structure Pattern

```python
# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest
from app.services.auth_service import AuthService
from app.core.dependencies import get_db

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and return JWT tokens.
    
    Process:
    1. Validate request data
    2. Verify user credentials
    3. Generate JWT tokens
    4. Return response with tokens
    """
    auth_service = AuthService(db)
    
    try:
        user = await auth_service.authenticate(
            email=request.email,
            password=request.password
        )
        
        tokens = auth_service.create_tokens(user)
        
        return LoginResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_type="bearer",
            user=user
        )
        
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
```

### Core Layer (`app/core/`)

#### Configuration Management

```python
# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache

class Settings(BaseSettings):
    # Application
    app_name: str = "TFX AI"
    app_env: str = "development"
    app_port: int = 8000
    debug: bool = False
    
    # Database
    database_url: str
    db_pool_size: int = 20
    db_max_overflow: int = 30
    
    # Security
    secret_key: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:3000"]
    allowed_methods: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_headers: List[str] = ["*"]
    
    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 60
    
    # External Services
    gemini_api_key: str
    cloudinary_cloud_name: Optional[str] = None
    cloudinary_api_key: Optional[str] = None
    cloudinary_api_secret: Optional[str] = None
    
    # Email
    mail_username: Optional[str] = None
    mail_password: Optional[str] = None
    mail_from: Optional[str] = None
    mail_server: str = "smtp.gmail.com"
    mail_port: int = 587
    
    # Redis (Optional)
    redis_url: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
```

#### Security System

```python
# app/core/security.py
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status
from app.core.config import get_settings

settings = get_settings()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityManager:
    """Handles all security-related operations."""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt."""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token."""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
        
        to_encode.update({"exp": expire, "type": "access"})
        
        return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    
    @staticmethod
    def create_refresh_token(data: Dict[str, Any]) -> str:
        """Create JWT refresh token."""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
        
        to_encode.update({"exp": expire, "type": "refresh"})
        
        return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    
    @staticmethod
    def verify_token(token: str, token_type: str = "access") -> Dict[str, Any]:
        """Verify and decode JWT token."""
        try:
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            
            if payload.get("type") != token_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            
            return payload
            
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token verification failed"
            )
```

#### Dependency Injection

```python
# app/core/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import get_db
from app.core.security import SecurityManager
from app.models.user import User
from app.services.user_service import UserService

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        # Verify token
        payload = SecurityManager.verify_token(credentials.credentials, "access")
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Get user from database
        user_service = UserService(db)
        user = await user_service.get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
        )

async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Get current authenticated admin user."""
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

async def optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Get current user if authenticated, otherwise return None."""
    if not credentials or not credentials.credentials:
        return None
    
    try:
        payload = SecurityManager.verify_token(credentials.credentials, "access")
        user_id = payload.get("sub")
        
        if not user_id:
            return None
        
        user_service = UserService(db)
        return await user_service.get_user_by_id(user_id)
        
    except Exception:
        return None
```

## 🔄 Request Flow

### Complete Request Lifecycle

```
1. Client Request
   ↓
2. FastAPI Router
   ↓
3. Middleware Stack
   - CORS
   - Security Headers
   - Rate Limiting
   - Request ID
   - Timing
   ↓
4. Route Handler
   - Validation (Pydantic)
   - Dependencies (DI)
   ↓
5. Service Layer
   - Business Logic
   - Data Processing
   ↓
6. Database Layer
   - SQLAlchemy ORM
   - Async Operations
   ↓
7. Response
   - Serialization
   - Headers
   - Status Code
```

### Request Processing Example

```python
# Example: Creating a new project
@router.post("/projects", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new project.
    
    Request Flow:
    1. Validate request data with Pydantic
    2. Check user authentication
    3. Call service layer
    4. Process business logic
    5. Save to database
    6. Return response
    """
    
    # Step 1: Validation (handled by FastAPI + Pydantic)
    # project_data is already validated
    
    # Step 2: Authentication (handled by dependency injection)
    # current_user is guaranteed to be authenticated
    
    # Step 3: Service Layer
    project_service = ProjectService(db)
    
    try:
        # Step 4: Business Logic
        project = await project_service.create_project(
            project_data=project_data,
            user_id=current_user.id
        )
        
        # Step 5: Database (handled by service)
        # Project is saved to database
        
        # Step 6: Response
        return ProjectResponse.from_orm(project)
        
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create project"
        )
```

## 🗄️ Database Layer

### SQLAlchemy Configuration

```python
# app/db/base.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import get_settings

settings = get_settings()

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow,
    pool_recycle=3600,
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Base class for all models
class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncSession:
    """Dependency to get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    """Initialize database with tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def close_db():
    """Close database connections."""
    await engine.dispose()
```

### Model Design Patterns

```python
# app/models/base.py
from sqlalchemy import Column, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
import uuid

class TimestampMixin:
    """Mixin for timestamp fields."""
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

class UUIDMixin:
    """Mixin for UUID primary key."""
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False
    )

# Usage in models
class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"
    
    # Other fields...
```

### Database Operations

```python
# app/services/base.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Generic, TypeVar, Type, List, Optional

ModelType = TypeVar("ModelType")

class BaseService(Generic[ModelType]):
    """Base service class with common CRUD operations."""
    
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db
    
    async def get(self, id: str) -> Optional[ModelType]:
        """Get record by ID."""
        result = await self.db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> List[ModelType]:
        """Get all records with pagination."""
        result = await self.db.execute(
            select(self.model)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def create(self, obj_data: dict) -> ModelType:
        """Create new record."""
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
    
    async def update(self, id: str, obj_data: dict) -> Optional[ModelType]:
        """Update record by ID."""
        await self.db.execute(
            update(self.model)
            .where(self.model.id == id)
            .values(**obj_data)
        )
        await self.db.commit()
        return await self.get(id)
    
    async def delete(self, id: str) -> bool:
        """Delete record by ID."""
        await self.db.execute(
            delete(self.model).where(self.model.id == id)
        )
        await self.db.commit()
        return True
```

## 🔐 Authentication System

### JWT Token Management

```python
# app/services/auth_service.py
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.core.security import SecurityManager
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.exceptions import AuthenticationError, UserNotFoundError

class AuthService:
    """Authentication service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def authenticate(self, email: str, password: str) -> User:
        """Authenticate user with email and password."""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise UserNotFoundError("User not found")
        
        if not SecurityManager.verify_password(password, user.password):
            raise AuthenticationError("Invalid password")
        
        if not user.is_verified:
            raise AuthenticationError("Account not verified")
        
        return user
    
    def create_tokens(self, user: User) -> dict:
        """Create access and refresh tokens for user."""
        access_token = SecurityManager.create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role.value}
        )
        
        refresh_token = SecurityManager.create_refresh_token(
            data={"sub": str(user.id)}
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    
    async def refresh_token(self, refresh_token: str) -> dict:
        """Refresh access token using refresh token."""
        try:
            payload = SecurityManager.verify_token(refresh_token, "refresh")
            user_id = payload.get("sub")
            
            result = await self.db.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()
            
            if not user:
                raise AuthenticationError("User not found")
            
            return self.create_tokens(user)
            
        except Exception:
            raise AuthenticationError("Invalid refresh token")
```

### Password Policies

```python
# app/core/password_policies.py
import re
from typing import List

class PasswordPolicy:
    """Password validation policies."""
    
    @staticmethod
    def validate_password(password: str) -> List[str]:
        """Validate password against security policies."""
        errors = []
        
        # Length check
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        # Uppercase letter
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        # Lowercase letter
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        
        # Digit
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one digit")
        
        # Special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")
        
        # No common patterns
        common_patterns = ['password', '123456', 'qwerty', 'admin']
        if any(pattern in password.lower() for pattern in common_patterns):
            errors.append("Password cannot contain common patterns")
        
        return errors
    
    @staticmethod
    def generate_password_suggestions() -> List[str]:
        """Generate password improvement suggestions."""
        return [
            "Use a mix of uppercase and lowercase letters",
            "Include numbers and special characters",
            "Avoid common words and patterns",
            "Use a passphrase for better memorability",
            "Consider using a password manager"
        ]
```

## 🚀 API Design Patterns

### Response Standardization

```python
# app/schemas/response.py
from pydantic import BaseModel, Field
from typing import Generic, TypeVar, Optional, Any
from datetime import datetime

DataType = TypeVar('DataType')

class APIResponse(BaseModel, Generic[DataType]):
    """Standard API response format."""
    success: bool = True
    data: Optional[DataType] = None
    message: str = "Operation successful"
    status_code: int = 200
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ErrorResponse(BaseModel):
    """Standard error response format."""
    success: bool = False
    error: dict
    message: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaginatedResponse(BaseModel, Generic[DataType]):
    """Paginated response format."""
    success: bool = True
    data: List[DataType]
    pagination: dict
    message: str = "Data retrieved successfully"
    status_code: int = 200

# Usage in routes
@router.get("/projects", response_model=PaginatedResponse[ProjectResponse])
async def list_projects(
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """List projects with pagination."""
    project_service = ProjectService(db)
    
    projects, total = await project_service.get_paginated(
        page=page,
        limit=limit
    )
    
    return PaginatedResponse(
        data=projects,
        pagination={
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit - 1) // limit
        }
    )
```

### Validation Patterns

```python
# app/schemas/validation.py
from pydantic import BaseModel, validator, Field
from typing import Optional, List
import re

class BaseSchema(BaseModel):
    """Base schema with common validation."""
    
    @validator('*', pre=True)
    def strip_strings(cls, v):
        """Strip whitespace from string fields."""
        if isinstance(v, str):
            return v.strip()
        return v
    
    class Config:
        from_attributes = True
        str_strip_whitespace = True

class EmailValidationMixin(BaseModel):
    """Mixin for email validation."""
    
    @validator('email')
    def validate_email(cls, v):
        """Validate email format."""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()

class SlugValidationMixin(BaseModel):
    """Mixin for slug validation."""
    
    @validator('slug')
    def validate_slug(cls, v):
        """Validate slug format."""
        slug_pattern = r'^[a-z0-9-]+$'
        if not re.match(slug_pattern, v):
            raise ValueError('Slug can only contain lowercase letters, numbers, and hyphens')
        return v
```

## 🧩 Service Layer

### Business Logic Encapsulation

```python
# app/services/project_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, desc
from sqlalchemy.orm import selectinload
from typing import List, Tuple, Optional
from app.models.project import Project, ProjectCategory
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.services.base import BaseService
from app.utils.slug import generate_unique_slug_db
from app.core.exceptions import ValidationError, NotFoundError

class ProjectService(BaseService[Project]):
    """Project service with business logic."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Project, db)
    
    async def create_project(
        self,
        project_data: ProjectCreate,
        user_id: str
    ) -> Project:
        """Create a new project with business logic."""
        
        # Generate unique slug
        slug = await generate_unique_slug_db(
            self.db,
            Project,
            project_data.title
        )
        
        # Validate category
        try:
            category = ProjectCategory(project_data.category.upper())
        except ValueError:
            raise ValidationError(f"Invalid category: {project_data.category}")
        
        # Create project
        project_dict = project_data.dict()
        project_dict.update({
            'slug': slug,
            'category': category.value,
            'author_id': user_id
        })
        
        project = await self.create(project_dict)
        
        # Log activity
        await self._log_activity('project_created', project.id, user_id)
        
        return project
    
    async def get_published_projects(
        self,
        page: int = 1,
        limit: int = 10,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Project], int]:
        """Get published projects with filters."""
        
        query = select(Project).where(Project.is_published == True)
        
        # Apply filters
        conditions = []
        
        if category:
            try:
                cat_enum = ProjectCategory(category.upper())
                conditions.append(Project.category == cat_enum)
            except ValueError:
                pass  # Invalid category, ignore filter
        
        if search:
            search_term = f"%{search}%"
            conditions.append(
                or_(
                    Project.title.ilike(search_term),
                    Project.description.ilike(search_term)
                )
            )
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply ordering and pagination
        query = query.order_by(
            Project.is_featured.desc(),
            Project.created_at.desc()
        ).offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(query)
        projects = result.scalars().all()
        
        return list(projects), total
    
    async def update_project(
        self,
        project_id: str,
        update_data: ProjectUpdate,
        user_id: str
    ) -> Project:
        """Update project with authorization check."""
        
        # Get project
        project = await self.get(project_id)
        if not project:
            raise NotFoundError("Project not found")
        
        # Check authorization
        if project.author_id != user_id:
            raise ValidationError("Not authorized to update this project")
        
        # Update slug if title changed
        if update_data.title and update_data.title != project.title:
            update_data.slug = await generate_unique_slug_db(
                self.db,
                Project,
                update_data.title
            )
        
        # Update project
        updated_project = await self.update(project_id, update_data.dict(exclude_unset=True))
        
        # Log activity
        await self._log_activity('project_updated', project_id, user_id)
        
        return updated_project
    
    async def _log_activity(self, action: str, project_id: str, user_id: str):
        """Log project activity."""
        # Implementation for activity logging
        pass
```

## ⚡ Performance Optimization

### Database Optimization

```python
# app/services/optimized_queries.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload, joinedload
from typing import List, Tuple

class OptimizedQueries:
    """Optimized database queries."""
    
    @staticmethod
    async def get_projects_with_relations(
        db: AsyncSession,
        limit: int = 10
    ) -> List[Project]:
        """
        Get projects with preloaded relations to avoid N+1 queries.
        Uses selectinload for optimal performance.
        """
        result = await db.execute(
            select(Project)
            .options(
                selectinload(Project.author),  # Preload author
                selectinload(Project.technologies)  # Preload technologies
            )
            .where(Project.is_published == True)
            .limit(limit)
        )
        return result.scalars().all()
    
    @staticmethod
    async def get_user_project_stats(
        db: AsyncSession,
        user_id: str
    ) -> dict:
        """
        Get user project statistics with efficient aggregation.
        Single query with multiple aggregations.
        """
        result = await db.execute(
            select(
                func.count(Project.id).label('total_projects'),
                func.count(func.nullif(Project.is_featured, False)).label('featured_projects'),
                func.count(func.nullif(Project.is_published, False)).label('published_projects')
            )
            .where(Project.author_id == user_id)
        )
        
        stats = result.first()
        return {
            'total_projects': stats.total_projects,
            'featured_projects': stats.featured_projects,
            'published_projects': stats.published_projects
        }
```

### Caching Strategy

```python
# app/services/cache_service.py
import json
import hashlib
from typing import Any, Optional
from app.core.config import get_settings

class CacheService:
    """Cache service for performance optimization."""
    
    def __init__(self):
        self.redis_client = None  # Initialize Redis client if available
        self.local_cache = {}  # Fallback local cache
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if self.redis_client:
            try:
                value = await self.redis_client.get(key)
                if value:
                    return json.loads(value)
            except Exception:
                pass  # Fallback to local cache
        
        return self.local_cache.get(key)
    
    async def set(
        self,
        key: str,
        value: Any,
        expire: int = 3600
    ) -> bool:
        """Set value in cache with expiration."""
        serialized_value = json.dumps(value, default=str)
        
        if self.redis_client:
            try:
                await self.redis_client.setex(key, expire, serialized_value)
                return True
            except Exception:
                pass  # Fallback to local cache
        
        self.local_cache[key] = serialized_value
        return True
    
    @staticmethod
    def generate_cache_key(*args) -> str:
        """Generate consistent cache key from arguments."""
        key_string = ':'.join(str(arg) for arg in args)
        return hashlib.md5(key_string.encode()).hexdigest()

# Usage in services
class CachedProjectService(ProjectService):
    """Project service with caching."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.cache = CacheService()
    
    async def get_published_projects(
        self,
        page: int = 1,
        limit: int = 10,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Project], int]:
        """Get projects with caching."""
        
        # Generate cache key
        cache_key = self.cache.generate_cache_key(
            'projects',
            page,
            limit,
            category or '',
            search or ''
        )
        
        # Try cache first
        cached_result = await self.cache.get(cache_key)
        if cached_result:
            return cached_result
        
        # Get from database
        projects, total = await super().get_published_projects(
            page, limit, category, search
        )
        
        # Cache result
        await self.cache.set(cache_key, [projects, total], expire=300)  # 5 minutes
        
        return projects, total
```

## 🔍 Error Handling

### Custom Exception Classes

```python
# app/core/exceptions.py
from fastapi import HTTPException, status

class BaseAPIException(Exception):
    """Base exception for API errors."""
    
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class ValidationError(BaseAPIException):
    """Validation error."""
    
    def __init__(self, message: str, details: dict = None):
        self.details = details or {}
        super().__init__(message, status.HTTP_400_BAD_REQUEST)

class AuthenticationError(BaseAPIException):
    """Authentication error."""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class AuthorizationError(BaseAPIException):
    """Authorization error."""
    
    def __init__(self, message: str = "Access denied"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)

class NotFoundError(BaseAPIException):
    """Resource not found error."""
    
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class ConflictError(BaseAPIException):
    """Conflict error."""
    
    def __init__(self, message: str = "Resource conflict"):
        super().__init__(message, status.HTTP_409_CONFLICT)

class RateLimitError(BaseAPIException):
    """Rate limit exceeded error."""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, status.HTTP_429_TOO_MANY_REQUESTS)

class ExternalServiceError(BaseAPIException):
    """External service error."""
    
    def __init__(self, message: str = "External service error"):
        super().__init__(message, status.HTTP_503_SERVICE_UNAVAILABLE)
```

### Exception Handlers

```python
# app/main.py (exception handlers)
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from app.core.exceptions import BaseAPIException

@app.exception_handler(BaseAPIException)
async def api_exception_handler(request: Request, exc: BaseAPIException):
    """Handle custom API exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "type": exc.__class__.__name__,
                "message": exc.message,
                "details": getattr(exc, 'details', None)
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "type": "HTTPException",
                "message": exc.detail,
                "status_code": exc.status_code
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "type": "InternalServerError",
                "message": "An unexpected error occurred",
                "status_code": 500
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    )
```

## 📊 Monitoring & Logging

### Structured Logging

```python
# app/core/logging.py
import logging
import json
from datetime import datetime
from typing import Dict, Any

class StructuredLogger:
    """Structured logger for better monitoring."""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def log_request(
        self,
        method: str,
        path: str,
        status_code: int,
        duration: float,
        user_id: str = None
    ):
        """Log HTTP request."""
        log_data = {
            "event": "http_request",
            "method": method,
            "path": path,
            "status_code": status_code,
            "duration_ms": round(duration * 1000, 2),
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id
        }
        
        self.logger.info(json.dumps(log_data))
    
    def log_error(
        self,
        error: Exception,
        context: Dict[str, Any] = None
    ):
        """Log error with context."""
        log_data = {
            "event": "error",
            "error_type": error.__class__.__name__,
            "error_message": str(error),
            "context": context or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.logger.error(json.dumps(log_data))
    
    def log_ai_usage(
        self,
        tool_name: str,
        user_id: str,
        input_tokens: int,
        output_tokens: int,
        duration: float
    ):
        """Log AI tool usage."""
        log_data = {
            "event": "ai_usage",
            "tool_name": tool_name,
            "user_id": user_id,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "duration_ms": round(duration * 1000, 2),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.logger.info(json.dumps(log_data))

# Usage in services
logger = StructuredLogger(__name__)

async def analyze_resume(self, resume_text: str, user_id: str):
    start_time = time.time()
    
    try:
        # AI processing logic
        result = await self._process_resume(resume_text)
        
        # Log usage
        duration = time.time() - start_time
        logger.log_ai_usage(
            tool_name="resume_analyzer",
            user_id=user_id,
            input_tokens=len(resume_text.split()),
            output_tokens=len(str(result).split()),
            duration=duration
        )
        
        return result
        
    except Exception as e:
        logger.log_error(e, context={"user_id": user_id, "tool": "resume_analyzer"})
        raise
```

### Performance Monitoring

```python
# app/middleware/monitoring.py
import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging import StructuredLogger

logger = StructuredLogger("monitoring")

class PerformanceMiddleware(BaseHTTPMiddleware):
    """Middleware for performance monitoring."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log performance metrics
        logger.log_request(
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration=duration,
            user_id=getattr(request.state, 'user_id', None)
        )
        
        # Add performance headers
        response.headers["X-Response-Time"] = f"{duration:.3f}s"
        
        return response
```

---

## 📚 Summary

This backend architecture documentation provides:

1. **🏗️ Complete Architecture Overview** - System design and principles
2. **📁 Detailed Project Structure** - File organization and patterns
3. **🔄 Request Flow** - Complete request lifecycle
4. **🗄️ Database Layer** - SQLAlchemy setup and patterns
5. **🔐 Security System** - Authentication and authorization
6. **🚀 API Design** - Standards and best practices
7. **🧩 Service Layer** - Business logic organization
8. **⚡ Performance** - Optimization strategies
9. **🔍 Error Handling** - Exception management
10. **📊 Monitoring** - Logging and metrics

This documentation enables developers to:
- Understand the complete backend architecture
- Modify and extend functionality
- Debug issues effectively
- Follow best practices
- Maintain code quality

---

<div align="center">
  <p>🔧 Backend architecture designed for scalability and maintainability</p>
  <p>📖 Comprehensive documentation for developer understanding</p>
</div>
