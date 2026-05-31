import time

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

    start = time.time()

    user = await users_collection.find_one(
        {"email": data.email}
    )

    print(
        f"Mongo lookup took {time.time()-start:.2f} sec"
    )

    if not user:
        return None

    start = time.time()

    valid = verify_password(
        data.password,
        user["password"]
    )

    print(
        f"Password verify took {time.time()-start:.2f} sec"
    )

    if not valid:
        return None

    start = time.time()

    token = create_access_token(
        {
            "user_id": str(user["_id"]),
            "email": user["email"]
        }
    )

    print(
        f"JWT creation took {time.time()-start:.2f} sec"
    )

    return token