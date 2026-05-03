# TFX AI Backend

AI + Web Development Agency Backend API built with FastAPI, PostgreSQL, and modern Python stack.

## 🚀 Features

- **FastAPI** - Modern async web framework with automatic OpenAPI docs
- **PostgreSQL** - NeonDB with SQLAlchemy 2.0 async ORM
- **Authentication** - JWT-based auth with role-based access control
- **File Uploads** - Cloudinary integration for media management
- **Email Service** - FastAPI-Mail for transactional emails
- **AI Integration** - Google Gemini AI for intelligent features
- **Database Migrations** - Alembic with async support
- **Type Safety** - Full type hints with Pydantic v2
- **Error Handling** - Custom exception handlers with proper responses
- **Pagination** - Reusable pagination utilities
- **Validation** - Comprehensive input validation

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python 3.11+)
- **Database**: NeonDB (PostgreSQL) + SQLAlchemy 2.0 (async)
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose + passlib bcrypt)
- **File Upload**: Cloudinary
- **Email**: FastAPI-Mail (SMTP)
- **AI**: Google Gemini (google-generativeai)
- **Validation**: Pydantic v2
- **Package Manager**: pip + requirements.txt

## 📋 Prerequisites

- Python 3.11+
- NeonDB account
- Cloudinary account (optional)
- Google Gemini API key (optional)
- SMTP email account (optional)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd backend
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` file with your credentials:

```env
# App
APP_NAME=TFX AI
APP_ENV=development
APP_PORT=8000
CLIENT_URL=http://localhost:3000
SECRET_KEY=your-super-secret-key-here

# Database (NeonDB)
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname?ssl=require

# JWT
JWT_SECRET=your-jwt-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Email (optional)
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_STARTTLS=True
MAIL_SSL_TLS=False

# Gemini AI (optional)
GEMINI_API_KEY=your_gemini_key
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

```bash
# Initialize database
alembic upgrade head

# Create admin user (optional)
python -m app.db.init_db
```

### 5. Start Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Access the Application

- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📁 Project Structure

```
backend/
├── alembic/                  # Database migrations
│   ├── versions/
│   └── env.py
├── app/
│   ├── api/v1/routes/        # API route handlers
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── user.py          # User management
│   │   ├── contact.py       # Contact form
│   │   ├── service.py       # Services CRUD
│   │   ├── project.py       # Project portfolio
│   │   ├── blog.py          # Blog platform
│   │   ├── newsletter.py    # Newsletter
│   │   ├── testimonial.py   # Testimonials
│   │   ├── pricing.py       # Pricing plans
│   │   ├── case_study.py    # Case studies
│   │   ├── ai_tools.py      # AI tools
│   │   └── admin.py         # Admin endpoints
│   ├── core/                # Core application components
│   │   ├── config.py        # Settings management
│   │   ├── security.py      # JWT & password hashing
│   │   ├── dependencies.py  # FastAPI dependencies
│   │   └── exceptions.py    # Custom exceptions
│   ├── db/                  # Database configuration
│   │   ├── base.py          # SQLAlchemy setup
│   │   └── init_db.py       # Database seeding
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── user.py          # User model
│   │   ├── lead.py          # Lead model
│   │   ├── service.py       # Service model
│   │   ├── project.py       # Project model
│   │   ├── blog.py          # Blog model
│   │   ├── newsletter.py    # Newsletter model
│   │   ├── testimonial.py   # Testimonial model
│   │   ├── pricing.py       # Pricing model
│   │   ├── case_study.py    # Case study model
│   │   ├── ai_tool_usage.py # AI usage tracking
│   │   └── site_config.py   # Site configuration
│   ├── schemas/             # Pydantic schemas
│   │   ├── common.py        # Common response schemas
│   │   ├── auth.py          # Authentication schemas
│   │   ├── user.py          # User schemas
│   │   ├── lead.py          # Lead schemas
│   │   ├── service.py       # Service schemas
│   │   ├── project.py       # Project schemas
│   │   ├── blog.py          # Blog schemas
│   │   ├── newsletter.py    # Newsletter schemas
│   │   ├── testimonial.py   # Testimonial schemas
│   │   ├── pricing.py       # Pricing schemas
│   │   ├── case_study.py    # Case study schemas
│   │   └── ai_tools.py      # AI tools schemas
│   ├── services/            # Business logic layer
│   │   ├── auth_service.py  # Authentication logic
│   │   ├── user_service.py  # User management
│   │   ├── contact_service.py # Contact logic
│   │   ├── service_service.py # Service logic
│   │   ├── project_service.py # Project logic
│   │   ├── blog_service.py  # Blog logic
│   │   ├── newsletter_service.py # Newsletter logic
│   │   ├── testimonial_service.py # Testimonial logic
│   │   ├── pricing_service.py # Pricing logic
│   │   ├── case_study_service.py # Case study logic
│   │   └── ai_tools_service.py # AI tools logic
│   ├── utils/               # Utility functions
│   │   ├── email.py         # Email helper
│   │   ├── cloudinary.py    # Cloudinary helper
│   │   ├── slug.py          # Slug generation
│   │   ├── pagination.py    # Pagination helper
│   │   └── gemini.py        # Gemini AI helper
│   └── main.py              # FastAPI app entry point
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── alembic.ini             # Alembic configuration
└── requirements.txt        # Python dependencies
```

## 🔐 Authentication

The API uses JWT tokens for authentication:

### Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@tfxai.com", "password": "admin123"}'
```

### Protected Routes
Include `Authorization: Bearer <token>` header.

### User Roles
- **user**: Regular user access
- **admin**: Administrative access
- **super_admin**: Full system access

## 🤖 AI Tools Integration

The application includes AI-powered tools:

### Chatbot
```bash
curl -X POST "http://localhost:8000/api/v1/ai-tools/chatbot" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how can you help me?"}'
```

### Text Generation
```bash
curl -X POST "http://localhost:8000/api/v1/ai-tools/generate-text" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a professional email", "temperature": 0.7}'
```

## 📧 Email Configuration

Configure SMTP settings in `.env`:

```env
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

## ☁️ Cloudinary Setup

1. Create Cloudinary account
2. Get credentials from dashboard
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🧪 Testing

Run tests with pytest:

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## 🗄️ Database Migrations

### Create New Migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Rollback Migration
```bash
alembic downgrade -1
```

## 🚀 Deployment

### Environment Setup
1. Set `APP_ENV=production`
2. Configure production database URL
3. Set strong `SECRET_KEY` and `JWT_SECRET`
4. Configure all external services

### Render Deployment

#### 1. Prepare for Render
- Ensure all environment variables are set in Render dashboard
- Update `requirements.txt` with all dependencies
- Add `Procfile` (optional)

#### 2. Render Configuration
**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables (Render Dashboard):**
```
APP_NAME=TFX AI
APP_ENV=production
APP_PORT=8000
CLIENT_URL=https://your-frontend-domain.com
SECRET_KEY=your-super-secret-production-key
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname?ssl=require
JWT_SECRET=your-production-jwt-secret
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your@gmail.com
```

#### 3. Database Migration on Render
Add to your build command:
```bash
pip install -r requirements.txt && alembic upgrade head
```

#### 4. Health Checks
Render will automatically use `/health` endpoint for health checks.

### Docker Deployment

#### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - DATABASE_URL=postgresql+asyncpg://postgres:password@db:5432/tfxai
      - SECRET_KEY=your-secret-key
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=tfxai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Production Checklist

#### Security
- [ ] Use strong, unique secrets
- [ ] Enable SSL/TLS
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all sensitive data
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

#### Performance
- [ ] Configure connection pooling
- [ ] Enable caching (Redis)
- [ ] Set up CDN for static assets
- [ ] Monitor database performance
- [ ] Set up proper indexes

#### Monitoring
- [ ] Set up application monitoring
- [ ] Configure error tracking
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerting

#### Backup & Recovery
- [ ] Configure database backups
- [ ] Test restore procedures
- [ ] Document recovery process
- [ ] Set up disaster recovery plan

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

### Content Management
- `GET /api/v1/services` - List services
- `GET /api/v1/projects` - List projects
- `GET /api/v1/blog` - List blog posts
- `GET /api/v1/testimonials` - List testimonials
- `GET /api/v1/pricing` - List pricing plans

### AI Tools
- `POST /api/v1/ai-tools/chatbot` - AI chatbot
- `POST /api/v1/ai-tools/generate-text` - Text generation

### Admin
- `GET /api/v1/admin/dashboard` - Admin dashboard
- `GET /api/v1/admin/users` - User management

## 🔧 Configuration

All configuration is managed through environment variables. See `.env.example` for all available options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and ensure they pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Email**: support@tfxai.com
- **Documentation**: See API docs at `/docs`
- **Issues**: Create an issue in the repository

---

**TFX AI** - Transforming ideas into intelligent solutions
