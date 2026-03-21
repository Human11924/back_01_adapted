from datetime import datetime
from pydantic import BaseModel


class NotificationRead(BaseModel):
    id: int
    organization_id: int | None = None
    employee_id: int | None = None
    type: str
    title: str
    message: str
    is_read: bool
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class RecommendationRead(BaseModel):
    type: str
    title: str
    message: str
    priority: str = "medium"
    employee_id: int | None = None
    department: str | None = None
