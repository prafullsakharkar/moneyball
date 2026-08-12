"""File model — one row per indexed file within a repository."""

from __future__ import annotations

import uuid

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from repository_brain.models.base import Base, UUIDPrimaryKeyMixin, utcnow


class FileEntry(UUIDPrimaryKeyMixin, Base):
    """An indexed file belonging to a repository."""

    __tablename__ = "files"
    __table_args__ = (Index("uq_files_repo_path", "repository_id", "path", unique=True),)

    repository_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("repositories.id", ondelete="CASCADE"), index=True
    )
    path: Mapped[str] = mapped_column(String(1024))
    language: Mapped[str | None] = mapped_column(String(64), index=True)
    size: Mapped[int] = mapped_column(Integer, default=0)
    sha256: Mapped[str] = mapped_column(String(64), index=True)
    mtime: Mapped[float] = mapped_column(Float, default=0.0)
    is_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    is_binary: Mapped[bool] = mapped_column(Boolean, default=False)
    encoding: Mapped[str | None] = mapped_column(String(32))
    line_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(16), default="active")
    extra: Mapped[dict] = mapped_column(JSON, default=dict)
    indexed_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=utcnow)

    repository = relationship("Repository", back_populates="files")
    symbols = relationship(
        "Symbol",
        back_populates="file",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    dependencies = relationship(
        "Dependency",
        foreign_keys="Dependency.source_file_id",
        back_populates="source_file",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<FileEntry {self.path!r} ({self.language})>"
