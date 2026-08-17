"""Repository context retrieval endpoint.

Builds deterministic repository context for a query. No LLM is invoked here;
this is the retrieval foundation that later phases will feed to a model.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_app_container, get_db
from repository_brain.core.errors import RepositoryNotFoundError
from repository_brain.schemas.context import ContextQuery, RepositoryContextOut
from repository_brain.services.container import Container

router = APIRouter(prefix="/api/v1", tags=["context"])


@router.post(
    "/repositories/{repository_id}/context",
    response_model=RepositoryContextOut,
)
def repository_context(
    repository_id: uuid.UUID,
    payload: ContextQuery,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RepositoryContextOut:
    """Return structured, deterministic repository context for a query.

    Retrieval is rule-based: exact symbol/qualified-name/file/path matches are
    ranked above partial matches. Limits come from the query body and the
    ``MAX_CONTEXT_*`` settings. This endpoint never calls an LLM.
    """
    try:
        data = container.context_service.build(
            session,
            repository_id,
            payload.query,
            limit=payload.limit,
        )
    except RepositoryNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from None
    return RepositoryContextOut(**data)
