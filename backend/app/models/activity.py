from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)

    type = Column(String, nullable=False)  # quiz / task
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    max_score = Column(Integer, default=100)
    order_index = Column(Integer, default=1)

    lesson = relationship("Lesson", back_populates="activities")
    attempts = relationship(
        "ActivityAttempt",
        back_populates="activity",
        cascade="all, delete-orphan",
        order_by="ActivityAttempt.attempt_number"
    )


class ActivityAttempt(Base):
    __tablename__ = "activity_attempts"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer, ForeignKey("employee_profiles.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)

    attempt_number = Column(Integer, nullable=False)
    score = Column(Integer, default=0)
    answers_json = Column(JSON, nullable=True)

    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("EmployeeProfile", back_populates="activity_attempts")
    activity = relationship("Activity", back_populates="attempts")