"""Module persistence and module-level dependency building."""

from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from repository_brain.core.logging import get_logger
from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.module import Module, ModuleDependency, ModuleFile
from repository_brain.modules.detector import detect_modules
from repository_brain.symbols.service import SymbolService


@dataclass(slots=True)
class ModuleBuildResult:
    modules: int = 0
    module_files: int = 0
    module_dependencies: int = 0


class ModuleService:
    """Rebuilds the module graph for a repository."""

    def __init__(self) -> None:
        self.log = get_logger("modules")
        self._symbol_service = SymbolService()

    def rebuild(self, session: Session, repository_id: uuid.UUID) -> ModuleBuildResult:
        """Recreate modules from current files, then build module edges."""
        files = list(
            session.scalars(
                select(FileEntry).where(
                    FileEntry.repository_id == repository_id,
                    FileEntry.status == "active",
                )
            )
        )
        paths = [f.path for f in files]
        path_to_file = {f.path: f for f in files}

        session.execute(delete(Module).where(Module.repository_id == repository_id))
        session.flush()

        result = ModuleBuildResult()
        module_by_prefix: dict[str, Module] = {}

        for draft in detect_modules(paths):
            module = Module(
                repository_id=repository_id,
                name=draft.name,
                path_prefix=draft.path_prefix,
                kind=draft.kind,
                score=draft.score,
                extra={"role_counts": _role_counts(draft.files)},
            )
            session.add(module)
            result.modules += 1
            session.flush()
            module_by_prefix[draft.path_prefix] = module

            for path in draft.files:
                file_entry = path_to_file.get(path)
                if file_entry is None:
                    continue
                session.add(
                    ModuleFile(
                        module_id=module.id,
                        file_id=file_entry.id,
                        role=_file_role(path),
                    )
                )
                result.module_files += 1

        self._build_module_dependencies(session, repository_id, module_by_prefix)
        session.flush()
        return result

    def _build_module_dependencies(
        self,
        session: Session,
        repository_id: uuid.UUID,
        module_by_prefix: dict[str, Module],
    ) -> None:
        """Aggregate file-level edges into module-level edges."""
        if not module_by_prefix:
            return

        module_of_file: dict[uuid.UUID, Module] = {}
        for module in module_by_prefix.values():
            for mf in module.files:
                module_of_file[mf.file_id] = module

        weights: dict[tuple[uuid.UUID, uuid.UUID, str], int] = {}
        rows = session.execute(
            select(Dependency).where(
                Dependency.repository_id == repository_id,
                Dependency.is_resolved.is_(True),
            )
        ).scalars()

        for dep in rows:
            source = module_of_file.get(dep.source_file_id)
            target = module_of_file.get(dep.target_file_id)
            if source is None or target is None or source.id == target.id:
                continue
            key = (source.id, target.id, dep.kind)
            weights[key] = weights.get(key, 0) + 1

        for (source_id, target_id, kind), weight in weights.items():
            session.add(
                ModuleDependency(
                    repository_id=repository_id,
                    source_module_id=source_id,
                    target_module_id=target_id,
                    kind=kind,
                    weight=weight,
                )
            )


def _file_role(path: str) -> str:
    from repository_brain.modules.detector import _role

    return _role(path)


def _role_counts(paths: list[str]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for path in paths:
        role = _file_role(path)
        counts[role] = counts.get(role, 0) + 1
    return counts
