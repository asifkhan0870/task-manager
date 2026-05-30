from datetime import datetime

from apscheduler.schedulers.asyncio import (
    AsyncIOScheduler
)

from app.core.database import tasks_collection

from app.services.reminder_service import (
    send_reminder
)

scheduler = AsyncIOScheduler()


async def check_due_tasks():

    now = datetime.utcnow()

    async for task in tasks_collection.find(
        {
            "status": {
                "$ne": "Done"
            }
        }
    ):

        due = task["due_date"]

        diff = due - now

        hours_left = diff.total_seconds() / 3600

        # Send reminder 24 hours before due date
        if 23 <= hours_left <= 24:

            await send_reminder(
                task,
                "24_hours"
            )

        # Send reminder 1 hour before due date
        elif 0.5 <= hours_left <= 1:

            await send_reminder(
                task,
                "1_hour"
            )

        # Send reminder when due time arrives
        elif -0.1 <= hours_left <= 0:

            await send_reminder(
                task,
                "due_now"
            )


def start_scheduler():

    if not scheduler.running:

        scheduler.add_job(
            check_due_tasks,
            "interval",
            minutes=1,
            id="task_reminder_scheduler",
            replace_existing=True
        )

        scheduler.start()

        print(
            "Reminder Scheduler Started"
        )