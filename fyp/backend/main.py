from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from database.connection import Base, engine
from models.user import User  # Ensure models are registered with Base metadata
from routes.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create SQLite database tables on startup
    Base.metadata.create_all(bind=engine)
    print("Database tables verified/created successfully.")
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for CareerPilot AI / FYPTrack Authentication System.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all during development for seamless integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Support both /api/v1 and /api routes for complete flexibility
app.include_router(api_router, prefix=settings.api_v1_prefix)
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Root"], summary="API root")
def root() -> dict[str, str]:
    return {
        "message": "FYPTrack Auth API is running smoothly",
        "docs": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
