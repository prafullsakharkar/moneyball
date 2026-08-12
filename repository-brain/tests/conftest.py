"""Shared pytest fixtures for Repository Brain tests."""

from __future__ import annotations

import os
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:////tmp/rb-test-brain.db"
os.environ["STORAGE_DIR"] = "/tmp/rb-test-storage"
os.environ["APP_ENV"] = "test"

# Register the default models by importing repository_brain.models package.
import pytest
import repository_brain.models  # noqa: F401
from repository_brain.core.config import get_settings
from repository_brain.models.architecture import Architecture  # noqa: F401
from repository_brain.models.base import Base
from repository_brain.models.dependency import Dependency  # noqa: F401
from repository_brain.models.file import FileEntry  # noqa: F401
from repository_brain.models.memory import RepositoryMemory  # noqa: F401
from repository_brain.models.module import Module, ModuleDependency, ModuleFile  # noqa: F401
from repository_brain.models.repository import Repository  # noqa: F401
from repository_brain.models.symbol import Symbol  # noqa: F401
from repository_brain.scanner.filesystem import FileMetadata  # noqa: F401
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker


@pytest.fixture()
def settings():
    return get_settings()


@pytest.fixture()
def engine():
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(test_engine)
    yield test_engine
    test_engine.dispose()


@pytest.fixture()
def db_session(engine):
    factory = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)
    session = factory()
    yield session
    session.close()


@pytest.fixture()
def tmp_repo_dir(tmp_path: Path) -> Path:
    """Create a small sample repository tree on disk."""
    repo = tmp_path / "sample"
    (repo / "src" / "weather").mkdir(parents=True)
    (repo / "src" / "api").mkdir(parents=True)
    (repo / "src" / "weather" / "forecast.py").write_text(
        '''"""Forecast domain module."""
from dataclasses import dataclass
from typing import Optional

from api.client import ApiClient


@dataclass
class Forecast:
    city: str
    high: int
    low: int
    summary: str


class ForecastService:
    """Builds forecasts."""

    def __init__(self, client: Optional[ApiClient] = None) -> None:
        self.client = client or ApiClient()

    def get_today(self, city: str) -> Forecast:
        data = self.client.fetch(city)
        return Forecast(city=city, high=data["high"], low=data["low"], summary=data.get("summary", ""))
'''
    )
    (repo / "src" / "api" / "client.py").write_text(
        '''"""HTTP client for fetching weather data."""
import json
import os


class ApiClient:
    base_url: str = "https://api.weather.example"

    def __init__(self, base_url: str | None = None) -> None:
        self.base_url = base_url or self.base_url

    def fetch(self, city: str) -> dict:
        resp = self._request(f"/cities/{city}")
        return json.loads(resp)

    def _request(self, path: str) -> str:
        return os.environ.get("MOCK_RESPONSE", "{}")
'''
    )
    (repo / "README.md").write_text("# Sample\nA sample repository.")
    (repo / "package.json").write_text(
        '{"name": "sample", "version": "1.0.0", "dependencies": {"express": "^4.19.0"}}'
    )
    return repo


@pytest.fixture()
def sample_repository(db_session, tmp_repo_dir):
    """Register the sample repo and return the ORM object."""
    from repository_brain.repository.service import RepositoryService

    svc = RepositoryService()
    return svc.create(db_session, name="sample", path=str(tmp_repo_dir))


@pytest.fixture()
def indexed_sample(db_session, sample_repository, tmp_repo_dir):
    """Run the full indexer over the sample repo."""
    from repository_brain.indexer.service import Indexer

    report = Indexer().index(db_session, sample_repository)
    db_session.commit()
    return sample_repository, report
