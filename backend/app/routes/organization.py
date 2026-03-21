from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.organization import Organization
from app.models.user import User
from app.schemas.organization import OrganizationCreate, OrganizationResponse
from app.services.security import hash_password

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("/", response_model=OrganizationResponse)
def create_organization(
    org: OrganizationCreate,
    db: Session = Depends(get_db)
):
    existing_org = db.query(Organization).filter(Organization.email == org.email).first()
    if existing_org:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_user = db.query(User).filter(User.email == org.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    password_hash = hash_password(org.password)

    db_org = Organization(
        name=org.name,
        industry=org.industry,
        email=org.email,
        password_hash=password_hash,
    )

    db.add(db_org)
    db.flush()

    admin_user = User(
        email=org.email,
        password_hash=password_hash,
        role="admin",
        organization_id=db_org.id,
    )

    db.add(admin_user)
    db.commit()
    db.refresh(db_org)

    return db_org