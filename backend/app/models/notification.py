from datetime import datetime

class Notification:

    @staticmethod
    def create(
        user_id,
        task_id,
        message
    ):
        return {
            "user_id": user_id,
            "task_id": task_id,
            "message": message,
            "is_read": False,
            "created_at": datetime.utcnow()
        }