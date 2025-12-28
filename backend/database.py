from sqlmodel import SQLModel, create_engine, Session
from models import User, Task
import os

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo.db")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables for all models"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency generator for database session"""
    with Session(engine) as session:
        yield session