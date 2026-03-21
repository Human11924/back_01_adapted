from datetime import datetime, timedelta
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.course import Lesson, Module
from app.models.enrollment import Enrollment
from app.models.lesson_progress import LessonProgress
from app.models.employee_profile import EmployeeProfile
from app.models.employee_points import EmployeePoints
from app.schemas.analytics import (
    AnalyticsOverviewRead,
    DepartmentAnalyticsRead,
    TopEmployeeRead,
    AtRiskEmployeeRead,
)


def _course_lessons_subquery(db: Session):
    return (
        db.query(
            Module.course_id.label("course_id"),
            func.count(Lesson.id).label("total_lessons"),
        )
        .join(Lesson, Lesson.module_id == Module.id)
        .group_by(Module.course_id)
        .subquery()
    )


def _org_enrollments_query(db: Session, organization_id: int):
    return (
        db.query(Enrollment)
        .join(EmployeeProfile, EmployeeProfile.id == Enrollment.employee_id)
        .join(User, User.id == EmployeeProfile.user_id)
        .filter(User.organization_id == organization_id)
    )


def get_analytics_overview(db: Session, organization_id: int) -> AnalyticsOverviewRead:
    total_employees = (
        db.query(func.count(EmployeeProfile.id))
        .join(User, User.id == EmployeeProfile.user_id)
        .filter(User.organization_id == organization_id)
        .scalar()
        or 0
    )

    active_learners = (
        db.query(func.count(func.distinct(Enrollment.employee_id)))
        .join(EmployeeProfile, EmployeeProfile.id == Enrollment.employee_id)
        .join(User, User.id == EmployeeProfile.user_id)
        .join(LessonProgress, LessonProgress.enrollment_id == Enrollment.id)
        .filter(
            User.organization_id == organization_id,
            LessonProgress.status.in_(["in_progress", "completed"]),
        )
        .scalar()
        or 0
    )

    completed_enrollments = (
        _org_enrollments_query(db, organization_id)
        .filter(Enrollment.status == "completed")
        .count()
    )

    total_courses = (
        _org_enrollments_query(db, organization_id)
        .with_entities(func.count(func.distinct(Enrollment.course_id)))
        .scalar()
        or 0
    )

    total_lessons_completed = (
        db.query(func.count(LessonProgress.id))
        .join(Enrollment, Enrollment.id == LessonProgress.enrollment_id)
        .join(EmployeeProfile, EmployeeProfile.id == Enrollment.employee_id)
        .join(User, User.id == EmployeeProfile.user_id)
        .filter(
            User.organization_id == organization_id,
            LessonProgress.status == "completed",
        )
        .scalar()
        or 0
    )

    course_lessons_sq = _course_lessons_subquery(db)

    total_assigned_lessons = (
        db.query(func.coalesce(func.sum(course_lessons_sq.c.total_lessons), 0))
        .select_from(Enrollment)
        .join(EmployeeProfile, EmployeeProfile.id == Enrollment.employee_id)
        .join(User, User.id == EmployeeProfile.user_id)
        .outerjoin(
            course_lessons_sq,
            course_lessons_sq.c.course_id == Enrollment.course_id,
        )
        .filter(User.organization_id == organization_id)
        .scalar()
        or 0
    )

    avg_progress_value = 0.0
    if total_assigned_lessons > 0:
        avg_progress_value = (float(total_lessons_completed) * 100.0) / float(total_assigned_lessons)

    return AnalyticsOverviewRead(
        total_employees=total_employees,
        active_learners=active_learners,
        avg_progress_percent=round(float(avg_progress_value), 2),
        completed_enrollments=completed_enrollments,
        total_courses=total_courses,
        total_lessons_completed=total_lessons_completed,
    )


def get_department_analytics(db: Session, organization_id: int) -> list[DepartmentAnalyticsRead]:
    dept_employee_rows = (
        db.query(
            EmployeeProfile.department.label("department"),
            func.count(func.distinct(EmployeeProfile.id)).label("employees_count"),
        )
        .join(User, User.id == EmployeeProfile.user_id)
        .filter(User.organization_id == organization_id)
        .group_by(EmployeeProfile.department)
        .all()
    )

    dept_xp_rows = (
        db.query(
            EmployeeProfile.department.label("department"),
            func.coalesce(func.sum(EmployeePoints.total_xp), 0).label("total_xp"),
        )
        .join(User, User.id == EmployeeProfile.user_id)
        .outerjoin(EmployeePoints, EmployeePoints.employee_id == EmployeeProfile.id)
        .filter(User.organization_id == organization_id)
        .group_by(EmployeeProfile.department)
        .all()
    )

    dept_completed_rows = (
        db.query(
            EmployeeProfile.department.label("department"),
            func.count(LessonProgress.id).label("completed_lessons"),
        )
        .join(User, User.id == EmployeeProfile.user_id)
        .join(Enrollment, Enrollment.employee_id == EmployeeProfile.id)
        .join(LessonProgress, LessonProgress.enrollment_id == Enrollment.id)
        .filter(
            User.organization_id == organization_id,
            LessonProgress.status == "completed",
        )
        .group_by(EmployeeProfile.department)
        .all()
    )

    course_lessons_sq = _course_lessons_subquery(db)

    dept_assigned_rows = (
        db.query(
            EmployeeProfile.department.label("department"),
            func.coalesce(func.sum(course_lessons_sq.c.total_lessons), 0).label("assigned_lessons"),
        )
        .select_from(Enrollment)
        .join(EmployeeProfile, EmployeeProfile.id == Enrollment.employee_id)
        .join(User, User.id == EmployeeProfile.user_id)
        .outerjoin(
            course_lessons_sq,
            course_lessons_sq.c.course_id == Enrollment.course_id,
        )
        .filter(User.organization_id == organization_id)
        .group_by(EmployeeProfile.department)
        .all()
    )

    xp_map = {row.department: int(row.total_xp or 0) for row in dept_xp_rows}
    completed_map = {row.department: int(row.completed_lessons or 0) for row in dept_completed_rows}
    assigned_map = {row.department: int(row.assigned_lessons or 0) for row in dept_assigned_rows}

    items: list[DepartmentAnalyticsRead] = []
    for row in dept_employee_rows:
        department = row.department
        completed = completed_map.get(department, 0)
        assigned = assigned_map.get(department, 0)
        avg_progress_percent = 0.0
        if assigned > 0:
            avg_progress_percent = (completed * 100.0) / assigned

        items.append(
            DepartmentAnalyticsRead(
                department=department,
                employees_count=int(row.employees_count or 0),
                avg_progress_percent=round(avg_progress_percent, 2),
                total_xp=xp_map.get(department, 0),
                completed_lessons=completed,
            )
        )

    items.sort(key=lambda x: (x.department or ""))
    return items


def get_top_employees(
    db: Session,
    organization_id: int,
    limit: int = 10,
) -> list[TopEmployeeRead]:
    rows = (
        db.query(
            EmployeeProfile.id.label("employee_id"),
            EmployeeProfile.full_name.label("full_name"),
            EmployeeProfile.department.label("department"),
            func.coalesce(EmployeePoints.total_xp, 0).label("total_xp"),
            func.coalesce(EmployeePoints.level, "Bronze").label("level"),
            func.coalesce(
                func.sum(case((LessonProgress.status == "completed", 1), else_=0)),
                0,
            ).label("completed_lessons"),
        )
        .join(User, User.id == EmployeeProfile.user_id)
        .outerjoin(EmployeePoints, EmployeePoints.employee_id == EmployeeProfile.id)
        .outerjoin(Enrollment, Enrollment.employee_id == EmployeeProfile.id)
        .outerjoin(LessonProgress, LessonProgress.enrollment_id == Enrollment.id)
        .filter(User.organization_id == organization_id)
        .group_by(
            EmployeeProfile.id,
            EmployeeProfile.full_name,
            EmployeeProfile.department,
            EmployeePoints.total_xp,
            EmployeePoints.level,
        )
        .order_by(func.coalesce(EmployeePoints.total_xp, 0).desc(), func.coalesce(
            func.sum(case((LessonProgress.status == "completed", 1), else_=0)),
            0,
        ).desc())
        .limit(limit)
        .all()
    )

    return [
        TopEmployeeRead(
            employee_id=row.employee_id,
            full_name=row.full_name,
            department=row.department,
            total_xp=int(row.total_xp or 0),
            level=row.level,
            completed_lessons=int(row.completed_lessons or 0),
        )
        for row in rows
    ]


def get_at_risk_employees(
    db: Session,
    organization_id: int,
    inactive_days: int = 14,
    low_completion_percent: float = 30.0,
    low_completed_lessons: int = 2,
) -> list[AtRiskEmployeeRead]:
    course_lessons_sq = _course_lessons_subquery(db)

    assigned_lessons_sq = (
        db.query(
            Enrollment.employee_id.label("employee_id"),
            func.coalesce(func.sum(course_lessons_sq.c.total_lessons), 0).label("assigned_lessons"),
        )
        .outerjoin(
            course_lessons_sq,
            course_lessons_sq.c.course_id == Enrollment.course_id,
        )
        .group_by(Enrollment.employee_id)
        .subquery()
    )

    completed_lessons_sq = (
        db.query(
            Enrollment.employee_id.label("employee_id"),
            func.coalesce(func.sum(case((LessonProgress.status == "completed", 1), else_=0)), 0).label("completed_lessons"),
            func.max(LessonProgress.updated_at).label("last_activity_at"),
        )
        .outerjoin(LessonProgress, LessonProgress.enrollment_id == Enrollment.id)
        .group_by(Enrollment.employee_id)
        .subquery()
    )

    rows = (
        db.query(
            EmployeeProfile.id.label("employee_id"),
            EmployeeProfile.full_name.label("full_name"),
            EmployeeProfile.department.label("department"),
            func.coalesce(assigned_lessons_sq.c.assigned_lessons, 0).label("assigned_lessons"),
            func.coalesce(completed_lessons_sq.c.completed_lessons, 0).label("completed_lessons"),
            completed_lessons_sq.c.last_activity_at.label("last_activity_at"),
        )
        .join(User, User.id == EmployeeProfile.user_id)
        .outerjoin(
            assigned_lessons_sq,
            assigned_lessons_sq.c.employee_id == EmployeeProfile.id,
        )
        .outerjoin(
            completed_lessons_sq,
            completed_lessons_sq.c.employee_id == EmployeeProfile.id,
        )
        .filter(User.organization_id == organization_id)
        .all()
    )

    cutoff = datetime.utcnow() - timedelta(days=inactive_days)

    result: list[AtRiskEmployeeRead] = []
    for row in rows:
        assigned = int(row.assigned_lessons or 0)
        completed = int(row.completed_lessons or 0)
        completion_percent = 0.0
        if assigned > 0:
            completion_percent = (completed * 100.0) / assigned

        no_recent_progress = row.last_activity_at is None or row.last_activity_at < cutoff
        is_low_completion = completion_percent < low_completion_percent
        has_few_completed = completed <= low_completed_lessons

        if no_recent_progress or is_low_completion or has_few_completed:
            result.append(
                AtRiskEmployeeRead(
                    employee_id=row.employee_id,
                    full_name=row.full_name,
                    department=row.department,
                    completion_percent=round(completion_percent, 2),
                    completed_lessons=completed,
                    last_activity_at=row.last_activity_at,
                )
            )

    result.sort(key=lambda x: (x.completion_percent, x.completed_lessons))
    return result
