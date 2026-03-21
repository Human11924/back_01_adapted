from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
import random
import string

from app.database import Base


def generate_invite_code():
    return ''.join(random.choices(string.digits, k=12))


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    industry = Column(String, nullable=True)

    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    invite_code = Column(String(12), unique=True, default=generate_invite_code)

    created_at = Column(DateTime, default=datetime.utcnow)