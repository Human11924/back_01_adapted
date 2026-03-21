from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class LessonProgressCreate(BaseModel):
    enrollment_id: int


class LessonProgressUpdate(BaseModel):
    progress_percent: Optional[int] = None
    status: Optional[str] = None


class LessonProgressRead(BaseModel):
    id: int
    enrollment_id: int
    lesson_id: int
    status: str
    progress_percent: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


from typing import List


class EnrollmentProgressItem(BaseModel):
    enrollment_id: int
    course_id: int
    course_title: str
    total_lessons: int
    completed_lessons: int
    progress_percent: int
    lesson_progress: List[LessonProgressRead]


class MyProgressResponse(BaseModel):
    items: List[EnrollmentProgressItem]