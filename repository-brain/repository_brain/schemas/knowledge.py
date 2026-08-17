"""Repository knowledge and architecture query schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from repository_brain.schemas.common import Page


class RepositoryOverview(BaseModel):
    """A deterministic summary of a repository's structure."""

    repository_id: str
    name: str
    root_path: str
    languages: list[str]
    frameworks: list[str]
    file_count: int
    symbol_count: int
    relationship_count: int
    module_count: int
    top_level_directories: list[str]
    config_files: list[str]
    git_branch: str | None
    status: str
    last_scanned_at: datetime | None


class FileTreeNode(BaseModel):
    """A single node in the repository file tree."""

    name: str
    path: str
    type: str
    language: str | None = None
    file_id: str | None = None
    truncated: bool = False
    children: list[FileTreeNode] = []


class FileTreeOut(BaseModel):
    """A structured view of the repository file tree."""

    repository_id: str
    root: str
    total: int
    limit: int
    offset: int
    truncated: bool
    nodes: list[FileTreeNode]


class RelationshipOut(BaseModel):
    """A single directed relationship edge between repository elements."""

    id: str
    kind: str
    name: str
    direction: str
    source_path: str | None = None
    target_path: str | None = None
    source_symbol: str | None = None
    target_symbol: str | None = None
    is_resolved: bool
    is_external: bool
    line: int | None = None


class RelationshipPage(Page[RelationshipOut]):
    """Paginated relationship listing."""


FileTreeNode.model_rebuild()
