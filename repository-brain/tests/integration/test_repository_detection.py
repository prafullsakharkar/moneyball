"""Tests for deterministic language and framework detection (Part 3).

All tests use ``tmp_path`` only; no network, package managers or repository
code execution are involved.
"""

from __future__ import annotations

from pathlib import Path

from repository_brain.detection import FrameworkDetector, LanguageDetector


def _write(repo: Path, relative: str, content: str = "x\n") -> Path:
    path = repo / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
    return path


class TestLanguageDetector:
    def test_detects_python(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "app.py")
        assert LanguageDetector().detect(repo) == ["Python"]

    def test_detects_javascript(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "app.js")
        assert LanguageDetector().detect(repo) == ["JavaScript"]

    def test_detects_typescript(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "app.ts")
        _write(repo, "component.tsx")
        assert LanguageDetector().detect(repo) == ["TypeScript"]

    def test_detects_java(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "src/Main.java")
        assert LanguageDetector().detect(repo) == ["Java"]

    def test_detects_go(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "main.go")
        assert LanguageDetector().detect(repo) == ["Go"]

    def test_detects_rust(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "src/lib.rs")
        assert LanguageDetector().detect(repo) == ["Rust"]

    def test_detects_c_and_cpp(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "main.c")
        _write(repo, "impl.cpp")
        _write(repo, "include/header.h")
        result = LanguageDetector().detect(repo)
        assert result == ["C", "C++", "C/C++"]

    def test_detects_mixed_repository(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "app.py")
        _write(repo, "app.ts")
        _write(repo, "README.md")
        assert LanguageDetector().detect(repo) == ["Markdown", "Python", "TypeScript"]

    def test_unknown_extension_ignored(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "notes.xyz")
        assert LanguageDetector().detect(repo) == []

    def test_dedupes_languages(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "a.py")
        _write(repo, "b.py")
        _write(repo, "c.py")
        assert LanguageDetector().detect(repo) == ["Python"]

    def test_language_for_path(self, tmp_path: Path):
        detector = LanguageDetector()
        assert detector.language_for_path("src/app.py") == "Python"
        assert detector.language_for_path("src/app.java") == "Java"
        assert detector.language_for_path("src/app.unknown") is None
        assert detector.language_for_path("Dockerfile") == "Dockerfile"

    def test_detect_is_bounded(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "src/mod1.py")
        _write(repo, "src/mod2.py")
        _write(repo, "src/mod3.py")
        assert LanguageDetector(limit=1).detect(repo) == ["Python"]


class TestFrameworkDetector:
    def test_detects_fastapi(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "pyproject.toml", '[project]\ndependencies = ["fastapi>=0.100"]\n')
        assert FrameworkDetector().detect(repo) == ["FastAPI"]

    def test_detects_django(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "requirements.txt", "Django==5.0\n")
        assert FrameworkDetector().detect(repo) == ["Django"]

    def test_detects_flask(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "requirements.txt", "flask>=2.0\n")
        assert FrameworkDetector().detect(repo) == ["Flask"]

    def test_detects_react(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(
            repo,
            "package.json",
            '{"dependencies": {"react": "^18.0", "react-dom": "^18.0"}}',
        )
        assert FrameworkDetector().detect(repo) == ["React"]

    def test_detects_nextjs(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "package.json", '{"dependencies": {"next": "14.0.0"}}')
        assert FrameworkDetector().detect(repo) == ["Next.js"]

    def test_detects_express(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "package.json", '{"dependencies": {"express": "^4.19.0"}}')
        assert FrameworkDetector().detect(repo) == ["Express"]

    def test_unknown_manifest_yields_empty(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "pyproject.toml", '[project]\ndependencies = ["urllib3"]\n')
        assert FrameworkDetector().detect(repo) == []

    def test_empty_repository_yields_empty(self, tmp_path: Path):
        repo = tmp_path / "repo"
        repo.mkdir()
        assert FrameworkDetector().detect(repo) == []

    def test_detects_multiple_frameworks(self, tmp_path: Path):
        repo = tmp_path / "repo"
        _write(repo, "requirements.txt", "fastapi\nuvicorn\n")
        _write(repo, "package.json", '{"dependencies": {"express": "^4.0.0"}}')
        assert FrameworkDetector().detect(repo) == ["Express", "FastAPI"]


class TestRepositoryAggregation:
    def test_aggregates_multiple_languages(self, tmp_path: Path, db_session):
        from repository_brain.repository.service import RepositoryService

        repo = tmp_path / "repo"
        _write(repo, "app.py")
        _write(repo, "app.ts")
        registered, created = RepositoryService().index_register(db_session, path=str(repo))
        assert created
        assert "Python" in registered.language_set
        assert "TypeScript" in registered.language_set

    def test_aggregates_multiple_frameworks(self, tmp_path: Path, db_session):
        from repository_brain.repository.service import RepositoryService

        repo = tmp_path / "repo"
        _write(repo, "requirements.txt", "fastapi\n")
        _write(repo, "package.json", '{"dependencies": {"react": "^18.0"}}')
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        assert registered.framework_set == ["FastAPI", "React"]

    def test_duplicates_removed(self, tmp_path: Path, db_session):
        from repository_brain.repository.service import RepositoryService

        repo = tmp_path / "repo"
        _write(repo, "a.py")
        _write(repo, "b.py")
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        assert registered.language_set == ["Python"]

    def test_empty_repository(self, tmp_path: Path, db_session):
        from repository_brain.repository.service import RepositoryService

        repo = tmp_path / "repo"
        repo.mkdir()
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        assert registered.language_set == []
        assert registered.framework_set == []

    def test_missing_manifest_yields_empty_frameworks(self, tmp_path: Path, db_session):
        from repository_brain.repository.service import RepositoryService

        repo = tmp_path / "repo"
        _write(repo, "app.py")
        registered, _ = RepositoryService().index_register(db_session, path=str(repo))
        assert registered.framework_set == []
        assert registered.language_set == ["Python"]
