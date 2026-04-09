---
type: concept
description: "1:1 parity with openai-python. Typed responses, streaming, function calling. First Rust crate shipped via solo-factory pipeline."
title: "openai-oxide — idiomatic Rust client for OpenAI API"
created: 2026-03-01
tags: [project, open-source, rust, openai, api-client, crate]
project_type: library
course_module: 7
course_order: 1
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/openai-oxide"
crate: openai-oxide
npm: openai-oxide
pypi: openai-oxide
docs_url: "https://docs.rs/openai-oxide"
github: fortunto2/openai-oxide
---

# openai-oxide

Feature-complete OpenAI client for Rust, Node.js, and Python. Streaming, WebSockets, structured outputs, WASM. Built for agentic workflows.

```bash
cargo add openai-oxide tokio --features tokio/full   # Rust
npm install openai-oxide                              # Node.js
pip install openai-oxide                              # Python
```

**First project shipped via solo-factory pipeline:** `/research` -> `/validate` -> `/scaffold` -> `/build` -> `/review`. Pipeline score: 8/10.

## Why openai-oxide?

The Rust crate is the single source of truth. Bindings for Node.js (napi-rs) and Python (PyO3) are thin wrappers -- same HTTP tuning, WebSocket pool, streaming parser, and retry logic run everywhere.

**Why Rust:** type safety for API contracts (SGR at the language level), zero-cost abstractions for streaming, compile-time guarantees that the client matches the API schema.

## Key Features

| Feature | Description |
|---------|-------------|
| **Structured Outputs** | `parse::<T>()` -- auto-generates JSON schema from Rust types via schemars, deserializes in one call |
| **Stream Helpers** | Typed `ChatStreamEvent` with auto text/tool-call accumulation, `ContentDelta`/`ToolCallDone` events |
| **WebSocket Mode** | Persistent `wss://` connection pool for Responses API -- 29-44% faster on multi-turn chains |
| **Stream FC Early Parse** | Yields function calls the moment `arguments.done` emits -- start tools before response finishes |
| **SIMD JSON** | Opt-in AVX2/NEON hardware-accelerated JSON parsing for large agent histories |
| **Hedged Requests** | Send redundant requests, cancel the slower one -- trades tokens for lower tail latency |
| **Webhook Verification** | HMAC-SHA256 signature verification with timestamp tolerance |
| **HTTP Tuning** | gzip, TCP_NODELAY, HTTP/2 keep-alive, adaptive window, connection pooling -- all on by default |
| **WASM** | Compiles to `wasm32-unknown-unknown` -- streaming + early-parsing work in Cloudflare Workers and browsers |

## Platform Support

| Platform | Binding | Status |
|----------|---------|--------|
| **Rust** | native | stable |
| **Node.js / TypeScript** | napi-rs | stable |
| **Python** | PyO3 + maturin | stable |
| **Browser / Edge / Dioxus / Leptos** | WASM | stable |
| **iOS / macOS** | UniFFI (Swift) | planned |
| **Android** | UniFFI (Kotlin) | planned |

## Quick Start

```rust
use openai_oxide::{OpenAI, types::responses::*};

#[tokio::main]
async fn main() -> Result<(), openai_oxide::OpenAIError> {
    let client = OpenAI::from_env()?;
    let response = client.responses().create(
        ResponseCreateRequest::new("gpt-5.4")
            .input("Explain quantum computing in one sentence.")
            .max_output_tokens(100)
    ).await?;
    println!("{}", response.output_text());
    Ok(())
}
```

Node.js:

```javascript
const { Client } = require("openai-oxide");
const client = new Client();
const text = await client.createText("gpt-5.4-mini", "Hello from Node!");
```

Python:

```python
from openai_oxide import Client
client = Client()
res = await client.create("gpt-5.4-mini", "Hello from Python!")
```

## WebSocket Mode

OpenAI's WebSocket mode keeps a persistent connection for the Responses API. Server caches context between turns -- no re-loading on each request.

Preliminary measurements (gpt-5.4, warm connections, n=5):
- **Plain text:** 710ms WS vs 1011ms HTTP (29% faster)
- **Multi-turn (2 reqs):** 1425ms vs 2362ms (40% faster)
- **Rapid-fire (5 calls):** 3227ms vs 5807ms (44% faster)

The only Rust client that implements WebSocket mode.

## Benchmarks

### SDK Overhead (synthetic, Node.js mock server)

| Test | openai-oxide | openai npm | oxide faster |
|------|-------------|------------|--------------|
| Tiny req -> Tiny resp | 172us | 443us | **+61%** |
| Tiny req -> Structured 5KB | 161us | 499us | **+68%** |
| Medium 150KB -> Tool call | 1.1ms | 1.7ms | **+37%** |
| Heavy 657KB -> Real agent resp | 4.9ms | 6.2ms | **+21%** |
| SSE stream (114 chunks) | 283us | 742us | **+62%** |
| Agent 20x sequential (tiny) | 2.1ms | 5.4ms | **+61%** |

All p<0.001 (Welch's t-test, 50 iterations). On today's API latency SDK overhead is <1%, but with fast inference providers (Cerebras, Groq, local models at 10-50ms) or agent farms running hundreds of concurrent sessions, the savings compound.

### Feature Comparison (Rust ecosystem)

| Feature | openai-oxide | async-openai 0.34 | genai 0.6 |
|---------|:-----------:|:------------------:|:---------:|
| SSE streaming | yes | yes | yes |
| Stream helpers (typed events) | **yes** | no | no |
| WebSocket mode | **yes** | no | no |
| Structured `parse::<T>()` | **yes** | no | no |
| WASM (streaming) | **yes** | partial | no |
| Node.js / Python bindings | **yes** | no | no |
| Hedged requests | **yes** | no | no |
| Stream FC early parse | **yes** | no | no |

## Registry

| Package | Registry |
|---------|----------|
| `openai-oxide` | [crates.io](https://crates.io/crates/openai-oxide) |
| `openai-types` | [crates.io](https://crates.io/crates/openai-types) (1100+ types) |
| `openai-oxide` | [npm](https://www.npmjs.com/package/openai-oxide) |
| `openai-oxide` | [PyPI](https://pypi.org/project/openai-oxide/) |

## Links

- [GitHub](https://github.com/fortunto2/openai-oxide) -- Rust, MIT
- [docs.rs](https://docs.rs/openai-oxide) -- API docs
- [mdBook Guide](https://fortunto2.github.io/openai-oxide/) -- User guide
- [WASM Live Demo](https://cloudflare-worker-dioxus.nameless-sunset-8f24.workers.dev) -- Cloudflare Workers + Dioxus
- [[schema-guided-reasoning]] -- typed Rust structs = SGR at compile time
- [[cli-first-testing]] -- CLI-first: `cargo test` + integration tests against live API
- [[portfolio-approach]] -- one crate in the Rust open source portfolio
- [[token-efficient-web-requests]] -- HTTP transport optimizations (gzip, TCP_NODELAY, HTTP/2 tuning) [contributed upstream to rust-genai](https://github.com/jeremychone/rust-genai/pull/177)
