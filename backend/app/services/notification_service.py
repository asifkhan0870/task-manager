from bson import ObjectId
from datetime import datetime

from app.core.database import users_collection
from app.core.database import tasks_collection

from app.services.email_service import send_email


def format_date(date_value):

    try:

        if isinstance(date_value, str):
            return date_value

        return date_value.strftime(
            "%d %B %Y, %I:%M %p"
        )

    except:
        return str(date_value)


async def notify_task_created(task):

    try:

        assigner = await users_collection.find_one(
            {
                "_id": ObjectId(
                    task["assigned_by"]
                )
            }
        )

        assignee = await users_collection.find_one(
            {
                "_id": ObjectId(
                    task["assigned_to"]
                )
            }
        )

        if not assigner or not assignee:

            print("User not found")

            return

        subject = (
            f"📌 New Task Assigned - {task['title']}"
        )

        body = f"""
Hello {assignee['name']},

A new task has been assigned to you.

====================================

Task Title:
{task['title']}

Description:
{task['description']}

Priority:
{task['priority']}

Current Status:
{task['status']}

Due Date:
{format_date(task['due_date'])}

Assigned By:
{assigner['name']}

Assigned By Email:
{assigner['email']}

====================================

Please login to the Task Manager system
and update the task status regularly.

Regards,

Task Manager Notification System
"""

        send_email(
            assignee["email"],
            subject,
            body
        )

        print(
            f"Task assignment email sent to {assignee['email']}"
        )

    except Exception as e:

        print(
            f"Notification Error: {e}"
        )


async def notify_status_change(
    task_id: str,
    status: str
):

    try:

        task = await tasks_collection.find_one(
            {
                "_id": ObjectId(
                    task_id
                )
            }
        )

        if not task:

            return

        assigner = await users_collection.find_one(
            {
                "_id": ObjectId(
                    task["assigned_by"]
                )
            }
        )

        assignee = await users_collection.find_one(
            {
                "_id": ObjectId(
                    task["assigned_to"]
                )
            }
        )

        if not assigner:

            return

        status_icon = "🔄"

        if status == "Done":
            status_icon = "✅"

        elif status == "Incomplete":
            status_icon = "❌"

        subject = (
            f"{status_icon} Task Status Updated - {task['title']}"
        )

        body = f"""
Hello {assigner['name']},

A task assigned by you has been updated.

====================================

Task Title:
{task['title']}

Assigned To:
{assignee['name']}

Assigned To Email:
{assignee['email']}

New Status:
{status}

Updated At:
{format_date(datetime.utcnow())}

====================================

The assignee has updated the task status.

Regards,

Task Manager Notification System
"""

        send_email(
            assigner["email"],
            subject,
            body
        )

        print(
            f"Status update email sent to {assigner['email']}"
        )

    except Exception as e:

        print(
            f"Status Notification Error: {e}"
        )