from __future__ import annotations

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.employee_points import EmployeePoints
from app.models.employee_profile import EmployeeProfile
from app.models.user import User
from app.schemas.employee import EmployeeListItemRead


def list_employees_for_org(db: Session, organization_id: int) -> list[EmployeeListItemRead]:
    rows = (
        db.query(
            EmployeeProfile.id.label("employee_id"),
            EmployeeProfile.full_name.label("full_name"),
            User.email.label("email"),
            EmployeeProfile.department.label("department"),
            EmployeeProfile.position.label("position"),
            EmployeeProfile.cefr_level.label("cefr_level"),
            func.coalesce(EmployeePoints.total_xp, 0).label("total_xp"),
            func.coalesce(EmployeePoints.level, "Bronze").label("level"),
            User.is_active.label("is_active"),
            User.created_at.label("created_at"),
        )
        .join(User, EmployeeProfile.user_id == User.id)
        .outerjoin(EmployeePoints, EmployeePoints.employee_id == EmployeeProfile.id)
        .filter(
            User.organization_id == organization_id,
            User.role == "employee",
        )
        .order_by(EmployeeProfile.full_name.asc(), EmployeeProfile.id.asc())
        .all()
    )

    items: list[EmployeeListItemRead] = []
    for row in rows:
        items.append(EmployeeListItemRead(**row._asdict()))

    return items


def get_employee_for_org(
    db: Session,
    organization_id: int,
    employee_id: int,
) -> EmployeeListItemRead | None:
    row = (
        db.query(
            EmployeeProfile.id.label("employee_id"),
            EmployeeProfile.full_name.label("full_name"),
            User.email.label("email"),
            EmployeeProfile.department.label("department"),
            EmployeeProfile.position.label("position"),
            EmployeeProfile.cefr_level.label("cefr_level"),
            func.coalesce(EmployeePoints.total_xp, 0).label("total_xp"),
            func.coalesce(EmployeePoints.level, "Bronze").label("level"),
            User.is_active.label("is_active"),
            User.created_at.label("created_at"),
        )
        .join(User, EmployeeProfile.user_id == User.id)
        .outerjoin(EmployeePoints, EmployeePoints.employee_id == EmployeeProfile.id)
        .filter(
            User.organization_id == organization_id,
            User.role == "employee",
            EmployeeProfile.id == employee_id,
        )
        .first()
    )

    if not row:
        return None

    return EmployeeListItemRead(**row._asdict())
