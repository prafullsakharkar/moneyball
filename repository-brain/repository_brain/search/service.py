"""Search service backed by the SQL index (no embeddings required)."""

from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.module import Module
from repository_brain.models.repository import Repository
from repository_brain.models.symbol import Symbol

#: Symbol kinds ranked by importance (used for result ordering).
_KIND_RANK = {
    "module": 0,
    "package": 1,
    "class": 2,
    "interface": 3,
    "enum": 4,
    "component": 5,
    "function": 6,
    "method": 7,
    "type": 8,
    "variable": 9,
    "field": 10,
}

_SCOPES = {"all", "files", "symbols", "modules", "dependencies"}


@dataclass(slots=True)
class SearchHit:
    """A single search result."""

    type: str
    name: str
    repository_id: str | None = None
    repository_name: str | None = None
    id: str | None = None
    path: str | None = None
    file_id: str | None = None
    file_path: str | None = None
    kind: str | None = None
    qualified_name: str | None = None
    line: int | None = None
    snippet: str | None = None
    score: float = 0.0

    def to_dict(self) -> dict:
        return {
            "type": self.type,
            "repository_id": self.repository_id,
            "repository_name": self.repository_name,
            "id": self.id,
            "name": self.name,
            "path": self.path,
            "file_id": self.file_id,
            "file_path": self.file_path,
            "kind": self.kind,
            "qualified_name": self.qualified_name,
            "line": self.line,
            "snippet": self.snippet,
            "score": self.score,
        }


class SearchService:
    """Search across the repository index."""

    def __init__(self) -> None:
        self._repo_names: dict[uuid.UUID, str] = {}

    def search(
        self,
        session: Session,
        query: str,
        *,
        scope: str = "all",
        kind: str | None = None,
        language: str | None = None,
        exact: bool = False,
        repository_id: uuid.UUID | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[SearchHit], int]:
        if scope not in _SCOPES:
            raise ValueError(f"Invalid scope: {scope}")

        hits: list[SearchHit] = []
        if scope in ("all", "symbols"):
            hits.extend(
                self.search_symbols(
                    session,
                    query,
                    kind=kind,
                    language=language,
                    exact=exact,
                    repository_id=repository_id,
                    limit=limit,
                    offset=offset,
                )[0]
            )
        if scope in ("all", "files"):
            hits.extend(
                self.search_files(
                    session,
                    query,
                    language=language,
                    exact=exact,
                    repository_id=repository_id,
                    limit=limit,
                    offset=offset,
                )[0]
            )
        if scope in ("all", "modules"):
            hits.extend(
                self.search_modules(
                    session,
                    query,
                    repository_id=repository_id,
                    limit=limit,
                    offset=offset,
                )[0]
            )
        if scope in ("all", "dependencies"):
            hits.extend(
                self.search_dependencies(
                    session,
                    query,
                    repository_id=repository_id,
                    limit=limit,
                    offset=offset,
                )[0]
            )

        hits.sort(key=lambda h: h.score)
        total = len(hits)
        return hits[offset : offset + limit], total

    # ------------------------------------------------------------ symbols

    def search_symbols(
        self,
        session: Session,
        query: str,
        *,
        kind: str | None = None,
        language: str | None = None,
        exact: bool = False,
        repository_id: uuid.UUID | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[SearchHit], int]:
        stmt = self._base_symbol_stmt(query, exact)
        count_stmt = self._base_symbol_count(query, exact)
        if language:
            stmt = stmt.where(Symbol.language == language)
            count_stmt = count_stmt.where(Symbol.language == language)
        if repository_id:
            stmt = stmt.where(Symbol.repository_id == repository_id)
            count_stmt = count_stmt.where(Symbol.repository_id == repository_id)
        if kind:
            stmt = stmt.where(Symbol.kind == kind)
            count_stmt = count_stmt.where(Symbol.kind == kind)

        total = session.scalar(count_stmt) or 0
        rows = session.scalars(stmt.offset(offset).limit(limit)).all()
        hits = [
            SearchHit(
                type="symbol",
                id=str(s.id),
                name=s.name,
                repository_id=str(s.repository_id),
                repository_name=self._repo_name(session, s.repository_id),
                file_id=str(s.file_id),
                file_path=s.file.path,
                kind=s.kind,
                qualified_name=s.qualified_name,
                line=s.start_line,
                snippet=s.signature or s.docstring,
                score=self._symbol_score(s, query, exact),
            )
            for s in rows
        ]
        return hits, total

    def _base_symbol_stmt(self, query: str, exact: bool):
        if exact:
            return select(Symbol).where(Symbol.name == query).order_by(Symbol.kind)
        like = f"%{query}%"
        return (
            select(Symbol)
            .where(
                or_(
                    Symbol.name.ilike(like),
                    Symbol.qualified_name.ilike(like),
                )
            )
            .order_by(Symbol.kind)
        )

    def _base_symbol_count(self, query: str, exact: bool):
        count_stmt = select(func.count()).select_from(Symbol)
        if exact:
            return count_stmt.where(Symbol.name == query)
        like = f"%{query}%"
        return count_stmt.where(
            or_(
                Symbol.name.ilike(like),
                Symbol.qualified_name.ilike(like),
            )
        )

    # -------------------------------------------------------------- files

    def search_files(
        self,
        session: Session,
        query: str,
        *,
        language: str | None = None,
        exact: bool = False,
        repository_id: uuid.UUID | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[SearchHit], int]:
        if exact:
            stmt = select(FileEntry).where(FileEntry.path == query)
        else:
            like = f"%{query}%"
            stmt = select(FileEntry).where(
                or_(FileEntry.path.ilike(like), FileEntry.path.ilike(f"%/{like}"))
            )

        if language:
            stmt = stmt.where(FileEntry.language == language)
        if repository_id:
            stmt = stmt.where(FileEntry.repository_id == repository_id)
        stmt = stmt.order_by(FileEntry.path)

        total = session.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        rows = session.scalars(stmt.offset(offset).limit(limit)).all()
        hits = [
            SearchHit(
                type="file",
                id=str(f.id),
                name=f.path.rsplit("/", 1)[-1],
                repository_id=str(f.repository_id),
                repository_name=self._repo_name(session, f.repository_id),
                path=f.path,
                file_id=str(f.id),
                file_path=f.path,
                kind=f.language,
                snippet=f.path,
                score=0.0,
            )
            for f in rows
        ]
        return hits, total

    # ------------------------------------------------------------ modules

    def search_modules(
        self,
        session: Session,
        query: str,
        *,
        repository_id: uuid.UUID | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[SearchHit], int]:
        like = f"%{query}%"
        stmt = select(Module).where(or_(Module.name.ilike(like), Module.summary.ilike(like)))
        if repository_id:
            stmt = stmt.where(Module.repository_id == repository_id)
        stmt = stmt.order_by(Module.score.desc())

        total = session.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        rows = session.scalars(stmt.offset(offset).limit(limit)).all()
        hits = [
            SearchHit(
                type="module",
                id=str(m.id),
                name=m.name,
                repository_id=str(m.repository_id),
                repository_name=self._repo_name(session, m.repository_id),
                path=m.path_prefix,
                kind="module",
                snippet=m.summary,
                score=float(m.score),
            )
            for m in rows
        ]
        return hits, total

    # -------------------------------------------------------- dependencies

    def search_dependencies(
        self,
        session: Session,
        query: str,
        *,
        repository_id: uuid.UUID | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[SearchHit], int]:
        like = f"%{query}%"
        stmt = select(Dependency).where(
            or_(Dependency.name.ilike(like), Dependency.target_name.ilike(like))
        )
        if repository_id:
            stmt = stmt.where(Dependency.repository_id == repository_id)
        stmt = stmt.order_by(Dependency.kind)

        total = session.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        rows = session.scalars(stmt.offset(offset).limit(limit)).all()
        hits = [
            SearchHit(
                type="dependency",
                id=str(d.id),
                name=d.name,
                repository_id=str(d.repository_id),
                repository_name=self._repo_name(session, d.repository_id),
                file_id=str(d.source_file_id) if d.source_file_id else None,
                file_path=d.source_file.path if d.source_file else None,
                kind=d.kind,
                qualified_name=d.target_name,
                line=d.line,
                snippet=f"{d.kind}: {d.name}",
                score=1.0 if d.is_resolved else 0.5,
            )
            for d in rows
        ]
        return hits, total

    # ------------------------------------------------------------ helpers

    def _repo_name(self, session: Session, repository_id: uuid.UUID) -> str:
        if repository_id in self._repo_names:
            return self._repo_names[repository_id]
        name = session.scalar(select(Repository.name).where(Repository.id == repository_id))
        self._repo_names[repository_id] = name or ""
        return self._repo_names[repository_id]

    @staticmethod
    def _symbol_score(symbol: Symbol, query: str, exact: bool) -> float:
        score = 0.0
        if exact and symbol.name == query:
            score += 10.0
        elif symbol.name.startswith(query):
            score += 5.0
        elif query in symbol.name:
            score += 2.0
        score += _KIND_RANK.get(symbol.kind, 10)
        return score
