---
type: concept
title: "Token-efficient web requests — HTTP Accept header trick for agents"
description: "Reduce agent web request tokens by 80% using content negotiation. Accept: text/markdown header, html2text fallback, truncation strategy."
created: 2026-04-09
tags: [agents, tokens, web, optimization, context-engineering]
course_module: 5
course_order: 12
publish: true
source_url: "https://telegra.ph/Kak-snizit-rashod-tokenov-na-80-pri-veb-zaprosah-03-17"
---

# Token-Efficient Web Requests for AI Agents

AI agents making web requests consume 50-100K tokens per page — full HTML with scripts, styles, ads, navigation. A single documentation page can eat half the context window. Three techniques cut this by 5x.

## 1. HTTP Accept Header (content negotiation)

The simplest win: ask the server for clean content instead of full HTML.

```
Accept: text/markdown, text/plain, text/html;q=0.9
```

Servers supporting content negotiation return markdown or plain text. Instead of a 45K-token HTML page, you get a 6.5K-token markdown document — same information, 85% fewer tokens.

**Real savings:**

| Source | HTML | Markdown | Savings |
|--------|------|----------|---------|
| GitHub README | ~8,500 | ~1,200 | 86% |
| Reddit post | ~12,000 | ~2,800 | 77% |
| Documentation | ~45,000 | ~6,500 | 85% |

**Works well on:** GitHub, Reddit, Stack Overflow, headless CMS, Next.js SSR sites.

**Limitation:** Many sites ignore the header and return HTML anyway. But the check costs nothing — add it to every request.

## 2. html2text Fallback

When the server returns HTML despite the Accept header, convert it client-side:

```python
import requests
from html2text import html2text

headers = {"Accept": "text/markdown, text/html"}
response = requests.get(url, headers=headers)

if "text/html" in response.headers.get("content-type", ""):
    content = html2text(response.text)  # strip tags, keep structure
else:
    content = response.text  # already clean
```

html2text preserves headings, lists, links, tables — everything meaningful — while stripping scripts, styles, navigation, and ads.

## 3. Token Truncation

Even clean markdown can be too long. Truncate to a token budget before sending to the LLM:

```python
MAX_TOKENS = 8000  # budget for this web content
content = content[:MAX_TOKENS * 4]  # rough char estimate
```

Better: use tiktoken or a proper tokenizer to cut precisely.

## Three-Layer Strategy

1. **Request clean** — Accept header (free, 80% savings when supported)
2. **Convert dirty** — html2text fallback (cheap, always works)
3. **Truncate** — token budget enforcement (prevents context overflow)

Combined: 5x reduction in token consumption for web requests.

## Connection to [[context-engineering]]

This is context engineering applied to external data. The same principle as [[mempalace-agent-memory|MemPalace's]] progressive loading — don't dump everything into context, load efficiently. The Accept header is L0 (cheapest path), html2text is L1 (fallback), truncation is the budget envelope.

For agents using web search ([[rag-patterns|RAG with web sources]]), this is critical infrastructure. Without it, a single web fetch can consume the entire context budget.

## HTTP Transport Optimizations (bonus)

Beyond tokens, the transport itself matters. Five reqwest/HTTP optimizations that improve AI API latency by 10-15% ([merged into rust-genai](https://github.com/jeremychone/rust-genai/pull/177), also used in [[project-openai-oxide|openai-oxide]]):

| Optimization | Impact |
|:---|:---|
| **gzip compression** | ~30% smaller responses (OpenAI JSON: 70-80% compression ratio) |
| **TCP_NODELAY** | Lower latency — disables Nagle buffering for small request packets |
| **HTTP/2 keep-alive** (20s) | Prevents idle connection drops by proxies (~100ms saved on reconnect) |
| **HTTP/2 adaptive window** | Auto-tunes flow control buffer sizes for throughput |
| **Connection pool** (4/host) | Better parallel performance for concurrent requests |

Benchmark on gpt-5.4: streaming TTFT 5-10% faster, multi-turn 10-15%, function calling ~5%.

These are transport-level savings — orthogonal to token reduction. Combined with content negotiation, you save both bandwidth and tokens.

## See Also

- [[context-engineering]] — context as code, progressive disclosure
- [[rag-patterns]] — web-augmented RAG benefits from clean input
- [[agent-self-discipline]] — token budgets as complexity thresholds
- [[project-openai-oxide]] — Rust client implementing both HTTP optimizations and structured output
