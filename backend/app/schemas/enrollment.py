from datetime import datetime
from pydantic import BaseModel

from app.schemas.course import CourseRead


class EnrollmentCreate(BaseModel):
    employee_id: int
    course_id: int


class EnrollmentRead(BaseModel):
    id: int
    employee_id: int
    course_id: int
    assigned_at: datetime
    status: str
    course: CourseRead

    class Config:
        from_attributes = True