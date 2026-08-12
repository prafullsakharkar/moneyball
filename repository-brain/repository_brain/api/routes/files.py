"""File query endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_app_container, get_db
from repository_brain.api.serializers import file_to_out, symbol_to_out
from repository_brain.models.file import FileEntry
from repository_brain.models.symbol import Symbol
from repository_brain.schemas.common import PageParams
from repository_brain.schemas.file import FileOut, FilePage, FileStatOut
from repository_brain.schemas.symbol import SymbolOut
from repository_brain.services.container import Container

router = APIRouter(prefix="/files", tags=["files"])


@router.get("", response_model=FilePage)
def list_files(
    repository_id: uuid.UUID,
    language: str | None = Query(default=None),
    params: PageParams = Depends(),
    session: Session = Depends(get_db),
) -> FilePage:
    stmt = select(FileEntry).where(FileEntry.repository_id == repository_id)
    if language:
        stmt = stmt.where(FileEntry.language == language)
    total = len(
        session.scalars(select(FileEntry.id).where(FileEntry.repository_id == repository_id)).all()
    )
    rows = session.scalars(
        stmt.order_by(FileEntry.path).offset(params.offset).limit(params.limit)
    ).all()
    return FilePage(
        items=[file_to_out(f) for f in rows],
        total=total,
        limit=params.limit,
        offset=params.offset,
    )


@router.get("/{file_id}", response_model=FileOut)
def get_file(
    file_id: uuid.UUID,
    session: Session = Depends(get_db),
) -> FileOut:
    file_entry = session.get(FileEntry, file_id)
    if file_entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    return file_to_out(file_entry)


@router.get("/{file_id}/symbols", response_model=list[SymbolOut])
def get_file_symbols(
    file_id: uuid.UUID,
    session: Session = Depends(get_db),
):
    file_entry = session.get(FileEntry, file_id)
    if file_entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    rows = session.scalars(select(Symbol).where(Symbol.file_id == file_id).order_by(Symbol.index))
    return [symbol_to_out(s) for s in rows]


@router.get("/stats/repository/{repository_id}", response_model=FileStatOut)
def get_file_stats(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> FileStatOut:
    statistics = container.memory_service.get(session, repository_id)
    if statistics is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not indexed")
    files = statistics.statistics.get("files", {})
    return FileStatOut(
        total=files.get("total", 0),
        by_language=files.get("by_language", {}),
        by_status=files.get("by_status", {}),
        generated=files.get("generated", 0),
        binary=files.get("binary", 0),
        total_lines=files.get("total_lines", 0),
        total_bytes=files.get("total_bytes", 0),
    )
