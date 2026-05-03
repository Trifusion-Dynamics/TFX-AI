# 🚀 TFX AI - Setup & Deployment Guide

## 📋 Table of Contents

- [🔧 Prerequisites](#-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [🐳 Docker Setup](#-docker-setup)
- [🔧 Manual Setup](#️-manual-setup)
- [🌐 Deployment](#-deployment)
- [🔍 Troubleshooting](#-troubleshooting)
- [📚 Additional Resources](#-additional-resources)

## 🔧 Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.14+ ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** client tools (optional for local development)

### Recommended Tools
- **VS Code** with extensions:
  - Python
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prettier
  - ESLint

### External Services
- **NeonDB** - PostgreSQL hosting ([Sign up](https://neon.tech/))
- **Google Gemini AI** - AI services ([Get API Key](https://ai.google.dev/))
- **Cloudinary** - File storage (optional)
- **Gmail** - Email service (optional)

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd tfxai
```

### 2. Environment Setup
```bash
# Copy environment templates
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local

# Edit environment files with your credentials
nano .env
nano frontend/.env.local
```

### 3. Docker Setup (Recommended)
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🐳 Docker Setup

### Development Environment
```bash
# Start development services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Production Environment
```bash
# Start with production profile
docker-compose --profile production up -d

# Scale services
docker-compose up -d --scale backend=2 --scale frontend=2
```

### Docker Commands
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec frontend sh

# Database operations
docker-compose exec postgres psql -U tfxai_user -d tfxai
```

## 🔧 Manual Setup

### Backend Setup

#### 1. Python Environment
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Database Setup
```bash
# Setup database with seed data
python standalone_db_setup.py

# Verify database
python check_db.py
```

#### 3. Start Backend Server
```bash
# Development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Setup

#### 1. Node.js Environment
```bash
cd frontend

# Install dependencies
npm install

# or with yarn
yarn install
```

#### 2. Environment Configuration
```bash
# Copy environment file
cp .env.local.example .env.local

# Edit with your API URLs
nano .env.local
```

#### 3. Start Frontend Server
```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

## 🌐 Deployment

### Vercel (Frontend)

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy
```bash
cd frontend
vercel --prod
```

#### 3. Environment Variables
Set in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

### Railway (Backend)

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Deploy
```bash
cd backend
railway login
railway init
railway up
```

#### 3. Environment Variables
Set in Railway dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `GEMINI_API_KEY`

### Docker Production

#### 1. Production Docker Compose
```bash
# Create production compose file
cp docker-compose.yml docker-compose.prod.yml

# Edit for production settings
nano docker-compose.prod.yml
```

#### 2. Deploy with Docker
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Setup SSL certificates
# Add nginx configuration
```

### Environment Variables

#### Production .env
```bash
# Application
APP_ENV=production
DEBUG=False
SECRET_KEY=your-super-secure-secret-key

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:port/db

# Security
JWT_SECRET=your-jwt-secret-key
ALLOWED_ORIGINS=https://yourdomain.com

# AI Services
GEMINI_API_KEY=your-production-api-key

# Email
MAIL_USERNAME=your-production-email
MAIL_PASSWORD=your-production-password
```

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check database URL format
echo $DATABASE_URL

# Test connection
python -c "
import asyncpg
import asyncio

async def test():
    try:
        conn = await asyncpg.connect('$DATABASE_URL')
        print('✅ Database connected')
        await conn.close()
    except Exception as e:
        print(f'❌ Error: {e}')

asyncio.run(test())
"
```

#### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :8000
netstat -tulpn | grep :3000

# Kill processes
sudo kill -9 <PID>
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .

# Docker permissions
sudo usermod -aG docker $USER
```

#### Dependency Issues
```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -rf {} +
find . -type f -name "*.pyc" -delete

# Reinstall dependencies
pip uninstall -r requirements.txt -y
pip install -r requirements.txt

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

#### Backend Debug
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Run with debug
uvicorn app.main:app --reload --log-level debug
```

#### Frontend Debug
```bash
# Enable debug mode
NEXT_PUBLIC_DEBUG=true npm run dev

# Build with debug
npm run build:debug
```

### Health Checks

#### Backend Health
```bash
# Check API health
curl http://localhost:8000/health

# Check database
curl http://localhost:8000/api/v1/health/db
```

#### Frontend Health
```bash
# Check frontend
curl http://localhost:3000

# Check API connectivity
curl http://localhost:3000/api/health
```

## 📚 Additional Resources

### Documentation
- [Backend API Docs](http://localhost:8000/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Development Tools
- [Postman](https://www.postman.com/) - API testing
- [DBeaver](https://dbeaver.io/) - Database management
- [GitKraken](https://www.gitkraken.com/) - Git GUI

### Monitoring & Analytics
- [Sentry](https://sentry.io/) - Error tracking
- [Google Analytics](https://analytics.google.com/) - Web analytics
- [LogRocket](https://logrocket.com/) - Session replay

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

## 🚀 Performance Optimization

### Backend Optimization
```bash
# Database indexing
python -c "
# Add indexes to frequently queried columns
"

# Enable caching
export REDIS_URL=redis://localhost:6379/0

# Connection pooling
export DB_POOL_SIZE=20
export DB_MAX_OVERFLOW=30
```

### Frontend Optimization
```bash
# Build optimization
npm run build:analyze

# Image optimization
npm run optimize:images

# Bundle analysis
npm run analyze
```

## 📞 Support

### Getting Help
- 📧 **Email**: support@tfxai.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 **Discord**: [Join our Discord](https://discord.gg/tfxai)
- 📖 **Docs**: [Documentation](https://docs.tfxai.com)

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a Pull Request

---

<div align="center">
  <p>🚀 Happy coding with TFX AI!</p>
  <p>⭐ Star this repo if it helped you!</p>
</div>
