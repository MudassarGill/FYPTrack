from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routes.router import api_router

app = FastAPI(
	title=settings.app_name,
	version=settings.app_version,
	description="Backend API for the FYPTrack project management system.",
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=settings.cors_origins,
	allow_credentials=True,
	allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allow_headers=["Authorization", "Content-Type"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/", tags=["Root"], summary="API root")
def root() -> dict[str, str]:
	return {"message": "FYPTrack API is running", "docs": "/docs"}