"""Tests for the SQL-backed search service."""

from __future__ import annotations

from repository_brain.search.service import SearchService


class TestSearchService:
    def test_symbol_search_by_name(self, indexed_sample, db_session):
        repo, _ = indexed_sample
        svc = SearchService()
        hits, total = svc.search(db_session, "Forecast", repository_id=repo.id)
        assert total >= 1
        names = {h.qualified_name for h in hits if h.type == "symbol"}
        assert "ForecastService" in names or "Forecast" in names

    def test_exact_search(self, indexed_sample, db_session):
        repo, _ = indexed_sample
        svc = SearchService()
        hits, total = svc.search(db_session, "ForecastService", repository_id=repo.id, exact=True)
        assert total >= 1
        assert all(h.name == "ForecastService" for h in hits if h.type == "symbol")

    def test_file_search(self, indexed_sample, db_session):
        repo, _ = indexed_sample
        svc = SearchService()
        hits, total = svc.search(db_session, "forecast.py", repository_id=repo.id, scope="files")
        assert total >= 1
        assert all(h.type == "file" for h in hits)
        assert any(h.path.endswith("forecast.py") for h in hits)

    def test_module_search(self, indexed_sample, db_session):
        repo, _ = indexed_sample
        svc = SearchService()
        hits, total = svc.search(db_session, "src", repository_id=repo.id, scope="modules")
        assert total >= 1
        assert all(h.type == "module" for h in hits)

    def test_invalid_scope_raises(self, db_session):
        import pytest

        with pytest.raises(ValueError):
            SearchService().search(db_session, "x", scope="nonsense")
