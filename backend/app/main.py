from fastapi import Depends, FastAPI,HTTPException,status
from sqlalchemy.orm import Session
import uvicorn

from .database import engine, Base, get_db
from . import models
from .models import Task
from .schemas.tasks import TaskCreate, TaskResponse
from app.routes.tasks import router as tasks_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include versioned task routes
app.include_router(tasks_router)

@app.get("/")
def home():
    return {"message": "hello world"}

@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.delete("/task/{task_id}",status_code=204)
def delete_task(task_id=int,db:Session=Depends(get_db)):
    task=db.query(Task).filter(Task.id==task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with {task_id} not found",
        )
    else:
        db.delete(task)
        db.commit()
        
if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=True)