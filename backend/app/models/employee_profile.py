from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class EmployeeProfile(Base):
    __tablename__ = "employee_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    full_name = Column(String, nullable=False)
    position = Column(String, nullable=True)
    department = Column(String, nullable=True)
    cefr_level = Column(String, nullable=True)

    enrollments = relationship(
        "Enrollment",
        back_populates="employee",
        cascade="all, delete-orphan"
    )

    activity_attempts = relationship(
        "ActivityAttempt",
        back_populates="employee",
        cascade="all, delete-orphan"
    )

    points = relationship(
        "EmployeePoints",
        back_populates="employee",
        cascade="all, delete-orphan",
        uselist=False
    )

    employee_badges = relationship(
        "EmployeeBadge",
        back_populates="employee",
        cascade="all, delete-orphan"
    )