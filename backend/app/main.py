from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
import uvicorn

from .database import engine, Base, get_db
from .models import Task
from .schemas.tasks import TaskCreate, TaskResponse

Base.metadata.create_all(bind=engine)

app = FastAPI()


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


if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=True)