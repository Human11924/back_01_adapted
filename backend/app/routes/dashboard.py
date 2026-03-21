from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.employee_profile import EmployeeProfile
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/fnb")
def get_fnb_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    if not current_user.organization_id:
        raise HTTPException(status_code=400, detail="User has no organization")

    profiles = (
        db.query(EmployeeProfile, User)
        .join(User, EmployeeProfile.user_id == User.id)
        .filter(
            User.organization_id == current_user.organization_id,
            EmployeeProfile.department == "F&B"
        )
        .all()
    )

    employees = []
    cefr_counts = {}

    for profile, user in profiles:
        level = profile.cefr_level or "Unknown"
        cefr_counts[level] = cefr_counts.get(level, 0) + 1

        employees.append({
            "id": profile.id,
            "full_name": profile.full_name,
            "position": profile.position,
            "department": profile.department,
            "cefr_level": profile.cefr_level,
            "email": user.email,
        })

    total_employees = len(employees)

    return {
        "stats": {
            "total_fnb_employees": total_employees,
            "active_learners": total_employees,
            "average_cefr": "A2" if total_employees > 0 else "N/A",
        },
        "cefr_distribution": cefr_counts,
        "employees": employees
    }