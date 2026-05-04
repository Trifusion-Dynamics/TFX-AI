import asyncio
import asyncpg

async def check_data():
    db_url = 'postgresql://neondb_owner:npg_Gd74AmkTZqcn@ep-red-brook-a812s3fi-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
    conn = await asyncpg.connect(db_url)
    rows = await conn.fetch('SELECT features FROM pricing_plans LIMIT 5')
    for row in rows:
        print(f"Features: {row['features']} Type: {type(row['features'])}")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(check_data())
