"""Integration tests for the indexer and its derived engines."""

from __future__ import annotations

from repository_brain.models.architecture import Architecture
from repository_brain.models.dependency import Dependency
from repository_brain.models.memory import RepositoryMemory
from repository_brain.models.module import Module
from repository_brain.models.symbol import Symbol
from sqlalchemy import select


class TestIndexer:
    def test_full_index_populates_all_engines(self, indexed_sample, db_session):
        repo, report = indexed_sample
        assert report.files_added == 4
        assert report.symbols_indexed >= 8
        assert report.dependencies_indexed >= 1
        assert report.modules_detected >= 1

        assert (
            db_session.scalar(select(Symbol).where(Symbol.repository_id == repo.id).limit(1))
            is not None
        )
        assert (
            db_session.scalar(
                select(Dependency).where(Dependency.repository_id == repo.id).limit(1)
            )
            is not None
        )
        arch = db_session.get(Architecture, repo.id)
        assert arch is not None
        assert "languages" in arch.content
        assert "python" in arch.content["languages"]

    def test_incremental_scan_is_noop(self, indexed_sample, db_session, tmp_repo_dir):
        from repository_brain.indexer.service import Indexer

        repo, _ = indexed_sample
        report = Indexer().index(db_session, repo)
        assert report.files_scanned == 4
        assert report.files_unchanged == 4
        assert report.files_added == 0
        assert report.files_modified == 0
        assert report.symbols_indexed == 0

    def test_modified_file_reparsed(self, indexed_sample, db_session, tmp_repo_dir):
        from repository_brain.indexer.service import Indexer

        repo, _ = indexed_sample
        forecast = tmp_repo_dir / "src" / "weather" / "forecast.py"
        forecast.write_text(forecast.read_text() + "\n\nEXTRA = 1\n")
        report = Indexer().index(db_session, repo)
        assert report.files_modified == 1
        assert report.symbols_indexed >= 1

    def test_snapshot_written(self, indexed_sample, tmp_repo_dir):
        brain = tmp_repo_dir / ".brain"
        assert brain.is_dir()
        files = {p.name for p in brain.glob("*.json")}
        assert "repository.json" in files
        assert "symbols.json" in files
        assert "files.json" in files


class TestSymbols:
    def test_symbol_hierarchy(self, indexed_sample, db_session):
        repo, _ = indexed_sample
        symbols = list(db_session.scalars(select(Symbol).where(Symbol.repository_id == repo.id)))
        classes = [s for s in symbols if s.kind == "class"]
        methods = [s for s in symbols if s.kind == "method"]
        assert any(s.name == "ForecastService" for s in classes)
        assert any(m.name == "get_today" and m.parent_id for m in methods)


class TestModules:
    def test_modules_detected(self, indexed_sample, db_session):
        repo, _ = indexed_sample
        modules = list(db_session.scalars(select(Module).where(Module.repository_id == repo.id)))
        assert len(modules) >= 1
        assert any(m.name in ("src", "core") for m in modules)


class TestMemory:
    def test_memory_build_and_refresh(self, indexed_sample, db_session):
        from repository_brain.memory.service import MemoryService

        repo, _ = indexed_sample
        svc = MemoryService()
        memory = svc.build(db_session, repo.id)
        db_session.commit()
        first_version = memory.version

        assert memory.summary
        assert "python" in memory.statistics["languages"]
        assert memory.module_summaries
        assert first_version >= 1

        again = svc.build(db_session, repo.id)
        assert again.version == first_version + 1

    def test_memory_get_or_build_persists(self, indexed_sample, db_session):
        from repository_brain.memory.service import MemoryService

        repo, _ = indexed_sample
        svc = MemoryService()
        memory = svc.get_or_build(db_session, repo.id)
        assert db_session.get(RepositoryMemory, repo.id) is not None
        assert memory.conventions is not None
