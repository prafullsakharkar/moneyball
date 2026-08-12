"""Memory and statistics schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MemoryOut(BaseModel):
    """Serialised repository memory."""

    model_config = ConfigDict(from_attributes=True)

    repository_id: str
    summary: str
    architecture_summary: str
    module_summaries: dict
    conventions: dict
    patterns: dict
    statistics: dict
    metadata: dict
    version: int
    created_at: datetime
    updated_at: datetime


class StatisticsOut(BaseModel):
    """Repository statistics."""

    repository_id: str
    files: dict
    symbols: dict
    dependencies: dict
    modules: dict
    languages: dict[str, int]
    generated_at: datetime


class MemoryRefreshOut(BaseModel):
    """Result of rebuilding repository memory."""

    repository_id: str
    version: int
    rebuilt: bool
    message: str
