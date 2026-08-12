"""Incremental file scanner."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from repository_brain.core.logging import get_logger
from repository_brain.scanner.filesystem import FileMetadata, compute_file_metadata
from repository_brain.scanner.ignore import should_ignore

log = get_logger("scanner")

#: Previous state value: a tuple of (sha256, mtime, size) for fast-path checks.
PreviousState = dict[str, tuple[str, float, int]]


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


class FileScanner:
    """Walks a repository tree and computes incremental changes.

    Uses ``(mtime, size)`` as a fast path: when both match the previous state the
    file is treated as unchanged and hashing is skipped. Otherwise a SHA-256 hash
    is computed to decide whether the content actually changed.
    """

    def __init__(
        self,
        *,
        previous_state: PreviousState | None = None,
        extra_patterns: set[str] | None = None,
        extra_directories: set[str] | None = None,
        max_file_size: int = 5 * 1024 * 1024,
    ) -> None:
        self.previous_state = previous_state or {}
        self.extra_patterns = extra_patterns
        self.extra_directories = extra_directories
        self.max_file_size = max_file_size

    def scan(self, root: str | Path) -> ScanResult:
        """Scan ``root`` and produce a diff against the previous state."""
        root_path = Path(root)
        if not root_path.is_dir():
            raise NotADirectoryError(f"Repository path is not a directory: {root}")

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
            if file_path.stat().st_size > self.max_file_size:
                log.debug("skipping_large_file", path=relative)
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
        )

    def _walk(self, root: Path):
        """Yield all non-ignored files under ``root``."""
        stack = [root]
        while stack:
            directory = stack.pop()
            try:
                entries = sorted(directory.iterdir(), key=lambda e: e.name)
            except OSError:
                continue
            for entry in entries:
                if entry.is_dir():
                    rel = entry.relative_to(root).as_posix()
                    if should_ignore(
                        rel + "/",
                        extra_patterns=self.extra_patterns,
                        extra_directories=self.extra_directories,
                    ):
                        continue
                    stack.append(entry)
                elif entry.is_file():
                    yield entry

    def _metadata_for(
        self,
        file_path: Path,
        relative: str,
        previous: tuple[str, float, int] | None,
    ) -> FileMetadata | None:
        try:
            stat = file_path.stat()
        except OSError:
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
            )

        try:
            metadata = compute_file_metadata(file_path)
        except OSError:
            return None

        return FileMetadata(
            path=relative,
            size=metadata.size,
            sha256=metadata.sha256,
            mtime=metadata.mtime,
            is_binary=metadata.is_binary,
            encoding=metadata.encoding,
            line_count=metadata.line_count,
        )
