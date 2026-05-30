from fastapi import FastAPI
from fastapi import Depends

from app.dependencies.auth import get_current_user

# Routers
from app.api.auth import router as auth_router
from app.api.task_filters import router as task_filter_router
from app.api.tasks import router as task_router
from app.api.users import router as users_router
from app.api.dashboard import router as dashboard_router
from app.api.activity import router as activity_router

from fastapi.middleware.cors import CORSMiddleware

# Scheduler
from app.scheduler.reminder_scheduler import (
    start_scheduler
)




app = FastAPI(
    title="Task Manager API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# STARTUP EVENTS
# ==========================

@app.on_event("startup")
async def startup_event():

    print("Starting Reminder Scheduler...")

    start_scheduler()

    print("Reminder Scheduler Started")


# ==========================
# ROUTER REGISTRATION
# ==========================

app.include_router(auth_router)

app.include_router(task_filter_router)

app.include_router(task_router)

app.include_router(users_router)

app.include_router(dashboard_router)

app.include_router(activity_router)


# ==========================
# AUTH TEST ROUTE
# ==========================

@app.get("/me")
async def me(
    user=Depends(get_current_user)
):
    return {
        "user_id": user
    }


# ==========================
# ROOT ROUTE
# ==========================

@app.get("/")
async def root():

    return {
        "status": "running",
        "app": "Task Manager API"
    }