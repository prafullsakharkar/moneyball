"""Persistent repository memory service."""

from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from repository_brain.core.errors import RepositoryNotFoundError
from repository_brain.core.logging import get_logger
from repository_brain.memory.statistics import collect_statistics
from repository_brain.memory.summarizer import ModuleSummaryInput, Summarizer
from repository_brain.models.architecture import Architecture
from repository_brain.models.file import FileEntry
from repository_brain.models.memory import RepositoryMemory
from repository_brain.models.module import Module, ModuleDependency, ModuleFile
from repository_brain.models.repository import Repository
from repository_brain.models.symbol import Symbol


class MemoryService:
    """Builds, persists and retrieves repository memory.

    Memory is persistent: it is only rebuilt when explicitly requested.
    """

    def __init__(self) -> None:
        self.log = get_logger("memory")
        self.summarizer = Summarizer()

    def get(self, session: Session, repository_id: uuid.UUID) -> RepositoryMemory | None:
        return session.get(RepositoryMemory, repository_id)

    def get_or_build(self, session: Session, repository_id: uuid.UUID) -> RepositoryMemory:
        memory = self.get(session, repository_id)
        if memory is None:
            memory = self.build(session, repository_id)
        return memory

    def build(self, session: Session, repository_id: uuid.UUID) -> RepositoryMemory:
        """Build repository memory from the current index."""
        repository = session.get(Repository, repository_id)
        if repository is None:
            raise RepositoryNotFoundError(f"Repository not found: {repository_id}")

        architecture = session.get(Architecture, repository_id)
        architecture_content = architecture.content if architecture else {}

        statistics = collect_statistics(session, repository_id)
        module_summaries = self._build_module_summaries(session, repository_id)
        conventions = self._collect_conventions(session, repository_id, architecture_content)
        patterns = architecture_content.get("patterns", {})

        memory = session.get(RepositoryMemory, repository_id)
        if memory is None:
            memory = RepositoryMemory(repository_id=repository_id)
            session.add(memory)

        memory.summary = self.summarizer.repository_summary(architecture_content, statistics)
        memory.architecture_summary = self.summarizer.architecture_summary(
            architecture_content, statistics
        )
        memory.module_summaries = module_summaries
        memory.conventions = conventions
        memory.patterns = patterns
        memory.statistics = statistics
        memory.extra = {
            "repository": {
                "name": repository.name,
                "path": repository.path,
                "vcs": repository.vcs,
                "default_branch": repository.default_branch,
            }
        }
        memory.version = (memory.version or 0) + 1
        session.flush()
        return memory

    def delete(self, session: Session, repository_id: uuid.UUID) -> None:
        memory = session.get(RepositoryMemory, repository_id)
        if memory is not None:
            session.delete(memory)

    # ------------------------------------------------------------ helpers

    def _build_module_summaries(self, session: Session, repository_id: uuid.UUID) -> dict[str, str]:
        modules = list(session.scalars(select(Module).where(Module.repository_id == repository_id)))
        summaries: dict[str, str] = {}

        for module in modules:
            module_files = list(
                session.scalars(select(ModuleFile.file_id).where(ModuleFile.module_id == module.id))
            )
            total_symbols = self._count_module_symbols(session, repository_id, module_files)

            docstrings = self._module_docstrings(session, repository_id, module_files)
            outbound = list(
                session.scalars(
                    select(ModuleDependency.target_module_id).where(
                        ModuleDependency.source_module_id == module.id
                    )
                )
            )

            input_data = ModuleSummaryInput(
                name=module.name,
                file_count=len(module_files),
                symbol_count=total_symbols,
                docstrings=docstrings,
                roles=module.extra.get("role_counts", {}),
                dependencies=[str(t) for t in outbound],
            )
            summaries[module.name] = self.summarizer.module_summary(input_data)

        return summaries

    def _count_module_symbols(
        self, session: Session, repository_id: uuid.UUID, file_ids: list[uuid.UUID]
    ) -> int:
        if not file_ids:
            return 0
        return (
            session.scalar(
                select(func.count(Symbol.id)).where(
                    Symbol.repository_id == repository_id,
                    Symbol.file_id.in_(file_ids),
                )
            )
            or 0
        )

    def _module_docstrings(
        self, session: Session, repository_id: uuid.UUID, file_ids: list[uuid.UUID]
    ) -> list[str]:
        if not file_ids:
            return []
        rows = session.execute(
            select(Symbol.docstring)
            .where(
                Symbol.repository_id == repository_id,
                Symbol.file_id.in_(file_ids),
                Symbol.docstring.is_not(None),
                Symbol.parent_id.is_(None),
            )
            .limit(6)
        ).scalars()
        return [row for row in rows if row]

    def _collect_conventions(
        self,
        session: Session,
        repository_id: uuid.UUID,
        architecture_content: dict,
    ) -> dict:
        conventions: dict = {}
        conventions.update(architecture_content.get("conventions", {}))

        indent_counts = (
            session.execute(
                select(FileEntry.path).where(FileEntry.repository_id == repository_id).limit(500)
            )
            .scalars()
            .all()
            or []
        )
        snake = sum(1 for p in indent_counts if "/" in p)
        conventions["nesting"] = {"uses_directories": snake > 0}
        return conventions
