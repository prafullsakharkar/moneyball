"""Incremental file scanner."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from repository_brain.core.logging import get_logger
from repository_brain.parser.language import language_for_path
from repository_brain.scanner.filesystem import FileMetadata, compute_file_metadata
from repository_brain.scanner.ignore import (
    GitIgnoreRule,
    gitignore_matches,
    load_gitignore,
    should_ignore,
)

log = get_logger("scanner")

#: Previous state value: a tuple of (sha256, mtime, size) for fast-path checks.
PreviousState = dict[str, tuple[str, float, int]]


@dataclass(slots=True)
class ScanError:
    """A path that could not be inspected during a scan."""

    path: str
    error: str


@dataclass(slots=True)
class ScanDiff:
    """Set of changes detected since the last scan."""

    added: dict[str, FileMetadata] = field(default_factory=dict)
    modified: dict[str, FileMetadata] = field(default_factory=dict)
    deleted: list[str] = field(default_factory=list)
    unchanged: list[str] = field(default_factory=list)

    @property
    def changed(self) -> int:
        return len(self.added) + len(self.modified) + len(self.deleted)

    @property
    def has_changes(self) -> bool:
        return self.changed > 0


@dataclass(slots=True)
class ScanResult:
    """Full outcome of a scan."""

    diff: ScanDiff
    all_metadata: dict[str, FileMetadata] = field(default_factory=dict)
    total_files: int = 0
    errors: list[ScanError] = field(default_factory=list)


class FileScanner:
    """Walks a repository tree and computes incremental changes.

    Uses ``(mtime, size)`` as a fast path: when both match the previous state the
    file is treated as unchanged and hashing is skipped. Otherwise a SHA-256 hash
    is computed to decide whether the content actually changed.

    The walk is deterministic, prunes ignored directories before descending
    (so large ignored trees such as ``node_modules`` are never traversed), and
    respects ``.gitignore`` files when ``respect_gitignore`` is enabled. The
    scanner only inspects files; it never executes repository code.
    """

    def __init__(
        self,
        *,
        previous_state: PreviousState | None = None,
        extra_patterns: set[str] | None = None,
        extra_directories: set[str] | None = None,
        max_file_size: int = 5 * 1024 * 1024,
        respect_gitignore: bool = True,
    ) -> None:
        self.previous_state = previous_state or {}
        self.extra_patterns = extra_patterns
        self.extra_directories = extra_directories
        self.max_file_size = max_file_size
        self.respect_gitignore = respect_gitignore
        self._errors: list[ScanError] = []

    def scan(self, root: str | Path) -> ScanResult:
        """Scan ``root`` and produce a diff against the previous state."""
        root_path = Path(root)
        if not root_path.exists():
            raise FileNotFoundError(f"Repository path does not exist: {root}")
        if not root_path.is_dir():
            raise NotADirectoryError(f"Repository path is not a directory: {root}")

        self._errors = []
        diff = ScanDiff()
        seen: set[str] = set()
        all_metadata: dict[str, FileMetadata] = {}
        total = 0

        for file_path in self._walk(root_path):
            relative = file_path.relative_to(root_path).as_posix()
            seen.add(relative)

            if should_ignore(
                relative,
                extra_patterns=self.extra_patterns,
                extra_directories=self.extra_directories,
            ):
                continue
            try:
                if file_path.stat().st_size > self.max_file_size:
                    log.debug("skipping_large_file", path=relative)
                    continue
            except OSError as exc:
                self._report_error(relative, exc)
                continue

            previous = self.previous_state.get(relative)
            metadata = self._metadata_for(file_path, relative, previous)
            if metadata is None:
                continue

            all_metadata[relative] = metadata
            total += 1
            if previous is None:
                diff.added[relative] = metadata
            elif previous[0] == metadata.sha256:
                diff.unchanged.append(relative)
            else:
                diff.modified[relative] = metadata

        diff.deleted = [p for p in self.previous_state if p not in seen]

        return ScanResult(
            diff=diff,
            all_metadata=all_metadata,
            total_files=total,
            errors=self._errors,
        )

    def _walk(self, root: Path):
        """Yield all non-ignored files under ``root`` in deterministic order.

        Iterative depth-first walk using an explicit stack. Directories are
        pruned before descending, and ``.gitignore`` rules are applied at every
        level, so ignored trees are never entered.
        """
        # Stack entries: (directory, relative_posix, active gitignore rules)
        stack: list[tuple[Path, str, list[tuple[str, GitIgnoreRule]]]] = [(root, "", [])]
        while stack:
            directory, rel_dir, active = stack.pop()
            try:
                entries = sorted(directory.iterdir(), key=lambda entry: entry.name)
            except OSError as exc:
                self._report_error(rel_dir or directory.name, exc)
                continue

            local = load_gitignore(directory)
            combined = active + [(rel_dir, rule) for rule in local]
            files: list[Path] = []
            dirs: list[tuple[Path, str]] = []

            for entry in entries:
                rel = f"{rel_dir}/{entry.name}" if rel_dir else entry.name
                try:
                    is_dir = entry.is_dir()
                except OSError as exc:
                    self._report_error(rel, exc)
                    continue

                if is_dir:
                    if should_ignore(
                        rel + "/",
                        extra_patterns=self.extra_patterns,
                        extra_directories=self.extra_directories,
                    ):
                        continue
                    if self.respect_gitignore and gitignore_matches(
                        rel, is_dir=True, rules=combined
                    ):
                        continue
                    dirs.append((entry, rel))
                else:
                    if self.respect_gitignore and gitignore_matches(
                        rel, is_dir=False, rules=combined
                    ):
                        continue
                    files.append(entry)

            yield from files
            for directory_entry, rel in reversed(dirs):
                stack.append((directory_entry, rel, combined))

    def _report_error(self, path: str, exc: OSError) -> None:
        self._errors.append(ScanError(path=path, error=str(exc) or exc.__class__.__name__))

    def _metadata_for(
        self,
        file_path: Path,
        relative: str,
        previous: tuple[str, float, int] | None,
    ) -> FileMetadata | None:
        try:
            stat = file_path.stat()
        except OSError as exc:
            self._report_error(relative, exc)
            return None

        if previous is not None and previous[1] == stat.st_mtime and previous[2] == stat.st_size:
            return FileMetadata(
                path=relative,
                size=stat.st_size,
                sha256=previous[0],
                mtime=stat.st_mtime,
                is_binary=False,
                encoding="utf-8",
                line_count=0,
                extension=Path(relative).suffix.lower() or None,
                language=language_for_path(relative),
            )

        try:
            metadata = compute_file_metadata(file_path)
        except OSError as exc:
            self._report_error(relative, exc)
            return None

        return FileMetadata(
            path=relative,
            size=metadata.size,
            sha256=metadata.sha256,
            mtime=metadata.mtime,
            is_binary=metadata.is_binary,
            encoding=metadata.encoding,
            line_count=metadata.line_count,
            extension=metadata.extension,
            language=language_for_path(relative),
        )
