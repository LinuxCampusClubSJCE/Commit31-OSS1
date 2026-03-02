from datetime import datetime
from typing import Optional
from enum import Enum
from pydantic import BaseModel


class TaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: Optional[TaskPriority] = None


class TaskResponse(TaskCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True