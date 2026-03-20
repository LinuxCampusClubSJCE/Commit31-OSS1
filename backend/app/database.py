import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./db_sqlite.db")

engine = create_engine(
    DATABASE_URL,
    # check_same_thread=False is required for SQLite to allow multi-threaded access
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def ensure_sqlite_schema():
    if not DATABASE_URL.startswith("sqlite"):
        return

    with engine.begin() as connection:
        inspector = inspect(connection)
        if not inspector.has_table("tasks"):
            return

        column_names = {column["name"] for column in inspector.get_columns("tasks")}
        if "priority" not in column_names:
            connection.execute(text("ALTER TABLE tasks ADD COLUMN priority VARCHAR"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
