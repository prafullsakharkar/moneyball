"""Shared ORM -> schema serialisers for API routes."""

from __future__ import annotations

from repository_brain.models.file import FileEntry
from repository_brain.models.symbol import Symbol
from repository_brain.schemas.file import FileOut
from repository_brain.schemas.symbol import SymbolOut


def symbol_to_out(symbol: Symbol) -> SymbolOut:
    return SymbolOut(
        id=str(symbol.id),
        repository_id=str(symbol.repository_id),
        file_id=str(symbol.file_id),
        file_path=symbol.file.path if symbol.file else None,
        parent_id=str(symbol.parent_id) if symbol.parent_id else None,
        name=symbol.name,
        qualified_name=symbol.qualified_name,
        kind=symbol.kind,
        language=symbol.language,
        visibility=symbol.visibility,
        is_exported=symbol.is_exported,
        is_async=symbol.is_async,
        is_abstract=symbol.is_abstract,
        start_line=symbol.start_line,
        end_line=symbol.end_line,
        start_col=symbol.start_col,
        end_col=symbol.end_col,
        docstring=symbol.docstring,
        signature=symbol.signature,
        metadata=symbol.extra,
    )


def file_to_out(file_entry: FileEntry) -> FileOut:
    return FileOut(
        id=str(file_entry.id),
        repository_id=str(file_entry.repository_id),
        path=file_entry.path,
        language=file_entry.language,
        size=file_entry.size,
        sha256=file_entry.sha256,
        mtime=file_entry.mtime,
        is_generated=file_entry.is_generated,
        is_binary=file_entry.is_binary,
        encoding=file_entry.encoding,
        line_count=file_entry.line_count,
        status=file_entry.status,
        indexed_at=file_entry.indexed_at,
    )
