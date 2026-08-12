# Contributing

Thanks for your interest in Repository Brain.

## Development setup

Requirements: Python 3.12+ and `uv`.

```bash
uv sync --extra dev
cp .env.example .env
```

## Running checks

```bash
uv run ruff check app tests
uv run ruff format app tests
uv run pytest
```

All tests should pass before opening a pull request. The project targets Python 3.12
syntax (PEP 695 style, `str | None`, etc.).

## Project layout

```
repository_brain/
  api/            REST routes, dependencies, serializers
  architecture/   architecture detection
  context/        context engine
  core/           config, database, errors, logging
  graph/          dependency resolution and engine
  indexer/        orchestration and snapshots
  memory/         summaries, statistics, persistent memory
  models/         SQLAlchemy ORM models
  modules/        module detection
  parser/         tree-sitter parsing
  repository/     repository CRUD
  scanner/        filesystem scanning and ignore rules
  schemas/        Pydantic models
  search/         SQL search
  services/       DI container
  symbols/        symbol persistence and queries
  workers/        background scanner
tests/
  unit/           unit tests
  integration/    API integration tests
docs/             documentation
```

## Conventions

- Type hints everywhere; use `from __future__ import annotations`.
- Follow the existing module structure; do not create a new top-level package for
  one-off helpers.
- Log with `structlog` via `repository_brain.core.logging.get_logger`.
- Use the `Container` (`repository_brain/services/container.py`) to access services in routes.
- Run `ruff format` before committing.

## Adding a language

1. Add the extension mapping in `repository_brain/parser/language.py`.
2. Add a `LanguageConfig` (node-type map, class types, capabilities) in
   `repository_brain/parser/configs.py`.
3. Add grammar-specific extraction in `repository_brain/parser/parser.py` if needed.
4. Add parser tests in `tests/unit/test_parser.py`.

## Testing

Write unit tests for pure logic (scanner, resolver, parser, search) and integration
tests for anything touching the database or API. Shared fixtures live in `tests/conftest.py`
and include a ready-to-index sample repository.
