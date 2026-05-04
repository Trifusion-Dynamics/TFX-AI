import asyncio
import asyncpg

async def check_defaults():
    db_url = 'postgresql://neondb_owner:npg_Gd74AmkTZqcn@ep-red-brook-a812s3fi-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
    conn = await asyncpg.connect(db_url)
    cols = await conn.fetch("SELECT table_name, column_name, column_default FROM information_schema.columns WHERE table_schema = 'public' AND column_default IS NOT NULL")
    print("Column Defaults:")
    for c in cols:
        print(f"  {c['table_name']}.{c['column_name']}: {c['column_default']}")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(check_defaults())
