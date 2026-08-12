"""Repository management service."""

from __future__ import annotations

import uuid
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from repository_brain.core.config import get_settings
from repository_brain.core.errors import (
    RepositoryAlreadyExistsError,
    RepositoryNotFoundError,
    RepositoryPathError,
)
from repository_brain.core.logging import get_logger
from repository_brain.models.repository import Repository


class RepositoryService:
    """Registers, updates and removes repositories."""

    def __init__(self) -> None:
        self.log = get_logger("repository")
        self.settings = get_settings()

    # ------------------------------------------------------------ lifecycle

    def create(
        self,
        session: Session,
        *,
        name: str,
        path: str,
        url: str | None = None,
        description: str | None = None,
        default_branch: str | None = None,
        watch: bool = False,
    ) -> Repository:
        self._validate_path(path)

        exists = session.scalar(
            select(Repository).where((Repository.name == name) | (Repository.path == path))
        )
        if exists is not None:
            raise RepositoryAlreadyExistsError(f"Repository already registered: {exists.name}")

        repository = Repository(
            name=name,
            path=str(Path(path).resolve()),
            url=url,
            description=description,
            default_branch=default_branch,
            vcs=self._detect_vcs(path),
            status="registered",
            is_watched=watch,
        )
        session.add(repository)
        session.flush()
        self.log.info("repository_registered", name=name, path=path)
        return repository

    def get(self, session: Session, repository_id: uuid.UUID) -> Repository:
        repository = session.get(Repository, repository_id)
        if repository is None:
            raise RepositoryNotFoundError(f"Repository not found: {repository_id}")
        return repository

    def get_by_name(self, session: Session, name: str) -> Repository:
        repository = session.scalar(select(Repository).where(Repository.name == name))
        if repository is None:
            raise RepositoryNotFoundError(f"Repository not found: {name}")
        return repository

    def list(self, session: Session) -> list[Repository]:
        return list(session.scalars(select(Repository).order_by(Repository.created_at.desc())))

    def update(
        self,
        session: Session,
        repository_id: uuid.UUID,
        *,
        name: str | None = None,
        url: str | None = None,
        description: str | None = None,
        default_branch: str | None = None,
        watch: bool | None = None,
    ) -> Repository:
        repository = self.get(session, repository_id)
        if name is not None:
            repository.name = name
        if url is not None:
            repository.url = url
        if description is not None:
            repository.description = description
        if default_branch is not None:
            repository.default_branch = default_branch
        if watch is not None:
            repository.is_watched = watch
        session.flush()
        return repository

    def delete(self, session: Session, repository_id: uuid.UUID) -> None:
        repository = self.get(session, repository_id)
        session.delete(repository)
        session.flush()
        self.log.info("repository_removed", name=repository.name)

    def set_status(
        self,
        session: Session,
        repository: Repository,
        status: str,
    ) -> None:
        repository.status = status
        session.flush()

    # ------------------------------------------------------------ helpers

    def _validate_path(self, path: str) -> None:
        resolved = Path(path).expanduser().resolve()
        if not resolved.is_dir():
            raise RepositoryPathError(f"Not a directory: {path}")
        roots = self.settings.allowed_repository_roots
        if roots:
            allowed = [Path(r).expanduser().resolve() for r in roots]
            if not any(str(resolved).startswith(str(a)) for a in allowed):
                raise RepositoryPathError(f"Path outside allowed roots: {path}")

    @staticmethod
    def _detect_vcs(path: str) -> str | None:
        if (Path(path) / ".git").is_dir():
            return "git"
        if (Path(path) / ".hg").is_dir():
            return "hg"
        if (Path(path) / ".svn").is_dir():
            return "svn"
        return None
