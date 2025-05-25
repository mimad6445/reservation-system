from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://dzmimad6:azerty@mern.lbfkure.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URL)
db = client["test"]  # replace with your actual database name
products_collection = db["tpproducts"]  # replace with your actual collection name
