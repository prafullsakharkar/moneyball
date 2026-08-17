"""Phase 3 Part 1: deterministic symbol extraction end-to-end tests.

Covers the fifteen required scenarios: functions, classes, methods, nested
classes, async functions, decorated functions, multiple files, multiple
symbols, empty source files, syntax-error files, unsupported languages,
re-indexing, parent/child relationships, line numbers and qualified names.
"""

from __future__ import annotations

from pathlib import Path

import pytest
from repository_brain.indexer.service import Indexer
from repository_brain.models.file import FileEntry
from repository_brain.models.symbol import Symbol
from repository_brain.parser.parser import ParsingService
from repository_brain.repository.service import RepositoryService
from sqlalchemy import func, select

SERVICE_SOURCE = '''"""User service module."""
from typing import Optional

import functools


class User:
    """A user account."""

    def __init__(self, name: str) -> None:
        self.name = name

    def greet(self) -> str:
        return f"Hi {self.name}"


class UserService:
    """Builds and queries users."""

    def __init__(self) -> None:
        self._users = []

    def create_user(self, name: str) -> User:
        user = User(name=name)
        self._users.append(user)
        return user

    async def list_users(self) -> list[User]:
        return list(self._users)


class Outer:
    class Inner:
        def nested_method(self) -> int:
            return 1


@functools.lru_cache
def cached_lookup(key: str) -> int:
    return len(key)


async def fetch(url: str) -> dict:
    return {}


def helper(x: int) -> int:
    return x * 2


VERSION = "1.0"
'''


def _write(repo: Path, relative: str, content: str) -> Path:
    path = repo / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
    return path


@pytest.fixture()
def symbol_repo(tmp_path: Path) -> Path:
    """A deterministic repository with several Python source files."""
    repo = tmp_path / "repo"
    _write(repo, "src/service.py", SERVICE_SOURCE)
    _write(repo, "src/utils.py", "def util(x):\n    return x\n\nclass Helper:\n    pass\n")
    _write(repo, "src/empty.py", "")
    _write(repo, "src/broken.py", "def broken(:\n    pass\n\nclass StillParses:\n    pass\n")
    _write(repo, "notes.xyz", "unsupported language content")
    return repo


@pytest.fixture()
def registered_symbol_repo(db_session, symbol_repo: Path):
    registered, _ = RepositoryService().index_register(db_session, path=str(symbol_repo))
    db_session.commit()
    return registered


def _symbols(db_session, repository_id) -> list[Symbol]:
    return list(
        db_session.scalars(
            select(Symbol)
            .where(Symbol.repository_id == repository_id)
            .order_by(Symbol.start_line, Symbol.name)
        )
    )


class TestSymbolKinds:
    def test_python_functions(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        names = {s.name: s.kind for s in _symbols(db_session, registered_symbol_repo.id)}
        assert names["helper"] == "function"
        assert names["fetch"] == "function"
        assert names["cached_lookup"] == "function"

    def test_python_classes(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        classes = [
            s.name for s in _symbols(db_session, registered_symbol_repo.id) if s.kind == "class"
        ]
        assert "User" in classes
        assert "UserService" in classes
        assert "Outer" in classes
        assert "Helper" in classes

    def test_python_methods(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        methods = [
            s.name for s in _symbols(db_session, registered_symbol_repo.id) if s.kind == "method"
        ]
        assert "create_user" in methods
        assert "greet" in methods
        assert "list_users" in methods
        assert "nested_method" in methods

    def test_module_level_variable(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        names = {s.name: s.kind for s in _symbols(db_session, registered_symbol_repo.id)}
        assert names["VERSION"] == "variable"


class TestNestedAndAsync:
    def test_nested_classes(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        symbols = _symbols(db_session, registered_symbol_repo.id)
        inner = next(s for s in symbols if s.name == "Inner")
        assert inner.qualified_name == "Outer.Inner"
        nested = next(s for s in symbols if s.name == "nested_method")
        assert nested.qualified_name == "Outer.Inner.nested_method"

    def test_async_functions_and_methods(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        symbols = _symbols(db_session, registered_symbol_repo.id)
        fetch = next(s for s in symbols if s.name == "fetch")
        assert fetch.is_async is True
        list_users = next(s for s in symbols if s.name == "list_users")
        assert list_users.is_async is True

    def test_decorated_functions(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        symbols = _symbols(db_session, registered_symbol_repo.id)
        cached = next(s for s in symbols if s.name == "cached_lookup")
        assert cached.extra.get("decorators") == ["functools.lru_cache"]


class TestMultipleFiles:
    def test_multiple_files_parsed(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        symbols = _symbols(db_session, registered_symbol_repo.id)
        assert len(symbols) >= 8

        file_paths = {s.file.path for s in symbols}
        assert "src/service.py" in file_paths
        assert "src/utils.py" in file_paths

    def test_multiple_symbols_in_file(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        service_file = db_session.scalar(
            select(FileEntry).where(
                FileEntry.repository_id == registered_symbol_repo.id,
                FileEntry.path == "src/service.py",
            )
        )
        count = db_session.scalar(
            select(func.count()).select_from(Symbol).where(Symbol.file_id == service_file.id)
        )
        assert count >= 8


class TestEdgeCases:
    def test_empty_source_file(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        empty_file = db_session.scalar(
            select(FileEntry).where(
                FileEntry.repository_id == registered_symbol_repo.id,
                FileEntry.path == "src/empty.py",
            )
        )
        assert empty_file is not None
        count = db_session.scalar(
            select(func.count()).select_from(Symbol).where(Symbol.file_id == empty_file.id)
        )
        assert count == 0

    def test_syntax_error_file_does_not_fail_index(self, db_session, registered_symbol_repo):
        report = Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        assert report.status == "completed"

        reloaded = db_session.get(type(registered_symbol_repo), registered_symbol_repo.id)
        assert reloaded.status == "scanned"

        broken_file = db_session.scalar(
            select(FileEntry).where(
                FileEntry.repository_id == registered_symbol_repo.id,
                FileEntry.path == "src/broken.py",
            )
        )
        assert broken_file.extra.get("parse_errors")
        assert (
            db_session.scalar(
                select(Symbol).where(Symbol.file_id == broken_file.id, Symbol.name == "StillParses")
            )
            is not None
        )

    def test_unsupported_language_skipped(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        notes = db_session.scalar(
            select(FileEntry).where(
                FileEntry.repository_id == registered_symbol_repo.id,
                FileEntry.path == "notes.xyz",
            )
        )
        assert notes is not None
        count = db_session.scalar(
            select(func.count()).select_from(Symbol).where(Symbol.file_id == notes.id)
        )
        assert count == 0


class TestIdempotency:
    def test_reindexing_does_not_duplicate_symbols(self, db_session, registered_symbol_repo):
        first = Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        first_count = db_session.scalar(
            select(func.count())
            .select_from(Symbol)
            .where(Symbol.repository_id == registered_symbol_repo.id)
        )
        assert first.symbols_indexed == first_count

        second = Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        second_count = db_session.scalar(
            select(func.count())
            .select_from(Symbol)
            .where(Symbol.repository_id == registered_symbol_repo.id)
        )
        assert second.symbols_indexed == 0
        assert second_count == first_count

    def test_duplicate_definitions_deduplicated(self, db_session, tmp_path):
        repo = tmp_path / "dup"
        _write(repo, "dup.py", "def f():\n    pass\ndef f():\n    pass\n")
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        db_session.commit()
        report = Indexer().index(db_session, registered)
        db_session.commit()
        assert report.status == "completed"
        count = db_session.scalar(
            select(func.count()).select_from(Symbol).where(Symbol.repository_id == registered.id)
        )
        assert count == 1

    def test_removed_symbols_cleaned_on_reindex(self, db_session, tmp_path):
        repo = tmp_path / "change"
        _write(repo, "app.py", "def gone():\n    pass\ndef keep():\n    pass\n")
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        db_session.commit()
        Indexer().index(db_session, registered)
        db_session.commit()

        _write(repo, "app.py", "def keep():\n    pass\n")
        Indexer().index(db_session, registered)
        db_session.commit()
        names = {s.name for s in _symbols(db_session, registered.id)}
        assert "keep" in names
        assert "gone" not in names


class TestHierarchy:
    def test_parent_child_relationships(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        symbols = _symbols(db_session, registered_symbol_repo.id)

        service = next(s for s in symbols if s.name == "UserService")
        create_user = next(s for s in symbols if s.name == "create_user")
        assert create_user.parent_id == service.id

        outer = next(s for s in symbols if s.name == "Outer")
        inner = next(s for s in symbols if s.name == "Inner")
        assert inner.parent_id == outer.id

        nested = next(s for s in symbols if s.name == "nested_method")
        assert nested.parent_id == inner.id

    def test_qualified_names(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        qns = {s.qualified_name for s in _symbols(db_session, registered_symbol_repo.id)}
        assert "UserService" in qns
        assert "UserService.create_user" in qns
        assert "Outer" in qns
        assert "Outer.Inner" in qns
        assert "Outer.Inner.nested_method" in qns

    def test_line_numbers(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        symbols = _symbols(db_session, registered_symbol_repo.id)
        service = next(s for s in symbols if s.name == "UserService")
        assert service.start_line == 17
        create_user = next(s for s in symbols if s.name == "create_user")
        assert create_user.start_line == 23
        assert create_user.end_line >= create_user.start_line
        assert create_user.start_col >= 0

    def test_method_qualified_name_without_dot_self(self, db_session, registered_symbol_repo):
        Indexer().index(db_session, registered_symbol_repo)
        db_session.commit()
        symbols = _symbols(db_session, registered_symbol_repo.id)
        fetch = next(s for s in symbols if s.name == "fetch")
        assert fetch.qualified_name == "fetch"
        assert fetch.parent_id is None


class TestParserEdgeCases:
    def test_empty_source_parses_to_no_symbols(self):
        parsed = ParsingService().parse("", path="empty.py", language="python")
        assert parsed.symbols == []
        assert parsed.errors == []

    def test_syntax_error_recorded_but_symbols_extracted(self):
        parsed = ParsingService().parse(
            "def broken(:\n    pass\n\nclass StillParses:\n    pass\n",
            path="broken.py",
            language="python",
        )
        assert parsed.errors
        assert any(s.name == "StillParses" for s in parsed.symbols)

    def test_unsupported_language_empty(self):
        parsed = ParsingService().parse("x = 1", path="notes.xyz", language="unknown")
        assert parsed.symbols == []
        assert parsed.errors == []

    def test_error_messages_never_include_source(self):
        secret = "VERY_SECRET_TOKEN_9f8e"
        source = f"def broken(:\n    {secret}\n"
        parsed = ParsingService().parse(source, path="broken.py", language="python")
        for message in parsed.errors:
            assert secret not in message
            assert "broken(" not in message
