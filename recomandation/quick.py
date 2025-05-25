import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://dzmimad6:azerty@mern.lbfkure.mongodb.net/?retryWrites=true&w=majority"

async def list_collections():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client["test"]  # The database you want to inspect
    collections = await db.list_collection_names()
    print("Collections in 'test' database:", collections)

asyncio.run(list_collections())
