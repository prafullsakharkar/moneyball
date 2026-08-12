"""Default ignore rules for the file scanner."""

from __future__ import annotations

import fnmatch
from pathlib import PurePosixPath

#: Directories that are always skipped during a scan.
DEFAULT_IGNORED_DIRECTORIES: set[str] = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    ".venv",
    "venv",
    "__pycache__",
    ".cache",
    ".idea",
    ".vscode",
    ".tox",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    ".next",
    ".turbo",
    "target",
    "out",
    ".gradle",
    ".terraform",
    "site-packages",
    ".brain",
}

#: Glob patterns matched against the file name.
DEFAULT_IGNORED_PATTERNS: set[str] = {
    "*.pyc",
    "*.pyo",
    "*.so",
    "*.dylib",
    "*.dll",
    "*.exe",
    "*.class",
    "*.o",
    "*.a",
    "*.map",
    "*.min.js",
    "*.min.css",
    "*.lock",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "poetry.lock",
    "*.log",
}

#: File names treated as generated or lockfiles.
GENERATED_NAMES: set[str] = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "poetry.lock",
    "Cargo.lock",
    "go.sum",
    "composer.lock",
    "Gemfile.lock",
}


def _matches(name: str, pattern: str) -> bool:
    return fnmatch.fnmatch(name, pattern)


def should_ignore(
    path: str,
    *,
    extra_patterns: set[str] | None = None,
    extra_directories: set[str] | None = None,
) -> bool:
    """Return True when a relative path should be ignored.

    ``path`` must be a forward-slash relative path (POSIX style). A trailing
    slash (directory path) is normalized away before matching.
    """
    path = path.rstrip("/")
    parts = PurePosixPath(path).parts
    dirs = DEFAULT_IGNORED_DIRECTORIES | (extra_directories or set())
    for part in parts[:-1]:
        if part in dirs:
            return True
    if parts and parts[-1] in dirs:
        return True

    name = parts[-1]
    patterns = DEFAULT_IGNORED_PATTERNS | (extra_patterns or set())
    if name in patterns:
        return True
    return any(_matches(name, pattern) for pattern in patterns)


def is_generated_file(path: str) -> bool:
    """Return True when a file is considered generated (lockfiles, bundles)."""
    name = PurePosixPath(path).name
    if name in GENERATED_NAMES:
        return True
    return name.endswith((".min.js", ".min.css"))
