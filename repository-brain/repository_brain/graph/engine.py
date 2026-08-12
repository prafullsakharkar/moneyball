"""Dependency engine: build and persist dependency edges."""

from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from repository_brain.core.logging import get_logger
from repository_brain.graph.resolver import PathResolver
from repository_brain.models.dependency import Dependency
from repository_brain.models.file import FileEntry
from repository_brain.models.symbol import Symbol
from repository_brain.parser.result import ParsedFile

log = get_logger("graph")

_ENCLOSING_KINDS = {"function", "method", "component", "class"}


@dataclass(slots=True)
class DependencyBuildResult:
    """Summary of a dependency build operation."""

    edges: int = 0
    resolved: int = 0
    external: int = 0


class RepoGraphContext:
    """Cached repository state used while resolving dependency edges."""

    def __init__(self, session: Session, repository_id: uuid.UUID) -> None:
        self.session = session
        self.repository_id = repository_id
        self.path_to_file: dict[str, FileEntry] = {}
        self.file_symbols: dict[uuid.UUID, dict[str, list[Symbol]]] = {}
        self._load_files()

    def _load_files(self) -> None:
        rows = self.session.execute(
            select(FileEntry).where(FileEntry.repository_id == self.repository_id)
        ).scalars()
        for file_entry in rows:
            self.path_to_file[file_entry.path] = file_entry

    def get_file(self, path: str) -> FileEntry | None:
        return self.path_to_file.get(path)

    def symbols_by_name(self, file_id: uuid.UUID) -> dict[str, list[Symbol]]:
        if file_id not in self.file_symbols:
            rows = self.session.execute(select(Symbol).where(Symbol.file_id == file_id)).scalars()
            mapping: dict[str, list[Symbol]] = {}
            for symbol in rows:
                mapping.setdefault(symbol.name, []).append(symbol)
            self.file_symbols[file_id] = mapping
        return self.file_symbols[file_id]


class DependencyEngine:
    """Builds the repository dependency graph for a set of changed files."""

    def __init__(self) -> None:
        self.log = get_logger("graph.engine")

    # ------------------------------------------------------------ public API

    def build_for_repo(
        self,
        session: Session,
        repository_id: uuid.UUID,
        changed_files: list[tuple[FileEntry, ParsedFile]],
        *,
        aliases: dict[str, str] | None = None,
    ) -> DependencyBuildResult:
        """Build dependency edges for all changed files in one pass."""
        ctx = RepoGraphContext(session, repository_id)
        resolver = PathResolver(set(ctx.path_to_file.keys()), aliases=aliases or {})
        total = DependencyBuildResult()
        for file_entry, parsed in changed_files:
            result = self.build_for_file(session, ctx, resolver, file_entry, parsed)
            total.edges += result.edges
            total.resolved += result.resolved
            total.external += result.external
        session.flush()
        return total

    def build_for_file(
        self,
        session: Session,
        ctx: RepoGraphContext,
        resolver: PathResolver,
        file_entry: FileEntry,
        parsed: ParsedFile,
    ) -> DependencyBuildResult:
        """Replace all dependency edges originating from ``file_entry``."""
        session.execute(delete(Dependency).where(Dependency.source_file_id == file_entry.id))
        session.flush()

        file_symbols = ctx.symbols_by_name(file_entry.id)
        by_id = self._file_symbol_by_id(ctx, file_entry.id)
        result = DependencyBuildResult()
        seen: set[tuple] = set()

        imported_names = self._resolve_imports(
            session, ctx, resolver, file_entry, parsed, result, seen
        )

        self._resolve_calls(session, ctx, file_entry, parsed, imported_names, by_id, result, seen)
        self._resolve_inheritance(
            session, ctx, file_entry, parsed, file_symbols, imported_names, result, seen
        )

        session.flush()
        return result

    # ------------------------------------------------------------ imports

    def _resolve_imports(
        self,
        session: Session,
        ctx: RepoGraphContext,
        resolver: PathResolver,
        file_entry: FileEntry,
        parsed: ParsedFile,
        result: DependencyBuildResult,
        seen: set[tuple],
    ) -> dict[str, tuple[FileEntry | None, Symbol | None]]:
        """Create import edges and return a name -> (file, symbol) map."""
        imported: dict[str, tuple[FileEntry | None, Symbol | None]] = {}
        language = file_entry.language or ""

        for import_ref in parsed.imports:
            target_path, is_external = resolver.resolve_import(
                import_ref.name,
                import_ref.symbol_name,
                source_language=language,
                source_path=file_entry.path,
            )
            target_file = ctx.get_file(target_path) if target_path else None
            target_symbol: Symbol | None = None

            if target_file is not None:
                if import_ref.symbol_name and import_ref.symbol_name != "*":
                    candidates = ctx.symbols_by_name(target_file.id).get(import_ref.symbol_name, [])
                    if candidates:
                        target_symbol = candidates[0]
                else:
                    last = import_ref.name.split(".")[-1]
                    candidates = ctx.symbols_by_name(target_file.id).get(last, [])
                    if candidates:
                        target_symbol = candidates[0]

            if target_file is not None or is_external:
                key = ("import", import_ref.name, import_ref.line)
                if key not in seen:
                    seen.add(key)
                    session.add(
                        Dependency(
                            repository_id=file_entry.repository_id,
                            source_file_id=file_entry.id,
                            target_file_id=target_file.id if target_file else None,
                            target_symbol_id=target_symbol.id if target_symbol else None,
                            kind="import",
                            name=import_ref.name,
                            target_name=import_ref.symbol_name or import_ref.alias,
                            is_resolved=target_file is not None,
                            is_external=is_external,
                            line=import_ref.line,
                        )
                    )
                    result.edges += 1
                    if target_file is not None:
                        result.resolved += 1
                    elif is_external:
                        result.external += 1

            bind_name = import_ref.alias or import_ref.symbol_name
            if bind_name and bind_name != "*":
                imported[bind_name] = (target_file, target_symbol)
            if import_ref.alias is None and import_ref.symbol_name is None:
                last_segment = import_ref.name.split(".")[-1]
                imported[last_segment] = (target_file, target_symbol)

        return imported

    def _match_imported_module_symbol(
        self,
        ctx: RepoGraphContext,
        target_file: FileEntry,
        import_ref,
        _target_symbol: Symbol | None,
    ) -> None:
        """Best-effort match of a module import to a symbol in the target file."""
        last = import_ref.name.split(".")[-1] if import_ref.name else ""
        candidates = ctx.symbols_by_name(target_file.id).get(last, [])
        if candidates:
            return candidates[0]
        return None

    # ------------------------------------------------------------ calls

    def _resolve_calls(
        self,
        session: Session,
        ctx: RepoGraphContext,
        file_entry: FileEntry,
        parsed: ParsedFile,
        imported_names: dict[str, tuple[FileEntry | None, Symbol | None]],
        symbols_by_id: dict[uuid.UUID, Symbol],
        result: DependencyBuildResult,
        seen: set[tuple],
    ) -> None:
        enclosing_ranges = self._enclosing_ranges(file_entry.id, symbols_by_id)

        for call in parsed.calls:
            callee = call.name
            target_file: FileEntry | None = None
            target_symbol: Symbol | None = None

            if "." in callee:
                obj, _, attr = callee.partition(".")
                if obj in imported_names:
                    target_file, _ = imported_names[obj]
                    if target_file is not None:
                        for cand in ctx.symbols_by_name(target_file.id).get(attr, []):
                            target_symbol = cand
                            break
            elif callee in imported_names:
                target_file, target_symbol = imported_names[callee]
            else:
                local = ctx.symbols_by_name(file_entry.id).get(callee, [])
                if local:
                    target_file = file_entry
                    target_symbol = local[0]

            source_symbol = self._enclosing_for_line(enclosing_ranges, call.line)
            key = ("call", call.name, call.line)
            if key not in seen:
                seen.add(key)
                session.add(
                    Dependency(
                        repository_id=file_entry.repository_id,
                        source_file_id=file_entry.id,
                        target_file_id=target_file.id if target_file else None,
                        source_symbol_id=source_symbol.id if source_symbol else None,
                        target_symbol_id=target_symbol.id if target_symbol else None,
                        kind="call",
                        name=callee,
                        target_name=target_symbol.name if target_symbol else None,
                        is_resolved=target_symbol is not None,
                        is_external=target_file is None and target_symbol is None,
                        line=call.line,
                    )
                )
                result.edges += 1
                if target_symbol is not None:
                    result.resolved += 1
                elif target_file is None and target_symbol is None:
                    result.external += 1

    # -------------------------------------------------------- inheritance

    def _resolve_inheritance(
        self,
        session: Session,
        ctx: RepoGraphContext,
        file_entry: FileEntry,
        parsed: ParsedFile,
        file_symbols: dict[str, list[Symbol]],
        imported_names: dict[str, tuple[FileEntry | None, Symbol | None]],
        result: DependencyBuildResult,
        seen: set[tuple],
    ) -> None:
        for parsed_symbol in parsed.symbols:
            if parsed_symbol.kind != "class" or not parsed_symbol.bases:
                continue
            class_symbols = file_symbols.get(parsed_symbol.name, [])
            if not class_symbols:
                continue
            source_symbol = class_symbols[0]

            for base in parsed_symbol.bases:
                target_symbol: Symbol | None = None
                if base in file_symbols:
                    target_symbol = file_symbols[base][0]
                elif base in imported_names:
                    _, target_symbol = imported_names[base]
                elif "." in base:
                    obj, _, attr = base.partition(".")
                    if obj in imported_names:
                        target_file, _ = imported_names[obj]
                        if target_file is not None:
                            for cand in ctx.symbols_by_name(target_file.id).get(attr, []):
                                target_symbol = cand
                                break

                key = ("inheritance", base, parsed_symbol.name)
                if key not in seen:
                    seen.add(key)
                    session.add(
                        Dependency(
                            repository_id=file_entry.repository_id,
                            source_file_id=file_entry.id,
                            source_symbol_id=source_symbol.id,
                            target_file_id=(target_symbol.file_id if target_symbol else None),
                            target_symbol_id=target_symbol.id if target_symbol else None,
                            kind="inheritance",
                            name=base,
                            target_name=base,
                            is_resolved=target_symbol is not None,
                            is_external=target_symbol is None,
                            line=parsed_symbol.start_line,
                        )
                    )
                    result.edges += 1
                    if target_symbol is not None:
                        result.resolved += 1
                    else:
                        result.external += 1

    # ------------------------------------------------------------ helpers

    def _file_symbol_by_id(
        self, ctx: RepoGraphContext, file_id: uuid.UUID
    ) -> dict[uuid.UUID, Symbol]:
        symbols = {}
        for group in ctx.symbols_by_name(file_id).values():
            for symbol in group:
                symbols[symbol.id] = symbol
        return symbols

    def _enclosing_ranges(
        self, _file_id: uuid.UUID, symbols_by_id: dict[uuid.UUID, Symbol]
    ) -> list[tuple[int, int, Symbol]]:
        """Sorted list of ``(start, end, symbol)`` for enclosing-capable symbols."""
        ranges: list[tuple[int, int, Symbol]] = []
        for symbol in symbols_by_id.values():
            if symbol.kind in _ENCLOSING_KINDS:
                ranges.append((symbol.start_line, symbol.end_line, symbol))
        ranges.sort(key=lambda item: (item[0], item[1]))
        return ranges

    def _enclosing_for_line(
        self, ranges: list[tuple[int, int, Symbol]], line: int
    ) -> Symbol | None:
        """Return the innermost symbol whose line range contains ``line``."""
        best: Symbol | None = None
        for start, end, symbol in ranges:
            if start <= line <= end:
                if best is None or (end - start) < (best.end_line - best.start_line):
                    best = symbol
            elif start > line:
                break
        return best
