"""OpenAI-compatible proxy client.

Repository Brain is only a relay: it forwards requests to the upstream
OpenAI-compatible backend and returns the backend's response unchanged.
It never executes the LLM itself.
"""

from __future__ import annotations

import httpx

from repository_brain.core.config import Settings, get_settings
from repository_brain.core.logging import get_logger


class LLMClient:
    """HTTP client that forwards OpenAI-compatible requests upstream."""

    def __init__(
        self, settings: Settings | None = None, *, transport: httpx.BaseTransport | None = None
    ) -> None:
        self.settings = settings or get_settings()
        self.log = get_logger("proxy.llm")
        self._client = httpx.Client(
            timeout=httpx.Timeout(self.settings.openai_timeout),
            transport=transport,
        )

    def close(self) -> None:
        self._client.close()

    def map_model(self, payload: dict) -> dict:
        """Return a copy of the payload with only the model replaced.

        The incoming client model (e.g. ``repository-brain-v1``) is mapped to the
        configured upstream model (``OPENAI_MODEL``). All other fields are untouched.
        """
        body = dict(payload)
        body["model"] = self.settings.openai_model
        return body

    def _request_headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.settings.openai_api_key:
            headers["Authorization"] = f"Bearer {self.settings.openai_api_key}"
        return headers

    def chat_completions(self, payload: dict) -> httpx.Response:
        """Forward a chat completion request and return the upstream response."""
        body = self.map_model(payload)
        self.log.info(
            "proxy_forward_chat_completion",
            backend=self.settings.openai_backend,
            model=self.settings.openai_model,
        )
        return self._client.post(
            self.settings.openai_chat_completions_url,
            json=body,
            headers=self._request_headers(),
        )

    def chat_completions_stream(self, payload: dict) -> httpx.Response:
        """Open a streaming request to the upstream backend.

        The returned response is still streaming: its body has not been read.
        The caller must read it (``iter_bytes``/``iter_raw``) and call ``close``
        to release the connection.
        """
        body = self.map_model(payload)
        self.log.info(
            "proxy_open_stream",
            backend=self.settings.openai_backend,
            model=self.settings.openai_model,
        )
        request = self._client.build_request(
            "POST",
            self.settings.openai_chat_completions_url,
            json=body,
            headers=self._request_headers(),
        )
        return self._client.send(request, stream=True)
