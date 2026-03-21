from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.user import User
from app.models.course import Course, Module, Lesson
from app.schemas.course import CourseCreate, CourseRead
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.post("/", response_model=CourseRead)
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    course = Course(
        title=course_data.title,
        description=course_data.description,
        level=course_data.level,
        is_active=course_data.is_active
    )

    for module_data in course_data.modules:
        module = Module(
            title=module_data.title,
            order_index=module_data.order_index
        )

        for lesson_data in module_data.lessons:
            lesson = Lesson(
                title=lesson_data.title,
                lesson_type=lesson_data.lesson_type,
                order_index=lesson_data.order_index
            )
            module.lessons.append(lesson)

        course.modules.append(module)

    db.add(course)
    db.commit()
    db.refresh(course)

    course = (
        db.query(Course)
        .options(
            joinedload(Course.modules).joinedload(Module.lessons)
        )
        .filter(Course.id == course.id)
        .first()
    )

    return course


@router.get("/", response_model=list[CourseRead])
def get_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    courses = (
        db.query(Course)
        .options(
            joinedload(Course.modules).joinedload(Module.lessons)
        )
        .order_by(Course.id.desc())
        .all()
    )
    return courses


@router.get("/{course_id}", response_model=CourseRead)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = (
        db.query(Course)
        .options(
            joinedload(Course.modules).joinedload(Module.lessons)
        )
        .filter(Course.id == course_id)
        .first()
    )

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    return course