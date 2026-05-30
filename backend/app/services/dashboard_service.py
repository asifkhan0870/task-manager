from datetime import datetime

from app.core.database import tasks_collection


async def get_dashboard_stats():

    total = await tasks_collection.count_documents({})

    done = await tasks_collection.count_documents(
        {
            "status": "Done"
        }
    )

    in_progress = await tasks_collection.count_documents(
        {
            "status": "In Progress"
        }
    )

    incomplete = await tasks_collection.count_documents(
        {
            "status": "Incomplete"
        }
    )

    overdue = await tasks_collection.count_documents(
        {
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