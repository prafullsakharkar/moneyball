"""Integration tests for the repository context retrieval API."""

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
        "src/api/client.py": (
            "import json\n\n"
            "class ApiClient:\n"
            "    def fetch(self):\n"
            "        return json.loads('{}')\n"
        ),
        "src/api/auth.py": (
            "class Authenticator:\n    def authenticate(self):\n        return True\n"
        ),
        "README.md": "# sample\n",
        "package.json": '{"name": "sample", "dependencies": {"express": "^4.19.0"}}',
    }
    base.update(tree)
    return base


def _post_context(client, rid: str, query: str, limit: int | None = None):
    payload = {"query": query}
    if limit is not None:
        payload["limit"] = limit
    return client.post(f"/api/v1/repositories/{rid}/context", json=payload)


class TestContextQueries:
    def test_exact_symbol_query(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "exact", _repo({}))
        r = _post_context(client, rid, "ForecastService")
        assert r.status_code == 200
        body = r.json()
        names = {s["name"] for s in body["symbols"]}
        assert "ForecastService" in names
        top = body["ranking"][0]
        assert top["type"] == "symbol"
        assert top["match"] == "exact_symbol"

    def test_partial_symbol_query(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "partial", _repo({}))
        r = _post_context(client, rid, "Forecast")
        body = r.json()
        names = {s["name"] for s in body["symbols"]}
        assert {"Forecast", "ForecastService"} <= names

    def test_file_query(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "fileq", _repo({}))
        r = _post_context(client, rid, "client")
        body = r.json()
        paths = {f["path"] for f in body["files"]}
        assert "src/api/client.py" in paths
        assert any(f["match"] in ("file_name", "file_prefix") for f in body["files"])

    def test_relationship_query(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "relq", _repo({}))
        r = _post_context(client, rid, "ForecastService")
        body = r.json()
        assert len(body["relationships"]) >= 1
        kinds = {rel["kind"] for rel in body["relationships"]}
        assert "import" in kinds or "call" in kinds

    def test_dependency_query(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "depq", _repo({}))
        r = _post_context(client, rid, "express")
        body = r.json()
        assert any(rel["name"] == "express" for rel in body["relationships"])

    def test_repository_overview_query(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "ovq", _repo({}))
        r = _post_context(client, rid, "repository structure")
        body = r.json()
        assert body["repository"]["name"] == "ovq"
        assert body["architecture"]["languages"]
        assert body["repository"]["file_count"] >= 1

    def test_unknown_repository(self, client):
        r = _post_context(client, str(uuid.uuid4()), "anything")
        assert r.status_code == 404

    def test_empty_query_rejected(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "emptyq", _repo({}))
        r = client.post(f"/api/v1/repositories/{rid}/context", json={"query": ""})
        assert r.status_code == 422

    def test_empty_repository(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "emptyr", {"main.py": "x = 1\n"})
        r = _post_context(client, rid, "x")
        body = r.json()
        assert body["symbols"] or body["files"]
        assert body["counts"]["relationships"] == 0


class TestRanking:
    def test_exact_beats_partial(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "rank", _repo({}))
        r = _post_context(client, rid, "ForecastService")
        body = r.json()
        ranked = [e for e in body["ranking"] if e["type"] == "symbol"]
        assert ranked[0]["match"] == "exact_symbol"
        assert ranked[0]["score"] > ranked[-1]["score"]

    def test_ranking_transparent(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "rank2", _repo({}))
        r = _post_context(client, rid, "Authenticator")
        body = r.json()
        assert body["ranking"]
        assert all("score" in e and "match" in e for e in body["ranking"])


class TestLimits:
    def test_context_limits(self, client, tmp_path):
        tree = {f"mod{i}/f{i}.py": f"def func{i}(): pass\n" for i in range(30)}
        rid = _register_and_scan(client, tmp_path, "limits", tree)
        r = _post_context(client, rid, "func", limit=5)
        body = r.json()
        assert len(body["symbols"]) <= 5
        assert len(body["files"]) <= 5
        assert body["counts"]["symbols"] <= 5

    def test_default_limits(self, client, tmp_path):
        tree = {f"mod{i}/f{i}.py": f"def func{i}(): pass\n" for i in range(60)}
        rid = _register_and_scan(client, tmp_path, "dflt", tree)
        r = _post_context(client, rid, "func")
        body = r.json()
        assert len(body["symbols"]) <= 25
        assert len(body["files"]) <= 20


class TestDeterminism:
    def test_deterministic_repeated_query(self, client, tmp_path):
        rid = _register_and_scan(client, tmp_path, "det", _repo({}))
        first = _post_context(client, rid, "ForecastService").json()
        second = _post_context(client, rid, "ForecastService").json()
        assert first == second


class TestIsolation:
    def test_multiple_repositories(self, client, tmp_path):
        rid_a = _register_and_scan(client, tmp_path, "ctxA", {"a.py": "def only_a(): pass\n"})
        rid_b = _register_and_scan(client, tmp_path, "ctxB", {"b.py": "def only_b(): pass\n"})
        ra = _post_context(client, rid_a, "only").json()
        rb = _post_context(client, rid_b, "only").json()
        names_a = {s["name"] for s in ra["symbols"]}
        names_b = {s["name"] for s in rb["symbols"]}
        assert "only_a" in names_a
        assert "only_b" in names_b
        assert "only_b" not in names_a
        assert "only_a" not in names_b

    def test_repository_isolation_paths(self, client, tmp_path):
        rid_a = _register_and_scan(client, tmp_path, "ctxC", {"x/a.py": "def fa(): pass\n"})
        _register_and_scan(client, tmp_path, "ctxD", {"y/b.py": "def fb(): pass\n"})
        ra = _post_context(client, rid_a, "fb").json()
        assert "y/b.py" not in {f["path"] for f in ra["files"]}


class TestNoLlm:
    def test_no_llm_invocation(self, client, tmp_path, monkeypatch):

        def boom(*args, **kwargs):
            raise AssertionError("LLM must not be invoked by context endpoint")

        monkeypatch.setattr("repository_brain.proxy.client.LLMClient.chat_completions", boom)
        monkeypatch.setattr("repository_brain.proxy.client.LLMClient.chat_completions_stream", boom)
        rid = _register_and_scan(client, tmp_path, "nollm", _repo({}))
        r = _post_context(client, rid, "ForecastService")
        assert r.status_code == 200
