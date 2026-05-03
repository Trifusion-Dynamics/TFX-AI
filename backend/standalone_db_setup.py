#!/usr/bin/env python3
"""
Standalone NeonDB setup script
Creates tables and seeds data without SQLAlchemy dependencies
"""

import asyncio
import asyncpg
import bcrypt
import uuid
from datetime import datetime

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

async def create_tables_and_seed():
    """Create tables and seed data directly with asyncpg"""
    
    # Database connection string
    db_url = "postgresql://neondb_owner:npg_Gd74AmkTZqcn@ep-red-brook-a812s3fi-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
    
    print("🚀 Connecting to NeonDB...")
    
    try:
        # Connect to database
        conn = await asyncpg.connect(db_url)
        print("✅ Connected to NeonDB successfully!")
        
        # Create tables
        print("📝 Creating tables...")
        
        # Users table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'USER',
                avatar VARCHAR(500),
                is_verified BOOLEAN DEFAULT FALSE,
                refresh_token TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        # Services table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(200) NOT NULL,
                slug VARCHAR(200) UNIQUE NOT NULL,
                description TEXT,
                icon VARCHAR(50),
                features JSONB,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        # Projects table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(200) NOT NULL,
                slug VARCHAR(200) UNIQUE NOT NULL,
                description TEXT,
                category VARCHAR(50),
                tech_stack JSONB,
                featured_image VARCHAR(500),
                is_featured BOOLEAN DEFAULT FALSE,
                is_published BOOLEAN DEFAULT FALSE,
                project_url VARCHAR(500),
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        # Pricing plans table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS pricing_plans (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                price DECIMAL(10,2) DEFAULT 0,
                billing_cycle VARCHAR(20) DEFAULT 'ONE_TIME',
                features JSONB,
                is_popular BOOLEAN DEFAULT FALSE,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        # Testimonials table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS testimonials (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                client_name VARCHAR(100) NOT NULL,
                client_role VARCHAR(100),
                company VARCHAR(100),
                content TEXT NOT NULL,
                rating INTEGER DEFAULT 5,
                avatar VARCHAR(500),
                is_featured BOOLEAN DEFAULT FALSE,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        # Blog posts table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS blog_posts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(200) NOT NULL,
                slug VARCHAR(200) UNIQUE NOT NULL,
                excerpt TEXT,
                content TEXT,
                category VARCHAR(50),
                tags JSONB,
                featured_image VARCHAR(500),
                is_published BOOLEAN DEFAULT FALSE,
                reading_time INTEGER DEFAULT 0,
                author_id UUID REFERENCES users(id),
                views INTEGER DEFAULT 0,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        # Case studies table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS case_studies (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(200) NOT NULL,
                slug VARCHAR(200) UNIQUE NOT NULL,
                client VARCHAR(100),
                category VARCHAR(50),
                summary TEXT,
                problem TEXT,
                solution TEXT,
                result TEXT,
                metrics JSONB,
                tech_stack JSONB,
                featured_image VARCHAR(500),
                is_published BOOLEAN DEFAULT FALSE,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        # AI tool usage table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS ai_tool_usages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                tool_name VARCHAR(100) NOT NULL,
                input_data JSONB,
                output_data JSONB,
                user_id UUID REFERENCES users(id),
                ip_address VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        print("✅ All tables created successfully!")
        
        # Seed data
        print("🌱 Seeding data...")
        
        # Create admin user
        admin_password = hash_password("Admin@123")
        await conn.execute("""
            INSERT INTO users (name, email, password, role, is_verified)
            VALUES ($1, $2, $3, $4, $5)
        """, "TFX Admin", "admin@tfxai.com", admin_password, "ADMIN", True)
        
        # Create test user
        test_password = hash_password("Test@123")
        await conn.execute("""
            INSERT INTO users (name, email, password, role, is_verified)
            VALUES ($1, $2, $3, $4, $5)
        """, "Test User", "test@tfxai.com", test_password, "USER", True)
        
        # Get admin user ID for blog posts
        admin_result = await conn.fetchrow("SELECT id FROM users WHERE email = $1", "admin@tfxai.com")
        admin_id = admin_result['id'] if admin_result else None
        
        # Create services
        services = [
            ("Web Development", "web-development", "Custom, scalable websites and web applications built with modern technologies. We create responsive, SEO-optimized solutions that drive business growth.", ["Responsive Design", "SEO Optimized", "Performance First", "CMS Integration", "E-commerce Ready"], 1),
            ("AI Chatbot Development", "ai-chatbot-development", "Intelligent chatbots powered by LLMs like GPT and Gemini. Transform your customer service with AI-driven conversations.", ["GPT/Gemini Powered", "Multi-platform", "Training on your data", "Analytics Dashboard", "24/7 Support"], 2),
            ("SaaS Development", "saas-development", "End-to-end SaaS product development from concept to deployment. Build scalable, multi-tenant applications.", ["Multi-tenant", "Subscription Billing", "Admin Panel", "API-first", "Scalable Architecture"], 3),
            ("UI/UX Design", "ui-ux-design", "Modern, conversion-focused designs that delight users and drive engagement. From wireframes to polished interfaces.", ["Figma Prototypes", "User Research", "Design System", "Responsive", "Handoff Ready"], 4),
            ("API Development", "api-development", "Robust REST and GraphQL APIs that power modern applications. Secure, scalable, and well-documented.", ["FastAPI/Node.js", "Auth & Security", "Documentation", "Testing", "Rate Limiting"], 5)
        ]
        
        for title, slug, desc, features, order in services:
            import json
            await conn.execute("""
                INSERT INTO services (title, slug, description, features, order_index)
                VALUES ($1, $2, $3, $4, $5)
            """, title, slug, desc, json.dumps(features), order)
        
        # Create projects
        projects = [
            ("ClinicMind AI", "clinicmind-ai", "AI-powered hospital management system with intelligent patient scheduling and diagnosis assistance.", "AI", ["Next.js", "FastAPI", "PostgreSQL", "OpenAI"], True, True, "https://clinicmind.ai", 1),
            ("ZestEats", "zesteats", "Food delivery platform with real-time tracking and AI-powered restaurant recommendations.", "WEB", ["React", "Node.js", "MongoDB", "Stripe"], True, True, "https://zesteats.com", 2),
            ("AutoFlow", "autoflow", "Business automation platform with workflow management and team collaboration tools.", "SAAS", ["Next.js", "FastAPI", "NeonDB", "BullMQ"], True, True, "https://autoflow.io", 3)
        ]
        
        for title, slug, desc, category, tech_stack, featured, published, url, order in projects:
            import json
            await conn.execute("""
                INSERT INTO projects (title, slug, description, category, tech_stack, is_featured, is_published, project_url, order_index)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """, title, slug, desc, category, json.dumps(tech_stack), featured, published, url, order)
        
        # Create pricing plans
        pricing = [
            ("Starter", "starter", "Perfect for small businesses and startups", 15000, "ONE_TIME", ["1 Page Website", "Basic SEO", "3 Revisions", "1 Month Support", "Deployment"], False, 1),
            ("Pro", "pro", "Ideal for growing businesses", 35000, "ONE_TIME", ["Up to 10 Pages", "AI Chatbot Integration", "Unlimited Revisions", "3 Months Support", "Admin Panel", "SEO Optimized"], True, 2),
            ("Enterprise", "enterprise", "Custom solutions for large organizations", 0, "ONE_TIME", ["Custom Everything", "Dedicated Support", "Full Source Code", "6 Months Support", "SLA Guarantee"], False, 3)
        ]
        
        for name, slug, desc, price, cycle, features, popular, order in pricing:
            import json
            await conn.execute("""
                INSERT INTO pricing_plans (name, slug, description, price, billing_cycle, features, is_popular, order_index)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """, name, slug, desc, price, cycle, json.dumps(features), popular, order)
        
        # Create testimonials
        testimonials = [
            ("Rahul Sharma", "CTO", "StartupX", "TFX AI transformed our business with their AI chatbot solution. The implementation was seamless and the results exceeded our expectations. Customer satisfaction increased by 40%!", 5, True, 1),
            ("Priya Mehta", "Founder", "EduTech", "Exceptional quality and delivery. The web application they built for us is robust, scalable, and our users love it. The team's technical expertise is unmatched.", 5, True, 2),
            ("Amit Patel", "CEO", "RetailCo", "Great team, professional approach, and excellent communication throughout the project. They delivered our SaaS platform on time and within budget.", 4, True, 3)
        ]
        
        for name, role, company, content, rating, featured, order in testimonials:
            await conn.execute("""
                INSERT INTO testimonials (client_name, client_role, company, content, rating, is_featured, order_index)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            """, name, role, company, content, rating, featured, order)
        
        print("✅ Data seeded successfully!")
        print("🎉 TFX AI Database setup complete!")
        
        # Show summary
        print("\n📊 DATABASE SUMMARY:")
        tables = await conn.fetch("""
            SELECT table_name, 
                   (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        
        for table in tables:
            print(f"  ✅ {table['table_name']} ({table['columns']} columns)")
        
        print(f"\n🔑 LOGIN CREDENTIALS:")
        print(f"  Admin: admin@tfxai.com / Admin@123")
        print(f"  Test:  test@tfxai.com / Test@123")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(create_tables_and_seed())
