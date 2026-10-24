from fastapi import APIRouter

from routes.auth import router as auth_router
from routes.health import router as health_router
from routes.projects import router as projects_router
from routes.feedback import router as feedback_router
from routes.documents import router as documents_router
from routes.evaluations import router as evaluations_router
from routes.notifications import router as notifications_router
from routes.supervisors import router as supervisors_router
from routes.milestones import router as milestones_router
from routes.students import router as students_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(health_router)
api_router.include_router(projects_router)
api_router.include_router(feedback_router)
api_router.include_router(documents_router)
api_router.include_router(evaluations_router)
api_router.include_router(notifications_router)
api_router.include_router(supervisors_router)
api_router.include_router(milestones_router)
api_router.include_router(students_router)

