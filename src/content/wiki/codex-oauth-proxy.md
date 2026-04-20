---
type: concept
title: "Codex OAuth proxy -- use ChatGPT subscription as API"
description: "Route LLM requests through ChatGPT Plus/Pro subscription via OAuth token refresh. No API key needed. Rust implementation in sgr-agent with auto-refresh and Chat Completions compatibility."
created: 2026-04-14
tags: [agents, rust, auth, openai, infrastructure]
course_module: 5
course_order: 23
publish: true
---

# Codex OAuth Proxy

Use your ChatGPT Plus/Pro subscription instead of paying per-token API fees. The proxy sits between your agent and `chatgpt.com/backend-api/codex/responses`, handling OAuth token refresh automatically.

## How it works

```
Your agent (Chat Completions API)
    → codex_proxy (localhost)
    → convert to Codex Responses format
    → POST chatgpt.com/backend-api/codex/responses
      Authorization: Bearer {oauth_token}
      chatgpt-account-id: {from JWT}
    → convert response back to Chat Completions
```

The agent speaks standard OpenAI Chat Completions API. The proxy translates. No code changes needed in the agent.

## Auth flow

1. User logs into Codex CLI once (`codex` in terminal)
2. CLI stores refresh token in `~/.codex/auth.json`
3. Proxy reads refresh token, calls `auth.openai.com/oauth/token`
4. Gets access token (JWT), extracts `account_id` from payload
5. Caches token in memory, auto-refreshes 60s before expiry
6. On 5xx: retry with fresh token

```rust
// sgr-agent/src/providers/codex_proxy.rs
pub struct CodexAuth {
    inner: Arc<RwLock<CodexAuthInner>>,  // thread-safe
}

// Auto-refresh: check expiry before every request
async fn get_token(&self) -> Result<(String, String)> {
    let now = SystemTime::now()...as_secs();
    if now < inner.expires_at.saturating_sub(60) {
        return Ok((inner.access_token, inner.account_id));
    }
    // Expired → refresh
    let new = Self::refresh_token(&inner.refresh_token).await?;
    *inner = new;
    Ok(...)
}
```

## Why this matters

ChatGPT Pro = $200/month unlimited. API = pay per token, GPT-5.4 costs ~$50 per full PAC1 run. For development and testing, routing through subscription saves thousands.

The proxy makes this transparent. Agent code doesn't know it's hitting a subscription instead of the API. Switch between proxy and direct API with one config change.

## Our implementation vs others

**danis-gpt/pac1-agent** (Python) uses the same approach but reads from OpenClaw's `auth-profiles.json` and doesn't have a full proxy server. Just an HTTP client with token caching.

**Our codex_proxy.rs** (Rust, in [rust-code](https://github.com/fortunto2/rust-code)):
- Full localhost proxy server (Chat Completions → Codex Responses → Chat Completions)
- JWT parsing for account_id (base64 decode, no external JWT library)
- `Arc<RwLock>` for thread-safe token sharing across parallel requests
- 60s pre-expiry buffer (never hit an expired token in flight)
- Works with any Chat Completions client (BAML, openai-oxide, curl)

ZeroClaw (30k stars) calls this "subscription OAuth" and lists it as a key feature. We had it before they did.

## Limitations

- Depends on Codex CLI auth format (`~/.codex/auth.json`)
- If OpenAI changes the endpoint or auth flow, proxy breaks
- Rate limits are subscription-tier, not API-tier (different throttling)
- No streaming support yet in our proxy (planned)

## Links

- [codex_proxy.rs](https://github.com/fortunto2/rust-code/blob/master/crates/sgr-agent/src/providers/codex_proxy.rs) -- our implementation
- [[project-rust-code]] -- the terminal agent that uses this
- [[agent-bit-pac1]] -- PAC1 competition where $50/run made this essential
- [[rust-agent-ecosystem]] -- ZeroClaw's "subscription OAuth" is the same pattern
