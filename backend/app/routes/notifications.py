from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.employee_profile import EmployeeProfile
from app.schemas.notification import NotificationRead, RecommendationRead
from app.services.dependencies import get_current_user
from app.services.notifications import (
    get_employee_notifications,
    get_admin_notifications,
    mark_notification_as_read,
)
from app.services.recommendations import (
    get_employee_recommendations,
    get_admin_recommendations,
)

router = APIRouter(tags=["Notifications"])


def _get_profile_by_user_id(db: Session, user_id: int) -> EmployeeProfile | None:
    return (
        db.query(EmployeeProfile)
        .filter(EmployeeProfile.user_id == user_id)
        .first()
    )


@router.get("/notifications/me", response_model=list[NotificationRead])
def notifications_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view own notifications")

    profile = _get_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    return get_employee_notifications(db, profile.id)


@router.get("/notifications/admin", response_model=list[NotificationRead])
def notifications_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view organization notifications")

    if current_user.organization_id is None:
        raise HTTPException(status_code=400, detail="User has no organization")

    return get_admin_notifications(db, current_user.organization_id)


@router.patch("/notifications/{notification_id}/read", response_model=NotificationRead)
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employee_id = None
    organization_id = None
    is_admin = current_user.role == "admin"

    if current_user.role == "employee":
        profile = _get_profile_by_user_id(db, current_user.id)
        if not profile:
            raise HTTPException(status_code=404, detail="Employee profile not found")
        employee_id = profile.id
    elif current_user.role == "admin":
        organization_id = current_user.organization_id
        if organization_id is None:
            raise HTTPException(status_code=400, detail="User has no organization")
    else:
        raise HTTPException(status_code=403, detail="Access denied")

    notification = mark_notification_as_read(
        db,
        notification_id,
        employee_id=employee_id,
        organization_id=organization_id,
        is_admin=is_admin,
    )
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    return notification


@router.get("/recommendations/me", response_model=list[RecommendationRead])
def recommendations_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view own recommendations")

    profile = _get_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    return get_employee_recommendations(db, profile.id)


@router.get("/recommendations/admin", response_model=list[RecommendationRead])
def recommendations_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view organization recommendations")

    if current_user.organization_id is None:
        raise HTTPException(status_code=400, detail="User has no organization")

    return get_admin_recommendations(db, current_user.organization_id)
