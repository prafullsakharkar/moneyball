"""OpenAI-compatible proxy endpoints (Phase 1).

The proxy relays requests to the upstream backend and never executes the LLM
itself. Backend failures are mapped to OpenAI-compatible errors and are never
converted into an HTTP 200. Every request is logged with structured fields and
a request ID that spans the full lifecycle.
"""

from __future__ import annotations

import json
import time
from collections.abc import Iterator
from typing import Any

import httpx
from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import StreamingResponse

from repository_brain.api.dependencies import get_llm_client
from repository_brain.core.config import get_settings
from repository_brain.core.logging import get_logger
from repository_brain.proxy.client import LLMClient
from repository_brain.proxy.errors import backend_error_response, error_response
from repository_brain.schemas.openai import (
    ChatCompletionRequest,
    ChatCompletionResponse,
    Model,
    ModelList,
)

log = get_logger("api.llm")
router = APIRouter(prefix="/api/v1", tags=["llm"])


@router.get("/models")
def list_models() -> ModelList:
    """List the OpenAI-compatible models Repository Brain exposes.

    The advertised model is ``OPENAI_ADVERTISED_MODEL`` (default
    ``repository-brain-v1``). It is served locally and never requires the
    upstream LLM backend to be running, so clients (e.g. Roo Code) can discover
    the model before any chat request is made.
    """
    settings = get_settings()
    return ModelList(data=[Model(id=settings.openai_advertised_model)])


def _request_context(
    request: Request, payload: ChatCompletionRequest, client: LLMClient
) -> dict[str, Any]:
    """Structured context for request-scoped logging (no secrets logged)."""
    return {
        "request_id": getattr(request.state, "request_id", None),
        "method": request.method,
        "path": request.url.path,
        "incoming_model": payload.model,
        "backend_model": client.settings.openai_model,
        "stream": payload.stream,
        "message_count": len(payload.messages),
        "tools_count": len(payload.tools) if payload.tools else 0,
        "request_bytes": len(json.dumps(payload.model_dump(exclude_unset=True)).encode()),
    }


def _open_stream(client: LLMClient, body: dict, ctx: dict[str, Any]) -> Response:
    """Open the upstream streaming request and relay it as SSE."""
    started = time.monotonic()
    try:
        upstream = client.chat_completions_stream(body)
    except httpx.TimeoutException as exc:
        log.warning("proxy_backend_timeout", **ctx, error=str(exc)[:200])
        return error_response(504, "Upstream request timed out", code="gateway_timeout")
    except httpx.RequestError as exc:
        log.warning("proxy_backend_unreachable", **ctx, error=str(exc)[:200])
        return error_response(502, f"Upstream backend unavailable: {exc}", code="bad_gateway")

    elapsed_ms = int((time.monotonic() - started) * 1000)
    backend_ctx = {
        **ctx,
        "backend_status": upstream.status_code,
        "content_type": upstream.headers.get("content-type"),
        "elapsed_ms": elapsed_ms,
    }
    log.info("proxy_backend_connected", **backend_ctx)

    if upstream.status_code != 200:
        try:
            body_bytes = upstream.read()
        finally:
            upstream.close()
        log.warning("proxy_backend_error", **backend_ctx)
        return backend_error_response(
            upstream.status_code,
            body_bytes,
            content_type=upstream.headers.get("content-type"),
        )

    content_type = upstream.headers.get("content-type") or "text/event-stream"
    first_token_ms: int | None = None
    chunks = 0
    bytes_received = 0

    def generate() -> Iterator[bytes]:
        nonlocal first_token_ms, chunks, bytes_received
        stream_started = time.monotonic()
        try:
            for chunk in upstream.iter_bytes():
                if first_token_ms is None:
                    first_token_ms = int((time.monotonic() - stream_started) * 1000)
                chunks += 1
                bytes_received += len(chunk)
                yield chunk
        except httpx.RequestError as exc:
            log.warning(
                "proxy_stream_disconnect",
                **ctx,
                backend_status=upstream.status_code,
                chunks_received=chunks,
                bytes_received=bytes_received,
                first_token_ms=first_token_ms,
                error=str(exc)[:200],
            )
        finally:
            upstream.close()
            log.info(
                "proxy_request_complete",
                **ctx,
                backend_status=upstream.status_code,
                content_type=content_type,
                elapsed_ms=int((time.monotonic() - started) * 1000),
                chunks_received=chunks,
                bytes_received=bytes_received,
                first_token_ms=first_token_ms,
            )

    return StreamingResponse(generate(), headers={"content-type": content_type})


@router.post("/chat/completions")
def create_chat_completion(
    request: Request,
    payload: ChatCompletionRequest,
    client: LLMClient = Depends(get_llm_client),
) -> Response:
    """Accept an OpenAI-compatible chat completion request and relay it upstream.

    Streaming requests are forwarded byte-for-byte as an SSE stream. Non-streaming
    successful responses are validated to carry a real completion before being
    returned unchanged. Upstream failures yield OpenAI-compatible errors with the
    backend status preserved; this endpoint never fabricates assistant content.
    """
    body = payload.model_dump(exclude_unset=True)
    ctx = _request_context(request, payload, client)
    log.info("proxy_request_start", **ctx)

    if payload.stream:
        return _open_stream(client, body, ctx)

    started = time.monotonic()
    try:
        upstream = client.chat_completions(body)
    except httpx.TimeoutException as exc:
        log.warning("proxy_backend_timeout", **ctx, error=str(exc)[:200])
        return error_response(504, "Upstream request timed out", code="gateway_timeout")
    except httpx.RequestError as exc:
        log.warning("proxy_backend_unreachable", **ctx, error=str(exc)[:200])
        return error_response(502, f"Upstream backend unavailable: {exc}", code="bad_gateway")

    elapsed_ms = int((time.monotonic() - started) * 1000)
    backend_ctx = {
        **ctx,
        "backend_status": upstream.status_code,
        "content_type": upstream.headers.get("content-type"),
        "elapsed_ms": elapsed_ms,
    }
    log.info("proxy_backend_connected", **backend_ctx)

    if upstream.status_code != 200:
        log.warning("proxy_backend_error", **backend_ctx)
        return backend_error_response(
            upstream.status_code,
            upstream.content,
            content_type=upstream.headers.get("content-type"),
        )

    media_type = upstream.headers.get("content-type") or "application/json"

    try:
        parsed = upstream.json()
    except (json.JSONDecodeError, UnicodeDecodeError):
        log.warning("proxy_backend_malformed_json", **backend_ctx)
        return error_response(
            502,
            "Backend returned malformed JSON",
            code="invalid_backend_response",
        )

    try:
        ChatCompletionResponse.model_validate(parsed)
    except ValueError as exc:
        log.warning(
            "proxy_backend_invalid_completion",
            **backend_ctx,
            error=str(exc)[:200],
        )
        return error_response(
            502,
            "Backend returned an invalid completion response",
            code="invalid_backend_response",
        )

    log.info("proxy_request_complete", **backend_ctx)
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        media_type=media_type,
    )
