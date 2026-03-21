from pydantic import BaseModel, EmailStr


class OrganizationCreate(BaseModel):
    name: str
    industry: str
    email: EmailStr
    password: str


class OrganizationResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    invite_code: str

    class Config:
        from_attributes = True