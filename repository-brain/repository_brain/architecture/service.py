"""Architecture persistence service."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from repository_brain.architecture.detector import ArchitectureDetector
from repository_brain.models.architecture import Architecture
from repository_brain.models.file import FileEntry


class ArchitectureService:
    """Builds and persists repository architecture snapshots."""

    def __init__(self) -> None:
        self.detector = ArchitectureDetector()

    def build(
        self,
        session: Session,
        repository_id: uuid.UUID,
        *,
        root_path: str | None = None,
    ) -> Architecture:
        """Rebuild architecture from the repository's current file index."""
        paths = list(
            session.scalars(
                select(FileEntry.path).where(
                    FileEntry.repository_id == repository_id,
                    FileEntry.status == "active",
                )
            )
        )
        detector = ArchitectureDetector(root_path=root_path) if root_path else self.detector
        snapshot = detector.detect(paths)

        architecture = session.get(Architecture, repository_id)
        if architecture is None:
            architecture = Architecture(repository_id=repository_id, content={})
            session.add(architecture)
        architecture.content = snapshot.to_dict()
        session.flush()
        return architecture
