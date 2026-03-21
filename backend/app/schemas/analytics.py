from datetime import datetime
from pydantic import BaseModel


class AnalyticsOverviewRead(BaseModel):
    total_employees: int
    active_learners: int
    avg_progress_percent: float
    completed_enrollments: int
    total_courses: int
    total_lessons_completed: int


class DepartmentAnalyticsRead(BaseModel):
    department: str | None = None
    employees_count: int
    avg_progress_percent: float
    total_xp: int
    completed_lessons: int


class TopEmployeeRead(BaseModel):
    employee_id: int
    full_name: str
    department: str | None = None
    total_xp: int
    level: str
    completed_lessons: int


class AtRiskEmployeeRead(BaseModel):
    employee_id: int
    full_name: str
    department: str | None = None
    completion_percent: float
    completed_lessons: int
    last_activity_at: datetime | None = None
