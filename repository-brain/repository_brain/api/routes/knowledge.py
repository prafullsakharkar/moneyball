"""Repository knowledge and architecture query endpoints.

Deterministic structural queries over the persisted index. No LLM calls, no
filesystem reads beyond the index.
"""

from __future__ import annotations

import dataclasses
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_app_container, get_db
from repository_brain.api.serializers import symbol_to_out
from repository_brain.core.errors import RepositoryNotFoundError
from repository_brain.schemas.common import PageParams
from repository_brain.schemas.knowledge import (
    FileTreeOut,
    RelationshipOut,
    RelationshipPage,
    RepositoryOverview,
)
from repository_brain.schemas.symbol import SymbolPage
from repository_brain.services.container import Container

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


def _not_found(exc: RepositoryNotFoundError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.get("/overview", response_model=RepositoryOverview)
def repository_overview(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RepositoryOverview:
    try:
        data = container.knowledge_service.overview(session, repository_id)
    except RepositoryNotFoundError as exc:
        raise _not_found(exc) from None
    return RepositoryOverview(**data)


@router.get("/files", response_model=FileTreeOut)
def repository_file_tree(
    repository_id: uuid.UUID,
    depth: int = Query(default=3, ge=1, le=10),
    children_limit: int = Query(default=200, ge=1, le=1000),
    limit: int = Query(default=50, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> FileTreeOut:
    try:
        data = container.knowledge_service.file_tree(
            session,
            repository_id,
            depth=depth,
            children_limit=children_limit,
            limit=limit,
            offset=offset,
        )
    except RepositoryNotFoundError as exc:
        raise _not_found(exc) from None
    return FileTreeOut(
        **{
            **data,
            "nodes": [dataclasses.asdict(n) for n in data["nodes"]],
        }
    )


@router.get("/symbols", response_model=SymbolPage)
def knowledge_symbols(
    repository_id: uuid.UUID,
    name: str | None = Query(default=None),
    kind: str | None = Query(default=None),
    language: str | None = Query(default=None),
    exact: bool = Query(default=False),
    params: PageParams = Depends(),
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> SymbolPage:
    try:
        rows, total = container.knowledge_service.find_symbols(
            session,
            repository_id,
            name=name,
            kind=kind,
            language=language,
            exact=exact,
            limit=params.limit,
            offset=params.offset,
        )
    except RepositoryNotFoundError as exc:
        raise _not_found(exc) from None
    return SymbolPage(
        items=[symbol_to_out(s) for s in rows],
        total=total,
        limit=params.limit,
        offset=params.offset,
    )


@router.get("/relationships", response_model=RelationshipPage)
def knowledge_relationships(
    repository_id: uuid.UUID,
    kind: str | None = Query(default=None),
    direction: str = Query(default="outgoing", pattern="^(outgoing|incoming)$"),
    file_path: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RelationshipPage:
    try:
        rows, total = container.knowledge_service.relationships(
            session,
            repository_id,
            kind=kind,
            direction=direction,
            file_path=file_path,
            limit=limit,
            offset=offset,
        )
    except RepositoryNotFoundError as exc:
        raise _not_found(exc) from None
    return RelationshipPage(
        items=[RelationshipOut(**dataclasses.asdict(row)) for row in rows],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/imports", response_model=RelationshipPage)
def knowledge_imports(
    repository_id: uuid.UUID,
    direction: str = Query(default="outgoing", pattern="^(outgoing|incoming)$"),
    file_path: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RelationshipPage:
    try:
        rows, total = container.knowledge_service.imports(
            session,
            repository_id,
            direction=direction,
            file_path=file_path,
            limit=limit,
            offset=offset,
        )
    except RepositoryNotFoundError as exc:
        raise _not_found(exc) from None
    return RelationshipPage(
        items=[RelationshipOut(**dataclasses.asdict(row)) for row in rows],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/dependencies", response_model=RelationshipPage)
def knowledge_dependencies(
    repository_id: uuid.UUID,
    kind: str = Query(default="manifest"),
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RelationshipPage:
    try:
        rows, total = container.knowledge_service.dependencies(
            session, repository_id, kind=kind, limit=limit, offset=offset
        )
    except RepositoryNotFoundError as exc:
        raise _not_found(exc) from None
    return RelationshipPage(
        items=[RelationshipOut(**dataclasses.asdict(row)) for row in rows],
        total=total,
        limit=limit,
        offset=offset,
    )
