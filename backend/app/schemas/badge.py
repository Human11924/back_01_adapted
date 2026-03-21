from datetime import datetime
from pydantic import BaseModel


class BadgeRead(BaseModel):
    id: int
    code: str
    title: str
    description: str
    icon_name: str | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class EmployeeBadgeRead(BaseModel):
    id: int
    employee_id: int
    badge_id: int
    earned_at: datetime | None = None
    badge: BadgeRead

    class Config:
        from_attributes = True
