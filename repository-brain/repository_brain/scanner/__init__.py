"""File scanner: walks repositories, computes hashes, detects incremental changes."""

from repository_brain.scanner.filesystem import (  # noqa: F401
    FileMetadata,
    compute_file_metadata,
    is_binary_content,
    read_text_safely,
)
from repository_brain.scanner.ignore import (  # noqa: F401
    DEFAULT_IGNORED_DIRECTORIES,
    DEFAULT_IGNORED_PATTERNS,
    is_generated_file,
    should_ignore,
)
from repository_brain.scanner.scanner import (  # noqa: F401
    FileScanner,
    ScanDiff,
    ScanResult,
)
