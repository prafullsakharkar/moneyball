"""Unit tests for the dependency resolver and dependency engine."""

from __future__ import annotations

from repository_brain.graph.resolver import PathResolver
from repository_brain.parser.result import ImportRef, ParsedFile, ParsedSymbol


class TestPathResolver:
    def test_python_absolute(self):
        resolver = PathResolver(
            {"src/api/client.py", "src/weather/forecast.py", "src/api/__init__.py"},
        )
        assert (
            resolver.resolve(
                "api.client", source_language="python", source_path="src/weather/forecast.py"
            )
            == "src/api/client.py"
        )
        assert (
            resolver.resolve(
                "weather.forecast", source_language="python", source_path="src/weather/forecast.py"
            )
            == "src/weather/forecast.py"
        )

    def test_python_relative(self):
        resolver = PathResolver({"src/weather/local.py", "src/weather/forecast.py"})
        assert (
            resolver.resolve(
                ".local", source_language="python", source_path="src/weather/forecast.py"
            )
            == "src/weather/local.py"
        )

    def test_ts_relative(self):
        resolver = PathResolver(
            {"src/components/Card.tsx", "src/components/index.ts"},
        )
        assert (
            resolver.resolve(
                "./Card", source_language="typescript", source_path="src/components/index.ts"
            )
            == "src/components/Card.tsx"
        )

    def test_unresolved_returns_none(self):
        resolver = PathResolver({"src/a.py"})
        assert (
            resolver.resolve("missing.module", source_language="python", source_path="src/a.py")
            is None
        )


def _symbol(name, kind="function", start_line=1, end_line=5):
    return ParsedSymbol(
        name=name,
        kind=kind,
        start_line=start_line,
        end_line=end_line,
        qualified_name=name,
    )


def _parsed(path, imports, symbols=None):
    return ParsedFile(path=path, language="python", imports=imports, symbols=symbols or [])


class TestDependencyEngine:
    def test_build_for_repo_resolves_internal_imports(self, db_session, tmp_repo_dir):
        from repository_brain.graph.engine import DependencyEngine
        from repository_brain.models.file import FileEntry
        from repository_brain.repository.service import RepositoryService

        repo = RepositoryService().create(db_session, name="sample", path=str(tmp_repo_dir))
        db_session.flush()
        entries = {}
        for rel, lang in [
            ("src/weather/forecast.py", "python"),
            ("src/api/client.py", "python"),
        ]:
            entry = FileEntry(
                repository_id=repo.id,
                path=rel,
                language=lang,
                size=0,
                sha256="0" * 64,
                mtime=0.0,
            )
            db_session.add(entry)
            entries[rel] = entry
        db_session.flush()

        parsed = [
            (
                entries["src/weather/forecast.py"],
                _parsed(
                    "src/weather/forecast.py",
                    [ImportRef(name="api.client", line=3)],
                    symbols=[_symbol("ForecastService", "class", 1, 20)],
                ),
            ),
            (
                entries["src/api/client.py"],
                _parsed("src/api/client.py", []),
            ),
        ]
        DependencyEngine().build_for_repo(
            db_session,
            repo.id,
            parsed,
        )
        db_session.flush()

        from repository_brain.models.dependency import Dependency
        from sqlalchemy import select

        deps = list(
            db_session.scalars(select(Dependency).where(Dependency.repository_id == repo.id))
        )
        assert len(deps) >= 1
        d = deps[0]
        assert d.name == "api.client"
        assert d.is_resolved is True
        assert d.target_file_id == entries["src/api/client.py"].id
