from fastapi import APIRouter

from app.services.dashboard_service import (
    get_dashboard_stats
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
async def dashboard_stats():

    return await get_dashboard_stats()