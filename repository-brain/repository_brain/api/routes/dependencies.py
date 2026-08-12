"""Dependency query endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_db
from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.symbol import Symbol
from repository_brain.schemas.dependency import DependencyGraphOut, DependencyOut, DependencyPage

router = APIRouter(prefix="/dependencies", tags=["dependencies"])


def _to_out(dep: Dependency) -> DependencyOut:
    return DependencyOut(
        id=str(dep.id),
        repository_id=str(dep.repository_id),
        source_file_id=str(dep.source_file_id) if dep.source_file_id else None,
        target_file_id=str(dep.target_file_id) if dep.target_file_id else None,
        source_symbol_id=str(dep.source_symbol_id) if dep.source_symbol_id else None,
        target_symbol_id=str(dep.target_symbol_id) if dep.target_symbol_id else None,
        kind=dep.kind,
        name=dep.name,
        target_name=dep.target_name,
        is_resolved=dep.is_resolved,
        is_external=dep.is_external,
        line=dep.line,
        metadata=dep.extra,
    )


@router.get("", response_model=DependencyPage)
def list_dependencies(
    repository_id: uuid.UUID,
    kind: str | None = Query(default=None),
    resolved: bool | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_db),
) -> DependencyPage:
    stmt = select(Dependency).where(Dependency.repository_id == repository_id)
    if kind:
        stmt = stmt.where(Dependency.kind == kind)
    if resolved is not None:
        stmt = stmt.where(Dependency.is_resolved.is_(resolved))
    total = len(session.scalars(stmt).all())
    rows = session.scalars(stmt.offset(offset).limit(limit)).all()
    return DependencyPage(items=[_to_out(d) for d in rows], total=total, limit=limit, offset=offset)


@router.get("/{symbol}", response_model=list[DependencyOut])
def get_dependencies_for_symbol(
    symbol: str,
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
) -> list[DependencyOut]:
    """Return edges related to a symbol (by name).

    Matches both outbound edges (this symbol depends on others) and inbound
    edges (other symbols depend on this one).
    """
    symbol_ids = list(
        session.scalars(
            select(Symbol.id).where(Symbol.repository_id == repository_id, Symbol.name == symbol)
        )
    )
    if not symbol_ids:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Symbol not found")

    rows = session.scalars(
        select(Dependency).where(
            Dependency.repository_id == repository_id,
            or_(
                Dependency.source_symbol_id.in_(symbol_ids),
                Dependency.target_symbol_id.in_(symbol_ids),
            ),
        )
    )
    return [_to_out(d) for d in rows]


@router.get("/graph/repository/{repository_id}", response_model=DependencyGraphOut)
def dependency_graph(
    repository_id: uuid.UUID,
    kind: str | None = Query(default=None),
    session: Session = Depends(get_db),
) -> DependencyGraphOut:
    """Return the file-level dependency graph (resolved edges only)."""
    stmt = select(Dependency).where(
        Dependency.repository_id == repository_id,
        Dependency.is_resolved.is_(True),
        Dependency.target_file_id.is_not(None),
    )
    if kind:
        stmt = stmt.where(Dependency.kind == kind)

    rows = list(session.scalars(stmt))
    node_ids: set[uuid.UUID] = set()
    for dep in rows:
        if dep.source_file_id:
            node_ids.add(dep.source_file_id)
        if dep.target_file_id:
            node_ids.add(dep.target_file_id)

    files = list(session.scalars(select(FileEntry).where(FileEntry.id.in_(node_ids))))
    nodes = [{"id": str(f.id), "path": f.path, "language": f.language} for f in files]
    edges = [
        {
            "source": str(dep.source_file_id),
            "target": str(dep.target_file_id),
            "kind": dep.kind,
            "name": dep.name,
            "resolved": dep.is_resolved,
        }
        for dep in rows
        if dep.source_file_id and dep.target_file_id
    ]
    return DependencyGraphOut(nodes=nodes, edges=edges)
