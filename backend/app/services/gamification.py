from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.course import Lesson, Module
from app.models.lesson_progress import LessonProgress
from app.models.activity import ActivityAttempt
from app.models.employee_points import EmployeePoints
from app.models.enrollment import Enrollment


LESSON_COMPLETION_XP = 50
MODULE_COMPLETION_BONUS_XP = 100


def calculate_level(total_xp: int) -> str:
    if total_xp >= 1500:
        return "Gold"
    if total_xp >= 500:
        return "Silver"
    return "Bronze"


def get_or_create_employee_points(db: Session, employee_id: int) -> EmployeePoints:
    points = (
        db.query(EmployeePoints)
        .filter(EmployeePoints.employee_id == employee_id)
        .first()
    )
    if points:
        return points

    points = EmployeePoints(employee_id=employee_id)
    db.add(points)
    db.flush()
    return points


def add_xp(db: Session, employee_id: int, amount: int) -> EmployeePoints:
    if amount <= 0:
        return get_or_create_employee_points(db, employee_id)

    points = get_or_create_employee_points(db, employee_id)
    points.total_xp += amount
    points.weekly_xp += amount
    points.level = calculate_level(points.total_xp)
    points.updated_at = datetime.utcnow()
    db.flush()
    return points


def update_streak(db: Session, employee_id: int) -> EmployeePoints:
    points = get_or_create_employee_points(db, employee_id)

    today = datetime.utcnow().date()
    last_update_date = points.updated_at.date() if points.updated_at else None

    if last_update_date == today:
        from app.services.badges import check_and_award_badges_for_employee
        check_and_award_badges_for_employee(db, employee_id)
        return points

    if last_update_date == (today - timedelta(days=1)):
        points.current_streak += 1
    else:
        points.current_streak = 1

    points.updated_at = datetime.utcnow()
    db.flush()

    from app.services.badges import check_and_award_badges_for_employee
    check_and_award_badges_for_employee(db, employee_id)

    return points


def _is_module_completed(db: Session, enrollment_id: int, module_id: int) -> bool:
    total_lessons = (
        db.query(Lesson)
        .filter(Lesson.module_id == module_id)
        .count()
    )
    if total_lessons == 0:
        return False

    completed_lessons = (
        db.query(LessonProgress)
        .join(Lesson, Lesson.id == LessonProgress.lesson_id)
        .filter(
            LessonProgress.enrollment_id == enrollment_id,
            Lesson.module_id == module_id,
            LessonProgress.status == "completed",
        )
        .count()
    )

    return completed_lessons == total_lessons


def _is_enrollment_completed(db: Session, enrollment_id: int) -> bool:
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        return False

    total_lessons = (
        db.query(Lesson)
        .join(Module, Module.id == Lesson.module_id)
        .filter(Module.course_id == enrollment.course_id)
        .count()
    )
    if total_lessons == 0:
        return False

    completed_lessons = (
        db.query(LessonProgress)
        .join(Lesson, Lesson.id == LessonProgress.lesson_id)
        .join(Module, Module.id == Lesson.module_id)
        .filter(
            LessonProgress.enrollment_id == enrollment_id,
            Module.course_id == enrollment.course_id,
            LessonProgress.status == "completed",
        )
        .count()
    )

    return completed_lessons == total_lessons


def award_lesson_completion_xp(
    db: Session,
    employee_id: int,
    enrollment_id: int,
    module_id: int,
) -> EmployeePoints:
    # Called only on non-completed -> completed transition.
    update_streak(db, employee_id)
    points = add_xp(db, employee_id, LESSON_COMPLETION_XP)

    if _is_module_completed(db, enrollment_id, module_id):
        points = add_xp(db, employee_id, MODULE_COMPLETION_BONUS_XP)

    if _is_enrollment_completed(db, enrollment_id):
        enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
        if enrollment and enrollment.status != "completed":
            enrollment.status = "completed"
            db.flush()

    from app.services.badges import check_and_award_badges_for_employee
    check_and_award_badges_for_employee(db, employee_id)

    return points


def award_activity_completion_xp(
    db: Session,
    attempt: ActivityAttempt,
) -> bool:
    if attempt.completed_at is None:
        return False

    # Idempotency guard: award activity XP only once per employee/activity.
    already_awarded = (
        db.query(ActivityAttempt)
        .filter(
            ActivityAttempt.employee_id == attempt.employee_id,
            ActivityAttempt.activity_id == attempt.activity_id,
            ActivityAttempt.completed_at.isnot(None),
            ActivityAttempt.id != attempt.id,
        )
        .first()
        is not None
    )

    if already_awarded:
        return False

    update_streak(db, attempt.employee_id)
    add_xp(db, attempt.employee_id, max(0, attempt.score or 0))

    from app.services.badges import check_and_award_badges_for_employee
    check_and_award_badges_for_employee(db, attempt.employee_id)

    return True
