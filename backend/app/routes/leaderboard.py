from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.employee_profile import EmployeeProfile
from app.models.employee_points import EmployeePoints
from app.schemas.employee_points import EmployeePointsRead, LeaderboardItem
from app.services.dependencies import get_current_user
from app.services.gamification import get_or_create_employee_points

router = APIRouter(tags=["Leaderboard"])


def get_my_profile(db: Session, current_user: User) -> EmployeeProfile | None:
    return (
        db.query(EmployeeProfile)
        .filter(EmployeeProfile.user_id == current_user.id)
        .first()
    )


def _get_org_leaderboard(
    db: Session,
    organization_id: int,
    department: str | None = None,
) -> list[LeaderboardItem]:
    query = (
        db.query(EmployeeProfile, EmployeePoints)
        .join(User, EmployeeProfile.user_id == User.id)
        .join(EmployeePoints, EmployeePoints.employee_id == EmployeeProfile.id)
        .filter(User.organization_id == organization_id)
    )

    if department is not None:
        query = query.filter(EmployeeProfile.department == department)

    rows = (
        query
        .order_by(EmployeePoints.total_xp.desc(), EmployeePoints.updated_at.asc())
        .all()
    )

    items: list[LeaderboardItem] = []
    for idx, (employee, points) in enumerate(rows, start=1):
        items.append(
            LeaderboardItem(
                rank=idx,
                employee_id=employee.id,
                full_name=employee.full_name,
                department=employee.department,
                total_xp=points.total_xp,
                current_streak=points.current_streak,
                weekly_xp=points.weekly_xp,
                level=points.level,
            )
        )

    return items


@router.get("/leaderboard", response_model=list[LeaderboardItem])
def get_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["admin", "employee"]:
        raise HTTPException(status_code=403, detail="Access denied")

    if current_user.organization_id is None:
        raise HTTPException(status_code=403, detail="User organization not found")

    return _get_org_leaderboard(db, current_user.organization_id)


@router.get("/leaderboard/department/{department}", response_model=list[LeaderboardItem])
def get_leaderboard_by_department(
    department: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can filter by department")

    if current_user.organization_id is None:
        raise HTTPException(status_code=403, detail="User organization not found")

    return _get_org_leaderboard(db, current_user.organization_id, department=department)


@router.get("/leaderboard/me", response_model=EmployeePointsRead)
def get_my_points(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view own points")

    profile = get_my_profile(db, current_user)
    if not profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    points = get_or_create_employee_points(db, profile.id)
    db.commit()
    db.refresh(points)

    return points
