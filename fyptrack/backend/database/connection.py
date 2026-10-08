from collections.abc import Generator

from fastapi import HTTPException, status
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from core.config import settings


class Base(DeclarativeBase):
    pass


engine = (
    create_engine(settings.database_url, pool_pre_ping=True)
    if settings.database_url
    else None
)
SessionLocal = (
    sessionmaker(bind=engine, autoflush=False, autocommit=False)
    if engine is not None
    else None
)


def get_db() -> Generator[Session, None, None]:
    if SessionLocal is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is not configured. Set FYPTRACK_DATABASE_URL.",
        )

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
