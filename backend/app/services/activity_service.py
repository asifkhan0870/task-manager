from datetime import datetime

from app.core.database import activity_collection


async def log_activity(
    task_id: str,
    action: str,
    user_id: str
):

    await activity_collection.insert_one(
        {
            "task_id": task_id,
            "action": action,
            "performed_by": user_id,
            "timestamp": datetime.utcnow()
        }
    )


async def get_activity_logs(
    task_id: str
):

    activities = []

    async for activity in activity_collection.find(
        {
            "task_id": task_id
        }
    ).sort(
        "timestamp",
        1
    ):

        activity["_id"] = str(
            activity["_id"]
        )

        activities.append(
            activity
        )

    return activities