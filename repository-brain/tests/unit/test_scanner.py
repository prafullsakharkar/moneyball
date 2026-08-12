"""Unit tests for the incremental file scanner and ignore rules."""

from __future__ import annotations

from pathlib import Path

from repository_brain.scanner.filesystem import compute_file_metadata
from repository_brain.scanner.ignore import (
    is_generated_file,
    should_ignore,
)
from repository_brain.scanner.scanner import FileScanner


class TestShouldIgnore:
    def test_ignores_default_directories(self):
        assert should_ignore("src/node_modules/foo.js")
        assert should_ignore(".git/HEAD")
        assert should_ignore("dist/bundle.js")
        assert should_ignore("a/b/.venv/bin/python")
        assert should_ignore(".brain/repository.json")

    def test_directory_with_trailing_slash(self):
        assert should_ignore("node_modules/")
        assert should_ignore("src/.brain/")

    def test_ignores_patterns(self):
        assert should_ignore("src/foo.pyc")
        assert should_ignore("package-lock.json")
        assert should_ignore("logs/app.log")

    def test_allows_normal_files(self):
        assert not should_ignore("src/app.py")
        assert not should_ignore("src/components/Card.tsx")
        assert not should_ignore("README.md")

    def test_extra_patterns_and_directories(self):
        assert should_ignore("vendor/lib.py", extra_directories={"vendor"})
        assert should_ignore("foo.generated.ts", extra_patterns={"*.generated.ts"})


class TestIsGeneratedFile:
    def test_generated_names(self):
        assert is_generated_file("package-lock.json")
        assert is_generated_file("yarn.lock")
        assert is_generated_file("go.sum")

    def test_minified(self):
        assert is_generated_file("bundle.min.js")
        assert is_generated_file("app.min.css")

    def test_not_generated(self):
        assert not is_generated_file("src/main.py")
        assert not is_generated_file("package.json")


class TestFileScanner:
    def test_full_scan_adds_all(self, tmp_path: Path):
        (tmp_path / "a.py").write_text("x = 1\n")
        (tmp_path / "sub").mkdir()
        (tmp_path / "sub" / "b.py").write_text("y = 2\n")
        (tmp_path / ".brain").mkdir()
        (tmp_path / ".brain" / "snapshot.json").write_text("{}")

        result = FileScanner().scan(tmp_path)
        assert result.total_files == 2
        assert set(result.diff.added) == {"a.py", "sub/b.py"}

    def test_unchanged_fast_path(self, tmp_path: Path):
        f = tmp_path / "a.py"
        f.write_text("x = 1\n")
        first = FileScanner().scan(tmp_path)
        assert first.diff.added["a.py"].sha256

        # Same mtime/size should short-circuit hashing.
        previous = {p: (m.sha256, m.mtime, m.size) for p, m in first.all_metadata.items()}
        second = FileScanner(previous_state=previous).scan(tmp_path)
        assert second.diff.modified == {}
        assert second.diff.added == {}
        assert second.diff.unchanged == ["a.py"]

    def test_modified_detected(self, tmp_path: Path):
        import os
        import time as time_mod

        f = tmp_path / "a.py"
        f.write_text("x = 1\n")
        first = FileScanner().scan(tmp_path)
        previous = {p: (m.sha256, m.mtime, m.size) for p, m in first.all_metadata.items()}
        f.write_text("x = 2\n")
        os.utime(f, (time_mod.time() + 5, time_mod.time() + 5))
        second = FileScanner(previous_state=previous).scan(tmp_path)
        assert "a.py" in second.diff.modified

    def test_deleted_detected(self, tmp_path: Path):
        f = tmp_path / "a.py"
        f.write_text("x = 1\n")
        first = FileScanner().scan(tmp_path)
        previous = {p: (m.sha256, m.mtime, m.size) for p, m in first.all_metadata.items()}
        f.unlink()
        second = FileScanner(previous_state=previous).scan(tmp_path)
        assert second.diff.deleted == ["a.py"]

    def test_ignores_hidden_and_large_files(self, tmp_path: Path):
        (tmp_path / "a.py").write_text("x = 1\n")
        big = tmp_path / "big.bin"
        big.write_bytes(b"0" * (6 * 1024 * 1024))
        result = FileScanner(max_file_size=5 * 1024 * 1024).scan(tmp_path)
        assert set(result.diff.added) == {"a.py"}


class TestComputeFileMetadata:
    def test_text_file(self, tmp_path: Path):
        f = tmp_path / "a.py"
        f.write_text("hello\nworld\n")
        meta = compute_file_metadata(f)
        assert meta.line_count == 2
        assert meta.is_binary is False
        assert len(meta.sha256) == 64
        assert meta.size == 12

    def test_binary_file(self, tmp_path: Path):
        f = tmp_path / "img.png"
        f.write_bytes(b"\x89PNG\r\n\x1a\n" + b"\x00" * 64)
        meta = compute_file_metadata(f)
        assert meta.is_binary is True
