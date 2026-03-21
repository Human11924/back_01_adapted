from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ⚠️ ЗАМЕНИ пароль
DATABASE_URL = "postgresql://postgres:postgres123@localhost:5432/adapted_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# Dependency для FastAPI (потом пригодится)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()