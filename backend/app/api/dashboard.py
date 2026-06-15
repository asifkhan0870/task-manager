from fastapi import APIRouter
from fastapi import Depends

from app.dependencies.auth import get_current_user

from app.services.dashboard_service import (
    get_dashboard_stats
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
async def dashboard_stats(
    user=Depends(get_current_user)
):

    return await get_dashboard_stats(user)