from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

client = AsyncIOMotorClient(
    settings.MONGODB_URL
)

db = client[
    settings.DATABASE_NAME
]

users_collection = db["users"]

tasks_collection = db["tasks"]

activity_collection = db["activity_logs"]

notifications_collection = db["notifications"]

discussion_collection = db["task_discussions"]
typing_collection = db["typing_status"]
recording_collection = db["recording_status"]