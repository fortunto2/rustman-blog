---
type: summary
title: "SGR complete guide — code examples, patterns, integration with BAML"
created: 2024-11-15
tags: [sgr, llm, structured-output, pydantic, tool-calling, agents]
publish: true
source_path: "1-methodology/sgr/sgr-complete.md"
---

## Key Takeaways

1855-line reference compiling Rinat Abdullin's Schema-Guided Reasoning (SGR) series. Core: use Pydantic/Zod schemas as the interface between LLM and code — the model generates structured output conforming to typed schemas, replacing brittle string parsing.

**Core pattern:** define Pydantic BaseModel → pass as `response_format` to OpenAI → get typed object back. No JSON parsing, no regex, no "hoping the model returns valid output."

**Tool calling via SGR:** define tools as Union[ToolA, ToolB, ...]. Model picks one, returns typed object. Dispatch is a simple match/case. Parallel execution: `action: List[Union[...]]` returns multiple tool calls at once.

**Cycle pattern:** LLM → structured output → execute tools → feed results back → LLM reasons again → next action. Repeats until "done" or max iterations. This is the foundation of agentic workflows.

**Risk analysis example:** define RiskFactor schema with severity enum. Model fills list of risks with explanations. Structured output = auditable, testable, storable.

**Integration with BAML:** SGR (constrained decoding) for precision tasks (tool routing, classification). BAML (schema-as-prompt) for reasoning tasks (extraction, analysis). They complement, not compete. See decision guide in [[schema-guided-reasoning]].

**For our stack:** Pydantic (Python), Zod (TypeScript), @Generable (Swift/Apple Foundation Models). Agent reads schemas in `Models/schemas/types/` before any work.

## Connections

- [[schema-guided-reasoning]] — concept page with decision guide (SGR vs BAML)
- [[dev-principles-summary]] — SGR is a core section of dev principles
- [[apple-on-device-ai]] — @Generable = native SGR in Swift
- [[context-engineering]] — schemas ARE context: agent reads them first to understand domain
