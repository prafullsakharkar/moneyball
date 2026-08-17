"""Symbol persistence and querying service."""

from __future__ import annotations

import uuid

from sqlalchemy import Select, delete, func, select
from sqlalchemy.orm import Session

from repository_brain.core.errors import SymbolNotFoundError
from repository_brain.models.file import FileEntry
from repository_brain.models.symbol import Symbol
from repository_brain.parser.result import ParsedFile, ParsedSymbol


class SymbolQuery:
    """Build symbol queries. Exists to keep the service small and focused."""

    @staticmethod
    def by_name(session: Session, repository_id: uuid.UUID, name: str) -> Select:
        return select(Symbol).where(Symbol.repository_id == repository_id, Symbol.name == name)

    @staticmethod
    def by_qualified_name(
        session: Session, repository_id: uuid.UUID, qualified_name: str
    ) -> Select:
        return select(Symbol).where(
            Symbol.repository_id == repository_id,
            Symbol.qualified_name == qualified_name,
        )

    @staticmethod
    def by_kind(session: Session, repository_id: uuid.UUID, kind: str) -> Select:
        return select(Symbol).where(Symbol.repository_id == repository_id, Symbol.kind == kind)


class SymbolService:
    """Stores parsed symbols for a file and queries the symbol database."""

    # ------------------------------------------------------------ persistence

    def replace_file_symbols(
        self,
        session: Session,
        repository_id: uuid.UUID,
        file_entry: FileEntry,
        parsed: ParsedFile,
    ) -> int:
        """Replace all symbols of ``file_entry`` with freshly parsed ones.

        Returns the number of symbols written. Deletes existing symbols for the
        file first so incremental re-parsing never leaves stale rows behind.

        Symbols are deduplicated on their qualified name within the file (first
        occurrence wins) so redefinitions or parser repeats never violate the
        ``(repository_id, file_id, qualified_name)`` uniqueness constraint and
        re-indexing never creates duplicate rows.
        """
        session.execute(delete(Symbol).where(Symbol.file_id == file_entry.id))
        session.flush()

        created_by_qualified: dict[str, uuid.UUID] = {}
        count = 0

        for parsed_symbol in parsed.symbols:
            qualified = parsed_symbol.qualified_name or parsed_symbol.name
            if qualified in created_by_qualified:
                continue
            parent_id = self._resolve_parent_id(parsed_symbol, qualified, created_by_qualified)

            symbol = self._to_model(repository_id, file_entry, parsed_symbol, parent_id)
            session.add(symbol)
            created_by_qualified[qualified] = symbol.id
            count += 1

        session.flush()
        return count

    @staticmethod
    def _resolve_parent_id(
        parsed_symbol: ParsedSymbol,
        qualified_name: str,
        created_by_qualified: dict[str, uuid.UUID],
    ) -> uuid.UUID | None:
        """Resolve the parent symbol id from the qualified name.

        The parent of a nested symbol is its qualified name without the last
        component (e.g. ``Outer.Inner.method`` -> ``Outer.Inner``). Matching on
        qualified names rather than bare names keeps parent links correct even
        when unrelated symbols share a simple name.
        """
        if parsed_symbol.parent_name is None:
            return None
        parent_qualified = qualified_name.rsplit(".", 1)[0]
        if parent_qualified == qualified_name:
            return None
        return created_by_qualified.get(parent_qualified)

    def _to_model(
        self,
        repository_id: uuid.UUID,
        file_entry: FileEntry,
        parsed: ParsedSymbol,
        parent_id: uuid.UUID | None,
    ) -> Symbol:
        return Symbol(
            id=uuid.uuid4(),
            repository_id=repository_id,
            file_id=file_entry.id,
            parent_id=parent_id,
            name=parsed.name,
            qualified_name=parsed.qualified_name or parsed.name,
            kind=parsed.kind,
            language=file_entry.language,
            visibility=parsed.visibility,
            is_exported=parsed.is_exported,
            is_async=parsed.is_async,
            is_abstract=parsed.is_abstract,
            start_line=parsed.start_line,
            end_line=parsed.end_line,
            start_col=parsed.start_col,
            end_col=parsed.end_col,
            index=parsed.index,
            docstring=parsed.docstring,
            signature=parsed.signature,
            extra={
                "decorators": parsed.decorators,
                "bases": parsed.bases,
            },
        )

    # ------------------------------------------------------------ querying

    def get(self, session: Session, symbol_id: uuid.UUID) -> Symbol:
        symbol = session.get(Symbol, symbol_id)
        if symbol is None:
            raise SymbolNotFoundError(f"Symbol not found: {symbol_id}")
        return symbol

    def find(
        self,
        session: Session,
        repository_id: uuid.UUID,
        *,
        name: str | None = None,
        kind: str | None = None,
        qualified_name: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Symbol], int]:
        """Find symbols by optional filters."""
        stmt = select(Symbol).where(Symbol.repository_id == repository_id)
        count_stmt = (
            select(func.count()).select_from(Symbol).where(Symbol.repository_id == repository_id)
        )
        if name:
            stmt = stmt.where(Symbol.name == name)
            count_stmt = count_stmt.where(Symbol.name == name)
        if kind:
            stmt = stmt.where(Symbol.kind == kind)
            count_stmt = count_stmt.where(Symbol.kind == kind)
        if qualified_name:
            stmt = stmt.where(Symbol.qualified_name == qualified_name)
            count_stmt = count_stmt.where(Symbol.qualified_name == qualified_name)

        total = session.scalar(count_stmt) or 0
        rows = session.scalars(stmt.offset(offset).limit(limit)).all()
        return list(rows), total

    def resolve_by_qualified_name(
        self, session: Session, repository_id: uuid.UUID, qualified_name: str
    ) -> Symbol | None:
        return session.scalar(SymbolQuery.by_qualified_name(session, repository_id, qualified_name))

    def remove_file_symbols(self, session: Session, file_entry_id: uuid.UUID) -> None:
        session.execute(delete(Symbol).where(Symbol.file_id == file_entry_id))
