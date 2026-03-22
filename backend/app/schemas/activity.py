from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel


class ActivityCreate(BaseModel):
    lesson_id: int
    type: str
    title: str
    description: Optional[str] = None
    content_json: Optional[Any] = None
    max_score: int = 100
    order_index: int = 1


class ActivityRead(BaseModel):
    id: int
    lesson_id: int
    type: str
    title: str
    description: Optional[str] = None
    content_json: Optional[Any] = None
    max_score: int
    order_index: int

    class Config:
        from_attributes = True


class ActivityAttemptCreate(BaseModel):
    answers_json: Optional[Any] = None
    score: Optional[int] = None


class ActivityAttemptRead(BaseModel):
    id: int
    employee_id: int
    activity_id: int
    attempt_number: int
    score: int
    answers_json: Optional[Any] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True