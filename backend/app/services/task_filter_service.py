from datetime import datetime

from app.core.database import tasks_collection


async def get_my_tasks(user_id):

    tasks = []

    async for task in tasks_collection.find(
        {
            "assigned_to": user_id
        }
    ):

        task["_id"] = str(task["_id"])

        tasks.append(task)

    return tasks


async def get_completed_tasks():

    tasks = []

    async for task in tasks_collection.find(
        {
            "status": "Done"
        }
    ):

        task["_id"] = str(task["_id"])

        tasks.append(task)

    return tasks


async def get_in_progress_tasks():

    tasks = []

    async for task in tasks_collection.find(
        {
            "status": "In Progress"
        }
    ):

        task["_id"] = str(task["_id"])

        tasks.append(task)

    return tasks


async def get_incomplete_tasks():

    tasks = []

    async for task in tasks_collection.find(
        {
            "status": "Incomplete"
        }
    ):

        task["_id"] = str(task["_id"])

        tasks.append(task)

    return tasks


async def get_overdue_tasks():

    tasks = []

    async for task in tasks_collection.find(
        {
            "status": {
                "$ne": "Done"
            },
            "due_date": {
                "$lt": datetime.utcnow()
            }
        }
    ):

        task["_id"] = str(task["_id"])

        tasks.append(task)

    return tasks


async def get_assigned_by_me(user_id):

    tasks = []

    async for task in tasks_collection.find(
        {
            "assigned_by": user_id
        }
    ):

        task["_id"] = str(task["_id"])

        tasks.append(task)

    return tasks