"""Unit tests for the Git metadata detector."""

from __future__ import annotations

import subprocess
from pathlib import Path

import pytest
from repository_brain.git.detector import GitDetector


class TestGitDetector:
    def test_plain_directory_is_not_git(self, tmp_path):
        metadata = GitDetector().detect(tmp_path)
        assert metadata.is_git is False
        assert metadata.vcs is None
        assert metadata.root_path is None
        assert metadata.current_branch is None
        assert metadata.default_branch is None

    def test_git_repo_via_real_git(self, tmp_path, git_bin):
        if git_bin is None:
            pytest.skip("git binary not available")
        repo = tmp_path / "real"
        repo.mkdir()
        _run_git(git_bin, repo, "init", "-b", "main")
        _commit(git_bin, repo, "init")

        metadata = GitDetector(git_binary=git_bin).detect(repo)
        assert metadata.is_git is True
        assert metadata.vcs == "git"
        assert metadata.git_available is True
        assert metadata.root_path == str(repo.resolve())
        assert metadata.current_branch == "main"
        assert metadata.default_branch == "main"

    def test_git_repo_without_git_binary(self, tmp_path, git_bin, no_git):
        if git_bin is None:
            pytest.skip("git binary not available")
        repo = tmp_path / "repo"
        repo.mkdir()
        _run_git(git_bin, repo, "init", "-b", "develop")

        metadata = GitDetector().detect(repo)
        assert metadata.is_git is True
        assert metadata.git_available is False
        assert metadata.default_branch == "develop"
        assert metadata.current_branch == "develop"
        assert metadata.root_path == str(repo.resolve())

    def test_git_available_from_shutil(self, tmp_path, git_bin):
        if git_bin is None:
            pytest.skip("git binary not available")
        repo = tmp_path / "repo"
        repo.mkdir()
        _run_git(git_bin, repo, "init", "-b", "main")

        detector = GitDetector()
        assert detector.git_binary is not None
        metadata = detector.detect(repo)
        assert metadata.is_git is True
        assert metadata.git_available is True

    def test_detached_head_no_current_branch(self, tmp_path, git_bin):
        if git_bin is None:
            pytest.skip("git binary not available")
        repo = tmp_path / "repo"
        repo.mkdir()
        _run_git(git_bin, repo, "init", "-b", "main")
        _commit(git_bin, repo, "init")
        _run_git(git_bin, repo, "checkout", "--detach", "HEAD")

        metadata = GitDetector(git_binary=git_bin).detect(repo)
        assert metadata.is_git is True
        # A detached HEAD has no branch and no detectable default branch.
        assert metadata.current_branch is None
        assert metadata.default_branch is None

    def test_subdirectory_returns_worktree_root(self, tmp_path, git_bin):
        if git_bin is None:
            pytest.skip("git binary not available")
        repo = tmp_path / "outer"
        repo.mkdir()
        _run_git(git_bin, repo, "init", "-b", "main")
        sub = repo / "src" / "deep"
        sub.mkdir(parents=True)

        metadata = GitDetector(git_binary=git_bin).detect(sub)
        assert metadata.is_git is True
        assert metadata.root_path == str(repo.resolve())
        assert metadata.current_branch == "main"

    def test_git_file_worktree_symref(self, tmp_path, no_git):
        repo = tmp_path / "repo"
        (repo / ".git").mkdir(parents=True)
        (repo / ".git" / "HEAD").write_text("ref: refs/heads/develop\n")

        metadata = GitDetector().detect(repo)
        assert metadata.is_git is True
        assert metadata.git_available is False
        assert metadata.default_branch == "develop"
        assert metadata.current_branch == "develop"

    def test_gitfile_indirection(self, tmp_path, no_git):
        actual_git = tmp_path / "actual.git"
        actual_git.mkdir()
        (actual_git / "HEAD").write_text("ref: refs/heads/main\n")
        repo = tmp_path / "worktree"
        repo.mkdir()
        (repo / ".git").write_text(f"gitdir: {actual_git}\n")

        metadata = GitDetector().detect(repo)
        assert metadata.is_git is True
        assert metadata.default_branch == "main"

    def test_invalid_gitfile_ignored(self, tmp_path, no_git):
        repo = tmp_path / "repo"
        repo.mkdir()
        (repo / ".git").write_text("not a gitdir pointer\n")

        metadata = GitDetector().detect(repo)
        assert metadata.is_git is False

    def test_detached_head_file_no_default_branch(self, tmp_path, no_git):
        repo = tmp_path / "repo"
        (repo / ".git").mkdir(parents=True)
        (repo / ".git" / "HEAD").write_text("7f9c0d8a2b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a\n")

        metadata = GitDetector().detect(repo)
        assert metadata.is_git is True
        assert metadata.default_branch is None
        assert metadata.current_branch is None

    def test_git_command_failure_degrades_gracefully(self, tmp_path, monkeypatch):
        repo = tmp_path / "repo"
        (repo / ".git").mkdir(parents=True)
        (repo / ".git" / "HEAD").write_text("ref: refs/heads/main\n")

        def _boom(*_args, **_kwargs):
            raise OSError("git binary vanished")

        monkeypatch.setattr(subprocess, "run", _boom)
        detector = GitDetector(git_binary="/usr/bin/fake-git")
        metadata = detector.detect(repo)

        assert metadata.is_git is True
        assert metadata.default_branch == "main"
        assert metadata.root_path == str(repo.resolve())
        assert metadata.git_available is True

    def test_git_timeout_degrades_gracefully(self, tmp_path, monkeypatch):
        repo = tmp_path / "repo"
        (repo / ".git").mkdir(parents=True)
        (repo / ".git" / "HEAD").write_text("ref: refs/heads/main\n")

        def _timeout(*_args, **_kwargs):
            raise subprocess.TimeoutExpired(cmd="git", timeout=0.001)

        monkeypatch.setattr(subprocess, "run", _timeout)
        detector = GitDetector(git_binary="/usr/bin/fake-git", timeout=0.001)
        metadata = detector.detect(repo)

        assert metadata.is_git is True
        assert metadata.default_branch == "main"
        assert metadata.root_path == str(repo.resolve())

    def test_nonzero_exit_degrades_gracefully(self, tmp_path, monkeypatch):
        repo = tmp_path / "repo"
        (repo / ".git").mkdir(parents=True)
        (repo / ".git" / "HEAD").write_text("ref: refs/heads/main\n")

        class _FakeCompleted:
            returncode = 128
            stdout = ""
            stderr = "fatal: not a git repository"

        monkeypatch.setattr(
            subprocess,
            "run",
            lambda *_args, **_kwargs: _FakeCompleted(),
        )
        detector = GitDetector(git_binary="/usr/bin/fake-git")
        metadata = detector.detect(repo)

        assert metadata.is_git is True
        assert metadata.default_branch == "main"
        assert metadata.root_path == str(repo.resolve())

    def test_repo_with_branch_and_submodule_gitfile(self, tmp_path, no_git):
        actual_git = tmp_path / "shared.git"
        actual_git.mkdir()
        (actual_git / "HEAD").write_text("ref: refs/heads/feature-x\n")
        repo = tmp_path / "module"
        repo.mkdir()
        (repo / ".git").write_text(f"gitdir: {actual_git.as_posix()}\n")

        metadata = GitDetector().detect(repo)
        assert metadata.is_git is True
        assert metadata.default_branch == "feature-x"

    def test_missing_path_is_not_git(self, tmp_path):
        metadata = GitDetector().detect(tmp_path / "does-not-exist")
        assert metadata.is_git is False


def _run_git(binary: str, cwd: Path, *args: str) -> None:
    subprocess.run(
        [binary, *args],
        check=True,
        capture_output=True,
        text=True,
        cwd=str(cwd),
    )


def _commit(binary: str, cwd: Path, message: str) -> None:
    subprocess.run(
        [
            binary,
            "-c",
            "user.name=Repository Brain Test",
            "-c",
            "user.email=test@repository-brain.local",
            "commit",
            "--allow-empty",
            "-m",
            message,
        ],
        check=True,
        capture_output=True,
        text=True,
        cwd=str(cwd),
    )


@pytest.fixture()
def git_bin():
    """Return the path of a real git binary or None when unavailable."""
    import shutil

    return shutil.which("git")


@pytest.fixture()
def no_git(monkeypatch):
    """Simulate a machine without the git binary installed."""
    monkeypatch.setattr("shutil.which", lambda _name: None)
