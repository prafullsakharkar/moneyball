"""Module model — logical grouping of files detected within a repository."""

from __future__ import annotations

import uuid

from sqlalchemy import JSON, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from repository_brain.models.base import Base, UUIDPrimaryKeyMixin


class Module(UUIDPrimaryKeyMixin, Base):
    """A logical module: a coherent set of files, symbols and responsibilities."""

    __tablename__ = "modules"
    __table_args__ = (UniqueConstraint("repository_id", "name", name="uq_modules_repo_name"),)

    repository_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("repositories.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(255), index=True)
    path_prefix: Mapped[str | None] = mapped_column(String(1024))
    kind: Mapped[str] = mapped_column(String(16), default="auto")
    summary: Mapped[str | None] = mapped_column(Text)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    extra: Mapped[dict] = mapped_column(JSON, default=dict)

    repository = relationship("Repository", back_populates="modules")
    files = relationship(
        "ModuleFile",
        back_populates="module",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    outbound_dependencies = relationship(
        "ModuleDependency",
        foreign_keys="ModuleDependency.source_module_id",
        back_populates="source_module",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    inbound_dependencies = relationship(
        "ModuleDependency",
        foreign_keys="ModuleDependency.target_module_id",
        back_populates="target_module",
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Module {self.name!r}>"


class ModuleFile(Base):
    """Association between a module and one of its files."""

    __tablename__ = "module_files"
    __table_args__ = (
        UniqueConstraint("module_id", "file_id", name="uq_module_files_pair"),
        Index("ix_module_files_module", "module_id"),
        Index("ix_module_files_file", "file_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    module_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("modules.id", ondelete="CASCADE"))
    file_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("files.id", ondelete="CASCADE"))
    role: Mapped[str] = mapped_column(String(16), default="core")

    module = relationship("Module", back_populates="files")
    file = relationship("FileEntry")


class ModuleDependency(Base):
    """A dependency edge between two logical modules."""

    __tablename__ = "module_dependencies"
    __table_args__ = (
        UniqueConstraint(
            "source_module_id", "target_module_id", "kind", name="uq_moddep_pair_kind"
        ),
        Index("ix_moddep_source", "source_module_id"),
        Index("ix_moddep_target", "target_module_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    repository_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("repositories.id", ondelete="CASCADE"), index=True
    )
    source_module_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("modules.id", ondelete="CASCADE")
    )
    target_module_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("modules.id", ondelete="CASCADE")
    )
    kind: Mapped[str] = mapped_column(String(32), default="import")
    weight: Mapped[int] = mapped_column(Integer, default=1)

    source_module = relationship("Module", foreign_keys=[source_module_id])
    target_module = relationship("Module", foreign_keys=[target_module_id])
