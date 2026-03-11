from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.sql import func
from .database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, nullable=False, default="todo")
    priority = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
