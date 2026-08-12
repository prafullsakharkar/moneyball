"""Database engine and session management (SQLAlchemy 2.x)."""

from __future__ import annotations

from collections.abc import Generator
from contextlib import contextmanager

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from repository_brain.core.config import get_settings

_settings = get_settings()

_engine_kwargs: dict = {"pool_pre_ping": True}
if _settings.is_sqlite:
    _engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(_settings.database_url, **_engine_kwargs)

if _settings.is_sqlite:

    @event.listens_for(engine, "connect")
    def _enable_sqlite_fks(dbapi_connection, _connection_record) -> None:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a database session."""
    with SessionLocal() as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    """Context manager for using a session outside of FastAPI (workers/tests)."""
    with SessionLocal() as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise


def init_db() -> None:
    """Create tables if they do not exist (used for local dev / tests)."""
    from repository_brain import models  # noqa: F401  (register all models)
    from repository_brain.models.base import Base

    Base.metadata.create_all(bind=engine)
