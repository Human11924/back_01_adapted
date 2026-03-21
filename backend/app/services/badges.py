from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.enrollment import Enrollment
from app.models.activity import ActivityAttempt
from app.models.lesson_progress import LessonProgress
from app.models.employee_profile import EmployeeProfile
from app.models.employee_points import EmployeePoints
from app.models.badge import Badge, EmployeeBadge


DEFAULT_BADGES = [
    {
        "code": "FIRST_LESSON_COMPLETED",
        "title": "First Lesson Completed",
        "description": "Completed your first lesson.",
        "icon_name": "book-open",
    },
    {
        "code": "FIRST_ACTIVITY_COMPLETED",
        "title": "First Activity Completed",
        "description": "Completed your first activity.",
        "icon_name": "check-circle",
    },
    {
        "code": "STREAK_3_DAYS",
        "title": "3-Day Streak",
        "description": "Learned for 3 days in a row.",
        "icon_name": "flame",
    },
    {
        "code": "STREAK_7_DAYS",
        "title": "7-Day Streak",
        "description": "Learned for 7 days in a row.",
        "icon_name": "flame-strong",
    },
    {
        "code": "COURSE_COMPLETED",
        "title": "Course Completed",
        "description": "Completed your first assigned course.",
        "icon_name": "graduation-cap",
    },
    {
        "code": "TOP_3_LEADERBOARD",
        "title": "Top 3 Leaderboard",
        "description": "Reached top 3 in your organization leaderboard.",
        "icon_name": "trophy",
    },
]


def ensure_default_badges(db: Session) -> None:
    existing_codes = {
        code
        for (code,) in db.query(Badge.code).all()
    }

    for data in DEFAULT_BADGES:
        if data["code"] in existing_codes:
            continue
        db.add(Badge(**data))

    db.flush()


def award_badge_if_missing(db: Session, employee_id: int, badge_code: str) -> bool:
    ensure_default_badges(db)

    badge = db.query(Badge).filter(Badge.code == badge_code).first()
    if not badge:
        return False

    exists = (
        db.query(EmployeeBadge)
        .filter(
            EmployeeBadge.employee_id == employee_id,
            EmployeeBadge.badge_id == badge.id,
        )
        .first()
    )
    if exists:
        return False

    db.add(EmployeeBadge(employee_id=employee_id, badge_id=badge.id))
    db.flush()
    return True


def _employee_organization_id(db: Session, employee_id: int) -> int | None:
    org_id = (
        db.query(User.organization_id)
        .join(EmployeeProfile, EmployeeProfile.user_id == User.id)
        .filter(EmployeeProfile.id == employee_id)
        .scalar()
    )
    return org_id


def _is_employee_top_3(db: Session, employee_id: int, organization_id: int) -> bool:
    if organization_id is None:
        return False

    rows = (
        db.query(EmployeeProfile.id)
        .join(User, User.id == EmployeeProfile.user_id)
        .join(EmployeePoints, EmployeePoints.employee_id == EmployeeProfile.id)
        .filter(User.organization_id == organization_id)
        .order_by(EmployeePoints.total_xp.desc(), EmployeePoints.updated_at.asc())
        .limit(3)
        .all()
    )
    top_ids = {row[0] for row in rows}
    return employee_id in top_ids


def check_and_award_badges_for_employee(db: Session, employee_id: int) -> None:
    ensure_default_badges(db)

    completed_lessons = (
        db.query(func.count(LessonProgress.id))
        .join(Enrollment, Enrollment.id == LessonProgress.enrollment_id)
        .filter(
            Enrollment.employee_id == employee_id,
            LessonProgress.status == "completed",
        )
        .scalar()
        or 0
    )
    if completed_lessons >= 1:
        award_badge_if_missing(db, employee_id, "FIRST_LESSON_COMPLETED")

    completed_activities = (
        db.query(func.count(ActivityAttempt.id))
        .filter(
            ActivityAttempt.employee_id == employee_id,
            ActivityAttempt.completed_at.isnot(None),
        )
        .scalar()
        or 0
    )
    if completed_activities >= 1:
        award_badge_if_missing(db, employee_id, "FIRST_ACTIVITY_COMPLETED")

    current_streak = (
        db.query(EmployeePoints.current_streak)
        .filter(EmployeePoints.employee_id == employee_id)
        .scalar()
        or 0
    )
    if current_streak >= 3:
        award_badge_if_missing(db, employee_id, "STREAK_3_DAYS")
    if current_streak >= 7:
        award_badge_if_missing(db, employee_id, "STREAK_7_DAYS")

    completed_courses = (
        db.query(func.count(Enrollment.id))
        .filter(
            Enrollment.employee_id == employee_id,
            Enrollment.status == "completed",
        )
        .scalar()
        or 0
    )
    if completed_courses >= 1:
        award_badge_if_missing(db, employee_id, "COURSE_COMPLETED")

    organization_id = _employee_organization_id(db, employee_id)
    if _is_employee_top_3(db, employee_id, organization_id):
        award_badge_if_missing(db, employee_id, "TOP_3_LEADERBOARD")
