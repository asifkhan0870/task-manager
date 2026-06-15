from datetime import datetime

from app.core.database import tasks_collection


async def get_dashboard_stats(user_id):

    task_filter = {
        "$or": [
            {
                "assigned_by": user_id
            },
            {
                "assigned_to": user_id
            }
        ]
    }

    total = await tasks_collection.count_documents(
        task_filter
    )

    done = await tasks_collection.count_documents(
        {
            **task_filter,
            "status": "Done"
        }
    )

    in_progress = await tasks_collection.count_documents(
        {
            **task_filter,
            "status": "In Progress"
        }
    )

    incomplete = await tasks_collection.count_documents(
        {
            **task_filter,
            "status": "Incomplete"
        }
    )

    overdue = await tasks_collection.count_documents(
        {
            **task_filter,
            "status": {
                "$ne": "Done"
            },
            "due_date": {
                "$lt": datetime.utcnow()
            }
        }
    )

    return {
        "total": total,
        "done": done,
        "in_progress": in_progress,
        "incomplete": incomplete,
        "overdue": overdue
    }