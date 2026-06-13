from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.dependencies.auth import get_current_user

# Routers
from app.api.auth import router as auth_router
from app.api.task_filters import router as task_filter_router
from app.api.tasks import router as task_router
from app.api.users import router as users_router
from app.api.dashboard import router as dashboard_router
from app.api.activity import router as activity_router
from app.api.upload import router as upload_router
from app.api.notifications import router as notification_router
from app.api.discussions import router as discussion_router

from app.scheduler.reminder_scheduler import start_scheduler

app = FastAPI(
    title="Task Manager API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://task-manager-entire.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting Reminder Scheduler...")
    start_scheduler()
    print("Reminder Scheduler Started")

# API ROUTES
app.include_router(auth_router)
app.include_router(task_filter_router)
app.include_router(task_router)
app.include_router(users_router)
app.include_router(dashboard_router)
app.include_router(activity_router)
app.include_router(upload_router)
app.include_router(notification_router)
app.include_router(discussion_router)

@app.get("/me")
async def me(user=Depends(get_current_user)):
    return {"user_id": user}

# MUST BE LAST
app.mount(
    "/",
    StaticFiles(directory="app/static/dist", html=True),
    name="frontend",
)