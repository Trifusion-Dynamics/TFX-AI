import asyncio
import asyncpg

async def check_database():
    db_url = 'postgresql://neondb_owner:npg_Gd74AmkTZqcn@ep-red-brook-a812s3fi-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
    
    try:
        conn = await asyncpg.connect(db_url)
        print('✅ Connected to NeonDB!')
        
        # Check tables
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        
        print(f'📊 Found {len(tables)} tables:')
        for table in tables:
            print(f'  ✅ {table["table_name"]}')
        
        # Check users
        users = await conn.fetch('SELECT email, role, is_verified FROM users ORDER BY created_at')
        print(f'\n👥 Users ({len(users)}):')
        for user in users:
            print(f'  ✅ {user["email"]} - {user["role"]} - Verified: {user["is_verified"]}')
        
        # Check services
        services = await conn.fetch('SELECT title, slug FROM services ORDER BY order_index')
        print(f'\n🛠️ Services ({len(services)}):')
        for service in services:
            print(f'  ✅ {service["title"]} - {service["slug"]}')
        
        await conn.close()
        print('\n🎉 Database is ready!')
        
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == "__main__":
    asyncio.run(check_database())
