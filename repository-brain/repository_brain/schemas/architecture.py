"""Architecture schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ArchitectureOut(BaseModel):
    """Serialised repository architecture."""

    model_config = ConfigDict(from_attributes=True)

    repository_id: str
    content: dict
    updated_at: datetime


class ArchitectureSummaryOut(BaseModel):
    """A compact, human-readable architecture summary."""

    repository_id: str
    languages: dict[str, int]
    frameworks: list[str]
    entry_points: list[str]
    top_level_structure: list[str]
    module_count: int
    symbol_count: int
    dependency_count: int
    summary: str
