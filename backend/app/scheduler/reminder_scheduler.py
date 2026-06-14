from datetime import datetime
import traceback

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.core.database import tasks_collection
from app.services.reminder_service import send_reminder

scheduler = AsyncIOScheduler()


async def check_due_tasks():

    try:

        print("\n========== CHECKING TASKS ==========")

        now = datetime.utcnow()

        print("CURRENT UTC:", now)

        count = 0

        async for task in tasks_collection.find(
            {
                "status": {
                    "$ne": "Done"
                }
            }
        ):

            count += 1

            due = task["due_date"]

            print("TASK:", task["title"])
            print("NOW :", now)
            print("DUE :", due)

            diff = due - now
            hours_left = diff.total_seconds() / 3600

            print("HOURS LEFT:", hours_left)

            
            if 0 <= hours_left <= 6:
                print("TEST REMINDER")
                await send_reminder(task, "test")
            if 23 <= hours_left <= 24:
                await send_reminder(task, "24_hours")

            elif 0 <= hours_left <= 1:
                await send_reminder(task, "1_hour")

            elif -0.1 <= hours_left <= 0:
                await send_reminder(task, "due_now")

            print("TOTAL TASKS FOUND:", count)

    except Exception as e:

        print("REMINDER ERROR:", str(e))
        traceback.print_exc()


def start_scheduler():

    if scheduler.running:
        return

    scheduler.add_job(
        check_due_tasks,
        "interval",
        minutes=1,
        id="task_reminder_scheduler",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )

    scheduler.start()

    print("Scheduler started successfully")
    print("Jobs:", scheduler.get_jobs())

    # Run once immediately after startup
    scheduler.add_job(
        check_due_tasks,
        trigger="date"
    )