from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.user import User
from app.models.course import Course, Module
from app.models.activity import Activity
from app.models.enrollment import Enrollment
from app.models.lesson_progress import LessonProgress
from app.models.activity import ActivityAttempt
from app.models.employee_points import EmployeePoints
from app.models.employee_profile import EmployeeProfile
from app.schemas.notification import RecommendationRead
from app.services.analytics import (
    get_at_risk_employees,
    get_top_employees,
    get_department_analytics,
)


def get_employee_recommendations(db: Session, employee_id: int) -> list[RecommendationRead]:
    recommendations: list[RecommendationRead] = []

    enrollments = (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.course)
            .joinedload(Course.modules)
            .joinedload(Module.lessons),
            joinedload(Enrollment.lesson_progress_items),
        )
        .filter(Enrollment.employee_id == employee_id)
        .order_by(Enrollment.assigned_at.asc(), Enrollment.id.asc())
        .all()
    )

    # Next lesson to complete in the earliest active enrollment.
    next_lesson_info: tuple[int, str] | None = None
    for enrollment in enrollments:
        if enrollment.status != "active":
            continue
        progress_by_lesson = {
            item.lesson_id: item.status
            for item in enrollment.lesson_progress_items
        }
        for module in sorted(enrollment.course.modules, key=lambda x: x.order_index):
            for lesson in sorted(module.lessons, key=lambda x: x.order_index):
                if progress_by_lesson.get(lesson.id) != "completed":
                    next_lesson_info = (lesson.id, lesson.title)
                    break
            if next_lesson_info:
                break
        if next_lesson_info:
            break

    if next_lesson_info:
        recommendations.append(
            RecommendationRead(
                type="next_lesson",
                title="Continue your next lesson",
                message=f"Complete lesson #{next_lesson_info[0]}: {next_lesson_info[1]}",
                priority="high",
            )
        )

    # Incomplete activity recommendation.
    lesson_ids = [
        lesson.id
        for enrollment in enrollments
        if enrollment.status == "active"
        for module in enrollment.course.modules
        for lesson in module.lessons
    ]
    if lesson_ids:
        activities = (
            db.query(Activity)
            .filter(Activity.lesson_id.in_(lesson_ids))
            .order_by(Activity.order_index.asc(), Activity.id.asc())
            .all()
        )
        activity_ids = [activity.id for activity in activities]
        completed_activity_ids = set()

        if activity_ids:
            completed_activity_ids = {
                activity_id
                for (activity_id,) in (
                    db.query(ActivityAttempt.activity_id)
                    .filter(
                        ActivityAttempt.employee_id == employee_id,
                        ActivityAttempt.activity_id.in_(activity_ids),
                        ActivityAttempt.completed_at.isnot(None),
                    )
                    .distinct()
                    .all()
                )
            }

        for activity in activities:
            if activity.id in completed_activity_ids:
                continue

            recommendations.append(
                RecommendationRead(
                    type="incomplete_activity",
                    title="Finish a pending activity",
                    message=f"Activity '{activity.title}' is still pending.",
                    priority="high",
                )
            )
            break

    # Streak reminder if no activity today.
    points = db.query(EmployeePoints).filter(EmployeePoints.employee_id == employee_id).first()
    if points:
        today = datetime.utcnow().date()
        last_day = points.updated_at.date() if points.updated_at else None
        if last_day != today:
            recommendations.append(
                RecommendationRead(
                    type="streak_reminder",
                    title="Keep your streak alive",
                    message=f"Current streak is {points.current_streak} day(s). Do one lesson or activity today.",
                    priority="medium",
                )
            )

    # Continue active enrollment.
    active_enrollment = next((e for e in enrollments if e.status == "active"), None)
    if active_enrollment:
        completed = sum(1 for p in active_enrollment.lesson_progress_items if p.status == "completed")
        total = sum(len(m.lessons) for m in active_enrollment.course.modules)
        percent = int((completed * 100) / total) if total > 0 else 0
        recommendations.append(
            RecommendationRead(
                type="continue_enrollment",
                title="Continue your active course",
                message=f"{active_enrollment.course.title}: {percent}% complete.",
                priority="medium",
            )
        )

    return recommendations[:6]


def get_admin_recommendations(db: Session, organization_id: int) -> list[RecommendationRead]:
    recommendations: list[RecommendationRead] = []

    at_risk = get_at_risk_employees(db, organization_id)
    if at_risk:
        recommendations.append(
            RecommendationRead(
                type="at_risk_employees",
                title="Support at-risk employees",
                message=f"{len(at_risk)} employee(s) are currently at risk.",
                priority="high",
            )
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
        recommendations.append(
            RecommendationRead(
                type="inactive_employees",
                title="Re-engage inactive learners",
                message=f"{inactive_count} employee(s) inactive for 7+ days.",
                priority="high",
            )
        )

    top_employees = get_top_employees(db, organization_id, limit=3)
    if top_employees:
        names = ", ".join([item.full_name for item in top_employees])
        recommendations.append(
            RecommendationRead(
                type="top_performers",
                title="Recognize top performers",
                message=f"Current top performers: {names}.",
                priority="medium",
            )
        )

    low_departments = [
        item for item in get_department_analytics(db, organization_id)
        if item.avg_progress_percent < 30
    ]
    if low_departments:
        names = ", ".join([(item.department or "Unknown") for item in low_departments[:3]])
        recommendations.append(
            RecommendationRead(
                type="low_department_progress",
                title="Focus on low-progress departments",
                message=f"Departments below 30% progress: {names}.",
                priority="medium",
            )
        )

    return recommendations[:6]
