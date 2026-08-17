"""Integration tests for the repository filesystem scanner and scan-only indexing."""

from __future__ import annotations

from pathlib import Path

import pytest
from repository_brain.models.file import FileEntry
from repository_brain.models.repository import RepositoryStatus
from repository_brain.scanner.scanner import FileScanner
from sqlalchemy import func, select


def _build_test_repo(root: Path) -> Path:
    """Create the canonical sample repository described in the task spec."""
    repo = root / "test-repo"
    (repo / "src").mkdir(parents=True)
    (repo / "tests").mkdir(parents=True)
    (repo / "node_modules").mkdir(parents=True)
    (repo / ".git").mkdir(parents=True)
    (repo / ".gitignore").write_text("*.log\nbuild/\n")
    (repo / "README.md").write_text("# Test repository\n")
    (repo / "pyproject.toml").write_text("[project]\nname = 'test-repo'\n")
    (repo / "src" / "main.py").write_text("def main() -> None:\n    pass\n")
    (repo / "src" / "service.py").write_text("class Service:\n    pass\n")
    (repo / "tests" / "test_main.py").write_text("def test_main() -> None:\n    pass\n")
    (repo / "node_modules" / "ignored.js").write_text("var ignored = 1;\n")
    (repo / ".git" / "HEAD").write_text("ref: refs/heads/main\n")
    return repo


class TestRepositoryScanner:
    def test_empty_repository(self, tmp_path: Path):
        repo = tmp_path / "empty"
        repo.mkdir()
        result = FileScanner().scan(repo)
        assert result.total_files == 0
        assert result.diff.added == {}
        assert result.errors == []

    def test_normal_repository_discovers_files(self, tmp_path: Path):
        repo = _build_test_repo(tmp_path)
        result = FileScanner().scan(repo)
        discovered = set(result.all_metadata)
        assert "README.md" in discovered
        assert "pyproject.toml" in discovered
        assert "src/main.py" in discovered
        assert "src/service.py" in discovered
        assert "tests/test_main.py" in discovered
        assert ".gitignore" in discovered

    def test_nested_directories_relative_paths_and_metadata(self, tmp_path: Path):
        repo = _build_test_repo(tmp_path)
        result = FileScanner().scan(repo)
        assert result.total_files == 6

        meta = result.all_metadata["src/main.py"]
        assert meta.path == "src/main.py"
        assert meta.extension == ".py"
        assert meta.language == "python"
        assert meta.size > 0
        assert meta.mtime > 0
        assert len(meta.sha256) == 64

        assert result.all_metadata["README.md"].extension == ".md"
        assert result.all_metadata["pyproject.toml"].extension == ".toml"

    def test_ignored_directories_skipped(self, tmp_path: Path):
        repo = tmp_path / "repo"
        (repo / "src").mkdir(parents=True)
        (repo / "src" / "main.py").write_text("pass\n")
        for directory in (
            ".git",
            "node_modules",
            "__pycache__",
            ".pytest_cache",
            ".venv",
            "venv",
            "dist",
            "build",
            "target",
            "coverage",
            ".cache",
        ):
            (repo / directory).mkdir(parents=True, exist_ok=True)
            (repo / directory / "inner.txt").write_text("ignored\n")

        result = FileScanner().scan(repo)
        assert result.total_files == 1
        assert set(result.all_metadata) == {"src/main.py"}

    def test_gitignore_respected(self, tmp_path: Path):
        repo = tmp_path / "repo"
        (repo / "src").mkdir(parents=True)
        (repo / ".gitignore").write_text("*.tmp\nbuild/\n!keep.tmp\n")
        (repo / "src" / "app.py").write_text("pass\n")
        (repo / "src" / "debug.tmp").write_text("tmp\n")
        (repo / "keep.tmp").write_text("keep\n")
        (repo / "build").mkdir()
        (repo / "build" / "out.js").write_text("x = 1\n")

        result = FileScanner().scan(repo)
        discovered = set(result.all_metadata)
        assert "src/app.py" in discovered
        assert "src/debug.tmp" not in discovered
        assert "build/out.js" not in discovered
        assert "keep.tmp" in discovered

    def test_large_ignored_directory_pruned(self, tmp_path: Path):
        repo = tmp_path / "repo"
        (repo / "src").mkdir(parents=True)
        (repo / "node_modules").mkdir(parents=True)
        (repo / "src" / "app.py").write_text("pass\n")
        for i in range(200):
            pkg = repo / "node_modules" / f"pkg{i}"
            pkg.mkdir(exist_ok=True)
            (pkg / "index.js").write_text("x = 1\n")

        result = FileScanner().scan(repo)
        assert result.total_files == 1
        assert set(result.all_metadata) == {"src/app.py"}
        assert all(not p.startswith("node_modules/") for p in result.all_metadata)

    def test_repeated_indexing_is_idempotent(self, db_session, tmp_path: Path):
        from repository_brain.indexer.service import Indexer
        from repository_brain.repository.service import RepositoryService

        repo = _build_test_repo(tmp_path)
        svc = RepositoryService()
        registered = svc.create(db_session, name="scan-test", path=str(repo))
        db_session.commit()

        indexer = Indexer()
        first = indexer.scan_only(db_session, registered)
        db_session.commit()
        assert first.files_added == 6
        assert first.files_scanned == 6

        second = indexer.scan_only(db_session, registered)
        db_session.commit()
        assert second.files_added == 0
        assert second.files_modified == 0
        assert second.files_unchanged == 6

        count = db_session.scalar(
            select(func.count())
            .select_from(FileEntry)
            .where(FileEntry.repository_id == registered.id)
        )
        assert count == 6

    def test_file_permission_errors_reported(self, tmp_path: Path, monkeypatch):
        repo = tmp_path / "repo"
        (repo / "src").mkdir(parents=True)
        (repo / "src" / "a.py").write_text("pass\n")
        (repo / "locked").mkdir()
        (repo / "locked" / "secret.txt").write_text("hidden\n")
        (repo / "top.py").write_text("pass\n")

        real_iterdir = Path.iterdir

        def deny(self):
            if self.name == "locked":
                raise PermissionError("Permission denied: locked")
            yield from real_iterdir(self)

        monkeypatch.setattr(Path, "iterdir", deny)
        result = FileScanner().scan(repo)
        assert set(result.all_metadata) == {"src/a.py", "top.py"}
        assert any(error.path == "locked" for error in result.errors)
        assert any("Permission denied" in error.error for error in result.errors)

    def test_missing_repository_raises(self, tmp_path: Path):
        with pytest.raises(FileNotFoundError):
            FileScanner().scan(tmp_path / "does-not-exist")

    def test_missing_repository_service_marks_failed(self, tmp_path: Path, db_session):
        from repository_brain.indexer.service import Indexer
        from repository_brain.repository.service import RepositoryService

        repo = tmp_path / "present"
        repo.mkdir()
        svc = RepositoryService()
        registered = svc.create(db_session, name="gone", path=str(repo))
        db_session.commit()
        registered.path = str(tmp_path / "definitely-missing")

        with pytest.raises(FileNotFoundError):
            Indexer().scan_only(db_session, registered)
        assert registered.status == RepositoryStatus.FAILED.value

    def test_scanner_survives_single_file_stat_failure(self, tmp_path: Path, monkeypatch):
        repo = tmp_path / "repo"
        (repo / "src").mkdir(parents=True)
        (repo / "src" / "ok.py").write_text("pass\n")
        (repo / "src" / "broken.py").write_text("pass\n")

        real_stat = Path.stat

        def bad_stat(self):
            if self.name == "broken.py":
                raise OSError("simulated stat failure")
            return real_stat(self)

        monkeypatch.setattr(Path, "stat", bad_stat)
        result = FileScanner().scan(repo)
        assert "src/ok.py" in result.all_metadata
        assert "src/broken.py" not in result.all_metadata
        assert result.errors
        assert result.errors[0].path == "src/broken.py"
