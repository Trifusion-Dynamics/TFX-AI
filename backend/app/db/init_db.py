"""
Database initialization and seeding.
"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.base import AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.site_config import SiteConfig
from app.models.service import Service
from app.models.project import Project, ProjectCategory
from app.models.pricing import PricingPlan, BillingCycle
from app.models.testimonial import Testimonial
from app.models.blog import BlogPost
from app.models.case_study import CaseStudy
from app.core.security import hash_password
import logging

logger = logging.getLogger(__name__)


async def seed_database(db: AsyncSession):
    """
    Seed the database with complete realistic data.
    """
    logger.info("Seeding database with full realistic data...")
    
    try:
        # === USERS ===
        # Create admin user
        result = await db.execute(
            select(User).where(User.email == "admin@tfxai.com")
        )
        admin_user = result.scalar_one_or_none()
        
        if admin_user is None:
            admin_user = User(
                name="TFX Admin",
                email="admin@tfxai.com",
                password=hash_password("Admin@123"),
                role=UserRole.ADMIN,
                is_verified=True
            )
            db.add(admin_user)
            logger.info("Admin user created: admin@tfxai.com")
        else:
            logger.info("Admin user already exists")
        
        # Get admin user ID for blog posts
        await db.flush()  # Ensure we have the ID
        admin_id = str(admin_user.id)
        
        # Test user
        result = await db.execute(
            select(User).where(User.email == "test@tfxai.com")
        )
        test_user = result.scalar_one_or_none()
        
        if test_user is None:
            test_user = User(
                name="Test User",
                email="test@tfxai.com",
                password=hash_password("Test@123"),
                role=UserRole.USER,
                is_verified=True
            )
            db.add(test_user)
            logger.info("Test user created: test@tfxai.com")
        
        # === SERVICES ===
        services_data = [
            {
                "title": "Web Development",
                "slug": "web-development",
                "description": "Custom, scalable websites and web applications built with modern technologies. We create responsive, SEO-optimized solutions that drive business growth.",
                "icon": "web",
                "features": [
                    "Responsive Design",
                    "SEO Optimized", 
                    "Performance First",
                    "CMS Integration",
                    "E-commerce Ready"
                ],
                "order_index": 1
            },
            {
                "title": "AI Chatbot Development",
                "slug": "ai-chatbot-development", 
                "description": "Intelligent chatbots powered by LLMs like GPT and Gemini. Transform your customer service with AI-driven conversations.",
                "icon": "chatbot",
                "features": [
                    "GPT/Gemini Powered",
                    "Multi-platform",
                    "Training on your data",
                    "Analytics Dashboard",
                    "24/7 Support"
                ],
                "order_index": 2
            },
            {
                "title": "SaaS Development",
                "slug": "saas-development",
                "description": "End-to-end SaaS product development from concept to deployment. Build scalable, multi-tenant applications.",
                "icon": "saas",
                "features": [
                    "Multi-tenant",
                    "Subscription Billing",
                    "Admin Panel",
                    "API-first",
                    "Scalable Architecture"
                ],
                "order_index": 3
            },
            {
                "title": "UI/UX Design",
                "slug": "ui-ux-design",
                "description": "Modern, conversion-focused designs that delight users and drive engagement. From wireframes to polished interfaces.",
                "icon": "design",
                "features": [
                    "Figma Prototypes",
                    "User Research",
                    "Design System",
                    "Responsive",
                    "Handoff Ready"
                ],
                "order_index": 4
            },
            {
                "title": "API Development",
                "slug": "api-development",
                "description": "Robust REST and GraphQL APIs that power modern applications. Secure, scalable, and well-documented.",
                "icon": "api",
                "features": [
                    "FastAPI/Node.js",
                    "Auth & Security",
                    "Documentation",
                    "Testing",
                    "Rate Limiting"
                ],
                "order_index": 5
            }
        ]
        
        for service_data in services_data:
            result = await db.execute(
                select(Service).where(Service.slug == service_data["slug"])
            )
            existing = result.scalar_one_or_none()
            
            if existing is None:
                service = Service(**service_data)
                db.add(service)
                logger.info(f"Service created: {service_data['title']}")
        
        # === PROJECTS ===
        projects_data = [
            {
                "title": "ClinicMind AI",
                "slug": "clinicmind-ai",
                "description": "AI-powered hospital management system with intelligent patient scheduling and diagnosis assistance.",
                "category": ProjectCategory.AI,
                "tech_stack": ["Next.js", "FastAPI", "PostgreSQL", "OpenAI"],
                "featured_image": "clinicmind.jpg",
                "is_featured": True,
                "is_published": True,
                "project_url": "https://clinicmind.ai",
                "order_index": 1
            },
            {
                "title": "ZestEats",
                "slug": "zesteats",
                "description": "Food delivery platform with real-time tracking and AI-powered restaurant recommendations.",
                "category": ProjectCategory.WEB,
                "tech_stack": ["React", "Node.js", "MongoDB", "Stripe"],
                "featured_image": "zesteats.jpg",
                "is_featured": True,
                "is_published": True,
                "project_url": "https://zesteats.com",
                "order_index": 2
            },
            {
                "title": "AutoFlow",
                "slug": "autoflow",
                "description": "Business automation platform with workflow management and team collaboration tools.",
                "category": ProjectCategory.SAAS,
                "tech_stack": ["Next.js", "FastAPI", "NeonDB", "BullMQ"],
                "featured_image": "autoflow.jpg",
                "is_featured": True,
                "is_published": True,
                "project_url": "https://autoflow.io",
                "order_index": 3
            }
        ]
        
        for project_data in projects_data:
            result = await db.execute(
                select(Project).where(Project.slug == project_data["slug"])
            )
            existing = result.scalar_one_or_none()
            
            if existing is None:
                project = Project(**project_data)
                db.add(project)
                logger.info(f"Project created: {project_data['title']}")
        
        # === PRICING PLANS ===
        pricing_data = [
            {
                "name": "Starter",
                "slug": "starter",
                "description": "Perfect for small businesses and startups",
                "price": 15000,
                "billing_cycle": BillingCycle.ONE_TIME,
                "features": [
                    "1 Page Website",
                    "Basic SEO",
                    "3 Revisions",
                    "1 Month Support",
                    "Deployment"
                ],
                "is_popular": False,
                "order": 1
            },
            {
                "name": "Pro",
                "slug": "pro",
                "description": "Ideal for growing businesses",
                "price": 35000,
                "billing_cycle": BillingCycle.ONE_TIME,
                "features": [
                    "Up to 10 Pages",
                    "AI Chatbot Integration",
                    "Unlimited Revisions",
                    "3 Months Support",
                    "Admin Panel",
                    "SEO Optimized"
                ],
                "is_popular": True,
                "order": 2
            },
            {
                "name": "Enterprise",
                "slug": "enterprise",
                "description": "Custom solutions for large organizations",
                "price": 0,
                "billing_cycle": BillingCycle.ONE_TIME,
                "features": [
                    "Custom Everything",
                    "Dedicated Support",
                    "Full Source Code",
                    "6 Months Support",
                    "SLA Guarantee"
                ],
                "is_popular": False,
                "order": 3
            }
        ]
        
        for pricing_info in pricing_data:
            result = await db.execute(
                select(PricingPlan).where(PricingPlan.slug == pricing_info["slug"])
            )
            existing = result.scalar_one_or_none()
            
            if existing is None:
                plan = PricingPlan(**pricing_info)
                db.add(plan)
                logger.info(f"Pricing plan created: {pricing_info['name']}")
        
        # === TESTIMONIALS ===
        testimonials_data = [
            {
                "name": "Rahul Sharma",
                "role": "CTO at StartupX",
                "company": "StartupX",
                "content": "TFX AI transformed our business with their AI chatbot solution. The implementation was seamless and the results exceeded our expectations. Customer satisfaction increased by 40%!",
                "rating": 5,
                "avatar": "rahul.jpg",
                "order": 1
            },
            {
                "name": "Priya Mehta",
                "role": "Founder at EduTech",
                "company": "EduTech",
                "content": "Exceptional quality and delivery. The web application they built for us is robust, scalable, and our users love it. The team's technical expertise is unmatched.",
                "rating": 5,
                "avatar": "priya.jpg",
                "order": 2
            },
            {
                "name": "Amit Patel",
                "role": "CEO at RetailCo",
                "company": "RetailCo",
                "content": "Great team, professional approach, and excellent communication throughout the project. They delivered our SaaS platform on time and within budget.",
                "rating": 4,
                "avatar": "amit.jpg",
                "order": 3
            }
        ]
        
        for testimonial_info in testimonials_data:
            result = await db.execute(
                select(Testimonial).where(Testimonial.name == testimonial_info["name"])
            )
            existing = result.scalar_one_or_none()
            
            if existing is None:
                testimonial = Testimonial(**testimonial_info)
                db.add(testimonial)
                logger.info(f"Testimonial created: {testimonial_info['name']}")
        
        # === BLOG POSTS ===
        blog_posts_data = [
            {
                "title": "How AI is Revolutionizing Web Development in 2025",
                "slug": "ai-revolutionizing-web-development-2025",
                "excerpt": "Discover the latest AI technologies that are transforming web development and how you can leverage them.",
                "content": """Artificial Intelligence is no longer a futuristic concept in web development – it's here and it's revolutionizing how we build and interact with websites. In 2025, AI-powered tools are becoming essential for developers who want to stay competitive.

From AI code assistants that help write cleaner, more efficient code to intelligent design systems that adapt to user preferences, the integration of AI in web development is creating unprecedented opportunities for innovation.

One of the most significant impacts we're seeing is in the area of automated testing and debugging. AI algorithms can now predict potential bugs before they occur, suggest optimizations, and even write test cases automatically. This not only speeds up development but also improves the overall quality of web applications.

Another game-changer is the rise of AI-driven user experience personalization. Modern websites can now adapt their layout, content, and functionality in real-time based on user behavior, preferences, and context. This level of personalization was impossible just a few years ago.

At TFX AI, we've been at the forefront of this revolution, helping our clients leverage AI to create smarter, more efficient web solutions. The results speak for themselves – increased engagement, higher conversion rates, and significantly reduced development time.

As we move further into 2025, we expect to see even more exciting developments in AI-powered web development, from natural language interfaces to autonomous web applications that can maintain and update themselves.""",
                "category": "AI",
                "tags": ["AI", "Web Dev", "2025"],
                "thumbnail": "ai-web-dev.jpg",
                "is_published": True,
                "read_time": 5,
                "author_id": admin_id
            },
            {
                "title": "Why Your Business Needs a Custom AI Chatbot",
                "slug": "why-business-needs-custom-ai-chatbot",
                "excerpt": "Learn how custom AI chatbots can transform your customer service and boost operational efficiency.",
                "content": """In today's fast-paced digital world, customers expect instant responses and 24/7 support. This is where custom AI chatbots come in – they're not just a luxury anymore, but a necessity for businesses that want to stay competitive.

A custom AI chatbot is specifically trained on your business data, products, and services. Unlike generic chatbot solutions, custom chatbots understand your unique business context and can provide accurate, relevant responses to customer queries.

The benefits are numerous. First, there's the cost savings – a single chatbot can handle thousands of conversations simultaneously, reducing the need for a large customer service team. Second, there's the improved customer experience – instant responses, consistent service quality, and availability round the clock.

But perhaps the most compelling reason is the data insights. Every conversation with your chatbot provides valuable data about customer preferences, pain points, and behavior patterns. This data can help you improve your products, services, and overall business strategy.

At TFX AI, we've developed custom chatbots for businesses across various industries – from e-commerce to healthcare. The results have been remarkable: 60% reduction in response time, 40% increase in customer satisfaction, and significant cost savings.

If you're still relying on traditional customer support methods, it's time to consider making the switch to AI-powered chatbots. The technology is mature, the benefits are proven, and your competitors are probably already using them.""",
                "category": "AI Chatbot",
                "tags": ["Chatbot", "AI", "Business"],
                "thumbnail": "ai-chatbot-business.jpg",
                "is_published": True,
                "read_time": 4,
                "author_id": admin_id
            }
        ]
        
        for blog_info in blog_posts_data:
            result = await db.execute(
                select(BlogPost).where(BlogPost.slug == blog_info["slug"])
            )
            existing = result.scalar_one_or_none()
            
            if existing is None:
                blog_post = BlogPost(**blog_info)
                db.add(blog_post)
                logger.info(f"Blog post created: {blog_info['title']}")
        
        # === CASE STUDY ===
        case_study_data = {
            "title": "ClinicMind AI: Transforming Hospital Management",
            "slug": "clinicmind-ai-case-study",
            "client_name": "City General Hospital",
            "industry": "Healthcare",
            "thumbnail": "clinicmind-case.jpg",
            "problem": "City General Hospital was struggling with inefficient patient management systems. Manual scheduling, paper-based records, and lack of real-time data were causing significant delays and errors. The administrative staff was overwhelmed, and patient satisfaction was declining.",
            "solution": "We developed ClinicMind AI, a comprehensive hospital management system powered by artificial intelligence. The solution includes intelligent patient scheduling, AI-assisted diagnosis, automated billing, and real-time analytics. The system was built using Next.js for the frontend, FastAPI for the backend, PostgreSQL for the database, and OpenAI for AI capabilities.",
            "result": "The implementation of ClinicMind AI transformed the hospital's operations. Administrative workload was reduced by 60%, patient wait times decreased by 45%, and overall efficiency improved significantly. The staff could now focus more on patient care rather than paperwork.",
            "metrics": {
                "efficiency": "+60%",
                "patients_managed": "500+",
                "uptime": "99.9%"
            },
            "tech_stack": ["Next.js", "FastAPI", "PostgreSQL", "OpenAI", "Docker"],
            "is_published": True,
            "order": 1
        }
        
        result = await db.execute(
            select(CaseStudy).where(CaseStudy.slug == case_study_data["slug"])
        )
        existing = result.scalar_one_or_none()
        
        if existing is None:
            case_study = CaseStudy(**case_study_data)
            db.add(case_study)
            logger.info(f"Case study created: {case_study_data['title']}")
        
        # === SITE CONFIG ===
        site_configs = {
            "site_name": "TFX AI",
            "site_tagline": "AI + Web Development Agency",
            "contact_email": "contact@tfxai.com",
            "whatsapp_number": "+1234567890",
            "address": "123 AI Street, Tech City, TC 12345",
            "social_linkedin": "https://linkedin.com/company/tfx-ai",
            "social_github": "https://github.com/tfx-ai",
            "social_twitter": "https://twitter.com/tfx_ai",
            "social_instagram": "https://instagram.com/tfx_ai",
            "analytics_enabled": "True"
        }
        
        for key, value in site_configs.items():
            result = await db.execute(
                select(SiteConfig).where(SiteConfig.key == key)
            )
            existing = result.scalar_one_or_none()
            
            if existing is None:
                config = SiteConfig(key=key, value=str(value))
                db.add(config)
                logger.info(f"Site config created: {key}")
        
        await db.commit()
        logger.info("Database seeded successfully with full realistic data!")
        
    except Exception as e:
        logger.error(f"Database seeding failed: {e}")
        await db.rollback()
        raise


async def main():
    async with AsyncSessionLocal() as db:
        await seed_database(db)


if __name__ == "__main__":
    asyncio.run(main())
