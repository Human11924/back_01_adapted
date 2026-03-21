from pydantic import BaseModel


class EmployeeProfileCreate(BaseModel):
    full_name: str
    position: str
    department: str
    cefr_level: str


class EmployeeProfileResponse(BaseModel):
    id: int
    full_name: str
    position: str
    department: str
    cefr_level: str

    class Config:
        from_attributes = True