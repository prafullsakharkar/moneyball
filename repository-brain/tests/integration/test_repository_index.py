"""Integration tests for the repository index (persistent registration) endpoint."""

from __future__ import annotations

import importlib.util
import uuid
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client(tmp_repo_dir, monkeypatch):
    from repository_brain.core.database import engine
    from repository_brain.models.base import Base

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    from repository_brain.main import create_app

    app = create_app()
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def app_session(client):
    from repository_brain.core.database import engine
    from sqlalchemy.orm import Session as OrmSession

    with OrmSession(bind=engine) as session:
        yield session


def _index(client, path: str):
    return client.post("/api/v1/repositories/index", json={"path": str(path)})


class TestRepositoryIndexAPI:
    def test_index_registers_repository(self, client, tmp_repo_dir):
        r = _index(client, tmp_repo_dir)
        assert r.status_code == 201
        body = r.json()
        assert uuid.UUID(body["id"])
        assert body["name"] == "sample"
        assert body["status"] == "registered"
        assert body["root_path"] == str(tmp_repo_dir.resolve())
        assert "Python" in body["language_set"]

    def test_index_repeat_is_idempotent(self, client, tmp_repo_dir):
        first = _index(client, tmp_repo_dir)
        second = _index(client, tmp_repo_dir)
        assert first.status_code == 201
        assert second.status_code == 200
        assert second.json()["id"] == first.json()["id"]

        listing = client.get("/repositories")
        assert listing.status_code == 200
        assert len(listing.json()) == 1

    def test_index_nonexistent_path(self, client, tmp_path):
        r = _index(client, tmp_path / "does-not-exist")
        assert r.status_code == 422

    def test_index_path_is_file(self, client, tmp_path):
        target = tmp_path / "plain.txt"
        target.write_text("not a directory")
        r = _index(client, target)
        assert r.status_code == 422
        assert "Not a directory" in r.json()["detail"]

    def test_index_unreadable_path_rejected(self, client, tmp_repo_dir, monkeypatch):
        monkeypatch.setattr("os.access", lambda *_args, **_kwargs: False)
        r = _index(client, tmp_repo_dir)
        assert r.status_code == 422
        assert "Not readable" in r.json()["detail"]

    def test_index_empty_payload(self, client):
        r = client.post("/api/v1/repositories/index", json={})
        assert r.status_code == 422

    def test_index_persists_to_database(self, client, tmp_repo_dir, app_session):
        _index(client, tmp_repo_dir)
        from repository_brain.models.repository import Repository
        from sqlalchemy import select

        repo = app_session.scalar(
            select(Repository).where(Repository.path == str(tmp_repo_dir.resolve()))
        )
        assert repo is not None
        assert repo.root_path == str(tmp_repo_dir.resolve())
        assert repo.status == "registered"
        assert set(repo.language_set) == {"Python", "JSON", "Markdown"}
        assert repo.framework_set == ["Express"]

    def test_index_metadata_fields(self, client, tmp_repo_dir):
        body = _index(client, tmp_repo_dir).json()
        assert set(body) == {
            "id",
            "name",
            "description",
            "root_path",
            "default_branch",
            "status",
            "language_set",
            "framework_set",
            "created_at",
            "updated_at",
        }

    def test_index_detects_default_branch_and_framework(self, client, tmp_path):
        repo = tmp_path / "myrepo"
        repo.mkdir()
        (repo / ".git").mkdir()
        (repo / ".git" / "HEAD").write_text("ref: refs/heads/main\n")
        (repo / "package.json").write_text(
            '{"name": "myrepo", "dependencies": {"express": "^4.19.0"}}'
        )

        r = _index(client, repo)
        assert r.status_code == 201
        body = r.json()
        assert body["name"] == "myrepo"
        assert body["default_branch"] == "main"
        assert body["framework_set"] == ["Express"]

    def test_index_language_detection_is_bounded(self, client, tmp_path, monkeypatch):
        """A low detection limit must not cause unbounded synchronous walking."""
        from repository_brain.core.config import get_settings

        repo = tmp_path / "big"
        (repo / "src").mkdir(parents=True)
        for i in range(5):
            (repo / "src" / f"mod{i}.py").write_text("x = 1\n")

        monkeypatch.setattr(get_settings(), "index_detect_file_limit", 1)
        r = _index(client, repo)
        assert r.status_code == 201
        assert r.json()["language_set"] == ["Python"]

    def test_migration_emits_pg_enum_alignment(self, monkeypatch, capsys):
        """The migration's PostgreSQL branch must keep 'registered' a valid enum value.

        Verified via offline SQL emission so the enum-alignment behaviour is
        covered without requiring a live PostgreSQL server.
        """
        monkeypatch.setenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db")
        from alembic import command
        from alembic.config import Config

        cfg = Config()
        cfg.set_main_option("script_location", "migrations")
        command.upgrade(cfg, "head", sql=True)
        sql = capsys.readouterr().out
        assert "ADD COLUMN root_path" in sql
        assert "ALTER TYPE repositorystatus ADD VALUE IF NOT EXISTS 'registered'" in sql
        assert "ALTER TYPE repositorystatus ADD VALUE IF NOT EXISTS 'failed'" in sql

    def test_registered_status_enum_contract(self):
        """Regression guard: 'registered' must stay a valid status value.

        A previous schema state had a PostgreSQL ``repositorystatus`` enum that
        rejected 'registered'. The model default, application enum and the
        migration's enum-alignment list must all keep it valid.
        """
        from repository_brain.models.repository import Repository, RepositoryStatus

        assert RepositoryStatus.REGISTERED.value == "registered"
        assert Repository.status.default.arg == "registered"

        spec = importlib.util.spec_from_file_location(
            "migration_repo_index",
            Path("migrations/versions/6ed2a6cb56a8_repository_index_metadata_and_status_.py"),
        )
        migration = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(migration)
        assert "registered" in migration._REPOSITORY_STATUS_VALUES
        assert {"scanning", "scanned", "failed"} <= set(migration._REPOSITORY_STATUS_VALUES)
