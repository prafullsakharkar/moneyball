"""Request ID generation for tracing proxy requests end-to-end."""

from __future__ import annotations

import secrets
import time


def generate_request_id() -> str:
    """Return a unique request ID like ``rb_<epoch_ms>_<random hex>``."""
    millis = int(time.time() * 1000)
    random = secrets.token_hex(6)
    return f"rb_{millis}_{random}"
