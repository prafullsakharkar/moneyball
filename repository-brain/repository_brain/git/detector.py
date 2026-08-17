"""Detect Git presence and metadata for a repository path.

Git is an optional enhancement: a plain directory is always indexable and the
detector never raises. It discovers whether a path lives inside a Git working
tree and, where safely detectable, the repository root, the current branch and
the default branch.

All subprocess interaction uses fixed argument lists (no ``shell=True``), a
bounded timeout and a safe working directory, and every failure degrades
gracefully to partial ``GitMetadata`` results.
"""

from __future__ import annotations

import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from repository_brain.core.logging import get_logger

log = get_logger("git")

#: Upper bound for any individual git subprocess call.
_GIT_TIMEOUT_SECONDS = 5.0

#: Maximum ancestor levels walked to find a containing git work tree.
_MAX_GIT_PARENT_WALK = 32

_HEAD_PREFIX = "ref: refs/heads/"


@dataclass(slots=True)
class GitMetadata:
    """Best-effort Git facts about a path."""

    is_git: bool = False
    git_available: bool = False
    root_path: str | None = None
    current_branch: str | None = None
    default_branch: str | None = None
    error: str | None = None

    @property
    def vcs(self) -> str | None:
        return "git" if self.is_git else None


class GitDetector:
    """Detect Git metadata for a filesystem path.

    Detection is read-only and side-effect free. The ``git`` binary is optional:
    repository presence and the default branch are derived from the ``.git``
    directory contents, while the working-tree root and current branch prefer a
    ``git`` subprocess when the binary is available. Any failure narrows the
    result to the metadata that could be established safely.
    """

    def __init__(
        self,
        *,
        git_binary: str | None = None,
        timeout: float = _GIT_TIMEOUT_SECONDS,
    ) -> None:
        self.git_binary = git_binary or shutil.which("git")
        self.timeout = timeout

    # ------------------------------------------------------------ public API

    def detect(self, path: str | Path) -> GitMetadata:
        """Return Git metadata for ``path`` without raising."""
        target = Path(path).expanduser()
        git_dir = self._git_dir(target)
        if git_dir is None:
            return GitMetadata(git_available=self.git_binary is not None)

        metadata = GitMetadata(
            is_git=True,
            git_available=self.git_binary is not None,
            default_branch=self._default_branch(git_dir),
        )

        if self.git_binary is None:
            metadata.root_path = str(target)
            metadata.current_branch = metadata.default_branch
            return metadata

        root = self._run_git("rev-parse", "--show-toplevel", cwd=target)
        metadata.root_path = root or str(target)

        branch = self._run_git("symbolic-ref", "--short", "-q", "HEAD", cwd=target)
        if branch is None:
            branch = self._run_git("branch", "--show-current", cwd=target)
        metadata.current_branch = branch or metadata.default_branch
        return metadata

    # ------------------------------------------------------------- internals

    def _git_dir(self, path: Path) -> Path | None:
        """Locate the git metadata directory for ``path``, if any.

        Walks up the directory tree (bounded) so paths inside a working tree
        are recognised. Returns the resolved ``.git`` directory for a normal
        checkout, or the gitdir referenced by a ``.git`` file for
        worktrees/submodules.
        """
        current = path
        for _ in range(_MAX_GIT_PARENT_WALK):
            git_dir = self._git_dir_at(current)
            if git_dir is not None:
                return git_dir
            parent = current.parent
            if parent == current:
                return None
            current = parent
        return None

    @staticmethod
    def _git_dir_at(path: Path) -> Path | None:
        """Return the git metadata directory located at ``path`` itself."""
        candidate = path / ".git"
        if candidate.is_dir():
            return candidate
        if not candidate.is_file():
            return None
        try:
            contents = candidate.read_text(encoding="utf-8", errors="ignore")
        except OSError as exc:
            log.debug("gitdir_file_unreadable", path=str(candidate), error=str(exc))
            return None
        for line in contents.splitlines():
            line = line.strip()
            if not line.startswith("gitdir:"):
                continue
            gitdir = Path(line[len("gitdir:") :].strip())
            if not gitdir.is_absolute():
                gitdir = path / gitdir
            return gitdir if gitdir.is_dir() else None
        return None

    def _default_branch(self, git_dir: Path) -> str | None:
        """Best-effort default branch from the ``HEAD`` symref."""
        head = git_dir / "HEAD"
        try:
            ref = head.read_text(encoding="utf-8", errors="ignore").strip()
        except OSError:
            return None
        if ref.startswith(_HEAD_PREFIX):
            return ref[len(_HEAD_PREFIX) :] or None
        return None

    def _run_git(self, *args: str, cwd: Path) -> str | None:
        """Run a fixed-argument git command and return trimmed stdout or None."""
        command = [self.git_binary or "git", *args]
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=self.timeout,
                check=False,
                cwd=str(cwd),
            )
        except (OSError, subprocess.TimeoutExpired) as exc:
            log.debug(
                "git_command_failed",
                args=list(args),
                path=str(cwd),
                error=f"{type(exc).__name__}: {exc}",
            )
            return None
        if result.returncode != 0:
            return None
        value = result.stdout.strip()
        return value or None
