"""File schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from repository_brain.schemas.common import Page


class FileOut(BaseModel):
    """Serialised indexed file."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    repository_id: str
    path: str
    language: str | None
    size: int
    sha256: str
    mtime: float
    is_generated: bool
    is_binary: bool
    encoding: str | None
    line_count: int
    status: str
    indexed_at: datetime


class FilePage(Page[FileOut]):
    """Paginated file listing."""


class FileStatOut(BaseModel):
    """File statistics for one repository."""

    total: int
    by_language: dict[str, int]
    by_status: dict[str, int]
    generated: int
    binary: int
    total_lines: int
    total_bytes: int


class ScanChanges(BaseModel):
    """Files that changed since the last scan."""

    added: list[str]
    modified: list[str]
    deleted: list[str]
    unchanged: list[str]
