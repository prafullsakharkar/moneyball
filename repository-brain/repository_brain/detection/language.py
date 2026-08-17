"""Deterministic language detection for repository metadata.

The language detector maps file extensions to canonical, human-readable
language names (e.g. ``.py`` -> "Python"). It walks the repository in a
bounded, deterministic way and returns a sorted, deduplicated list of the
languages used.

This is intentionally a separate layer from :mod:`repository_brain.parser.language`
which keeps lower-case tree-sitter names for parsing: repository metadata
should surface canonical display names.
"""

from __future__ import annotations

import os
from pathlib import Path, PurePosixPath

from repository_brain.scanner.ignore import DEFAULT_IGNORED_DIRECTORIES, should_ignore

#: File extensions mapped to canonical display names. Lower-cased before lookup.
EXTENSION_TO_LANGUAGE: dict[str, str] = {
    ".py": "Python",
    ".pyi": "Python",
    ".pyw": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".mjs": "JavaScript",
    ".cjs": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".mts": "TypeScript",
    ".cts": "TypeScript",
    ".java": "Java",
    ".go": "Go",
    ".rs": "Rust",
    ".cpp": "C++",
    ".c": "C",
    ".h": "C/C++",
    ".hpp": "C++",
    ".cs": "C#",
    ".rb": "Ruby",
    ".php": "PHP",
    ".kt": "Kotlin",
    ".kts": "Kotlin",
    ".swift": "Swift",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".toml": "TOML",
    ".xml": "XML",
    ".md": "Markdown",
    ".markdown": "Markdown",
}

#: Filenames resolved before extension-based detection.
FILENAME_TO_LANGUAGE: dict[str, str] = {
    "Dockerfile": "Dockerfile",
    "Makefile": "Makefile",
    "CMakeLists.txt": "CMake",
}

#: Directories pruned during the walk.
SKIP_DIRECTORIES: set[str] = DEFAULT_IGNORED_DIRECTORIES | {
    ".hg",
    ".svn",
    ".ruff_cache",
}


class LanguageDetector:
    """Detect the set of languages used by files in a repository."""

    def __init__(self, *, limit: int = 10_000) -> None:
        self.limit = limit

    def detect(self, path: str | Path, *, limit: int | None = None) -> list[str]:
        """Return sorted, deduplicated canonical language names.

        The walk is bounded by ``limit`` examined files so a synchronous index
        call can never traverse an unbounded number of files on large
        repositories. Skip directories (VCS metadata, virtualenvs, build
        output, package caches) and gitignore-style file patterns are pruned
        using the shared scanner ignore rules.
        """
        bound = self.limit if limit is None else limit
        root = Path(path).expanduser().resolve()
        languages: set[str] = set()
        examined = 0
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRECTORIES]
            for filename in filenames:
                if examined >= bound:
                    return sorted(languages)
                examined += 1
                full = Path(dirpath) / filename
                try:
                    relative = full.relative_to(root).as_posix()
                except ValueError:
                    continue
                if should_ignore(relative):
                    continue
                language = self.language_for_path(relative)
                if language is not None:
                    languages.add(language)
        return sorted(languages)

    def language_for_path(self, path: str) -> str | None:
        """Return the canonical language name for a single relative path."""
        posix = PurePosixPath(path)
        name = posix.name
        if name in FILENAME_TO_LANGUAGE:
            return FILENAME_TO_LANGUAGE[name]
        return EXTENSION_TO_LANGUAGE.get(posix.suffix.lower())
