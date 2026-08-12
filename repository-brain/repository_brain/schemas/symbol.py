"""Symbol schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from repository_brain.schemas.common import Page


class SymbolCreate(BaseModel):
    """Payload for a single parsed symbol (internal)."""

    name: str
    qualified_name: str
    kind: str
    language: str | None = None
    parent_name: str | None = None
    visibility: str | None = None
    is_exported: bool = False
    is_async: bool = False
    is_abstract: bool = False
    start_line: int = 1
    end_line: int = 1
    start_col: int = 0
    end_col: int = 0
    index: int = 0
    docstring: str | None = None
    signature: str | None = None
    metadata: dict = {}


class SymbolOut(BaseModel):
    """Serialised symbol."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    repository_id: str
    file_id: str
    file_path: str | None = None
    parent_id: str | None = None
    name: str
    qualified_name: str
    kind: str
    language: str | None
    visibility: str | None
    is_exported: bool
    is_async: bool
    is_abstract: bool
    start_line: int
    end_line: int
    start_col: int
    end_col: int
    docstring: str | None
    signature: str | None
    metadata: dict


class SymbolDetailOut(SymbolOut):
    """Symbol plus dependency and reference information."""

    referenced_by: list[str] = []
    references: list[str] = []
    children: list[SymbolOut] = []


class SymbolPage(Page[SymbolOut]):
    """Paginated symbol listing."""
