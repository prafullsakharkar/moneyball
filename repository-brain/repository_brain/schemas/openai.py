"""OpenAI-compatible request/response models for the Phase 1 proxy."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

MessageRole = Literal["system", "user", "assistant", "tool", "developer"]


class ChatMessage(BaseModel):
    """A single chat message.

    Extra fields (e.g. ``name``, ``tool_call_id``, ``tool_calls`` or future
    OpenAI fields) are preserved and forwarded unchanged.
    """

    model_config = ConfigDict(extra="allow")

    role: MessageRole
    content: str | list[dict[str, Any]] | None = None
    name: str | None = None
    tool_call_id: str | None = None
    tool_calls: list[dict[str, Any]] | None = None


class Tool(BaseModel):
    """An OpenAI function tool declaration."""

    model_config = ConfigDict(extra="allow")

    type: str = "function"
    function: dict[str, Any]


class ChatCompletionRequest(BaseModel):
    """A ``POST /v1/chat/completions`` request body.

    Only the required and documented fields are validated. Any additional
    OpenAI fields (``n``, ``user``, ``logprobs``, ...) are preserved and
    forwarded unchanged to the upstream backend.
    """

    model_config = ConfigDict(extra="allow")

    model: str = Field(min_length=1)
    messages: list[ChatMessage] = Field(min_length=1)
    stream: bool = False

    temperature: float | None = Field(default=None, ge=0, le=2)
    top_p: float | None = Field(default=None, ge=0, le=1)
    max_tokens: int | None = Field(default=None, ge=1)
    tools: list[Tool] | None = None
    tool_choice: str | dict[str, Any] | None = None
    response_format: dict[str, Any] | None = None
    stop: str | list[str] | None = None
    presence_penalty: float | None = Field(default=None, ge=-2, le=2)
    frequency_penalty: float | None = Field(default=None, ge=-2, le=2)
    seed: int | None = None


class ChatCompletionResponse(BaseModel):
    """Validated OpenAI chat completion response structure.

    Used to guard against a backend that answers HTTP 200 with a malformed
    completion body (empty ``choices``, missing message, ...). Only the minimal
    structure required for a real completion is enforced; the original body is
    forwarded byte-for-byte after validation so nothing is fabricated or dropped.
    """

    model_config = ConfigDict(extra="allow")

    id: str | None = None
    object: str | None = None
    created: int | None = None
    model: str | None = None
    choices: list[dict[str, Any]] = Field(default_factory=list)
    usage: dict[str, Any] | None = None

    @model_validator(mode="after")
    def _validate_completion_structure(self) -> ChatCompletionResponse:
        if not self.choices:
            raise ValueError("'choices' must be a non-empty list")
        message = self.choices[0].get("message")
        if not isinstance(message, dict) or message.get("role") != "assistant":
            raise ValueError("'choices[0].message.role' must be 'assistant'")
        return self


class Model(BaseModel):
    """An OpenAI-compatible model descriptor returned by ``GET /v1/models``."""

    id: str
    object: str = "model"
    owned_by: str = "repository-brain"


class ModelList(BaseModel):
    """The OpenAI-compatible model listing envelope."""

    object: str = "list"
    data: list[Model]
