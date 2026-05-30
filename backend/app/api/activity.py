from fastapi import APIRouter

from app.services.activity_service import (
    get_activity_logs
)

router = APIRouter(
    prefix="/activity",
    tags=["Activity"]
)


@router.get("/{task_id}")
async def activity_timeline(
    task_id: str
):

    return await get_activity_logs(
        task_id
    )