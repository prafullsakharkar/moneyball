# Repository Brain

An open-source repository intelligence engine that understands, indexes, remembers and
exposes the structure of software repositories through a REST API.

Repository Brain scans a codebase, parses symbols with tree-sitter, builds dependency
and module graphs, detects architecture, and persists a rich **memory** of the repository
so you can search and answer questions about it without re-reading the code.

It also ships an **OpenAI-compatible relay** (`/api/v1/chat/completions`) that lets
AI coding assistants such as [Roo Code](https://docs.roocode.com/) talk to an upstream
LLM backend (e.g. llama.cpp serving Qwen3) through Repository Brain.

## Highlights

- **Tree-sitter based parsing** for Python, TypeScript, JavaScript, React (TSX/JSX), JSON, YAML, Markdown.
- **Incremental indexing** — SHA-256 content hashing with an `(mtime, size)` fast path.
- **Dependency graph** — import/call/inheritance edges with path resolution across `src/` layouts.
- **Module detection** — logical groupings of files by directory and responsibility.
- **Architecture detection** — languages, frameworks, entry points, patterns and conventions.
- **Persistent repository memory** — summaries, module summaries, statistics and conventions,
  rebuilt only on explicit request.
- **Snapshots** — the full index is serialised to `<repo>/.brain/` as portable JSON.
- **SQL search** — no embeddings required; scope over symbols, files, modules and dependencies.
- **OpenAI-compatible proxy** — relays chat completions to an upstream LLM backend
  (`/api/v1/chat/completions`), streams SSE responses, preserves upstream status codes,
  and advertises models via `/api/v1/models`.
- **FastAPI + SQLAlchemy 2.x** — PostgreSQL for production, SQLite for local development.

## Architecture

Repository Brain is a layered FastAPI application plus a thin LLM relay.

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

OpenAI-compatible relay (Phase 1):
  Client (Roo Code) ──► /api/v1/chat/completions (repository_brain/api/routes/llm.py)
                              │  repository_brain/proxy/client.py (httpx)
                              ▼
                        upstream LLM backend (e.g. llama.cpp + Qwen3)
```

The relay is **only a proxy**: it never executes the LLM itself. Incoming requests use
the advertised model name (default `repository-brain-v1`), which is mapped to the
configured upstream model (`OPENAI_MODEL`, default `qwen35b`) before forwarding. Responses
are returned unchanged; backend failures are mapped to OpenAI-compatible error envelopes
with the upstream status preserved.

See `docs/ARCHITECTURE.md` for the full system design.

## Prerequisites

- Python 3.12+ (3.12, 3.13 or 3.14)
- [uv](https://docs.astral.sh/uv/) — fast Python package manager
- Optional: a running OpenAI-compatible LLM backend (only needed for the chat proxy)

## uv setup

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create the virtual environment and install all dependencies (including dev)
uv sync --extra dev

# Verify
uv run pytest -q
```

## Configuration (.env)

Copy the example file and adjust values as needed:

```bash
cp .env.example .env
```

All settings are environment variables (see `.env.example`):

| Variable                    | Default                     | Description                          |
| --------------------------- | --------------------------- | ------------------------------------ |
| `APP_NAME`                  | `repository-brain`          | Application name                     |
| `APP_ENV`                   | `development`               | Runtime environment label            |
| `APP_HOST` / `APP_PORT`     | `0.0.0.0` / `8000`          | Uvicorn bind address                 |
| `LOG_LEVEL`                 | `INFO`                      | Structlog log level                  |
| `DATABASE_URL`              | `sqlite:///./storage/brain.db` | SQLAlchemy database URL           |
| `STORAGE_DIR`               | `./storage`                 | Managed snapshot storage root        |
| `ALLOWED_REPOSITORY_ROOTS`  | *(empty)*                   | Comma-separated allowed roots        |
| `INDEXER_WORKERS`           | `4`                         | Parser thread pool size              |
| `WATCH_INTERVAL`            | `0`                         | Auto re-scan interval (seconds); `0` disables |
| `OPENAI_BACKEND`            | `http://localhost:8033/v1`  | Upstream OpenAI-compatible base URL  |
| `OPENAI_API_KEY`            | *(empty)*                   | Key forwarded upstream (never logged)|
| `OPENAI_MODEL`              | `qwen35b`                   | Upstream model name                  |
| `OPENAI_ADVERTISED_MODEL`   | `repository-brain-v1`       | Model name advertised by `/api/v1/models` |
| `OPENAI_TIMEOUT`            | `300`                       | Upstream request/stream timeout (s)  |

Production uses `postgresql+psycopg://user:pass@host:5432/brain` for `DATABASE_URL`.

## Starting Repository Brain

```bash
# Production-style start (the required entry point)
uv run uvicorn repository_brain.main:app \
  --host 127.0.0.1 \
  --port 8000

# Local development (with reload)
uv run uvicorn repository_brain.main:app --reload

# Or as the packaged CLI
uv run repository-brain
```

Open http://localhost:8000/docs for the interactive API explorer.

Verify liveness (does not require the LLM backend):

```bash
curl http://localhost:8000/health
# {"status": "ok"}
```

## Starting Qwen (upstream LLM backend)

The chat proxy forwards to whatever OpenAI-compatible backend `OPENAI_BACKEND` points at.
One common setup is llama.cpp serving a Qwen3 GGUF model:

```bash
# Build llama.cpp (once)
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build -DGGML_CUDA=OFF
cmake --build build --config Release -j

# Serve Qwen3 with an OpenAI-compatible endpoint on port 8033
./build/bin/llama-server \
  -m /path/to/Qwen3-35B-Q4_K_M.gguf \
  --host 0.0.0.0 --port 8033 \
  --alias qwen35b
```

Then point Repository Brain at it (either via `.env` or environment):

```bash
export OPENAI_BACKEND=http://localhost:8033/v1
export OPENAI_MODEL=qwen35b
```

Verify the upstream is reachable:

```bash
curl http://localhost:8033/v1/models
```

Repository Brain does **not** bundle or start Qwen — they stay separate processes, and
`/health` returns `ok` even when the LLM backend is down.

### Verifying without a real LLM (stub backend)

If you do not have Qwen (or any OpenAI-compatible server) installed, use the bundled
deterministic stub to exercise the relay end-to-end:

```bash
# Terminal 1: run the stub "Qwen" on :8033
uv run python scripts/qwen_stub.py

# Terminal 2: run Repository Brain
OPENAI_BACKEND=http://127.0.0.1:8033/v1 uv run uvicorn repository_brain.main:app --host 127.0.0.1 --port 8000

# Terminal 3: exercise the relay (non-streaming and streaming)
curl -X POST http://127.0.0.1:8000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Reply with exactly: HELLO"}], "stream": false}'

curl -N -X POST http://127.0.0.1:8000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Reply with exactly: HELLO"}], "stream": true}'
```

The stub returns `HELLO` (non-streaming) and SSE chunks ending with `data: [DONE]`
(streaming), so the manual checks in the acceptance checklist are reproducible. The relay
code path is identical whether the backend is this stub or a real Qwen3 server.

## OpenAI-compatible proxy (Roo Code)

Point any OpenAI-compatible client at Repository Brain:

| Setting       | Value                              |
| ------------- | ---------------------------------- |
| Provider      | OpenAI-compatible                  |
| Base URL      | `http://127.0.0.1:8000/api/v1`     |
| API Key       | *(any value, or leave unset)*      |
| Model         | `repository-brain-v1`              |
| Context       | `128000`                          |

`repository-brain-v1` is advertised by `GET /api/v1/models` and is mapped to the real
upstream model (`OPENAI_MODEL`) when forwarded. Streaming is fully supported, including
tool/function calls for Roo Code.

### curl examples

```bash
# List advertised models
curl http://localhost:8000/api/v1/models

# Non-streaming chat completion
curl http://localhost:8000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "repository-brain-v1",
    "messages": [{"role": "user", "content": "Hello"}]
  }'

# Streaming chat completion (SSE)
curl -N http://localhost:8000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "repository-brain-v1",
    "messages": [{"role": "user", "content": "Write a haiku"}],
    "stream": true
  }'
```

### Proxy behaviour

- `stream: true` responses are relayed byte-for-byte as `text/event-stream`.
- Upstream non-200 statuses (429, 502, 503, 504, ...) are preserved and returned as
  OpenAI-compatible `{"error": {...}}` envelopes — never hidden behind a 200.
- Upstream timeouts return `504 gateway_timeout`; unreachable backends return
  `502 bad_gateway`.
- `GET /api/v1/models` is served locally and never requires the backend to be running.

### Register and index a repository

```bash
curl -X POST http://localhost:8000/repositories \
  -H "Content-Type: application/json" \
  -d '{"name": "my-project", "path": "/absolute/path/to/my-project"}'

# Index it (incremental by default; pass ?full=true to re-index everything)
curl -X POST http://localhost:8000/repositories/<id>/scan
```

### Query

```bash
# Search across symbols, files, modules and dependencies
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"repository_id": "<id>", "query": "ForecastService"}'

# Repository memory
curl http://localhost:8000/summary?repository_id=<id>
curl http://localhost:8000/architecture?repository_id=<id>
curl http://localhost:8000/statistics?repository_id=<id>

# Graphs
curl http://localhost:8000/dependencies/graph/repository/<id>
curl http://localhost:8000/modules/graph/repository/<id>
```

## Docker

Repository Brain can run in Docker with the official `uv` runtime. Build and run
without PostgreSQL (SQLite, good for a quick proxy):

```bash
docker build -t repository-brain .
docker run --rm -p 8000:8000 \
  -e OPENAI_BACKEND=http://host.docker.internal:8033/v1 \
  -e OPENAI_MODEL=qwen35b \
  -v "$PWD/storage:/srv/brain/storage" \
  repository-brain
```

Or use the provided compose file (PostgreSQL + API). It reads configuration from your
environment — no secrets are hardcoded:

```bash
export POSTGRES_USER=brain POSTGRES_PASSWORD=change-me
export OPENAI_BACKEND=http://host.docker.internal:8033/v1
docker compose up --build
```

Qwen stays separate: point `OPENAI_BACKEND` at wherever the LLM server runs.

## Testing

```bash
uv run pytest              # run the full test suite
uv run pytest -v           # verbose
uv run ruff check app tests
uv run ruff format --check app tests
```

## Troubleshooting

| Symptom | Likely cause / fix |
| ------- | ------------------ |
| `/health` returns non-200 | Repository Brain process is down; check `uv run uvicorn` is running |
| Chat completions return `502 bad_gateway` | `OPENAI_BACKEND` is unreachable — start Qwen or fix the URL |
| Chat completions return `504 gateway_timeout` | Upstream LLM is slow; raise `OPENAI_TIMEOUT` |
| Chat completions return `429` / `503` | Upstream is rate-limited or busy (status is relayed unchanged) |
| `GET /api/v1/models` returns an empty list | `OPENAI_ADVERTISED_MODEL` was changed — restart with the expected name |
| Roo Code reports "model not found" | Use the exact model from `/api/v1/models` (`repository-brain-v1`) |
| Streaming hangs | Ensure `stream: true` is set and the client reads SSE (`curl -N`) |
| `uv run` fails | Run `uv sync --extra dev` first |
| `ImportError: app` | Run uvicorn from the project root, or use `uv run repository-brain` |

## Documentation

- `docs/ARCHITECTURE.md` — system design and component overview
- `docs/API.md` — REST API reference (including OpenAI-compatible endpoints)
- `docs/DATABASE.md` — database schema
- `docs/ROADMAP.md` — project roadmap
- `docs/CHANGELOG.md` — release history
- `docs/CONTRIBUTING.md` — contribution guide

## License

MIT — see `LICENSE`.
