"""Deterministic repository knowledge queries.

The knowledge service exposes structural information about a repository —
overview, file tree, symbol lookup, imports, relationships and dependencies —
built entirely from the persisted index via database queries. It never calls
an LLM and never performs filesystem reads outside the index.

It reuses existing query helpers where possible (``SymbolService``,
``collect_statistics``) and only owns SQL that aggregates already-indexed rows.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field

from repository_brain.core.errors import RepositoryNotFoundError
from repository_brain.models.architecture import Architecture
from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.module import Module
from repository_brain.models.repository import Repository
from repository_brain.models.symbol import Symbol
from repository_brain.repository.service import RepositoryService
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, aliased

#: Well-known configuration and manifest file names surfaced in the overview.
_CONFIG_FILENAMES = {
    "pyproject.toml",
    "setup.py",
    "setup.cfg",
    "requirements.txt",
    "Pipfile",
    "package.json",
    "package-lock.json",
    "Cargo.toml",
    "go.mod",
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    "composer.json",
    "Gemfile",
    "Dockerfile",
    "Makefile",
    "README.md",
    ".gitignore",
    ".gitlab-ci.yml",
    ".github",
    "tsconfig.json",
    "webpack.config.js",
    "vite.config.ts",
    "next.config.js",
}


@dataclass(slots=True)
class RelationshipRow:
    """A relationship edge plus its human-readable endpoints."""

    id: str
    kind: str
    name: str
    direction: str
    source_path: str | None = None
    target_path: str | None = None
    source_symbol: str | None = None
    target_symbol: str | None = None
    is_resolved: bool = False
    is_external: bool = False
    line: int | None = None


@dataclass(slots=True)
class FileTreeNode:
    """A node in the file tree."""

    name: str
    path: str
    type: str
    language: str | None = None
    file_id: str | None = None
    truncated: bool = False
    children: list[FileTreeNode] = field(default_factory=list)


class RepositoryKnowledgeService:
    """Structural queries over a repository's persisted index."""

    def __init__(self) -> None:
        self.repository_service = RepositoryService()

    # ------------------------------------------------------------ validation

    def _require_repository(self, session: Session, repository_id: uuid.UUID) -> Repository:
        repository = session.get(Repository, repository_id)
        if repository is None:
            raise RepositoryNotFoundError(f"Repository not found: {repository_id}")
        return repository

    # ------------------------------------------------------------- overview

    def overview(self, session: Session, repository_id: uuid.UUID) -> dict:
        """Return a deterministic structural overview of a repository."""
        repository = self._require_repository(session, repository_id)

        file_count = (
            session.scalar(
                select(func.count())
                .select_from(FileEntry)
                .where(FileEntry.repository_id == repository_id)
            )
            or 0
        )
        symbol_count = (
            session.scalar(
                select(func.count())
                .select_from(Symbol)
                .where(Symbol.repository_id == repository_id)
            )
            or 0
        )
        relationship_count = (
            session.scalar(
                select(func.count())
                .select_from(Dependency)
                .where(Dependency.repository_id == repository_id)
            )
            or 0
        )
        module_count = (
            session.scalar(
                select(func.count())
                .select_from(Module)
                .where(Module.repository_id == repository_id)
            )
            or 0
        )

        language_rows = session.execute(
            select(FileEntry.language, func.count())
            .where(FileEntry.repository_id == repository_id, FileEntry.language.is_not(None))
            .group_by(FileEntry.language)
            .order_by(func.count().desc())
        ).all()
        languages = [lang for lang, _ in language_rows]

        architecture = session.get(Architecture, repository_id)
        frameworks = sorted(architecture.content.get("frameworks", [])) if architecture else []

        file_paths = session.scalars(
            select(FileEntry.path).where(FileEntry.repository_id == repository_id)
        ).all()
        top_level = self._top_level_directories(file_paths)
        config_files = sorted({path for path in file_paths if self._is_config_file(path)})

        return {
            "repository_id": str(repository_id),
            "name": repository.name,
            "root_path": repository.root_path or repository.path,
            "languages": languages,
            "frameworks": frameworks,
            "file_count": file_count,
            "symbol_count": symbol_count,
            "relationship_count": relationship_count,
            "module_count": module_count,
            "top_level_directories": top_level,
            "config_files": config_files,
            "git_branch": repository.default_branch,
            "status": repository.status,
            "last_scanned_at": repository.last_scanned_at,
        }

    @staticmethod
    def _top_level_directories(paths: list[str]) -> list[str]:
        seen: set[str] = set()
        for path in paths:
            seen.add(path.split("/", 1)[0])
        return sorted(seen)

    @staticmethod
    def _is_config_file(path: str) -> bool:
        name = path.rsplit("/", 1)[-1]
        return name in _CONFIG_FILENAMES

    # ------------------------------------------------------------ file tree

    def file_tree(
        self,
        session: Session,
        repository_id: uuid.UUID,
        *,
        depth: int = 3,
        children_limit: int = 200,
        limit: int = 50,
        offset: int = 0,
    ) -> dict:
        """Return a structured file tree rooted at the repository."""
        repository = self._require_repository(session, repository_id)
        rows = session.execute(
            select(FileEntry.path, FileEntry.language, FileEntry.id)
            .where(FileEntry.repository_id == repository_id)
            .order_by(FileEntry.path)
        ).all()

        root: dict = {"children": {}}
        for path, language, file_id in rows:
            parts = path.split("/")
            node = root
            for part in parts[:-1]:
                if part not in node["children"]:
                    node["children"][part] = {"children": {}}
                node = node["children"][part]
            node["children"][parts[-1]] = {
                "path": path,
                "language": language,
                "file_id": str(file_id),
                "leaf": True,
            }

        top_names = sorted(root["children"])
        total = len(top_names)
        truncated = False
        nodes = []
        for name in top_names[offset : offset + limit]:
            node, node_truncated = self._tree_node(
                name, root["children"][name], 1, depth, children_limit
            )
            truncated = truncated or node_truncated
            nodes.append(node)

        return {
            "repository_id": str(repository_id),
            "root": repository.name,
            "total": total,
            "limit": limit,
            "offset": offset,
            "truncated": truncated,
            "nodes": nodes,
        }

    def _tree_node(
        self, name: str, raw: dict, level: int, depth: int, children_limit: int
    ) -> tuple[FileTreeNode, bool]:
        """Convert a raw tree entry to a :class:`FileTreeNode`."""
        if raw.get("leaf"):
            return (
                FileTreeNode(
                    name=name,
                    path=raw["path"],
                    type="file",
                    language=raw.get("language"),
                    file_id=raw.get("file_id"),
                ),
                False,
            )

        truncated = False
        children: list[FileTreeNode] = []
        if level < depth:
            names = sorted(raw["children"])
            if len(names) > children_limit:
                truncated = True
                names = names[:children_limit]
            for child_name in names:
                child, child_truncated = self._tree_node(
                    child_name, raw["children"][child_name], level + 1, depth, children_limit
                )
                truncated = truncated or child_truncated
                children.append(child)
        elif raw["children"]:
            truncated = True

        return (
            FileTreeNode(
                name=name,
                path=name,
                type="dir",
                truncated=truncated,
                children=children,
            ),
            truncated,
        )

    # ------------------------------------------------------------ symbols

    def find_symbols(
        self,
        session: Session,
        repository_id: uuid.UUID,
        *,
        name: str | None = None,
        kind: str | None = None,
        language: str | None = None,
        exact: bool = False,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Symbol], int]:
        """Find symbols by exact or partial name, kind and language."""
        self._require_repository(session, repository_id)

        stmt = select(Symbol).where(Symbol.repository_id == repository_id)
        count_stmt = (
            select(func.count()).select_from(Symbol).where(Symbol.repository_id == repository_id)
        )
        if name:
            if exact:
                match = Symbol.name == name
            else:
                like = f"%{name}%"
                match = or_(Symbol.name.ilike(like), Symbol.qualified_name.ilike(like))
            stmt = stmt.where(match)
            count_stmt = count_stmt.where(match)
        if kind:
            stmt = stmt.where(Symbol.kind == kind)
            count_stmt = count_stmt.where(Symbol.kind == kind)
        if language:
            stmt = stmt.where(Symbol.language == language)
            count_stmt = count_stmt.where(Symbol.language == language)

        total = session.scalar(count_stmt) or 0
        rows = session.scalars(stmt.order_by(Symbol.kind, Symbol.name).offset(offset).limit(limit))
        return list(rows.all()), total

    # -------------------------------------------------------- relationships

    def relationships(
        self,
        session: Session,
        repository_id: uuid.UUID,
        *,
        kind: str | None = None,
        direction: str = "outgoing",
        file_path: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[RelationshipRow], int]:
        """Query relationship edges in one direction with optional filters.

        ``direction`` is ``outgoing`` (edges originating in this repository)
        or ``incoming`` (edges pointing at files in this repository).
        """
        self._require_repository(session, repository_id)

        src = aliased(FileEntry)
        tgt = aliased(FileEntry)
        src_sym = aliased(Symbol)
        tgt_sym = aliased(Symbol)

        base = (
            select(
                Dependency,
                src.path,
                tgt.path,
                src_sym.name,
                tgt_sym.name,
            )
            .join(src, src.id == Dependency.source_file_id, isouter=True)
            .join(tgt, tgt.id == Dependency.target_file_id, isouter=True)
            .join(src_sym, src_sym.id == Dependency.source_symbol_id, isouter=True)
            .join(tgt_sym, tgt_sym.id == Dependency.target_symbol_id, isouter=True)
            .where(Dependency.repository_id == repository_id)
        )

        if kind:
            base = base.where(Dependency.kind == kind)
        if direction == "incoming":
            base = base.where(Dependency.target_file_id.is_not(None))
            if file_path:
                base = base.where(tgt.path.ilike(f"%{file_path}%"))
        else:
            base = base.where(
                or_(
                    Dependency.source_file_id.is_not(None),
                    Dependency.kind == "manifest",
                )
            )
            if file_path:
                base = base.where(src.path.ilike(f"%{file_path}%"))

        count_stmt = select(func.count()).select_from(base.subquery())
        total = session.scalar(count_stmt) or 0

        rows = session.execute(
            base.order_by(Dependency.kind, Dependency.name).offset(offset).limit(limit)
        )
        results: list[RelationshipRow] = []
        for dep, source_path, target_path, source_symbol, target_symbol in rows:
            results.append(
                RelationshipRow(
                    id=str(dep.id),
                    kind=dep.kind,
                    name=dep.name,
                    direction=direction,
                    source_path=source_path,
                    target_path=target_path,
                    source_symbol=source_symbol,
                    target_symbol=target_symbol,
                    is_resolved=dep.is_resolved,
                    is_external=dep.is_external,
                    line=dep.line,
                )
            )
        return results, total

    def imports(
        self,
        session: Session,
        repository_id: uuid.UUID,
        *,
        direction: str = "outgoing",
        file_path: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[RelationshipRow], int]:
        """Import edges only (shorthand for ``relationships(kind='import')``)."""
        return self.relationships(
            session,
            repository_id,
            kind="import",
            direction=direction,
            file_path=file_path,
            limit=limit,
            offset=offset,
        )

    def dependencies(
        self,
        session: Session,
        repository_id: uuid.UUID,
        *,
        kind: str = "manifest",
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[RelationshipRow], int]:
        """External package dependencies declared in manifests."""
        return self.relationships(
            session,
            repository_id,
            kind=kind,
            direction="outgoing",
            limit=limit,
            offset=offset,
        )
