from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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

# ==========================
# CORS
# ==========================

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

# ==========================
# STARTUP
# ==========================

@app.on_event("startup")
async def startup_event():
    print("Starting Reminder Scheduler...")
    start_scheduler()
    print("Reminder Scheduler Started")

# ==========================
# API ROUTES
# ==========================

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

# ==========================
# STATIC FILES
# ==========================

app.mount(
    "/assets",
    StaticFiles(directory="app/static/dist/assets"),
    name="assets",
)

# favicon
@app.get("/favicon.svg")
async def favicon():
    return FileResponse("app/static/dist/favicon.svg")

# ==========================
# REACT SPA FALLBACK
# ==========================

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("app/static/dist/index.html")