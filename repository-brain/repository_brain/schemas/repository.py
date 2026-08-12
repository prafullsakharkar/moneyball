"""Repository schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RepositoryCreate(BaseModel):
    """Payload for registering a repository."""

    name: str = Field(min_length=1, max_length=255)
    path: str = Field(min_length=1)
    url: str | None = None
    description: str | None = None
    default_branch: str | None = None
    watch: bool = False


class RepositoryUpdate(BaseModel):
    """Payload for updating repository metadata."""

    name: str | None = Field(default=None, min_length=1, max_length=255)
    url: str | None = None
    description: str | None = None
    default_branch: str | None = None
    watch: bool | None = None


class RepositoryOut(BaseModel):
    """Serialised repository."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    path: str
    url: str | None
    description: str | None
    default_branch: str | None
    vcs: str | None
    status: str
    is_watched: bool
    last_scanned_at: datetime | None
    metadata: dict
    created_at: datetime
    updated_at: datetime


class RepositoryScanOut(BaseModel):
    """Result of a scan or reindex operation."""

    repository_id: str
    repository_name: str
    operation: str
    status: str
    files_scanned: int
    files_added: int
    files_modified: int
    files_deleted: int
    files_unchanged: int
    symbols_indexed: int
    dependencies_indexed: int
    modules_detected: int
    started_at: datetime
    finished_at: datetime
    duration_seconds: float
