"""Shared pagination and message schemas."""

from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class Message(BaseModel):
    """A simple status message."""

    message: str
    detail: str | None = None


class PageParams(BaseModel):
    """Pagination query parameters."""

    limit: int = Field(default=50, ge=1, le=1000)
    offset: int = Field(default=0, ge=0)


class Page(BaseModel, Generic[T]):
    """A paginated list of items."""

    items: list[T]
    total: int
    limit: int
    offset: int

    @property
    def has_more(self) -> bool:
        return self.offset + len(self.items) < self.total
