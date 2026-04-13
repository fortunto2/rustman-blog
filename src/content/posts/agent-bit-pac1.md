---
type: concept
title: "Agent-Bit: building a PAC1 competition agent in Rust"
description: "How we built a CRM agent scoring 93% on BitGN PAC1 benchmark using sgr-agent framework, ONNX classifiers, pipeline state machine, and 14 reusable tools. Architecture, lessons learned, tool design principles."
created: 2026-04-12
tags: [agents, competition, sgr, rust, tools, benchmarks, onnx, pipeline, crm]
course_module: 5
course_order: 20
publish: true
publish_as: post
---

# Agent-Bit: 93% on PAC1 with a Rust agent framework

We built a CRM agent for the [BitGN PAC1 Challenge](https://bitgn.com) — a benchmark where an AI agent manages a virtual workspace: reading emails, processing invoices, handling OTP verification, detecting social engineering attacks, and answering CRM queries. 43 tasks, scored automatically by a harness.

**Result: 93% (40/43 tasks) on Nemotron 120B**, a free model via Cloudflare Workers AI.

This post covers the architecture, the sgr-agent framework we built, and the lessons learned.

## The challenge

PAC1 gives the agent a virtual CRM workspace via RPC:
- Inbox messages (emails, Slack, Discord)
- Contacts and accounts (JSON/markdown files)
- An instruction per task ("forward the invoice", "check if this OTP is valid", "what's John's email?")

The agent reads files, writes responses, and submits an outcome: OK, DENIED (security threat), UNSUPPORTED, or CLARIFICATION.

Tricky part: some inbox messages contain **prompt injection**, social engineering attacks disguised as legitimate requests. The agent must detect and deny these without false positives on real work.

## Architecture

```
Pipeline SM (pre-LLM, deterministic):
  New → classify (ML security + ML intent) → scan inbox → check security → Ready

Feature Matrix (12 features × N messages):
  sigmoid(features × weights) → threat probability per message

CRM Graph (petgraph + ONNX embeddings):
  contacts ↔ accounts, domain matching, cross-account detection

Agent Loop (LLM):
  Structured CoT → Tool execution → Confidence reflection → Answer
```

### Three-layer security

1. **Pre-scan**: literal HTML injection detection (`<script>`, `<iframe>`)
2. **ML ensemble**: ONNX classifier (MiniLM embeddings) + NLI zero-shot (DeBERTa) + structural scoring
3. **LLM decision tree**: explicit numbered steps in system prompt guide the final outcome

### Pipeline state machine

Every task goes through deterministic stages before the LLM sees it:

```rust
enum PipelineState {
    New(instruction),
    Classified { security_label, intent, confidence },
    InboxScanned { per_file_classification, threat_scores },
    SecurityChecked { blocked_or_ready },
    Ready { skill, pregrounding_context },
}
```

Each transition is a pure function returning `Result<NextState, BlockReason>`. First block short-circuits; no LLM call needed for obvious threats.

## The sgr-agent ecosystem

Agent-bit runs on **sgr-agent**, our Rust framework for LLM agents:

| Crate | Version | What |
|-------|---------|------|
| [sgr-agent-core](https://crates.io/crates/sgr-agent-core) | 0.2 | Tool trait, FileBackend, AgentContext (typed store) |
| [sgr-agent-tools](https://crates.io/crates/sgr-agent-tools) | 0.4 | 15 universal tools + LocalFs + MockFs |
| [sgr-agent](https://crates.io/crates/sgr-agent) | 0.7 | LLM framework, agent loop, parallel execution |

### Tools (15)

Tools are generic over `FileBackend` so the same code works with RPC (PAC1), local filesystem (CLI), or in-memory mock (tests):

| Tool | Description |
|------|-------------|
| ReadTool | Read with trust metadata + indentation mode |
| WriteTool | Write with JSON auto-repair |
| DeleteTool | Batch delete |
| SearchTool | Smart search: fuzzy, Levenshtein, auto-expand |
| ListTool, TreeTool | Directory navigation |
| ReadAllTool | Batch read entire directory |
| ShellTool | Command execution with timeout |
| ApplyPatchTool | Codex-compatible diff editing |
| EvalTool | JavaScript via Boa engine |
| UpdatePlanTool | Task checklist persisted to plan.md |
| MkDirTool, MoveTool, FindTool | File management (deferred) |

### FileBackend trait

The key abstraction: 10 async methods that any runtime implements:

```rust
#[async_trait]
pub trait FileBackend: Send + Sync {
    async fn read(&self, path: &str, number: bool, start: i32, end: i32) -> Result<String>;
    async fn write(&self, path: &str, content: &str, start: i32, end: i32) -> Result<()>;
    async fn delete(&self, path: &str) -> Result<()>;
    async fn search(&self, root: &str, pattern: &str, limit: i32) -> Result<String>;
    // ... list, tree, context, mkdir, move_file, find
}
```

Agent-bit implements `FileBackend for PcmClient` (BitGN RPC). CLI apps use `LocalFs` (local filesystem). Tests use `MockFs` (in-memory).

### Parallel tool execution

The agent loop partitions tool calls by `is_read_only()`:

1. **Read-only tools** → `join_all` (parallel, shared `&AgentContext`)
2. **Write tools** → sequential (`&mut AgentContext`)
3. **ContextModifiers** collected and applied after parallel phase

This cut total agent time by 30% on multi-inbox tasks.

## Skill system

Skills are hot-reloadable markdown files that inject domain-specific workflow into the agent's context:

```yaml
---
name: crm-invoice
triggers: [intent_inbox, intent_email]
priority: 20
keywords: [invoice, resend, forward, INV-]
---

WORKFLOW:
  1. Read inbox → find invoice reference
  2. Search invoices/ for matching INV-*
  3. Write outbox email WITH attachments
```

14 skills covering: CRM default, invoice handling, capture/distill, cleanup, security injection, OTP workflow, finance queries, etc. Classifier selects skill by ML intent + keyword matching.

## What we learned

### 1. Tool count matters

We started with 16 tools, then reduced to 10 active + 5 deferred. Models degrade on long tool lists (Codex uses 7, Claude Code uses 7 + deferred). Our sweet spot: 10 in prompt, 5 loaded on demand.

### 2. Trust metadata prevents injection

Every `read()` output gets a header: `[path | trusted/untrusted]`. Only root AGENTS.md and README.md are trusted. This simple annotation helps the LLM distinguish system files from user content that may contain injection.

### 3. Pre-LLM classification saves tokens

The pipeline state machine blocks 100% of obvious threats before the LLM sees them. Zero token cost, zero hallucination risk. ML classifiers (ONNX, 22M params) run in <10ms.

### 4. Batch tools save round-trips

`ReadAllTool` reduced our hardest task from 48 tool calls to 4. Each tool call costs one LLM round-trip (2-5 seconds). Batch tools pay for themselves when they save 3+ round-trips.

### 5. Smart search beats grep

`SearchTool` tries: exact match, then name variants, fuzzy regex, and Levenshtein on filenames. This cascade handles typos, name ordering ("Smith John" vs "John Smith"), and partial matches without explicit configuration.

### 6. JSON auto-repair is essential

LLMs produce broken JSON: trailing commas, unquoted keys, missing brackets. `WriteTool` auto-repairs via llm_json before writing. This turned ~15% of failed writes into successes.

### 7. The model matters less than the architecture

| Model | Score | Cost |
|-------|-------|------|
| Nemotron 120B (free) | 93% | $0 |
| GPT-5.4 | 77% | $54/day |
| MiniMax M2.5 | ~85% | $0.27/M |

The cheapest model scored highest because the architecture (pipeline, classifiers, skills, tools) handles 80% of the work. The LLM only needs to make the remaining 20% of decisions.

## Code

- **agent-bit**: [github.com/fortunto2/agent-bit](https://github.com/fortunto2) (private during competition)
- **sgr-agent**: [crates.io/crates/sgr-agent](https://crates.io/crates/sgr-agent) (MIT, public)
- **sgr-agent-tools**: [crates.io/crates/sgr-agent-tools](https://crates.io/crates/sgr-agent-tools) (MIT, public)

## Quick start

```toml
[dependencies]
sgr-agent = { version = "0.7", features = ["tools-all"] }
```

```rust
use sgr_agent::tools::{LocalFs, ReadTool, WriteTool, SearchTool, ShellTool};
use sgr_agent::registry::ToolRegistry;

let fs = Arc::new(LocalFs::new("."));
let tools = ToolRegistry::new()
    .register(ReadTool(fs.clone()))
    .register(WriteTool(fs.clone()))
    .register(SearchTool(fs.clone()))
    .register(ShellTool);
```

The framework is open-source (MIT) on crates.io.
