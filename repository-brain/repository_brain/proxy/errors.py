"""OpenAI-compatible error responses for the Phase 1 proxy.

Backend failures are never converted into an HTTP 200, and a backend that
returns ``choices: []`` is reported as an error rather than fake success.
These helpers produce the standard OpenAI error envelope::

    {"error": {"message": ..., "type": ..., "param": ..., "code": ...}}
"""

from __future__ import annotations

import json
from typing import Any

from fastapi.responses import JSONResponse

REDACTED = "[REDACTED]"

#: HTTP status -> (type, code, default message) for upstream failures.
_STATUS_ERRORS: dict[int, tuple[str, str, str]] = {
    400: ("invalid_request_error", "invalid_request", "Bad request"),
    401: ("authentication_error", "authentication_error", "Invalid API key"),
    403: ("permission_error", "permission_denied", "Permission denied"),
    404: ("invalid_request_error", "not_found", "Endpoint not found"),
    408: ("request_timeout", "request_timeout", "Request timed out"),
    429: ("rate_limit_error", "rate_limit_exceeded", "Rate limit exceeded"),
    500: ("server_error", "internal_server_error", "Internal server error"),
    502: ("server_error", "bad_gateway", "Bad gateway"),
    503: ("server_error", "service_unavailable", "Service unavailable"),
    504: ("server_error", "gateway_timeout", "Gateway timeout"),
}


def openai_error(
    message: str,
    *,
    type_: str = "server_error",
    code: str = "server_error",
    param: Any = None,
) -> dict[str, Any]:
    """Build the OpenAI error envelope body."""
    return {
        "error": {
            "message": message,
            "type": type_,
            "param": param,
            "code": code,
        }
    }


def error_response(
    status_code: int,
    message: str,
    *,
    type_: str = "server_error",
    code: str = "server_error",
    param: Any = None,
) -> JSONResponse:
    """Return a JSONResponse carrying the OpenAI error envelope."""
    return JSONResponse(
        status_code=status_code,
        content=openai_error(message, type_=type_, code=code, param=param),
    )


def backend_error_response(
    status_code: int,
    body: bytes,
    *,
    content_type: str | None = None,
) -> JSONResponse:
    """Map a non-200 upstream response to an OpenAI-compatible error.

    If the upstream body is already an OpenAI error envelope the message and
    type/code are preserved; otherwise a sensible default is used. The upstream
    status code is always preserved — never converted into HTTP 200.
    """
    type_, code, message = _STATUS_ERRORS.get(
        status_code, ("server_error", "backend_error", "Upstream backend error")
    )

    if content_type and "json" in content_type:
        try:
            payload = json.loads(body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            payload = None
        if isinstance(payload, dict):
            err = payload.get("error")
            if isinstance(err, dict):
                message = err.get("message") or message
                type_ = err.get("type") or type_
                code = err.get("code") or code
            elif isinstance(err, str):
                message = err

    return error_response(status_code, message, type_=type_, code=code)
