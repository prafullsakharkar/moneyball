"""Integration tests for indexing lifecycle, Git metadata, error handling, logging
and idempotency."""

from __future__ import annotations

import ast
import contextlib
import logging
import shutil
import subprocess
from pathlib import Path

import pytest
import structlog
from fastapi.testclient import TestClient
from repository_brain.indexer.service import Indexer
from repository_brain.models.file import FileEntry
from repository_brain.models.repository import Repository
from repository_brain.repository.service import RepositoryService
from repository_brain.scanner.scanner import FileScanner
from sqlalchemy import func, select


@pytest.fixture()
def client(tmp_path):
    from repository_brain.core.database import engine
    from repository_brain.models.base import Base

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    from repository_brain.main import create_app

    app = create_app()
    with TestClient(app) as c:
        yield c


def _git_repo(base: Path, name: str = "repo", branch: str = "main") -> Path:
    """Create a real (committed) git repository under ``base``."""
    import shutil as _shutil

    git = _shutil.which("git")
    if git is None:
        pytest.skip("git binary not available")
    repo = base / name
    repo.mkdir()
    subprocess.run([git, "init", "-b", branch], check=True, capture_output=True, cwd=str(repo))
    (repo / "app.py").write_text("def main() -> None:\n    pass\n")
    subprocess.run(
        [
            git,
            "-c",
            "user.name=Test",
            "-c",
            "user.email=test@local",
            "add",
            ".",
        ],
        check=True,
        capture_output=True,
        cwd=str(repo),
    )
    subprocess.run(
        [
            git,
            "-c",
            "user.name=Test",
            "-c",
            "user.email=test@local",
            "commit",
            "-m",
            "initial",
        ],
        check=True,
        capture_output=True,
        cwd=str(repo),
    )
    return repo


class TestGitMetadata:
    def test_git_repository_detected(self, client, tmp_path):
        repo = _git_repo(tmp_path)
        r = client.post("/api/v1/repositories/index", json={"path": str(repo)})
        assert r.status_code == 201
        body = r.json()
        assert body["default_branch"] == "main"
        assert body["root_path"] == str(repo.resolve())
        assert body["status"] == "registered"

    def test_git_repository_persists_vcs(self, db_session, tmp_path):
        repo = _git_repo(tmp_path)
        registered, created = RepositoryService().index_register(db_session, path=str(repo))
        assert created is True
        assert registered.vcs == "git"
        assert registered.root_path == str(repo.resolve())
        assert registered.default_branch == "main"
        assert registered.status == "registered"

    def test_non_git_directory_indexed(self, db_session, tmp_path):
        repo = tmp_path / "plain"
        repo.mkdir()
        (repo / "main.py").write_text("x = 1\n")
        registered, created = RepositoryService().index_register(db_session, path=str(repo))
        assert created is True
        assert registered.vcs is None
        assert registered.root_path == str(repo.resolve())
        assert registered.default_branch is None

    def test_git_unavailable_still_detects_filesystem(self, db_session, tmp_path, monkeypatch):
        repo = _git_repo(tmp_path, branch="develop")
        monkeypatch.setattr("shutil.which", lambda _name: None)
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        assert registered.vcs == "git"
        assert registered.default_branch == "develop"
        assert registered.root_path == str(repo.resolve())

    def test_git_command_failure_degrades(self, db_session, tmp_path, monkeypatch):
        repo = _git_repo(tmp_path, branch="develop")

        def _boom(*_args, **_kwargs):
            raise OSError("git binary failed")

        monkeypatch.setattr("repository_brain.git.detector.subprocess.run", _boom)
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        assert registered.vcs == "git"
        assert registered.default_branch == "develop"
        assert registered.root_path == str(repo.resolve())

    def test_git_nonzero_exit_degrades(self, db_session, tmp_path, monkeypatch):
        repo = _git_repo(tmp_path, branch="develop")

        class _FakeCompleted:
            returncode = 128
            stdout = ""
            stderr = "fatal"

        monkeypatch.setattr(
            "repository_brain.git.detector.subprocess.run",
            lambda *_args, **_kwargs: _FakeCompleted(),
        )
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        assert registered.vcs == "git"
        assert registered.default_branch == "develop"
        assert registered.root_path == str(repo.resolve())


class TestIndexingLifecycle:
    def test_indexing_success_transitions_to_scanned(self, db_session, sample_repository):
        report = Indexer().index(db_session, sample_repository)
        db_session.commit()
        assert report.status == "completed"
        reloaded = db_session.get(Repository, sample_repository.id)
        assert reloaded.status == "scanned"
        assert reloaded.last_scanned_at is not None

    def test_indexing_failure_persists_failed(self, db_session, sample_repository, monkeypatch):
        def exploding_scan(self, root):
            raise RuntimeError("scan exploded")

        monkeypatch.setattr(FileScanner, "scan", exploding_scan)
        with pytest.raises(RuntimeError, match="scan exploded"):
            Indexer().index(db_session, sample_repository)
        db_session.commit()
        reloaded = db_session.get(Repository, sample_repository.id)
        assert reloaded.status == "failed"

    def test_indexing_recovery_after_failure(self, db_session, sample_repository, monkeypatch):
        def exploding_scan(self, root):
            raise RuntimeError("scan exploded")

        monkeypatch.setattr(FileScanner, "scan", exploding_scan)
        with pytest.raises(RuntimeError):
            Indexer().index(db_session, sample_repository)
        db_session.commit()
        assert db_session.get(Repository, sample_repository.id).status == "failed"

        monkeypatch.undo()
        report = Indexer().index(db_session, sample_repository)
        db_session.commit()
        assert report.status == "completed"
        reloaded = db_session.get(Repository, sample_repository.id)
        assert reloaded.status == "scanned"
        assert report.files_scanned >= 1

    def test_filesystem_failure_persists_failed(self, db_session, sample_repository, tmp_repo_dir):
        shutil.rmtree(sample_repository.path)
        with pytest.raises(FileNotFoundError):
            Indexer().index(db_session, sample_repository)
        db_session.commit()
        reloaded = db_session.get(Repository, sample_repository.id)
        assert reloaded.status == "failed"

    def test_database_failure_persists_failed(self, db_session, sample_repository):
        db_session.commit()
        repo = db_session.get(Repository, sample_repository.id)

        real_flush = db_session.flush

        def failing_flush():
            if repo.status == "scanned":
                raise Exception("simulated database failure")
            real_flush()

        db_session.flush = failing_flush  # type: ignore[method-assign]
        try:
            with pytest.raises(Exception, match="simulated database failure"):
                Indexer().index(db_session, repo)
        finally:
            db_session.flush = real_flush  # type: ignore[method-assign]
        db_session.commit()
        reloaded = db_session.get(Repository, sample_repository.id)
        assert reloaded.status == "failed"


class TestIdempotency:
    def test_repeated_indexing_no_duplicate_file_records(self, db_session, sample_repository):
        repo = sample_repository
        first = Indexer().index(db_session, repo)
        db_session.commit()
        first_count = db_session.scalar(
            select(func.count()).select_from(FileEntry).where(FileEntry.repository_id == repo.id)
        )
        assert first.files_added == first_count

        second = Indexer().index(db_session, repo)
        db_session.commit()
        second_count = db_session.scalar(
            select(func.count()).select_from(FileEntry).where(FileEntry.repository_id == repo.id)
        )
        assert second.files_unchanged == second_count
        assert second_count == first_count

    def test_duplicate_registration_is_idempotent(self, db_session, tmp_repo_dir):
        service = RepositoryService()
        first, created_first = service.index_register(db_session, path=str(tmp_repo_dir))
        second, created_second = service.index_register(db_session, path=str(tmp_repo_dir))
        assert created_first is True
        assert created_second is False
        assert first.id == second.id

        total = db_session.scalar(select(func.count()).select_from(Repository))
        assert total == 1

    def test_duplicate_registration_api_returns_200(self, client, tmp_repo_dir):
        first = client.post("/api/v1/repositories/index", json={"path": str(tmp_repo_dir)})
        second = client.post("/api/v1/repositories/index", json={"path": str(tmp_repo_dir)})
        assert first.status_code == 201
        assert second.status_code == 200
        assert second.json()["id"] == first.json()["id"]


class TestIndexingLogging:
    def test_index_logs_structured_fields(self, db_session, sample_repository, caplog):
        captured: list[dict] = []
        handler = _CaptureHandler(captured)
        logger = logging.getLogger("indexer")
        logger.addHandler(handler)
        logger.setLevel(logging.DEBUG)
        logger.propagate = False
        try:
            structlog.contextvars.clear_contextvars()
            structlog.contextvars.bind_contextvars(request_id="rb_test_request")
            Indexer().index(db_session, sample_repository)
        finally:
            logger.removeHandler(handler)

        events = {entry.get("event"): entry for entry in captured}
        assert "index_started" in events
        assert "index_completed" in events

        completed = events["index_completed"]
        assert completed["request_id"] == "rb_test_request"
        assert completed["repository_id"] == str(sample_repository.id)
        assert completed["repository_path"] == sample_repository.path
        assert completed["status"] == "completed"
        assert completed["files_discovered"] > 0
        assert completed["files_indexed"] > 0
        assert isinstance(completed["languages_detected"], list)
        assert isinstance(completed["frameworks_detected"], list)
        assert completed["duration_ms"] >= 0

    def test_failure_log_includes_error_fields(self, db_session, sample_repository, monkeypatch):
        captured: list[dict] = []
        handler = _CaptureHandler(captured)
        logger = logging.getLogger("indexer")
        logger.addHandler(handler)
        logger.setLevel(logging.DEBUG)
        logger.propagate = False
        try:

            def exploding_scan(self, root):
                raise RuntimeError("scan exploded")

            monkeypatch.setattr(FileScanner, "scan", exploding_scan)
            structlog.contextvars.clear_contextvars()
            with pytest.raises(RuntimeError):
                Indexer().index(db_session, sample_repository)
        finally:
            logger.removeHandler(handler)

        failed = [e for e in captured if e.get("event") == "index_failed"]
        assert failed, "expected an index_failed log event"
        event = failed[0]
        assert event["status"] == "failed"
        assert event["error_type"] == "RuntimeError"
        assert event["error_message"] == "scan exploded"
        assert event["duration_ms"] >= 0

    def test_log_does_not_leak_sensitive_values(self, db_session, sample_repository):
        captured: list[dict] = []
        handler = _CaptureHandler(captured)
        logger = logging.getLogger("indexer")
        logger.addHandler(handler)
        logger.setLevel(logging.DEBUG)
        logger.propagate = False
        try:
            sample_repository.extra = {"api_key": "sk-super-secret", "password": "hunter2"}
            db_session.flush()
            structlog.contextvars.clear_contextvars()
            Indexer().index(db_session, sample_repository)
        finally:
            logger.removeHandler(handler)

        serialized = repr(captured)
        assert "sk-super-secret" not in serialized
        assert "hunter2" not in serialized


class _CaptureHandler(logging.Handler):
    def __init__(self, sink: list[dict]) -> None:
        super().__init__()
        self._sink = sink

    def emit(self, record: logging.LogRecord) -> None:
        with contextlib.suppress(ValueError, SyntaxError):
            self._sink.append(ast.literal_eval(record.getMessage()))
