---
type: concept
title: "Codex OAuth proxy -- use ChatGPT subscription as API"
description: "Route LLM requests through a ChatGPT Plus/Pro subscription via OAuth token refresh. No API key needed. Rust implementation in sgr-agent with auto-refresh and Chat Completions compatibility — and, since GPT-5.5, the only way to reach the newest model at all."
created: 2026-04-14
tags: [agents, rust, auth, openai, infrastructure]
course_module: 5
course_order: 23
publish: true
index_line: "Route LLM requests through ChatGPT subscription via OAuth. No API key, auto-refresh, Chat Completions compatible. Our Rust proxy in sgr-agent. Semi-official since Apr 2026 (GPT-5.5 subscription-only); creds may now live in the OS keyring, not auth.json"
index_section: "concept"
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
2. CLI stores refresh token in `~/.codex/auth.json` — or in the OS keyring, see [Credential storage moved](#credential-storage-moved)
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

Since April 2026 the motive changed from cost to access: **GPT-5.5 shipped subscription-only**, reachable through ChatGPT sign-in but not through `api.openai.com` with an API key. An API key buys GPT-5.4 and 5.4-mini; the proxy buys 5.5. Historically OpenAI closes that gap in 4–8 weeks, so treat it as a moving advantage rather than a permanent one.

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

## Status, August 2026

OpenAI's position settled into deliberate tolerance rather than a policy. After Simon Willison reverse-engineered the flow, OpenAI's reply was *"We want people to be able to use Codex, and their ChatGPT subscription, wherever they like"* — a semi-official endorsement, not documentation. They went further and enabled Codex OAuth for OpenClaw. Codex lead Tibo Sottiaux drew the actual line: signing in with your own ChatGPT account from an official or OSS client is the supported path; sub2api-style subscription-to-API sharing is not, and he traced a chunk of the limit complaints to exactly that.

**Personal OAuth is in, subscription gateways for a crowd are out.** Same distinction Anthropic drew, opposite conclusion about tooling — see [[claude-subscription-boundary]], where the identical pattern is banned outright. On that side the terms landed 20 Feb 2026 and billing enforcement followed on 4 Apr 2026, cutting third-party traffic off from subscription quotas entirely.

There is now an ecosystem around the same endpoint: Simon Willison's `llm-openai-via-codex` plugin reads `~/.codex/auth.json` and mirrors your tier's model access, and Codex2API is an open-source proxy with account-pool scheduling — that last one being squarely the thing OpenAI says not to do.

Also new: a device-code flow (the user enables *device code authorization for Codex* under Settings → Security & Login), which is what a headless box wants instead of a browser callback. And enterprise-side, `/etc/codex/requirements.toml` can force `forced_login_method` and `forced_chatgpt_workspace_id`.

### Credential storage moved

The thing most likely to break our proxy. Codex now supports the OS keyring, controlled from `~/.codex/config.toml`:

```toml
cli_auth_credentials_store = "auto"   # "file" | "keyring" | "auto"
```

With `auto` or `keyring` there may be no `~/.codex/auth.json` to read. `codex_proxy.rs` assumes the file. Fix is either pinning `= "file"` on the host, or teaching the proxy to fall back to the keyring.

Security note carried over from the docs: that token holds full workspace permissions — repos, command execution, conversation history. `chmod 600`, never in git, mount as a secret in CI.

## Limitations

- Depends on Codex CLI auth format (`~/.codex/auth.json`), which is no longer the only store — see above
- If OpenAI changes the endpoint or auth flow, proxy breaks. The endpoint is explicitly undocumented and can change without notice
- Rate limits are subscription-tier, not API-tier: rolling 5-hour windows, roughly 15–80 GPT-5.5 messages on Plus, up to 1,600 on Pro
- No streaming support yet in our proxy (planned)

## Links

- [codex_proxy.rs](https://github.com/fortunto2/rust-code/blob/master/crates/sgr-agent/src/providers/codex_proxy.rs) -- our implementation
- [[claude-subscription-boundary]] -- the same move against Anthropic, where it is banned and enforced
- [[project-rust-code]] -- the terminal agent that uses this
- [[agent-bit-pac1]] -- PAC1 competition where $50/run made this essential
- [[rust-agent-ecosystem]] -- ZeroClaw's "subscription OAuth" is the same pattern
