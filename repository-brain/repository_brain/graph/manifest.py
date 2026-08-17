"""Read declared dependencies from repository manifest files.

The reader is purely static: it never installs packages or runs package
managers. It parses well-known manifest files and returns the dependency
names and version specs they declare, so the graph can represent external
dependencies (``DEPENDS_ON``) alongside source-level import edges.
"""

from __future__ import annotations

import json
import os
import re
import tomllib
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

from repository_brain.detection.language import SKIP_DIRECTORIES

#: Manifest filenames the reader understands, mapped to a manager name.
_MANIFESTS: dict[str, str] = {
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

#: Version-specifier characters used to split ``name==1.0`` style entries.
_SPEC_SPLIT = re.compile(r"[<>=!~;@\s]")

_GRADLE_SPEC = re.compile(r"""['"]([^'"]+)['"]""")

_GO_VERSION = re.compile(r"\bv?\d+\.\d+\.\d+")


@dataclass(slots=True)
class ManifestDependency:
    """A single declared dependency from a manifest file."""

    name: str
    version_spec: str | None = None
    manager: str = ""
    manifest: str = ""


def _split_spec(spec: str) -> tuple[str, str | None]:
    """Split ``name==1.0`` / ``name>=1,<2`` into (name, version_spec)."""
    spec = spec.strip()
    if not spec:
        return "", None
    name = _SPEC_SPLIT.split(spec, maxsplit=1)[0].strip()
    if not name or "://" in name:
        return "", None
    rest = spec[len(name) :].strip()
    return name, rest or None


class ManifestDependencyReader:
    """Discover and parse manifests, returning declared dependencies."""

    def __init__(self, *, limit: int = 10_000, max_bytes: int = 512 * 1024) -> None:
        self.limit = limit
        self.max_bytes = max_bytes

    def read(self, path: str | Path) -> list[ManifestDependency]:
        root = Path(path).expanduser().resolve()
        deps: list[ManifestDependency] = []
        for manifest in self._find_manifests(root):
            text = self._read(manifest)
            if text is None:
                continue
            manager = _MANIFESTS.get(manifest.name) or (
                "dotnet" if manifest.name.endswith(".csproj") else None
            )
            if manager is None:
                continue
            relative = manifest.relative_to(root).as_posix()
            for name, version in self._parse(manager, text, manifest.name):
                if name:
                    deps.append(
                        ManifestDependency(
                            name=name,
                            version_spec=version,
                            manager=manager,
                            manifest=relative,
                        )
                    )
        return deps

    # ------------------------------------------------------------ discovery

    def _find_manifests(self, root: Path) -> list[Path]:
        manifests: list[Path] = []
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRECTORIES]
            for filename in sorted(filenames):
                if len(manifests) >= self.limit:
                    return manifests
                if filename in _MANIFESTS or filename.endswith(".csproj"):
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

    def _parse(self, manager: str, text: str, filename: str) -> list[tuple[str, str | None]]:
        if manager == "python":
            if filename == "pyproject.toml":
                return self._parse_pyproject(text)
            if filename == "requirements.txt":
                return self._parse_requirements(text)
            return self._parse_pipfile(text)
        if manager == "node":
            return self._parse_json_sections(
                text, ("dependencies", "devDependencies", "peerDependencies")
            )
        if manager == "java":
            if filename == "pom.xml":
                return self._parse_pom(text)
            return self._parse_gradle(text)
        if manager == "rust":
            return self._parse_cargo(text)
        if manager == "go":
            return self._parse_go(text)
        if manager == "php":
            return self._parse_json_sections(text, ("require", "require-dev"))
        if manager == "ruby":
            return self._parse_gemfile(text)
        if manager == "dotnet":
            return self._parse_dotnet(text)
        return []

    def _parse_pyproject(self, text: str) -> list[tuple[str, str | None]]:
        try:
            data = tomllib.loads(text)
        except tomllib.TOMLDecodeError:
            return self._parse_requirements(text)
        out: list[tuple[str, str | None]] = []
        project = data.get("project") or {}
        for raw in project.get("dependencies") or []:
            if isinstance(raw, str):
                out.append(_split_spec(raw))
        for group in (project.get("optional-dependencies") or {}).values():
            if isinstance(group, list):
                for raw in group:
                    if isinstance(raw, str):
                        out.append(_split_spec(raw))
        poetry = ((data.get("tool") or {}).get("poetry") or {}).get("dependencies") or {}
        for name, spec in poetry.items():
            if isinstance(name, str) and name.lower() != "python":
                version = spec if isinstance(spec, str) else None
                out.append((name, version))
        return out

    def _parse_requirements(self, text: str) -> list[tuple[str, str | None]]:
        out: list[tuple[str, str | None]] = []
        for raw in text.splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith(("-r", "-e", "--", "-c")):
                continue
            out.append(_split_spec(line))
        return out

    def _parse_pipfile(self, text: str) -> list[tuple[str, str | None]]:
        try:
            data = tomllib.loads(text)
        except tomllib.TOMLDecodeError:
            return []
        out: list[tuple[str, str | None]] = []
        for section in ("packages", "dev-packages"):
            for name, spec in (data.get(section) or {}).items():
                if isinstance(name, str):
                    version = spec if isinstance(spec, str) else None
                    out.append((name, version))
        return out

    def _parse_json_sections(
        self, text: str, sections: tuple[str, ...]
    ) -> list[tuple[str, str | None]]:
        try:
            data = json.loads(text)
        except ValueError:
            return []
        out: list[tuple[str, str | None]] = []
        for section in sections:
            for name, version in (data.get(section) or {}).items():
                if isinstance(name, str):
                    out.append((name, version if isinstance(version, str) else None))
        return out

    def _parse_pom(self, text: str) -> list[tuple[str, str | None]]:
        try:
            root = ET.fromstring(text)
        except ET.ParseError:
            return []
        out: list[tuple[str, str | None]] = []
        for dep in root.iter():
            if dep.tag.rsplit("}", 1)[-1] != "dependency":
                continue
            group = artifact = version = None
            for child in dep:
                tag = child.tag.rsplit("}", 1)[-1]
                value = (child.text or "").strip()
                if tag == "groupId":
                    group = value
                elif tag == "artifactId":
                    artifact = value
                elif tag == "version":
                    version = value
            if artifact:
                name = f"{group}:{artifact}" if group else artifact
                out.append((name, version or None))
        return out

    def _parse_gradle(self, text: str) -> list[tuple[str, str | None]]:
        out: list[tuple[str, str | None]] = []
        for match in _GRADLE_SPEC.finditer(text):
            raw = match.group(1)
            if raw.count(":") < 1:
                continue
            parts = raw.split(":")
            if len(parts) == 2:
                out.append((f"{parts[0]}:{parts[1]}", None))
            elif len(parts) >= 3:
                out.append((f"{parts[0]}:{parts[1]}", parts[2]))
        return out

    def _parse_cargo(self, text: str) -> list[tuple[str, str | None]]:
        try:
            data = tomllib.loads(text)
        except tomllib.TOMLDecodeError:
            return []
        out: list[tuple[str, str | None]] = []
        for name, spec in (data.get("dependencies") or {}).items():
            if isinstance(name, str):
                version = spec if isinstance(spec, str) else None
                out.append((name, version))
        return out

    def _parse_go(self, text: str) -> list[tuple[str, str | None]]:
        out: list[tuple[str, str | None]] = []
        for raw in text.splitlines():
            line = raw.strip()
            if not line or line.startswith(("//", "module ", "go ")):
                continue
            if line == "require (":
                continue
            if line == ")":
                continue
            if line.startswith("require "):
                line = line[len("require ") :].strip()
            if not line:
                continue
            parts = line.split()
            name = parts[0]
            version = None
            for part in parts[1:]:
                if _GO_VERSION.match(part):
                    version = part
                    break
            if name:
                out.append((name, version))
        return out

    def _parse_gemfile(self, text: str) -> list[tuple[str, str | None]]:
        out: list[tuple[str, str | None]] = []
        for match in re.finditer(r"""gem\s+['"]([^'"]+)['"]""", text):
            name = match.group(1).strip()
            if name:
                out.append((name, None))
        return out

    def _parse_dotnet(self, text: str) -> list[tuple[str, str | None]]:
        try:
            root = ET.fromstring(text)
        except ET.ParseError:
            return []
        out: list[tuple[str, str | None]] = []
        for tag in root.iter():
            if tag.tag.rsplit("}", 1)[-1] == "PackageReference":
                include = tag.get("Include")
                if include:
                    out.append((include.strip(), tag.get("Version")))
        return out
