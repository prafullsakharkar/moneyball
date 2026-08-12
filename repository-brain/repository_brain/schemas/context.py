"""Context engine schemas."""

from __future__ import annotations

from pydantic import BaseModel, Field


class ContextRequest(BaseModel):
    """Request to build an optimised repository context for a query."""

    query: str = Field(min_length=1)
    repository_id: str | None = None
    max_files: int = Field(default=20, ge=1, le=200)
    include_summaries: bool = True
    include_dependencies: bool = True


class ContextOut(BaseModel):
    """An optimised context bundle for a query."""

    query: str
    repository_id: str | None
    repository_name: str | None
    intent: str
    target_symbols: list[dict]
    files: list[dict]
    dependencies: list[dict]
    summaries: list[str]
    total_files_considered: int
    total_symbols_considered: int
