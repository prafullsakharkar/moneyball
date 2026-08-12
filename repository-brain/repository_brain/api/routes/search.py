"""Search endpoint."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_app_container, get_db
from repository_brain.schemas.search import SearchRequest, SearchResults
from repository_brain.services.container import Container

router = APIRouter(prefix="/search", tags=["search"])


@router.post("", response_model=SearchResults)
def search(
    payload: SearchRequest,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> SearchResults:
    try:
        hits, total = container.search_service.search(
            session,
            payload.query,
            scope=payload.scope,
            kind=payload.kind,
            language=payload.language,
            exact=payload.exact,
            repository_id=payload.repository_id,
            limit=payload.limit,
            offset=payload.offset,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from None
    return SearchResults(
        query=payload.query,
        scope=payload.scope,
        total=total,
        results=[h.to_dict() for h in hits],
    )
