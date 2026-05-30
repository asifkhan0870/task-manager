from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):

    title: str

    description: str

    priority: str

    assigned_to: str

    due_date: datetime


class TaskUpdate(BaseModel):

    title: Optional[str] = None

    description: Optional[str] = None

    priority: Optional[str] = None

    due_date: Optional[datetime] = None


class TaskStatusUpdate(BaseModel):

    status: str