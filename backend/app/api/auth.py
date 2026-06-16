from fastapi import APIRouter
from fastapi import HTTPException

from app.schemas.auth_schema import RegisterSchema
from app.schemas.auth_schema import LoginSchema

from app.services.auth_service import register_user
from app.services.auth_service import login_user

from fastapi import Header

from app.schemas.auth_schema import ChangePasswordSchema

from app.core.security import decode_access_token

from app.services.auth_service import change_password


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register(
    payload: RegisterSchema
):

    user_id = await register_user(
        payload
    )

    if not user_id:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return {
        "message": "User created",
        "id": user_id
    }


@router.post("/login")
async def login(
    payload: LoginSchema
):

    token = await login_user(
        payload
    )

    if not token:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/change-password")
async def update_password(
    payload: ChangePasswordSchema,
    authorization: str = Header(...)
):

    try:

        token = authorization.replace(
            "Bearer ",
            ""
        )

        data = decode_access_token(
            token
        )

        if not data:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        success = await change_password(
            data["user_id"],
            payload.current_password,
            payload.new_password
        )

        if not success:
            raise HTTPException(
                status_code=400,
                detail="Current password incorrect"
            )

        return {
            "message": "Password changed successfully"
        }

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )    