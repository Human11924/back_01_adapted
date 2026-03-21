from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee_profile import EmployeeProfile
from app.schemas.employee_profile import EmployeeProfileCreate, EmployeeProfileResponse
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["Employee Profile"])


@router.post("/", response_model=EmployeeProfileResponse)
def create_profile(
    profile_data: EmployeeProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = db.query(EmployeeProfile).filter(
        EmployeeProfile.user_id == current_user.id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    profile = EmployeeProfile(
        user_id=current_user.id,
        full_name=profile_data.full_name,
        position=profile_data.position,
        department=profile_data.department,
        cefr_level=profile_data.cefr_level
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


@router.get("/me", response_model=EmployeeProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    profile = db.query(EmployeeProfile).filter(
        EmployeeProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile