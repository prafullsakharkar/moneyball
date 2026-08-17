# REST API Reference

Base URL: `http://localhost:8000` (interactive docs at `/docs`).

All list endpoints accept `repository_id` as a query parameter (UUID of a registered
repository). Body payloads are JSON.

## Repositories

### `POST /repositories`

Register a repository. Returns `201 Created`.

```json
{
  "name": "my-project",
  "path": "/absolute/path/to/my-project",
  "url": "https://github.com/acme/my-project",
  "description": "Optional description",
  "default_branch": "main",
  "watch": true
}
```

Errors: `409` if the name or path is already registered; `422` if the path does not exist.

### `GET /repositories`

List all registered repositories (array of `RepositoryOut`).

### `GET /repositories/{repository_id}`

Fetch a single repository. `404` when unknown.

### `PATCH /repositories/{repository_id}`

Update name, url, description, default_branch or watch flag.

### `DELETE /repositories/{repository_id}`

Remove a repository, its index rows and its snapshot. Returns a message.

### `POST /repositories/{repository_id}/scan`

Run an incremental scan. Query params:

| Param      | Default | Description                          |
| ---------- | ------- | ------------------------------------ |
| `background` | `false` | Enqueue as a background job        |
| `full`       | `false` | Re-index every file, not just changes |

Returns `RepositoryScanOut` (report counts and status).

### `POST /repositories/{repository_id}/reindex`

Force a full re-index (alias for `scan?full=true`). Returns `RepositoryScanOut`.

## Search

### `POST /search`

```json
{
  "query": "ForecastService",
  "scope": "all",
  "kind": "class",
  "language": "python",
  "exact": false,
  "repository_id": "uuid",
  "limit": 50,
  "offset": 0
}
```

`scope` is one of `all`, `files`, `symbols`, `modules`, `dependencies`. Returns
`SearchResults` with `total` and a `results` array of typed hits (`type` field).

## Symbols

### `GET /symbols?repository_id=<id>`

Paginated symbol list (`SymbolPage`). Query params: `kind`, `name`, `limit`, `offset`.

### `GET /symbols/{name}?repository_id=<id>`

All symbols with the given simple name.

### `GET /symbols/by-id/{symbol_id}`

A single symbol with its children and dependencies.

## Files

### `GET /files?repository_id=<id>`

Paginated file list (`FilePage`). Query params: `language`, `limit`, `offset`.

### `GET /files/{file_id}`

A single file entry.

### `GET /files/{file_id}/symbols`

Symbols defined in the file.

### `GET /files/stats/repository/{repository_id}`

Per-repository file statistics (`FileStatOut`).

## Modules

### `GET /modules?repository_id=<id>`

Paginated module list.

### `GET /modules/{name}?repository_id=<id>`

A single module with its files and edges.

### `GET /modules/graph/repository/{repository_id}`

The module-level graph: nodes plus dependency edges.

## Dependencies

### `GET /dependencies?repository_id=<id>`

Paginated dependency edges. Query params: `kind`, `resolved` (`true`/`false`), `limit`, `offset`.

### `GET /dependencies/{symbol}?repository_id=<id>`

Edges related to a symbol (by simple name): both outbound edges (this symbol depends on
others) and inbound edges (others depend on it). `404` when the symbol is unknown.

### `GET /dependencies/graph/repository/{repository_id}?kind=<kind>`

The file-level dependency graph (resolved edges only): nodes (`id`, `path`, `language`)
plus edges with `source`, `target`, `kind`, `name`, `resolved`. `kind` filters by
dependency kind.

## Memory / Summary

### `GET /summary?repository_id=<id>`

The persisted repository memory (`MemoryOut`): summary, architecture summary, module
summaries, conventions, patterns and statistics. Builds it on first access.

### `POST /memory/refresh?repository_id=<id>`

Explicitly rebuild repository memory. Returns `MemoryRefreshOut`
(`repository_id`, `version`, `rebuilt`, `message`).

### `GET /architecture?repository_id=<id>`

Detected architecture content (languages, frameworks, entry points, patterns,
conventions, structure).

### `GET /architecture/summary?repository_id=<id>`

A textual architecture summary.

### `GET /statistics?repository_id=<id>`

Index statistics (files, symbols, dependencies, modules, languages).

## Repository Knowledge (Phase 3)

Deterministic, structural repository queries backed entirely by the index. No
LLM is invoked for any of these endpoints; they work without Qwen.

### `GET /knowledge/overview?repository_id=<id>`

Repository overview: name, root path, languages, frameworks, file/symbol/
relationship/module counts, top-level directories, config files, git branch and
indexing status. `404` when the repository is unknown.

```json
{
  "repository_id": "uuid",
  "name": "my-project",
  "root_path": "/abs/path",
  "languages": ["python"],
  "frameworks": ["fastapi"],
  "file_count": 42,
  "symbol_count": 120,
  "relationship_count": 57,
  "module_count": 3,
  "top_level_directories": ["src", "tests"],
  "config_files": ["pyproject.toml"],
  "git_branch": "main",
  "status": "scanned",
  "last_scanned_at": "2026-01-01T00:00:00"
}
```

### `GET /knowledge/files?repository_id=<id>`

Structured file tree. Query params: `depth` (1–10, default 3), `children_limit`
(1–1000, default 200), `limit`, `offset`. The top level is paginated; each
directory is bounded by `children_limit` and marked `truncated` when capped.

```json
{
  "repository_id": "uuid",
  "root": "my-project",
  "total": 2,
  "limit": 50,
  "offset": 0,
  "truncated": false,
  "nodes": [
    {"name": "src", "path": "src", "type": "dir",
     "children": [{"name": "main.py", "path": "src/main.py", "type": "file", "language": "python"}]},
    {"name": "pyproject.toml", "path": "pyproject.toml", "type": "file", "language": "toml"}
  ]
}
```

### `GET /knowledge/symbols?repository_id=<id>`

Symbol lookup. Query params: `name` (exact or partial), `kind`, `language`,
`exact` (bool, default false), `limit`, `offset`. Returns a paginated
`SymbolPage` of `SymbolOut` items with `file_path`, `qualified_name`, `line`.

```bash
curl "http://localhost:8000/knowledge/symbols?repository_id=<id>&name=UserService"
```

### `GET /knowledge/relationships?repository_id=<id>`

Relationship edges with readable endpoints. Query params: `kind` (e.g.
`import`, `call`, `inheritance`, `manifest`), `direction` (`outgoing` |
`incoming`), `file_path` (substring filter), `limit`, `offset`. `outgoing`
includes repository-level manifest dependencies.

```json
{
  "items": [
    {"id": "uuid", "kind": "import", "name": "api.client", "direction": "outgoing",
     "source_path": "src/weather/forecast.py", "target_path": "src/api/client.py",
     "source_symbol": null, "target_symbol": "ApiClient",
     "is_resolved": true, "is_external": false, "line": 4}
  ],
  "total": 1, "limit": 50, "offset": 0
}
```

### `GET /knowledge/imports?repository_id=<id>`

Import edges only (shorthand for relationships with `kind=import`). Same
params: `direction`, `file_path`, `limit`, `offset`. Answers "what imports
service.py?" (`direction=incoming&file_path=service.py`) and "what does
service.py import?" (`direction=outgoing&file_path=service.py`).

### `GET /knowledge/dependencies?repository_id=<id>`

External package dependencies declared in manifests. Query param `kind`
(default `manifest`), `limit`, `offset`.

## Context Retrieval (Phase 3)

### `POST /api/v1/repositories/{repository_id}/context`

Build a structured, deterministic repository context bundle for a query. This is
the retrieval foundation used by later phases; **no LLM is called** and the Phase 1
chat proxy is unaffected.

```json
{
  "query": "authentication service",
  "limit": 20
}
```

Response: `RepositoryContextOut` with `repository`, `files`, `symbols`,
`relationships`, `architecture`, `counts` and a transparent `ranking` list.

```json
{
  "query": "authentication service",
  "repository_id": "uuid",
  "repository_name": "my-project",
  "repository": {"name": "my-project", "languages": ["python"], "file_count": 42},
  "files": [{"path": "src/api/auth.py", "language": "python", "score": 80.0, "match": "file_name"}],
  "symbols": [{"name": "Authenticator", "qualified_name": "Authenticator",
               "kind": "class", "file_path": "src/api/auth.py", "line": 1,
               "score": 100.0, "match": "exact_symbol"}],
  "relationships": [],
  "architecture": {"languages": ["python"], "frameworks": ["fastapi"],
                   "top_level_directories": ["src"], "entry_points": ["src/main.py"],
                   "config_files": ["pyproject.toml"]},
  "counts": {"files": 1, "symbols": 1, "relationships": 0},
  "ranking": [{"type": "symbol", "name": "Authenticator", "score": 100.0, "match": "exact_symbol"}]
}
```

`limit` (1–100) caps files/symbols/relationships; when omitted the
`MAX_CONTEXT_FILES` / `MAX_CONTEXT_SYMBOLS` / `MAX_CONTEXT_RELATIONSHIPS`
settings apply. Ranking tiers: exact symbol > qualified name > file name >
path > partial name/token. Repeated identical queries return identical output.

## System

### `GET /health`

Liveness probe. Represents Repository Brain liveness and does **not** depend on the
upstream LLM backend (or database) being reachable:

```json
{"status": "ok"}
```

### `GET /version`

```json
{"name": "repository-brain", "version": "0.1.0", "environment": "development"}
```

## OpenAI-compatible proxy

Repository Brain exposes OpenAI-compatible endpoints under `/api/v1`. They relay to the
upstream LLM backend configured by `OPENAI_BACKEND` (e.g. llama.cpp serving Qwen3).

### `GET /api/v1/models`

List the models Repository Brain advertises. Served locally; does not require the upstream
backend to be running:

```json
{
  "object": "list",
  "data": [
    {
      "id": "repository-brain-v1",
      "object": "model",
      "owned_by": "repository-brain"
    }
  ]
}
```

The model id is `OPENAI_ADVERTISED_MODEL` (default `repository-brain-v1`).

### `POST /api/v1/chat/completions`

OpenAI-compatible chat completions. The `model` field (typically `repository-brain-v1`)
is mapped to `OPENAI_MODEL` before forwarding; all other fields are preserved.

Non-streaming request:

```bash
curl http://localhost:8000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "repository-brain-v1",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

Streaming request (`stream: true`): the upstream SSE stream is relayed byte-for-byte:

```bash
curl -N http://localhost:8000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "repository-brain-v1",
    "messages": [{"role": "user", "content": "Write a haiku"}],
    "stream": true
  }'
```

Supported request fields include `messages`, `stream`, `temperature`, `top_p`,
`max_tokens`, `stop`, `presence_penalty`, `frequency_penalty`, `seed`,
`response_format`, `tools`, `tool_choice` and any other OpenAI field — extra fields are
preserved and forwarded unchanged.

Error behaviour:

- Upstream non-200 statuses (400, 401, 403, 404, 408, 429, 500, 502, 503, 504) are
  preserved and returned as OpenAI-compatible `{"error": {"message", "type", "param",
  "code"}}` envelopes.
- Upstream timeouts → `504 gateway_timeout`; unreachable backend → `502 bad_gateway`.
- Malformed or invalid backend completion bodies → `502 invalid_backend_response`.

Every response includes an `X-Request-ID` header (`rb_<timestamp>_<random>`) that is also
used across all structured log lines for that request. API keys are never logged.

### Roo Code configuration

| Setting       | Value                              |
| ------------- | ---------------------------------- |
| Provider      | OpenAI-compatible                  |
| Base URL      | `http://127.0.0.1:8000/api/v1`     |
| API Key       | *(any value, or leave unset)*      |
| Model         | `repository-brain-v1`              |
| Context       | `128000`                          |

Streaming and tool/function calls (used by Roo Code) are fully supported.
