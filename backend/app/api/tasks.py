from fastapi import APIRouter
from fastapi import Depends

from app.dependencies.auth import get_current_user

from app.schemas.task_schema import (
    TaskCreate,
    TaskUpdate,
    TaskStatusUpdate
)

from app.services.task_service import (
    create_task,
    get_tasks,
    get_task,
    update_task,
    delete_task,
    update_status
)

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# ==========================
# CREATE TASK
# ==========================

@router.post("/")
async def create_new_task(
    payload: TaskCreate,
    user=Depends(get_current_user)
):

    task_id = await create_task(
        payload,
        user
    )

    return {
        "task_id": task_id
    }


# ==========================
# GET ALL TASKS
# ==========================

@router.get("/")
async def all_tasks():

    return await get_tasks()


# ==========================
# GET SINGLE TASK
# ==========================

@router.get("/id/{task_id}")
async def single_task(
    task_id: str
):

    return await get_task(task_id)


# ==========================
# UPDATE TASK
# ==========================

@router.put("/id/{task_id}")
async def edit_task(
    task_id: str,
    payload: TaskUpdate,
    user=Depends(get_current_user)
):

    await update_task(
        task_id,
        payload,
        user
    )

    return {
        "message": "updated"
    }


# ==========================
# DELETE TASK
# ==========================

@router.delete("/id/{task_id}")
async def remove_task(
    task_id: str,
    user=Depends(get_current_user)
):

    await delete_task(
        task_id,
        user
    )

    return {
        "message": "deleted"
    }


# ==========================
# UPDATE STATUS
# ==========================

@router.patch("/id/{task_id}/status")
async def status_update(
    task_id: str,
    payload: TaskStatusUpdate,
    user=Depends(get_current_user)
):

    await update_status(
        task_id,
        payload.status,
        user
    )

    return {
        "message": "status updated"
    }