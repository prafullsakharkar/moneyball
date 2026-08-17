"""Dependency injection container for Repository Brain services."""

from __future__ import annotations

from functools import lru_cache

from repository_brain.architecture.service import ArchitectureService
from repository_brain.context.service import RepositoryContextService
from repository_brain.core.config import get_settings
from repository_brain.graph.engine import DependencyEngine
from repository_brain.indexer.service import Indexer
from repository_brain.indexer.snapshot import SnapshotService
from repository_brain.knowledge.service import RepositoryKnowledgeService
from repository_brain.memory.service import MemoryService
from repository_brain.modules.service import ModuleService
from repository_brain.parser.parser import ParserRegistry
from repository_brain.proxy.client import LLMClient
from repository_brain.repository.service import RepositoryService
from repository_brain.search.service import SearchService
from repository_brain.symbols.service import SymbolService


class Container:
    """Wires all application services together."""

    def __init__(self) -> None:
        settings = get_settings()
        self.settings = settings

        self.parser_registry = ParserRegistry()
        self.symbol_service = SymbolService()
        self.dependency_engine = DependencyEngine()
        self.module_service = ModuleService()
        self.architecture_service = ArchitectureService()
        self.memory_service = MemoryService()
        self.snapshot_service = SnapshotService(settings.storage_dir)
        self.repository_service = RepositoryService()
        self.search_service = SearchService()
        self.knowledge_service = RepositoryKnowledgeService()
        self.context_service = RepositoryContextService()
        self.llm_client = LLMClient(settings=settings)
        self._background_scanner = None
        self.indexer = Indexer(
            symbol_service=self.symbol_service,
            dependency_engine=self.dependency_engine,
            module_service=self.module_service,
            architecture_service=self.architecture_service,
            memory_service=self.memory_service,
            snapshot_service=self.snapshot_service,
            parser_registry=self.parser_registry,
        )

    @property
    def background_scanner(self):
        if self._background_scanner is None:
            from repository_brain.workers.scanner import BackgroundScanner

            self._background_scanner = BackgroundScanner()
        return self._background_scanner


@lru_cache
def get_container() -> Container:
    """Return the process-wide dependency injection container."""
    return Container()
