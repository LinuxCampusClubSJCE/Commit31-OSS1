from pydantic import BaseModel
from pydantic.config import ConfigDict
from typing import Optional
from datetime import datetime

class TaskInputSchema(BaseModel):
    title: str
    description: Optional[str] = None
    status: str
    priority: str = "medium"

class TaskOutputSchema(TaskInputSchema):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TaskUpdateSchema(BaseModel):
    status: str