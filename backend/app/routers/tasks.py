from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from .. import models
from ..database import get_db
from ..schemas.tasks import TaskInputSchema, TaskOutputSchema

router = APIRouter(prefix="/tasks", tags=["Tasks"])

VALID_STATUSES = {"todo", "in_progress", "done"}
VALID_PRIORITIES = {"low", "medium", "high"}

@router.post("/", response_model=TaskOutputSchema, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskInputSchema, db: Session = Depends(get_db)):
    """
    Create a new task with the provided data. The task data is validated using the TaskInputSchema.
    Sample input:
    {
        "title": "Finish project report",
        "description": "Complete the final report for the project by the end of the week.",
        "status": "in_progress",
        "priority": "high"
    }
    """
    if not task.title.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title cannot be empty or whitespace."
        )

    if task.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status '{task.status}'. Must be one of: {sorted(VALID_STATUSES)}."
        )

    if task.priority not in VALID_PRIORITIES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid priority '{task.priority}'. Must be one of: {sorted(VALID_PRIORITIES)}."
        )

    try:
        db_task = models.Task(**task.model_dump())
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    except SQLAlchemyError as err:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while saving the task. Please try again."
        ) from err