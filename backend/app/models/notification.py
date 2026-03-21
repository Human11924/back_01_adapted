from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True, index=True)
    employee_id = Column(Integer, ForeignKey("employee_profiles.id"), nullable=True, index=True)

    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)

    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("EmployeeProfile")
