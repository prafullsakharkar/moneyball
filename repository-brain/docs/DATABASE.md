# Database

Repository Brain uses SQLAlchemy 2.x ORM with a UUID primary key for every entity.
Development runs on SQLite (`sqlite:///./storage/brain.db`); production targets
PostgreSQL (`postgresql+psycopg://`). Schema migrations use Alembic.

## Entity relationship overview

```
Repository
 ├── FileEntry (files)            one per indexed file
 │     └── Symbol (symbols)       one per parsed symbol
 │           ├── Symbol.parent_id (self FK → hierarchy)
 │           └── Dependency.source_symbol_id / target_symbol_id
 │     └── Dependency.source_file_id / target_file_id
 ├── Dependency (dependencies)    edges in the dependency graph
 ├── Module (modules)             logical module
 │     ├── ModuleFile (module_files)   module ↔ file association
 │     └── ModuleDependency (module_dependencies) module↔module edges
 ├── Architecture (architectures) detected architecture content (JSON)
 └── RepositoryMemory (memories)  persisted repository memory
```

## Tables

### `repositories`

| Column            | Type      | Notes                          |
| ----------------- | --------- | ------------------------------ |
| `id`              | uuid PK   |                                |
| `name`            | text      | unique, indexed                |
| `path`            | text      | absolute filesystem path, unique |
| `url`             | text      | optional remote URL            |
| `description`     | text      | optional                       |
| `default_branch`  | text      | e.g. `main`                    |
| `vcs`             | text      | `git` / `hg` / ...             |
| `status`          | text      | `registered` / `scanning` / `ready` |
| `is_watched`      | boolean   | watch flag                     |
| `last_scanned_at` | datetime  |                                |
| `extra`           | json      | extension data (e.g. aliases)  |
| `created_at` / `updated_at` | datetime | timestamps           |

### `files`

One row per indexed file. `(repository_id, path)` is unique.

### `symbols`

One row per parsed symbol. `(repository_id, file_id, qualified_name)` is unique.
`parent_id` self-references `symbols.id` to build class/method hierarchy.

### `dependencies`

Directed edges. `(repository_id, source_symbol_id, name, kind)` is unique. A dependency
may link files (`source_file_id` → `target_file_id`) and symbols
(`source_symbol_id` → `target_symbol_id`). `is_resolved` / `is_external` flag the edge.

### `modules`, `module_files`, `module_dependencies`

`modules.name` is unique per repository. `module_files` associates files with a module
and a `role` (`core` / `api` / `config` / `tests` / `scripts`). `module_dependencies`
records module-level edges with a `weight`.

### `architectures`

Single row per repository holding the full detected architecture document in `content`
(JSON): `languages`, `frameworks`, `manifests`, `entry_points`, `patterns`,
`conventions`, `structure`.

### `memories`

Single row per repository (`repository_id` is the PK). Holds the composed memory:
`summary`, `architecture_summary`, `module_summaries` (JSON), `conventions` (JSON),
`patterns` (JSON), `statistics` (JSON), and a monotonically increasing `version`.

## Migrations

Alembic migrations live in `migrations/`. To generate an initial migration:

```bash
uv run alembic init migrations
uv run alembic revision --autogenerate -m "initial schema"
uv run alembic upgrade head
```

For SQLite development, tables are created automatically by `init_db()` on application
startup, so migrations are only required for production PostgreSQL deployments.
