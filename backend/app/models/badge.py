from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    employee_badges = relationship(
        "EmployeeBadge",
        back_populates="badge",
        cascade="all, delete-orphan",
    )


class EmployeeBadge(Base):
    __tablename__ = "employee_badges"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employee_profiles.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("EmployeeProfile", back_populates="employee_badges")
    badge = relationship("Badge", back_populates="employee_badges")

    __table_args__ = (
        UniqueConstraint("employee_id", "badge_id", name="uq_employee_badge"),
    )
