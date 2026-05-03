# 🚀 Deployment Guide

## 📋 Table of Contents

- [🎯 Deployment Overview](#-deployment-overview)
- [🐳 Docker Deployment](#-docker-deployment)
- [☁️ Cloud Deployment](#️-cloud-deployment)
- [🔧 Environment Configuration](#-environment-configuration)
- [📊 Monitoring & Logging](#-monitoring--logging)
- [🔒 Security & SSL](#-security--ssl)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [📈 Performance Optimization](#-performance-optimization)
- [🔍 Troubleshooting](#-troubleshooting)
- [📋 Maintenance Checklist](#-maintenance-checklist)

## 🎯 Deployment Overview

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Stack                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Frontend  │  │   Backend   │  │    Database        │   │
│  │   (Next.js) │  │   (FastAPI) │  │   (PostgreSQL)     │   │
│  │             │  │             │  │                     │   │
│  │ - Vercel    │  │ - Railway   │  │ - NeonDB           │   │
│  │ - Netlify   │  │ - AWS       │  │ - AWS RDS          │   │
│  │ - Docker    │  │ - DigitalOcean│ │ - Self-hosted      │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   CDN       │  │   Cache     │  │    Monitoring       │   │
│  │             │  │             │  │                     │   │
│  │ - Cloudflare│  │ - Redis     │  │ - Sentry           │   │
│  │ - AWS CloudFront│ │ - Memcached │  │ - Datadog          │   │
│  │ - Fastly    │  │ - In-memory │  │ - Grafana          │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Storage   │  │   Email     │  │      Analytics       │   │
│  │             │  │             │  │                     │   │
│  │ - AWS S3    │  │ - SendGrid  │  │ - Google Analytics │   │
│  │ - Cloudinary│  │ - Mailgun   │  │ - Mixpanel         │   │
│  │ - DigitalOcean│ │ - AWS SES   │  │ - Hotjar           │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Options

1. **🐳 Docker Deployment** - Self-hosted with Docker Compose
2. **☁️ Cloud Platforms** - Vercel, Railway, AWS, DigitalOcean
3. **🔧 Hybrid Deployment** - Mix of cloud and self-hosted services
4. **📱 Edge Deployment** - CDN and edge computing

### Prerequisites

- **Domain Name**: For SSL and custom URLs
- **SSL Certificates**: For HTTPS security
- **Monitoring Tools**: For production monitoring
- **Backup Strategy**: For data protection
- **CI/CD Pipeline**: For automated deployments

## 🐳 Docker Deployment

### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Frontend (Next.js)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: tfxai-frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.tfxai.com
      - NEXT_PUBLIC_APP_URL=https://tfxai.com
    networks:
      - tfxai-network
    depends_on:
      - backend

  # Backend (FastAPI)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: tfxai-backend
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - DATABASE_URL=postgresql+asyncpg://user:pass@postgres:5432/tfxai
      - REDIS_URL=redis://redis:6379/0
      - JWT_SECRET=${JWT_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    networks:
      - tfxai-network
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: tfxai-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=tfxai
      - POSTGRES_USER=tfxai_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    networks:
      - tfxai-network
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: tfxai-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    networks:
      - tfxai-network
    volumes:
      - redis_data:/data

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: tfxai-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    networks:
      - tfxai-network
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:

networks:
  tfxai-network:
    driver: bridge
```

### Production Dockerfiles

#### Backend Dockerfile.prod

```dockerfile
# backend/Dockerfile.prod
FROM python:3.14-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
        && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -r app && useradd -r -g app app

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Change ownership
RUN chown -R app:app /app

# Switch to app user
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

#### Frontend Dockerfile.prod

```dockerfile
# frontend/Dockerfile.prod
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Nginx Configuration

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream servers
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8000;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name tfxai.com www.tfxai.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name tfxai.com www.tfxai.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # CORS headers
            add_header Access-Control-Allow-Origin $http_origin;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Authorization, Content-Type";
            add_header Access-Control-Allow-Credentials true;
        }

        # Auth endpoints with stricter rate limiting
        location /api/v1/auth/ {
            limit_req zone=login burst=5 nodelay;
            
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /_next/static/ {
            proxy_pass http://frontend;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health checks
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## ☁️ Cloud Deployment

### Vercel Deployment (Frontend)

```json
// frontend/vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/health",
      "dest": "/health"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url",
    "NEXT_PUBLIC_APP_URL": "@app_url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@api_url"
    }
  }
}
```

#### Vercel Deployment Script

```bash
#!/bin/bash
# deploy-vercel.sh

echo "🚀 Deploying to Vercel..."

# Install dependencies
cd frontend
npm install

# Build application
npm run build

# Deploy to Vercel
npx vercel --prod

echo "✅ Frontend deployed to Vercel!"
```

### Railway Deployment (Backend)

```dockerfile
# backend/Dockerfile
FROM python:3.14-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", $PORT]
```

#### Railway Configuration

```json
// backend/railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health"
  }
}
```

#### Railway Deployment Script

```bash
#!/bin/bash
# deploy-railway.sh

echo "🚀 Deploying to Railway..."

# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
cd backend
railway up

echo "✅ Backend deployed to Railway!"
```

### AWS Deployment

#### ECS Task Definition

```json
{
  "family": "tfxai-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "tfxai-backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/tfxai-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "APP_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:tfxai-db-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/tfxai-backend",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# .env.production
# Application
APP_NAME=TFX AI
APP_ENV=production
APP_PORT=8000
SECRET_KEY=your-super-secure-secret-key
CLIENT_URL=https://tfxai.com

# Database
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/tfxai
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=30

# Security
JWT_SECRET=your-jwt-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=https://tfxai.com,https://www.tfxai.com

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# AI Services
GEMINI_API_KEY=your-gemini-api-key

# Email
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587

# Redis
REDIS_URL=redis://user:password@host:6379/0

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=INFO

# SSL
SSL_MODE=require
FORCE_SSL=True
```

### Configuration Management

```python
# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Production settings with environment variable loading."""
    
    # Application
    app_name: str = os.getenv("APP_NAME", "TFX AI")
    app_env: str = os.getenv("APP_ENV", "production")
    app_port: int = int(os.getenv("APP_PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Database
    database_url: str = os.getenv("DATABASE_URL")
    db_pool_size: int = int(os.getenv("DB_POOL_SIZE", "20"))
    db_max_overflow: int = int(os.getenv("DB_MAX_OVERFLOW", "30"))
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY")
    jwt_secret: str = os.getenv("JWT_SECRET")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    
    # CORS
    allowed_origins: List[str] = os.getenv("ALLOWED_ORIGINS", "https://tfxai.com").split(",")
    
    # Rate Limiting
    rate_limit_requests: int = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    rate_limit_window: int = int(os.getenv("RATE_LIMIT_WINDOW", "60"))
    
    # AI Services
    gemini_api_key: str = os.getenv("GEMINI_API_KEY")
    
    # Email
    mail_username: Optional[str] = os.getenv("MAIL_USERNAME")
    mail_password: Optional[str] = os.getenv("MAIL_PASSWORD")
    mail_from: Optional[str] = os.getenv("MAIL_FROM")
    
    # Redis
    redis_url: Optional[str] = os.getenv("REDIS_URL")
    
    # Monitoring
    sentry_dsn: Optional[str] = os.getenv("SENTRY_DSN")
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

def get_settings() -> Settings:
    """Get settings instance."""
    return Settings()
```

## 📊 Monitoring & Logging

### Sentry Integration

```python
# app/core/monitoring.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from app.core.config import get_settings

settings = get_settings()

if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[
            FastApiIntegration(auto_enabling_integrations=False),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=0.1,
        environment=settings.app_env,
        release="1.0.0",
    )
```

### Structured Logging

```python
# app/core/logging.py
import logging
import json
from datetime import datetime
from typing import Dict, Any

class StructuredLogger:
    """Structured logger for production monitoring."""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.setup_logging()
    
    def setup_logging(self):
        """Setup logging configuration."""
        logging.basicConfig(
            level=logging.INFO,
            format='%(message)s',
            handlers=[
                logging.StreamHandler(),
                logging.FileHandler('/app/logs/app.log')
            ]
        )
    
    def log_request(self, method: str, path: str, status_code: int, duration: float, user_id: str = None):
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
    
    def log_error(self, error: Exception, context: Dict[str, Any] = None):
        """Log error with context."""
        log_data = {
            "event": "error",
            "error_type": error.__class__.__name__,
            "error_message": str(error),
            "context": context or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.logger.error(json.dumps(log_data))
    
    def log_ai_usage(self, tool_name: str, user_id: str, duration: float, cost: float):
        """Log AI tool usage."""
        log_data = {
            "event": "ai_usage",
            "tool_name": tool_name,
            "user_id": user_id,
            "duration_ms": round(duration * 1000, 2),
            "cost_usd": round(cost, 6),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.logger.info(json.dumps(log_data))
```

### Health Checks

```python
# app/api/v1/health.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.base import get_db
import redis.asyncio as redis
import time

router = APIRouter()

@router.get("/health")
async def health_check():
    """Basic health check."""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0"
    }

@router.get("/health/detailed")
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health check with dependencies."""
    health_status = {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0",
        "checks": {}
    }
    
    # Database check
    try:
        result = await db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = {
            "status": "healthy",
            "response_time_ms": 0
        }
    except Exception as e:
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_status["status"] = "unhealthy"
    
    # Redis check
    try:
        redis_client = redis.from_url(settings.redis_url)
        start_time = time.time()
        await redis_client.ping()
        response_time = (time.time() - start_time) * 1000
        
        health_status["checks"]["redis"] = {
            "status": "healthy",
            "response_time_ms": round(response_time, 2)
        }
    except Exception as e:
        health_status["checks"]["redis"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_status["status"] = "unhealthy"
    
    # AI service check
    try:
        from app.services.ai_tools_service import AIToolsService
        ai_service = AIToolsService(db)
        
        # Simple test
        result = await ai_service.answer_question("Test question")
        
        health_status["checks"]["ai_service"] = {
            "status": "healthy",
            "response_time_ms": result.get("metadata", {}).get("processing_time", 0) * 1000
        }
    except Exception as e:
        health_status["checks"]["ai_service"] = {
            "status": "unhealthy",
            "error": str(e)
        }
    
    return health_status
```

## 🔒 Security & SSL

### SSL Certificate Setup

```bash
#!/bin/bash
# setup-ssl.sh

DOMAIN="tfxai.com"
EMAIL="admin@tfxai.com"

# Install Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Setup auto-renewal
sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "✅ SSL certificate setup complete!"
```

### Security Headers Middleware

```python
# app/middleware/security.py
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # HSTS (HTTPS only)
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # Content Security Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self' https://api.tfxai.com https://www.google-analytics.com; "
            "frame-ancestors 'none';"
        )
        response.headers["Content-Security-Policy"] = csp
        
        return response
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.14'
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
        pip install pytest pytest-asyncio
    
    - name: Run tests
      run: |
        cd backend
        pytest tests/ -v
    
    - name: Run frontend tests
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Railway
      run: |
        curl -X POST https://backboard.railway.app/graphql/v2 \
          -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"query": "mutation { deployProject(input: { projectId: \"${{ secrets.RAILWAY_PROJECT_ID }}\" }) { id } }"}'

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting TFX AI deployment..."

# Environment variables
ENVIRONMENT=${1:-production}
BACKUP_DIR="/backups"
LOG_FILE="/var/log/deploy.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Pre-deployment checks
pre_deploy() {
    log "🔍 Running pre-deployment checks..."
    
    # Check environment variables
    if [ -z "$DATABASE_URL" ]; then
        log "❌ DATABASE_URL not set"
        exit 1
    fi
    
    # Check disk space
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 80 ]; then
        log "⚠️ Disk usage is high: ${DISK_USAGE}%"
    fi
    
    # Backup database
    log "💾 Creating database backup..."
    pg_dump $DATABASE_URL > "$BACKUP_DIR/pre-deploy-$(date +%Y%m%d_%H%M%S).sql"
    
    log "✅ Pre-deployment checks completed"
}

# Deploy backend
deploy_backend() {
    log "🔧 Deploying backend..."
    
    cd backend
    
    # Pull latest code
    git pull origin main
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Run database migrations
    alembic upgrade head
    
    # Restart service
    sudo systemctl restart tfxai-backend
    
    # Wait for service to start
    sleep 10
    
    # Health check
    if curl -f http://localhost:8000/health > /dev/null; then
        log "✅ Backend deployed successfully"
    else
        log "❌ Backend deployment failed"
        exit 1
    fi
}

# Deploy frontend
deploy_frontend() {
    log "🎨 Deploying frontend..."
    
    cd frontend
    
    # Pull latest code
    git pull origin main
    
    # Install dependencies
    npm ci
    
    # Build application
    npm run build
    
    # Deploy to Vercel
    npx vercel --prod
    
    log "✅ Frontend deployed successfully"
}

# Post-deployment checks
post_deploy() {
    log "🔍 Running post-deployment checks..."
    
    # Check services
    SERVICES=("tfxai-backend" "tfxai-frontend" "nginx" "postgres" "redis")
    
    for service in "${SERVICES[@]}"; do
        if systemctl is-active --quiet $service; then
            log "✅ $service is running"
        else
            log "❌ $service is not running"
            exit 1
        fi
    done
    
    # Check endpoints
    ENDPOINTS=("https://tfxai.com/health" "https://api.tfxai.com/health")
    
    for endpoint in "${ENDPOINTS[@]}"; do
        if curl -f $endpoint > /dev/null; then
            log "✅ $endpoint is healthy"
        else
            log "❌ $endpoint is not responding"
            exit 1
        fi
    done
    
    log "✅ Post-deployment checks completed"
}

# Rollback function
rollback() {
    log "🔄 Rolling back deployment..."
    
    # Restore database backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        log "💾 Restoring database from $LATEST_BACKUP"
        psql $DATABASE_URL < $LATEST_BACKUP
    fi
    
    # Restart services
    sudo systemctl restart tfxai-backend
    
    log "✅ Rollback completed"
}

# Main deployment flow
main() {
    case $ENVIRONMENT in
        "production")
            pre_deploy
            deploy_backend
            deploy_frontend
            post_deploy
            ;;
        "rollback")
            rollback
            ;;
        *)
            echo "Usage: $0 [production|rollback]"
            exit 1
            ;;
    esac
    
    log "🎉 Deployment completed successfully!"
}

# Error handling
trap 'log "❌ Deployment failed!"; rollback; exit 1' ERR

# Run main function
main
```

## 📈 Performance Optimization

### Database Optimization

```sql
-- Database performance optimizations

-- Create indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_published_featured 
ON projects(is_published, is_featured, order_index DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_usages_user_tool_date 
ON ai_tool_usages(user_id, tool_name, created_at DESC);

-- Analyze tables for query planning
ANALYZE users;
ANALYZE projects;
ANALYZE ai_tool_usages;

-- Update table statistics
VACUUM ANALYZE;

-- Monitor slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Caching Strategy

```python
# app/core/cache.py
import redis.asyncio as redis
import json
import hashlib
from typing import Any, Optional
from datetime import timedelta

class CacheManager:
    """Redis cache manager."""
    
    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        try:
            value = await self.redis.get(key)
            return json.loads(value) if value else None
        except Exception:
            return None
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        ttl: int = 3600
    ) -> bool:
        """Set value in cache."""
        try:
            serialized = json.dumps(value, default=str)
            await self.redis.setex(key, ttl, serialized)
            return True
        except Exception:
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache."""
        try:
            await self.redis.delete(key)
            return True
        except Exception:
            return False
    
    @staticmethod
    def generate_key(*args) -> str:
        """Generate cache key from arguments."""
        key_string = ':'.join(str(arg) for arg in args)
        return hashlib.md5(key_string.encode()).hexdigest()

# Usage in services
class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.cache = CacheManager(settings.redis_url)
    
    async def get_popular_projects(self) -> List[Project]:
        """Get popular projects with caching."""
        cache_key = self.cache.generate_key('popular_projects')
        
        # Try cache first
        cached = await self.cache.get(cache_key)
        if cached:
            return cached
        
        # Get from database
        projects = await self.db.execute(
            select(Project)
            .where(Project.is_featured == True)
            .limit(10)
        )
        
        # Cache result
        await self.cache.set(cache_key, projects, ttl=1800)  # 30 minutes
        
        return projects.scalars().all()
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
SELECT * FROM pg_stat_activity WHERE datname = 'tfxai';

# Reset connections
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'tfxai';
```

#### 2. Memory Issues

```bash
# Check memory usage
free -h

# Check process memory
ps aux --sort=-%mem | head -10

# Check Docker container memory
docker stats --no-stream
```

#### 3. SSL Certificate Issues

```bash
# Check SSL certificate
openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout

# Test SSL configuration
openssl s_client -connect tfxai.com:443

# Renew certificate
sudo certbot renew --dry-run
```

#### 4. Performance Issues

```bash
# Check system load
top
htop

# Check disk I/O
iotop

# Check network
ss -tuln
netstat -tuln
```

### Debugging Tools

```python
# app/utils/debug.py
import logging
import traceback
from typing import Any, Dict

class DebugLogger:
    """Enhanced debugging logger."""
    
    def __init__(self):
        self.logger = logging.getLogger("debug")
    
    def log_exception(self, exception: Exception, context: Dict[str, Any] = None):
        """Log detailed exception information."""
        error_info = {
            "exception_type": exception.__class__.__name__,
            "exception_message": str(exception),
            "traceback": traceback.format_exc(),
            "context": context or {},
        }
        
        self.logger.error(f"Exception occurred: {error_info}")
    
    def log_performance(self, operation: str, duration: float, details: Dict[str, Any] = None):
        """Log performance metrics."""
        perf_info = {
            "operation": operation,
            "duration_ms": duration * 1000,
            "details": details or {},
        }
        
        self.logger.info(f"Performance: {perf_info}")
    
    def log_request(self, request_data: Dict[str, Any]):
        """Log request information."""
        self.logger.info(f"Request: {request_data}")

# Usage in routes
@router.post("/api/v1/projects")
async def create_project(project_data: ProjectCreate):
    debug_logger = DebugLogger()
    
    try:
        debug_logger.log_request({
            "endpoint": "/api/v1/projects",
            "method": "POST",
            "data": project_data.dict()
        })
        
        start_time = time.time()
        
        # Your logic here
        project = await create_project_internal(project_data)
        
        duration = time.time() - start_time
        debug_logger.log_performance("create_project", duration, {
            "project_id": project.id
        })
        
        return project
        
    except Exception as e:
        debug_logger.log_exception(e, {
            "endpoint": "/api/v1/projects",
            "project_data": project_data.dict()
        })
        raise
```

## 📋 Maintenance Checklist

### Daily Tasks

- [ ] Check application health endpoints
- [ ] Monitor error rates in Sentry
- [ ] Check disk space usage
- [ ] Review system performance metrics
- [ ] Check backup completion

### Weekly Tasks

- [ ] Review and rotate logs
- [ ] Update security patches
- [ ] Check SSL certificate expiration
- [ ] Review database performance
- [ ] Monitor AI usage and costs

### Monthly Tasks

- [ ] Database maintenance (VACUUM, ANALYZE)
- [ ] Review and update dependencies
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Backup verification

### Quarterly Tasks

- [ ] Disaster recovery testing
- [ ] Capacity planning
- [ ] Security assessment
- [ ] Architecture review
- [ ] Documentation updates

### Emergency Procedures

```bash
#!/bin/bash
# emergency.sh

echo "🚨 EMERGENCY PROCEDURES"

# 1. Quick health check
echo "🔍 Checking application health..."
curl -f https://api.tfxai.com/health || echo "❌ API down"
curl -f https://tfxai.com/health || echo "❌ Frontend down"

# 2. Check services
echo "🔧 Checking services..."
systemctl status tfxai-backend
systemctl status nginx
systemctl status postgres

# 3. Check resources
echo "📊 Checking resources..."
free -h
df -h

# 4. Check logs
echo "📋 Checking recent errors..."
tail -n 50 /var/log/nginx/error.log
tail -n 50 /app/logs/app.log

# 5. Quick fixes
echo "🔧 Attempting quick fixes..."

# Restart services if needed
if ! systemctl is-active --quiet tfxai-backend; then
    echo "🔄 Restarting backend..."
    systemctl restart tfxai-backend
fi

if ! systemctl is-active --quiet nginx; then
    echo "🔄 Restarting nginx..."
    systemctl restart nginx
fi

echo "✅ Emergency procedures completed"
```

---

## 📚 Summary

This deployment guide provides:

1. **🎯 Complete Deployment Strategy** - Multiple deployment options
2. **🐳 Docker Configuration** - Production-ready containers
3. **☁️ Cloud Platform Setup** - Vercel, Railway, AWS configurations
4. **🔧 Environment Management** - Production configuration
5. **📊 Monitoring Setup** - Logging, health checks, analytics
6. **🔒 Security Configuration** - SSL, headers, best practices
7. **🔄 CI/CD Pipeline** - Automated deployment workflows
8. **📈 Performance Optimization** - Caching, database tuning
9. **🔍 Troubleshooting** - Common issues and solutions
10. **📋 Maintenance** - Regular tasks and procedures

This documentation enables:
- **Smooth deployment** to production environments
- **Reliable monitoring** and alerting
- **Quick troubleshooting** of production issues
- **Regular maintenance** and updates
- **Scalable architecture** for growth

---

<div align="center">
  <p>🚀 Production deployment guide for reliable operations</p>
  <p>📖 Comprehensive documentation for deployment success</p>
</div>
