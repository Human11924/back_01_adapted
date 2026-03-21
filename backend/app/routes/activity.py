from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.user import User
from app.models.employee_profile import EmployeeProfile
from app.models.course import Lesson
from app.models.enrollment import Enrollment
from app.models.activity import Activity, ActivityAttempt
from app.schemas.activity import (
    ActivityCreate,
    ActivityRead,
    ActivityAttemptCreate,
    ActivityAttemptRead,
)
from app.services.dependencies import get_current_user

router = APIRouter(tags=["Activities"])


def get_my_profile(db: Session, current_user: User) -> EmployeeProfile | None:
    return db.query(EmployeeProfile).filter(
        EmployeeProfile.user_id == current_user.id
    ).first()


def employee_has_access_to_lesson(
    db: Session,
    employee_id: int,
    lesson: Lesson
) -> bool:
    return (
        db.query(Enrollment)
        .filter(
            Enrollment.employee_id == employee_id,
            Enrollment.course_id == lesson.module.course_id
        )
        .first()
        is not None
    )


@router.post("/activities", response_model=ActivityRead)
def create_activity(
    payload: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    if payload.type not in ["quiz", "task"]:
        raise HTTPException(status_code=400, detail="Activity type must be quiz or task")

    lesson = db.query(Lesson).filter(Lesson.id == payload.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    activity = Activity(
        lesson_id=payload.lesson_id,
        type=payload.type,
        title=payload.title,
        description=payload.description,
        max_score=payload.max_score,
        order_index=payload.order_index,
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity


@router.get("/lessons/{lesson_id}/activities", response_model=list[ActivityRead])
def get_lesson_activities(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lesson = (
        db.query(Lesson)
        .options(joinedload(Lesson.module))
        .filter(Lesson.id == lesson_id)
        .first()
    )
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if current_user.role == "employee":
        my_profile = get_my_profile(db, current_user)
        if not my_profile:
            raise HTTPException(status_code=404, detail="Employee profile not found")

        if not employee_has_access_to_lesson(db, my_profile.id, lesson):
            raise HTTPException(status_code=403, detail="Access denied")

    activities = (
        db.query(Activity)
        .filter(Activity.lesson_id == lesson_id)
        .order_by(Activity.order_index.asc(), Activity.id.asc())
        .all()
    )

    return activities


@router.post("/activities/{activity_id}/attempt", response_model=ActivityAttemptRead)
def create_activity_attempt(
    activity_id: int,
    payload: ActivityAttemptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can submit attempts")

    my_profile = get_my_profile(db, current_user)
    if not my_profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    activity = (
        db.query(Activity)
        .options(joinedload(Activity.lesson).joinedload(Lesson.module))
        .filter(Activity.id == activity_id)
        .first()
    )
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    if not employee_has_access_to_lesson(db, my_profile.id, activity.lesson):
        raise HTTPException(status_code=403, detail="Access denied")

    last_attempt = (
        db.query(ActivityAttempt)
        .filter(
            ActivityAttempt.employee_id == my_profile.id,
            ActivityAttempt.activity_id == activity_id
        )
        .order_by(ActivityAttempt.attempt_number.desc())
        .first()
    )

    next_attempt_number = 1 if not last_attempt else last_attempt.attempt_number + 1

    score = payload.score if payload.score is not None else 0
    if score < 0:
        score = 0
    if score > activity.max_score:
        score = activity.max_score

    attempt = ActivityAttempt(
        employee_id=my_profile.id,
        activity_id=activity_id,
        attempt_number=next_attempt_number,
        score=score,
        answers_json=payload.answers_json,
        completed_at=datetime.utcnow(),
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return attempt


@router.get("/my-attempts", response_model=list[ActivityAttemptRead])
def get_my_attempts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view my attempts")

    my_profile = get_my_profile(db, current_user)
    if not my_profile:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    attempts = (
        db.query(ActivityAttempt)
        .filter(ActivityAttempt.employee_id == my_profile.id)
        .order_by(ActivityAttempt.created_at.desc(), ActivityAttempt.id.desc())
        .all()
    )

    return attempts


@router.get("/activities/{activity_id}/attempts", response_model=list[ActivityAttemptRead])
def get_activity_attempts(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activity = (
        db.query(Activity)
        .options(joinedload(Activity.lesson).joinedload(Lesson.module))
        .filter(Activity.id == activity_id)
        .first()
    )
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    if current_user.role == "admin":
        attempts = (
            db.query(ActivityAttempt)
            .filter(ActivityAttempt.activity_id == activity_id)
            .order_by(ActivityAttempt.created_at.desc(), ActivityAttempt.id.desc())
            .all()
        )
        return attempts

    if current_user.role == "employee":
        my_profile = get_my_profile(db, current_user)
        if not my_profile:
            raise HTTPException(status_code=404, detail="Employee profile not found")

        attempts = (
            db.query(ActivityAttempt)
            .filter(
                ActivityAttempt.activity_id == activity_id,
                ActivityAttempt.employee_id == my_profile.id
            )
            .order_by(ActivityAttempt.created_at.desc(), ActivityAttempt.id.desc())
            .all()
        )
        return attempts

    raise HTTPException(status_code=403, detail="Access denied")