from app.core.database import users_collection

from app.core.security import hash_password
from app.core.security import verify_password
from app.core.security import create_access_token


async def register_user(data):

    existing = await users_collection.find_one(
        {"email": data.email}
    )

    if existing:
        return None

    user = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(
            data.password
        ),
        "role": "admin"
    }

    result = await users_collection.insert_one(
        user
    )

    return str(result.inserted_id)


async def login_user(data):

    user = await users_collection.find_one(
        {"email": data.email}
    )

    if not user:
        return None

    valid = verify_password(
        data.password,
        user["password"]
    )

    if not valid:
        return None

    token = create_access_token(
        {
            "user_id": str(user["_id"]),
            "email": user["email"]
        }
    )

    return token