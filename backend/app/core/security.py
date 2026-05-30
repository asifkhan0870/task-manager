from jose import jwt
from passlib.context import CryptContext

from datetime import datetime
from datetime import timedelta

from app.core.config import settings


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):

    return pwd_context.hash(password)


def verify_password(
    password: str,
    hashed: str
):

    return pwd_context.verify(
        password,
        hashed
    )


def create_access_token(data: dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload["exp"] = expire

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return token