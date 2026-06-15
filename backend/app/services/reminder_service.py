from bson import ObjectId
from datetime import timedelta

from app.core.database import (
    users_collection,
    notifications_collection
)

from app.services.email_service import send_email


async def send_reminder(
    task,
    reminder_type
):

    existing = await notifications_collection.find_one(
        {
            "task_id": str(task["_id"]),
            "reminder_type": reminder_type
        }
    )

    if existing:
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

    # Convert UTC → IST
    due_date_ist = task["due_date"] + timedelta(
        hours=5,
        minutes=30
    )

    formatted_due_date = due_date_ist.strftime(
        "%d %B %Y, %I:%M %p"
    )

    subject = f"Reminder: {task['title']}"

    body = f"""
Task Reminder

Title:
{task['title']}

Description:
{task['description']}

Priority:
{task['priority']}

Status:
{task['status']}

Due Date:
{formatted_due_date}

Reminder Type:
{reminder_type}
"""

    if assigner:

        send_email(
            assigner["email"],
            subject,
            body
        )

    if assignee:

        send_email(
            assignee["email"],
            subject,
            body
        )

    await notifications_collection.insert_one(
        {
            "task_id": str(task["_id"]),
            "reminder_type": reminder_type,
            "sent": True
        }
    )