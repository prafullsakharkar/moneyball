"""Unit tests for the tree-sitter based parser."""

from __future__ import annotations

from repository_brain.parser.parser import ParsingService


def _parse(source: str, language: str = "python"):
    return ParsingService().parse(source, path="test.py", language=language)


class TestPythonParsing:
    def test_class_and_methods(self):
        parsed = _parse(
            """
class Greeter:
    \"\"\"Greets people.\"\"\"

    def __init__(self, name: str) -> None:
        self.name = name

    def hello(self) -> str:
        return f"Hi {self.name}"
"""
        )
        names = [(s.kind, s.name, s.parent_name) for s in parsed.symbols]
        assert ("class", "Greeter", None) in names
        assert ("method", "__init__", "Greeter") in names
        assert ("method", "hello", "Greeter") in names

    def test_module_level_functions(self):
        parsed = _parse(
            """
def helper(x: int) -> int:
    return x * 2

VERSION = "1.0"
"""
        )
        kinds = {s.kind: s.name for s in parsed.symbols}
        assert kinds["function"] == "helper"
        assert kinds["variable"] == "VERSION"

    def test_docstrings(self):
        parsed = _parse(
            '''"""Module doc."""\n\ndef f() -> None:\n    """Function doc."""\n    pass\n'''
        )
        assert parsed.module_doc == "Module doc."
        f = next(s for s in parsed.symbols if s.name == "f")
        assert f.docstring == "Function doc."

    def test_imports(self):
        parsed = _parse(
            """
import os
import requests as req
from pathlib import Path
from typing import Optional, List
from . import local
from ..utils.helpers import get as fetch
"""
        )
        imports = [(i.name, i.symbol_name, i.alias) for i in parsed.imports]
        assert ("os", None, None) in imports
        assert ("requests", None, "req") in imports
        assert ("pathlib", "Path", None) in imports
        assert ("typing", "Optional", None) in imports
        assert ("typing", "List", None) in imports
        assert (".", "local", None) in imports
        assert ("..utils.helpers", "get", "fetch") in imports

    def test_async_function(self):
        parsed = _parse(
            """
async def run() -> None:
    pass
"""
        )
        assert parsed.symbols[0].is_async is True


class TestTypeScriptParsing:
    def test_ts_imports(self):
        parsed = _parse(
            """
import fs from "node:fs";
import * as helpers from "./helpers";
import { readFile, writeFile } from "node:fs/promises";
const mod = require("./mod");
""",
            language="typescript",
        )
        imports = [(i.name, i.symbol_name, i.alias) for i in parsed.imports]
        assert ("node:fs", "fs", None) in imports
        assert ("node:fs/promises", "readFile", None) in imports
        assert ("node:fs/promises", "writeFile", None) in imports
        assert ("node:fs", "default", "fs") not in imports

    def test_ts_functions_and_interfaces(self):
        parsed = _parse(
            """
export function add(a: number, b: number): number {
  return a + b;
}

interface Config {
  host: string;
  port: number;
}

export const N = 42;
""",
            language="typescript",
        )
        kinds = {s.name: s.kind for s in parsed.symbols}
        assert kinds["add"] == "function"
        assert kinds["Config"] == "interface"
        assert kinds["N"] == "variable"

    def test_tsx_components(self):
        parsed = _parse(
            """
import React from "react";

export const Card = ({ title }: { title: string }) => {
  return <div>{title}</div>;
};

export default function App() {
  return <Card title="hi" />;
}
""",
            language="tsx",
        )
        kinds = {s.name: s.kind for s in parsed.symbols}
        assert kinds["Card"] == "component"
        assert kinds["App"] == "component"


class TestLanguageSupport:
    def test_unknown_language_returns_empty(self):
        parsed = _parse("x = 1", language="brainfuck")
        assert parsed.symbols == []
        assert parsed.imports == []
        assert parsed.language == "brainfuck"
