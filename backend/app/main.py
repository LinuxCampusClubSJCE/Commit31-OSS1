from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn

from .database import engine, Base, get_db, ensure_sqlite_schema
from . import models
from .models import Task
from .schemas.tasks import TaskCreate, TaskResponse
from app.routes.tasks import router as tasks_router

Base.metadata.create_all(bind=engine)
ensure_sqlite_schema()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=True)
