"""Module engine: detect and persist logical modules."""

from repository_brain.modules.detector import (  # noqa: F401
    ModuleDraft,
    detect_modules,
)
from repository_brain.modules.service import (  # noqa: F401
    ModuleBuildResult,
    ModuleService,
)
