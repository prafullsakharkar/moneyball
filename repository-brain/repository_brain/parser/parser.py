"""Tree-sitter based source code parsing."""

from __future__ import annotations

import threading
from pathlib import Path

from tree_sitter import Node, Parser
from tree_sitter_language_pack import get_parser

from repository_brain.core.logging import get_logger
from repository_brain.parser.configs import LanguageConfig, get_language_config
from repository_brain.parser.language import is_parseable, language_for_path
from repository_brain.parser.result import CallRef, ImportRef, ParsedFile, ParsedSymbol

log = get_logger("parser")

_CONTANER_KINDS = {"class", "interface", "enum", "module"}


def _text(node: Node | None, source: str) -> str:
    if node is None:
        return ""
    return source[node.start_byte : node.end_byte]


def _strip_quotes(value: str) -> str:
    value = value.strip()
    quote = ("'''", '"""', "```", "'", '"', "`")
    for q in quote:
        if value.startswith(q) and value.endswith(q) and len(value) >= len(q) * 2:
            return value[len(q) : -len(q)]
    return value


class TreeSitterExtractor:
    """Walks a tree-sitter tree and extracts symbols, imports and calls."""

    def __init__(self, config: LanguageConfig, source: str, path: str) -> None:
        self.config = config
        self.source = source
        self.path = path
        self.symbols: list[ParsedSymbol] = []
        self.imports: list[ImportRef] = []
        self.calls: list[CallRef] = []
        self._index = 0

    # ------------------------------------------------------------------ API

    def extract(self, root: Node) -> tuple[list[ParsedSymbol], list[ImportRef], list[CallRef]]:
        self._walk(root, [], None)
        self._import_walk(root)
        self._call_walk(root)
        return self.symbols, self._dedupe(self.imports), self._dedupe(self.calls)

    # ------------------------------------------------------------- walker

    def _walk(
        self,
        node: Node,
        stack: list[tuple[str, str]],
        pending_decorators: list[str] | None,
    ) -> None:
        node_type = node.type

        if node_type == "decorated_definition" and self.config.has_decorators:
            decorators = self._extract_decorators(node)
            for child in node.named_children:
                if child.type in self.config.node_types:
                    self._walk(child, stack, decorators)
            return

        if node_type in self.config.node_types:
            symbol = self._build_symbol(node, node_type, stack, pending_decorators)
            if symbol is not None:
                self.symbols.append(symbol)
                if symbol.kind in _CONTANER_KINDS:
                    stack.append((symbol.name, symbol.kind))
                    self._walk_children(node, stack)
                    stack.pop()
                return

        if node_type == "variable_declarator":
            self._handle_variable_declarator(node, stack)
            return

        if node_type == "assignment" and self.config.name == "python":
            self._handle_python_assignment(node, stack)
            return

        if (
            node_type in self.config.field_node_types
            and stack
            and stack[-1][1] in ("class", "interface")
        ):
            self._handle_field(node, stack)
            return

        if (
            node_type == "arrow_function"
            and node.parent is not None
            and node.parent.type == "export_statement"
        ):
            self._handle_default_export_function(node, stack)
            return

        self._walk_children(node, stack)

    def _walk_children(self, node: Node, stack: list[tuple[str, str]]) -> None:
        for child in node.named_children:
            self._walk(child, stack, None)

    # ------------------------------------------------------ symbol building

    def _build_symbol(
        self,
        node: Node,
        node_type: str,
        stack: list[tuple[str, str]],
        pending_decorators: list[str] | None,
    ) -> ParsedSymbol | None:
        name_node = node.child_by_field_name("name")
        if name_node is None:
            return None
        name = name_node.text.decode("utf-8", "replace")

        kind = self.config.node_types[node_type]
        parent_name = stack[-1][0] if stack else None
        parent_kind = stack[-1][1] if stack else None

        if kind in ("function", "method") and parent_kind in ("class", "interface"):
            kind = "method"

        exported = self._is_exported(node)
        is_async = self._is_async(node)
        decorators = pending_decorators or []
        bases = self._extract_bases(node) if kind == "class" else []
        signature = self._extract_signature(node)
        docstring = self._extract_docstring(node) if self.config.has_docstrings else None
        body = node.child_by_field_name("body")
        is_abstract = self._is_abstract(node, node_type, kind, decorators, bases)
        visibility = _visibility(name, node)

        if (
            self.config.is_jsx
            and kind in ("function", "method")
            and body is not None
            and self._contains_jsx(body)
        ):
            kind = "component"

        qualified = ".".join([part[0] for part in stack] + [name]) if stack else name

        self._index += 1
        return ParsedSymbol(
            name=name,
            kind=kind,
            start_line=node.start_point.row + 1,
            end_line=node.end_point.row + 1,
            start_col=node.start_point.column,
            end_col=node.end_point.column,
            parent_name=parent_name,
            qualified_name=qualified,
            docstring=docstring,
            signature=signature,
            is_async=is_async,
            is_exported=exported,
            is_abstract=is_abstract,
            visibility=visibility,
            decorators=decorators,
            bases=bases,
            index=self._index,
        )

    def _handle_variable_declarator(self, node: Node, stack: list[tuple[str, str]]) -> None:
        name_node = node.child_by_field_name("name")
        value = node.child_by_field_name("value")
        if name_node is None:
            return
        name = name_node.text.decode("utf-8", "replace")
        value_type = value.type if value is not None else None

        if value_type in ("arrow_function", "function_expression"):
            kind = "component" if self.config.is_jsx and self._contains_jsx(value) else "function"
        elif value_type == "class_expression":
            kind = "class"
        else:
            kind = "variable"

        parent_name = stack[-1][0] if stack else None
        exported = self._is_exported(node.parent) or self._is_exported(node.parent.parent)
        qualified = ".".join([part[0] for part in stack] + [name]) if stack else name

        self._index += 1
        symbol = ParsedSymbol(
            name=name,
            kind=kind,
            start_line=node.start_point.row + 1,
            end_line=node.end_point.row + 1,
            start_col=node.start_point.column,
            end_col=node.end_point.column,
            parent_name=parent_name,
            qualified_name=qualified,
            is_exported=exported,
            is_async=value_type == "arrow_function" and self._is_async(node),
            visibility=_visibility(name, node),
            signature=self._extract_signature(value)
            if value_type in ("arrow_function", "function_expression")
            else None,
            index=self._index,
        )
        self.symbols.append(symbol)

    def _handle_python_assignment(self, node: Node, stack: list[tuple[str, str]]) -> None:
        left = node.child_by_field_name("left")
        if left is None or left.type != "identifier":
            return
        name = left.text.decode("utf-8", "replace")
        if name.startswith("__") and name.endswith("__"):
            return
        value = node.child_by_field_name("right")
        value_type = value.type if value is not None else None

        if value_type in ("lambda",):
            kind = "function"
        elif value_type in ("list", "dict", "set", "tuple") or (
            value_type in ("call", "attribute") and value is not None
        ):
            kind = "variable"
        else:
            kind = "variable"

        parent_name = stack[-1][0] if stack else None
        qualified = ".".join([part[0] for part in stack] + [name]) if stack else name

        self._index += 1
        self.symbols.append(
            ParsedSymbol(
                name=name,
                kind=kind,
                start_line=node.start_point.row + 1,
                end_line=node.end_point.row + 1,
                start_col=node.start_point.column,
                end_col=node.end_point.column,
                parent_name=parent_name,
                qualified_name=qualified,
                is_exported=False,
                visibility=_visibility(name, node),
                index=self._index,
            )
        )

    def _handle_field(self, node: Node, stack: list[tuple[str, str]]) -> None:
        name_node = node.child_by_field_name("name")
        if name_node is None:
            return
        name = name_node.text.decode("utf-8", "replace")
        value = node.child_by_field_name("value")
        kind = (
            "method"
            if value is not None and value.type in ("arrow_function", "function_expression")
            else "field"
        )

        parent_name = stack[-1][0] if stack else None
        qualified = ".".join([part[0] for part in stack] + [name]) if stack else name

        self._index += 1
        self.symbols.append(
            ParsedSymbol(
                name=name,
                kind=kind,
                start_line=node.start_point.row + 1,
                end_line=node.end_point.row + 1,
                start_col=node.start_point.column,
                end_col=node.end_point.column,
                parent_name=parent_name,
                qualified_name=qualified,
                is_exported=self._is_exported(node),
                visibility=_visibility(name, node),
                index=self._index,
            )
        )

    def _handle_default_export_function(self, node: Node, stack: list[tuple[str, str]]) -> None:
        name = "default"
        parent_name = stack[-1][0] if stack else None
        self._index += 1
        self.symbols.append(
            ParsedSymbol(
                name=name,
                kind="component" if self.config.is_jsx and self._contains_jsx(node) else "function",
                start_line=node.start_point.row + 1,
                end_line=node.end_point.row + 1,
                start_col=node.start_point.column,
                end_col=node.end_point.column,
                parent_name=parent_name,
                qualified_name=".".join([part[0] for part in stack] + [name]) if stack else name,
                is_exported=True,
                index=self._index,
            )
        )

    # -------------------------------------------------------------- helpers

    def _is_exported(self, node: Node | None) -> bool:
        if node is None or self.config.export_wrapper is None:
            return False
        parent = node.parent
        return parent is not None and parent.type == self.config.export_wrapper

    def _is_async(self, node: Node) -> bool:
        if node.child_by_field_name("async") is not None:
            return True
        prefix = self.source[node.start_byte : node.start_byte + 5]
        return prefix == "async"

    def _is_abstract(
        self,
        _node: Node,
        node_type: str,
        kind: str,
        decorators: list[str],
        bases: list[str],
    ) -> bool:
        if node_type in ("abstract_class_declaration",):
            return True
        if kind == "class" and (not decorators and not bases):
            return False
        if any("abstract" in d for d in decorators):
            return True
        return any(b.endswith("ABC") or "abc.ABC" in b for b in bases)

    def _extract_decorators(self, node: Node) -> list[str]:
        names: list[str] = []
        for child in node.named_children:
            if child.type != "decorator":
                continue
            inner = child.text.decode("utf-8", "replace").lstrip("@").strip()
            names.append(inner)
        return names

    def _extract_bases(self, node: Node) -> list[str]:
        superclasses = node.child_by_field_name("superclasses")
        if superclasses is None:
            return []
        return [
            child.text.decode("utf-8", "replace").strip()
            for child in superclasses.named_children
            if child.type != "comment"
        ]

    def _extract_docstring(self, node: Node) -> str | None:
        raw: str | None = None
        if node.type == "module":
            if not node.named_children:
                return None
            first = node.named_children[0]
            if first.type == "string":
                raw = first.text.decode("utf-8", "replace")
            elif first.type == "expression_statement" and first.named_children:
                first_child = first.named_children[0]
                if first_child.type == "string":
                    raw = first_child.text.decode("utf-8", "replace")
        else:
            body = node.child_by_field_name("body")
            if body is not None:
                for child in body.named_children:
                    if child.type in ("expression_statement", "module"):
                        first = child.named_children[0] if child.named_children else None
                        if first is not None and first.type == "string":
                            raw = first.text.decode("utf-8", "replace")
                            break
                    if child.type == "string":
                        raw = child.text.decode("utf-8", "replace")
                        break
        if raw is None:
            return None
        return _strip_quotes(raw)

    def _extract_signature(self, node: Node) -> str | None:
        body = node.child_by_field_name("body")
        if body is None:
            return None
        text = self.source[node.start_byte : body.start_byte].strip()
        return text or None

    def _contains_jsx(self, node: Node) -> bool:
        if node.type.startswith("jsx_") or node.type in ("jsx_element", "jsx_self_closing_element"):
            return True
        return any(self._contains_jsx(child) for child in node.named_children)

    # ------------------------------------------------- imports and calls

    def _extract_imports(self, root: Node) -> list[ImportRef]:
        self._import_walk(root)
        return self._dedupe(self.imports)

    def _import_walk(self, node: Node) -> None:
        node_type = node.type
        is_python = self.config.name == "python"
        if node_type == "import_statement":
            if is_python:
                self._handle_python_import(node)
            else:
                self._handle_ts_import(node)
        elif node_type == "import_from_statement":
            self._handle_python_from_import(node)
        elif node_type in ("import_equals_declaration",):
            self._handle_ts_import_equals(node)
        elif node_type == "call_expression":
            self._handle_require_call(node)
        for child in node.named_children:
            self._import_walk(child)

    def _handle_ts_import(self, node: Node) -> None:
        source_node = node.child_by_field_name("source")
        module = (
            _strip_quotes(source_node.text.decode("utf-8", "replace"))
            if source_node is not None
            else ""
        )
        if not module:
            return

        def add(symbol: str, alias: str | None) -> None:
            self.imports.append(
                ImportRef(
                    name=module, symbol_name=symbol, alias=alias, line=node.start_point.row + 1
                )
            )

        import_clause = None
        for child in node.named_children:
            if child.type == "import_clause":
                import_clause = child
                break

        if import_clause is None:
            add("*", None)
            return

        for clause_child in import_clause.named_children:
            if clause_child.type == "identifier":
                add(clause_child.text.decode("utf-8", "replace"), None)
            elif clause_child.type == "namespace_import":
                ident = clause_child.named_children[0]
                if ident is not None:
                    add("*", ident.text.decode("utf-8", "replace"))
            elif clause_child.type == "named_imports":
                for spec in clause_child.named_children:
                    if spec.type != "import_specifier":
                        continue
                    name_node = spec.child_by_field_name("name")
                    alias_node = spec.child_by_field_name("alias")
                    name = (
                        name_node.text.decode("utf-8", "replace") if name_node is not None else ""
                    )
                    alias = (
                        alias_node.text.decode("utf-8", "replace")
                        if alias_node is not None
                        else None
                    )
                    add(name, alias)

    def _handle_python_import(self, node: Node) -> None:
        for name_field in node.children_by_field_name("name"):
            if name_field.type == "aliased_import":
                module_node = name_field.child_by_field_name("name")
                alias_node = name_field.child_by_field_name("alias")
                module = (
                    module_node.text.decode("utf-8", "replace") if module_node is not None else ""
                )
                alias = (
                    alias_node.text.decode("utf-8", "replace") if alias_node is not None else None
                )
            elif name_field.type == "dotted_name":
                module = name_field.text.decode("utf-8", "replace")
                alias = None
            else:
                continue
            self.imports.append(
                ImportRef(name=module, symbol_name=None, alias=alias, line=node.start_point.row + 1)
            )

    def _handle_python_from_import(self, node: Node) -> None:
        module_node = node.child_by_field_name("module_name")
        module = ""
        if module_node is not None and module_node.type in ("dotted_name", "relative_import"):
            module = module_node.text.decode("utf-8", "replace")

        for name_field in node.children_by_field_name("name"):
            if name_field.type == "dotted_name":
                symbol_name = name_field.text.decode("utf-8", "replace")
                alias = None
            elif name_field.type == "aliased_import":
                symbol_node = name_field.child_by_field_name("name")
                alias_node = name_field.child_by_field_name("alias")
                symbol_name = (
                    symbol_node.text.decode("utf-8", "replace") if symbol_node is not None else ""
                )
                alias = (
                    alias_node.text.decode("utf-8", "replace") if alias_node is not None else None
                )
            else:
                continue
            self.imports.append(
                ImportRef(
                    name=module,
                    symbol_name=symbol_name,
                    alias=alias,
                    line=node.start_point.row + 1,
                )
            )

    def _handle_ts_import_equals(self, node: Node) -> None:
        for child in node.named_children:
            if child.type == "string":
                self.imports.append(
                    ImportRef(
                        name=_strip_quotes(child.text.decode("utf-8", "replace")),
                        line=node.start_point.row + 1,
                    )
                )

    def _handle_require_call(self, node: Node) -> None:
        function = node.child_by_field_name("function")
        if function is None or function.type != "identifier":
            return
        if function.text.decode("utf-8", "replace") != "require":
            return
        arguments = node.child_by_field_name("arguments")
        if arguments is None:
            return
        first = arguments.named_children[0] if arguments.named_children else None
        if first is not None and first.type == "string":
            self.imports.append(
                ImportRef(
                    name=_strip_quotes(first.text.decode("utf-8", "replace")),
                    line=node.start_point.row + 1,
                )
            )

    def _extract_calls(self, root: Node) -> list[CallRef]:
        self._call_walk(root)
        return self._dedupe(self.calls)

    def _call_walk(self, node: Node) -> None:
        node_type = node.type
        if node_type in ("call", "call_expression", "new_expression"):
            if node_type == "new_expression":
                constructor = node.child_by_field_name("constructor")
                if constructor is not None:
                    self._record_call(constructor, node)
            else:
                function = node.child_by_field_name("function")
                if function is not None and function.type in (
                    "identifier",
                    "attribute",
                    "member_expression",
                    "subscript_expression",
                ):
                    self._record_call(function, node)
        for child in node.named_children:
            self._call_walk(child)

    def _record_call(self, function: Node, parent: Node) -> None:
        name = function.text.decode("utf-8", "replace").strip()
        if not name or name in ("require", "import"):
            return
        self.calls.append(CallRef(name=name, line=parent.start_point.row + 1))

    @staticmethod
    def _dedupe(items):
        seen: set[tuple] = set()
        result = []
        for item in items:
            key = tuple(getattr(item, field.name) for field in item.__dataclass_fields__.values())
            if key in seen:
                continue
            seen.add(key)
            result.append(item)
        return result


def _visibility(name: str, node: Node) -> str:
    if name.startswith("__") and not name.endswith("__"):
        return "private"
    if name.startswith("_"):
        return "private"
    prefix = node.parent.text[:8] if node.parent is not None else b""
    if b"private" in prefix:
        return "private"
    if b"protected" in prefix:
        return "protected"
    return "public"


class ParsingService:
    """Parses source files into structured symbols, imports and calls."""

    def __init__(self) -> None:
        self._local = threading.local()

    def _parser_for(self, language: str) -> Parser:
        cache = getattr(self._local, "parsers", None)
        if cache is None:
            cache = {}
            self._local.parsers = cache
        parser = cache.get(language)
        if parser is None:
            parser = get_parser(language)
            cache[language] = parser
        return parser

    def parse(
        self,
        content: str,
        *,
        path: str = "",
        language: str | None = None,
    ) -> ParsedFile:
        """Parse ``content`` and return structured information."""
        detected = language or language_for_path(path)
        parsed = ParsedFile(path=path, language=detected or "unknown")

        config = get_language_config(detected or "")
        if config is None or not is_parseable(detected or ""):
            return parsed
        if not config.node_types:
            return parsed

        try:
            source_bytes = content.encode("utf-8")
            tree = self._parser_for(detected or "").parse(source_bytes)
        except Exception as exc:  # pragma: no cover - defensive
            parsed.errors.append(str(exc))
            return parsed

        root = tree.root_node
        extractor = TreeSitterExtractor(config, content, path)
        symbols, imports, calls = extractor.extract(root)
        parsed.symbols = symbols
        parsed.imports = imports
        parsed.calls = calls
        parsed.module_doc = extractor._extract_docstring(root)
        return parsed

    def parse_file(self, file_path: str | Path) -> ParsedFile:
        """Read and parse a file from disk."""
        path = str(file_path)
        from repository_brain.scanner.filesystem import read_text_safely

        content = read_text_safely(path)
        return self.parse(content, path=path, language=language_for_path(path))


class ParserRegistry:
    """Registry of available parsers.

    Repository Brain currently ships a single tree-sitter based parser. The
    registry exists to satisfy the extensibility principle: future parsers
    (regex fallbacks, plugin parsers) can be added without touching callers.
    """

    def __init__(self) -> None:
        self._parsers = {"default": ParsingService()}

    def get(self, name: str = "default") -> ParsingService:
        if name not in self._parsers:
            raise KeyError(f"Unknown parser: {name}")
        return self._parsers[name]
