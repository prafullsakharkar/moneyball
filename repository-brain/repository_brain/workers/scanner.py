"""Background scanner: runs indexing without blocking the API."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import UTC, datetime
from threading import Thread

from repository_brain.core.database import SessionLocal
from repository_brain.core.logging import get_logger
from repository_brain.indexer.service import IndexReport
from repository_brain.models.repository import Repository
from repository_brain.services.container import get_container

log = get_logger("workers")


@dataclass(slots=True)
class ScanJob:
    """A queued background scan."""

    id: str
    repository_id: uuid.UUID
    full: bool
    status: str = "pending"
    report: IndexReport | None = None
    error: str | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))


class BackgroundScanner:
    """Runs repository scans on background threads."""

    def __init__(self) -> None:
        self.log = get_logger("workers.scanner")
        self._jobs: dict[str, ScanJob] = {}
        self._container = None

    @property
    def container(self):
        if self._container is None:
            self._container = get_container()
        return self._container

    def submit(self, repository_id: uuid.UUID, *, full: bool = False) -> ScanJob:
        """Queue a scan for immediate background execution."""
        job = ScanJob(
            id=f"{datetime.now(UTC).timestamp():.0f}-{repository_id}",
            repository_id=repository_id,
            full=full,
        )
        self._jobs[job.id] = job
        thread = Thread(target=self._run, args=(job,), daemon=True)
        thread.start()
        return job

    def get(self, job_id: str) -> ScanJob | None:
        return self._jobs.get(job_id)

    def list(self) -> list[ScanJob]:
        return list(self._jobs.values())

    # ------------------------------------------------------------ internals

    def _run(self, job: ScanJob) -> None:
        job.status = "running"
        try:
            with SessionLocal() as session:
                repository = session.get(Repository, job.repository_id)
                if repository is None:
                    job.error = "Repository not found"
                    job.status = "failed"
                    return
                job.report = self.container.indexer.index(session, repository, full=job.full)
                session.commit()
            job.status = "completed"
            self.log.info("background_scan_completed", job_id=job.id)
        except Exception as exc:  # pragma: no cover - defensive
            job.status = "failed"
            job.error = str(exc)
            self.log.exception("background_scan_failed", job_id=job.id)
