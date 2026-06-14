from bson import ObjectId

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
{task['due_date']}

Reminder Type:
{reminder_type}
"""

    TEST_EMAIL = "khanasif0870@gmail.com"

    print("SENDING TEST EMAIL TO:", TEST_EMAIL)

    send_email(
        TEST_EMAIL,
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