"""Filesystem helpers: hashing, encoding detection, binary detection."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path

_CHUNK_SIZE = 64 * 1024
_SAMPLE_SIZE = 8192
_BINARY_THRESHOLD = 0.30


@dataclass(frozen=True, slots=True)
class FileMetadata:
    """Computed metadata for a file on disk."""

    path: str
    size: int
    sha256: str
    mtime: float
    is_binary: bool
    encoding: str
    line_count: int

    @property
    def is_empty(self) -> bool:
        return self.size == 0


def _detect_encoding(first_bytes: bytes) -> str:
    if first_bytes.startswith(b"\xef\xbb\xbf"):
        return "utf-8-sig"
    if first_bytes.startswith((b"\xff\xfe", b"\xfe\xff")):
        return "utf-16"
    try:
        first_bytes.decode("utf-8")
        return "utf-8"
    except UnicodeDecodeError:
        pass
    try:
        first_bytes.decode("latin-1")
        return "latin-1"
    except UnicodeDecodeError:  # pragma: no cover - latin-1 never fails
        return "utf-8"


def is_binary_content(data: bytes) -> bool:
    """Heuristic binary detection based on the proportion of null bytes."""
    if not data:
        return False
    nulls = data.count(0)
    return (nulls / len(data)) > _BINARY_THRESHOLD


def _line_count(data: bytes) -> int:
    if not data:
        return 0
    return data.count(b"\n") + (0 if data.endswith(b"\n") else 1)


def compute_file_metadata(path: str | Path, *, sample_only: bool = True) -> FileMetadata:
    """Compute all metadata for a file using a single streaming pass."""
    file_path = Path(path)
    stat = file_path.stat()
    sha = hashlib.sha256()

    first_chunk = b""
    line_count = 0
    total_bytes = 0
    is_binary = False

    with file_path.open("rb") as handle:
        while True:
            chunk = handle.read(_CHUNK_SIZE)
            if not chunk:
                break
            sha.update(chunk)
            total_bytes += len(chunk)
            line_count += chunk.count(b"\n")
            if not first_chunk:
                first_chunk = chunk[:_SAMPLE_SIZE]
                if is_binary_content(first_chunk):
                    is_binary = True
                    if sample_only:
                        break

    if not is_binary:
        line_count += 1 if not _ends_with_newline(file_path) else 0

    encoding = "binary" if is_binary else _detect_encoding(first_chunk or b"")

    return FileMetadata(
        path=str(file_path),
        size=stat.st_size,
        sha256=sha.hexdigest(),
        mtime=stat.st_mtime,
        is_binary=is_binary,
        encoding=encoding,
        line_count=line_count if not is_binary else 0,
    )


def _ends_with_newline(path: Path) -> bool:
    try:
        with path.open("rb") as handle:
            handle.seek(-1, 2)
            return handle.read(1) == b"\n"
    except OSError:
        return False


def read_text_safely(path: str | Path, encoding: str | None = None) -> str:
    """Read file content as text with safe fallbacks."""
    file_path = Path(path)
    if encoding and encoding != "binary":
        try:
            return file_path.read_text(encoding=encoding)
        except (UnicodeDecodeError, OSError):
            pass
    for candidate in ("utf-8", "latin-1"):
        try:
            return file_path.read_text(encoding=candidate)
        except (UnicodeDecodeError, OSError):
            continue
    return ""
