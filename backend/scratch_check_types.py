import asyncio
import asyncpg

async def check_types():
    db_url = 'postgresql://neondb_owner:npg_Gd74AmkTZqcn@ep-red-brook-a812s3fi-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
    conn = await asyncpg.connect(db_url)
    types = await conn.fetch("SELECT typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public'")
    print("Existing Types:")
    for t in types:
        print(f"  - {t['typname']}")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(check_types())
