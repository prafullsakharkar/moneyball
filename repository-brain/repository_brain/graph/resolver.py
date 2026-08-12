"""Resolve import specifications to repository file paths."""

from __future__ import annotations

from pathlib import PurePosixPath

#: Candidate file extensions tried for TypeScript-family imports, in order.
_TS_EXTENSIONS = (".tsx", ".ts", ".mts", ".cts", ".jsx", ".js", ".mjs", ".cjs")
#: Candidate extensions for JavaScript-family imports.
_JS_EXTENSIONS = (".jsx", ".js", ".mjs", ".cjs")
#: Candidate extensions for Python module imports.
_PY_EXTENSIONS = (".py", ".pyi")

_STDLIB_ISH = {
    "node:",
}


def resolve_candidates(
    spec: str,
    *,
    source_language: str,
    source_dir: str = "",
    aliases: dict[str, str] | None = None,
) -> list[str]:
    """Return an ordered list of candidate relative paths for an import spec.

    ``source_dir`` is the relative directory of the importing file.
    ``aliases`` maps import prefixes to repository-relative directories.
    """
    spec = spec.strip()
    if not spec:
        return []

    if spec.startswith("."):
        return _relative_candidates(spec, source_dir, source_language)

    for prefix, target in (aliases or {}).items():
        if spec.startswith(prefix):
            rest = spec[len(prefix) :]
            return _module_candidates(f"{target.rstrip('/')}/{rest}", source_language)

    if "://" in spec or spec.startswith(("node:", "@")):
        return []

    # Python module path e.g. services.user
    if source_language == "python":
        return _python_module_candidates(spec)

    # Non-relative, non-aliased specifiers are treated as external packages.
    return []


def _relative_candidates(spec: str, source_dir: str, language: str) -> list[str]:
    # Python-style relative imports use a leading-dot prefix: `.local`,
    # `..pkg.mod`, or a bare `.`. TS/JS use `./` or `../` prefixes.
    if spec.startswith(".") and not spec.startswith("./") and not spec.startswith("../"):
        dots = len(spec) - len(spec.lstrip("."))
        rest = spec[dots:]
        levels = dots - 1  # `.` stays in place, each extra `.` goes up one
        dir_parts = [p for p in PurePosixPath(source_dir).parts if p]
        if levels > 0 and dir_parts:
            dir_parts = dir_parts[:-levels] or []
        elif levels > 0:
            return []
        if rest:
            rest = rest.lstrip(".")
            if language == "python":
                rest = rest.replace(".", "/")
        prefix = "/".join(dir_parts + ([rest] if rest else [])) if dir_parts else rest
        return _module_candidates(prefix, language)

    parts = spec.split("/")
    count = 0
    rest_parts: list[str] = []
    for part in parts:
        if part == ".":
            count += 1
        elif part == "..":
            count -= 1
        else:
            rest_parts.append(part)

    if count < 0:
        return []

    dir_parts = [p for p in PurePosixPath(source_dir).parts if p]
    if count == 1:
        dir_parts = dir_parts  # stays in the same directory
    else:
        levels_up = max(0, count - 1)
        dir_parts = dir_parts[: len(dir_parts) - levels_up] if levels_up > 0 else dir_parts

    prefix = "/".join(dir_parts + rest_parts) if dir_parts else "/".join(rest_parts)
    return _module_candidates(prefix, language)


def _python_module_candidates(spec: str) -> list[str]:
    path = spec.replace(".", "/")
    return _module_candidates(path, "python")


def _module_candidates(base_path: str, language: str) -> list[str]:
    base_path = base_path.strip("/")
    if language == "python":
        extensions = _PY_EXTENSIONS
        index_names = ("__init__",)
    elif language in ("typescript", "tsx"):
        extensions = _TS_EXTENSIONS
        index_names = ("index",)
    else:
        extensions = _JS_EXTENSIONS
        index_names = ("index",)

    candidates: list[str] = []
    for ext in extensions:
        candidates.append(f"{base_path}{ext}")
    for name in index_names:
        for ext in extensions:
            candidates.append(f"{base_path}/{name}{ext}")
    return candidates


class PathResolver:
    """Resolves import specs against the set of known repository paths."""

    def __init__(
        self,
        known_paths: set[str],
        *,
        aliases: dict[str, str] | None = None,
    ) -> None:
        self.known_paths = known_paths
        self.aliases = aliases or {}
        self._cache: dict[tuple[str, str, str], str | None] = {}

    def resolve(
        self,
        spec: str,
        *,
        source_language: str,
        source_path: str,
    ) -> str | None:
        """Resolve an import spec to a known relative path, or None."""
        source_dir = str(PurePosixPath(source_path).parent)
        if source_dir == ".":
            source_dir = ""

        key = (spec, source_language, source_path)
        if key in self._cache:
            return self._cache[key]

        candidates = resolve_candidates(
            spec,
            source_language=source_language,
            source_dir=source_dir,
            aliases=self.aliases,
        )
        for candidate in candidates:
            if candidate in self.known_paths:
                self._cache[key] = candidate
                return candidate
        resolved = self._resolve_suffix(candidates)
        self._cache[key] = resolved
        return resolved

    def _resolve_suffix(self, candidates: list[str]) -> str | None:
        """Fallback: match a candidate against a suffix of a known path.

        Handles ``src/``-style layouts where ``api.client`` maps to
        ``src/api/client.py`` even though the import root differs.
        """
        best: str | None = None
        for known in self.known_paths:
            for candidate in candidates:
                if known == candidate:
                    return candidate
                if known.endswith("/" + candidate) and (best is None or len(known) < len(best)):
                    best = known
        return best

    def resolve_import(
        self,
        module: str,
        symbol_name: str | None,
        *,
        source_language: str,
        source_path: str,
    ) -> tuple[str | None, bool]:
        """Resolve an :class:`ImportRef` to ``(target_path, is_external)``.

        For ``from . import x`` style Python imports the symbol name is treated
        as the target module name within the current package directory.
        """
        is_external = self._looks_external(module)
        if is_external:
            return None, True

        spec = module
        if source_language == "python" and symbol_name and module.strip(".") == "":
            spec = module + symbol_name

        target = self.resolve(
            spec,
            source_language=source_language,
            source_path=source_path,
        )
        if target is not None:
            return target, False
        return None, False

    def _looks_external(self, module: str) -> bool:
        if module.startswith(".") or not module:
            return False
        # Bare module paths may still be local packages (e.g. a namespace
        # directory at the repository root). Only treat as external when it
        # could not be resolved at all; the caller decides.
        return "://" in module or module.startswith(("node:", "@"))
