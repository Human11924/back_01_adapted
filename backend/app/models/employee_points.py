from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class EmployeePoints(Base):
    __tablename__ = "employee_points"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employee_profiles.id"), unique=True, nullable=False)

    total_xp = Column(Integer, default=0, nullable=False)
    current_streak = Column(Integer, default=0, nullable=False)
    weekly_xp = Column(Integer, default=0, nullable=False)
    level = Column(String, default="Bronze", nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = relationship("EmployeeProfile", back_populates="points")
