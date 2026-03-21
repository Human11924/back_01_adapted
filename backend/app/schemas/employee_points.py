from datetime import datetime
from pydantic import BaseModel


class EmployeePointsRead(BaseModel):
    employee_id: int
    total_xp: int
    current_streak: int
    weekly_xp: int
    level: str
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class LeaderboardItem(BaseModel):
    rank: int
    employee_id: int
    full_name: str
    department: str | None = None
    total_xp: int
    current_streak: int
    weekly_xp: int
    level: str
