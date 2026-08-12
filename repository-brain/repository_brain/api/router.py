"""Aggregate the API router."""

from __future__ import annotations

from fastapi import APIRouter

from repository_brain.api.routes import dependencies as dependencies_route
from repository_brain.api.routes import files as files_route
from repository_brain.api.routes import health as health_route
from repository_brain.api.routes import llm as llm_route
from repository_brain.api.routes import modules as modules_route
from repository_brain.api.routes import repositories as repositories_route
from repository_brain.api.routes import search as search_route
from repository_brain.api.routes import summary as summary_route
from repository_brain.api.routes import symbols as symbols_route

api_router = APIRouter()
api_router.include_router(repositories_route.router)
api_router.include_router(search_route.router)
api_router.include_router(symbols_route.router)
api_router.include_router(files_route.router)
api_router.include_router(modules_route.router)
api_router.include_router(dependencies_route.router)
api_router.include_router(summary_route.router)
api_router.include_router(health_route.router)
api_router.include_router(llm_route.router)
