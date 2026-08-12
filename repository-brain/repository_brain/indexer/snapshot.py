"""Snapshot engine: persist and restore repository knowledge to ``.brain/``.

The snapshot allows Repository Brain to restore repository knowledge without
rebuilding everything. Snapshots are written into the repository's ``.brain/``
directory when writable, otherwise into the managed storage directory.
"""

from __future__ import annotations

import json
import shutil
import uuid
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from repository_brain.core.logging import get_logger
from repository_brain.models.architecture import Architecture
from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.memory import RepositoryMemory
from repository_brain.models.module import Module, ModuleDependency, ModuleFile
from repository_brain.models.repository import Repository
from repository_brain.models.symbol import Symbol

log = get_logger("snapshot")

_SNAPSHOT_FILES = (
    "repository.json",
    "files.json",
    "symbols.json",
    "dependencies.json",
    "modules.json",
    "architecture.json",
    "summaries.json",
    "statistics.json",
    "metadata.json",
)


class SnapshotService:
    """Persists index state to disk and restores it."""

    def __init__(self, storage_dir: str | Path) -> None:
        self.storage_dir = Path(storage_dir)

    # ------------------------------------------------------------ save/load

    def snapshot_dir(self, repository: Repository) -> Path:
        """Return the preferred snapshot directory for a repository."""
        repo_brain = Path(repository.path) / ".brain"
        if self._is_writable(repo_brain):
            return repo_brain
        return self.storage_dir / "repositories" / str(repository.id) / ".brain"

    def save(self, session: Session, repository: Repository) -> Path:
        """Write a full snapshot for a repository. Returns the snapshot dir."""
        target = self.snapshot_dir(repository)
        target.mkdir(parents=True, exist_ok=True)

        self._write_json(target / "metadata.json", self._metadata(repository))
        self._write_json(target / "repository.json", self._repository(repository))
        self._write_json(target / "files.json", self._files(session, repository.id))
        self._write_json(target / "symbols.json", self._symbols(session, repository.id))
        self._write_json(target / "dependencies.json", self._dependencies(session, repository.id))
        self._write_json(target / "modules.json", self._modules(session, repository.id))
        self._write_json(target / "architecture.json", self._architecture(session, repository.id))
        self._write_json(target / "summaries.json", self._memory(session, repository.id))
        self._write_json(target / "statistics.json", self._statistics(session, repository.id))
        log.info("snapshot_saved", repository=repository.name, path=str(target))
        return target

    def load(self, session: Session, repository: Repository) -> bool:
        """Restore index state from a snapshot. Returns True on success."""
        source = self.snapshot_dir(repository)
        if not (source / "metadata.json").exists():
            return False
        try:
            self._restore_files(session, repository, source / "files.json")
            self._restore_symbols(session, repository, source / "symbols.json")
            self._restore_dependencies(session, repository, source / "dependencies.json")
            self._restore_modules(session, repository, source / "modules.json")
            self._restore_architecture(session, repository, source / "architecture.json")
            self._restore_memory(
                session, repository, source / "summaries.json", source / "statistics.json"
            )
            session.flush()
        except (OSError, ValueError, KeyError) as exc:
            log.warning("snapshot_restore_failed", repository=repository.name, error=str(exc))
            return False
        return True

    def delete(self, repository: Repository) -> None:
        """Remove the repository's snapshot directory."""
        target = self.snapshot_dir(repository)
        if target.exists():
            shutil.rmtree(target)
            log.info("snapshot_deleted", repository=repository.name)

    # ---------------------------------------------------------- serialisers

    @staticmethod
    def _metadata(repository: Repository) -> dict:
        return {
            "version": 1,
            "brain_version": "0.1.0",
            "repository_id": str(repository.id),
            "saved_at": repository.updated_at.isoformat() if repository.updated_at else None,
        }

    @staticmethod
    def _repository(repository: Repository) -> dict:
        return {
            "id": str(repository.id),
            "name": repository.name,
            "path": repository.path,
            "url": repository.url,
            "default_branch": repository.default_branch,
            "vcs": repository.vcs,
        }

    @staticmethod
    def _files(session: Session, repository_id: uuid.UUID) -> list[dict]:
        rows = session.scalars(select(FileEntry).where(FileEntry.repository_id == repository_id))
        return [
            {
                "path": f.path,
                "language": f.language,
                "size": f.size,
                "sha256": f.sha256,
                "mtime": f.mtime,
                "is_generated": f.is_generated,
                "is_binary": f.is_binary,
                "encoding": f.encoding,
                "line_count": f.line_count,
                "status": f.status,
            }
            for f in rows
        ]

    @staticmethod
    def _symbols(session: Session, repository_id: uuid.UUID) -> list[dict]:
        rows = session.scalars(select(Symbol).where(Symbol.repository_id == repository_id))
        return [
            {
                "file_path": s.file.path,
                "name": s.name,
                "qualified_name": s.qualified_name,
                "kind": s.kind,
                "language": s.language,
                "parent": s.parent.qualified_name if s.parent else None,
                "visibility": s.visibility,
                "is_exported": s.is_exported,
                "is_async": s.is_async,
                "is_abstract": s.is_abstract,
                "start_line": s.start_line,
                "end_line": s.end_line,
                "start_col": s.start_col,
                "end_col": s.end_col,
                "index": s.index,
                "docstring": s.docstring,
                "signature": s.signature,
                "metadata": s.extra,
            }
            for s in rows
        ]

    @staticmethod
    def _dependencies(session: Session, repository_id: uuid.UUID) -> list[dict]:
        rows = session.scalars(select(Dependency).where(Dependency.repository_id == repository_id))
        return [
            {
                "source_file": d.source_file.path if d.source_file else None,
                "target_file": d.target_file.path if d.target_file else None,
                "source_symbol": d.source_symbol.qualified_name if d.source_symbol else None,
                "target_symbol": d.target_symbol.qualified_name if d.target_symbol else None,
                "kind": d.kind,
                "name": d.name,
                "target_name": d.target_name,
                "is_resolved": d.is_resolved,
                "is_external": d.is_external,
                "line": d.line,
                "metadata": d.extra,
            }
            for d in rows
        ]

    @staticmethod
    def _modules(session: Session, repository_id: uuid.UUID) -> dict:
        modules = list(session.scalars(select(Module).where(Module.repository_id == repository_id)))
        result = {"modules": [], "module_dependencies": []}
        for module in modules:
            files = session.scalars(
                select(ModuleFile).where(ModuleFile.module_id == module.id)
            ).all()
            result["modules"].append(
                {
                    "name": module.name,
                    "path_prefix": module.path_prefix,
                    "kind": module.kind,
                    "summary": module.summary,
                    "score": module.score,
                    "metadata": module.extra,
                    "files": [{"path": mf.file.path, "role": mf.role} for mf in files],
                }
            )
        edges = session.scalars(
            select(ModuleDependency).where(ModuleDependency.repository_id == repository_id)
        ).all()
        module_names = {m.id: m.name for m in modules}
        for edge in edges:
            result["module_dependencies"].append(
                {
                    "source": module_names.get(edge.source_module_id),
                    "target": module_names.get(edge.target_module_id),
                    "kind": edge.kind,
                    "weight": edge.weight,
                }
            )
        return result

    @staticmethod
    def _architecture(session: Session, repository_id: uuid.UUID) -> dict:
        architecture = session.get(Architecture, repository_id)
        return architecture.content if architecture else {}

    @staticmethod
    def _memory(session: Session, repository_id: uuid.UUID) -> dict:
        memory = session.get(RepositoryMemory, repository_id)
        if memory is None:
            return {}
        return {
            "summary": memory.summary,
            "architecture_summary": memory.architecture_summary,
            "module_summaries": memory.module_summaries,
            "conventions": memory.conventions,
            "patterns": memory.patterns,
            "metadata": memory.extra,
            "version": memory.version,
        }

    @staticmethod
    def _statistics(session: Session, repository_id: uuid.UUID) -> dict:
        memory = session.get(RepositoryMemory, repository_id)
        return memory.statistics if memory else {}

    # ----------------------------------------------------------- restorers

    def _restore_files(self, session: Session, repository: Repository, path: Path) -> None:
        data = self._read_json(path)
        session.query(FileEntry).filter(FileEntry.repository_id == repository.id).delete()
        for item in data:
            session.add(
                FileEntry(
                    repository_id=repository.id,
                    path=item["path"],
                    language=item.get("language"),
                    size=item.get("size", 0),
                    sha256=item["sha256"],
                    mtime=item.get("mtime", 0.0),
                    is_generated=item.get("is_generated", False),
                    is_binary=item.get("is_binary", False),
                    encoding=item.get("encoding"),
                    line_count=item.get("line_count", 0),
                    status=item.get("status", "active"),
                )
            )

    def _restore_symbols(self, session: Session, repository: Repository, path: Path) -> None:
        data = self._read_json(path)
        session.query(Symbol).filter(Symbol.repository_id == repository.id).delete()
        path_to_file = self._file_map(session, repository.id)
        symbol_id: dict[tuple[str, str], uuid.UUID] = {}

        for item in data:
            file_entry = path_to_file.get(item["file_path"])
            if file_entry is None:
                continue
            parent_qualified = item.get("parent")
            parent_id = (
                symbol_id.get((item["file_path"], parent_qualified)) if parent_qualified else None
            )
            symbol = Symbol(
                id=uuid.uuid4(),
                repository_id=repository.id,
                file_id=file_entry.id,
                parent_id=parent_id,
                name=item["name"],
                qualified_name=item["qualified_name"],
                kind=item["kind"],
                language=item.get("language"),
                visibility=item.get("visibility"),
                is_exported=item.get("is_exported", False),
                is_async=item.get("is_async", False),
                is_abstract=item.get("is_abstract", False),
                start_line=item.get("start_line", 1),
                end_line=item.get("end_line", 1),
                start_col=item.get("start_col", 0),
                end_col=item.get("end_col", 0),
                index=item.get("index", 0),
                docstring=item.get("docstring"),
                signature=item.get("signature"),
                metadata=item.get("metadata", {}),
            )
            session.add(symbol)
            symbol_id[(item["file_path"], item["qualified_name"])] = symbol.id

    def _restore_dependencies(self, session: Session, repository: Repository, path: Path) -> None:
        data = self._read_json(path)
        session.query(Dependency).filter(Dependency.repository_id == repository.id).delete()
        path_to_file = self._file_map(session, repository.id)
        file_symbols = self._file_symbol_map(session, repository.id)

        for item in data:
            source_file = path_to_file.get(item["source_file"]) if item.get("source_file") else None
            target_file = path_to_file.get(item["target_file"]) if item.get("target_file") else None
            source_symbol = self._find_symbol(file_symbols, item.get("source_symbol"))
            target_symbol = self._find_symbol(file_symbols, item.get("target_symbol"))
            session.add(
                Dependency(
                    repository_id=repository.id,
                    source_file_id=source_file.id if source_file else None,
                    target_file_id=target_file.id if target_file else None,
                    source_symbol_id=source_symbol.id if source_symbol else None,
                    target_symbol_id=target_symbol.id if target_symbol else None,
                    kind=item["kind"],
                    name=item["name"],
                    target_name=item.get("target_name"),
                    is_resolved=item.get("is_resolved", False),
                    is_external=item.get("is_external", False),
                    line=item.get("line"),
                    metadata=item.get("metadata", {}),
                )
            )

    def _restore_modules(self, session: Session, repository: Repository, path: Path) -> None:
        data = self._read_json(path)
        session.query(Module).filter(Module.repository_id == repository.id).delete()
        path_to_file = self._file_map(session, repository.id)
        module_ids: dict[str, uuid.UUID] = {}

        for item in data.get("modules", []):
            module = Module(
                repository_id=repository.id,
                name=item["name"],
                path_prefix=item.get("path_prefix"),
                kind=item.get("kind", "auto"),
                summary=item.get("summary"),
                score=item.get("score", 0.0),
                metadata=item.get("metadata", {}),
            )
            session.add(module)
            session.flush()
            module_ids[item["name"]] = module.id
            for file_ref in item.get("files", []):
                file_entry = path_to_file.get(file_ref["path"])
                if file_entry is None:
                    continue
                session.add(
                    ModuleFile(
                        module_id=module.id,
                        file_id=file_entry.id,
                        role=file_ref.get("role", "core"),
                    )
                )

        for edge in data.get("module_dependencies", []):
            source_id = module_ids.get(edge.get("source"))
            target_id = module_ids.get(edge.get("target"))
            if source_id is None or target_id is None:
                continue
            session.add(
                ModuleDependency(
                    repository_id=repository.id,
                    source_module_id=source_id,
                    target_module_id=target_id,
                    kind=edge.get("kind", "import"),
                    weight=edge.get("weight", 1),
                )
            )

    def _restore_architecture(self, session: Session, repository: Repository, path: Path) -> None:
        content = self._read_json(path)
        architecture = session.get(Architecture, repository.id)
        if architecture is None:
            architecture = Architecture(repository_id=repository.id, content={})
            session.add(architecture)
        architecture.content = content or {}

    def _restore_memory(
        self,
        session: Session,
        repository: Repository,
        summaries_path: Path,
        statistics_path: Path,
    ) -> None:
        data = self._read_json(summaries_path)
        statistics = self._read_json(statistics_path)
        memory = session.get(RepositoryMemory, repository.id)
        if memory is None:
            memory = RepositoryMemory(repository_id=repository.id)
            session.add(memory)
        memory.summary = data.get("summary", "")
        memory.architecture_summary = data.get("architecture_summary", "")
        memory.module_summaries = data.get("module_summaries", {})
        memory.conventions = data.get("conventions", {})
        memory.patterns = data.get("patterns", {})
        memory.statistics = statistics
        memory.extra = data.get("metadata", {})
        memory.version = data.get("version", 1)

    # ------------------------------------------------------------ utilities

    def _file_map(self, session: Session, repository_id: uuid.UUID) -> dict[str, FileEntry]:
        rows = session.scalars(select(FileEntry).where(FileEntry.repository_id == repository_id))
        return {f.path: f for f in rows}

    def _file_symbol_map(self, session: Session, repository_id: uuid.UUID) -> dict[str, Symbol]:
        rows = session.scalars(select(Symbol).where(Symbol.repository_id == repository_id))
        return {s.qualified_name: s for s in rows}

    @staticmethod
    def _find_symbol(mapping: dict[str, Symbol], qualified: str | None) -> Symbol | None:
        if not qualified:
            return None
        return mapping.get(qualified)

    @staticmethod
    def _is_writable(path: Path) -> bool:
        try:
            path.mkdir(parents=True, exist_ok=True)
            probe = path / ".write_probe"
            probe.write_text("ok")
            probe.unlink()
            return True
        except OSError:
            return False

    @staticmethod
    def _write_json(path: Path, data) -> None:
        with path.open("w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=2, default=str)

    @staticmethod
    def _read_json(path: Path):
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
