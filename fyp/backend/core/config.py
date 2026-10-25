import os
from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        extra="ignore",
    )
    app_name: str = "FYPTrack API"
    app_version: str = "0.1.0"
    api_v1_prefix: str = "/api/v1"
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:3000,http://127.0.0.1:3000"
    database_url: str = "sqlite:///./fyptrack.db"
    jwt_secret: SecretStr = SecretStr("careerpilot-fyptrack-super-secret-key-2026-auth-phase")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    huggingface_api_key: str = ""

    @field_validator("database_url", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql://", 1)
        return v

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.frontend_origins.split(",")
            if origin.strip()
        ]


settings = Settings()
