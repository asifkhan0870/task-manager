from datetime import datetime
import asyncio
import traceback

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.core.database import tasks_collection
from app.services.reminder_service import send_reminder

scheduler = AsyncIOScheduler()


async def check_due_tasks():
    try:
        print("\n========== CHECKING TASKS ==========")

        now = datetime.utcnow()

        async for task in tasks_collection.find(
            {"status": {"$ne": "Done"}}
        ):
            due = task["due_date"]

            print("TASK:", task["title"])
            print("NOW :", now)
            print("DUE :", due)

            diff = due - now
            hours_left = diff.total_seconds() / 3600

            print("HOURS LEFT:", hours_left)

            if 23 <= hours_left <= 24:
                print("24 HOUR REMINDER")
                await send_reminder(task, "24_hours")

            elif 0.5 <= hours_left <= 1:
                print("1 HOUR REMINDER")
                await send_reminder(task, "1_hour")

            elif -0.1 <= hours_left <= 0:
                print("DUE NOW REMINDER")
                await send_reminder(task, "due_now")

    except Exception as e:
        print("ERROR:", str(e))
        traceback.print_exc()


def run_task():
    print("Scheduler Trigger Fired")
    asyncio.create_task(check_due_tasks())


def start_scheduler():

    if scheduler.running:
        return

    scheduler.add_job(
        run_task,
        "interval",
        minutes=1,
        id="task_reminder_scheduler",
        replace_existing=True,
    )

    scheduler.start()

    print("Scheduler started successfully")
    print("Jobs:", scheduler.get_jobs())