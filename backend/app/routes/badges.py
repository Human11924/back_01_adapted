from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.user import User
from app.models.badge import EmployeeBadge
from app.models.employee_profile import EmployeeProfile
from app.schemas.badge import EmployeeBadgeRead
from app.services.dependencies import get_current_user

router = APIRouter(tags=["Badges"])


def _get_profile_by_user_id(db: Session, user_id: int) -> EmployeeProfile | None:
    return (
        db.query(EmployeeProfile)
        .filter(EmployeeProfile.user_id == user_id)
        .first()
    )


@router.get("/badges/me", response_model=list[EmployeeBadgeRead])
def get_my_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view own badges")

    profile = _get_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    badges = (
        db.query(EmployeeBadge)
        .options(joinedload(EmployeeBadge.badge))
        .filter(EmployeeBadge.employee_id == profile.id)
        .order_by(EmployeeBadge.earned_at.desc(), EmployeeBadge.id.desc())
        .all()
    )

    return badges


@router.get("/badges/employee/{employee_id}", response_model=list[EmployeeBadgeRead])
def get_employee_badges(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view employee badges")

    profile = (
        db.query(EmployeeProfile)
        .join(User, User.id == EmployeeProfile.user_id)
        .filter(EmployeeProfile.id == employee_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee_user = db.query(User).filter(User.id == profile.user_id).first()
    if not employee_user or employee_user.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")

    badges = (
        db.query(EmployeeBadge)
        .options(joinedload(EmployeeBadge.badge))
        .filter(EmployeeBadge.employee_id == employee_id)
        .order_by(EmployeeBadge.earned_at.desc(), EmployeeBadge.id.desc())
        .all()
    )

    return badges
