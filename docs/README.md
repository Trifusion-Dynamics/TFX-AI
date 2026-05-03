# 📚 TFX AI - Technical Documentation

<div align="center">
  <img src="https://img.shields.io/badge/Documentation-Comprehensive-blue?logo=readme" alt="Documentation">
  <img src="https://img.shields.io/badge/Developer_Guide-Detailed-green?logo=github" alt="Developer Guide">
  <img src="https://img.shields.io/badge/API_Reference-Complete-orange?logo=fastapi" alt="API Reference">
</div>

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [🔧 Backend Documentation](#-backend-documentation)
- [⚛️ Frontend Documentation](#️-frontend-documentation)
- [🗄️ Database Documentation](#️-database-documentation)
- [🤖 AI Tools Documentation](#-ai-tools-documentation)
- [🔐 Security Documentation](#-security-documentation)
- [🚀 Deployment Documentation](#-deployment-documentation)
- [🧪 Testing Documentation](#️-testing-documentation)
- [🔍 Debugging & Troubleshooting](#-debugging--troubleshooting)

## 🏗️ Architecture Overview

### System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ - React Components│   │ - REST APIs     │    │ - Users         │
│ - State Management│  │ - Authentication │   │ - Projects      │
│ - UI Components  │   │ - AI Integration │   │ - AI Usage      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  External APIs  │
                       │                 │
                       │ - Google Gemini │
                       │ - Cloudinary    │
                       │ - Email Service │
                       └─────────────────┘
```

### Technology Stack

#### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Animations**: Framer Motion

#### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.14
- **Database**: PostgreSQL (NeonDB)
- **ORM**: SQLAlchemy with async support
- **Authentication**: JWT with bcrypt
- **Validation**: Pydantic schemas
- **AI Integration**: Google Gemini API
- **File Storage**: Cloudinary

#### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis (optional)
- **Monitoring**: Structured logging
- **Security**: Rate limiting, CORS, input validation

---

## 🔧 Backend Documentation

### Project Structure

```
backend/
├── app/
│   ├── api/v1/              # API Endpoints
│   │   ├── auth.py          # Authentication routes
│   │   ├── users.py         # User management
│   │   ├── projects.py      # Portfolio management
│   │   ├── ai_tools.py      # AI services
│   │   ├── services.py      # Service catalog
│   │   ├── pricing.py       # Pricing plans
│   │   ├── testimonials.py  # Client testimonials
│   │   ├── blog.py          # Blog posts
│   │   └── admin.py         # Admin endpoints
│   ├── core/                # Core functionality
│   │   ├── config.py        # Application settings
│   │   ├── security.py      # Security utilities
│   │   ├── dependencies.py  # Dependency injection
│   │   └── exceptions.py    # Custom exceptions
│   ├── models/              # Database models
│   │   ├── user.py          # User model
│   │   ├── project.py       # Project model
│   │   ├── service.py       # Service model
│   │   ├── ai_tool_usage.py # AI usage tracking
│   │   └── ...              # Other models
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py          # User schemas
│   │   ├── project.py       # Project schemas
│   │   ├── auth.py          # Auth schemas
│   │   └── ...              # Other schemas
│   ├── services/            # Business logic
│   │   ├── auth_service.py  # Authentication logic
│   │   ├── user_service.py  # User management
│   │   ├── project_service.py # Project logic
│   │   ├── ai_tools_service.py # AI tools logic
│   │   └── ...              # Other services
│   └── utils/               # Utility functions
│       ├── email.py         # Email utilities
│       ├── file_upload.py   # File handling
│       └── slug.py          # URL slug generation
├── alembic/                 # Database migrations
├── tests/                   # Test files
└── requirements.txt         # Python dependencies
```

### API Architecture

#### Authentication Flow

```python
# JWT Authentication Process
1. User Login → Validate Credentials
2. Generate JWT Token (access + refresh)
3. Return Token to Client
4. Client includes token in Authorization header
5. Backend validates token on protected routes
6. Extract user info from token payload
```

#### Request/Response Pattern

```python
# Standard API Response Structure
{
    "success": true,
    "data": {...},           # Response data
    "message": "Operation successful",
    "status_code": 200
}

# Error Response Structure
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {...}      # Validation errors
    },
    "status_code": 422
}
```

### Core Components

#### 1. Configuration Management

```python
# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    database_url: str
    
    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:3000"]
    
    # AI Services
    gemini_api_key: str
    
    class Config:
        env_file = ".env"
```

#### 2. Dependency Injection

```python
# app/core/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.core.security import decode_token
from app.models.user import User
from app.db.base import get_db

async def get_current_user(
    token: str = Depends(HTTPBearer()),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    try:
        payload = decode_token(token.credentials)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        user = await user_service.get_user_by_id(user_id, db)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
            
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
```

#### 3. Service Layer Pattern

```python
# app/services/user_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user with hashed password."""
        hashed_password = bcrypt.hashpw(
            user_data.password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        user = User(
            name=user_data.name,
            email=user_data.email,
            password=hashed_password,
            role=user_data.role
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email address."""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
```

### Database Models

#### User Model

```python
# app/models/user.py
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum
import uuid

class UserRole(Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # Hashed
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_verified = Column(Boolean, default=False)
    avatar = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    ai_usages = relationship("AIToolUsage", back_populates="user")
    projects = relationship("Project", back_populates="author")
```

---

## ⚛️ Frontend Documentation

### Project Structure

```
frontend/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Authentication pages
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   └── layout.tsx      # Auth layout
│   ├── (dashboard)/        # Dashboard pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── projects/       # Project management
│   │   ├── ai-tools/       # AI tools interface
│   │   └── layout.tsx      # Dashboard layout
│   ├── api/                # API routes
│   │   ├── auth/           # Auth API routes
│   │   └── users/          # User API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Homepage
├── components/             # Reusable components
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx     # Button component
│   │   ├── input.tsx      # Input component
│   │   ├── card.tsx       # Card component
│   │   └── ...            # Other UI components
│   ├── forms/             # Form components
│   │   ├── LoginForm.tsx   # Login form
│   │   ├── RegisterForm.tsx # Registration form
│   │   └── ProjectForm.tsx # Project form
│   ├── layout/            # Layout components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── Sidebar.tsx    # Dashboard sidebar
│   │   └── Footer.tsx     # Footer
│   └── common/            # Common components
│       ├── Loading.tsx    # Loading spinner
│       ├── ErrorBoundary.tsx # Error boundary
│       └── SEO.tsx        # SEO component
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth utilities
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Form validations
├── types/                # TypeScript types
│   ├── auth.ts           # Auth types
│   ├── user.ts           # User types
│   ├── project.ts        # Project types
│   └── api.ts            # API response types
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useApi.ts         # API hook
│   └── useLocalStorage.ts # Local storage hook
└── store/                # State management
    ├── authStore.ts      # Auth state
    ├── projectStore.ts   # Project state
    └── uiStore.ts        # UI state
```

### Component Architecture

#### 1. Atomic Design Pattern

```typescript
// Components follow atomic design principles:
// atoms → molecules → organisms → templates → pages

// Atom: Basic UI element
export const Button = ({ variant, size, children, ...props }) => {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }))}
      {...props}
    >
      {children}
    </button>
  )
}

// Molecule: Combination of atoms
export const SearchBox = () => {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search..." />
      <Button>Search</Button>
    </div>
  )
}

// Organism: Complex component
export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          <Navigation />
          <SearchBox />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
```

#### 2. State Management with Zustand

```typescript
// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      }))
    }),
    {
      name: 'auth-storage'
    }
  )
)
```

#### 3. API Client with Axios

```typescript
// lib/api.ts
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Page Architecture

#### 1. App Router Pages

```typescript
// app/(dashboard)/dashboard/page.tsx
import { Suspense } from 'react'
import { DashboardContent } from '@/components/dashboard/DashboardContent'
import { DashboardLoading } from '@/components/dashboard/DashboardLoading'

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

// Server Component for data fetching
async function DashboardContent() {
  const user = await getCurrentUser()
  const stats = await getDashboardStats(user.id)
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <StatsCards stats={stats} />
      <RecentProjects />
      <AIUsageChart />
    </div>
  )
}
```

#### 2. Form Handling with React Hook Form

```typescript
// components/forms/ProjectForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.enum(['AI', 'WEB', 'SAAS', 'OTHER']),
  tech_stack: z.array(z.string()).min(1, 'Select at least one technology')
})

type ProjectFormData = z.infer<typeof projectSchema>

export const ProjectForm = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title">Title</label>
        <Input
          id="title"
          {...register('title')}
          error={errors.title?.message}
        />
      </div>
      
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register('description')}
          className={cn('textarea', errors.description && 'error')}
        />
        {errors.description && (
          <p className="error-text">{errors.description.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Project'}
      </Button>
    </form>
  )
}
```

---

## 🗄️ Database Documentation

### Database Schema

#### Entity Relationship Diagram

```
Users (1) ──────── (M) AIToolUsages
   │
   ├── (1) ──────── (M) Projects
   │
   ├── (1) ──────── (M) BlogPosts
   │
   └── (1) ──────── (M) Testimonials

Services (1) ──────── (M) PricingPlans

Projects (M) ──────── (M) Technologies
```

#### Table Structures

##### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- bcrypt hash
    role VARCHAR(10) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    is_verified BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

##### Projects Table
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    tech_stack JSONB,  -- Array of technologies
    featured_image VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    project_url VARCHAR(500),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_published ON projects(is_published);
CREATE INDEX idx_projects_featured ON projects(is_featured);
```

##### AIToolUsages Table
```sql
CREATE TABLE ai_tool_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_name VARCHAR(100) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_usages_tool ON ai_tool_usages(tool_name);
CREATE INDEX idx_ai_usages_user ON ai_tool_usages(user_id);
CREATE INDEX idx_ai_usages_created ON ai_tool_usages(created_at);
```

### Database Operations

#### Connection Management

```python
# app/db/base.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Create session factory
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db() -> AsyncSession:
    """Dependency to get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

#### Migration System

```python
# alembic/env.py
from alembic import context
from sqlalchemy import engine_from_config, pool
from app.db.base import Base
from app.core.config import settings

# Import all models
from app.models import user, project, service, ai_tool_usage

target_metadata = Base.metadata

def run_migrations_online():
    """Run migrations in 'online' mode."""
    configuration = context.config
    configuration.set_main_option('sqlalchemy.url', settings.database_url)
    
    connectable = engine_from_config(
        configuration.get_section(configuration.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()
```

---

## 🤖 AI Tools Documentation

### AI Integration Architecture

#### Google Gemini Integration

```python
# app/services/ai_tools_service.py
import google.generativeai as genai
from typing import Dict, Any, Optional
import json
import logging

class AIToolsService:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.logger = logging.getLogger(__name__)
    
    async def analyze_resume(self, resume_text: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze resume using AI and provide structured feedback.
        
        Process:
        1. Create structured prompt with resume analysis guidelines
        2. Send to Gemini AI model
        3. Parse JSON response
        4. Log usage for analytics
        5. Return structured analysis
        """
        try:
            prompt = self._create_resume_analysis_prompt(resume_text)
            
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean and parse JSON response
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            
            analysis = json.loads(response_text)
            
            # Log usage
            await self._log_usage(
                tool_name="resume_analyzer",
                input_data={"resume_length": len(resume_text)},
                output_data=analysis,
                user_id=user_id
            )
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Resume analysis failed: {str(e)}")
            raise AIProcessingError("Failed to analyze resume")
    
    def _create_resume_analysis_prompt(self, resume_text: str) -> str:
        """Create structured prompt for resume analysis."""
        return f"""
        You are an expert ATS (Applicant Tracking System) and HR professional. 
        Analyze the following resume and provide detailed feedback in JSON format:
        
        Resume:
        {resume_text}
        
        Provide analysis in this exact JSON format:
        {{
            "overall_score": 85,
            "strengths": ["Strong technical skills", "Clear achievements"],
            "weaknesses": ["Missing quantifiable results", "Limited soft skills"],
            "recommendations": ["Add metrics to achievements", "Include leadership examples"],
            "formatting_score": 90,
            "content_score": 80,
            "ats_compatibility": 85,
            "key_skills": ["Python", "React", "Project Management"],
            "experience_level": "Mid-level",
            "improvement_areas": ["Quantify achievements", "Add certifications"]
        }}
        
        Focus on:
        1. ATS compatibility and keyword optimization
        2. Content quality and completeness
        3. Formatting and structure
        4. Skills and experience presentation
        5. Actionable improvement suggestions
        """
```

#### AI Tool Usage Tracking

```python
# app/services/ai_tools_service.py (continued)
async def _log_usage(
    self,
    tool_name: str,
    input_data: Dict[str, Any],
    output_data: Dict[str, Any],
    user_id: Optional[str] = None,
    ip_address: Optional[str] = None
):
    """Log AI tool usage for analytics and monitoring."""
    try:
        from app.models.ai_tool_usage import AIToolUsage
        
        usage = AIToolUsage(
            tool_name=tool_name,
            input_data=input_data,
            output_data=output_data,
            user_id=user_id,
            ip_address=ip_address
        )
        
        self.db.add(usage)
        await self.db.commit()
        
    except Exception as e:
        self.logger.error(f"Failed to log AI usage: {str(e)}")
```

#### AI Tools API Endpoints

```python
# app/api/v1/routes/ai_tools.py
from fastapi import APIRouter, Depends, HTTPException
from app.services.ai_tools_service import AIToolsService
from app.core.dependencies import get_current_user, optional_user
from app.schemas.ai_tools import ResumeAnalysisRequest, QARequest

router = APIRouter(prefix="/ai-tools", tags=["AI Tools"])

@router.post("/analyze-resume")
async def analyze_resume(
    request: ResumeAnalysisRequest,
    current_user = Depends(get_current_user),
    ai_service: AIToolsService = Depends()
):
    """
    Analyze resume using AI.
    
    Process:
    1. Validate input (resume text minimum length)
    2. Call AI service for analysis
    3. Return structured feedback
    4. Track usage for logged-in users
    """
    if not request.resume_text or len(request.resume_text.strip()) < 100:
        raise HTTPException(
            status_code=400,
            detail="Resume text must be at least 100 characters"
        )
    
    try:
        analysis = await ai_service.analyze_resume(
            resume_text=request.resume_text,
            user_id=current_user.id if current_user else None
        )
        
        return {
            "success": True,
            "data": analysis,
            "message": "Resume analysis completed successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail="AI service temporarily unavailable"
        )

@router.post("/qa-bot")
async def qa_bot(
    request: QARequest,
    user = Depends(optional_user),  # Allow anonymous access
    ai_service: AIToolsService = Depends()
):
    """
    Answer questions using AI.
    
    Features:
    - Contextual answers about TFX AI services
    - Anonymous access allowed
    - Usage tracking for analytics
    """
    try:
        answer = await ai_service.answer_question(
            question=request.question,
            context=request.context,
            user_id=user.id if user else None
        )
        
        return {
            "success": True,
            "data": {
                "question": request.question,
                "answer": answer,
                "timestamp": datetime.utcnow()
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail="Question answering service unavailable"
        )
```

---

## 🔐 Security Documentation

### Authentication & Authorization

#### JWT Token Structure

```python
# app/core/security.py
from jose import jwt
from datetime import datetime, timedelta
from typing import Dict, Optional

class JWTManager:
    def __init__(self):
        self.secret = settings.jwt_secret
        self.algorithm = settings.jwt_algorithm
        self.access_token_expire_minutes = settings.access_token_expire_minutes
    
    def create_access_token(self, data: Dict) -> str:
        """Create JWT access token."""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire, "type": "access"})
        
        return jwt.encode(to_encode, self.secret, algorithm=self.algorithm)
    
    def create_refresh_token(self, data: Dict) -> str:
        """Create JWT refresh token."""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=7)
        to_encode.update({"exp": expire, "type": "refresh"})
        
        return jwt.encode(to_encode, self.secret, algorithm=self.algorithm)
    
    def verify_token(self, token: str) -> Dict:
        """Verify and decode JWT token."""
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise SecurityError("Token has expired")
        except jwt.JWTError:
            raise SecurityError("Invalid token")
```

#### Password Security

```python
# app/core/security.py (continued)
import bcrypt

class PasswordManager:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt."""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash."""
        return bcrypt.checkpw(
            password.encode('utf-8'),
            hashed.encode('utf-8')
        )
```

#### Rate Limiting

```python
# app/core/rate_limiting.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request

limiter = Limiter(key_func=get_remote_address)

# Rate limit decorators
@limiter.limit("100/minute")
async def api_endpoint(request: Request):
    """Allow 100 requests per minute per IP."""
    pass

@limiter.limit("10/minute")
async def auth_endpoint(request: Request):
    """Stricter rate limiting for auth endpoints."""
    pass

@limiter.limit("5/minute")
async def ai_tools_endpoint(request: Request):
    """Very strict rate limiting for AI tools (cost control)."""
    pass
```

### Input Validation & Sanitization

#### Pydantic Schemas

```python
# app/schemas/user.py
from pydantic import BaseModel, EmailStr, validator
import re

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    
    @validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @validator('name')
    def validate_name(cls, v):
        """Validate and sanitize name."""
        # Remove any HTML tags
        clean_name = re.sub(r'<[^>]+>', '', v)
        # Allow only letters, spaces, and basic punctuation
        if not re.match(r'^[a-zA-Z\s\-\'\.]+$', clean_name):
            raise ValueError('Name contains invalid characters')
        return clean_name.strip()
```

#### SQL Injection Prevention

```python
# Using SQLAlchemy ORM (automatically prevents SQL injection)
async def get_user_by_email(email: str, db: AsyncSession):
    """Safe query using SQLAlchemy parameterized queries."""
    result = await db.execute(
        select(User).where(User.email == email)  # Parameterized, safe
    )
    return result.scalar_one_or_none()

# Never do this (vulnerable):
# query = f"SELECT * FROM users WHERE email = '{email}'"
```

### CORS & Security Headers

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Security headers middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "yourdomain.com"]
)

# HTTPS redirect (production only)
if settings.app_env == "production":
    app.add_middleware(HTTPSRedirectMiddleware)
```

---

## 📚 Continue to Next Documentation Sections

The documentation continues with:

- [🚀 Deployment Documentation](./deployment.md)
- [🧪 Testing Documentation](./testing.md)
- [🔍 Debugging & Troubleshooting](./debugging.md)

---

<div align="center">
  <p>📖 This documentation provides comprehensive understanding of TFX AI architecture</p>
  <p>👥 Designed for developers to understand, modify, and extend the system</p>
</div>
