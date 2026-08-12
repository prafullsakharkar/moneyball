"""Dependency schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from repository_brain.schemas.common import Page


class DependencyCreate(BaseModel):
    """Payload for a single dependency edge (internal)."""

    source_file_id: str | None = None
    target_file_id: str | None = None
    source_symbol_id: str | None = None
    target_symbol_id: str | None = None
    kind: str
    name: str
    target_name: str | None = None
    is_resolved: bool = False
    is_external: bool = False
    line: int | None = None
    metadata: dict = {}


class DependencyOut(BaseModel):
    """Serialised dependency edge."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    repository_id: str
    source_file_id: str | None
    target_file_id: str | None
    source_symbol_id: str | None
    target_symbol_id: str | None
    kind: str
    name: str
    target_name: str | None
    is_resolved: bool
    is_external: bool
    line: int | None
    metadata: dict


class DependencyPage(Page[DependencyOut]):
    """Paginated dependency listing."""


class DependencyGraphOut(BaseModel):
    """Serialised dependency graph (file-level edges)."""

    nodes: list[dict]
    edges: list[dict]
