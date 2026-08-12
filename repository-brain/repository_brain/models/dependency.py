"""Dependency model — edges in the repository dependency graph."""

from __future__ import annotations

import uuid

from sqlalchemy import JSON, Boolean, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from repository_brain.models.base import Base, UUIDPrimaryKeyMixin


class Dependency(UUIDPrimaryKeyMixin, Base):
    """A directed relationship between files or symbols."""

    __tablename__ = "dependencies"
    __table_args__ = (
        Index(
            "uq_dependencies_src_name",
            "repository_id",
            "source_symbol_id",
            "name",
            "kind",
            unique=True,
        ),
        Index("ix_dependencies_repo_kind", "repository_id", "kind"),
        Index("ix_dependencies_target_file", "target_file_id"),
    )

    repository_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("repositories.id", ondelete="CASCADE"), index=True
    )
    source_file_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("files.id", ondelete="CASCADE")
    )
    target_file_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("files.id", ondelete="CASCADE")
    )
    source_symbol_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("symbols.id", ondelete="CASCADE")
    )
    target_symbol_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("symbols.id", ondelete="CASCADE")
    )

    kind: Mapped[str] = mapped_column(String(32))
    name: Mapped[str] = mapped_column(String(1024))
    target_name: Mapped[str | None] = mapped_column(String(1024))
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    is_external: Mapped[bool] = mapped_column(Boolean, default=False)
    line: Mapped[int | None] = mapped_column(Integer)
    extra: Mapped[dict] = mapped_column(JSON, default=dict)

    repository = relationship("Repository", back_populates="dependencies")
    source_file = relationship(
        "FileEntry",
        foreign_keys=[source_file_id],
        back_populates="dependencies",
    )
    target_file = relationship("FileEntry", foreign_keys=[target_file_id])
    source_symbol = relationship(
        "Symbol",
        foreign_keys=[source_symbol_id],
        back_populates="outgoing_dependencies",
    )
    target_symbol = relationship(
        "Symbol",
        foreign_keys=[target_symbol_id],
        back_populates="incoming_dependencies",
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Dependency {self.kind} {self.name!r} resolved={self.is_resolved}>"
