from fastapi import APIRouter, Depends
from bson import ObjectId

from app.dependencies.auth import get_current_user
from app.core.database import notifications_collection

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
async def get_notifications(
    user=Depends(get_current_user)
):

    cursor = notifications_collection.find(
        {
            "user_id": str(user),
            "read":False
        }
    ).sort(
        "created_at",
        -1
    )

    notifications = []
    seen_tasks = set()

    async for item in cursor:

        task_id = item.get("task_id")

        # Skip older notifications from same task
        if task_id in seen_tasks:
            continue

        seen_tasks.add(task_id)

        item["_id"] = str(item["_id"])

        notifications.append(item)

    return notifications


@router.get("/unread-count")
async def unread_count(
    user=Depends(get_current_user)
):

    count = await notifications_collection.count_documents(
        {
            "user_id": str(user),
            "read": False
        }
    )

    return {
        "count": count
    }


@router.patch("/{notification_id}/read")
async def mark_read(
    notification_id: str
):

    await notifications_collection.update_one(
        {
            "_id": ObjectId(notification_id)
        },
        {
            "$set": {
                "read": True
            }
        }
    )

    return {
        "message": "read"
    }

@router.patch("/task/{task_id}/read")
async def mark_task_notifications_read(
    task_id: str,
    user=Depends(get_current_user)
):

    await notifications_collection.update_many(
        {
            "user_id": str(user),
            "task_id": task_id,
            "read": False
        },
        {
            "$set": {
                "read": True
            }
        }
    )

    return {
        "message": "task notifications marked read"
    }    