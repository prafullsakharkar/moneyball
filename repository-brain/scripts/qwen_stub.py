"""OpenAI-compatible stub LLM backend for manual verification.

Serves a fake Qwen3 on :8033 so the Repository Brain relay can be exercised
end-to-end without a real LLM server. It implements the subset of the OpenAI
API that the relay needs:

- GET  /v1/models            -> lists "qwen35b"
- POST /v1/chat/completions  -> non-streaming JSON completion ("HELLO")
                                or SSE chunks + `data: [DONE]` when
                                the request body has `"stream": true`

Usage:
    python scripts/qwen_stub.py            # listen on 127.0.0.1:8033

Then point OPENAI_BACKEND at http://127.0.0.1:8033/v1 and run the curl
examples from the README. This stub is intentionally deterministic so the
manual checks are reproducible.
"""

from __future__ import annotations

import json
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

HOST = "127.0.0.1"


def _default_port() -> int:
    """Return the port from argv when run as a script, else the default."""
    return int(sys.argv[1]) if len(sys.argv) > 1 else 8033


COMPLETION = {
    "id": "chatcmpl-qwen",
    "object": "chat.completion",
    "created": 1786382291,
    "model": "qwen35b",
    "choices": [
        {
            "index": 0,
            "message": {"role": "assistant", "content": "HELLO"},
            "finish_reason": "stop",
        }
    ],
    "usage": {"prompt_tokens": 5, "completion_tokens": 1, "total_tokens": 6},
}

STREAM_CHUNKS = [
    {
        "id": "chatcmpl-qwen",
        "object": "chat.completion.chunk",
        "created": 1786382291,
        "model": "qwen35b",
        "choices": [{"index": 0, "delta": {"content": "HE"}, "finish_reason": None}],
    },
    {
        "id": "chatcmpl-qwen",
        "object": "chat.completion.chunk",
        "created": 1786382291,
        "model": "qwen35b",
        "choices": [{"index": 0, "delta": {"content": "LLO"}, "finish_reason": None}],
    },
    {
        "id": "chatcmpl-qwen",
        "object": "chat.completion.chunk",
        "created": 1786382291,
        "model": "qwen35b",
        "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
    },
]

MODELS_BODY = {"object": "list", "data": [{"id": "qwen35b", "object": "model"}]}


def models_response() -> tuple[dict, str]:
    """Return the (body, content_type) for ``GET /v1/models``."""
    return MODELS_BODY, "application/json"


def completion_response() -> tuple[dict, str]:
    """Return the (body, content_type) for a non-streaming completion."""
    return COMPLETION, "application/json"


def stream_response() -> tuple[bytes, str]:
    """Return the (body, content_type) for a streaming SSE completion.

    The body is OpenAI SSE: one ``data: {...}`` line per chunk followed by a
    terminating ``data: [DONE]``.
    """
    sse = b"".join(b"data: " + json.dumps(c).encode() + b"\n\n" for c in STREAM_CHUNKS)
    sse += b"data: [DONE]\n\n"
    return sse, "text/event-stream"


class Handler(BaseHTTPRequestHandler):
    def _send(self, status: int, raw: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("content-type", content_type)
        self.send_header("content-length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self) -> None:
        if self.path == "/v1/models":
            body, content_type = models_response()
            self._send(200, json.dumps(body).encode(), content_type)
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self) -> None:
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try:
            is_stream = bool(json.loads(body).get("stream"))
        except (json.JSONDecodeError, TypeError):
            is_stream = False

        if is_stream:
            sse, content_type = stream_response()
            self._send(200, sse, content_type)
            return
        completion, content_type = completion_response()
        self._send(200, json.dumps(completion).encode(), content_type)

    def log_message(self, fmt: str, *args: object) -> None:
        sys.stderr.write(f"qwen-stub: {fmt % args}\n")


if __name__ == "__main__":
    HTTPServer((HOST, _default_port()), Handler).serve_forever()
