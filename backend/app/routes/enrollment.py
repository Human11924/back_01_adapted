from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.user import User
from app.models.employee_profile import EmployeeProfile
from app.models.course import Course, Module
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate, EnrollmentRead
from app.services.dependencies import get_current_user

router = APIRouter(tags=["Enrollments"])


@router.post("/enrollments", response_model=EnrollmentRead)
def create_enrollment(
    enrollment_data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    employee = (
        db.query(EmployeeProfile)
        .join(User, EmployeeProfile.user_id == User.id)
        .filter(EmployeeProfile.id == enrollment_data.employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee_user = db.query(User).filter(User.id == employee.user_id).first()
    if employee_user.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")

    course = db.query(Course).filter(Course.id == enrollment_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = (
        db.query(Enrollment)
        .filter(
            Enrollment.employee_id == enrollment_data.employee_id,
            Enrollment.course_id == enrollment_data.course_id
        )
        .first()
    )

    if existing:
        raise HTTPException(status_code=400, detail="Course already assigned")

    enrollment = Enrollment(
        employee_id=enrollment_data.employee_id,
        course_id=enrollment_data.course_id,
        status="active"
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    enrollment = (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.course)
            .joinedload(Course.modules)
            .joinedload(Module.lessons)
        )
        .filter(Enrollment.id == enrollment.id)
        .first()
    )

    return enrollment


@router.get("/employees/{employee_id}/courses", response_model=list[EnrollmentRead])
def get_employee_courses(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = (
        db.query(EmployeeProfile)
        .join(User, EmployeeProfile.user_id == User.id)
        .filter(EmployeeProfile.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee_user = db.query(User).filter(User.id == employee.user_id).first()

    if current_user.role == "employee":
        my_profile = db.query(EmployeeProfile).filter(
            EmployeeProfile.user_id == current_user.id
        ).first()

        if not my_profile or my_profile.id != employee_id:
            raise HTTPException(status_code=403, detail="Access denied")

    elif current_user.role == "admin":
        if employee_user.organization_id != current_user.organization_id:
            raise HTTPException(status_code=403, detail="Access denied")
    else:
        raise HTTPException(status_code=403, detail="Access denied")

    enrollments = (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.course)
            .joinedload(Course.modules)
            .joinedload(Module.lessons)
        )
        .filter(Enrollment.employee_id == employee_id)
        .order_by(Enrollment.id.desc())
        .all()
    )

    return enrollments