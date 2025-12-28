from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    """
    User model representing a registered user in the system
    """
    id: str = Field(primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255)
    name: str = Field(nullable=False, max_length=100)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class UserCreate(SQLModel):
    email: str
    name: str
    password: str


class UserRead(SQLModel):
    id: str
    email: str
    name: str
    created_at: datetime
    updated_at: datetime


class Task(SQLModel, table=True):
    """
    Task model representing a user's todo item
    """
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class TaskCreate(SQLModel):
    title: str
    description: Optional[str] = None


class TaskRead(SQLModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime