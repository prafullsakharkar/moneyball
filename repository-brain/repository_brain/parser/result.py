"""Data structures produced by source code parsers."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class ParsedSymbol:
    """A single named construct extracted from a source file."""

    name: str
    kind: str
    start_line: int
    end_line: int
    start_col: int = 0
    end_col: int = 0
    parent_name: str | None = None
    qualified_name: str | None = None
    docstring: str | None = None
    signature: str | None = None
    is_async: bool = False
    is_exported: bool = False
    is_abstract: bool = False
    visibility: str | None = None
    decorators: list[str] = field(default_factory=list)
    bases: list[str] = field(default_factory=list)
    index: int = 0


@dataclass(slots=True)
class ImportRef:
    """An import/require statement."""

    name: str  # the imported module path (e.g. "os.path", "./utils")
    symbol_name: str | None = None  # for `from x import y` / named imports
    alias: str | None = None
    line: int = 0


@dataclass(slots=True)
class CallRef:
    """A function/method call site."""

    name: str  # callee as written (e.g. "parse", "service.get_user")
    line: int = 0


@dataclass(slots=True)
class ParsedFile:
    """The result of parsing a single file."""

    path: str
    language: str
    symbols: list[ParsedSymbol] = field(default_factory=list)
    imports: list[ImportRef] = field(default_factory=list)
    calls: list[CallRef] = field(default_factory=list)
    module_doc: str | None = None
    errors: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.errors
