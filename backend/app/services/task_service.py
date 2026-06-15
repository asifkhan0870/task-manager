from bson import ObjectId
from datetime import datetime

from app.core.database import tasks_collection

from app.services.activity_service import log_activity

from app.services.notification_service import (
    notify_task_created,
    notify_status_change
)


async def create_task(data, current_user):

    task = {
        "title": data.title,
        "description": data.description,
        "audio_url": data.audio_url,
        "priority": data.priority,
        "status": "Incomplete",
        "assigned_by": current_user,
        "assigned_to": data.assigned_to,
        "assigned_date": datetime.utcnow(),
        "due_date": data.due_date,
        "completed_date": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await tasks_collection.insert_one(task)

    task["_id"] = str(result.inserted_id)

    await notify_task_created(task)

    await log_activity(
        str(result.inserted_id),
        "Task Created",
        current_user
    )

    return str(result.inserted_id)


async def get_tasks(user_id):

    print(
        "FILTER USER:",
        user_id
    )

    tasks = []

    query = {
        "$or": [
            {
                "assigned_by": user_id
            },
            {
                "assigned_to": user_id
            }
        ]
    }

    print(
        "QUERY:",
        query
    )

    async for task in tasks_collection.find(
        query
    ):

        print(
            "FOUND TASK:",
            task["title"],
            "ASSIGNED_BY:",
            task["assigned_by"],
            "ASSIGNED_TO:",
            task["assigned_to"]
        )

        task["_id"] = str(
            task["_id"]
        )

        tasks.append(task)

    print(
        "TOTAL MATCHED TASKS:",
        len(tasks)
    )

    return tasks

    
async def get_task(task_id):

    task = await tasks_collection.find_one(
        {
            "_id": ObjectId(task_id)
        }
    )

    if task:
        task["_id"] = str(task["_id"])

    return task


async def update_task(
    task_id,
    payload,
    user_id
):

    update_data = {
        k: v
        for k, v in payload.dict().items()
        if v is not None
    }

    update_data["updated_at"] = datetime.utcnow()

    await tasks_collection.update_one(
        {
            "_id": ObjectId(task_id)
        },
        {
            "$set": update_data
        }
    )

    await log_activity(
        task_id,
        "Task Updated",
        user_id
    )

    return True


async def delete_task(
    task_id,
    user_id
):

    await tasks_collection.delete_one(
        {
            "_id": ObjectId(task_id)
        }
    )

    await log_activity(
        task_id,
        "Task Deleted",
        user_id
    )

    return True


async def update_status(
    task_id,
    status,
    user_id
):

    update = {
        "status": status,
        "updated_at": datetime.utcnow()
    }

    if status == "Done":

        update["completed_date"] = datetime.utcnow()

    await tasks_collection.update_one(
        {
            "_id": ObjectId(task_id)
        },
        {
            "$set": update
        }
    )

    await log_activity(
        task_id,
        f"Status Changed To {status}",
        user_id
    )

    await notify_status_change(
        task_id,
        status
    )

    return True