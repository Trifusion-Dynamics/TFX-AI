# 🚀 TFX AI - Full-Stack AI-Powered Development Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.0-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-NeonDB-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Python-3.14-blue?logo=python" alt="Python">
</div>

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [📚 API Documentation](#-api-documentation)
- [🛠️ Development](#️-development)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Overview

**TFX AI** is a cutting-edge full-stack web application that showcases modern AI-powered development capabilities. Built with Next.js 15 and FastAPI, it provides a comprehensive platform for AI services, project management, and client interactions.

### 🎯 Key Highlights

- **🤖 AI-Powered Tools**: Resume analyzer, text generator, and QA bot using Google Gemini AI
- **👥 User Management**: Complete authentication system with role-based access control
- **💼 Portfolio Management**: Dynamic project showcase with filtering and search
- **💰 Pricing Plans**: Flexible service pricing with multiple tiers
- **📝 Content Management**: Blog posts, case studies, and testimonials
- **🔒 Security**: JWT authentication, rate limiting, and input validation

## ✨ Features

### 🤖 AI Tools Module
- **Resume Analyzer**: AI-powered resume analysis and feedback
- **Text Generator**: Intelligent text generation for various use cases
- **QA Bot**: Contextual question answering system
- **Usage Tracking**: Comprehensive AI tool usage analytics

### 👥 User Management
- **Authentication**: Secure JWT-based login/registration
- **Role System**: Admin and User roles with different permissions
- **Profile Management**: User profile updates and avatar upload
- **Email Verification**: Account verification via email

### 💼 Portfolio System
- **Project Showcase**: Dynamic portfolio with categories (AI, Web, SaaS)
- **Tech Stack Display**: Technology stack visualization
- **Featured Projects**: Highlighted projects section
- **Search & Filter**: Advanced project filtering capabilities

### 💰 Business Features
- **Service Catalog**: Comprehensive service offerings
- **Pricing Plans**: Multiple pricing tiers with features
- **Client Testimonials**: Customer feedback showcase
- **Contact Forms**: Lead generation and contact management

### 📝 Content Management
- **Blog System**: Article publishing and management
- **Case Studies**: Detailed project case studies
- **SEO Optimization**: Meta tags and structured data
- **Responsive Design**: Mobile-first design approach

## 🏗️ Architecture

### Frontend (Next.js 15)
```
frontend/
├── app/                    # App Router structure
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── ui/              # UI components (shadcn/ui)
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── lib/                 # Utility functions
└── types/              # TypeScript definitions
```

### Backend (FastAPI)
```
backend/
├── app/
│   ├── api/v1/          # API endpoints
│   ├── core/            # Core functionality
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── alembic/            # Database migrations
└── tests/              # Test files
```

### Database (PostgreSQL - NeonDB)
- **Users**: Authentication and profiles
- **Projects**: Portfolio items
- **Services**: Service catalog
- **AI Tool Usage**: Usage analytics
- **Content**: Blog posts, testimonials, case studies
- **Pricing**: Service pricing plans

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.14+
- PostgreSQL (NeonDB recommended)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tfxai
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL and API keys

# Setup database
python standalone_db_setup.py

# Start development server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your API URLs

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Admin Dashboard**: http://localhost:3000/admin

### 🔑 Default Login
- **Admin**: `admin@tfxai.com` / `Admin@123`
- **Test User**: `test@tfxai.com` / `Test@123`

## 📁 Project Structure

```
tfxai/
├── README.md              # This file
├── .gitignore            # Git ignore rules
├── docker-compose.yml    # Docker configuration
├── .env.example          # Environment template
│
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/v1/      # API endpoints
│   │   │   ├── auth.py  # Authentication
│   │   │   ├── users.py # User management
│   │   │   ├── projects.py # Portfolio
│   │   │   ├── ai_tools.py # AI services
│   │   │   └── admin.py # Admin endpoints
│   │   ├── core/        # Core functionality
│   │   │   ├── config.py # Settings
│   │   │   ├── security.py # Auth
│   │   │   └── dependencies.py # DI
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utilities
│   ├── alembic/         # Database migrations
│   ├── requirements.txt # Python dependencies
│   └── .env            # Environment variables
│
└── frontend/            # Next.js frontend
    ├── app/            # App Router
    │   ├── (auth)/     # Auth pages
    │   ├── (dashboard)/# Dashboard
    │   ├── api/        # API routes
    │   └── globals.css # Styles
    ├── components/     # Reusable components
    │   ├── ui/        # shadcn/ui components
    │   ├── forms/     # Form components
    │   └── layout/    # Layout components
    ├── lib/           # Utilities
    ├── types/         # TypeScript types
    ├── public/        # Static assets
    └── package.json   # Dependencies
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```bash
# App Configuration
APP_NAME=TFX AI
APP_ENV=development
APP_PORT=8000
SECRET_KEY=your-super-secret-key

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host/db

# JWT Authentication
JWT_SECRET=your-jwt-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15

# Email Service
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your@gmail.com

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Frontend Environment Variables (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/users/me` - Get current user

### AI Tools Endpoints
- `POST /api/v1/ai-tools/analyze-resume` - Resume analysis
- `POST /api/v1/ai-tools/generate-text` - Text generation
- `POST /api/v1/ai-tools/qa-bot` - QA bot
- `GET /api/v1/ai-tools/history` - Usage history

### Portfolio Endpoints
- `GET /api/v1/projects` - List projects
- `GET /api/v1/projects/{slug}` - Get project details
- `GET /api/v1/services` - List services
- `GET /api/v1/pricing` - Get pricing plans

### Admin Endpoints
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/users` - User management
- `POST /api/v1/admin/projects` - Create project

### 📖 Interactive API Docs
Visit http://localhost:8000/docs for interactive API documentation.

## 🛠️ Development

### Backend Development
```bash
# Run tests
pytest

# Database migrations
alembic revision --autogenerate -m "Description"
alembic upgrade head

# Code formatting
black app/
isort app/

# Type checking
mypy app/
```

### Frontend Development
```bash
# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Database Management
```bash
# Setup database
python standalone_db_setup.py

# Check database status
python check_db.py

# Reset database
python setup_database.py
```

## 🚀 Deployment

### Backend Deployment (Docker)
```dockerfile
FROM python:3.14-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Deployment (Vercel)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Environment Setup
- **Production**: Use production database URLs
- **Environment Variables**: Set all required env vars
- **SSL**: Enable HTTPS for production
- **Monitoring**: Set up logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 Development Guidelines
- Follow code conventions (Prettier, Black)
- Write tests for new features
- Update documentation
- Use meaningful commit messages

## 📊 Tech Stack

### Frontend Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Framer Motion** - Animation library
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend Technologies
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM with async support
- **PostgreSQL** - Database (NeonDB)
- **Pydantic** - Data validation
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Alembic** - Database migrations

### AI & External Services
- **Google Gemini AI** - AI model integration
- **Cloudinary** - File storage
- **SMTP** - Email service
- **Redis** - Caching (optional)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt encryption
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Pydantic schemas
- **CORS Protection**: Cross-origin security
- **SQL Injection Prevention**: ORM protection
- **HTTPS Ready**: SSL configuration

## 📈 Performance

- **Database Optimization**: Indexed queries
- **Caching Strategy**: Redis integration
- **Image Optimization**: Cloudinary CDN
- **Code Splitting**: Next.js optimization
- **Lazy Loading**: Component-level loading
- **API Rate Limiting**: Performance protection

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL format
2. **AI API Errors**: Verify GEMINI_API_KEY
3. **CORS Issues**: Check allowed origins
4. **Build Errors**: Clear node_modules and reinstall

### Debug Mode
```bash
# Backend debug mode
uvicorn app.main:app --reload --log-level debug

# Frontend debug mode
NEXT_PUBLIC_DEBUG=true npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **FastAPI** - Modern Python web framework
- **NeonDB** - PostgreSQL hosting
- **Google Gemini** - AI model capabilities
- **shadcn/ui** - Beautiful UI components

## 📞 Support

For support and questions:
- 📧 Email: arun.builds.tech@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Trifusion-Dynamics/TFX-AI/issues)
- 📖 Docs: [Documentation](./docs/README.md)

---

## 👨‍💻 Developer

**Arun Kumar Bind**
- 📧 Email: arun.builds.tech@gmail.com
- 🌐 GitHub: [Trifusion-Dynamics](https://github.com/Trifusion-Dynamics)
- 💼 LinkedIn: [Arun Kumar Bind](https://linkedin.com/in/arun-kumar-bind)

---

<div align="center">
  <p>🚀 Built with ❤️ by Arun Kumar Bind</p>
  <p>⭐ Star this repo if it helped you!</p>
</div>
