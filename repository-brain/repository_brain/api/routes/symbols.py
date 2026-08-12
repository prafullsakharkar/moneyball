"""Symbol query endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_app_container, get_db
from repository_brain.api.serializers import symbol_to_out
from repository_brain.core.errors import SymbolNotFoundError
from repository_brain.models.dependency import Dependency
from repository_brain.models.symbol import Symbol
from repository_brain.schemas.common import PageParams
from repository_brain.schemas.symbol import SymbolDetailOut, SymbolOut, SymbolPage
from repository_brain.services.container import Container

router = APIRouter(tags=["symbols"])


@router.get("/symbols", response_model=SymbolPage)
def list_symbols(
    repository_id: uuid.UUID,
    name: str | None = Query(default=None),
    kind: str | None = Query(default=None),
    params: PageParams = Depends(),
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> SymbolPage:
    rows, total = container.symbol_service.find(
        session,
        repository_id,
        name=name,
        kind=kind,
        limit=params.limit,
        offset=params.offset,
    )
    return SymbolPage(
        items=[symbol_to_out(s) for s in rows],
        total=total,
        limit=params.limit,
        offset=params.offset,
    )


@router.get("/symbols/{name}", response_model=list[SymbolOut])
def get_symbol_by_name(
    name: str,
    repository_id: uuid.UUID = Query(description="Repository id"),
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> list[SymbolOut]:
    rows, _ = container.symbol_service.find(session, repository_id, name=name)
    return [symbol_to_out(s) for s in rows]


@router.get("/symbols/by-id/{symbol_id}", response_model=SymbolDetailOut)
def get_symbol_detail(
    symbol_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> SymbolDetailOut:
    try:
        symbol = container.symbol_service.get(session, symbol_id)
    except SymbolNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from None

    out = symbol_to_out(symbol).model_dump()

    referenced_by = session.scalars(
        select(Dependency.source_symbol_id).where(Dependency.target_symbol_id == symbol.id)
    ).all()
    references = session.scalars(
        select(Dependency.target_symbol_id).where(Dependency.source_symbol_id == symbol.id)
    ).all()

    referrer_names = []
    for sid in set(referenced_by):
        if sid:
            name_row = session.scalar(select(Symbol.name).where(Symbol.id == sid))
            if name_row:
                referrer_names.append(name_row)

    reference_names = []
    for sid in set(references):
        if sid:
            name_row = session.scalar(select(Symbol.name).where(Symbol.id == sid))
            if name_row:
                reference_names.append(name_row)

    children = list(session.scalars(select(Symbol).where(Symbol.parent_id == symbol.id)))
    return SymbolDetailOut(
        **out,
        referenced_by=referrer_names,
        references=reference_names,
        children=[symbol_to_out(c) for c in children],
    )
