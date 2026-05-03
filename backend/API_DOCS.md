# TFX AI — API Reference

## Base URL
- **Local**: http://localhost:8000/api/v1
- **Production**: https://tfx-ai-backend.onrender.com/api/v1
- **Swagger UI**: /docs
- **ReDoc**: /redoc

## Authentication
Most endpoints require authentication using Bearer tokens:
```
Authorization: Bearer <access_token>
```

Get tokens by logging in via `/api/v1/auth/login`.

## Rate Limiting
- **AI Tools endpoints**: 20 requests/hour per IP
- **Other endpoints**: Standard rate limits apply
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## All Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| **Authentication** |
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | User login |
| POST | `/auth/refresh` | No | Refresh access token |
| POST | `/auth/forgot-password` | No | Forgot password |
| POST | `/auth/reset-password` | No | Reset password |
| POST | `/auth/verify-email` | No | Verify email |
| POST | `/auth/resend-verification` | No | Resend verification |
| **Users** |
| GET | `/users/me` | Yes | Get my profile |
| PATCH | `/users/me` | Yes | Update my profile |
| DELETE | `/users/me` | Yes | Delete my account |
| **Contact** |
| POST | `/contact` | No | Submit contact form |
| GET | `/contact` | Admin | Get all contacts |
| **Services** |
| GET | `/services` | No | Get all services |
| GET | `/services/{slug}` | No | Get service by slug |
| POST | `/services` | Admin | Create service |
| PATCH | `/services/{id}` | Admin | Update service |
| DELETE | `/services/{id}` | Admin | Delete service |
| **Projects** |
| GET | `/projects` | No | Get all projects |
| GET | `/projects/featured` | No | Get featured projects |
| GET | `/projects/{slug}` | No | Get project by slug |
| POST | `/projects` | Admin | Create project |
| PATCH | `/projects/{id}` | Admin | Update project |
| DELETE | `/projects/{id}` | Admin | Delete project |
| **Blog** |
| GET | `/blog` | No | Get all blog posts |
| GET | `/blog/featured` | No | Get featured posts |
| GET | `/blog/{slug}` | No | Get post by slug |
| POST | `/blog` | Admin | Create blog post |
| PATCH | `/blog/{id}` | Admin | Update blog post |
| DELETE | `/blog/{id}` | Admin | Delete blog post |
| **Newsletter** |
| POST | `/newsletter/subscribe` | No | Subscribe to newsletter |
| GET | `/newsletter` | Admin | Get all subscribers |
| DELETE | `/newsletter/{id}` | Admin | Delete subscriber |
| **Testimonials** |
| GET | `/testimonials` | No | Get all testimonials |
| GET | `/testimonials/featured` | No | Get featured testimonials |
| POST | `/testimonials` | Admin | Create testimonial |
| PATCH | `/testimonials/{id}` | Admin | Update testimonial |
| DELETE | `/testimonials/{id}` | Admin | Delete testimonial |
| **Pricing** |
| GET | `/pricing` | No | Get all pricing plans |
| GET | `/pricing/{slug}` | No | Get plan by slug |
| POST | `/pricing` | Admin | Create pricing plan |
| PATCH | `/pricing/{id}` | Admin | Update pricing plan |
| DELETE | `/pricing/{id}` | Admin | Delete pricing plan |
| **Case Studies** |
| GET | `/case-studies` | No | Get all case studies |
| GET | `/case-studies/{slug}` | No | Get case study by slug |
| POST | `/case-studies` | Admin | Create case study |
| PATCH | `/case-studies/{id}` | Admin | Update case study |
| DELETE | `/case-studies/{id}` | Admin | Delete case study |
| **AI Tools** |
| POST | `/ai-tools/resume-analyzer` | No | Analyze resume with AI |
| POST | `/ai-tools/text-generator` | No | Generate text with AI |
| POST | `/ai-tools/qa-bot` | No | Ask AI assistant |
| GET | `/ai-tools/history` | Yes | Get usage history |
| GET | `/admin/ai-tools/stats` | Admin | Get AI tools stats |
| **Admin** |
| GET | `/admin/dashboard` | Admin | Get dashboard stats |
| GET | `/admin/users` | Admin | Get all users |
| PATCH | `/admin/users/{id}/role` | Admin | Update user role |
| DELETE | `/admin/users/{id}` | Admin | Delete user |
| **Health** |
| GET | `/health` | No | Health check |
| GET | `/` | No | Root endpoint |

## Request/Response Examples

### Register User
**Request:**
```json
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "is_verified": false,
      "created_at": "2025-01-01T00:00:00Z"
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### Login
**Request:**
```json
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "is_verified": true
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### Contact Form
**Request:**
```json
POST /api/v1/contact
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in your AI development services."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Project Inquiry",
    "status": "PENDING",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### AI Resume Analyzer
**Request:**
```json
POST /api/v1/ai-tools/resume-analyzer
{
  "resume_text": "John Doe\nSoftware Engineer with 5 years of experience..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "overall_score": 85,
    "ats_score": 80,
    "sections": {
      "contact": { "score": 18, "feedback": "Good contact information" },
      "summary": { "score": 16, "feedback": "Strong professional summary" },
      "experience": { "score": 22, "feedback": "Detailed experience section" },
      "skills": { "score": 17, "feedback": "Good technical skills listed" },
      "education": { "score": 12, "feedback": "Education details clear" }
    },
    "strengths": ["Strong technical background", "Clear career progression"],
    "improvements": ["Add more quantifiable achievements", "Include certifications"],
    "keywords": {
      "found": ["Python", "JavaScript", "React"],
      "missing": ["Docker", "AWS", "Machine Learning"]
    },
    "final_verdict": "Strong resume with good technical foundation"
  }
}
```

### AI Text Generator
**Request:**
```json
POST /api/v1/ai-tools/text-generator
{
  "topic": "Artificial Intelligence in Healthcare",
  "type": "blog_intro",
  "tone": "professional",
  "length": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Text generated successfully",
  "data": {
    "generated_text": "Artificial Intelligence is revolutionizing healthcare by enabling more accurate diagnoses, personalized treatment plans, and efficient drug discovery...",
    "word_count": 156,
    "type": "blog_intro",
    "tone": "professional"
  }
}
```

### AI QA Bot
**Request:**
```json
POST /api/v1/ai-tools/qa-bot
{
  "question": "What services does TFX AI offer?",
  "context": "I'm looking for web development services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Question answered successfully",
  "data": {
    "answer": "TFX AI offers comprehensive web development services including custom websites, web applications, e-commerce solutions, and AI-powered chatbots. We specialize in modern technologies like React, Next.js, and FastAPI.",
    "confidence": "high"
  }
}
```

## Error Codes Reference

| Status Code | Error Type | Description |
|-------------|-----------|-------------|
| 400 | Validation Error | Request data is invalid |
| 401 | Unauthorized | Authentication required or invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 503 | AI Service Unavailable | AI service temporarily down |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error details"]
  }
}
```

## Headers

### Request Headers
- `Authorization: Bearer <token>` (for authenticated endpoints)
- `Content-Type: application/json`
- `X-Request-ID: <uuid>` (automatically added)

### Response Headers
- `X-Request-ID: <uuid>` (unique request identifier)
- `X-Process-Time: <seconds>` (request processing time)
- `X-RateLimit-Limit: <number>` (rate limit)
- `X-RateLimit-Remaining: <number>` (remaining requests)
- `X-RateLimit-Reset: <timestamp>` (rate limit reset time)

## Pagination
List endpoints support pagination with query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

## Webhooks
Currently no webhooks are supported, but they may be added in future versions.

## SDKs
Official SDKs are not yet available. Use REST API directly.

## Support
For API support, contact:
- Email: api-support@tfxai.com
- Documentation: https://docs.tfxai.com
- Issues: https://github.com/tfx-ai/backend/issues

## Changelog
### v1.0.0 (Current)
- Initial API release
- Authentication system
- Full CRUD operations
- AI Tools integration
- Rate limiting
- Admin dashboard

---

*Last updated: January 2025*
