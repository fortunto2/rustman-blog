---
type: concept
title: "ERC3 — Enterprise RAG Challenge 3: AI Agents in Action"
description: "Agent competition results: simple ReAct + composite tools beats multi-agent. 1st place 100% (Claude Opus, $600), 2nd 62% (GPT o3s-120B on Cerebras, $100). Evolution system, pre-execution validator, wiki rule extraction."
created: 2026-04-10
tags: [agents, competition, rag, sgr, structured-outputs, tools, benchmarks]
course_module: 5
course_order: 15
publish: true
source_url: "https://www.youtube.com/watch?v=vGR5m-PURCc"
---

# ERC3: AI Agents in Action

Enterprise RAG Challenge 3 shifted from document QA (ERC2) to **agent-based API interaction**. 103 tasks simulating a company employee: checking permissions, managing salaries, archiving projects, finding info in company wiki. Created by Rinat Abdullin.

## Results

| Place | Participant | Score | Cost | Model |
|-------|-------------|-------|------|-------|
| 1st | Aleksey (maddness) | 100% | $600 | Claude Opus |
| 2nd overall / 1st local | Ilya Rice | 62% | $100 | GPT o3s-120B (Cerebras) |
| 3rd local | Valera | 46% | $2 | Qwen (8 GPUs local) |

**Key finding: simple ReAct with excellent prompts + composite tools beat multi-agent orchestration.**

## 1st Place Architecture (100%)

Plain ReAct agent. No subagents, no orchestrator. Anthropic SDK direct.

**Prompt structure (4 sections):**
- `base_prompt` (~1,800 tokens) — behavioral algorithm: collect context → act → respond
- `rules` (34 rules) — edge-case fixes from iterative testing
- `tool_patches` — supplementary tool descriptions beyond docstrings
- `examples` — few-shot step-by-step for specific task types

**Evolution system (3-agent loop):**
1. **Executor** runs tasks. On failure, logs trace
2. **Analyzer** reviews trace, generates hypotheses
3. **Improver** proposes prompt/rule/tool patches

Went from 68% → 90% in ~1.5 hours (78 generations). **Plateau at ~90%** — last 10% required manual analysis.

**Composite tools were key:** instead of making agent paginate manually (25+ API calls), wrap in code. `find_employees_by_skill`, `find_projects_by_employee`, `calculate_workloads` — agent calls one tool, gets all results. 20 base + 11 composite = 31 tools total.

**Final stats:** 103/103, 6.6 min wall-clock (5 workers), 5.8 tool calls/task avg.

- [GitHub](https://github.com/maddness/erc3-agents)

## 2nd Place Architecture (62%, local models)

Plan ReAct agent. Single agent, all 20 tools as structured output enum.

**Structured output over tool calling** — Cerebras supports strict mode for structured output but NOT for function calling. Schema:

```
current_state → remaining_work[1..5] → next_action → function(tool enum)
```

Creates "double reasoning" — model reasons internally, then fills the step-by-step schema. Same [[schema-guided-reasoning|SGR]] NextStep pattern.

**Pre-execution step validator:** separate LLM call before every tool call. Checks: right tool? Correct params? Following rules? On rejection, agent retries. Validator history is **ephemeral** — never stored in main conversation.

**Context pre-loading (in code, not by agent):**
- `whoami` + full profile + related entities fetched automatically
- **Context builder** (lightweight LLM call) selects relevant blocks for this task
- Agent starts with rich context from step 1

**Wiki rule extraction (one-time pipeline):**
- Downloads all wiki pages → LLM extracts two rule sets (authenticated vs public)
- Response formatting rules loaded via special tool ONLY when agent is about to respond
- Cached by wiki hash per benchmark variant

**Conversation compression:** validator rejections are ephemeral, only latest plan kept, older plans dropped.

- [GitHub](https://github.com/IlyaRice/Enterprise-RAG-Challenge-3-AI-Agents)
- [Live trace visualizer](https://ilyarice.github.io/Enterprise-RAG-Challenge-3-AI-Agents/)

## Key Patterns

### Composite tools > raw API
Remove pagination from agent's view entirely. Wrap multi-step API sequences in code. All top solutions converged on this independently.

### Separate formatting rules from working rules
Load response formatting instructions only when agent is about to respond. Keeps context clean during exploration.

### Pre-fetch everything you can in code
Don't waste agent steps on `whoami` or profile lookups. Dynamic context selection (lightweight LLM call) picks relevant blocks.

### Evolution has a plateau
3-agent evolution loop (executor → analyzer → improver) is effective up to ~90%. After that, manual analysis required. The "one change per cycle" rule from [[agent-patterns-stream2]] applies here too.

### Structured output vs function calling
- Pre-2025 models (Qwen 2.5, older Llamas): structured output better
- Post-2025 models: native function calling generally better
- Cerebras specifically: strict mode works for SO but NOT for FC

### Simple > complex
Claude Code itself uses single-loop architecture. Ilya explicitly confirmed: for business tasks, **workflow > agents**. Use agents only where workflow can't work.

## Connections

- [[enterprise-rag-challenge]] — ERC2 results (RAG-focused, different from ERC3)
- [[schema-guided-reasoning]] — NextStep pattern used by 2nd place
- [[agent-patterns-stream2]] — evolution fixed/mutable partition maps to evolution system
- [[agent-benchmarks]] — ERC3 as agent benchmark
- [[agent-toolkit-landscape]] — simple ReAct vs multi-agent frameworks
- [[harness-engineering-summary]] — composite tools = harness for agents
- [[context-engineering]] — pre-loading, rule extraction, context builder

---

*Source: [Community stream](https://www.youtube.com/watch?v=vGR5m-PURCc), Apr 2026. Platform: [erc.timetoact-group.at](https://erc.timetoact-group.at/)*
