"""Integration tests exercising the REST API with a temporary repository."""

from __future__ import annotations

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


class TestRepositoryAPI:
    def test_health(self, client):
        r = client.get("/health")
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}

    def test_health_requires_no_llm_backend(self, client):
        """Liveness must not depend on the upstream LLM backend being reachable."""
        r = client.get("/health")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_version(self, client):
        r = client.get("/version")
        assert r.status_code == 200
        assert r.json()["version"]

    def test_crud_lifecycle(self, client, tmp_repo_dir):
        r = client.post(
            "/repositories",
            json={"name": "sample", "path": str(tmp_repo_dir)},
        )
        assert r.status_code == 201
        rid = r.json()["id"]

        r = client.get(f"/repositories/{rid}")
        assert r.status_code == 200
        assert r.json()["name"] == "sample"

        r = client.patch(f"/repositories/{rid}", json={"description": "updated"})
        assert r.status_code == 200
        assert r.json()["description"] == "updated"

        r = client.get("/repositories")
        assert r.status_code == 200
        assert len(r.json()) == 1

        r = client.delete(f"/repositories/{rid}")
        assert r.status_code == 200

        r = client.get(f"/repositories/{rid}")
        assert r.status_code == 404

    def test_create_duplicate_conflicts(self, client, tmp_repo_dir):
        payload = {"name": "dup", "path": str(tmp_repo_dir)}
        assert client.post("/repositories", json=payload).status_code == 201
        assert client.post("/repositories", json=payload).status_code == 409

    def test_create_missing_path(self, client, tmp_repo_dir):
        r = client.post("/repositories", json={"name": "x", "path": "/no/such/dir"})
        assert r.status_code == 422

    def test_bad_payload(self, client):
        r = client.post("/repositories", json={"name": "x"})
        assert r.status_code == 422


class TestScanAndQueryAPI:
    def test_scan_then_query(self, client, tmp_repo_dir):
        rid = client.post(
            "/repositories", json={"name": "sample", "path": str(tmp_repo_dir)}
        ).json()["id"]

        r = client.post(f"/repositories/{rid}/scan")
        assert r.status_code == 200
        assert r.json()["status"] == "completed"

        r = client.post("/search", json={"repository_id": rid, "query": "Forecast"})
        assert r.status_code == 200
        results = r.json()["results"]
        assert any(h["type"] == "symbol" for h in results)

        r = client.get(f"/symbols?repository_id={rid}")
        assert r.status_code == 200
        assert r.json()["total"] >= 8

        r = client.get(f"/modules?repository_id={rid}")
        assert r.status_code == 200
        assert r.json()["total"] >= 1

        r = client.get(f"/dependencies?repository_id={rid}")
        assert r.status_code == 200
        assert r.json()["total"] >= 1

        r = client.get(f"/summary?repository_id={rid}")
        assert r.status_code == 200
        assert r.json()["summary"]

        r = client.get(f"/architecture?repository_id={rid}")
        assert r.status_code == 200
        assert "languages" in r.json()["content"]

        r = client.get(f"/statistics?repository_id={rid}")
        assert r.status_code == 200
        assert r.json()["files"]["total"] >= 1

    def test_search_requires_query(self, client, tmp_repo_dir):
        rid = client.post(
            "/repositories", json={"name": "sample", "path": str(tmp_repo_dir)}
        ).json()["id"]
        r = client.post("/search", json={"repository_id": rid, "query": ""})
        assert r.status_code == 422

    def test_scan_missing_repository(self, client):
        r = client.post("/repositories/00000000-0000-0000-0000-000000000000/scan")
        assert r.status_code == 404

    def test_memory_refresh(self, client, tmp_repo_dir):
        rid = client.post(
            "/repositories", json={"name": "sample", "path": str(tmp_repo_dir)}
        ).json()["id"]
        client.post(f"/repositories/{rid}/scan")
        r = client.post(f"/memory/refresh?repository_id={rid}")
        assert r.status_code == 200
        assert r.json()["version"] >= 1
