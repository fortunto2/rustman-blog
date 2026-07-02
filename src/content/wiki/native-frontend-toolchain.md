---
type: note
title: Native Frontend Toolchain (Rust/Go rewrites)
created: 2026-07-02
tags: [frontend, tooling, rust, dx, performance, nextjs, codegen]
publish: true
description: The JS build toolchain is being rewritten in Rust/Go — TSGO, Oxlint, Rsbuild deliver 10-100x speedups. Infrastructure beats AI for developer velocity.
---

# Native Frontend Toolchain (Rust/Go rewrites)

The biggest developer-velocity wins in 2026 frontend come not from AI copilots but from
replacing the JavaScript-based toolchain with native (Rust/Go) rewrites of the same tools.
A [Habr case study](https://habr.com/ru/articles/1049908/) from a lead managing 70+ FE devs
across 15+ micro-frontends reports 10-100x speedups by swapping four layers — and none of it
required writing more code or adding AI.

## The swaps and the numbers

| Layer | Old (JS) | New (native) | Lang | Result |
|-------|----------|--------------|------|--------|
| Type check | `tsc --noEmit` | **TSGO** (`tsgo`) | Go | 66s → 6.4s cold; CI 56s → 5s; RAM −83% |
| Lint | ESLint | **Oxlint** (oxc) | Rust | local 46s → 5.5s; CI 149s → 41s; RAM 511→212MB |
| Bundle | Webpack/Vite | **Rsbuild** (Rspack) | Rust | hot reload 36s → 1s; bundle 20MB → 1.6MB |
| API types | hand-written | **swagger-typescript-api** | — | ~33min → ~5min per contract change |
| React perf | manual `useMemo`/`memo` | **React Compiler** | — | 7mo prod, 0 incidents, less boilerplate |

At 40 devs × 50 build cycles/day the bundler swap alone recovers ~97 hours/week. The gains
**compound with team size** — a solo dev saves seconds, a team saves person-weeks.

## Two principles underneath

1. **Infrastructure wins, not models.** This is the exact thesis of [[fff-agent-file-search]]
   ("выиграют не модели, а инфраструктура") applied to the human toolchain instead of the
   agent's. Modernizing the boring layer (typecheck, lint, bundle) beats bolting AI on top.

2. **Write less code, let the tool do it.** swagger-typescript-api generates the API client
   from the backend's `swagger.json` — so *"compilation becomes an integration test"*: a
   backend contract change that breaks the frontend fails at `tsc`, not in production. This is
   [[schema-guided-reasoning]] and [[cli-first-testing]] in disguise — the schema is the
   source of truth, the type checker is the cheapest possible integration test. React Compiler
   is the same move at the render layer: delete the manual-memoization boilerplate, let the
   compiler insert it.

## Rust vs Go here

The toolchain split is instructive. Microsoft chose **Go** for TSGO because it's a near-literal
port of the existing `tsc` codebase (structural sharing, GC semantics that match TS's graph).
The lint/bundle layer — **oxc/Oxlint**, **Rspack/Rsbuild**, Biome — is **Rust**. Given a real
choice between equivalent native tools, prefer **Rust over Go** (our house rule, consistent with
the Rust-heavy stack — see [[awesome-rust]]). The oxc project is even building a Rust React
Compiler to replace the Babel plugin, so the whole velocity stack trends Rust.

Caveat on maturity (as of mid-2026): **Oxlint** and **Rsbuild** are production-ready; **TSGO**
is Release Candidate; **React Compiler** ships in React 19. Oxlint still lags ESLint on some
plugin rules, so teams keep ESLint for the long tail and run Oxlint as the fast pre-commit gate.

## Stack implications

For the `nextjs-supabase` stack (currently `eslint + prettier + tsc --noEmit`), the applicable
upgrades are **Oxlint** (fast pre-commit lint gate, keep ESLint for Next-specific plugin rules),
**TSGO** (`tsgo --noEmit` once out of RC), and **React Compiler** (`reactCompiler: true` — React
19 is already in the stack). Rsbuild does *not* apply — Next.js has its own Turbopack. For any
project with an OpenAPI backend, **codegen the client** instead of hand-writing types.

## See Also

- [[fff-agent-file-search]] — same "infrastructure > models" thesis, applied to agent retrieval
- [[schema-guided-reasoning]] — codegen-from-schema is the frontend face of schema-first
- [[cli-first-testing]] — "compilation as integration test" is the cheapest CLI-first gate
- [[awesome-rust]] — the Rust-over-Go preference and where to find native tool alternatives
- [[harness-engineering-summary]] — the meta-loop: a slow tool is a harness defect, fix the tool
