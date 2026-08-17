"""Repository context retrieval schemas.

Structured, deterministic repository context assembled for a natural-language
query. No LLM is involved in building this context.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class ContextQuery(BaseModel):
    """Request to retrieve deterministic repository context for a query."""

    query: str = Field(min_length=1, max_length=500)
    limit: int = Field(default=20, ge=1, le=100)


class ContextFile(BaseModel):
    """A file included in repository context."""

    path: str
    language: str | None = None
    score: float = 0.0
    match: str | None = None
    symbols: list[str] = Field(default_factory=list)


class ContextSymbol(BaseModel):
    """A symbol included in repository context."""

    name: str
    qualified_name: str
    kind: str
    file_path: str | None = None
    line: int | None = None
    signature: str | None = None
    score: float = 0.0
    match: str | None = None


class ContextRelationship(BaseModel):
    """A relationship edge included in repository context."""

    kind: str
    name: str
    source_path: str | None = None
    target_path: str | None = None
    source_symbol: str | None = None
    target_symbol: str | None = None
    is_resolved: bool = False
    is_external: bool = False


class ContextArchitecture(BaseModel):
    """Architecture signals for the repository."""

    languages: list[str] = Field(default_factory=list)
    frameworks: list[str] = Field(default_factory=list)
    top_level_directories: list[str] = Field(default_factory=list)
    entry_points: list[str] = Field(default_factory=list)
    config_files: list[str] = Field(default_factory=list)


class RepositoryContextOut(BaseModel):
    """Structured repository context for a query."""

    query: str
    repository_id: str
    repository_name: str
    repository: dict
    files: list[ContextFile]
    symbols: list[ContextSymbol]
    relationships: list[ContextRelationship]
    architecture: ContextArchitecture
    counts: dict
    ranking: list[dict]
