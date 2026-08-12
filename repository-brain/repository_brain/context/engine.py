"""Given a query, assemble the minimal useful repository context."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from repository_brain.core.logging import get_logger
from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.memory import RepositoryMemory
from repository_brain.models.module import Module, ModuleFile
from repository_brain.models.repository import Repository
from repository_brain.models.symbol import Symbol

_INTENT_KEYWORDS = {
    "what": "explain",
    "where": "locate",
    "how": "explain",
    "depend": "dependents",
    "affect": "dependents",
    "impact": "dependents",
    "used_by": "dependents",
    "test": "tests",
    "architecture": "architecture",
    "structure": "architecture",
    "module": "modules",
}


@dataclass(slots=True)
class ContextResult:
    """An optimised repository context bundle."""

    query: str
    repository_id: str | None
    repository_name: str | None
    intent: str
    target_symbols: list[dict] = field(default_factory=list)
    files: list[dict] = field(default_factory=list)
    dependencies: list[dict] = field(default_factory=list)
    summaries: list[str] = field(default_factory=list)
    total_files_considered: int = 0
    total_symbols_considered: int = 0

    def to_dict(self) -> dict:
        return {
            "query": self.query,
            "repository_id": self.repository_id,
            "repository_name": self.repository_name,
            "intent": self.intent,
            "target_symbols": self.target_symbols,
            "files": self.files,
            "dependencies": self.dependencies,
            "summaries": self.summaries,
            "total_files_considered": self.total_files_considered,
            "total_symbols_considered": self.total_symbols_considered,
        }


class ContextEngine:
    """Locates symbols, expands their dependencies and assembles context."""

    def __init__(self) -> None:
        self.log = get_logger("context")

    def build(
        self,
        session: Session,
        query: str,
        *,
        repository_id: uuid.UUID | None = None,
        max_files: int = 20,
        include_summaries: bool = True,
        include_dependencies: bool = True,
    ) -> ContextResult:
        intent = self._detect_intent(query)

        repos = self._select_repositories(session, repository_id)
        repo = repos[0] if repos else None
        result = ContextResult(
            query=query,
            repository_id=str(repo.id) if repo else None,
            repository_name=repo.name if repo else None,
            intent=intent,
        )

        if repo is None:
            return result

        target_symbols = self._locate_symbols(session, repo.id, query)
        target_files = self._locate_files(session, repo.id, query)

        file_ids: set[uuid.UUID] = {s.file_id for s in target_symbols}
        file_ids.update(f.id for f in target_files)

        considered_symbols = len(target_symbols)
        result.target_symbols = [
            {
                "name": s.name,
                "qualified_name": s.qualified_name,
                "kind": s.kind,
                "file_path": s.file.path,
                "line": s.start_line,
                "signature": s.signature,
                "docstring": s.docstring,
            }
            for s in target_symbols[:25]
        ]

        if include_dependencies:
            related = self._expand_dependencies(session, repo.id, file_ids, max_files)
            file_ids.update(related)
            result.dependencies = self._dependency_edges(session, repo.id, file_ids, limit=100)

        files = self._file_summaries(session, repo.id, file_ids, max_files)
        result.files = files
        result.total_files_considered = len(file_ids)
        result.total_symbols_considered = considered_symbols

        if include_summaries:
            result.summaries = self._collect_summaries(session, repo.id, file_ids)

        return result

    # ------------------------------------------------------------ internals

    @staticmethod
    def _detect_intent(query: str) -> str:
        lowered = query.lower()
        for keyword, intent in _INTENT_KEYWORDS.items():
            if keyword in lowered:
                return intent
        return "explore"

    def _select_repositories(
        self, session: Session, repository_id: uuid.UUID | None
    ) -> list[Repository]:
        if repository_id:
            repo = session.get(Repository, repository_id)
            return [repo] if repo else []
        return list(session.scalars(select(Repository).limit(1)))

    def _locate_symbols(
        self, session: Session, repository_id: uuid.UUID, query: str
    ) -> list[Symbol]:
        like = f"%{query}%"
        rows = session.scalars(
            select(Symbol)
            .where(
                Symbol.repository_id == repository_id,
                or_(
                    Symbol.name.ilike(like),
                    Symbol.qualified_name.ilike(like),
                ),
            )
            .order_by(Symbol.name)
            .limit(50)
        )
        return list(rows)

    def _locate_files(
        self, session: Session, repository_id: uuid.UUID, query: str
    ) -> list[FileEntry]:
        like = f"%{query}%"
        rows = session.scalars(
            select(FileEntry)
            .where(
                FileEntry.repository_id == repository_id,
                FileEntry.path.ilike(like),
            )
            .limit(25)
        )
        return list(rows)

    def _expand_dependencies(
        self,
        session: Session,
        repository_id: uuid.UUID,
        seed_file_ids: set[uuid.UUID],
        max_files: int,
    ) -> set[uuid.UUID]:
        """Add directly connected files (inbound + outbound edges)."""
        if not seed_file_ids:
            return set()

        outbound = set(
            session.scalars(
                select(Dependency.target_file_id).where(
                    Dependency.repository_id == repository_id,
                    Dependency.source_file_id.in_(seed_file_ids),
                    Dependency.target_file_id.is_not(None),
                )
            )
        )
        inbound = set(
            session.scalars(
                select(Dependency.source_file_id).where(
                    Dependency.repository_id == repository_id,
                    Dependency.target_file_id.in_(seed_file_ids),
                    Dependency.source_file_id.is_not(None),
                )
            )
        )
        result = outbound | inbound
        return set(list(result)[: max_files - len(seed_file_ids)])

    def _dependency_edges(
        self,
        session: Session,
        repository_id: uuid.UUID,
        file_ids: set[uuid.UUID],
        limit: int,
    ) -> list[dict]:
        if not file_ids:
            return []
        rows = session.scalars(
            select(Dependency)
            .where(
                Dependency.repository_id == repository_id,
                or_(
                    Dependency.source_file_id.in_(file_ids),
                    Dependency.target_file_id.in_(file_ids),
                ),
            )
            .limit(limit)
        )
        return [
            {
                "source": d.source_file.path if d.source_file else None,
                "target": d.target_file.path if d.target_file else None,
                "kind": d.kind,
                "name": d.name,
                "resolved": d.is_resolved,
            }
            for d in rows
        ]

    def _file_summaries(
        self,
        session: Session,
        repository_id: uuid.UUID,
        file_ids: set[uuid.UUID],
        max_files: int,
    ) -> list[dict]:
        if not file_ids:
            return []
        selected = list(file_ids)[:max_files]
        files = list(
            session.scalars(
                select(FileEntry).where(
                    FileEntry.repository_id == repository_id,
                    FileEntry.id.in_(selected),
                )
            )
        )
        result = []
        for file in files:
            symbol_names = session.scalars(
                select(Symbol.name).where(Symbol.file_id == file.id).limit(12)
            )
            result.append(
                {
                    "path": file.path,
                    "language": file.language,
                    "line_count": file.line_count,
                    "symbols": list(symbol_names),
                }
            )
        return result

    def _collect_summaries(
        self,
        session: Session,
        repository_id: uuid.UUID,
        file_ids: set[uuid.UUID],
    ) -> list[str]:
        memory = session.get(RepositoryMemory, repository_id)
        summaries: list[str] = []
        if memory and memory.summary:
            summaries.append(memory.summary)
        if memory and memory.architecture_summary:
            summaries.append(memory.architecture_summary)

        if file_ids:
            module_rows = session.execute(
                select(Module.name, ModuleFile.file_id)
                .join(ModuleFile, ModuleFile.module_id == Module.id)
                .where(ModuleFile.file_id.in_(list(file_ids)[:200]))
            ).all()
            for module_name in {name for name, _ in module_rows}:
                if memory and memory.module_summaries.get(module_name):
                    summaries.append(memory.module_summaries[module_name])

        return summaries[:10]
