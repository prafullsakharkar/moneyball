"""Dependency graph engine: resolves imports, calls and inheritance."""

from repository_brain.graph.engine import (  # noqa: F401
    DependencyBuildResult,
    DependencyEngine,
)
from repository_brain.graph.resolver import (  # noqa: F401
    PathResolver,
    resolve_candidates,
)
