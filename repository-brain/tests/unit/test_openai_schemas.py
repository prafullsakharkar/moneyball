"""Unit tests for the OpenAI-compatible response validation schema."""

from __future__ import annotations

import pytest
from pydantic import ValidationError
from repository_brain.schemas.openai import ChatCompletionResponse

VALID_RESPONSE = {
    "id": "chatcmpl-test",
    "object": "chat.completion",
    "created": 123,
    "model": "qwen35b",
    "choices": [
        {
            "index": 0,
            "message": {"role": "assistant", "content": "HELLO"},
            "finish_reason": "stop",
        }
    ],
    "usage": {"prompt_tokens": 10, "completion_tokens": 1, "total_tokens": 11},
}


class TestChatCompletionResponse:
    def test_valid_response_validates(self):
        response = ChatCompletionResponse.model_validate(VALID_RESPONSE)
        assert response.choices
        assert len(response.choices) > 0
        assert response.choices[0]["message"]["role"] == "assistant"
        assert response.choices[0]["finish_reason"] == "stop"
        assert response.usage == {"prompt_tokens": 10, "completion_tokens": 1, "total_tokens": 11}

    def test_choices_missing_rejected(self):
        with pytest.raises(ValidationError):
            ChatCompletionResponse.model_validate({"object": "chat.completion"})

    def test_empty_choices_rejected(self):
        with pytest.raises(ValidationError):
            ChatCompletionResponse.model_validate({"choices": []})

    def test_message_missing_rejected(self):
        with pytest.raises(ValidationError):
            ChatCompletionResponse.model_validate({"choices": [{"index": 0}]})

    def test_non_assistant_role_rejected(self):
        with pytest.raises(ValidationError):
            ChatCompletionResponse.model_validate(
                {"choices": [{"message": {"role": "user", "content": "x"}}]}
            )

    def test_extra_fields_preserved(self):
        payload = dict(VALID_RESPONSE)
        payload["some_future_field"] = {"a": 1}
        response = ChatCompletionResponse.model_validate(payload)
        dumped = response.model_dump()
        assert dumped["some_future_field"] == {"a": 1}
