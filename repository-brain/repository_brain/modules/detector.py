"""Automatic logical module detection."""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import PurePosixPath

#: Directories that never become modules on their own.
_SKIP_DIRS = {
    ".github",
    "node_modules",
    "dist",
    "build",
    "coverage",
    ".venv",
    "venv",
    "__pycache__",
    ".git",
    "docs",
}

#: File roles inferred from path patterns.
_ROLE_PATTERNS = {
    "test": ("test", "spec", "_test", ".test.", ".spec."),
    "config": ("config", "settings", "setup", ".conf", ".config"),
    "docs": (".md", ".rst", ".txt"),
}


@dataclass(slots=True)
class ModuleDraft:
    """A detected logical module."""

    name: str
    path_prefix: str
    files: list[str] = field(default_factory=list)
    kind: str = "auto"
    score: float = 0.0


def _role(path: str) -> str:
    name = PurePosixPath(path).name.lower()
    for role, patterns in _ROLE_PATTERNS.items():
        for pattern in patterns:
            if pattern in name or name.endswith(pattern):
                return role
    return "core"


def _group_level(paths: list[str]) -> int:
    """Choose how many path components define a module group."""
    first_levels: dict[str, int] = defaultdict(int)
    for path in paths:
        parts = [p for p in PurePosixPath(path).parts if p]
        if not parts:
            continue
        first_levels[parts[0]] += 1

    if len(first_levels) == 1:
        only = next(iter(first_levels))
        if first_levels[only] < 5:
            return 1
        return 2
    return 1


def detect_modules(paths: list[str]) -> list[ModuleDraft]:
    """Detect logical modules from a repository's file paths.

    Groups files by their top-level (or second-level, for single-package
    repositories) directory and assigns each group a role-based score.
    """
    if not paths:
        return []

    level = _group_level(paths)
    groups: dict[str, list[str]] = defaultdict(list)
    root_files: list[str] = []

    for path in paths:
        parts = [p for p in PurePosixPath(path).parts if p]
        if len(parts) <= level:
            root_files.append(path)
            continue
        key = parts[level - 1]
        if key in _SKIP_DIRS:
            continue
        prefix = "/".join(parts[:level])
        groups[prefix].append(path)

    drafts: list[ModuleDraft] = []
    for prefix, group_paths in sorted(groups.items()):
        name = prefix.replace("/", ".")
        drafts.append(
            ModuleDraft(
                name=name,
                path_prefix=prefix,
                files=group_paths,
                score=_score(group_paths),
            )
        )

    if root_files:
        drafts.append(
            ModuleDraft(
                name="core",
                path_prefix="",
                files=root_files,
                score=_score(root_files) + 1.0,
            )
        )

    return sorted(drafts, key=lambda m: m.score, reverse=True)


def _score(paths: list[str]) -> float:
    if not paths:
        return 0.0
    roles = [role for path in paths if (role := _role(path))]
    core = sum(1 for r in roles if r == "core")
    tests = sum(1 for r in roles if r == "test")
    configs = sum(1 for r in roles if r == "config")
    score = core * 2 + configs + tests * 0.5
    return score / len(paths)
