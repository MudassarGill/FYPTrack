import os
from dataclasses import dataclass
@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("FYPTRACK_APP_NAME", "FYPTrack API")
    app_version: str = os.getenv("FYPTRACK_APP_VERSION", "0.1.0")
    api_v1_prefix: str = "/api/v1"
    frontend_origins: tuple[str, ...] = tuple(
        origin.strip()
        for origin in os.getenv(
            "FYPTRACK_FRONTEND_ORIGINS", "http://localhost:5173"
        ).split(",")
        if origin.strip()
    )
settings = Settings()
