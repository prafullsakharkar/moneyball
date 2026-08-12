# Architecture

Repository Brain is a layered FastAPI application. Each layer has a single responsibility
and depends only on the layers below it.

```
┌────────────────────────────────────────────────────────────┐
│ API layer          repository_brain/api/routes/*.py                     │
│ REST endpoints, request/response schemas                   │
├────────────────────────────────────────────────────────────┤
│ Services            repository_brain/services/container.py              │
│ DI container, worker orchestration (BackgroundScanner)     │
├────────────────────────────────────────────────────────────┤
│ Engines             repository_brain/{indexer,memory,search,context,    │
│ repository,modules,architecture,symbols,graph}/            │
├────────────────────────────────────────────────────────────┤
│ Parser              repository_brain/parser/  (tree-sitter extractors)  │
│ Scanner             repository_brain/scanner/ (filesystem + ignore)     │
├────────────────────────────────────────────────────────────┤
│ Persistence         repository_brain/models/  repository_brain/core/database.py      │
│ SQLAlchemy 2.x ORM, migrations                             │
└────────────────────────────────────────────────────────────┘
```

## OpenAI-compatible relay

Repository Brain exposes an OpenAI-compatible endpoint that relays chat completions to a
separate upstream LLM backend (e.g. llama.cpp serving Qwen3). It is a **pure proxy** —
it never executes the LLM itself and never fabricates assistant content.

```
Client (Roo Code)
   │  POST /api/v1/chat/completions
   ▼
repository_brain/api/routes/llm.py          request validation, model mapping,
   │                           error mapping, structured logging
   ▼
repository_brain/proxy/client.py            httpx client → OPENAI_BACKEND
   ▼
Upstream LLM backend (OPENAI_MODEL, e.g. qwen35b)
```

- `GET /api/v1/models` is served locally and advertises `OPENAI_ADVERTISED_MODEL`
  (default `repository-brain-v1`); it never requires the backend to be running.
- `GET /health` is a liveness probe that returns `{"status": "ok"}` regardless of the
  upstream LLM backend's state.
- Incoming requests use the advertised model name; `LLMClient.map_model` replaces it with
  the configured upstream model before forwarding. All other fields are preserved.
- Streaming (`stream: true`) responses are relayed byte-for-byte as SSE.
- Upstream non-200 statuses are preserved and mapped to OpenAI-compatible error envelopes
  (`repository_brain/proxy/errors.py`). Timeouts map to `504 gateway_timeout`; unreachable backends to
  `502 bad_gateway`.
- Every request carries a request ID (`rb_<timestamp>_<random>`, `repository_brain/core/request_id.py`)
  bound via structlog contextvars, so logs for a single lifecycle share one ID. Request
  and backend metadata are logged with structured fields; API keys are never logged.


## Indexing pipeline

A scan is orchestrated by `Indexer.index()` in `repository_brain/indexer/service.py`:

1. **Scan** — `FileScanner` walks the repository, applies ignore rules, and computes an
   incremental `ScanDiff` (added / modified / deleted / unchanged). An `(mtime, size)`
   match short-circuits hashing; otherwise a SHA-256 is computed.
2. **Sync files** — `FileEntry` rows are created / updated / deleted to match the diff.
3. **Parse** — changed files are parsed in a thread pool. `TreeSitterExtractor` produces
   `ParsedFile` (symbols, imports, calls, module docstring).
4. **Symbols** — `SymbolService.replace_file_symbols` replaces a file's symbols, preserving
   parent/child hierarchy via qualified names.
5. **Dependencies** — `DependencyEngine.build_for_repo` rebuilds import, call and
   inheritance edges for the changed files. `PathResolver` maps import specs to file paths,
   with a suffix fallback for `src/`-style layouts.
6. **Modules** — `ModuleService.rebuild` re-derives logical modules and their edges.
7. **Architecture** — `ArchitectureService.build` re-derives languages, frameworks,
   entry points, patterns and conventions.
8. **Memory** — `MemoryService.build` composes summaries, statistics and conventions.
9. **Snapshot** — `SnapshotService.save` writes the full index as JSON under `<repo>/.brain/`.

## Key components

### Parser (`repository_brain/parser/`)

- `language.py` maps file extensions to tree-sitter language names.
- `configs.py` declares per-language node-type maps and capabilities
  (decorators, docstrings, JSX, class types).
- `parser.py` loads grammars from `tree-sitter-language-pack` (thread-local parser cache)
  and walks the tree to extract symbols, imports and calls.
- Symbols are nested by a parent stack; container kinds (`class`, `interface`, `enum`,
  `module`) push onto the stack. JSX-returning functions become `component`s.

### Dependency graph (`repository_brain/graph/`)

- `resolver.py` converts import specs into candidate file paths, handling relative
  imports, Python dotted paths and TS/JS `./` / `../` paths, plus alias prefixes.
- `engine.py` stores edges as `Dependency` rows, resolves call sites to enclosing symbols
  via line ranges, and tracks internal vs external resolution.

### Modules (`repository_brain/modules/`)

- `detector.py` groups files by directory prefix, scores each group's role
  (core / api / config / tests / scripts) and emits `ModuleDraft` objects.
- `service.py` persists `Module`, `ModuleFile` and `ModuleDependency` rows and aggregates
  intra-module edges.

### Memory (`repository_brain/memory/`)

- `summarizer.py` produces rule-based natural-language summaries from module data.
- `statistics.py` aggregates file / symbol / dependency counts by category.
- `service.py` composes the persistent `RepositoryMemory` row. Memory is **never rebuilt
  implicitly** — it is created once when missing and otherwise preserved across scans,
  and rebuilt only on `POST /memory/refresh`.

### Snapshots (`repository_brain/indexer/snapshot.py`)

Snapshots are JSON documents written to `<repo>/.brain/` when the repository is writable,
otherwise to `<STORAGE_DIR>/repositories/<id>/.brain/`. They make the index portable and
reloadable without a database.

## Concurrency

Parsing runs on a `ThreadPoolExecutor`. Background scans are managed by
`BackgroundScanner` (`repository_brain/workers/scanner.py`), which runs jobs on a thread and tracks
status in memory. Each job uses its own database session (`SessionLocal`) to avoid
cross-thread sharing.

## Configuration

See `repository_brain/core/config.py` (pydantic-settings). The SQLite development default
(`sqlite:///./storage/brain.db`) is used when PostgreSQL is unavailable; production uses
`postgresql+psycopg://`.

Proxy-specific settings:

- `OPENAI_BACKEND` — upstream OpenAI-compatible base URL (must be an http(s) URL).
- `OPENAI_API_KEY` — optional bearer token forwarded upstream; left empty to omit.
- `OPENAI_MODEL` — upstream model name that incoming model requests are mapped to.
- `OPENAI_ADVERTISED_MODEL` — model name advertised by `GET /api/v1/models`.
- `OPENAI_TIMEOUT` — timeout (seconds) for upstream requests and streams.
