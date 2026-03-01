from fastapi import FastAPI
from routes.tasks import router as tasks_router

app = FastAPI()

@app.get("/")
def home():
    return {"message": "hello world"}

# Include versioned task routes
app.include_router(tasks_router)