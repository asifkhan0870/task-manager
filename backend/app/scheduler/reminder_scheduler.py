from datetime import datetime
import traceback

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.core.database import tasks_collection
from app.services.reminder_service import send_reminder

scheduler = AsyncIOScheduler()


async def check_due_tasks():

    try:
        print("\n================================")
        print("CHECKING TASKS")
        print("CURRENT UTC:", datetime.utcnow())
        print("================================\n")

        now = datetime.utcnow()

        count = 0

        async for task in tasks_collection.find(
            {
                "status": {
                    "$ne": "Done"
                }
            }
        ):

            count += 1

            due = task.get("due_date")

            print(f"\nTASK #{count}")
            print("TITLE:", task.get("title"))
            print("DUE:", due)

            if not due:
                print("SKIPPED - NO DUE DATE")
                continue

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

        print(f"\nTOTAL TASKS CHECKED: {count}\n")

    except Exception as e:

        print("\nERROR IN REMINDER SCHEDULER")
        print(str(e))
        traceback.print_exc()


def start_scheduler():

    try:

        if scheduler.running:
            print("Scheduler already running")
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
        print("Registered jobs:", scheduler.get_jobs())

    except Exception as e:

        print("Failed to start scheduler")
        print(str(e))
        traceback.print_exc()