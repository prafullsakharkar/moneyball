"""Repository Brain application entrypoint."""

from __future__ import annotations

from contextlib import asynccontextmanager

import structlog
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from repository_brain import __version__
from repository_brain.api.router import api_router
from repository_brain.core.config import get_settings
from repository_brain.core.database import init_db
from repository_brain.core.logging import configure_logging, get_logger
from repository_brain.core.request_id import generate_request_id

log = get_logger("main")


def create_app() -> FastAPI:
    """Application factory."""
    settings = get_settings()
    configure_logging(settings.log_level)

    @asynccontextmanager
    async def lifespan(_app: FastAPI):
        settings.storage_dir.mkdir(parents=True, exist_ok=True)
        settings.repository_storage_dir.mkdir(parents=True, exist_ok=True)
        init_db()
        log.info("application_started", name=settings.app_name, env=settings.app_env)
        yield
        log.info("application_stopped")

    app = FastAPI(
        title="Repository Brain",
        description=(
            "An open-source repository intelligence engine. Indexes, remembers and "
            "exposes the structure of software repositories through a REST API."
        ),
        version=__version__,
        lifespan=lifespan,
    )

    @app.middleware("http")
    async def _request_context(request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or generate_request_id()
        request.state.request_id = request_id
        structlog.contextvars.bind_contextvars(request_id=request_id)
        try:
            response = await call_next(request)
        finally:
            structlog.contextvars.unbind_contextvars("request_id")
        response.headers["X-Request-ID"] = request_id
        return response

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    return app


app = create_app()


def run() -> None:  # pragma: no cover - CLI helper
    settings = get_settings()
    uvicorn.run(
        "repository_brain.main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=False,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":  # pragma: no cover
    run()
