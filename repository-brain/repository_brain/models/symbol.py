"""Symbol model — one row per parsed symbol within a file."""

from __future__ import annotations

import uuid

from sqlalchemy import JSON, Boolean, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from repository_brain.models.base import Base, UUIDPrimaryKeyMixin


class Symbol(UUIDPrimaryKeyMixin, Base):
    """A named construct (class, function, method, interface, ...) in a file."""

    __tablename__ = "symbols"
    __table_args__ = (
        Index(
            "uq_symbols_repo_file_name", "repository_id", "file_id", "qualified_name", unique=True
        ),
        Index("ix_symbols_repo_name", "repository_id", "name"),
        Index("ix_symbols_repo_kind", "repository_id", "kind"),
    )

    repository_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("repositories.id", ondelete="CASCADE"), index=True
    )
    file_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("files.id", ondelete="CASCADE"), index=True
    )
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("symbols.id", ondelete="CASCADE"), index=True
    )

    name: Mapped[str] = mapped_column(String(512))
    qualified_name: Mapped[str] = mapped_column(String(1024), index=True)
    kind: Mapped[str] = mapped_column(String(32), index=True)
    language: Mapped[str | None] = mapped_column(String(64))
    visibility: Mapped[str | None] = mapped_column(String(16))
    is_exported: Mapped[bool] = mapped_column(Boolean, default=False)
    is_async: Mapped[bool] = mapped_column(Boolean, default=False)
    is_abstract: Mapped[bool] = mapped_column(Boolean, default=False)

    start_line: Mapped[int] = mapped_column(Integer, default=1)
    end_line: Mapped[int] = mapped_column(Integer, default=1)
    start_col: Mapped[int] = mapped_column(Integer, default=0)
    end_col: Mapped[int] = mapped_column(Integer, default=0)
    index: Mapped[int] = mapped_column(Integer, default=0)

    docstring: Mapped[str | None] = mapped_column(Text)
    signature: Mapped[str | None] = mapped_column(Text)
    extra: Mapped[dict] = mapped_column(JSON, default=dict)

    repository = relationship("Repository", back_populates="symbols")
    file = relationship("FileEntry", back_populates="symbols")
    parent = relationship("Symbol", remote_side="Symbol.id", back_populates="children")
    children = relationship("Symbol", back_populates="parent")
    outgoing_dependencies = relationship(
        "Dependency",
        foreign_keys="Dependency.source_symbol_id",
        back_populates="source_symbol",
    )
    incoming_dependencies = relationship(
        "Dependency",
        foreign_keys="Dependency.target_symbol_id",
        back_populates="target_symbol",
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Symbol {self.kind} {self.qualified_name!r}>"
