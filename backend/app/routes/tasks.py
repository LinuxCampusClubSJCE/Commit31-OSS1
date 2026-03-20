from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Task
from app.schemas.tasks import TaskResponse

router = APIRouter(prefix="/api/v1/tasks", tags=["Tasks"])

@router.get("/")
def health_check():
    return {"message": "Tasks API is working 🚀"}


@router.get("", response_model=List[TaskResponse])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()
