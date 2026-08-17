"""Repository model."""

from __future__ import annotations

from enum import StrEnum

from sqlalchemy import JSON, Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from repository_brain.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class RepositoryStatus(StrEnum):
    """Lifecycle states a repository moves through while under management."""

    REGISTERED = "registered"
    SCANNING = "scanning"
    SCANNED = "scanned"
    FAILED = "failed"


class Repository(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A software repository registered with Repository Brain."""

    __tablename__ = "repositories"

    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    path: Mapped[str] = mapped_column(String(1024), unique=True, index=True)
    root_path: Mapped[str | None] = mapped_column(String(1024))
    url: Mapped[str | None] = mapped_column(String(1024))
    description: Mapped[str | None] = mapped_column(Text)
    default_branch: Mapped[str | None] = mapped_column(String(255))
    vcs: Mapped[str | None] = mapped_column(String(32))
    status: Mapped[str] = mapped_column(
        String(32), default=RepositoryStatus.REGISTERED.value, index=True
    )
    is_watched: Mapped[bool] = mapped_column(Boolean, default=False)
    language_set: Mapped[list] = mapped_column(JSON, default=list)
    framework_set: Mapped[list] = mapped_column(JSON, default=list)
    last_scanned_at: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))
    extra: Mapped[dict] = mapped_column(JSON, default=dict)

    files = relationship(
        "FileEntry",
        back_populates="repository",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    symbols = relationship(
        "Symbol",
        back_populates="repository",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    dependencies = relationship(
        "Dependency",
        back_populates="repository",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    modules = relationship(
        "Module",
        back_populates="repository",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    architecture = relationship(
        "Architecture",
        back_populates="repository",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
    )
    memory = relationship(
        "RepositoryMemory",
        back_populates="repository",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Repository {self.name!r} ({self.status})>"
