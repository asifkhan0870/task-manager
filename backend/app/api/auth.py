from fastapi import APIRouter
from fastapi import HTTPException

from app.schemas.auth_schema import RegisterSchema
from app.schemas.auth_schema import LoginSchema

from app.services.auth_service import register_user
from app.services.auth_service import login_user


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