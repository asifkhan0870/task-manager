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

    print("================================")
    print("CHECKING TASKS")
    print("================================")

    now = datetime.utcnow()

    async for task in tasks_collection.find(
        {
            "status": {
                "$ne": "Done"
            }
        }
    ):

        due = task["due_date"]

        print("TASK:", task["title"])
        print("NOW :", now)
        print("DUE :", due)

        diff = due - now

        hours_left = diff.total_seconds() / 3600

        print("HOURS LEFT:", hours_left)

        if 23 <= hours_left <= 24:
            print("24 HOUR REMINDER TRIGGERED")
            await send_reminder(task, "24_hours")

        elif 0.5 <= hours_left <= 1:
            print("1 HOUR REMINDER TRIGGERED")
            await send_reminder(task, "1_hour")

        elif -0.1 <= hours_left <= 0:
            print("DUE NOW REMINDER TRIGGERED")
            await send_reminder(task, "due_now")

            
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