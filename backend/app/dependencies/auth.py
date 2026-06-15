from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import OAuth2PasswordBearer

from jose import jwt

from app.core.config import settings


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/login"
)


async def get_current_user(
    token: str = Depends(
        oauth2_scheme
    )
):

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[
                settings.ALGORITHM
            ]
        )

        print(
            "CURRENT USER:",
            payload["user_id"]
        )

        return payload["user_id"]

    except Exception as e:

        print(
            "AUTH ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )