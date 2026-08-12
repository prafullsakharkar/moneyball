# Roadmap

Repository Brain is under active development (Alpha, v0.1.0). This roadmap tracks the
planned phases of the project.

## Phase 1 — Core indexer (current)

- [x] Scaffold: uv project, FastAPI app, config, logging, database
- [x] ORM models and Pydantic schemas
- [x] Incremental file scanner (SHA-256 + `(mtime, size)` fast path)
- [x] Tree-sitter parsing: Python, TypeScript, JavaScript, React (TSX/JSX), JSON, YAML, Markdown
- [x] Symbol extraction with class/method hierarchy
- [x] Dependency graph (imports, calls, inheritance) with path resolution
- [x] Module detection
- [x] Architecture detection
- [x] Persistent repository memory (summaries, statistics, conventions)
- [x] Snapshot serialization to `<repo>/.brain/`
- [x] SQL search (no embeddings)
- [x] REST API
- [x] Test suite (unit + integration)
- [x] Linting (ruff) and formatting

## Phase 2 — Deeper intelligence

- [ ] AST-based call graph augmentation (inter-file call target resolution)
- [ ] Public API surface extraction (endpoint discovery for web frameworks)
- [ ] README/comment-aware repository summarisation
- [ ] Multi-language module scoring refinements
- [ ] Background watch mode (auto re-scan on file changes)

## Phase 3 — Query & reasoning

- [ ] Natural-language query parser mapped onto the SQL search service
- [ ] "Explain this symbol" endpoint combining memory + graph context
- [ ] Context assembly for downstream agents (the `ContextEngine` hook)

## Phase 4 — Embeddings & semantic search

- [ ] Optional embedding index for fuzzy semantic search (behind a feature flag)
- [ ] Hybrid retrieval (SQL + embeddings) with score fusion
- [ ] Vector store adapter interface (pgvector first)

## Phase 5 — Hardening & distribution

- [ ] PostgreSQL end-to-end migration verification with Alembic
- [ ] Docker health-checks and CI pipeline (lint, test, type-check)
- [ ] Packaging and PyPI release
- [ ] Documentation site

## Non-goals

- Repository Brain is not an AI chat assistant or an IDE.
- Memory is persistent and is **never** recreated automatically.
- Search must work without embeddings by default.
