"""Default ignore rules for the file scanner."""

from __future__ import annotations

import fnmatch
from dataclasses import dataclass
from pathlib import Path, PurePosixPath

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


# ---------------------------------------------------------------- .gitignore


@dataclass(frozen=True, slots=True)
class GitIgnoreRule:
    """A single parsed .gitignore rule (patterns are matched in order)."""

    pattern: str
    negated: bool = False
    dir_only: bool = False


def parse_gitignore(text: str) -> list[GitIgnoreRule]:
    """Parse ``.gitignore`` text into ordered rules (last match wins)."""
    rules: list[GitIgnoreRule] = []
    for raw in text.splitlines():
        line = raw.rstrip()
        if not line or line.startswith("#"):
            continue
        negated = line.startswith("!")
        if negated:
            line = line[1:]
        dir_only = line.endswith("/")
        if dir_only:
            line = line[:-1]
        if line.startswith("/"):
            line = line[1:]
        if not line:
            continue
        rules.append(GitIgnoreRule(pattern=line, negated=negated, dir_only=dir_only))
    return rules


def load_gitignore(directory: Path) -> list[GitIgnoreRule]:
    """Load the rules from ``directory/.gitignore`` (best-effort)."""
    gitignore = directory / ".gitignore"
    if not gitignore.is_file():
        return []
    try:
        text = gitignore.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return []
    return parse_gitignore(text)


def _rule_matches(rule: GitIgnoreRule, rel: str) -> bool:
    """Match a rule against a path relative to the rule's base directory."""
    name = rel.split("/")[-1]
    if rule.dir_only:
        return fnmatch.fnmatch(name, rule.pattern)
    if "/" in rule.pattern:
        return fnmatch.fnmatch(rel, rule.pattern)
    return fnmatch.fnmatch(name, rule.pattern) or fnmatch.fnmatch(rel, f"*/{rule.pattern}")


def gitignore_matches(
    rel: str,
    *,
    is_dir: bool,
    rules: list[tuple[str, GitIgnoreRule]],
) -> bool:
    """Return True when ``rel`` (repo-root-relative) is ignored by the rules.

    ``rules`` is an ordered list of ``(base_rel, rule)`` pairs where
    ``base_rel`` is the directory (relative to the repository root) containing
    the ``.gitignore`` the rule came from. Rules are evaluated top-down and the
    last matching rule wins, which enables ``!`` negation.
    """
    if not rules:
        return False
    path = PurePosixPath(rel)
    ignored = False
    for base_rel, rule in rules:
        if rule.dir_only and not is_dir:
            continue
        if base_rel:
            try:
                target = path.relative_to(PurePosixPath(base_rel)).as_posix()
            except ValueError:
                continue
        else:
            target = rel
        if _rule_matches(rule, target):
            ignored = not rule.negated
    return ignored
