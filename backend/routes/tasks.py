from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/tasks", tags=["Tasks"])

@router.get("/")
def health_check():
    return {"message": "Tasks API is working 🚀"}