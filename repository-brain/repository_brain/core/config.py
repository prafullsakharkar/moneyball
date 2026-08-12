"""Application settings loaded from environment variables."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    """Typed application configuration backed by environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Application ---
    app_name: str = "repository-brain"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    debug: bool = False
    log_level: str = "INFO"
    version: str = "0.1.0"

    # --- Database ---
    database_url: str = "sqlite:///./storage/brain.db"

    # --- Storage ---
    storage_dir: Path = Path("./storage")
    allowed_repository_roots: Annotated[list[str], NoDecode] = Field(default_factory=list)

    # --- Security ---
    secret_key: str = "change-me-in-production"

    # --- Workers ---
    indexer_workers: int = 4
    watch_interval: int = 0

    # --- OpenAI-compatible proxy (Phase 1) ---
    # Upstream OpenAI-compatible backend (e.g. llama.cpp serving Qwen3).
    # This is the base URL including the /v1 API path.
    openai_backend: str = "http://localhost:8033/v1"
    # Key forwarded to the upstream backend. Left empty to omit the header.
    openai_api_key: str = ""
    # Default model name to forward upstream.
    openai_model: str = "qwen35b"
    # Model name advertised by GET /api/v1/models. Clients (e.g. Roo Code)
    # request this name; it is mapped to OPENAI_MODEL before forwarding.
    openai_advertised_model: str = "repository-brain-v1"
    # Timeout (seconds) for upstream requests and streams.
    openai_timeout: int = Field(default=300, ge=1)

    @field_validator("allowed_repository_roots", mode="before")
    @classmethod
    def _split_roots(cls, value: object) -> object:
        if isinstance(value, str):
            return [p.strip() for p in value.split(",") if p.strip()]
        return value

    @field_validator("openai_backend")
    @classmethod
    def _validate_openai_backend(cls, value: str) -> str:
        """Normalise the backend URL and require an http(s) scheme."""
        value = value.strip().rstrip("/")
        if not value.startswith(("http://", "https://")):
            raise ValueError("OPENAI_BACKEND must be an http(s) URL")
        return value

    @field_validator("database_url")
    @classmethod
    def _ensure_driver(cls, value: str) -> str:
        """Normalise common sqlite/postgres URLs to supported forms."""
        if value.startswith("sqlite://") and "+pysqlite" in value:
            return value.replace("+pysqlite", "")
        return value

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    @property
    def repository_storage_dir(self) -> Path:
        return self.storage_dir / "repositories"

    # --- OpenAI-compatible proxy helpers ---

    @property
    def openai_backend_url(self) -> str:
        """Normalised upstream base URL (no trailing slash)."""
        return self.openai_backend

    def openai_url(self, path: str) -> str:
        """Join an API path onto the backend base URL without double slashes."""
        return f"{self.openai_backend}/{path.lstrip('/')}"

    @property
    def openai_chat_completions_url(self) -> str:
        """Full upstream chat completions endpoint URL."""
        return self.openai_url("chat/completions")

    @property
    def openai_models_url(self) -> str:
        """Full upstream models listing endpoint URL."""
        return self.openai_url("models")


@lru_cache
def get_settings() -> Settings:
    """Return the process-wide settings singleton."""
    return Settings()
