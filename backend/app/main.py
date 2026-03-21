# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.database import engine, Base
# from app.routes import user, organization, auth, employee_profile, dashboard
# from app.models import organization as organization_model
# from app.models import user as user_model
# from app.models import employee_profile as employee_profile_model

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Base.metadata.create_all(bind=engine)

# app.include_router(user.router)
# app.include_router(organization.router)
# app.include_router(auth.router)
# app.include_router(employee_profile.router)
# app.include_router(dashboard.router)


# @app.get("/")
# def root():
#     return {"message": "AdaptEd backend running"}


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes import (
    user,
    organization,
    auth,
    employee_profile,
    dashboard,
    course,
    enrollment,
    lesson_progress,
    activity
)

from app.models import organization as organization_model
from app.models import user as user_model
from app.models import employee_profile as employee_profile_model
from app.models import course as course_model
from app.models import enrollment as enrollment_model
from app.models import lesson_progress as lesson_progress_model
from app.models import activity as activity_model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(organization.router)
app.include_router(auth.router)
app.include_router(employee_profile.router)
app.include_router(dashboard.router)
app.include_router(course.router)
app.include_router(enrollment.router)
app.include_router(lesson_progress.router)
app.include_router(activity.router)


@app.get("/")
def root():
    return {"message": "AdaptEd backend running"}