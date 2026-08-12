"""Repository summary, architecture, statistics and memory endpoints."""

from __future__ import annotations

import uuid
from datetime import UTC

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_app_container, get_db
from repository_brain.models.architecture import Architecture
from repository_brain.models.memory import RepositoryMemory
from repository_brain.models.repository import Repository
from repository_brain.schemas.architecture import ArchitectureOut, ArchitectureSummaryOut
from repository_brain.schemas.memory import MemoryOut, MemoryRefreshOut, StatisticsOut
from repository_brain.services.container import Container

router = APIRouter(tags=["repository"])


@router.get("/summary", response_model=MemoryOut)
def get_summary(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> MemoryOut:
    repository = session.get(Repository, repository_id)
    if repository is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")
    memory = container.memory_service.get_or_build(session, repository_id)
    return _memory_out(memory)


@router.post("/memory/refresh", response_model=MemoryRefreshOut)
def refresh_memory(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> MemoryRefreshOut:
    """Explicitly rebuild repository memory."""
    memory = container.memory_service.build(session, repository_id)
    session.commit()
    return MemoryRefreshOut(
        repository_id=str(repository_id),
        version=memory.version,
        rebuilt=True,
        message="Repository memory rebuilt",
    )


@router.get("/architecture", response_model=ArchitectureOut)
def get_architecture(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
) -> ArchitectureOut:
    architecture = session.get(Architecture, repository_id)
    if architecture is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Architecture not indexed"
        )
    return ArchitectureOut(
        repository_id=str(architecture.repository_id),
        content=architecture.content,
        updated_at=architecture.updated_at,
    )


@router.get("/architecture/summary", response_model=ArchitectureSummaryOut)
def get_architecture_summary(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> ArchitectureSummaryOut:
    architecture = session.get(Architecture, repository_id)
    if architecture is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Architecture not indexed"
        )
    memory = container.memory_service.get(session, repository_id)
    statistics = memory.statistics if memory else {}

    content = architecture.content
    module_count = statistics.get("modules", {}).get("total", 0)
    symbol_count = statistics.get("symbols", {}).get("total", 0)
    dep_count = statistics.get("dependencies", {}).get("total", 0)

    return ArchitectureSummaryOut(
        repository_id=str(repository_id),
        languages=content.get("languages", {}),
        frameworks=content.get("frameworks", []),
        entry_points=content.get("entry_points", []),
        top_level_structure=content.get("structure", [])[:12],
        module_count=module_count,
        symbol_count=symbol_count,
        dependency_count=dep_count,
        summary=(memory.summary if memory else ""),
    )


@router.get("/statistics", response_model=StatisticsOut)
def get_statistics(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> StatisticsOut:
    from datetime import datetime

    memory = container.memory_service.get(session, repository_id)
    if memory is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not indexed")
    stats = memory.statistics
    return StatisticsOut(
        repository_id=str(repository_id),
        files=stats.get("files", {}),
        symbols=stats.get("symbols", {}),
        dependencies=stats.get("dependencies", {}),
        modules=stats.get("modules", {}),
        languages=stats.get("languages", {}),
        generated_at=datetime.now(UTC),
    )


def _memory_out(memory: RepositoryMemory) -> MemoryOut:
    return MemoryOut(
        repository_id=str(memory.repository_id),
        summary=memory.summary,
        architecture_summary=memory.architecture_summary,
        module_summaries=memory.module_summaries,
        conventions=memory.conventions,
        patterns=memory.patterns,
        statistics=memory.statistics,
        metadata=memory.extra,
        version=memory.version,
        created_at=memory.created_at,
        updated_at=memory.updated_at,
    )
