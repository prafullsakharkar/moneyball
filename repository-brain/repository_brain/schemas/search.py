"""Search schemas."""

from __future__ import annotations

import uuid

from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    """Search query payload."""

    query: str = Field(min_length=1)
    scope: str = Field(
        default="all", description="One of: all, files, symbols, modules, dependencies"
    )
    kind: str | None = Field(
        default=None, description="Filter symbols by kind (function, class, ...)"
    )
    language: str | None = None
    exact: bool = False
    repository_id: uuid.UUID | None = None
    limit: int = Field(default=50, ge=1, le=500)
    offset: int = Field(default=0, ge=0)


class SearchResult(BaseModel):
    """A single search hit."""

    type: str
    repository_id: str | None = None
    repository_name: str | None = None
    id: str | None = None
    name: str
    path: str | None = None
    file_id: str | None = None
    file_path: str | None = None
    kind: str | None = None
    qualified_name: str | None = None
    line: int | None = None
    snippet: str | None = None
    score: float = 0.0


class SearchResults(BaseModel):
    """Search response."""

    query: str
    scope: str
    total: int
    results: list[SearchResult]
