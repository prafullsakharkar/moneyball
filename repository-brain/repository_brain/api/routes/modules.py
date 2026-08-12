"""Module query endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from repository_brain.api.dependencies import get_db
from repository_brain.models.file import FileEntry
from repository_brain.models.module import Module, ModuleDependency
from repository_brain.models.symbol import Symbol
from repository_brain.schemas.module import ModuleDetailOut, ModuleGraphOut, ModuleOut, ModulePage

router = APIRouter(prefix="/modules", tags=["modules"])


def _to_out(module: Module, file_count: int = 0, symbol_count: int = 0) -> ModuleOut:
    return ModuleOut(
        id=str(module.id),
        repository_id=str(module.repository_id),
        name=module.name,
        path_prefix=module.path_prefix,
        kind=module.kind,
        summary=module.summary,
        score=module.score,
        metadata=module.extra,
        file_count=file_count,
        symbol_count=symbol_count,
    )


@router.get("/graph/repository/{repository_id}", response_model=ModuleGraphOut)
def module_graph(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
) -> ModuleGraphOut:
    modules = list(session.scalars(select(Module).where(Module.repository_id == repository_id)))
    module_ids = {m.id for m in modules}
    edges = list(
        session.scalars(
            select(ModuleDependency).where(
                ModuleDependency.repository_id == repository_id,
                ModuleDependency.source_module_id.in_(module_ids),
            )
        )
    )
    return ModuleGraphOut(
        nodes=[{"id": str(m.id), "name": m.name, "score": m.score} for m in modules],
        edges=[
            {
                "source": str(e.source_module_id),
                "target": str(e.target_module_id),
                "kind": e.kind,
                "weight": e.weight,
            }
            for e in edges
        ],
    )


@router.get("", response_model=ModulePage)
def list_modules(
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
) -> ModulePage:
    modules = list(session.scalars(select(Module).where(Module.repository_id == repository_id)))
    all_file_ids = [mf.file_id for module in modules for mf in module.files]
    symbol_counts: dict[uuid.UUID, int] = {}
    if all_file_ids:
        rows = session.execute(
            select(Symbol.file_id, func.count(Symbol.id))
            .where(Symbol.file_id.in_(all_file_ids))
            .group_by(Symbol.file_id)
        ).all()
        symbol_counts = dict(rows)

    items = []
    for module in modules:
        file_count = len(module.files)
        file_ids = [mf.file_id for mf in module.files]
        symbol_count = sum(symbol_counts.get(fid, 0) for fid in file_ids)
        items.append(_to_out(module, file_count=file_count, symbol_count=symbol_count))
    return ModulePage(items=items, total=len(items), limit=len(items), offset=0)


@router.get("/{name}", response_model=ModuleDetailOut)
def get_module(
    name: str,
    repository_id: uuid.UUID,
    session: Session = Depends(get_db),
) -> ModuleDetailOut:
    module = session.scalar(
        select(Module).where(Module.repository_id == repository_id, Module.name == name)
    )
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    file_ids = [mf.file_id for mf in module.files]
    files = (
        list(session.scalars(select(FileEntry.path).where(FileEntry.id.in_(file_ids))))
        if file_ids
        else []
    )
    symbols = (
        list(
            session.scalars(
                select(Symbol.qualified_name)
                .where(Symbol.file_id.in_(file_ids))
                .order_by(Symbol.index)
                .limit(200)
            )
        )
        if file_ids
        else []
    )
    outbound = list(
        session.scalars(
            select(ModuleDependency.target_module_id).where(
                ModuleDependency.source_module_id == module.id
            )
        )
    )
    inbound = list(
        session.scalars(
            select(ModuleDependency.source_module_id).where(
                ModuleDependency.target_module_id == module.id
            )
        )
    )
    target_names = (
        list(session.scalars(select(Module.name).where(Module.id.in_(outbound))))
        if outbound
        else []
    )
    source_names = (
        list(session.scalars(select(Module.name).where(Module.id.in_(inbound)))) if inbound else []
    )

    return ModuleDetailOut(
        **_to_out(module, file_count=len(file_ids), symbol_count=len(symbols)).model_dump(),
        files=files,
        symbols=symbols,
        dependencies=target_names,
        dependents=source_names,
    )
