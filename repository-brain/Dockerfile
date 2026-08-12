FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /srv/brain

# Git is required for indexing git repositories.
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock README.md ./
COPY repository_brain ./repository_brain
COPY migrations ./migrations

# Install the project and its locked dependencies into a managed virtualenv.
RUN uv sync --frozen --no-dev

EXPOSE 8000

ENV APP_HOST=0.0.0.0 \
    APP_PORT=8000 \
    STORAGE_DIR=/srv/brain/storage

CMD ["uv", "run", "python", "-m", "uvicorn", "repository_brain.main:app", "--host", "0.0.0.0", "--port", "8000"]
