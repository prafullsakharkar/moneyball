"""Programmatic example: register a repository, index it, and query it.

Usage:
    uv run python examples/index_repo.py /path/to/a/repository
"""

from __future__ import annotations

import sys

from repository_brain.core.config import get_settings
from repository_brain.core.database import init_db, session_scope
from repository_brain.indexer.service import Indexer
from repository_brain.memory.service import MemoryService
from repository_brain.repository.service import RepositoryService
from repository_brain.search.service import SearchService

settings = get_settings()
settings.storage_dir.mkdir(parents=True, exist_ok=True)
settings.repository_storage_dir.mkdir(parents=True, exist_ok=True)
init_db()


def main(repo_path: str) -> None:
    repo_service = RepositoryService()

    with session_scope() as session:
        repo = repo_service.create(session, name=repo_path.rsplit("/", 1)[-1], path=repo_path)
        print(f"Registered {repo.name} ({repo.id})")

        report = Indexer().index(session, repo)
        print(
            f"Indexed {report.files_scanned} files, {report.symbols_indexed} symbols, "
            f"{report.dependencies_indexed} dependencies, {report.modules_detected} modules."
        )

        memory = MemoryService().build(session, repo.id)
        print(f"\nMemory summary: {memory.summary}\n")

        hits, total = SearchService().search(
            session, "def ", repository_id=repo.id, scope="symbols"
        )
        print(f"Search 'def ' -> {total} results")
        for hit in hits[:5]:
            print(f"  - {hit.kind}: {hit.qualified_name} ({hit.file_path}:{hit.line})")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
