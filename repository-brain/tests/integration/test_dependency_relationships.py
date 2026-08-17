"""Integration tests for dependency-graph relationships.

Covers the deterministic relationship scenarios: simple imports, multiple
imports, relative imports, package imports, external dependencies, circular
imports, missing target modules, multiple files, symbol-level relationships,
re-indexing idempotency, deleted files, deleted symbols, invalid syntax, and
unsupported languages.
"""

from __future__ import annotations

from pathlib import Path

from repository_brain.models.dependency import Dependency
from sqlalchemy import select


def _write(tree: dict[str, str], root: Path) -> None:
    for rel, content in tree.items():
        path = root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)


def _index(session, root: Path, name: str = "depcase"):
    from repository_brain.indexer.service import Indexer
    from repository_brain.repository.service import RepositoryService

    repo = RepositoryService().create(session, name=name, path=str(root))
    session.commit()
    report = Indexer().index(session, repo)
    session.commit()
    return repo, report


def _deps(session, repo_id) -> list[Dependency]:
    return list(
        session.scalars(
            select(Dependency)
            .where(Dependency.repository_id == repo_id)
            .order_by(Dependency.kind, Dependency.name, Dependency.source_file_id)
        )
    )


class TestImportRelationships:
    def test_simple_import(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "main.py": "import helpers\n\nx = helpers.add(1, 2)\n",
                "helpers.py": "def add(a, b):\n    return a + b\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import"]
        assert len(imports) == 1
        assert imports[0].name == "helpers"
        assert imports[0].is_resolved is True
        assert imports[0].is_external is False
        assert imports[0].target_file is not None
        assert imports[0].target_file.path == "helpers.py"

    def test_multiple_imports(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "main.py": "import os\nimport json\nimport helpers\n",
                "helpers.py": "def add(a, b):\n    return a + b\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import"]
        names = {d.name for d in imports}
        assert names == {"os", "json", "helpers"}
        by_name = {d.name: d for d in imports}
        assert by_name["helpers"].is_resolved is True
        assert by_name["os"].is_external is True
        assert by_name["os"].is_resolved is False
        assert by_name["json"].is_external is True

    def test_relative_import(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "pkg/__init__.py": "",
                "pkg/models.py": "class User:\n    pass\n",
                "pkg/service.py": "from .models import User\n\n\nclass UserService:\n    pass\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import" and d.name == ".models"]
        assert len(imports) == 1
        assert imports[0].is_resolved is True
        assert imports[0].target_file.path == "pkg/models.py"
        assert imports[0].target_symbol is not None
        assert imports[0].target_symbol.name == "User"

    def test_package_import(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "pkg/__init__.py": "",
                "pkg/models.py": "class User:\n    pass\n",
                "main.py": "from pkg.models import User\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import" and d.name == "pkg.models"]
        assert len(imports) == 1
        assert imports[0].is_resolved is True
        assert imports[0].target_file.path == "pkg/models.py"
        assert imports[0].target_symbol is not None
        assert imports[0].target_symbol.name == "User"

    def test_external_dependency(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write({"main.py": "import requests\nimport os\n"}, root)
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import"]
        by_name = {d.name: d for d in imports}
        assert by_name["requests"].is_external is True
        assert by_name["requests"].is_resolved is False
        assert by_name["requests"].target_file is None
        assert by_name["os"].is_external is True

    def test_circular_imports(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "pkg/__init__.py": "",
                "pkg/a.py": "from pkg.b import B\n\n\nclass A:\n    pass\n",
                "pkg/b.py": "from pkg.a import A\n\n\nclass B:\n    pass\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import"]
        pairs = {(d.source_file.path, d.target_file.path) for d in imports if d.target_file}
        assert ("pkg/a.py", "pkg/b.py") in pairs
        assert ("pkg/b.py", "pkg/a.py") in pairs
        assert len(imports) == 2

    def test_missing_target_module(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write({"main.py": "from .nonexistent import Thing\n"}, root)
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import"]
        assert len(imports) == 1
        assert imports[0].is_resolved is False
        assert imports[0].is_external is False
        assert imports[0].target_file is None

    def test_multiple_files(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "main.py": "from a import A\nfrom b import B\n",
                "a.py": "class A:\n    pass\n",
                "b.py": "class B:\n    pass\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import"]
        targets = {d.target_file.path for d in imports if d.target_file}
        assert targets == {"a.py", "b.py"}

    def test_symbol_relationship(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "models.py": "class User:\n    pass\n",
                "service.py": (
                    "from models import User\n\n"
                    "class UserService:\n"
                    "    def create(self):\n"
                    "        return User()\n"
                ),
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)

        import_edges = [d for d in deps if d.kind == "import"]
        assert len(import_edges) == 1
        assert import_edges[0].target_symbol is not None
        assert import_edges[0].target_symbol.name == "User"

        call_edges = [d for d in deps if d.kind == "call"]
        assert len(call_edges) == 1
        assert call_edges[0].name == "User"
        assert call_edges[0].source_symbol is not None
        assert call_edges[0].source_symbol.name == "create"
        assert call_edges[0].target_file is not None
        assert call_edges[0].target_file.path == "models.py"
        assert call_edges[0].is_resolved is True

    def test_duplicate_calls_collapse(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "models.py": "class User:\n    pass\n",
                "service.py": (
                    "from models import User\n\n"
                    "class UserService:\n"
                    "    def create(self):\n"
                    "        a = User()\n"
                    "        b = User()\n"
                    "        return a\n"
                ),
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        call_edges = [d for d in deps if d.kind == "call"]
        assert len(call_edges) == 1


class TestReindexing:
    def test_reindexing_is_idempotent(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "main.py": "from helpers import add\nx = add(1, 2)\n",
                "helpers.py": "def add(a, b):\n    return a + b\n",
            },
            root,
        )
        repo, first = _index(db_session, root)
        from repository_brain.indexer.service import Indexer

        Indexer().index(db_session, repo)
        db_session.commit()
        deps = _deps(db_session, repo.id)
        assert first.dependencies_indexed == 2
        assert len(deps) == 2

    def test_deleted_file_removes_edges(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "main.py": "from helpers import add\nx = add(1, 2)\n",
                "helpers.py": "def add(a, b):\n    return a + b\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        (root / "helpers.py").unlink()
        from repository_brain.indexer.service import Indexer

        report = Indexer().index(db_session, repo)
        db_session.commit()
        assert report.files_deleted == 1
        deps = _deps(db_session, repo.id)
        dangling = [d for d in deps if d.target_file is None and not d.is_external]
        assert not dangling

    def test_deleted_symbol_removes_edges(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "models.py": "class User:\n    pass\n",
                "service.py": "from models import User\n\nclass S:\n    pass\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        (root / "models.py").write_text("class Admin:\n    pass\n")
        from repository_brain.indexer.service import Indexer

        report = Indexer().index(db_session, repo)
        db_session.commit()
        assert report.files_modified == 1
        deps = _deps(db_session, repo.id)
        stale = [d for d in deps if d.target_symbol is not None and d.target_symbol.name == "User"]
        assert not stale


class TestRobustness:
    def test_invalid_syntax_does_not_abort_index(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "good.py": "from helpers import add\nx = add(1, 2)\n",
                "helpers.py": "def add(a, b):\n    return a + b\n",
                "broken.py": "def broken(:\n    pass\n",
            },
            root,
        )
        repo, report = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import"]
        assert len(imports) == 1
        assert imports[0].is_resolved is True
        assert report.symbols_indexed >= 1

    def test_unsupported_language_ignored(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write(
            {
                "main.py": "import helpers\n",
                "helpers.py": "def add(a, b):\n    return a + b\n",
                "notes.md": "# notes\n",
            },
            root,
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        imports = [d for d in deps if d.kind == "import"]
        assert len(imports) == 1
        assert imports[0].name == "helpers"


class TestManifestDependencies:
    def test_manifest_external_dependencies(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write({"main.py": "import os\n"}, root)
        (root / "pyproject.toml").write_text(
            '[project]\ndependencies = ["fastapi>=0.100", "uvicorn"]\n'
        )
        repo, _ = _index(db_session, root)
        deps = _deps(db_session, repo.id)
        manifest = [d for d in deps if d.kind == "manifest"]
        assert {d.name for d in manifest} == {"fastapi", "uvicorn"}
        assert all(d.is_external for d in manifest)
        assert all(d.source_file_id is None for d in manifest)
        assert all(d.source_symbol_id is None for d in manifest)

    def test_manifest_reader_supported_formats(self, tmp_path):
        from repository_brain.graph.manifest import ManifestDependencyReader

        root = tmp_path / "r"
        root.mkdir(parents=True, exist_ok=True)
        (root / "package.json").write_text(
            '{"dependencies": {"express": "^4.19.0", "lodash": "^4.17.21"}}'
        )
        (root / "requirements.txt").write_text("flask==3.0.0\nrequests>=2.0\n")
        (root / "go.mod").write_text(
            "module example.com/r\n\ngo 1.21\n\nrequire (\n\tgithub.com/stretchr/testify v1.9.0\n)\n"
        )
        (root / "Cargo.toml").write_text('[dependencies]\nserde = "1.0"\n')
        reader = ManifestDependencyReader()
        deps = reader.read(root)
        by_name = {d.name: d for d in deps}
        assert by_name["express"].manager == "node"
        assert by_name["lodash"].manager == "node"
        assert by_name["flask"].version_spec == "==3.0.0"
        assert by_name["requests"].version_spec == ">=2.0"
        assert by_name["github.com/stretchr/testify"].version_spec == "v1.9.0"
        assert by_name["serde"].manager == "rust"

    def test_reindex_refreshes_manifest_dependencies(self, db_session, tmp_path):
        root = tmp_path / "r"
        _write({"main.py": "import os\n"}, root)
        (root / "pyproject.toml").write_text('[project]\ndependencies = ["fastapi"]\n')
        repo, _ = _index(db_session, root)
        (root / "pyproject.toml").write_text('[project]\ndependencies = ["pydantic"]\n')
        from repository_brain.indexer.service import Indexer

        Indexer().index(db_session, repo)
        db_session.commit()
        deps = _deps(db_session, repo.id)
        manifest = [d for d in deps if d.kind == "manifest"]
        assert {d.name for d in manifest} == {"pydantic"}
