from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from .. import models
from ..database import get_db
from ..schemas.tasks import TaskInputSchema, TaskOutputSchema, TaskUpdateSchema

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

@router.get("/", response_model=list[TaskOutputSchema])
def get_tasks(db: Session = Depends(get_db)):
    """Retrieve all tasks from the database. Returns a list of tasks with their details.
    Sample response:
    [
        {
            "id": 1,
            "title": "Finish project report",
            "description": "Complete the final report for the project by the end of the week.",
            "status": "in_progress",
            "priority": "high",
            "created_at": "2024-06-01T12:34:56.789Z"
        },
        {
            "id": 2,
            "title": "Buy groceries",
            "description": null,
            "status": "todo",
            "priority": "medium",
            "created_at": "2024-06-02T09:15:30.123Z"
        }
    ]
    """
    db_tasks = db.query(models.Task).all()

    if not db_tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No tasks found in the database."
        )

    return db_tasks
    
@router.get("/{task_id}", response_model=TaskOutputSchema)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific task by its ID. Returns the task details if found.
    Sample response:
    {
        "id": 1,
        "title": "Finish project report",
        "description": "Complete the final report for the project by the end of the week.",
        "status": "in_progress",
        "priority": "high",
        "created_at": "2024-06-01T12:34:56.789Z"
    }
    """
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found."
        )
    return db_task
    
    
@router.patch("/{task_id}", response_model=TaskOutputSchema)
def update_task(task_id: int, task_update: TaskUpdateSchema, db: Session = Depends(get_db)):
        """Update the status of a specific task by its ID. Returns the updated task details if successful.
        Sample input:
        {
            "status": "done"
        }
        """
        db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if not db_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found."
            )

        if task_update.status not in VALID_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status '{task_update.status}'. Must be one of: {sorted(VALID_STATUSES)}."
            )

        #setattr(db_task, "status", task_update.status)
        db_task.status = task_update.status

        try:
            db.commit()
            db.refresh(db_task)
            return db_task
        except SQLAlchemyError as err:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating the task. Please try again."
            ) from err
        

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
        db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if not db_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found."
            )

        try:
            db.delete(db_task)
            db.commit()
        except SQLAlchemyError as err:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while deleting the task. Please try again."
            ) from err
        