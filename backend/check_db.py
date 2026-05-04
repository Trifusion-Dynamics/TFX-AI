import asyncio
import asyncpg

async def check_database():
    db_url = 'postgresql://neondb_owner:npg_Gd74AmkTZqcn@ep-red-brook-a812s3fi-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
    
    try:
        conn = await asyncpg.connect(db_url)
        print('Connected to NeonDB!')
        
        # Check tables
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        
        print(f'Found {len(tables)} tables:')
        for table in tables:
            print(f'  Table: {table["table_name"]}')
        
        # Check pricing_plans columns
        pricing_cols = await conn.fetch("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'pricing_plans'
            ORDER BY column_name
        """)
        print(f'\nPricing Plans Columns ({len(pricing_cols)}):')
        for col in pricing_cols:
            print(f'  Col: {col["column_name"]} ({col["data_type"]})')
        
        await conn.close()
        print('Database verification complete!')
        
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    asyncio.run(check_database())
