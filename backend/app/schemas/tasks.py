from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str
    priority: Optional[str] = None


class TaskResponse(TaskCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
