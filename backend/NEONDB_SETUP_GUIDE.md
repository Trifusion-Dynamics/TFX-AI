# TFX AI NeonDB Setup Guide

## 🚀 Database Setup Script

### Step 1: Install Required Dependencies
```bash
pip install asyncpg sqlalchemy[asyncio] alembic
```

### Step 2: Update .env file
Make sure your .env file has the correct NeonDB URL:
```
DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_2JgLoNuX7OGB@ep-little-glitter-amqrb4g6-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Step 3: Run Database Setup
```bash
python simple_db_setup.py
```

### Step 4: Verify Setup
Once setup completes, you'll have:
- ✅ All database tables created
- ✅ Admin user: admin@tfxai.com / Admin@123
- ✅ Test user: test@tfxai.com / Test@123
- ✅ 5 Services with realistic data
- ✅ Sample projects, pricing, testimonials, blog posts, case studies

## 📊 Tables Created

1. **users** - User authentication and profiles
2. **services** - TFX AI services
3. **projects** - Portfolio projects
4. **pricing_plans** - Service pricing
5. **testimonials** - Client testimonials
6. **blog_posts** - Blog articles
7. **case_studies** - Case studies
8. **ai_tool_usages** - AI tool usage tracking

## 🔑 Default Credentials

- **Admin**: admin@tfxai.com / Admin@123
- **Test User**: test@tfxai.com / Test@123

## 🚨 Troubleshooting

If you get connection errors:
1. Check internet connection
2. Verify NeonDB URL is correct
3. Make sure NeonDB is active
4. Try running the script again after some time

## 🎯 Next Steps

After database setup:
1. Start the FastAPI server: `uvicorn app.main:app --reload`
2. Visit: http://localhost:8000/docs
3. Test API endpoints
4. Login with admin credentials

## 📱 API Endpoints to Test

- `POST /api/v1/auth/login` - Login
- `GET /api/v1/services` - Get services
- `POST /api/v1/ai-tools/qa-bot` - Test AI tools
- `GET /api/v1/admin/dashboard` - Admin dashboard (requires admin login)

---

**Note**: If network issues persist, you can temporarily use SQLite for local development by changing:
```
DATABASE_URL=sqlite+aiosqlite:///./tfxai.db
```
And install: `pip install aiosqlite`
