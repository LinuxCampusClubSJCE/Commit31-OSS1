from fastapi import FastAPI
from app.routes.tasks import router as tasks_router

app = FastAPI()

@app.get("/")
def home():
    return {"message": "hello world"}

app.include_router(tasks_router)