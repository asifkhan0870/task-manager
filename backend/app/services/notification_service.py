from bson import ObjectId

from app.core.database import users_collection

from app.core.database import tasks_collection

from app.services.email_service import send_email


async def notify_task_created(
    task
):

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

            print(
                "User not found"
            )

            return

        subject = (
            f"New Task Assigned: "
            f"{task['title']}"
        )

        body = f"""
Task Assigned

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

Assigned By:
{assigner['email']}

Assigned To:
{assignee['email']}
"""

        send_email(
            assigner["email"],
            subject,
            body
        )

        send_email(
            assignee["email"],
            subject,
            body
        )

        print(
            "Task notification sent"
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

        subject = (
            f"Task Status Updated: "
            f"{task['title']}"
        )

        body = f"""
Task Status Changed

Title:
{task['title']}

New Status:
{status}

Updated At:
{task['updated_at']}
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

        print(
            "Status notification sent"
        )

    except Exception as e:

        print(
            f"Status Notification Error: {e}"
        )