from fastapi import APIRouter

from app.core.database import users_collection

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/")
async def get_users():

    users = []

    async for user in users_collection.find():

        user["_id"] = str(user["_id"])

        del user["password"]

        users.append(user)

    return users