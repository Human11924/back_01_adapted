from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.user import User
from app.models.employee_profile import EmployeeProfile
from app.models.course import Course, Module, Lesson
from app.models.enrollment import Enrollment
from app.models.lesson_progress import LessonProgress
from app.schemas.lesson_progress import (
    LessonProgressCreate,
    LessonProgressUpdate,
    LessonProgressRead,
    EnrollmentProgressItem,
    MyProgressResponse,
)
from app.services.dependencies import get_current_user
from app.services.gamification import award_lesson_completion_xp

router = APIRouter(tags=["Lesson Progress"])


def get_my_employee_profile(db: Session, current_user: User) -> EmployeeProfile | None:
    return db.query(EmployeeProfile).filter(
        EmployeeProfile.user_id == current_user.id
    ).first()


def get_enrollment_for_employee_and_lesson(
    db: Session,
    employee_id: int,
    lesson_id: int
) -> Enrollment | None:
    lesson = (
        db.query(Lesson)
        .options(joinedload(Lesson.module))
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if not lesson:
        return None

    course_id = lesson.module.course_id

    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.employee_id == employee_id,
            Enrollment.course_id == course_id
        )
        .first()
    )
    return enrollment


def count_total_lessons_in_course(course: Course) -> int:
    total = 0
    for module in course.modules:
        total += len(module.lessons)
    return total


def build_enrollment_progress_response(
    db: Session,
    enrollment: Enrollment
) -> EnrollmentProgressItem:
    enrollment = (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.course)
            .joinedload(Course.modules)
            .joinedload(Module.lessons),
            joinedload(Enrollment.lesson_progress_items)
        )
        .filter(Enrollment.id == enrollment.id)
        .first()
    )

    total_lessons = count_total_lessons_in_course(enrollment.course)
    completed_lessons = sum(
        1 for item in enrollment.lesson_progress_items if item.status == "completed"
    )

    progress_percent = 0
    if total_lessons > 0:
        progress_percent = int((completed_lessons / total_lessons) * 100)

    lesson_progress_sorted = sorted(
        enrollment.lesson_progress_items,
        key=lambda x: x.lesson_id
    )

    return EnrollmentProgressItem(
        enrollment_id=enrollment.id,
        course_id=enrollment.course.id,
        course_title=enrollment.course.title,
        total_lessons=total_lessons,
        completed_lessons=completed_lessons,
        progress_percent=progress_percent,
        lesson_progress=lesson_progress_sorted
    )


@router.post("/progress/start/{lesson_id}", response_model=LessonProgressRead)
def start_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can start lessons")

    my_profile = db.query(EmployeeProfile).filter(
        EmployeeProfile.user_id == current_user.id
    ).first()

    if not my_profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    lesson = (
        db.query(Lesson)
        .options(joinedload(Lesson.module))
        .filter(Lesson.id == lesson_id)
        .first()
    )
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.employee_id == my_profile.id,
            Enrollment.course_id == lesson.module.course_id
        )
        .first()
    )

    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found for this lesson")

    progress = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.enrollment_id == enrollment.id,
            LessonProgress.lesson_id == lesson_id
        )
        .first()
    )

    if progress:
        if progress.status == "not_started":
            progress.status = "in_progress"
        if progress.progress_percent == 0:
            progress.progress_percent = 1
        if progress.started_at is None:
            progress.started_at = datetime.utcnow()
        progress.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(progress)
        return progress

    progress = LessonProgress(
        enrollment_id=enrollment.id,
        lesson_id=lesson_id,
        status="in_progress",
        progress_percent=1,
        started_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(progress)
    db.commit()
    db.refresh(progress)

    return progress


@router.patch("/progress/{lesson_id}", response_model=LessonProgressRead)
def update_lesson_progress(
    lesson_id: int,
    payload: LessonProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can update progress")

    my_profile = get_my_employee_profile(db, current_user)
    if not my_profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    progress = (
        db.query(LessonProgress)
        .join(Enrollment, LessonProgress.enrollment_id == Enrollment.id)
        .filter(
            LessonProgress.lesson_id == lesson_id,
            Enrollment.employee_id == my_profile.id
        )
        .first()
    )

    if not progress:
        raise HTTPException(status_code=404, detail="Lesson progress not found. Start lesson first.")

    was_completed = progress.status == "completed"

    if payload.progress_percent is not None:
        if payload.progress_percent < 0 or payload.progress_percent > 100:
            raise HTTPException(status_code=400, detail="progress_percent must be between 0 and 100")
        progress.progress_percent = payload.progress_percent

    if payload.status is not None:
        if payload.status not in ["not_started", "in_progress", "completed"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        progress.status = payload.status

    if progress.status == "completed":
        progress.progress_percent = 100
        if progress.completed_at is None:
            progress.completed_at = datetime.utcnow()
    elif progress.status == "in_progress":
        if progress.started_at is None:
            progress.started_at = datetime.utcnow()
        if progress.progress_percent == 0:
            progress.progress_percent = 1

    progress.updated_at = datetime.utcnow()

    if (not was_completed) and progress.status == "completed":
        lesson = (
            db.query(Lesson)
            .options(joinedload(Lesson.module))
            .filter(Lesson.id == lesson_id)
            .first()
        )
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

        award_lesson_completion_xp(
            db=db,
            employee_id=my_profile.id,
            enrollment_id=progress.enrollment_id,
            module_id=lesson.module_id,
        )

    db.commit()
    db.refresh(progress)

    return progress


@router.post("/progress/complete/{lesson_id}", response_model=LessonProgressRead)
def complete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can complete lessons")

    my_profile = get_my_employee_profile(db, current_user)
    if not my_profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    progress = (
        db.query(LessonProgress)
        .join(Enrollment, LessonProgress.enrollment_id == Enrollment.id)
        .filter(
            LessonProgress.lesson_id == lesson_id,
            Enrollment.employee_id == my_profile.id
        )
        .first()
    )

    if not progress:
        enrollment = get_enrollment_for_employee_and_lesson(db, my_profile.id, lesson_id)
        if not enrollment:
            raise HTTPException(status_code=404, detail="Enrollment for this lesson not found")

        progress = LessonProgress(
            enrollment_id=enrollment.id,
            lesson_id=lesson_id,
            status="completed",
            progress_percent=100,
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(progress)
        lesson = (
            db.query(Lesson)
            .options(joinedload(Lesson.module))
            .filter(Lesson.id == lesson_id)
            .first()
        )
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

        award_lesson_completion_xp(
            db=db,
            employee_id=my_profile.id,
            enrollment_id=enrollment.id,
            module_id=lesson.module_id,
        )
        db.commit()
        db.refresh(progress)
        return progress

    was_completed = progress.status == "completed"

    progress.status = "completed"
    progress.progress_percent = 100
    if progress.started_at is None:
        progress.started_at = datetime.utcnow()
    if progress.completed_at is None:
        progress.completed_at = datetime.utcnow()
    progress.updated_at = datetime.utcnow()

    if not was_completed:
        lesson = (
            db.query(Lesson)
            .options(joinedload(Lesson.module))
            .filter(Lesson.id == lesson_id)
            .first()
        )
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

        award_lesson_completion_xp(
            db=db,
            employee_id=my_profile.id,
            enrollment_id=progress.enrollment_id,
            module_id=lesson.module_id,
        )

    db.commit()
    db.refresh(progress)

    return progress


@router.get("/my-progress", response_model=MyProgressResponse)
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view my-progress")

    my_profile = get_my_employee_profile(db, current_user)
    if not my_profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    enrollments = (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.course)
            .joinedload(Course.modules)
            .joinedload(Module.lessons),
            joinedload(Enrollment.lesson_progress_items)
        )
        .filter(Enrollment.employee_id == my_profile.id)
        .all()
    )

    items = [build_enrollment_progress_response(db, enrollment) for enrollment in enrollments]
    return MyProgressResponse(items=items)


@router.get("/enrollments/{enrollment_id}/progress", response_model=EnrollmentProgressItem)
def get_enrollment_progress(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollment = (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.employee),
            joinedload(Enrollment.course)
            .joinedload(Course.modules)
            .joinedload(Module.lessons),
            joinedload(Enrollment.lesson_progress_items)
        )
        .filter(Enrollment.id == enrollment_id)
        .first()
    )

    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    employee = enrollment.employee
    employee_user = db.query(User).filter(User.id == employee.user_id).first()

    if current_user.role == "employee":
        my_profile = get_my_employee_profile(db, current_user)
        if not my_profile or enrollment.employee_id != my_profile.id:
            raise HTTPException(status_code=403, detail="Access denied")

    elif current_user.role == "admin":
        if employee_user.organization_id != current_user.organization_id:
            raise HTTPException(status_code=403, detail="Access denied")
    else:
        raise HTTPException(status_code=403, detail="Access denied")

    return build_enrollment_progress_response(db, enrollment)