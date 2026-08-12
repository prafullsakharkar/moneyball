"""Repository statistics collection."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Integer, func, select
from sqlalchemy.orm import Session

from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.module import Module
from repository_brain.models.symbol import Symbol


def collect_statistics(session: Session, repository_id: uuid.UUID) -> dict:
    """Compute aggregate statistics for a repository."""
    file_rows = session.execute(
        select(
            FileEntry.language,
            FileEntry.status,
            func.count().label("count"),
            func.coalesce(func.sum(FileEntry.line_count), 0).label("lines"),
            func.coalesce(func.sum(FileEntry.size), 0).label("bytes"),
            func.coalesce(func.sum(func.cast(FileEntry.is_generated, Integer)), 0).label(
                "generated"
            ),
            func.coalesce(func.sum(func.cast(FileEntry.is_binary, Integer)), 0).label("binary"),
        )
        .where(FileEntry.repository_id == repository_id)
        .group_by(FileEntry.language, FileEntry.status)
    ).all()

    by_language: dict[str, int] = {}
    by_status: dict[str, int] = {}
    total_files = 0
    total_lines = 0
    total_bytes = 0
    generated = 0
    binary = 0
    for language, status, count, lines, bytes_, gen, bin_ in file_rows:
        lang = language or "unknown"
        by_language[lang] = by_language.get(lang, 0) + count
        by_status[status] = by_status.get(status, 0) + count
        total_files += count
        total_lines += lines
        total_bytes += bytes_
        generated += gen
        binary += bin_

    symbol_rows = session.execute(
        select(Symbol.kind, func.count())
        .where(Symbol.repository_id == repository_id)
        .group_by(Symbol.kind)
    ).all()
    symbols_by_kind = dict(symbol_rows)
    total_symbols = sum(symbols_by_kind.values())

    dep_rows = session.execute(
        select(
            Dependency.kind,
            func.count(),
            func.coalesce(func.sum(func.cast(Dependency.is_resolved, Integer)), 0),
            func.coalesce(func.sum(func.cast(Dependency.is_external, Integer)), 0),
        )
        .where(Dependency.repository_id == repository_id)
        .group_by(Dependency.kind)
    ).all()
    dependencies_by_kind = {
        kind: {"total": total, "resolved": resolved, "external": external}
        for kind, total, resolved, external in dep_rows
    }
    total_dependencies = sum(v["total"] for v in dependencies_by_kind.values())

    modules = (
        session.scalar(
            select(func.count()).select_from(Module).where(Module.repository_id == repository_id)
        )
        or 0
    )

    return {
        "files": {
            "total": total_files,
            "by_language": by_language,
            "by_status": by_status,
            "generated": generated,
            "binary": binary,
            "total_lines": total_lines,
            "total_bytes": total_bytes,
        },
        "symbols": {
            "total": total_symbols,
            "by_kind": symbols_by_kind,
        },
        "dependencies": {
            "total": total_dependencies,
            "by_kind": dependencies_by_kind,
        },
        "modules": {"total": modules},
        "languages": by_language,
        "generated_at": datetime.now(UTC).isoformat(),
    }
