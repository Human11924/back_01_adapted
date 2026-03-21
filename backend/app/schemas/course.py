from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class LessonCreate(BaseModel):
    title: str
    lesson_type: str
    order_index: int


class LessonRead(BaseModel):
    id: int
    title: str
    lesson_type: str
    order_index: int

    class Config:
        from_attributes = True


class ModuleCreate(BaseModel):
    title: str
    order_index: int
    lessons: List[LessonCreate] = []


class ModuleRead(BaseModel):
    id: int
    title: str
    order_index: int
    lessons: List[LessonRead] = []

    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    level: Optional[str] = None
    is_active: bool = True
    modules: List[ModuleCreate] = []


class CourseRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    level: Optional[str] = None
    is_active: bool
    created_at: datetime
    modules: List[ModuleRead] = []

    class Config:
        from_attributes = True