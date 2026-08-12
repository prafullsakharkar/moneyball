"""Module schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from repository_brain.schemas.common import Page


class ModuleOut(BaseModel):
    """Serialised logical module."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    repository_id: str
    name: str
    path_prefix: str | None
    kind: str
    summary: str | None
    score: float
    metadata: dict
    file_count: int = 0
    symbol_count: int = 0


class ModuleDetailOut(ModuleOut):
    """Module with its files, symbols and dependencies."""

    files: list[str] = []
    symbols: list[str] = []
    dependencies: list[str] = []
    dependents: list[str] = []


class ModuleGraphOut(BaseModel):
    """Serialised module dependency graph."""

    nodes: list[dict]
    edges: list[dict]


class ModulePage(Page[ModuleOut]):
    """Paginated module listing."""
