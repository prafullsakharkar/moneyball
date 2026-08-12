"""Health and version endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from repository_brain import __version__
from repository_brain.services.container import get_container

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    """Liveness probe.

    Represents Repository Brain liveness only and does not depend on the
    upstream LLM backend (or the database) being reachable, so it can be used
    by orchestrators and clients without requiring Qwen to be running.
    """
    return {"status": "ok"}


@router.get("/version")
def version() -> dict:
    container = get_container()
    return {
        "name": container.settings.app_name,
        "version": __version__,
        "environment": container.settings.app_env,
    }
