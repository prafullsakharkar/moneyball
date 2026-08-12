"""RepositoryMemory model — persistent memory of a repository."""

from __future__ import annotations

import uuid

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from repository_brain.models.base import Base, utcnow


class RepositoryMemory(Base):
    """Persistent knowledge about a repository.

    Never recreated automatically once built. Survives restarts and new sessions.
    """

    __tablename__ = "repository_memory"

    repository_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("repositories.id", ondelete="CASCADE"), primary_key=True
    )
    summary: Mapped[str] = mapped_column(Text, default="")
    architecture_summary: Mapped[str] = mapped_column(Text, default="")
    module_summaries: Mapped[dict] = mapped_column(JSON, default=dict)
    conventions: Mapped[dict] = mapped_column(JSON, default=dict)
    patterns: Mapped[dict] = mapped_column(JSON, default=dict)
    statistics: Mapped[dict] = mapped_column(JSON, default=dict)
    extra: Mapped[dict] = mapped_column(JSON, default=dict)
    version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    repository = relationship("Repository", back_populates="memory")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<RepositoryMemory repo={self.repository_id} v{self.version}>"
