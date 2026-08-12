"""Shared FastAPI dependencies."""

from __future__ import annotations

from collections.abc import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from repository_brain.core.database import get_session
from repository_brain.proxy.client import LLMClient
from repository_brain.services.container import Container, get_container


def get_db() -> Generator[Session, None, None]:
    yield from get_session()


def get_app_container() -> Container:
    return get_container()


def get_indexer(container: Container = Depends(get_app_container)):
    return container.indexer


def get_background_scanner(container: Container = Depends(get_app_container)):
    return container.background_scanner


def get_llm_client(container: Container = Depends(get_app_container)) -> LLMClient:
    return container.llm_client
