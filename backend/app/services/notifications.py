from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.notification import Notification
from app.models.enrollment import Enrollment
from app.models.lesson_progress import LessonProgress
from app.models.employee_profile import EmployeeProfile
from app.services.analytics import get_at_risk_employees, get_top_employees, get_department_analytics


def _create_notification_if_missing_today(
    db: Session,
    *,
    organization_id: int | None,
    employee_id: int | None,
    type: str,
    title: str,
    message: str,
) -> None:
    today = datetime.utcnow().date()

    existing = (
        db.query(Notification)
        .filter(
            Notification.organization_id == organization_id,
            Notification.employee_id == employee_id,
            Notification.type == type,
            Notification.title == title,
            Notification.message == message,
            func.date(Notification.created_at) == today,
        )
        .first()
    )
    if existing:
        return

    db.add(
        Notification(
            organization_id=organization_id,
            employee_id=employee_id,
            type=type,
            title=title,
            message=message,
            is_read=False,
        )
    )
    db.flush()


def _generate_employee_notifications(db: Session, employee_id: int) -> None:
    inactive_cutoff = datetime.utcnow() - timedelta(days=3)
    last_progress = (
        db.query(func.max(LessonProgress.updated_at))
        .join(Enrollment, Enrollment.id == LessonProgress.enrollment_id)
        .filter(Enrollment.employee_id == employee_id)
        .scalar()
    )

    if last_progress is None or last_progress < inactive_cutoff:
        _create_notification_if_missing_today(
            db,
            organization_id=None,
            employee_id=employee_id,
            type="INACTIVITY_REMINDER",
            title="You have been inactive",
            message="Complete a lesson today to keep momentum.",
        )

    active_enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.employee_id == employee_id, Enrollment.status == "active")
        .first()
    )
    if active_enrollment:
        _create_notification_if_missing_today(
            db,
            organization_id=None,
            employee_id=employee_id,
            type="ACTIVE_ENROLLMENT",
            title="Continue your active course",
            message="You have an active course in progress.",
        )


def _generate_admin_notifications(db: Session, organization_id: int) -> None:
    at_risk = get_at_risk_employees(db, organization_id)
    if at_risk:
        _create_notification_if_missing_today(
            db,
            organization_id=organization_id,
            employee_id=None,
            type="AT_RISK_ALERT",
            title="At-risk employees detected",
            message=f"{len(at_risk)} employee(s) require attention.",
        )

    inactive_cutoff = datetime.utcnow() - timedelta(days=7)
    inactive_count = (
        db.query(func.count(EmployeeProfile.id))
        .join(User, User.id == EmployeeProfile.user_id)
        .outerjoin(Enrollment, Enrollment.employee_id == EmployeeProfile.id)
        .outerjoin(LessonProgress, LessonProgress.enrollment_id == Enrollment.id)
        .filter(User.organization_id == organization_id)
        .group_by(EmployeeProfile.id)
        .having(func.max(LessonProgress.updated_at).is_(None) | (func.max(LessonProgress.updated_at) < inactive_cutoff))
        .count()
    )
    if inactive_count > 0:
        _create_notification_if_missing_today(
            db,
            organization_id=organization_id,
            employee_id=None,
            type="INACTIVE_EMPLOYEES",
            title="Inactive employees",
            message=f"{inactive_count} employee(s) inactive for 7+ days.",
        )

    top = get_top_employees(db, organization_id, limit=1)
    if top:
        _create_notification_if_missing_today(
            db,
            organization_id=organization_id,
            employee_id=None,
            type="HIGH_PERFORMER",
            title="Top performer update",
            message=f"{top[0].full_name} is leading this week.",
        )

    low_departments = [
        item for item in get_department_analytics(db, organization_id)
        if item.avg_progress_percent < 30
    ]
    if low_departments:
        _create_notification_if_missing_today(
            db,
            organization_id=organization_id,
            employee_id=None,
            type="LOW_DEPARTMENT_PROGRESS",
            title="Low department progress",
            message=f"{len(low_departments)} department(s) are below 30% progress.",
        )


def get_employee_notifications(db: Session, employee_id: int) -> list[Notification]:
    _generate_employee_notifications(db, employee_id)
    db.commit()

    return (
        db.query(Notification)
        .filter(Notification.employee_id == employee_id)
        .order_by(Notification.created_at.desc(), Notification.id.desc())
        .all()
    )


def get_admin_notifications(db: Session, organization_id: int) -> list[Notification]:
    _generate_admin_notifications(db, organization_id)
    db.commit()

    return (
        db.query(Notification)
        .filter(
            Notification.organization_id == organization_id,
            Notification.employee_id.is_(None),
        )
        .order_by(Notification.created_at.desc(), Notification.id.desc())
        .all()
    )


def mark_notification_as_read(
    db: Session,
    notification_id: int,
    *,
    employee_id: int | None,
    organization_id: int | None,
    is_admin: bool,
) -> Notification | None:
    query = db.query(Notification).filter(Notification.id == notification_id)

    if is_admin:
        query = query.filter(
            Notification.organization_id == organization_id,
            Notification.employee_id.is_(None),
        )
    else:
        query = query.filter(Notification.employee_id == employee_id)

    notification = query.first()
    if not notification:
        return None

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
