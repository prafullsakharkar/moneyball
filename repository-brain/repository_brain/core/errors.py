"""Domain-specific exceptions for Repository Brain."""

from __future__ import annotations


class BrainError(Exception):
    """Base class for all Repository Brain domain errors."""


class RepositoryNotFoundError(BrainError):
    """Raised when a registered repository does not exist."""


class RepositoryAlreadyExistsError(BrainError):
    """Raised when registering a repository that already exists."""


class RepositoryPathError(BrainError):
    """Raised when a repository path is invalid or outside allowed roots."""


class RepositoryNotIndexedError(BrainError):
    """Raised when a repository has no index yet and an index is required."""


class FileNotFoundError(BrainError):
    """Raised when an indexed file does not exist."""


class SymbolNotFoundError(BrainError):
    """Raised when a symbol does not exist in the index."""


class ModuleNotFoundError(BrainError):
    """Raised when a module does not exist in the index."""


class UnsupportedLanguageError(BrainError):
    """Raised when a file's language cannot be parsed by any parser."""
