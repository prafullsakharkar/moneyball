"""The indexer: orchestration of the full indexing pipeline."""

from __future__ import annotations

import contextlib
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path

import structlog
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from repository_brain.architecture.service import ArchitectureService
from repository_brain.core.config import get_settings
from repository_brain.core.logging import get_logger
from repository_brain.core.request_id import generate_request_id
from repository_brain.graph.engine import DependencyEngine
from repository_brain.indexer.snapshot import SnapshotService
from repository_brain.memory.service import MemoryService
from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.repository import Repository, RepositoryStatus
from repository_brain.models.symbol import Symbol
from repository_brain.modules.service import ModuleService
from repository_brain.parser.parser import ParserRegistry
from repository_brain.scanner.filesystem import read_text_safely
from repository_brain.scanner.ignore import is_generated_file
from repository_brain.scanner.scanner import FileScanner, ScanDiff
from repository_brain.symbols.service import SymbolService


@dataclass(slots=True)
class IndexReport:
    """Summary counters produced by an indexing run."""

    repository_id: str = ""
    operation: str = "scan"
    status: str = "completed"
    files_scanned: int = 0
    files_added: int = 0
    files_modified: int = 0
    files_deleted: int = 0
    files_unchanged: int = 0
    symbols_indexed: int = 0
    dependencies_indexed: int = 0
    modules_detected: int = 0
    started_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    finished_at: datetime | None = None

    @property
    def duration_seconds(self) -> float:
        end = self.finished_at or datetime.now(UTC)
        return max(0.0, (end - self.started_at).total_seconds())


class Indexer:
    """Runs the full or incremental indexing pipeline for a repository."""

    def __init__(
        self,
        *,
        symbol_service: SymbolService | None = None,
        dependency_engine: DependencyEngine | None = None,
        module_service: ModuleService | None = None,
        architecture_service: ArchitectureService | None = None,
        memory_service: MemoryService | None = None,
        snapshot_service: SnapshotService | None = None,
        parser_registry: ParserRegistry | None = None,
    ) -> None:
        self.settings = get_settings()
        self.log = get_logger("indexer")
        self.symbol_service = symbol_service or SymbolService()
        self.dependency_engine = dependency_engine or DependencyEngine()
        self.module_service = module_service or ModuleService()
        self.architecture_service = architecture_service or ArchitectureService()
        self.memory_service = memory_service or MemoryService()
        self.snapshot_service = snapshot_service or SnapshotService(self.settings.storage_dir)
        self.parser = (parser_registry or ParserRegistry()).get()

    # ------------------------------------------------------------ entrypoint

    def index(
        self,
        session: Session,
        repository: Repository,
        *,
        full: bool = False,
    ) -> IndexReport:
        """Scan, parse and re-index a repository.

        Incremental by default: only files whose content changed are re-parsed.
        Pass ``full=True`` to force re-processing of every file.

        The run is tracked with structured logs and transitions the repository
        through ``scanning`` -> ``scanned`` (or ``failed``). A failure always
        persists the ``failed`` state so the repository is never left stuck in
        ``scanning``.
        """
        report = IndexReport(
            repository_id=str(repository.id),
            operation="reindex" if full else "scan",
        )
        started = time.monotonic()
        request_id = (
            structlog.contextvars.get_contextvars().get("request_id") or generate_request_id()
        )
        languages_detected = list(repository.language_set or [])
        frameworks_detected = list(repository.framework_set or [])

        with structlog.contextvars.bound_contextvars(
            request_id=request_id,
            repository_id=str(repository.id),
            repository_path=repository.path,
            repository_name=repository.name,
        ):
            self.log.info(
                "index_started",
                operation=report.operation,
                full=full,
            )
            repository.status = RepositoryStatus.SCANNING.value
            session.flush()

            try:
                previous_state = None if full else self._previous_state(session, repository.id)
                scanner = FileScanner(previous_state=previous_state)
                scan_result = scanner.scan(repository.path)
                diff = scan_result.diff

                report.files_scanned = scan_result.total_files
                report.files_added = len(diff.added)
                report.files_modified = len(diff.modified)
                report.files_deleted = len(diff.deleted)
                report.files_unchanged = len(diff.unchanged)

                changed_entries = self._sync_files(session, repository, diff)

                if changed_entries:
                    parsed_by_path = self._parse_files(repository, changed_entries)
                    changed_with_parsed = [
                        (entry, parsed_by_path[entry.path]) for entry in changed_entries
                    ]

                    for entry, parsed in changed_with_parsed:
                        if parsed.errors or entry.extra.get("parse_errors"):
                            extra = dict(entry.extra or {})
                            if parsed.errors:
                                extra["parse_errors"] = list(parsed.errors)
                            else:
                                extra.pop("parse_errors", None)
                            entry.extra = extra
                        try:
                            with session.begin_nested():
                                count = self.symbol_service.replace_file_symbols(
                                    session, repository.id, entry, parsed
                                )
                            report.symbols_indexed += count
                        except Exception as exc:
                            self.log.warning(
                                "symbol_index_file_failed",
                                path=entry.path,
                                error_type=type(exc).__name__,
                                error_message=str(exc),
                            )

                    dep_result = self.dependency_engine.build_for_repo(
                        session,
                        repository.id,
                        changed_with_parsed,
                        aliases=repository.extra.get("aliases"),
                    )
                    report.dependencies_indexed = dep_result.edges

                if diff.has_changes or full or report.symbols_indexed:
                    manifest_result = self.dependency_engine.build_manifest_dependencies(
                        session, repository.id, repository.path
                    )
                    report.dependencies_indexed += manifest_result.edges
                    module_result = self.module_service.rebuild(session, repository.id)
                    report.modules_detected = module_result.modules
                    self.architecture_service.build(
                        session, repository.id, root_path=repository.path
                    )
                    self.memory_service.get_or_build(session, repository.id)

                repository.status = RepositoryStatus.SCANNED.value
                repository.last_scanned_at = datetime.now(UTC)
                session.flush()

                try:
                    self.snapshot_service.save(session, repository)
                except OSError as exc:
                    self.log.warning("snapshot_save_failed", error=str(exc))
            except Exception as exc:
                report.status = "failed"
                self._mark_failed(session, repository)
                self.log.error(
                    "index_failed",
                    status=report.status,
                    error_type=type(exc).__name__,
                    error_message=str(exc),
                    files_discovered=report.files_scanned,
                    files_indexed=report.files_added + report.files_modified,
                    languages_detected=languages_detected,
                    frameworks_detected=frameworks_detected,
                    duration_ms=int((time.monotonic() - started) * 1000),
                )
                raise
            finally:
                report.finished_at = datetime.now(UTC)

            self.log.info(
                "index_completed",
                status=report.status,
                files_discovered=report.files_scanned,
                files_indexed=report.files_added + report.files_modified,
                files_deleted=report.files_deleted,
                files_unchanged=report.files_unchanged,
                symbols_indexed=report.symbols_indexed,
                dependencies_indexed=report.dependencies_indexed,
                modules_detected=report.modules_detected,
                languages_detected=languages_detected,
                frameworks_detected=frameworks_detected,
                duration_ms=int((time.monotonic() - started) * 1000),
            )

        return report

    def _mark_failed(self, session: Session, repository: Repository) -> None:
        """Persist ``failed`` status, recovering a tainted session if needed.

        Guarantees the repository is never left in ``scanning``. When the
        originating exception also broke the session (e.g. a database error),
        the session is rolled back and the status is re-applied in a fresh
        flush so callers still observe the terminal ``failed`` state.
        """
        try:
            repository.status = RepositoryStatus.FAILED.value
            session.flush()
            return
        except Exception:
            with contextlib.suppress(Exception):
                session.rollback()

        try:
            persisted = session.get(Repository, repository.id)
        except Exception:
            persisted = None
        target = persisted if persisted is not None else repository
        if persisted is None:
            session.add(target)

        target.status = RepositoryStatus.FAILED.value
        try:
            session.flush()
        except Exception as exc:
            self.log.warning(
                "index_failed_status_persist_failed",
                error_type=type(exc).__name__,
                error_message=str(exc),
            )

    # ----------------------------------------------------- scan-only pipeline

    def scan_only(self, session: Session, repository: Repository) -> IndexReport:
        """Scan a repository and persist per-file metadata only.

        Discovers files and syncs the ``files`` table without running symbol
        extraction, dependency, module or memory engines. Deterministic: repeated
        scans converge to the same set of rows instead of creating duplicate file
        records.
        """
        report = IndexReport(repository_id=str(repository.id), operation="scan")
        started = time.monotonic()
        request_id = (
            structlog.contextvars.get_contextvars().get("request_id") or generate_request_id()
        )

        with structlog.contextvars.bound_contextvars(
            request_id=request_id,
            repository_id=str(repository.id),
            repository_path=repository.path,
            repository_name=repository.name,
        ):
            self.log.info("scan_only_started")
            repository.status = RepositoryStatus.SCANNING.value
            session.flush()
            try:
                previous_state = self._previous_state(session, repository.id)
                result = FileScanner(previous_state=previous_state).scan(repository.path)
                diff = result.diff

                report.files_scanned = result.total_files
                report.files_added = len(diff.added)
                report.files_modified = len(diff.modified)
                report.files_deleted = len(diff.deleted)
                report.files_unchanged = len(diff.unchanged)

                self._sync_files(session, repository, diff)

                repository.status = RepositoryStatus.SCANNED.value
                repository.last_scanned_at = datetime.now(UTC)
                session.flush()
            except Exception as exc:
                report.status = "failed"
                self._mark_failed(session, repository)
                self.log.error(
                    "scan_only_failed",
                    status=report.status,
                    error_type=type(exc).__name__,
                    error_message=str(exc),
                    duration_ms=int((time.monotonic() - started) * 1000),
                )
                raise
            finally:
                report.finished_at = datetime.now(UTC)

            self.log.info(
                "scan_only_completed",
                status=report.status,
                files_discovered=report.files_scanned,
                files_indexed=report.files_added + report.files_modified,
                duration_ms=int((time.monotonic() - started) * 1000),
            )

        return report

    # ---------------------------------------------------------- file sync

    def _previous_state(
        self, session: Session, repository_id: uuid.UUID
    ) -> dict[str, tuple[str, float, int]]:
        rows = session.execute(
            select(FileEntry.path, FileEntry.sha256, FileEntry.mtime, FileEntry.size).where(
                FileEntry.repository_id == repository_id
            )
        ).all()
        return {path: (sha256, mtime, size) for path, sha256, mtime, size in rows}

    def _sync_files(
        self,
        session: Session,
        repository: Repository,
        diff: ScanDiff,
    ) -> list[FileEntry]:
        """Update the files table to match the scan result.

        Returns the list of FileEntry rows that need (re)parsing.
        """
        existing = {
            f.path: f
            for f in session.scalars(
                select(FileEntry).where(FileEntry.repository_id == repository.id)
            )
        }

        changed: list[FileEntry] = []

        for path, metadata in {**diff.added, **diff.modified}.items():
            entry = existing.get(path)
            if entry is None:
                entry = FileEntry(
                    repository_id=repository.id,
                    path=path,
                    language=metadata.language,
                    extension=metadata.extension,
                    size=metadata.size,
                    sha256=metadata.sha256,
                    mtime=metadata.mtime,
                    is_generated=is_generated_file(path),
                    is_binary=metadata.is_binary,
                    encoding=metadata.encoding,
                    line_count=metadata.line_count,
                    status="active",
                )
                session.add(entry)
            else:
                entry.language = metadata.language
                entry.extension = metadata.extension
                entry.size = metadata.size
                entry.sha256 = metadata.sha256
                entry.mtime = metadata.mtime
                entry.is_generated = is_generated_file(path)
                entry.is_binary = metadata.is_binary
                entry.encoding = metadata.encoding
                entry.line_count = metadata.line_count
                entry.status = "active"
            changed.append(entry)

        for path in diff.deleted:
            entry = existing.get(path)
            if entry is not None:
                self._delete_file(session, entry)

        session.flush()
        return changed

    def _delete_file(self, session: Session, entry: FileEntry) -> None:
        session.execute(delete(Symbol).where(Symbol.file_id == entry.id))
        session.execute(
            delete(Dependency).where(
                (Dependency.source_file_id == entry.id) | (Dependency.target_file_id == entry.id)
            )
        )
        session.delete(entry)

    # ------------------------------------------------------------ parsing

    def _parse_files(self, repository: Repository, entries: list[FileEntry]) -> dict[str, object]:
        from repository_brain.parser.result import ParsedFile

        workers = max(1, self.settings.indexer_workers)
        results: dict[str, ParsedFile] = {}

        def parse_one(entry: FileEntry) -> tuple[str, ParsedFile]:
            if entry.is_binary or not entry.language:
                return entry.path, ParsedFile(path=entry.path, language=entry.language or "")
            try:
                content = read_text_safely(Path(repository.path) / entry.path, entry.encoding)
            except OSError:
                return entry.path, ParsedFile(path=entry.path, language=entry.language or "")
            parsed = self.parser.parse(content, path=entry.path, language=entry.language)
            return entry.path, parsed

        if workers <= 1 or len(entries) <= 1:
            for entry in entries:
                path, parsed = parse_one(entry)
                results[path] = parsed
            return results

        with ThreadPoolExecutor(max_workers=workers) as pool:
            for path, parsed in pool.map(parse_one, entries):
                results[path] = parsed
        return results
