"""Rule-based summarisation of repository knowledge."""

from __future__ import annotations

from dataclasses import dataclass

_LANGUAGE_LABELS = {
    "python": "Python",
    "typescript": "TypeScript",
    "javascript": "JavaScript",
    "tsx": "React/TypeScript",
    "jsx": "React/JavaScript",
    "json": "JSON",
    "yaml": "YAML",
    "markdown": "Markdown",
    "go": "Go",
    "rust": "Rust",
}


@dataclass(slots=True)
class ModuleSummaryInput:
    name: str
    file_count: int
    symbol_count: int
    docstrings: list[str]
    roles: dict[str, int]
    dependencies: list[str] | None = None


class Summarizer:
    """Generates concise, deterministic summaries from index data."""

    def repository_summary(self, architecture: dict, statistics: dict) -> str:
        languages = architecture.get("languages", {})
        frameworks = architecture.get("frameworks", [])
        entry_points = architecture.get("entry_points", [])

        top_languages = _top_languages(languages)
        parts = ["A software repository"]

        if top_languages:
            parts.append(f"primarily written in {top_languages}")
        if frameworks:
            parts.append(f"built with {', '.join(frameworks[:4])}")
        if entry_points:
            parts.append(f"with entry points at {', '.join(entry_points[:3])}")

        files = statistics.get("files", {})
        symbols = statistics.get("symbols", {})
        deps = statistics.get("dependencies", {})
        modules = statistics.get("modules", {})

        summary = (
            f"{' '.join(parts)}. "
            f"It contains {files.get('total', 0)} files, {symbols.get('total', 0)} symbols, "
            f"{deps.get('total', 0)} dependency edges and {modules.get('total', 0)} modules."
        )
        return _cap(summary)

    def architecture_summary(self, architecture: dict, statistics: dict) -> str:
        languages = architecture.get("languages", {})
        frameworks = architecture.get("frameworks", [])
        structure = architecture.get("structure", [])
        patterns = architecture.get("patterns", {})
        conventions = architecture.get("conventions", {})

        lines = [
            "Languages: " + _top_languages(languages),
            "Frameworks: " + (", ".join(frameworks) if frameworks else "none detected"),
        ]
        if structure:
            lines.append("Top-level structure: " + ", ".join(structure[:12]))
        if patterns:
            enabled = [key.replace("_", " ") for key, value in patterns.items() if value]
            if enabled:
                lines.append("Patterns: " + ", ".join(enabled))
        if conventions:
            naming = conventions.get("file_naming", {})
            lines.append(
                "File naming: "
                f"{naming.get('snake_case', 0)} snake_case, {naming.get('camel_case', 0)} camelCase"
            )

        deps = statistics.get("dependencies", {})
        total_deps = deps.get("total", 0)
        resolved = sum(v.get("resolved", 0) for v in deps.get("by_kind", {}).values())
        if total_deps:
            lines.append(f"Dependency resolution: {resolved}/{total_deps} edges resolved")
        return "\n".join(lines)

    def module_summary(self, module: ModuleSummaryInput) -> str:
        parts = [f"{module.name}: {module.file_count} files, {module.symbol_count} symbols"]
        if module.docstrings:
            doc = module.docstrings[0].strip().replace("\n", " ")
            parts.append(f"Purpose: {_cap(doc[:200])}")
        if module.roles:
            roles = ", ".join(f"{k}={v}" for k, v in sorted(module.roles.items()))
            parts.append(f"Composition ({roles})")
        if module.dependencies:
            parts.append(f"Depends on {len(module.dependencies)} other modules")
        return " | ".join(parts)


def _top_languages(languages: dict) -> str:
    top = sorted(languages.items(), key=lambda kv: kv[1], reverse=True)[:3]
    return ", ".join(_LANGUAGE_LABELS.get(lang, lang) for lang, _ in top)


def _cap(text: str) -> str:
    if not text:
        return text
    return text[0].upper() + text[1:]
