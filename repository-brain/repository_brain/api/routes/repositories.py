"""Repository management and scanning endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_app_container, get_background_scanner, get_db
from repository_brain.core.errors import (
    RepositoryAlreadyExistsError,
    RepositoryNotFoundError,
    RepositoryPathError,
)
from repository_brain.core.logging import get_logger
from repository_brain.schemas.common import Message
from repository_brain.schemas.repository import (
    RepositoryCreate,
    RepositoryOut,
    RepositoryScanOut,
    RepositoryUpdate,
)
from repository_brain.services.container import Container
from repository_brain.workers.scanner import BackgroundScanner

log = get_logger("api.repositories")
router = APIRouter(prefix="/repositories", tags=["repositories"])


def _to_out(repository) -> RepositoryOut:
    return RepositoryOut(
        id=str(repository.id),
        name=repository.name,
        path=repository.path,
        url=repository.url,
        description=repository.description,
        default_branch=repository.default_branch,
        vcs=repository.vcs,
        status=repository.status,
        is_watched=repository.is_watched,
        last_scanned_at=repository.last_scanned_at,
        metadata=repository.extra,
        created_at=repository.created_at,
        updated_at=repository.updated_at,
    )


@router.post("", response_model=RepositoryOut, status_code=status.HTTP_201_CREATED)
def register_repository(
    payload: RepositoryCreate,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RepositoryOut:
    try:
        repository = container.repository_service.create(
            session,
            name=payload.name,
            path=payload.path,
            url=payload.url,
            description=payload.description,
            default_branch=payload.default_branch,
            watch=payload.watch,
        )
    except RepositoryPathError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from None
    except RepositoryAlreadyExistsError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from None
    session.commit()
    return _to_out(repository)


@router.get("", response_model=list[RepositoryOut])
def list_repositories(
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> list[RepositoryOut]:
    return [_to_out(r) for r in container.repository_service.list(session)]


@router.get("/{repository_id}", response_model=RepositoryOut)
def get_repository(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RepositoryOut:
    try:
        repository = container.repository_service.get(session, repository_id)
    except RepositoryNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from None
    return _to_out(repository)


@router.patch("/{repository_id}", response_model=RepositoryOut)
def update_repository(
    repository_id: uuid.UUID,
    payload: RepositoryUpdate,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RepositoryOut:
    try:
        repository = container.repository_service.update(
            session,
            repository_id,
            name=payload.name,
            url=payload.url,
            description=payload.description,
            default_branch=payload.default_branch,
            watch=payload.watch,
        )
    except RepositoryNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from None
    session.commit()
    return _to_out(repository)


@router.delete("/{repository_id}", response_model=Message)
def delete_repository(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> Message:
    try:
        repository = container.repository_service.get(session, repository_id)
    except RepositoryNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from None
    container.snapshot_service.delete(repository)
    container.repository_service.delete(session, repository_id)
    session.commit()
    return Message(message=f"Repository {repository_id} removed")


@router.post("/{repository_id}/scan", response_model=RepositoryScanOut)
def scan_repository(
    repository_id: uuid.UUID,
    background: bool = Query(default=False),
    full: bool = Query(default=False),
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
    scanner: BackgroundScanner = Depends(get_background_scanner),
) -> RepositoryScanOut:
    try:
        repository = container.repository_service.get(session, repository_id)
    except RepositoryNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from None

    if background:
        job = scanner.submit(repository.id, full=full)
        return RepositoryScanOut(
            repository_id=str(repository.id),
            repository_name=repository.name,
            operation="background-scan",
            status="queued",
            files_scanned=0,
            files_added=0,
            files_modified=0,
            files_deleted=0,
            files_unchanged=0,
            symbols_indexed=0,
            dependencies_indexed=0,
            modules_detected=0,
            started_at=job.created_at,
            finished_at=job.created_at,
            duration_seconds=0.0,
        )

    report = container.indexer.index(session, repository, full=full)
    session.commit()
    return _scan_out(repository, report)


@router.post("/{repository_id}/reindex", response_model=RepositoryScanOut)
def reindex_repository(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RepositoryScanOut:
    """Force a full re-index of the repository (re-parses every file)."""
    try:
        repository = container.repository_service.get(session, repository_id)
    except RepositoryNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from None
    report = container.indexer.index(session, repository, full=True)
    session.commit()
    return _scan_out(repository, report)


def _scan_out(repository, report) -> RepositoryScanOut:
    return RepositoryScanOut(
        repository_id=str(repository.id),
        repository_name=repository.name,
        operation=report.operation,
        status=report.status,
        files_scanned=report.files_scanned,
        files_added=report.files_added,
        files_modified=report.files_modified,
        files_deleted=report.files_deleted,
        files_unchanged=report.files_unchanged,
        symbols_indexed=report.symbols_indexed,
        dependencies_indexed=report.dependencies_indexed,
        modules_detected=report.modules_detected,
        started_at=report.started_at,
        finished_at=report.finished_at or report.started_at,
        duration_seconds=report.duration_seconds,
    )
