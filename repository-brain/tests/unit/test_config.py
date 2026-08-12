"""Configuration loading and validation tests (OpenAI-compatible proxy settings)."""

from __future__ import annotations

import pytest
from pydantic import ValidationError
from repository_brain.core.config import Settings

_OPENAI_ENV = (
    "OPENAI_BACKEND",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
    "OPENAI_ADVERTISED_MODEL",
    "OPENAI_TIMEOUT",
)


@pytest.fixture(autouse=True)
def _clean_openai_env(monkeypatch):
    """Ensure tests are hermetic regardless of the host environment."""
    for var in _OPENAI_ENV:
        monkeypatch.delenv(var, raising=False)


def _settings(**kwargs) -> Settings:
    # _env_file=None keeps tests independent of any local .env file.
    return Settings(_env_file=None, **kwargs)


class TestDefaults:
    def test_default_backend(self):
        s = _settings()
        assert s.openai_backend == "http://localhost:8033/v1"

    def test_default_api_key_empty(self):
        assert _settings().openai_api_key == ""

    def test_default_model(self):
        assert _settings().openai_model == "qwen35b"

    def test_default_advertised_model(self):
        assert _settings().openai_advertised_model == "repository-brain-v1"

    def test_default_timeout(self):
        assert _settings().openai_timeout == 300


class TestEnvLoading:
    def test_reads_required_variables_from_environment(self, monkeypatch):
        monkeypatch.setenv("OPENAI_BACKEND", "http://llm.internal:8033/v1")
        monkeypatch.setenv("OPENAI_API_KEY", "secret-key")
        monkeypatch.setenv("OPENAI_MODEL", "qwen3")
        s = _settings()
        assert s.openai_backend == "http://llm.internal:8033/v1"
        assert s.openai_api_key == "secret-key"
        assert s.openai_model == "qwen3"

    def test_reads_optional_timeout(self, monkeypatch):
        monkeypatch.setenv("OPENAI_TIMEOUT", "120")
        assert _settings().openai_timeout == 120

    def test_reads_advertised_model_from_environment(self, monkeypatch):
        monkeypatch.setenv("OPENAI_ADVERTISED_MODEL", "repo-brain-2")
        assert _settings().openai_advertised_model == "repo-brain-2"


class TestValidation:
    def test_invalid_backend_scheme(self):
        with pytest.raises(ValidationError):
            _settings(openai_backend="localhost:8033/v1")

    def test_backend_without_path_is_valid(self):
        assert _settings(openai_backend="http://localhost:8033").openai_backend == (
            "http://localhost:8033"
        )

    def test_empty_allowed_roots_env_parses_as_empty_list(self, monkeypatch, tmp_path):
        """An empty ALLOWED_REPOSITORY_ROOTS= in .env must not crash startup."""
        env_file = tmp_path / ".env"
        env_file.write_text("ALLOWED_REPOSITORY_ROOTS=\n", encoding="utf-8")
        s = Settings(_env_file=env_file)
        assert s.allowed_repository_roots == []

    def test_allowed_roots_env_splits_on_commas(self, monkeypatch, tmp_path):
        env_file = tmp_path / ".env"
        env_file.write_text("ALLOWED_REPOSITORY_ROOTS=/a,/b, /c\n", encoding="utf-8")
        s = Settings(_env_file=env_file)
        assert s.allowed_repository_roots == ["/a", "/b", "/c"]

    def test_trailing_slash_normalized(self):
        assert _settings(openai_backend="http://localhost:8033/v1/").openai_backend == (
            "http://localhost:8033/v1"
        )

    def test_blank_backend_rejected(self):
        with pytest.raises(ValidationError):
            _settings(openai_backend="   ")

    def test_timeout_must_be_positive(self):
        with pytest.raises(ValidationError):
            _settings(openai_timeout=0)
        with pytest.raises(ValidationError):
            _settings(openai_timeout=-5)

    def test_model_can_be_overridden(self):
        assert _settings(openai_model="qwen32b").openai_model == "qwen32b"


class TestBackendUrlResolution:
    def test_chat_completions_url_from_default(self):
        s = _settings()
        assert s.openai_chat_completions_url == "http://localhost:8033/v1/chat/completions"

    def test_chat_completions_url_has_single_v1_prefix(self):
        s = _settings()
        assert "/v1/v1" not in s.openai_chat_completions_url

    def test_chat_completions_url_with_leading_slash_path(self):
        s = _settings()
        assert s.openai_url("/chat/completions") == "http://localhost:8033/v1/chat/completions"

    def test_models_url(self):
        s = _settings()
        assert s.openai_models_url == "http://localhost:8033/v1/models"

    def test_backend_url_accessible_to_proxy(self):
        """The proxy must reach the full upstream endpoint, not a doubled /v1 path."""
        s = _settings(openai_backend="http://localhost:8033/v1")
        assert s.openai_backend_url == "http://localhost:8033/v1"
        assert s.openai_url("chat/completions").startswith(s.openai_backend_url)
