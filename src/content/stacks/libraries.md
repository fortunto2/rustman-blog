---
type: stack
title: "Libraries — curated libs by category"
description: "Curated library reference — data pipelines, federation, actors, event sourcing, voice, OpenAI, canvas."
created: 2026-02-11
tags: [libraries, reference, rust, typescript, python]
publish: true
source_path: "1-methodology/stacks/libraries.yaml"
---

# Libraries

Curated libs for specific product types. Not part of default stacks — pick what fits your product.

**Categories:** Data Pipeline · Federation · Actors · Event Sourcing · Openai · Voice · Openapi Codegen · Canvas

## Data Pipeline

| Library | Stack | Install | License |
|---------|-------|---------|--------|
| [cocoindex](https://cocoindex.io) | rust, python | `pip install -U cocoindex` | Apache-2.0 |

**cocoindex:** 6.6k★. Rust core + Python bindings. Incremental processing (only delta).
Sources: Postgres, S3, Drive, local files, custom APIs.
Targets: pgvector, Qdrant, LanceDB, Neo4j, Postgres.
Requires Postgres for incremental processing metadata.


## Federation

| Library | Stack | Install | License |
|---------|-------|---------|--------|
| [tonic](https://github.com/hyperium/tonic) | rust | `cargo add tonic tonic-build prost` | MIT |
| [cloudevents-sdk](https://github.com/cloudevents/sdk-rust) | rust | `cargo add cloudevents-sdk` | Apache-2.0 |
| [openraft](https://github.com/databendlabs/openraft) | rust | `cargo add openraft` | MIT |
| [async-nats](https://github.com/nats-io/nats.rs) | rust | `cargo add async-nats` | Apache-2.0 |

**tonic:** 12k★. De facto standard for Rust gRPC. Protobuf codegen via tonic-build.

**cloudevents-sdk:** 205★. CNCF standard. Lightweight.

**openraft:** 1.8k★. 70K writes/sec. Used by Databend.

**async-nats:** 1.4k★. Requires NATS server.


## Actors

| Library | Stack | Install | License |
|---------|-------|---------|--------|
| [kameo](https://github.com/tqwewe/kameo) | rust | `cargo add kameo` | MIT |
| [ractor](https://github.com/slawlor/ractor) | rust | `cargo add ractor` | MIT |

**kameo:** 1.2k★. Built-in distributed messaging. Async tokio.

**ractor:** 2k★. Clean API. Clustering not production-ready yet.


## Event Sourcing

| Library | Stack | Install | License |
|---------|-------|---------|--------|
| [cqrs-es](https://github.com/serverlesstechnology/cqrs) | rust | `cargo add cqrs-es postgres-es` | Apache-2.0 |
| [eventually-rs](https://github.com/get-eventually/eventually-rs) | rust | `cargo add eventually` | MIT |

**cqrs-es:** 471★. Production-ready. Serverless-friendly.

**eventually-rs:** 591★. Pre-1.0 but active.


## Openai

| Library | Stack | Install | License |
|---------|-------|---------|--------|
| [async-openai](https://github.com/64bit/async-openai) | rust | `cargo add async-openai` | MIT |
| [openai-oxide](https://github.com/fortunto2/openai-rust) | rust | `cargo add openai-oxide` | MIT |

**async-openai:** 1.8k★. Granular feature flags. Per-request headers.
Dynamic dispatch (dyn Config). Webhook support.

**openai-oxide:** Our crate. 18 endpoints, 114 tests, 88% OpenAPI coverage.
Pre-commit validates against official OpenAPI spec.


## Voice

| Library | Stack | Install | License |
|---------|-------|---------|--------|
| [voxkit](https://github.com/fortunto2/supervox) | rust | `cargo add voxkit` | MIT |

**voxkit:** Our crate. 148 tests, 10 feature-gated modules.
All backends optional via features.


## Openapi Codegen

| Library | Stack | Install | License |
|---------|-------|---------|--------|
| [progenitor](https://github.com/oxidecomputer/progenitor) | rust | `cargo add progenitor` | MPL-2.0 |
| [openapiv3](https://crates.io/crates/openapiv3) | rust | `cargo add openapiv3` | MIT |
| [utoipa](https://github.com/juhaku/utoipa) | rust | `cargo add utoipa` | MIT |

**progenitor:** Oxide Computer. Production-grade.

**openapiv3:** Used by progenitor internally.

**utoipa:** Opposite direction from progenitor — code → spec.


## Canvas

| Library | Stack | Install | License |
|---------|-------|---------|--------|
| [tldraw](https://tldraw.dev) | typescript, react | `pnpm add tldraw` | proprietary (free dev, paid production key) |

**tldraw:** 45k+ GitHub stars. DOM-based rendering (embed YouTube, Figma, etc).
Multiplayer via @tldraw/sync. Starter kits: npx create-tldraw@latest.


