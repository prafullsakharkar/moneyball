"""Repository management service."""

from __future__ import annotations

import hashlib
import os
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
from repository_brain.detection import FrameworkDetector, LanguageDetector
from repository_brain.git import GitDetector
from repository_brain.models.repository import Repository, RepositoryStatus


class RepositoryService:
    """Registers, updates and removes repositories."""

    def __init__(self) -> None:
        self.log = get_logger("repository")
        self.settings = get_settings()
        self.language_detector = LanguageDetector()
        self.framework_detector = FrameworkDetector()
        self.git_detector = GitDetector()

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
        git = self.git_detector.detect(path)

        exists = session.scalar(
            select(Repository).where((Repository.name == name) | (Repository.path == path))
        )
        if exists is not None:
            raise RepositoryAlreadyExistsError(f"Repository already registered: {exists.name}")

        repository = Repository(
            name=name,
            path=str(Path(path).resolve()),
            root_path=git.root_path or str(Path(path).resolve()),
            url=url,
            description=description,
            default_branch=default_branch or git.default_branch,
            vcs=git.vcs or self._detect_vcs(path),
            status=RepositoryStatus.REGISTERED.value,
            is_watched=watch,
        )
        session.add(repository)
        session.flush()
        self.log.info("repository_registered", name=name, path=path)
        return repository

    def index_register(self, session: Session, *, path: str) -> tuple[Repository, bool]:
        """Idempotently register a repository for indexing.

        Validates that the path exists, is a directory and is readable, then
        persists a Repository row with its detected metadata. Repeated calls
        with the same path return the existing registration instead of creating
        uncontrolled duplicates.

        Returns a ``(repository, created)`` tuple where ``created`` is True
        only when a new row was inserted.
        """
        resolved = self._resolve_index_path(path)
        existing = session.scalar(select(Repository).where(Repository.path == str(resolved)))
        if existing is not None:
            return existing, False

        git = self.git_detector.detect(resolved)
        name = self._unique_name(session, resolved.name, resolved)
        repository = Repository(
            name=name,
            path=str(resolved),
            root_path=git.root_path or str(resolved),
            description=None,
            default_branch=git.default_branch,
            vcs=git.vcs or self._detect_vcs(str(resolved)),
            status=RepositoryStatus.REGISTERED.value,
            is_watched=False,
            language_set=self.language_detector.detect(
                resolved, limit=self.settings.index_detect_file_limit
            ),
            framework_set=self.framework_detector.detect(resolved),
        )
        session.add(repository)
        session.flush()
        self.log.info("repository_index_registered", name=name, path=str(resolved))
        return repository, True

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

    def _resolve_index_path(self, path: str) -> Path:
        """Resolve and validate a path for indexing (dir + readable)."""
        resolved = Path(path).expanduser().resolve()
        self._validate_path(str(resolved))
        if not os.access(resolved, os.R_OK):
            raise RepositoryPathError(f"Not readable: {path}")
        return resolved

    def _unique_name(self, session: Session, name: str, path: Path) -> str:
        """Return a name unique across repositories, disambiguating on collision."""
        base = name[:255] or "root"
        if session.scalar(select(Repository).where(Repository.name == base)) is None:
            return base
        digest = hashlib.sha1(str(path).encode("utf-8")).hexdigest()[:8]
        return f"{base}-{digest}"[:255]

    @staticmethod
    def _detect_vcs(path: str) -> str | None:
        if (Path(path) / ".git").is_dir():
            return "git"
        if (Path(path) / ".hg").is_dir():
            return "hg"
        if (Path(path) / ".svn").is_dir():
            return "svn"
        return None
