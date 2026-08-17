"""Deterministic repository context retrieval.

Builds a structured, bounded repository context bundle for a natural-language
query using only SQL queries against the persisted index. No LLM is invoked
and no embeddings are used; relevance is determined by a transparent ranking
strategy and capped by configuration limits.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from repository_brain.core.config import get_settings
from repository_brain.core.errors import RepositoryNotFoundError
from repository_brain.knowledge.service import RepositoryKnowledgeService
from repository_brain.models.architecture import Architecture
from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.repository import Repository
from repository_brain.models.symbol import Symbol

#: Ranking priority for symbol matches. Higher is more relevant.
#: exact symbol name > qualified name > file name > path > partial name
RANK_EXACT_SYMBOL = 100
RANK_QUALIFIED = 90
RANK_FILE_NAME = 80
RANK_PATH = 70
RANK_PARTIAL_SYMBOL = 60
RANK_PARTIAL_PATH = 50

_SYMBOL_KINDS = {
    "class",
    "function",
    "method",
    "module",
    "interface",
    "enum",
    "type",
    "variable",
    "field",
}


@dataclass(slots=True)
class RankedSymbol:
    """A symbol plus its relevance score and match type."""

    symbol: Symbol
    score: float = 0.0
    match: str = ""


@dataclass(slots=True)
class RankedFile:
    """A file plus its relevance score and match type."""

    file: FileEntry
    score: float = 0.0
    match: str = ""


class RepositoryContextService:
    """Assemble deterministic repository context for a query."""

    def __init__(self) -> None:
        self.knowledge = RepositoryKnowledgeService()
        self.settings = get_settings()

    # ------------------------------------------------------------ public API

    def build(
        self,
        session: Session,
        repository_id: uuid.UUID,
        query: str,
        *,
        limit: int | None = None,
    ) -> dict:
        """Return a structured context bundle for ``query``.

        ``limit`` caps the number of files/symbols/relationships; when omitted
        the configured ``max_context_*`` settings apply.
        """
        repository = session.get(Repository, repository_id)
        if repository is None:
            raise RepositoryNotFoundError(f"Repository not found: {repository_id}")

        tokens = self._tokens(query)
        limit_files = limit or self.settings.max_context_files
        limit_symbols = limit or self.settings.max_context_symbols
        limit_relationships = limit or self.settings.max_context_relationships

        ranked_symbols = self._rank_symbols(session, repository_id, query, tokens)
        ranked_files = self._rank_files(session, repository_id, query, tokens)

        symbols = [
            self._symbol_out(s.symbol, s.score, s.match)
            for s in self._dedupe_symbols(ranked_symbols)[:limit_symbols]
        ]
        ranked_files = self._dedupe_files(ranked_files)
        file_paths = {f.file.path for f in ranked_files[:limit_files]}
        file_paths.update(s.symbol.file.path for s in ranked_symbols if s.symbol.file)

        relationships = self._relationships(session, repository_id, file_paths, limit_relationships)

        architecture = self._architecture(session, repository_id)
        overview = self._overview(session, repository_id)

        selected_files = ranked_files[:limit_files]
        return {
            "query": query,
            "repository_id": str(repository_id),
            "repository_name": repository.name,
            "repository": overview,
            "files": [self._file_out(f.file, f.score, f.match) for f in selected_files],
            "symbols": symbols,
            "relationships": relationships,
            "architecture": architecture,
            "counts": {
                "files": len(selected_files),
                "symbols": len(symbols),
                "relationships": len(relationships),
            },
            "ranking": self._ranking_entries(ranked_symbols[:5], ranked_files[:5]),
        }

    # ------------------------------------------------------------- matching

    @staticmethod
    def _tokens(query: str) -> list[str]:
        """Split the query into lower-cased, alphanumeric tokens."""
        lowered = query.lower()
        return [
            token
            for token in (
                part.strip("._/-") for part in lowered.replace("?", " ").replace("'", " ").split()
            )
            if token
        ]

    def _rank_symbols(
        self,
        session: Session,
        repository_id: uuid.UUID,
        query: str,
        tokens: list[str],
    ) -> list[RankedSymbol]:
        q = query.strip().strip("?")
        if not tokens:
            return []

        exact = session.scalars(
            select(Symbol).where(
                Symbol.repository_id == repository_id,
                Symbol.name == q,
            )
        ).all()
        ranked: list[RankedSymbol] = [
            RankedSymbol(s, RANK_EXACT_SYMBOL, "exact_symbol") for s in exact
        ]

        qualified = session.scalars(
            select(Symbol).where(
                Symbol.repository_id == repository_id,
                Symbol.qualified_name == q,
            )
        ).all()
        ranked.extend(RankedSymbol(s, RANK_QUALIFIED, "qualified_name") for s in qualified)

        like = f"%{query}%"
        partial = session.scalars(
            select(Symbol)
            .where(
                Symbol.repository_id == repository_id,
                or_(
                    Symbol.name.ilike(like),
                    Symbol.qualified_name.ilike(like),
                ),
            )
            .limit(200)
        ).all()
        for symbol in partial:
            score, match = self._partial_symbol_score(symbol, query, tokens)
            ranked.append(RankedSymbol(symbol, score, match))

        return ranked

    @staticmethod
    def _partial_symbol_score(symbol: Symbol, query: str, tokens: list[str]) -> tuple[float, str]:
        name = symbol.name.lower()
        q = query.lower().strip().strip("?")
        if q and q in name:
            if q == name:
                return RANK_EXACT_SYMBOL, "exact_symbol"
            if name.startswith(q):
                return RANK_PARTIAL_SYMBOL + 10, "prefix"
            return RANK_PARTIAL_SYMBOL, "partial_name"
        qualified = (symbol.qualified_name or "").lower()
        if q and q in qualified:
            return RANK_PARTIAL_SYMBOL - 5, "qualified_partial"
        for token in tokens:
            if token in name:
                return RANK_PARTIAL_SYMBOL - 10, "token"
        return 0.0, ""

    def _rank_files(
        self,
        session: Session,
        repository_id: uuid.UUID,
        query: str,
        tokens: list[str],
    ) -> list[RankedFile]:
        q = query.strip().strip("?")
        if not tokens:
            return []

        ranked: list[RankedFile] = []
        path = q.replace(".", "/")
        if "/" not in path:
            exact = session.scalars(
                select(FileEntry).where(
                    FileEntry.repository_id == repository_id,
                    func.lower(FileEntry.path) == q,
                )
            ).all()
            ranked.extend(RankedFile(f, RANK_FILE_NAME, "file_name") for f in exact)

        like = f"%{q}%"
        partial = session.scalars(
            select(FileEntry)
            .where(
                FileEntry.repository_id == repository_id,
                or_(FileEntry.path.ilike(like)),
            )
            .limit(200)
        ).all()
        for file in partial:
            score, match = self._partial_file_score(file, q, tokens)
            ranked.append(RankedFile(file, score, match))

        return ranked

    @staticmethod
    def _partial_file_score(file: FileEntry, q: str, tokens: list[str]) -> tuple[float, str]:
        path = file.path.lower()
        base = path.rsplit("/", 1)[-1]
        ql = q.lower()
        if ql and ql == path:
            return RANK_PATH + 5, "path"
        if ql and ql in base:
            if base.startswith(ql):
                return RANK_FILE_NAME + 10, "file_prefix"
            return RANK_FILE_NAME, "file_name"
        if ql and ql in path:
            return RANK_PATH, "path"
        for token in tokens:
            if token in base:
                return RANK_PARTIAL_PATH, "token"
        return 0.0, ""

    # -------------------------------------------------------- relationships

    def _relationships(
        self,
        session: Session,
        repository_id: uuid.UUID,
        file_paths: set[str],
        limit: int,
    ) -> list[dict]:
        stmt = select(Dependency).where(Dependency.repository_id == repository_id)
        if file_paths:
            stmt = stmt.where(
                or_(
                    Dependency.source_file.has(FileEntry.path.in_(file_paths)),
                    Dependency.target_file.has(FileEntry.path.in_(file_paths)),
                    Dependency.kind == "manifest",
                )
            )
        else:
            stmt = stmt.where(Dependency.kind == "manifest")
        rows = session.scalars(stmt.limit(limit)).all()
        return [
            {
                "kind": d.kind,
                "name": d.name,
                "source_path": d.source_file.path if d.source_file else None,
                "target_path": d.target_file.path if d.target_file else None,
                "source_symbol": d.source_symbol.name if d.source_symbol else None,
                "target_symbol": d.target_symbol.name if d.target_symbol else None,
                "is_resolved": d.is_resolved,
                "is_external": d.is_external,
            }
            for d in rows
        ]

    # ----------------------------------------------------- architecture

    def _architecture(self, session: Session, repository_id: uuid.UUID) -> dict:
        architecture = session.get(Architecture, repository_id)
        content = architecture.content if architecture else {}
        return {
            "languages": list(content.get("languages", {})),
            "frameworks": content.get("frameworks", []),
            "top_level_directories": content.get("structure", [])[:12],
            "entry_points": content.get("entry_points", []),
            "config_files": content.get("manifests", []),
        }

    def _overview(self, session: Session, repository_id: uuid.UUID) -> dict:
        overview = self.knowledge.overview(session, repository_id)
        return {
            "name": overview["name"],
            "root_path": overview["root_path"],
            "languages": overview["languages"],
            "frameworks": overview["frameworks"],
            "file_count": overview["file_count"],
            "symbol_count": overview["symbol_count"],
            "relationship_count": overview["relationship_count"],
            "git_branch": overview["git_branch"],
            "status": overview["status"],
        }

    # ------------------------------------------------------------ helpers

    @staticmethod
    def _dedupe_symbols(ranked: list[RankedSymbol]) -> list[RankedSymbol]:
        seen: set[tuple[str, str]] = set()
        result: list[RankedSymbol] = []
        for item in ranked:
            key = (item.symbol.qualified_name, item.symbol.file_id)
            if key in seen:
                continue
            seen.add(key)
            result.append(item)
        return sorted(result, key=lambda i: i.score, reverse=True)

    @staticmethod
    def _dedupe_files(ranked: list[RankedFile]) -> list[RankedFile]:
        seen: set[str] = set()
        result: list[RankedFile] = []
        for item in ranked:
            if item.file.path in seen:
                continue
            seen.add(item.file.path)
            result.append(item)
        return sorted(result, key=lambda i: i.score, reverse=True)

    @staticmethod
    def _symbol_out(symbol: Symbol, score: float, match: str) -> dict:
        return {
            "name": symbol.name,
            "qualified_name": symbol.qualified_name,
            "kind": symbol.kind,
            "file_path": symbol.file.path if symbol.file else None,
            "line": symbol.start_line,
            "signature": symbol.signature,
            "score": score,
            "match": match,
        }

    @staticmethod
    def _file_out(file: FileEntry, score: float, match: str) -> dict:
        return {
            "path": file.path,
            "language": file.language,
            "score": score,
            "match": match,
        }

    @staticmethod
    def _ranking_entries(symbols: list[RankedSymbol], files: list[RankedFile]) -> list[dict]:
        entries: list[dict] = []
        for s in symbols:
            entries.append(
                {
                    "type": "symbol",
                    "name": s.symbol.name,
                    "score": s.score,
                    "match": s.match,
                }
            )
        for f in files:
            entries.append(
                {
                    "type": "file",
                    "name": f.file.path,
                    "score": f.score,
                    "match": f.match,
                }
            )
        return entries
