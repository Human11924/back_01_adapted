from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class EmployeeListItemRead(BaseModel):
    employee_id: int
    full_name: str
    email: str
    department: str | None = None
    position: str | None = None
    cefr_level: str | None = None
    total_xp: int
    level: str
    is_active: bool
    created_at: datetime
