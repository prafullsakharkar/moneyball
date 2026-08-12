"""Unit tests for the bundled OpenAI-compatible stub backend.

These guarantee the manual acceptance checks are reproducible: the stub must
produce a non-streaming completion and an SSE stream ending with ``[DONE]``.
"""

from __future__ import annotations

import json

from scripts.qwen_stub import (
    completion_response,
    models_response,
    stream_response,
)


def test_models_response_lists_upstream_model():
    body, content_type = models_response()
    assert content_type == "application/json"
    assert body["object"] == "list"
    assert [m["id"] for m in body["data"]] == ["qwen35b"]


def test_completion_response_has_assistant_message():
    body, content_type = completion_response()
    assert content_type == "application/json"
    assert len(body["choices"]) == 1
    message = body["choices"][0]["message"]
    assert message["role"] == "assistant"
    assert message["content"] == "HELLO"


def test_stream_response_is_sse_with_done_marker():
    body, content_type = stream_response()
    assert content_type == "text/event-stream"
    assert body.endswith(b"data: [DONE]\n\n")
    lines = [ln for ln in body.decode().splitlines() if ln.startswith("data: ")]
    # Chunk data lines carry a non-empty choices list; the final marker is [DONE].
    for line in lines[:-1]:
        payload = json.loads(line[len("data: ") :])
        assert payload["choices"], "choices must never be empty in a chunk"
    assert lines[-1] == "data: [DONE]"
