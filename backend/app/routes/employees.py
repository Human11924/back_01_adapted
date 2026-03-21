from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.employee import EmployeeListItemRead
from app.services.dependencies import require_admin_user
from app.services.employees import list_employees_for_org, get_employee_for_org

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("/", response_model=list[EmployeeListItemRead])
def list_employees(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin_user),
):
    return list_employees_for_org(db, current_admin.organization_id)


@router.get("/{employee_id}", response_model=EmployeeListItemRead)
def get_employee_detail(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin_user),
):
    employee = get_employee_for_org(db, current_admin.organization_id, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee
