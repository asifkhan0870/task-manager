from fastapi import APIRouter, Depends
from bson import ObjectId
from datetime import datetime

from app.dependencies.auth import get_current_user

from app.core.database import (
    discussion_collection,
        typing_collection

)

router = APIRouter(
    prefix="/discussion",
    tags=["Discussion"]
)


@router.post("/{task_id}/message")
async def send_message(
    task_id: str,
    payload: dict,
    user=Depends(get_current_user)
):

    message_type = "audio" if payload.get("audio_url") else "text"

    message = {
        "task_id": task_id,
        "sender_id": str(user),
        "message_type": message_type,
        "message": payload.get("message"),
        "audio_url": payload.get("audio_url"),
        "created_at": datetime.utcnow()
    }

    result = await discussion_collection.insert_one(
        message
    )

    return {
        "message_id": str(result.inserted_id)
    }


@router.get("/{task_id}")
async def get_messages(
    task_id: str
):

    cursor = discussion_collection.find(
        {
            "task_id": task_id
        }
    ).sort(
        "created_at",
        1
    )

    messages = []

    async for item in cursor:

        item["_id"] = str(item["_id"])

        messages.append(item)

    return messages


@router.delete("/{task_id}")
async def clear_discussion(
    task_id: str
):

    await discussion_collection.delete_many(
        {
            "task_id": task_id
        }
    )

    return {
        "message": "discussion cleared"
    }  

@router.put("/message/{message_id}")
async def edit_message(
    message_id: str,
    payload: dict
):

    await discussion_collection.update_one(
        {
            "_id": ObjectId(message_id)
        },
        {
            "$set": {
                "message": payload["message"]
            }
        }
    )

    return {
        "message": "updated"
    }          


@router.post("/{task_id}/typing")
async def update_typing(
    task_id: str,
    payload: dict,
    user=Depends(get_current_user)
):

    await typing_collection.update_one(
        {
            "task_id": task_id,
            "user_id": str(user)
        },
        {
            "$set": {
                "is_typing": payload["is_typing"]
            }
        },
        upsert=True
    )

    return {
        "message": "updated"
    }

@router.get("/{task_id}/typing")
async def get_typing_status(
    task_id: str
):

    cursor = typing_collection.find(
        {
            "task_id": task_id,
            "is_typing": True
        }
    )

    users = []

    async for item in cursor:
        users.append(item["user_id"])

    return users        