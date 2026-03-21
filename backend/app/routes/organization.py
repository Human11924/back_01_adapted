from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationResponse
from app.services.security import hash_password

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("/", response_model=OrganizationResponse)
def create_organization(
    org: OrganizationCreate,
    db: Session = Depends(get_db)
):
    db_org = Organization(
        name=org.name,
        industry=org.industry,
        email=org.email,
        password_hash=hash_password(org.password)
    )

    db.add(db_org)
    db.commit()
    db.refresh(db_org)

    return db_org