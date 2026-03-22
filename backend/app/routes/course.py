from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.user import User
from app.models.course import Course, Module, Lesson
from app.models.activity import Activity
from app.models.employee_profile import EmployeeProfile
from app.models.enrollment import Enrollment
from app.schemas.course import CourseCreate, CourseRead
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/courses", tags=["Courses"])


def _ensure_fb_demo_course_content(db: Session) -> tuple[Course, Module, Lesson, int]:
    course_title = "English for F&B Staff"
    module_title = "Taking Orders"
    lesson_title = "Basic Restaurant Vocabulary"

    course = db.query(Course).filter(Course.title == course_title).first()
    if not course:
        course = Course(
            title=course_title,
            description="Practical English for front-of-house restaurant staff.",
            level="Beginner",
            is_active=True,
        )
        db.add(course)
        db.flush()

    module = (
        db.query(Module)
        .filter(Module.course_id == course.id, Module.title == module_title)
        .first()
    )
    if not module:
        module = Module(course_id=course.id, title=module_title, order_index=1)
        db.add(module)
        db.flush()

    lesson = (
        db.query(Lesson)
        .filter(Lesson.module_id == module.id, Lesson.title == lesson_title)
        .first()
    )
    if not lesson:
        lesson = Lesson(
            module_id=module.id,
            title=lesson_title,
            lesson_type="vocabulary_practice",
            order_index=1,
        )
        db.add(lesson)
        db.flush()

    vocabulary_items = [
        {"prompt_ru": "меню", "answer_en": "menu", "order_index": 1},
        {"prompt_ru": "счёт", "answer_en": "bill", "order_index": 2},
        {"prompt_ru": "заказ", "answer_en": "order", "order_index": 3},
        {"prompt_ru": "столик", "answer_en": "table", "order_index": 4},
        {"prompt_ru": "вода", "answer_en": "water", "order_index": 5},
        {"prompt_ru": "кофе", "answer_en": "coffee", "order_index": 6},
        {"prompt_ru": "чай", "answer_en": "tea", "order_index": 7},
        {"prompt_ru": "гость", "answer_en": "guest", "order_index": 8},
        {"prompt_ru": "официант", "answer_en": "waiter", "order_index": 9},
        {"prompt_ru": "блюдо", "answer_en": "dish", "order_index": 10},
    ]

    activity_specs = [
        {
            "type": "task",
            "title": "Vocabulary Intro: Restaurant Basics",
            "description": "Review key words before practice.",
            "max_score": 0,
            "order_index": 1,
            "content_json": {
                "kind": "vocabulary_intro",
                "vocabulary_items": vocabulary_items,
                "key_phrases": [
                    "Are you ready to order?",
                    "Would you like water, tea, or coffee?",
                    "Here is your menu.",
                    "Would you like the bill?",
                ],
            },
        },
        {
            "type": "tir_game",
            "title": "TIR Game: Hit the Right Translation",
            "description": "Type the English translation before the target escapes.",
            "max_score": 300,
            "order_index": 2,
            "content_json": {
                "vocabulary_items": vocabulary_items,
            },
        },
        {
            "type": "quiz",
            "title": "Service Dialogue Check",
            "description": "Choose the best phrase for each guest scenario.",
            "max_score": 50,
            "order_index": 3,
            "content_json": {
                "kind": "mcq_quiz",
                "questions": [
                    {
                        "order_index": 1,
                        "question": "A guest asks for the счёт. What should you bring?",
                        "options": ["A menu", "The bill", "Water", "A dish"],
                        "correct_answer": "The bill",
                    },
                    {
                        "order_index": 2,
                        "question": "You want to ask if the guest is ready. Choose the best phrase.",
                        "options": [
                            "Are you ready to order?",
                            "Do you menu now?",
                            "Your bill is table.",
                            "Guest tea waiter.",
                        ],
                        "correct_answer": "Are you ready to order?",
                    },
                    {
                        "order_index": 3,
                        "question": "A guest says they want чай. Which drink is it?",
                        "options": ["Coffee", "Tea", "Water", "Juice"],
                        "correct_answer": "Tea",
                    },
                    {
                        "order_index": 4,
                        "question": "You offer drinks before taking the order. Best option?",
                        "options": [
                            "Would you like water, tea, or coffee?",
                            "Give me your menu now.",
                            "Your dish is guest.",
                            "Waiter table bill.",
                        ],
                        "correct_answer": "Would you like water, tea, or coffee?",
                    },
                    {
                        "order_index": 5,
                        "question": "What is the best English translation of заказ?",
                        "options": ["Order", "Guest", "Dish", "Waiter"],
                        "correct_answer": "Order",
                    },
                ],
            },
        },
    ]

    activities_created = 0
    for spec in activity_specs:
        existing = (
            db.query(Activity)
            .filter(
                Activity.lesson_id == lesson.id,
                Activity.type == spec["type"],
                Activity.title == spec["title"],
            )
            .first()
        )

        if not existing:
            db.add(
                Activity(
                    lesson_id=lesson.id,
                    type=spec["type"],
                    title=spec["title"],
                    description=spec["description"],
                    content_json=spec["content_json"],
                    max_score=spec["max_score"],
                    order_index=spec["order_index"],
                )
            )
            activities_created += 1

    return course, module, lesson, activities_created


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


@router.post("/seed/fb-demo")
def seed_fb_demo_lesson(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    course, module, lesson, activities_created = _ensure_fb_demo_course_content(db)

    employees_in_org = (
        db.query(EmployeeProfile)
        .join(User, EmployeeProfile.user_id == User.id)
        .filter(User.organization_id == current_user.organization_id)
        .all()
    )

    enrollments_created = 0
    for employee in employees_in_org:
        existing_enrollment = (
            db.query(Enrollment)
            .filter(
                Enrollment.employee_id == employee.id,
                Enrollment.course_id == course.id,
            )
            .first()
        )

        if not existing_enrollment:
            db.add(
                Enrollment(
                    employee_id=employee.id,
                    course_id=course.id,
                    status="active",
                )
            )
            enrollments_created += 1

    db.commit()

    return {
        "course_id": course.id,
        "module_id": module.id,
        "lesson_id": lesson.id,
        "activities_created": activities_created,
        "enrollments_created": enrollments_created,
        "message": "F&B demo lesson seeded",
    }


@router.post("/demo/bootstrap")
def bootstrap_demo_for_current_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course, module, lesson, activities_created = _ensure_fb_demo_course_content(db)

    enrollments_created = 0

    if current_user.role == "employee":
        profile = db.query(EmployeeProfile).filter(EmployeeProfile.user_id == current_user.id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="Employee profile not found")

        existing_enrollment = (
            db.query(Enrollment)
            .filter(
                Enrollment.employee_id == profile.id,
                Enrollment.course_id == course.id,
            )
            .first()
        )
        if not existing_enrollment:
            db.add(
                Enrollment(
                    employee_id=profile.id,
                    course_id=course.id,
                    status="active",
                )
            )
            enrollments_created += 1

    elif current_user.role == "admin":
        employees_in_org = (
            db.query(EmployeeProfile)
            .join(User, EmployeeProfile.user_id == User.id)
            .filter(User.organization_id == current_user.organization_id)
            .all()
        )

        for employee in employees_in_org:
            existing_enrollment = (
                db.query(Enrollment)
                .filter(
                    Enrollment.employee_id == employee.id,
                    Enrollment.course_id == course.id,
                )
                .first()
            )
            if not existing_enrollment:
                db.add(
                    Enrollment(
                        employee_id=employee.id,
                        course_id=course.id,
                        status="active",
                    )
                )
                enrollments_created += 1

    else:
        raise HTTPException(status_code=403, detail="Access denied")

    db.commit()

    return {
        "course_id": course.id,
        "module_id": module.id,
        "lesson_id": lesson.id,
        "activities_created": activities_created,
        "enrollments_created": enrollments_created,
        "message": "Demo bootstrap complete",
    }