from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.analytics import (
    AnalyticsOverviewRead,
    DepartmentAnalyticsRead,
    TopEmployeeRead,
    AtRiskEmployeeRead,
)
from app.services.dependencies import get_current_user
from app.services.analytics import (
    get_analytics_overview,
    get_department_analytics,
    get_top_employees,
    get_at_risk_employees,
)

router = APIRouter(tags=["Analytics"])


def _require_admin_org(current_user: User) -> int:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    if current_user.organization_id is None:
        raise HTTPException(status_code=400, detail="User has no organization")

    return current_user.organization_id


@router.get("/analytics/overview", response_model=AnalyticsOverviewRead)
def analytics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    organization_id = _require_admin_org(current_user)
    return get_analytics_overview(db, organization_id)


@router.get("/analytics/departments", response_model=list[DepartmentAnalyticsRead])
def analytics_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    organization_id = _require_admin_org(current_user)
    return get_department_analytics(db, organization_id)


@router.get("/analytics/top-employees", response_model=list[TopEmployeeRead])
def analytics_top_employees(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    organization_id = _require_admin_org(current_user)
    if limit < 1:
        limit = 1
    if limit > 100:
        limit = 100
    return get_top_employees(db, organization_id, limit=limit)


@router.get("/analytics/at-risk", response_model=list[AtRiskEmployeeRead])
def analytics_at_risk(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    organization_id = _require_admin_org(current_user)
    return get_at_risk_employees(db, organization_id)
