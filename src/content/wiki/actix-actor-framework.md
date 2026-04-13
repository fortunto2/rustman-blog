---
type: concept
title: "Actix -- Rust actor framework"
description: "Actor model for Rust: typed messages, async/sync actors, supervision. Foundation behind actix-web. 9.2k stars."
created: 2026-04-14
tags: [rust, actors, concurrency, framework, open-source]
publish: true
source_url: "https://github.com/actix/actix"
---

# Actix

Actor framework for Rust. Typed message passing, async and sync actors, supervision trees. Runs on Tokio.

actix-web (21k stars, the most popular Rust web framework) is built on top, but the actor core is a separate crate. You can use actors without the web framework.

## When to use

- Isolated concurrent state (one actor per entity: user, order, session)
- Typed message passing between components (no `Any` type)
- Supervision trees for fault tolerance
- Background workers with lifecycle management

## Alternatives

| Crate | Stars | Distributed | Notes |
|-------|-------|-------------|-------|
| **actix** | 9.2k | No | Battle-tested, less active since 2024 |
| kameo | 1.2k | Yes (libp2p DHT) | Built-in distributed messaging |
| ractor | 2k | Experimental | Erlang-inspired, supervision trees |

## Links

- [GitHub](https://github.com/actix/actix)
- [crates.io](https://crates.io/crates/actix)
- [actix-web](https://github.com/actix/actix-web) (web framework built on actix)
