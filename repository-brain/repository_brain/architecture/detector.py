"""Architecture detection based on repository file presence."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import PurePosixPath

#: Manifest file name -> language.
_MANIFESTS: dict[str, str] = {
    "package.json": "javascript",
    "pyproject.toml": "python",
    "setup.py": "python",
    "requirements.txt": "python",
    "go.mod": "go",
    "Cargo.toml": "rust",
    "composer.json": "php",
    "pom.xml": "java",
    "build.gradle": "java",
    "Gemfile": "ruby",
    "*.csproj": "csharp",
}

#: Framework keywords that mark a manifest as a given framework.
_FRAMEWORK_KEYWORDS: dict[str, set[str]] = {
    "react": {"react"},
    "next": {"next", "nextjs"},
    "vue": {"vue"},
    "angular": {"@angular", "angular"},
    "express": {"express"},
    "nestjs": {"@nestjs", "nest"},
    "fastapi": {"fastapi"},
    "django": {"django"},
    "flask": {"flask"},
    "fastify": {"fastify"},
    "svelte": {"svelte", "sveltekit"},
    "astro": {"astro"},
    "remix": {"@remix-run", "remix"},
    "spring": {"spring-boot", "spring"},
    "rails": {"rails"},
    "gin": {"gin-gonic", "gin"},
    "echo": {"labstack"},
    "actix": {"actix-web", "actix"},
    "rocket": {"rocket"},
    "flask-restful": {"flask-restful"},
    "redux": {"redux", "react-redux"},
    "graphql": {"graphql", "apollo"},
    "prisma": {"prisma"},
    "typeorm": {"typeorm"},
}

_ENTRY_POINTS = [
    "main.py",
    "app.py",
    "manage.py",
    "wsgi.py",
    "asgi.py",
    "server.py",
    "cli.py",
    "index.js",
    "index.ts",
    "server.js",
    "server.ts",
    "main.tsx",
    "main.jsx",
    "index.tsx",
    "index.jsx",
    "src/main.tsx",
    "src/main.jsx",
    "src/index.ts",
    "src/index.tsx",
    "src/App.tsx",
    "src/App.jsx",
    "cmd/main.go",
    "src/main.rs",
]

#: Patterns identifying test files.
_TEST_PATTERNS = (".test.", ".spec.", "_test", "test_", "tests/")


@dataclass(slots=True)
class ArchitectureSnapshot:
    """A frozen, serialisable snapshot of repository architecture."""

    languages: dict[str, int] = field(default_factory=dict)
    frameworks: list[str] = field(default_factory=list)
    manifests: list[str] = field(default_factory=list)
    entry_points: list[str] = field(default_factory=list)
    structure: list[str] = field(default_factory=list)
    patterns: dict = field(default_factory=dict)
    conventions: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "languages": self.languages,
            "frameworks": self.frameworks,
            "manifests": self.manifests,
            "entry_points": self.entry_points,
            "structure": self.structure,
            "patterns": self.patterns,
            "conventions": self.conventions,
        }


class ArchitectureDetector:
    """Detects architecture signals from a repository's file listing."""

    def __init__(self, *, root_path: str | None = None) -> None:
        self.root_path = root_path
        self._manifest_cache: dict[str, str] = {}

    def detect(self, files: list[str]) -> ArchitectureSnapshot:
        """Detect architecture from the relative path of every indexed file."""
        from repository_brain.parser.language import language_for_path

        languages: dict[str, int] = {}
        structure: set[str] = set()
        manifest_paths: list[str] = []

        for path in files:
            language = language_for_path(path)
            if language:
                languages[language] = languages.get(language, 0) + 1
            name = PurePosixPath(path).name
            if self._is_manifest(name):
                manifest_paths.append(path)

            parts = PurePosixPath(path).parts
            if parts:
                structure.add("/".join(parts[:2]) if len(parts) > 1 else parts[0])

        frameworks = self._detect_frameworks(files)

        entry_points = [p for p in files if p in _ENTRY_POINTS]
        if not entry_points:
            entry_points = self._infer_entry_points(files)

        return ArchitectureSnapshot(
            languages=dict(sorted(languages.items(), key=lambda kv: kv[1], reverse=True)),
            frameworks=frameworks,
            manifests=sorted(manifest_paths),
            entry_points=entry_points,
            structure=sorted(structure),
            patterns=self._detect_patterns(files),
            conventions=self._detect_conventions(files),
        )

    # ------------------------------------------------------------ helpers

    @staticmethod
    def _is_manifest(name: str) -> bool:
        if name in _MANIFESTS:
            return True
        return name.endswith((".csproj", ".gradle"))

    def _detect_frameworks(self, files: list[str]) -> list[str]:
        found: set[str] = set()
        for path in files:
            name = PurePosixPath(path).name
            content = self._read_manifest_content(path)
            if name in ("package.json",):
                data = self._parse_json(content)
                for dep_name in _collect_dependencies(data):
                    found.update(self._match_framework(dep_name))
                if data:
                    found.update(self._match_framework(name))
            elif name in (
                "pyproject.toml",
                "requirements.txt",
                "setup.py",
                "go.mod",
                "Cargo.toml",
                "Gemfile",
            ):
                for kw in _extract_keywords(content):
                    found.update(self._match_framework(kw))
        return sorted(found)

    def _read_manifest_content(self, path: str) -> str:
        if self.root_path is None:
            return ""
        key = self.root_path + "/" + path
        if key in self._manifest_cache:
            return self._manifest_cache[key]
        try:
            with open(f"{self.root_path}/{path}", encoding="utf-8", errors="replace") as handle:
                content = handle.read()
        except OSError:
            content = ""
        self._manifest_cache[key] = content
        return content

    def _parse_json(self, content: str) -> dict:
        if not content:
            return {}
        try:
            return json.loads(content)
        except (json.JSONDecodeError, ValueError):
            return {}

    def _match_framework(self, name: str) -> set[str]:
        lowered = name.lower()
        matches: set[str] = set()
        for framework, keywords in _FRAMEWORK_KEYWORDS.items():
            if any(kw.lower() in lowered for kw in keywords):
                matches.add(framework)
        return matches

    def _infer_entry_points(self, files: list[str]) -> list[str]:
        ranked: list[tuple[int, str]] = []
        for path in files:
            name = PurePosixPath(path).name
            if name in ("main.py", "app.py", "index.js", "index.ts", "main.tsx"):
                ranked.append((0, path))
            elif name.startswith(("main", "app", "server", "cli")):
                ranked.append((1, path))
        ranked.sort(key=lambda item: item[0])
        return [path for _, path in ranked[:5]]

    def _detect_patterns(self, files: list[str]) -> dict:
        has_tests = any(
            pattern in path or "tests" in path.split("/")
            for path in files
            for pattern in ("_test", ".test.", ".spec.")
        )
        has_ci = any(path.startswith((".github/", ".gitlab/")) for path in files)
        return {
            "test_driven": has_tests,
            "ci_configured": has_ci,
            "mvc": any("controller" in p or "views/" in p for p in files),
            "layered": any(p.startswith(("services/", "repositories/", "models/")) for p in files),
            "feature_based": any("/features/" in p for p in files),
        }

    def _detect_conventions(self, files: list[str]) -> dict:
        snake_case = 0
        camel_case = 0
        for path in files:
            name = PurePosixPath(path).name
            base = name.split(".")[0]
            if re.fullmatch(r"[a-z0-9_]+", base):
                snake_case += 1
            elif re.fullmatch(r"[a-z][a-zA-Z0-9]*", base):
                camel_case += 1
        return {
            "file_naming": {
                "snake_case": snake_case,
                "camel_case": camel_case,
            }
        }


def _collect_dependencies(data: dict) -> list[str]:
    deps = []
    for section in ("dependencies", "devDependencies", "peerDependencies", "optionalDependencies"):
        for key in data.get(section, {}) or {}:
            deps.append(key)
    return deps


def _extract_keywords(content: str) -> list[str]:
    if not content:
        return []
    lowered = content.lower()
    keywords: list[str] = []
    for line in lowered.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        keywords.extend(re.findall(r"[a-z0-9\-_./]+", line))
    return keywords
