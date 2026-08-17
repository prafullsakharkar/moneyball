"""Repository index (persistent registration) endpoint."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_app_container, get_db
from repository_brain.core.errors import RepositoryPathError
from repository_brain.core.logging import get_logger
from repository_brain.schemas.repository import RepositoryIndexIn, RepositoryIndexOut
from repository_brain.services.container import Container

log = get_logger("api.repository_index")
router = APIRouter(prefix="/api/v1/repositories", tags=["repository-index"])


def _to_index_out(repository) -> RepositoryIndexOut:
    return RepositoryIndexOut(
        id=str(repository.id),
        name=repository.name,
        description=repository.description,
        root_path=repository.root_path or repository.path,
        default_branch=repository.default_branch,
        status=repository.status,
        language_set=list(repository.language_set or []),
        framework_set=list(repository.framework_set or []),
        created_at=repository.created_at,
        updated_at=repository.updated_at,
    )


@router.post("/index", response_model=RepositoryIndexOut)
def index_repository(
    payload: RepositoryIndexIn,
    response: Response,
    session: Session = Depends(get_db),
    container: Container = Depends(get_app_container),
) -> RepositoryIndexOut:
    """Register a repository for persistent knowledge.

    Idempotent: re-registering an already-known path returns the existing
    registration with a 200 response instead of creating a duplicate.
    """
    try:
        repository, created = container.repository_service.index_register(
            session, path=payload.path
        )
    except RepositoryPathError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from None
    session.commit()
    response.status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    return _to_index_out(repository)
