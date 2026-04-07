---
type: summary
title: "KMP sync — Supabase + PowerSync for offline-first cross-platform"
created: 2026-04-07
tags: [kotlin, kmp, sync, offline-first, supabase, powersync, mobile]
publish: true
source_path: "1-methodology/sync-strategy.md"
---

## Key Takeaways

For family/cross-platform apps needing offline-first sync between Android + iOS: **Supabase + PowerSync** is the recommended stack. MongoDB Realm Sync was deprecated Sep 2025 — no longer an option.

| Solution | Offline-First | MVP Timeline | 5K MAU Cost |
|----------|--------------|-------------|-------------|
| **Supabase + PowerSync** | Native | 1-2 weeks | ~$75/mo |
| **Firebase (GitLive)** | Cache only | 1 week | Free-$25/mo |
| **Couchbase (Kotbase)** | Native | 2-3 weeks | Free-$50/mo |
| **Supabase alone** | None | 3-5 days | $25/mo |

PowerSync maintains local SQLite on each device, syncs bidirectionally with Supabase Postgres. supabase-kt SDK (v3.3.0) provides full KMP support.

If budget is tight and offline isn't critical: Firebase via GitLive SDK (simpler, online-first with cache).

## Connections

- [[privacy-as-architecture]] — local SQLite + selective sync = user controls what data leaves device
- [[infra-two-tools]] — Supabase as backend aligns with the shared auth infrastructure
