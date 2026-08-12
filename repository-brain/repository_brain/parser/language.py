"""Language detection based on file extension."""

from __future__ import annotations

from pathlib import PurePosixPath

#: Phase-1 supported languages mapped from file extensions.
EXTENSION_TO_LANGUAGE: dict[str, str] = {
    ".py": "python",
    ".pyi": "python",
    ".pyw": "python",
    ".ts": "typescript",
    ".mts": "typescript",
    ".cts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".jsx": "jsx",
    ".mjs": "javascript",
    ".cjs": "javascript",
    ".json": "json",
    ".jsonc": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".md": "markdown",
    ".mdx": "markdown",
}

#: Names that take precedence over extension-based detection.
FILENAME_TO_LANGUAGE: dict[str, str] = {
    "Dockerfile": "dockerfile",
    ".dockerignore": "ignore",
    ".gitignore": "ignore",
    "Makefile": "make",
}

#: Aliases used by tree-sitter language pack.
LANGUAGE_ALIASES: dict[str, str] = {
    "python": "python",
    "typescript": "typescript",
    "ts": "typescript",
    "javascript": "javascript",
    "js": "javascript",
    "tsx": "tsx",
    "react": "tsx",
    "jsx": "jsx",
    "json": "json",
    "yaml": "yaml",
    "yml": "yaml",
    "markdown": "markdown",
    "md": "markdown",
}


def extension_for_language(language: str) -> str:
    """Return a canonical file extension for a language (first match wins)."""
    for ext, lang in EXTENSION_TO_LANGUAGE.items():
        if lang == language:
            return ext
    return ".txt"


def language_for_path(path: str) -> str | None:
    """Detect the language of a file from its name and extension."""
    posix = PurePosixPath(path)
    name = posix.name
    if name in FILENAME_TO_LANGUAGE:
        return FILENAME_TO_LANGUAGE[name]
    ext = posix.suffix.lower()
    return EXTENSION_TO_LANGUAGE.get(ext)


def detect_language(path: str) -> str | None:
    """Detect the language, normalising aliases into tree-sitter names."""
    return language_for_path(path)


def supported_languages() -> list[str]:
    """Return the list of Phase-1 supported languages."""
    return sorted(set(EXTENSION_TO_LANGUAGE.values()))


def is_parseable(language: str | None) -> bool:
    """Return True when we have a tree-sitter grammar for this language."""
    if not language:
        return False
    return language in LANGUAGE_ALIASES
