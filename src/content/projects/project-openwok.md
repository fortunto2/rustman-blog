---
type: project
title: "OpenWok — transparent food delivery platform"
description: "Open-source food delivery with transparent pricing, Dioxus fullstack (SSR + WASM), Rust monorepo, Cloudflare Containers deploy."
created: 2026-03-01
tags: [project, open-source, rust, wasm, dioxus, food-delivery, cloudflare]
project_type: product
course_module: 7
course_order: 13
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/OpenWok"
github: fortunto2/OpenWok
---

# OpenWok

Open-source food delivery platform focused on transparent pricing, portable infrastructure, and a path toward self-hosted federation.

**Live:** [openwok.superduperai.co](https://openwok.superduperai.co)

## Architecture

Single Rust binary serving everything:

- **UI:** Dioxus 0.7 fullstack — SSR on first load, WASM hydration in browser
- **API:** axum routes mounted under `/api/*` in the same runtime
- **Database:** SQLite via rusqlite
- **Auth:** Supabase (Google OAuth + email/password)
- **Payments:** Stripe integration
- **Deploy:** Cloudflare Worker → Cloudflare Container → native Rust server

## Routes

### Customer
`/` → `/restaurants` → `/restaurant/:id` → `/checkout` → `/order/:id`

### Operator
`/operator` — order management console

### Restaurant owner
`/my-restaurants` → `/my-restaurants/:id` → `/onboard-restaurant`

### Courier
`/register-courier` → `/my-deliveries`

### Public
`/economics` — transparent pricing breakdown, open economics page

## Monorepo (Rust workspace)

| Crate | What |
|-------|------|
| `app` | Dioxus fullstack UI + SSR entrypoint |
| `api` | External HTTP API (axum) |
| `auth` | Shared Supabase auth |
| `core` | Domain logic, pricing, order state machine, repo traits |
| `handlers` | Reusable axum handlers |
| `stripe-universal` | Stripe integration |

## Why Open Source

Transparent pricing = open economics. Anyone can see the fee structure, verify margins, fork and self-host. Path toward federation — restaurants can run their own instance.

## Stack

Rust (Dioxus 0.7, axum, rusqlite), Cloudflare Containers, Supabase Auth, Stripe.

## Links

- [GitHub](https://github.com/fortunto2/OpenWok)
- [Live](https://openwok.superduperai.co)
- [[project-superduperai]] — part of the product portfolio
- [[privacy-as-architecture]] — self-hosted path, transparent pricing
