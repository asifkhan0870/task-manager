from bson import ObjectId
from datetime import datetime, timedelta

from app.core.database import users_collection
from app.core.database import tasks_collection

from app.services.email_service import send_email
from app.core.database import notifications_collection

WEBSITE_URL = "https://task-manager-entire.onrender.com"


def format_date(date_value):

    try:

        if isinstance(date_value, str):
            return date_value

        # Convert UTC → IST
        ist_date = date_value + timedelta(
            hours=5,
            minutes=30
        )

        return ist_date.strftime(
            "%d %B %Y, %I:%M %p"
        )

    except Exception:

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

🎉 A new task has been assigned to you.

━━━━━━━━━━━━━━━━━━━━━━

📌 TASK DETAILS

Title:
{task['title']}

Description:
{task['description']}

Priority:
{task['priority']}

Status:
{task['status']}

Due Date:
{format_date(task['due_date'])}

Assigned By:
{assigner['name']}

━━━━━━━━━━━━━━━━━━━━━━

🚀 Open Task Manager

{WEBSITE_URL}

━━━━━━━━━━━━━━━━━━━━━━

Please review the task and update its status regularly.

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

🔄 A task status has been updated.

━━━━━━━━━━━━━━━━━━━━━━

📌 TASK DETAILS

Title:
{task['title']}

Assigned To:
{assignee['name']}

Assigned Email:
{assignee['email']}

New Status:
{status}

Updated At:
{format_date(datetime.utcnow())}

━━━━━━━━━━━━━━━━━━━━━━

🚀 View Task Manager

{WEBSITE_URL}

━━━━━━━━━━━━━━━━━━━━━━

The assignee has updated this task.

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

async def create_message_notification(
    task,
    sender_id,
    sender_name,
    message_text
):

    print("CREATE NOTIFICATION CALLED")

    try:

        receiver_id = (
            task["assigned_by"]
            if sender_id == task["assigned_to"]
            else task["assigned_to"]
        )

        receiver = await users_collection.find_one(
            {
                "_id": ObjectId(receiver_id)
            }
        )

        if not receiver:
            return

        # Save notification in database

        result=await notifications_collection.insert_one(
            {
                "user_id": receiver_id,
                "task_id": str(task["_id"]),
                "title": "💬 New Message",
                "message": (
                    f"{sender_name} sent a message"
                ),
                "preview": (
                    message_text[:100]
                    if message_text
                    else "🎤 Audio message"
                ),
                "read": False,
                "created_at": datetime.utcnow()
            }
        )

        print("NOTIFICATION SAVED:", result.inserted_id)
        print("FOR USER:", receiver_id)

        # Send email

        email_body = f"""
Hello {receiver['name']},

💬 You have received a new discussion message.

━━━━━━━━━━━━━━━━━━━━━━

📌 TASK

{task['title']}

👤 Sender

{sender_name}

📝 Message

{message_text if message_text else '🎤 Audio Message'}

━━━━━━━━━━━━━━━━━━━━━━

🚀 Continue Discussion

{WEBSITE_URL}

━━━━━━━━━━━━━━━━━━━━━━

Open Task Manager to reply to this message.

Task Manager Notification System
"""

        send_email(
            receiver["email"],
            f"💬 New Message - {task['title']}",
            email_body
        )

        print(
            f"Discussion notification sent to {receiver['email']}"
        )

    except Exception as e:

        print(
            f"Message Notification Error: {e}"
        )