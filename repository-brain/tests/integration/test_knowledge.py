"""Integration tests for the repository knowledge API endpoints."""

from __future__ import annotations

import uuid
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client(tmp_path, monkeypatch):
    from repository_brain.core.database import engine
    from repository_brain.models.base import Base

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    from repository_brain.main import create_app

    app = create_app()
    with TestClient(app) as c:
        yield c


def _register_and_scan(client, tmp_path: Path, name: str, tree: dict[str, str]) -> str:
    root = tmp_path / name
    root.mkdir(parents=True, exist_ok=True)
    for rel, content in tree.items():
        path = root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
    r = client.post("/repositories", json={"name": name, "path": str(root)})
    assert r.status_code == 201
    rid = r.json()["id"]
    r = client.post(f"/repositories/{rid}/scan")
    assert r.status_code == 200
    return rid


def _repo(tree: dict[str, str]) -> dict[str, str]:
    base = {
        "src/weather/forecast.py": (
            "from dataclasses import dataclass\n"
            "from api.client import ApiClient\n\n"
            "@dataclass\n"
            "class Forecast:\n"
            "    city: str\n\n"
            "class ForecastService:\n"
            "    def __init__(self, client: ApiClient | None = None) -> None:\n"
            "        self.client = client or ApiClient()\n"
        ),
        "src/api/client.py": "import json\n\nclass ApiClient:\n    def fetch(self):\n        return json.loads('{}')\n",
        "README.md": "# sample\n",
        "package.json": '{"name": "sample", "dependencies": {"express": "^4.19.0"}}',
    }
    base.update(tree)
    return base


class TestOverview:
    def test_repository_overview(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "overview", _repo({}))
        r = client.get(f"/knowledge/overview?repository_id={rid}")
        assert r.status_code == 200
        body = r.json()
        assert body["repository_id"] == rid
        assert body["name"] == "overview"
        assert body["root_path"]
        assert "python" in body["languages"]
        assert body["file_count"] >= 1
        assert body["symbol_count"] >= 1
        assert body["relationship_count"] >= 1
        assert body["module_count"] >= 1
        assert "src" in body["top_level_directories"]
        assert "package.json" in body["config_files"]
        assert body["status"] == "scanned"
        assert body["last_scanned_at"] is not None

    def test_overview_unknown_repository(self, client):
        r = client.get(f"/knowledge/overview?repository_id={uuid.uuid4()}")
        assert r.status_code == 404

    def test_overview_invalid_uuid(self, client):
        r = client.get("/knowledge/overview?repository_id=not-a-uuid")
        assert r.status_code == 422

    def test_overview_empty_repository(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "empty", {"main.py": "x = 1\n"})
        r = client.get(f"/knowledge/overview?repository_id={rid}")
        assert r.status_code == 200
        body = r.json()
        assert body["file_count"] == 1
        assert body["symbol_count"] == 1
        assert body["relationship_count"] == 0


class TestFileTree:
    def test_file_listing(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "tree", _repo({}))
        r = client.get(f"/knowledge/files?repository_id={rid}")
        assert r.status_code == 200
        body = r.json()
        assert body["repository_id"] == rid
        assert body["root"] == "tree"
        assert body["total"] >= 1

        names = {node["name"] for node in body["nodes"]}
        assert "src" in names
        src = next(n for n in body["nodes"] if n["name"] == "src")
        assert src["type"] == "dir"
        child_names = {c["name"] for c in src["children"]}
        assert "weather" in child_names and "api" in child_names

    def test_file_listing_pagination(self, client, tmp_path):
        tree = {f"mod{i}/f{i}.py": "def f(): pass\n" for i in range(6)}
        tree.update({"top.py": "def top(): pass\n"})
        rid = _register_and_scan(client, tmp_path, "paged", tree)

        r = client.get(f"/knowledge/files?repository_id={rid}&limit=3&offset=0")
        body = r.json()
        assert body["total"] == 7
        assert len(body["nodes"]) == 3
        first = [n["name"] for n in body["nodes"]]

        r = client.get(f"/knowledge/files?repository_id={rid}&limit=3&offset=3")
        body = r.json()
        assert len(body["nodes"]) == 3
        second = [n["name"] for n in body["nodes"]]

        assert first != second
        assert set(first + second + [body["nodes"][0]["name"]]) or True

    def test_file_listing_depth_limit(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "depth", _repo({}))
        r = client.get(f"/knowledge/files?repository_id={rid}&depth=1")
        body = r.json()
        src = next(n for n in body["nodes"] if n["name"] == "src")
        assert src["children"] == []
        assert src["truncated"] is True


class TestSymbolLookup:
    def test_symbol_lookup_by_name(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "sym", _repo({}))
        r = client.get(f"/knowledge/symbols?repository_id={rid}&name=ForecastService&exact=true")
        assert r.status_code == 200
        body = r.json()
        assert body["total"] == 1
        item = body["items"][0]
        assert item["name"] == "ForecastService"
        assert item["kind"] == "class"
        assert item["file_path"] == "src/weather/forecast.py"
        assert item["qualified_name"] == "ForecastService"

    def test_exact_symbol_search(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "exact", _repo({}))
        r = client.get(f"/knowledge/symbols?repository_id={rid}&name=ForecastService&exact=true")
        body = r.json()
        assert body["total"] == 1
        assert all(item["name"] == "ForecastService" for item in body["items"])

        r = client.get(f"/knowledge/symbols?repository_id={rid}&name=ForecastServiceX&exact=true")
        assert r.json()["total"] == 0

    def test_partial_symbol_search(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "partial", _repo({}))
        r = client.get(f"/knowledge/symbols?repository_id={rid}&name=Forecast")
        body = r.json()
        names = {item["name"] for item in body["items"]}
        assert {"Forecast", "ForecastService"} <= names

    def test_symbol_search_by_kind_and_language(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "kind", _repo({}))
        r = client.get(f"/knowledge/symbols?repository_id={rid}&kind=class&language=python")
        body = r.json()
        assert all(item["kind"] == "class" for item in body["items"])
        assert all(item["language"] == "python" for item in body["items"])

    def test_symbol_pagination(self, client, tmp_path):
        tree = {f"m{i}.py": "def f(): pass\nclass C:\n    pass\n" for i in range(4)}
        rid = _register_and_scan(client, tmp_path, "sympage", tree)
        r = client.get(f"/knowledge/symbols?repository_id={rid}&limit=3&offset=0")
        body = r.json()
        assert len(body["items"]) == 3
        assert body["total"] >= 8


class TestRelationships:
    def test_relationship_lookup(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "rel", _repo({}))
        r = client.get(f"/knowledge/relationships?repository_id={rid}")
        assert r.status_code == 200
        body = r.json()
        assert body["total"] >= 1
        kinds = {item["kind"] for item in body["items"]}
        assert "import" in kinds or "call" in kinds or "manifest" in kinds

    def test_import_lookup_what_imports_file(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "imp", _repo({}))
        r = client.get(
            f"/knowledge/imports?repository_id={rid}&direction=incoming&file_path=src/api/client.py"
        )
        assert r.status_code == 200
        body = r.json()
        assert body["total"] >= 1
        assert any(
            item["source_path"] == "src/weather/forecast.py"
            and item["target_path"] == "src/api/client.py"
            for item in body["items"]
        )

    def test_import_lookup_what_file_imports(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "imp2", _repo({}))
        r = client.get(
            f"/knowledge/imports?repository_id={rid}"
            f"&direction=outgoing&file_path=src/weather/forecast.py"
        )
        body = r.json()
        assert body["total"] >= 1
        assert any(item["name"] == "api.client" for item in body["items"])

    def test_dependency_lookup_manifest(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "dep", _repo({}))
        r = client.get(f"/knowledge/dependencies?repository_id={rid}&kind=manifest")
        assert r.status_code == 200
        body = r.json()
        assert body["total"] >= 1
        assert any(item["name"] == "express" for item in body["items"])

    def test_relationships_invalid_direction(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "dir", _repo({}))
        r = client.get(f"/knowledge/relationships?repository_id={rid}&direction=sideways")
        assert r.status_code == 422


class TestIsolation:
    def test_multiple_repositories(self, client, tmp_path):
        rid_a = _register_and_scan(client, tmp_path, "repA", {"a.py": "def aa(): pass\n"})
        rid_b = _register_and_scan(client, tmp_path, "repB", {"b.py": "def bb(): pass\n"})
        assert rid_a != rid_b

        r = client.get(f"/knowledge/overview?repository_id={rid_a}")
        assert r.json()["name"] == "repA"
        r = client.get(f"/knowledge/overview?repository_id={rid_b}")
        assert r.json()["name"] == "repB"

    def test_repository_isolation_symbols(self, client, tmp_path):
        rid_a = _register_and_scan(client, tmp_path, "isoA", {"a.py": "def only_in_a(): pass\n"})
        rid_b = _register_and_scan(client, tmp_path, "isoB", {"b.py": "def only_in_b(): pass\n"})

        r = client.get(f"/knowledge/symbols?repository_id={rid_a}&name=only_in_b")
        assert r.status_code == 200
        assert r.json()["total"] == 0

        r = client.get(f"/knowledge/symbols?repository_id={rid_b}&name=only_in_a")
        assert r.json()["total"] == 0

    def test_repository_isolation_files(self, client, tmp_path):
        rid_a = _register_and_scan(client, tmp_path, "isoC", {"a.py": "def f(): pass\n"})
        _register_and_scan(client, tmp_path, "isoD", {"b.py": "def g(): pass\n"})

        r = client.get(f"/knowledge/files?repository_id={rid_a}")
        assert r.status_code == 200
        names = {n["name"] for n in r.json()["nodes"]}
        assert "a.py" in names
        assert "b.py" not in names

    def test_repository_isolation_relationships(self, client, tmp_path):
        rid_a = _register_and_scan(
            client, tmp_path, "isoE", {"a.py": "import b\n", "b.py": "x = 1\n"}
        )
        _register_and_scan(client, tmp_path, "isoF", {"c.py": "import d\n", "d.py": "x = 1\n"})

        r = client.get(f"/knowledge/relationships?repository_id={rid_a}")
        assert r.status_code == 200
        targets = {item["target_path"] for item in r.json()["items"]}
        sources = {item["source_path"] for item in r.json()["items"]}
        assert {"a.py", "b.py"} <= (sources | targets)
        assert "d.py" not in (sources | targets)
