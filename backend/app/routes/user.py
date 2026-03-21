from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.organization import Organization
from app.schemas.user import UserCreate, UserResponse
from app.services.security import hash_password
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    organization = db.query(Organization).filter(
        Organization.invite_code == user.invite_code
    ).first()

    if not organization:
        raise HTTPException(status_code=400, detail="Invalid invite code")

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    role = "admin" if user.email == organization.email else "employee"

    db_user = User(
        email=user.email,
        password_hash=hash_password(user.password),
        organization_id=organization.id,
        role=role,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user