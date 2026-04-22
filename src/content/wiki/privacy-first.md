---
type: hub
description: "Building products where user data stays on-device. Offline-first, local processing, minimal cloud dependency."
title: "Privacy-First Architecture"
created: 2026-04-07
updated: 2026-04-07
tags: [hub, privacy, architecture, offline-first]
course_module: 4
course_order: 5
publish: true
---

# Privacy-First Architecture

Building products where user data stays on-device. Offline-first, local processing, minimal cloud dependency.

## Pages

- [[privacy-as-architecture]] — Privacy as architectural decision, not a feature (from manifesto)
- [[manifest-summary]] — Core values: privacy is architecture = principle #2
- [[openai-privacy-filter]] — On-device PII redaction model (OpenAI, 1.5B MoE, Apache-2.0) — the strip-before-send primitive

## Core Concepts

- MLX on-device inference (Apple Silicon)
- Supabase Auth + row-level security
- PostHog EU analytics (GDPR-compliant)
- On-device embeddings (multilingual-e5-small)
- Privacy-first as competitive moat

## Open Questions

- How to sync without exposing data? (CRDTs vs E2EE)
- When is cloud processing acceptable?
- Legal requirements across jurisdictions (GDPR, CCPA, etc.)

## Key Sources

- `1-methodology/posthog-analytics.md` — PostHog EU setup
- `1-methodology/infra-prd.md` — Infrastructure architecture
- `0-principles/manifest.md` — Privacy-first principle
