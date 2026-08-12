"""Per-language tree-sitter configuration."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True, slots=True)
class LanguageConfig:
    """Configuration describing how to extract symbols from a language."""

    name: str
    #: Mapping of tree-sitter node type -> symbol kind.
    node_types: dict[str, str]
    #: Node types that make nested function-like definitions become methods.
    class_node_types: set[str]
    #: Extra node types to record as fields/properties within classes/interfaces.
    field_node_types: set[str] = field(default_factory=set)
    #: Whether `export` wrappers mark a symbol as exported.
    export_wrapper: str | None = "export_statement"
    #: Whether leading decorators (Python) should be recorded.
    has_decorators: bool = False
    #: Whether docstrings are extracted from a body-leading string node.
    has_docstrings: bool = False
    #: Whether JSX nodes indicate a React component.
    is_jsx: bool = False


_PYTHON_NODE_TYPES = {
    "class_definition": "class",
    "function_definition": "function",
    "type_alias_statement": "type",
    "assignment": "variable",
}

_TS_NODE_TYPES = {
    "function_declaration": "function",
    "generator_function_declaration": "function",
    "class_declaration": "class",
    "abstract_class_declaration": "class",
    "method_definition": "method",
    "interface_declaration": "interface",
    "enum_declaration": "enum",
    "type_alias_declaration": "type",
    "namespace_declaration": "module",
    "internal_module": "module",
    "lexical_declaration": "variable",
    "variable_declaration": "variable",
    "function_signature": "function",
    "method_signature": "method",
    "call_signature": "function",
    "construct_signature": "method",
    "ambient_declaration": "variable",
}

_JS_NODE_TYPES = {
    "function_declaration": "function",
    "generator_function_declaration": "function",
    "class_declaration": "class",
    "method_definition": "method",
    "lexical_declaration": "variable",
    "variable_declaration": "variable",
}

_TS_FIELD_NODE_TYPES = {
    "public_field_definition",
    "property_signature",
    "private_property_signature",
}

LANGUAGE_CONFIGS: dict[str, LanguageConfig] = {
    "python": LanguageConfig(
        name="python",
        node_types=_PYTHON_NODE_TYPES,
        class_node_types={"class_definition"},
        has_decorators=True,
        has_docstrings=True,
    ),
    "typescript": LanguageConfig(
        name="typescript",
        node_types=_TS_NODE_TYPES,
        class_node_types={"class_declaration", "abstract_class_declaration"},
        field_node_types=_TS_FIELD_NODE_TYPES,
        export_wrapper="export_statement",
    ),
    "javascript": LanguageConfig(
        name="javascript",
        node_types=_JS_NODE_TYPES,
        class_node_types={"class_declaration"},
        export_wrapper="export_statement",
    ),
    "tsx": LanguageConfig(
        name="tsx",
        node_types=_TS_NODE_TYPES,
        class_node_types={"class_declaration", "abstract_class_declaration"},
        field_node_types=_TS_FIELD_NODE_TYPES,
        export_wrapper="export_statement",
        is_jsx=True,
    ),
    "jsx": LanguageConfig(
        name="jsx",
        node_types=_JS_NODE_TYPES,
        class_node_types={"class_declaration"},
        export_wrapper="export_statement",
        is_jsx=True,
    ),
    "json": LanguageConfig(name="json", node_types={}, class_node_types=set()),
    "yaml": LanguageConfig(name="yaml", node_types={}, class_node_types=set()),
    "markdown": LanguageConfig(name="markdown", node_types={}, class_node_types=set()),
}


def get_language_config(language: str) -> LanguageConfig | None:
    """Return the configuration for a language, if known."""
    return LANGUAGE_CONFIGS.get(language)
