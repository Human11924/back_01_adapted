from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employee_profiles.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="active")  # active / completed

    employee = relationship("EmployeeProfile", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

    lesson_progress_items = relationship(
        "LessonProgress",
        back_populates="enrollment",
        cascade="all, delete-orphan"
    )