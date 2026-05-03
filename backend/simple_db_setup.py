#!/usr/bin/env python3
"""
Simple NeonDB setup script using direct asyncpg
Creates tables and seeds data
"""

import asyncio
import asyncpg
from app.core.security import hash_password

async def create_tables_and_seed():
    """Create tables and seed data directly with asyncpg"""
    
    # Database connection string
    db_url = "postgresql://neondb_owner:npg_2JgLoNuX7OGB@ep-little-glitter-amqrb4g6-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    
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
            ON CONFLICT (email) DO NOTHING
        """, "TFX Admin", "admin@tfxai.com", admin_password, "ADMIN", True)
        
        # Create test user
        test_password = hash_password("Test@123")
        await conn.execute("""
            INSERT INTO users (name, email, password, role, is_verified)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING
        """, "Test User", "test@tfxai.com", test_password, "USER", True)
        
        # Create services
        services = [
            ("Web Development", "web-development", "Custom, scalable websites and web applications built with modern technologies.", ["Responsive Design", "SEO Optimized", "Performance First", "CMS Integration", "E-commerce Ready"], 1),
            ("AI Chatbot Development", "ai-chatbot-development", "Intelligent chatbots powered by LLMs like GPT and Gemini.", ["GPT/Gemini Powered", "Multi-platform", "Training on your data", "Analytics Dashboard", "24/7 Support"], 2),
            ("SaaS Development", "saas-development", "End-to-end SaaS product development from concept to deployment.", ["Multi-tenant", "Subscription Billing", "Admin Panel", "API-first", "Scalable Architecture"], 3),
            ("UI/UX Design", "ui-ux-design", "Modern, conversion-focused designs that delight users.", ["Figma Prototypes", "User Research", "Design System", "Responsive", "Handoff Ready"], 4),
            ("API Development", "api-development", "Robust REST and GraphQL APIs that power modern applications.", ["FastAPI/Node.js", "Auth & Security", "Documentation", "Testing", "Rate Limiting"], 5)
        ]
        
        for title, slug, desc, features, order in services:
            await conn.execute("""
                INSERT INTO services (title, slug, description, features, order_index)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (slug) DO NOTHING
            """, title, slug, desc, features, order)
        
        print("✅ Data seeded successfully!")
        print("🎉 TFX AI Database setup complete!")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(create_tables_and_seed())
