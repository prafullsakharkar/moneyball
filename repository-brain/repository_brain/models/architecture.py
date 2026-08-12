"""Architecture model — high level repository architecture snapshot."""

from __future__ import annotations

import uuid

from sqlalchemy import JSON, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from repository_brain.models.base import Base, utcnow


class Architecture(Base):
    """Structured representation of a repository's architecture."""

    __tablename__ = "architectures"

    repository_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("repositories.id", ondelete="CASCADE"), primary_key=True
    )
    content: Mapped[dict] = mapped_column(JSON, default=dict)
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    repository = relationship("Repository", back_populates="architecture")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Architecture repo={self.repository_id}>"
