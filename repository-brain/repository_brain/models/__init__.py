"""Registry of all ORM models so ``Base.metadata`` is complete."""

from repository_brain.models.architecture import Architecture  # noqa: F401
from repository_brain.models.dependency import Dependency  # noqa: F401
from repository_brain.models.file import FileEntry  # noqa: F401
from repository_brain.models.memory import RepositoryMemory  # noqa: F401
from repository_brain.models.module import Module, ModuleDependency, ModuleFile  # noqa: F401
from repository_brain.models.repository import Repository  # noqa: F401
from repository_brain.models.symbol import Symbol  # noqa: F401
