"""Integration tests for the OpenAI-compatible chat completions proxy endpoint."""

from __future__ import annotations

import json

import httpx
import pytest
from fastapi.testclient import TestClient
from repository_brain.core.config import Settings
from repository_brain.proxy.client import LLMClient
from repository_brain.services.container import get_container

UPSTREAM_OK = {
    "id": "chatcmpl-test",
    "object": "chat.completion",
    "created": 1234567890,
    "model": "qwen35b",
    "choices": [
        {
            "index": 0,
            "message": {"role": "assistant", "content": "Hello!"},
            "finish_reason": "stop",
        }
    ],
    "usage": {"prompt_tokens": 5, "completion_tokens": 2, "total_tokens": 7},
}


def _install_client(handler, settings: Settings | None = None):
    """Swap the process-wide LLM client for a mocked one and return it."""
    settings = settings or Settings(
        _env_file=None,
        openai_backend="http://localhost:8033/v1",
        openai_api_key="",
    )
    llm = LLMClient(settings=settings, transport=httpx.MockTransport(handler))
    container = get_container()
    original = container.llm_client
    container.llm_client = llm
    return llm, original


@pytest.fixture()
def capture():
    captured: dict = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["url"] = str(request.url)
        captured["method"] = request.method
        captured["headers"] = dict(request.headers)
        captured["body"] = json.loads(request.content)
        return httpx.Response(200, json=UPSTREAM_OK)

    yield captured, handler


@pytest.fixture()
def client(capture):
    captured, handler = capture
    llm, original = _install_client(handler)
    from repository_brain.main import create_app

    with TestClient(create_app()) as c:
        yield c, captured
    container = get_container()
    container.llm_client = original
    llm.close()


URL = "/api/v1/chat/completions"


class TestValidRequest:
    def test_forwards_request_and_returns_upstream_response(self, client):
        c, captured = client
        body = {
            "model": "repository-brain-v1",
            "messages": [{"role": "user", "content": "Hello"}],
            "stream": False,
        }
        r = c.post(URL, json=body)
        assert r.status_code == 200
        assert r.json() == UPSTREAM_OK

        assert captured["method"] == "POST"
        assert captured["url"] == "http://localhost:8033/v1/chat/completions"
        assert captured["body"]["model"] == "qwen35b"
        assert captured["body"]["messages"] == [{"role": "user", "content": "Hello"}]
        assert captured["body"]["stream"] is False

    def test_sampling_parameters_preserved(self, client):
        c, captured = client
        body = {
            "model": "repository-brain-v1",
            "messages": [{"role": "user", "content": "Hi"}],
            "temperature": 0.7,
            "top_p": 0.9,
            "max_tokens": 128,
            "stop": ["\n\n", "<|end|>"],
            "presence_penalty": 0.5,
            "frequency_penalty": -0.2,
            "seed": 42,
            "response_format": {"type": "json_object"},
        }
        r = c.post(URL, json=body)
        assert r.status_code == 200
        sent = captured["body"]
        assert sent["temperature"] == 0.7
        assert sent["top_p"] == 0.9
        assert sent["max_tokens"] == 128
        assert sent["stop"] == ["\n\n", "<|end|>"]
        assert sent["presence_penalty"] == 0.5
        assert sent["frequency_penalty"] == -0.2
        assert sent["seed"] == 42
        assert sent["response_format"] == {"type": "json_object"}

    def test_tools_and_tool_choice_preserved(self, client):
        c, captured = client
        tool = {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the weather",
                "parameters": {"type": "object", "properties": {"city": {"type": "string"}}},
            },
        }
        body = {
            "model": "repository-brain-v1",
            "messages": [{"role": "user", "content": "weather?"}],
            "tools": [tool],
            "tool_choice": "auto",
        }
        r = c.post(URL, json=body)
        assert r.status_code == 200
        sent = captured["body"]
        assert sent["tools"] == [tool]
        assert sent["tool_choice"] == "auto"

    def test_unknown_valid_openai_fields_preserved(self, client):
        c, captured = client
        body = {
            "model": "repository-brain-v1",
            "messages": [{"role": "user", "content": "Hi"}],
            "n": 2,
            "user": "abc-123",
            "logprobs": True,
        }
        r = c.post(URL, json=body)
        assert r.status_code == 200
        sent = captured["body"]
        assert sent["n"] == 2
        assert sent["user"] == "abc-123"
        assert sent["logprobs"] is True


class TestMessagePreservation:
    def test_system_message_preserved(self, client):
        c, captured = client
        body = {
            "model": "repository-brain-v1",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello"},
            ],
        }
        r = c.post(URL, json=body)
        assert r.status_code == 200
        messages = captured["body"]["messages"]
        assert messages[0] == {"role": "system", "content": "You are a helpful assistant."}
        assert messages[1] == {"role": "user", "content": "Hello"}

    def test_multiple_messages_preserve_order(self, client):
        c, captured = client
        messages = [
            {"role": "system", "content": "sys"},
            {"role": "user", "content": "first"},
            {"role": "assistant", "content": "second"},
            {"role": "user", "content": "third"},
        ]
        body = {"model": "repository-brain-v1", "messages": messages}
        r = c.post(URL, json=body)
        assert r.status_code == 200
        assert captured["body"]["messages"] == messages


class TestValidation:
    def test_missing_model(self, client):
        c, _ = client
        r = c.post(URL, json={"messages": [{"role": "user", "content": "Hi"}]})
        assert r.status_code == 422

    def test_missing_messages(self, client):
        c, _ = client
        r = c.post(URL, json={"model": "repository-brain-v1"})
        assert r.status_code == 422

    def test_empty_messages_rejected(self, client):
        c, _ = client
        r = c.post(URL, json={"model": "repository-brain-v1", "messages": []})
        assert r.status_code == 422

    def test_malformed_messages_not_a_list(self, client):
        c, _ = client
        r = c.post(URL, json={"model": "repository-brain-v1", "messages": "nope"})
        assert r.status_code == 422

    def test_malformed_json_body(self, client):
        c, _ = client
        r = c.post(URL, content="{not json", headers={"Content-Type": "application/json"})
        assert r.status_code == 422

    def test_invalid_message_role(self, client):
        c, _ = client
        r = c.post(URL, json={"model": "m", "messages": [{"role": "robot", "content": "x"}]})
        assert r.status_code == 422


class TestUpstreamBehavior:
    def test_upstream_error_forwarded_as_openai_error(self):
        error_body = {"error": {"message": "rate limited", "type": "rate_limit_error"}}
        handler = lambda request: httpx.Response(429, json=error_body)  # noqa: E731
        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 429
        data = r.json()
        assert data["error"]["message"] == "rate limited"
        assert data["error"]["type"] == "rate_limit_error"
        assert data["error"]["code"] == "rate_limit_exceeded"

    def test_upstream_unreachable_returns_502(self):
        def handler(_request):
            raise httpx.ConnectError("connection refused")

        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 502

    def test_api_key_header_sent_when_configured(self):
        captured: dict = {}

        def handler(request: httpx.Request) -> httpx.Response:
            captured["auth"] = request.headers.get("authorization")
            return httpx.Response(200, json=UPSTREAM_OK)

        settings = Settings(_env_file=None, openai_api_key="test-key")
        llm, original = _install_client(handler, settings=settings)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 200
        assert captured["auth"] == "Bearer test-key"

    def test_no_auth_header_when_key_empty(self, client):
        c, captured = client
        r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        assert r.status_code == 200
        assert "authorization" not in {k.lower() for k in captured["headers"]}


class TestNonStreamingCompletion:
    def _post(self, handler, body=None):
        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(
                URL,
                json=body or {"model": "m", "messages": [{"role": "user", "content": "Hi"}]},
            )
        get_container().llm_client = original
        llm.close()
        return r

    def test_successful_response_preserved(self):
        handler = lambda request: httpx.Response(200, json=UPSTREAM_OK)  # noqa: E731
        r = self._post(handler)
        assert r.status_code == 200

        data = r.json()
        assert "choices" in data
        assert len(data["choices"]) > 0
        assert data["choices"][0]["message"]["role"] == "assistant"
        assert data["choices"][0]["message"]["content"] == "Hello!"
        assert data["choices"][0]["finish_reason"] == "stop"
        assert data["usage"] == {"prompt_tokens": 5, "completion_tokens": 2, "total_tokens": 7}
        assert data["id"] == "chatcmpl-test"
        assert data["model"] == "qwen35b"

    def test_finish_reason_and_usage_preserved(self):
        handler = lambda request: httpx.Response(  # noqa: E731
            200,
            json={
                "choices": [
                    {"message": {"role": "assistant", "content": "x"}, "finish_reason": "length"}
                ],
                "usage": {"total_tokens": 3},
            },
        )
        r = self._post(handler)
        assert r.status_code == 200
        data = r.json()
        assert data["choices"][0]["finish_reason"] == "length"
        assert data["usage"] == {"total_tokens": 3}

    def test_empty_choices_returns_useful_error(self):
        handler = lambda request: httpx.Response(200, json={"choices": []})  # noqa: E731
        r = self._post(handler)
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "invalid_backend_response"

    def test_missing_choices_returns_useful_error(self):
        handler = lambda request: httpx.Response(200, json={"object": "chat.completion"})  # noqa: E731
        r = self._post(handler)
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "invalid_backend_response"

    def test_non_assistant_role_returns_useful_error(self):
        handler = lambda request: httpx.Response(  # noqa: E731
            200, json={"choices": [{"index": 0, "message": {"role": "user", "content": "x"}}]}
        )
        r = self._post(handler)
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "invalid_backend_response"

    def test_non_json_200_body_returns_useful_error(self):
        handler = lambda request: httpx.Response(  # noqa: E731
            200, content=b"<html>oops</html>", headers={"content-type": "text/html"}
        )
        r = self._post(handler)
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "invalid_backend_response"


def _sse_chunk(index: int, delta: dict, finish_reason: str | None = None) -> bytes:
    payload = {
        "id": f"chatcmpl-chunk-{index}",
        "object": "chat.completion.chunk",
        "created": 1234567890,
        "model": "qwen35b",
        "choices": [{"index": 0, "delta": delta, "finish_reason": finish_reason}],
    }
    return f"data: {json.dumps(payload)}\n\n".encode()


STREAM_OK = [
    _sse_chunk(1, {"content": "HEL"}),
    _sse_chunk(2, {"content": "LO"}),
    _sse_chunk(3, {"content": " world"}, finish_reason="stop"),
    b"data: [DONE]\n\n",
]


def _stream_handler(events=STREAM_OK, status: int = 200):
    def handler(_request):
        return httpx.Response(
            status,
            headers={"content-type": "text/event-stream"},
            content=iter(events),
        )

    return handler


def _parse_sse(text: str) -> list[str]:
    return [line[6:] for line in text.split("\n") if line.startswith("data: ")]


class TestStreaming:
    def _post_stream(self, handler, body=None):
        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(
                URL,
                json=body
                or {
                    "model": "repository-brain-v1",
                    "messages": [{"role": "user", "content": "Hi"}],
                    "stream": True,
                },
            )
        get_container().llm_client = original
        llm.close()
        return r

    def test_streaming_response_relayed_as_sse(self):
        r = self._post_stream(_stream_handler())
        assert r.status_code == 200
        assert r.headers["content-type"].startswith("text/event-stream")

    def test_choice_deltas_arrive_in_order(self):
        r = self._post_stream(_stream_handler())
        events = _parse_sse(r.text)
        contents = []
        for event in events:
            if event == "[DONE]":
                continue
            data = json.loads(event)
            assert "choices" in data and len(data["choices"]) == 1
            contents.append(data["choices"][0]["delta"].get("content", ""))
        assert "HEL" in contents
        assert "LO" in contents
        assert "".join(contents) == "HELLO world"

    def test_finish_reason_stop_arrives(self):
        r = self._post_stream(_stream_handler())
        events = _parse_sse(r.text)
        reasons = []
        for event in events:
            if event == "[DONE]":
                continue
            data = json.loads(event)
            reasons.append(data["choices"][0]["finish_reason"])
        assert "stop" in reasons

    def test_done_marker_forwarded(self):
        r = self._post_stream(_stream_handler())
        events = _parse_sse(r.text)
        assert events[-1] == "[DONE]"

    def test_no_choices_stripped(self):
        r = self._post_stream(_stream_handler())
        events = _parse_sse(r.text)
        data_events = [e for e in events if e != "[DONE]"]
        assert data_events
        for event in data_events:
            data = json.loads(event)
            assert "choices" in data
            assert len(data["choices"]) == 1

    def test_response_not_converted_to_json(self):
        r = self._post_stream(_stream_handler())
        assert r.headers["content-type"].startswith("text/event-stream")
        assert "data: {" in r.text
        assert "[DONE]" in r.text

    def test_stream_flag_forwarded_to_upstream(self):
        captured: dict = {}

        def handler(request: httpx.Request) -> httpx.Response:
            captured["body"] = json.loads(request.content)
            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=iter([_sse_chunk(1, {"content": "x"}, finish_reason="stop")]),
            )

        r = self._post_stream(handler)
        assert r.status_code == 200
        assert captured["body"]["stream"] is True
        assert captured["body"]["model"] == "qwen35b"

    def test_regression_no_choices_error_on_stream(self):
        """A valid streaming body must not be misread as having no choices.

        When interpreted as a single non-streaming JSON document the SSE body has
        no top-level ``choices`` key, so the proxy must never run the non-streaming
        ``choices`` validation on it (which would fail with a "no choices" error).
        """
        r = self._post_stream(_stream_handler())
        assert r.status_code == 200
        assert "choices" in r.text
        assert "invalid_backend_response" not in r.text

    def test_upstream_error_forwarded_for_stream(self):
        error_body = {"error": {"message": "overloaded", "type": "server_error"}}
        events = [f"data: {json.dumps(error_body)}\n\n".encode()]
        r = self._post_stream(_stream_handler(events, status=503))
        assert r.status_code == 503
        data = r.json()
        assert data["error"]["type"] == "server_error"
        assert data["error"]["code"] == "service_unavailable"

    def test_upstream_unreachable_returns_502_for_stream(self):
        def handler(_request):
            raise httpx.ConnectError("connection refused")

        r = self._post_stream(handler)
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "bad_gateway"


def _tool(name: str, description: str) -> dict:
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": description,
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "File path"},
                    "options": {
                        "type": "object",
                        "properties": {
                            "recursive": {"type": "boolean"},
                            "depth": {"type": "integer", "minimum": 1},
                        },
                    },
                },
                "required": ["path"],
            },
        },
    }


def _roo_code_request() -> dict:
    """Build a realistic Roo Code request: large context, ~100 tools, streaming."""
    system = {
        "role": "system",
        "content": (
            "You are Roo Code, a skilled software engineering agent with deep "
            "expertise in software architecture, code analysis and bug fixing. "
            "You carefully reason about problems and verify your work."
        ),
    }
    large_content = "Analyze the following repository.\n\n" + (
        "# File listing\n\n"
        + "\n\n".join(
            f"## src/module_{i}/core.py\n"
            f"```python\n"
            f"class Service{i}:\n"
            f'    """Service {i} with a very long docstring."""\n'
            f"    def run(self, task: str) -> dict:\n"
            f"        # simulated implementation block\n"
            f'        return {{"status": "ok", "module": {i}, "task": task}}\n'
            f"```"
            for i in range(40)
        )
    )
    history = [
        {
            "role": "user",
            "content": "Please explore this codebase and summarize the architecture.",
        },
        {
            "role": "assistant",
            "content": "I'll start by exploring the repository structure.",
            "tool_calls": [
                {
                    "id": "call_0001",
                    "type": "function",
                    "function": {"name": "list_files", "arguments": "{}"},
                }
            ],
        },
        {
            "role": "tool",
            "tool_call_id": "call_0001",
            "content": json.dumps(
                {"files": [f"src/module_{i}/core.py" for i in range(40)], "count": 40}
            ),
        },
        {"role": "user", "content": large_content},
    ]
    tools = [
        _tool(f"roo_tool_{i:03d}", f"Tool number {i} for repository operations") for i in range(100)
    ]
    return {
        "model": "repository-brain-v1",
        "messages": [system, *history],
        "stream": True,
        "temperature": 0.2,
        "top_p": 0.9,
        "max_tokens": 8192,
        "tools": tools,
        "tool_choice": "auto",
    }


class TestRooCodeCompatibility:
    """A realistic Roo Code request must reach the backend complete and unchanged."""

    def _post(self, handler, body):
        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json=body)
        get_container().llm_client = original
        llm.close()
        return r

    def test_full_roo_code_request_forwarded_complete(self):
        body = _roo_code_request()
        captured: dict = {}

        def handler(request: httpx.Request) -> httpx.Response:
            captured["url"] = str(request.url)
            captured["headers"] = dict(request.headers)
            captured["body"] = json.loads(request.content)
            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=iter([_sse_chunk(1, {"content": "ok"}, finish_reason="stop")]),
            )

        r = self._post(handler, body)
        assert r.status_code == 200

        sent = captured["body"]
        # Model mapping
        assert sent["model"] == "qwen35b"
        # stream preserved
        assert sent["stream"] is True
        # Message count (system + history) preserved
        assert len(sent["messages"]) == len(body["messages"])
        # System message preserved
        assert sent["messages"][0]["role"] == "system"
        assert sent["messages"][0]["content"] == body["messages"][0]["content"]
        # Tool message / tool_calls preserved
        assert sent["messages"][3]["role"] == "tool"
        assert sent["messages"][3]["tool_call_id"] == "call_0001"
        assert sent["messages"][2]["tool_calls"][0]["function"]["name"] == "list_files"
        # Large user content preserved intact
        assert sent["messages"][-1]["content"] == body["messages"][-1]["content"]
        # Tool count
        assert len(sent["tools"]) == 100
        assert sent["tool_choice"] == "auto"
        # Tool definitions preserved exactly
        assert sent["tools"] == body["tools"]
        # Sampling params preserved
        assert sent["temperature"] == 0.2
        assert sent["top_p"] == 0.9
        assert sent["max_tokens"] == 8192

    def test_message_count_above_old_limit_accepted(self):
        """A large context (well over the previous 128 message cap) must pass."""
        body = _roo_code_request()
        body["messages"] = [{"role": "user", "content": f"Turn {i}"} for i in range(150)]
        captured: dict = {}

        def handler(request: httpx.Request) -> httpx.Response:
            captured["body"] = json.loads(request.content)
            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=iter([_sse_chunk(1, {"content": "ok"}, finish_reason="stop")]),
            )

        r = self._post(handler, body)
        assert r.status_code == 200
        assert len(captured["body"]["messages"]) == 150

    def test_tool_schemas_not_stripped(self):
        """Tool definitions, including parameters, reach the backend unchanged."""
        body = _roo_code_request()
        captured: dict = {}

        def handler(request: httpx.Request) -> httpx.Response:
            captured["body"] = json.loads(request.content)
            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=iter([_sse_chunk(1, {"content": "ok"}, finish_reason="stop")]),
            )

        r = self._post(handler, body)
        assert r.status_code == 200
        sent_tools = captured["body"]["tools"]
        assert sent_tools == body["tools"]
        sample = sent_tools[0]["function"]
        assert sample["name"] == "roo_tool_000"
        assert "parameters" in sample
        assert "properties" in sample["parameters"]


def _backend_status_handler(status: int, content_type: str = "application/json"):
    def handler(_request):
        return httpx.Response(
            status,
            json={"error": {"message": "upstream failed"}},
            headers={"content-type": content_type},
        )

    return handler


class TestUpstreamStatusErrors:
    """Backend failures must be mapped to OpenAI-compatible errors, never 200."""

    @pytest.mark.parametrize("status", [400, 401, 403, 404, 408, 429, 500, 502, 503, 504])
    def test_status_error_preserved_not_200(self, status):
        llm, original = _install_client(_backend_status_handler(status))
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == status
        assert r.status_code != 200
        body = r.json()
        assert body["error"]["message"] == "upstream failed"
        assert body["error"]["code"]

    def test_400_invalid_request_error(self):
        llm, original = _install_client(_backend_status_handler(400))
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 400
        assert r.json()["error"]["type"] == "invalid_request_error"

    def test_401_authentication_error(self):
        llm, original = _install_client(_backend_status_handler(401))
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 401
        assert r.json()["error"]["type"] == "authentication_error"

    def test_429_rate_limit_error(self):
        llm, original = _install_client(_backend_status_handler(429))
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 429
        assert r.json()["error"]["type"] == "rate_limit_error"

    def test_503_service_unavailable(self):
        llm, original = _install_client(_backend_status_handler(503))
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 503
        assert r.json()["error"]["code"] == "service_unavailable"

    def test_504_gateway_timeout(self):
        llm, original = _install_client(_backend_status_handler(504))
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 504
        assert r.json()["error"]["code"] == "gateway_timeout"

    def test_non_json_backend_error_uses_default(self):
        llm, original = _install_client(_backend_status_handler(502, content_type="text/plain"))
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "bad_gateway"


class TestTransportFailures:
    def test_connection_refused_returns_502(self):
        def handler(_request):
            raise httpx.ConnectError("connection refused")

        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "bad_gateway"

    def test_backend_unavailable_returns_502(self):
        def handler(_request):
            raise httpx.ConnectError("backend unreachable")

        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 502
        assert "backend" in r.json()["error"]["message"]

    def test_timeout_returns_504(self):
        def handler(_request):
            raise httpx.ReadTimeout("read timeout")

        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 504
        assert r.json()["error"]["code"] == "gateway_timeout"

    def test_streaming_connection_refused_returns_502(self):
        def handler(_request):
            raise httpx.ConnectError("connection refused")

        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(
                URL,
                json={
                    "model": "m",
                    "messages": [{"role": "user", "content": "Hi"}],
                    "stream": True,
                },
            )
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "bad_gateway"


class TestMalformedAndInvalid:
    def _post(self, handler):
        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        return r

    def test_malformed_json_returns_502(self):
        handler = lambda request: httpx.Response(  # noqa: E731
            200, content=b"<html>not json</html>", headers={"content-type": "application/json"}
        )
        r = self._post(handler)
        assert r.status_code == 502
        assert r.json()["error"]["code"] == "invalid_backend_response"

    def test_invalid_completion_never_returns_choices_empty(self):
        handler = lambda request: httpx.Response(200, json={"choices": []})  # noqa: E731
        r = self._post(handler)
        assert r.status_code == 502
        body = r.json()
        assert body["error"]["code"] == "invalid_backend_response"
        assert "choices" not in body


class TestStreamDisconnect:
    def test_mid_stream_disconnect_logged_and_terminated(self, capsys):
        def handler(_request):
            def body():
                yield b'data: {"choices":[{"delta":{"content":"HEL"}}]}\n\n'
                raise httpx.ReadError("connection lost mid-stream")

            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=iter(body()),
            )

        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(
                URL,
                json={
                    "model": "m",
                    "messages": [{"role": "user", "content": "Hi"}],
                    "stream": True,
                },
            )
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 200
        assert "HEL" in r.text
        logs = capsys.readouterr().err
        assert "proxy_stream_disconnect" in logs


class TestRequestLogging:
    def _capture(self, capsys, body=None):
        return capsys.readouterr().err

    def test_request_structured_logs(self, capsys):
        handler = _backend_status_handler(200)
        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(
                URL,
                json={
                    "model": "repository-brain-v1",
                    "messages": [
                        {"role": "system", "content": "sys"},
                        {"role": "user", "content": "Hi"},
                    ],
                    "tools": [_tool("t1", "desc")],
                    "stream": True,
                },
            )
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 200

        text = capsys.readouterr().err
        assert "proxy_request_start" in text
        for field in [
            "request_id=",
            "method=POST",
            "path=/api/v1/chat/completions",
            "incoming_model=repository-brain-v1",
            "backend_model=qwen35b",
            "stream=True",
            "message_count=2",
            "tools_count=1",
            "request_bytes=",
        ]:
            assert field in text, f"missing {field} in log"

    def test_request_id_same_across_lifecycle(self, capsys):
        handler = lambda request: httpx.Response(200, json=UPSTREAM_OK)  # noqa: E731
        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 200
        assert r.headers.get("X-Request-ID", "").startswith("rb_")
        # The same request ID is used across start/backend/complete logs.
        text = capsys.readouterr().err
        ids = {
            line.split("request_id=")[1].split(" ")[0].rstrip()
            for line in text.splitlines()
            if "request_id=" in line and "proxy_" in line
        }
        assert ids
        assert len(ids) == 1, f"expected one request_id, got {ids}"
        assert r.headers["X-Request-ID"] in ids

    def test_streaming_logs_chunks_and_first_token(self, capsys):
        handler = _stream_handler()
        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(
                URL,
                json={
                    "model": "m",
                    "messages": [{"role": "user", "content": "Hi"}],
                    "stream": True,
                },
            )
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 200
        text = capsys.readouterr().err
        assert "proxy_request_complete" in text
        for field in [
            "chunks_received=",
            "bytes_received=",
            "first_token_ms=",
            "backend_status=200",
        ]:
            assert field in text, f"missing {field} in log"


class TestRedaction:
    def test_api_key_never_logged(self, caplog, capsys):
        from repository_brain.core.logging import configure_logging

        configure_logging("DEBUG")
        secret = "super-secret-redact-key-xyz"
        settings = Settings(_env_file=None, openai_api_key=secret)
        captured: dict = {}

        def handler(request: httpx.Request) -> httpx.Response:
            captured["auth"] = request.headers.get("authorization")
            return httpx.Response(200, json=UPSTREAM_OK)

        llm, original = _install_client(handler, settings=settings)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.post(URL, json={"model": "m", "messages": [{"role": "user", "content": "Hi"}]})
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 200
        assert captured["auth"] == f"Bearer {secret}"
        logs = caplog.text + capsys.readouterr().out
        assert secret not in logs
        assert "Authorization" not in logs


class TestModelsEndpoint:
    def test_lists_advertised_model(self):
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.get("/api/v1/models")
        assert r.status_code == 200
        body = r.json()
        assert body["object"] == "list"
        assert isinstance(body["data"], list)
        assert len(body["data"]) == 1
        model = body["data"][0]
        assert model["id"] == "repository-brain-v1"
        assert model["object"] == "model"
        assert model["owned_by"] == "repository-brain"

    def test_models_does_not_require_llm_backend(self):
        """The models listing is served locally and must not call upstream."""

        def handler(_request):
            raise AssertionError("models endpoint must not reach the backend")

        llm, original = _install_client(handler)
        from repository_brain.main import create_app

        with TestClient(create_app()) as c:
            r = c.get("/api/v1/models")
        get_container().llm_client = original
        llm.close()
        assert r.status_code == 200
        assert r.json()["data"][0]["id"] == "repository-brain-v1"
