from fastapi import APIRouter
from fastapi import Depends

from app.dependencies.auth import get_current_user

from app.services.task_filter_service import (
    get_my_tasks,
    get_completed_tasks,
    get_in_progress_tasks,
    get_incomplete_tasks,
    get_overdue_tasks,
    get_assigned_by_me
)

router = APIRouter(
    prefix="/tasks",
    tags=["Task Filters"]
)


@router.get("/my")
async def my_tasks(
    user=Depends(get_current_user)
):
    return await get_my_tasks(user)


@router.get("/completed")
async def completed_tasks():
    return await get_completed_tasks()


@router.get("/in-progress")
async def in_progress_tasks():
    return await get_in_progress_tasks()


@router.get("/incomplete")
async def incomplete_tasks():
    return await get_incomplete_tasks()


@router.get("/overdue")
async def overdue_tasks():
    return await get_overdue_tasks()


@router.get("/assigned-by-me")
async def assigned_by_me(
    user=Depends(get_current_user)
):
    return await get_assigned_by_me(user)