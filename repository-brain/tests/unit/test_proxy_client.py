"""Unit tests for the OpenAI-compatible proxy client (mocked HTTP only)."""

from __future__ import annotations

import json

import httpx
from repository_brain.core.config import Settings
from repository_brain.proxy.client import LLMClient

UPSTREAM_OK = {
    "id": "chatcmpl-unit",
    "object": "chat.completion",
    "created": 1234567890,
    "model": "qwen35b",
    "choices": [
        {
            "index": 0,
            "message": {"role": "assistant", "content": "Hi"},
            "finish_reason": "stop",
        }
    ],
    "usage": {"prompt_tokens": 2, "completion_tokens": 1, "total_tokens": 3},
}


def _settings(**overrides) -> Settings:
    defaults = {
        "_env_file": None,
        "openai_backend": "http://localhost:8033/v1",
        "openai_api_key": "",
        "openai_model": "qwen35b",
    }
    defaults.update(overrides)
    return Settings(**defaults)


def _capturing_client(captured: dict, settings: Settings | None = None) -> LLMClient:
    def handler(request: httpx.Request) -> httpx.Response:
        captured["url"] = str(request.url)
        captured["headers"] = dict(request.headers)
        captured["body"] = json.loads(request.content)
        return httpx.Response(200, json=UPSTREAM_OK)

    return LLMClient(settings=settings or _settings(), transport=httpx.MockTransport(handler))


class TestModelMapping:
    def test_repository_brain_v1_maps_to_qwen35b(self):
        captured: dict = {}
        client = _capturing_client(captured)
        try:
            client.chat_completions(
                {"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert captured["body"]["model"] == "qwen35b"

    def test_any_incoming_model_maps_to_configured_model(self):
        captured: dict = {}
        client = _capturing_client(captured)
        try:
            client.chat_completions(
                {
                    "model": "totally-different-model",
                    "messages": [{"role": "user", "content": "Hi"}],
                }
            )
        finally:
            client.close()
        assert captured["body"]["model"] == "qwen35b"

    def test_map_model_preserves_other_fields(self):
        payload = {
            "model": "repository-brain-v1",
            "messages": [{"role": "system", "content": "sys"}, {"role": "user", "content": "u"}],
            "temperature": 0.5,
            "n": 2,
        }
        client = LLMClient(
            settings=_settings(),
            transport=httpx.MockTransport(lambda r: httpx.Response(200, json={})),
        )
        try:
            mapped = client.map_model(payload)
        finally:
            client.close()
        assert mapped["model"] == "qwen35b"
        assert mapped["messages"] == payload["messages"]
        assert mapped["temperature"] == 0.5
        assert mapped["n"] == 2
        # The original payload is never mutated.
        assert payload["model"] == "repository-brain-v1"


class TestFieldPreservation:
    def test_messages_preserved(self):
        captured: dict = {}
        client = _capturing_client(captured)
        messages = [
            {"role": "system", "content": "You are helpful."},
            {"role": "user", "content": "Hello"},
        ]
        try:
            client.chat_completions({"model": "repository-brain-v1", "messages": messages})
        finally:
            client.close()
        assert captured["body"]["messages"] == messages

    def test_tools_preserved(self):
        captured: dict = {}
        client = _capturing_client(captured)
        tool = {
            "type": "function",
            "function": {
                "name": "get_weather",
                "parameters": {"type": "object", "properties": {"city": {"type": "string"}}},
            },
        }
        try:
            client.chat_completions(
                {
                    "model": "repository-brain-v1",
                    "messages": [{"role": "user", "content": "weather?"}],
                    "tools": [tool],
                }
            )
        finally:
            client.close()
        assert captured["body"]["tools"] == [tool]

    def test_tool_choice_preserved(self):
        captured: dict = {}
        client = _capturing_client(captured)
        tool_choice = {"type": "function", "function": {"name": "get_weather"}}
        try:
            client.chat_completions(
                {
                    "model": "repository-brain-v1",
                    "messages": [{"role": "user", "content": "weather?"}],
                    "tool_choice": tool_choice,
                }
            )
        finally:
            client.close()
        assert captured["body"]["tool_choice"] == tool_choice

    def test_stream_preserved(self):
        captured: dict = {}
        client = _capturing_client(captured)
        try:
            client.chat_completions(
                {
                    "model": "repository-brain-v1",
                    "messages": [{"role": "user", "content": "Hi"}],
                    "stream": True,
                }
            )
        finally:
            client.close()
        assert captured["body"]["stream"] is True

    def test_sampling_and_extra_fields_preserved(self):
        captured: dict = {}
        client = _capturing_client(captured)
        payload = {
            "model": "repository-brain-v1",
            "messages": [{"role": "user", "content": "Hi"}],
            "temperature": 0.7,
            "top_p": 0.9,
            "max_tokens": 64,
            "stop": ["\n"],
            "presence_penalty": 0.1,
            "frequency_penalty": -0.1,
            "seed": 7,
            "response_format": {"type": "json_object"},
            "user": "abc",
        }
        try:
            client.chat_completions(payload)
        finally:
            client.close()
        body = captured["body"]
        assert body["model"] == "qwen35b"
        for field, value in payload.items():
            if field != "model":
                assert body[field] == value


class TestHeaders:
    def test_content_type_application_json(self):
        captured: dict = {}
        client = _capturing_client(captured)
        try:
            client.chat_completions(
                {"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert captured["headers"]["content-type"] == "application/json"

    def test_authorization_bearer_sent(self):
        captured: dict = {}
        client = _capturing_client(captured, settings=_settings(openai_api_key="sk-test-123"))
        try:
            client.chat_completions(
                {"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert captured["headers"]["authorization"] == "Bearer sk-test-123"

    def test_no_authorization_when_key_unset(self):
        captured: dict = {}
        client = _capturing_client(captured)
        try:
            client.chat_completions(
                {"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert "authorization" not in {k.lower() for k in captured["headers"]}

    def test_forwarded_to_chat_completions_endpoint(self):
        captured: dict = {}
        client = _capturing_client(captured)
        try:
            client.chat_completions(
                {"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert captured["url"] == "http://localhost:8033/v1/chat/completions"


class TestSecretLogging:
    def test_api_key_never_logged(self, caplog, capsys):
        from repository_brain.core.logging import configure_logging

        configure_logging("DEBUG")
        secret = "super-secret-api-key-xyz"
        captured: dict = {}
        client = _capturing_client(captured, settings=_settings(openai_api_key=secret))
        try:
            client.chat_completions(
                {"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()

        assert captured["headers"]["authorization"] == f"Bearer {secret}"
        logs = caplog.text + capsys.readouterr().out
        assert secret not in logs


def _sse_bytes(*items: str) -> list[bytes]:
    return [f"data: {item}\n\n".encode() for item in items]


class TestStreamingClient:
    def _streaming_client(self, captured: dict, settings: Settings | None = None) -> LLMClient:
        def handler(request: httpx.Request) -> httpx.Response:
            captured["url"] = str(request.url)
            captured["headers"] = dict(request.headers)
            captured["body"] = json.loads(request.content)
            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=iter(_sse_bytes('{"choices":[{"delta":{"content":"HEL"}}]}', "[DONE]")),
            )

        return LLMClient(
            settings=settings or _settings(),
            transport=httpx.MockTransport(handler),
        )

    def _read_stream(self, client: LLMClient, payload: dict) -> bytes:
        response = client.chat_completions_stream(payload)
        try:
            return b"".join(response.iter_bytes())
        finally:
            response.close()

    def test_chunks_relayed_in_order(self):
        captured: dict = {}
        client = self._streaming_client(captured)
        try:
            body = self._read_stream(
                client,
                {"model": "repository-brain-v1", "messages": [{"role": "user", "content": "Hi"}]},
            )
        finally:
            client.close()
        assert body == (b'data: {"choices":[{"delta":{"content":"HEL"}}]}\n\ndata: [DONE]\n\n')

    def test_model_mapped_for_stream(self):
        captured: dict = {}
        client = self._streaming_client(captured)
        try:
            self._read_stream(
                client,
                {
                    "model": "repository-brain-v1",
                    "messages": [{"role": "user", "content": "Hi"}],
                    "stream": True,
                },
            )
        finally:
            client.close()
        assert captured["body"]["model"] == "qwen35b"
        assert captured["body"]["stream"] is True

    def test_stream_flag_forwarded(self):
        captured: dict = {}
        client = self._streaming_client(captured)
        try:
            self._read_stream(
                client,
                {"model": "m", "messages": [{"role": "user", "content": "Hi"}], "stream": True},
            )
        finally:
            client.close()
        assert captured["body"]["stream"] is True

    def test_forwarded_to_chat_completions_endpoint(self):
        captured: dict = {}
        client = self._streaming_client(captured)
        try:
            self._read_stream(
                client, {"model": "m", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert captured["url"] == "http://localhost:8033/v1/chat/completions"

    def test_content_type_application_json(self):
        captured: dict = {}
        client = self._streaming_client(captured)
        try:
            self._read_stream(
                client, {"model": "m", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert captured["headers"]["content-type"] == "application/json"

    def test_authorization_bearer_sent_for_stream(self):
        captured: dict = {}
        client = self._streaming_client(captured, settings=_settings(openai_api_key="sk-stream-9"))
        try:
            self._read_stream(
                client, {"model": "m", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert captured["headers"]["authorization"] == "Bearer sk-stream-9"

    def test_no_authorization_when_key_unset_for_stream(self):
        captured: dict = {}
        client = self._streaming_client(captured)
        try:
            self._read_stream(
                client, {"model": "m", "messages": [{"role": "user", "content": "Hi"}]}
            )
        finally:
            client.close()
        assert "authorization" not in {k.lower() for k in captured["headers"]}

    def test_first_chunk_arrives_before_stream_fully_consumed(self):
        """The client must not buffer the whole upstream body before yielding."""
        import threading

        release_rest = threading.Event()

        def first_chunk():
            yield b'data: {"choices":[{"delta":{"content":"HEL"}}]}\n\n'
            release_rest.wait(timeout=5)
            yield b'data: {"choices":[{"delta":{"content":"LO"}}]}\n\n'
            yield b"data: [DONE]\n\n"

        def handler(_request):
            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=iter(first_chunk()),
            )

        client = LLMClient(settings=_settings(), transport=httpx.MockTransport(handler))
        try:
            response = client.chat_completions_stream(
                {"model": "m", "messages": [{"role": "user", "content": "Hi"}]}
            )
            chunks = response.iter_bytes()
            first = next(chunks)
            assert b"HEL" in first
            assert not release_rest.is_set()
            release_rest.set()
            rest = list(chunks)
            assert any(b"LO" in c for c in rest)
            assert any(b"[DONE]" in c for c in rest)
            response.close()
        finally:
            client.close()

    def test_streaming_error_status_and_body_accessible(self):
        error_body = {"error": {"message": "upstream exploded", "type": "server_error"}}
        handler = lambda _request: httpx.Response(  # noqa: E731
            500,
            headers={"content-type": "application/json"},
            content=iter([json.dumps(error_body).encode()]),
        )
        client = LLMClient(settings=_settings(), transport=httpx.MockTransport(handler))
        try:
            response = client.chat_completions_stream(
                {"model": "m", "messages": [{"role": "user", "content": "Hi"}]}
            )
            try:
                assert response.status_code == 500
                assert json.loads(response.read()) == error_body
            finally:
                response.close()
        finally:
            client.close()

    def test_api_key_never_logged_for_stream(self, caplog, capsys):
        from repository_brain.core.logging import configure_logging

        configure_logging("DEBUG")
        secret = "super-secret-stream-key-abc"
        captured: dict = {}
        client = self._streaming_client(captured, settings=_settings(openai_api_key=secret))
        try:
            self._read_stream(
                client,
                {"model": "m", "messages": [{"role": "user", "content": "Hi"}]},
            )
        finally:
            client.close()

        assert captured["headers"]["authorization"] == f"Bearer {secret}"
        logs = caplog.text + capsys.readouterr().out
        assert secret not in logs
