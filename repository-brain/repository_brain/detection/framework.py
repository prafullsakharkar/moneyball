"""Deterministic framework detection from repository manifest contents.

The framework detector reads well-known manifest files (``pyproject.toml``,
``requirements.txt``, ``package.json``, ``pom.xml``, ...) and maps declared
dependencies to canonical framework names. It is purely static: it never
installs dependencies, runs package managers, or executes repository code.
"""

from __future__ import annotations

import json
import os
import re
import tomllib
import xml.etree.ElementTree as ET
from pathlib import Path

from repository_brain.detection.language import SKIP_DIRECTORIES

#: Manifest filenames the detector knows how to parse, mapped to parsers.
_MANIFEST_PARSERS: dict[str, str] = {
    "pyproject.toml": "python",
    "requirements.txt": "python",
    "Pipfile": "python",
    "package.json": "node",
    "pom.xml": "java",
    "build.gradle": "java",
    "build.gradle.kts": "java",
    "Cargo.toml": "rust",
    "go.mod": "go",
    "composer.json": "php",
    "Gemfile": "ruby",
}

#: Exact dependency name -> canonical framework.
_EXACT: dict[str, str] = {
    "fastapi": "FastAPI",
    "starlette": "Starlette",
    "django": "Django",
    "flask": "Flask",
    "tornado": "Tornado",
    "sanic": "Sanic",
    "aiohttp": "Aiohttp",
    "pyramid": "Pyramid",
    "react": "React",
    "react-dom": "React",
    "next": "Next.js",
    "vue": "Vue",
    "@angular/core": "Angular",
    "express": "Express",
    "@nestjs/core": "NestJS",
    "svelte": "Svelte",
    "nuxt": "Nuxt",
    "fastify": "Fastify",
    "koa": "Koa",
    "laravel/framework": "Laravel",
    "cakephp/cakephp": "CakePHP",
    "codeigniter4/framework": "CodeIgniter",
    "slim/slim": "Slim",
    "rails": "Ruby on Rails",
    "sinatra": "Sinatra",
    "hanami": "Hanami",
    "microsoft.entityframeworkcore": "Entity Framework Core",
    "xunit": "xUnit",
    "nunit": "NUnit",
    "axum": "Axum",
    "rocket": "Rocket",
    "actix-web": "Actix Web",
    "warp": "Warp",
    "poem": "Poem",
}

#: Dependency name prefix -> canonical framework (longest prefix wins).
_PREFIX: dict[str, str] = {
    "microsoft.aspnetcore": "ASP.NET Core",
    "spring-boot-starter": "Spring Boot",
    "spring-boot": "Spring Boot",
    "org.springframework.boot": "Spring Boot",
    "symfony/": "Symfony",
}

#: Go module path markers -> canonical framework.
_GO_MODULES: dict[str, str] = {
    "gin-gonic/gin": "Gin",
    "labstack/echo": "Echo",
    "gofiber/fiber": "Fiber",
    "gorilla/mux": "Gorilla Mux",
    "chi": "Chi",
}

_VERSION_SPEC = re.compile(r"[<>=!~\[\];@]")


class FrameworkDetector:
    """Detect frameworks used by a repository from its manifest files."""

    def __init__(self, *, limit: int = 10_000, max_bytes: int = 512 * 1024) -> None:
        self.limit = limit
        self.max_bytes = max_bytes

    def detect(self, path: str | Path) -> list[str]:
        """Return sorted, deduplicated framework names for a repository."""
        root = Path(path).expanduser().resolve()
        frameworks: set[str] = set()
        for manifest in self._find_manifests(root):
            text = self._read(manifest)
            if text is None:
                continue
            parser = _MANIFEST_PARSERS.get(manifest.name) or (
                "dotnet" if manifest.name.endswith(".csproj") else None
            )
            if parser is None:
                continue
            frameworks.update(self._parse(parser, text, manifest))
        return sorted(frameworks)

    # ------------------------------------------------------------ discovery

    def _find_manifests(self, root: Path) -> list[Path]:
        """Collect manifest files with a bounded, deterministic walk."""
        manifests: list[Path] = []
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRECTORIES]
            for filename in sorted(filenames):
                if len(manifests) >= self.limit:
                    return manifests
                if filename in _MANIFEST_PARSERS or filename.endswith(".csproj"):
                    manifests.append(Path(dirpath) / filename)
        return manifests

    def _read(self, path: Path) -> str | None:
        try:
            if path.stat().st_size > self.max_bytes:
                return None
            return path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            return None

    # ------------------------------------------------------------ parsing

    def _parse(self, parser: str, text: str, path: Path) -> set[str]:
        if parser == "python":
            return self._parse_python(text, path.name)
        if parser == "node":
            return self._parse_node(text)
        if parser == "java":
            return self._parse_java(text, path.name)
        if parser == "rust":
            return self._parse_rust(text)
        if parser == "go":
            return self._parse_go(text)
        if parser == "php":
            return self._parse_php(text)
        if parser == "ruby":
            return self._parse_ruby(text)
        if parser == "dotnet":
            return self._parse_dotnet(text)
        return set()

    def _normalize_dependency(self, spec: str) -> str:
        """Strip version specifiers and extras from a dependency spec."""
        name = _VERSION_SPEC.split(spec, maxsplit=1)[0].strip().strip("\"'")
        return name.lower()

    def _framework_names(self, deps: set[str]) -> set[str]:
        names: set[str] = set()
        for dep in deps:
            if dep in _EXACT:
                names.add(_EXACT[dep])
                continue
            best: tuple[int, str] | None = None
            for prefix, framework in _PREFIX.items():
                if dep.startswith(prefix) and (best is None or len(prefix) > best[0]):
                    best = (len(prefix), framework)
            if best is not None:
                names.add(best[1])
        return names

    # ------------------------------------------------------------- python

    def _parse_python(self, text: str, filename: str) -> set[str]:
        deps: set[str] = set()
        if filename == "pyproject.toml":
            deps.update(self._pyproject_dependencies(text))
        elif filename == "requirements.txt":
            deps.update(self._requirements_dependencies(text))
        elif filename == "Pipfile":
            deps.update(self._pipfile_dependencies(text))
        return self._framework_names(deps)

    def _pyproject_dependencies(self, text: str) -> set[str]:
        try:
            data = tomllib.loads(text)
        except tomllib.TOMLDecodeError:
            return self._requirement_lines(text)
        deps: set[str] = set()
        project = data.get("project") or {}
        for raw in project.get("dependencies") or []:
            if isinstance(raw, str):
                deps.add(self._normalize_dependency(raw))
        for raw in (project.get("optional-dependencies") or {}).values():
            if isinstance(raw, list):
                for item in raw:
                    if isinstance(item, str):
                        deps.add(self._normalize_dependency(item))
        poetry = ((data.get("tool") or {}).get("poetry") or {}).get("dependencies") or {}
        for name in poetry:
            if isinstance(name, str) and name.lower() != "python":
                deps.add(name.lower())
        return deps

    def _requirements_dependencies(self, text: str) -> set[str]:
        return self._requirement_lines(text)

    def _pipfile_dependencies(self, text: str) -> set[str]:
        try:
            data = tomllib.loads(text)
        except tomllib.TOMLDecodeError:
            return set()
        deps: set[str] = set()
        for section in ("packages", "dev-packages"):
            for name in data.get(section) or {}:
                if isinstance(name, str):
                    deps.add(name.lower())
        return deps

    @staticmethod
    def _requirement_lines(text: str) -> set[str]:
        deps: set[str] = set()
        for raw in text.splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith(("-r", "-e", "--")):
                continue
            name = re.split(r"[<>=!~\[\];@\s]", line, maxsplit=1)[0].strip()
            if name:
                deps.add(name.lower())
        return deps

    # --------------------------------------------------------------- node

    def _parse_node(self, text: str) -> set[str]:
        try:
            data = json.loads(text)
        except ValueError:
            return set()
        deps: set[str] = set()
        for section in ("dependencies", "devDependencies", "peerDependencies"):
            for name in data.get(section) or {}:
                if isinstance(name, str):
                    deps.add(name.lower())
        return self._framework_names(deps)

    # --------------------------------------------------------------- java

    def _parse_java(self, text: str, filename: str) -> set[str]:
        deps: set[str] = set()
        if filename == "pom.xml":
            try:
                root = ET.fromstring(text)
            except ET.ParseError:
                return set()
            for tag in root.iter():
                if tag.tag.rsplit("}", 1)[-1] == "artifactId" and tag.text:
                    deps.add(tag.text.strip().lower())
                if tag.tag.rsplit("}", 1)[-1] == "groupId" and tag.text:
                    deps.add(tag.text.strip().lower())
        else:
            for match in re.findall(r"['\"]([A-Za-z0-9_.-]+:[A-Za-z0-9_.-]+)['\"]", text):
                deps.add(match.lower())
        return self._framework_names(deps)

    # --------------------------------------------------------------- rust

    def _parse_rust(self, text: str) -> set[str]:
        try:
            data = tomllib.loads(text)
        except tomllib.TOMLDecodeError:
            return set()
        deps: set[str] = set()
        for name in data.get("dependencies") or {}:
            if isinstance(name, str):
                deps.add(name.lower())
        return self._framework_names(deps)

    # ----------------------------------------------------------------- go

    def _parse_go(self, text: str) -> set[str]:
        names: set[str] = set()
        for raw in text.splitlines():
            line = raw.strip()
            if not line or line.startswith(("//", "module ", "go ")):
                continue
            if line.startswith("require"):
                line = line[len("require ") :].strip()
                if line.startswith("("):
                    continue
                if not line:
                    continue
            if line == ")":
                continue
            module = line.split()[0]
            for marker, framework in _GO_MODULES.items():
                if marker in module:
                    names.add(framework)
                    break
        return names

    # ---------------------------------------------------------------- php

    def _parse_php(self, text: str) -> set[str]:
        try:
            data = json.loads(text)
        except ValueError:
            return set()
        deps: set[str] = set()
        for section in ("require", "require-dev"):
            for name in data.get(section) or {}:
                if isinstance(name, str):
                    deps.add(name.lower())
        return self._framework_names(deps)

    # --------------------------------------------------------------- ruby

    def _parse_ruby(self, text: str) -> set[str]:
        deps: set[str] = set()
        for match in re.findall(r"""\bgem\s+['"]([^'"]+)['"]""", text):
            deps.add(match.strip().lower())
        return self._framework_names(deps)

    # ------------------------------------------------------------- dotnet

    def _parse_dotnet(self, text: str) -> set[str]:
        try:
            root = ET.fromstring(text)
        except ET.ParseError:
            return set()
        deps: set[str] = set()
        for tag in root.iter():
            if tag.tag.rsplit("}", 1)[-1] == "PackageReference":
                include = tag.get("Include")
                if include:
                    deps.add(include.strip().lower())
        return self._framework_names(deps)
