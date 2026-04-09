---
type: project
title: "Invoice CRM — free file-based invoice generator for freelancers"
description: "Open-source CLI for PDF invoices, QR payments (SEPA/EMVCo/SWIFT/crypto), digital signatures, encryption. File-based, git-friendly, AI-agent compatible. No SaaS, no monthly fees."
created: 2026-03-01
tags: [project, open-source, python, cli, invoicing, pdf, privacy-first]
project_type: tool
course_module: 7
course_order: 4
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/invoice-crm"
github: fortunto2/invoice-crm
---

# Invoice CRM

Free, open-source invoice generator for freelancers and small businesses. File-based, git-friendly, AI-agent compatible. No SaaS, no monthly fees.

## The Problem

Freelancers and solo founders need invoicing but typical SaaS solutions cost $10-60/month, keep your data on their servers, and don't work offline. They also don't integrate with AI coding agents.

## Solution

A Python CLI tool where all data (clients, providers, bank details) lives in YAML files on your machine. Professional PDF generation with Jinja2 templates, WeasyPrint rendering, and optional digital signatures.

## Key Features

- **Invoice Generation** — professional PDF invoices with automatic numbering
- **QR Payment Codes** — EPC/SEPA (EUR), EMVCo (TRY), SWIFT text (USD), crypto addresses (USDT/BTC)
- **Digital Signatures** — optional PDF signing with self-signed certificates
- **File Encryption** — optional [age](https://age-encryption.org) encryption for sensitive files
- **Multiple Banks** — support for multiple bank accounts per provider
- **Company Cards** — bank details cards with payment QR codes
- **Letter Generation** — business letters with customizable templates

## Architecture

```
providers/*.yaml    → your companies (bank details, tax info)
clients/*.yaml      → your clients (address, defaults, rates)
templates/*.html    → Jinja2 + CSS templates
crm.py              → main CLI (click)
qr.py               → QR code generator
signing.py          → PDF digital signatures (pyHanko)
crypto.py           → age encryption
schemas.py          → Pydantic validation
```

Deterministic pipeline: YAML configs → Pydantic validation → Jinja2 rendering → WeasyPrint PDF → optional QR/signing/encryption.

## AI-Agent Compatible

Works with Claude Code, Cursor, or any AI agent as a natural language interface:

```
Invoice ACME for 80 hours at $150
Generate bank details card for my company
```

Bank details never pass through the LLM — they come from deterministic config files. The agent only triggers the CLI with parameters.

## Privacy Architecture

- All data on your machine — no cloud, no accounts
- Bank details in config files, never in LLM context
- Optional encryption with age
- Git-friendly — version control your invoicing history
- Works fully offline

## vs SaaS

| Feature | Typical SaaS | Invoice CRM |
|---------|-------------|-------------|
| Monthly cost | $10-60 | Free |
| Data location | Their servers | Your machine |
| Offline | No | Yes |
| Version control | No | Git |
| AI integration | Limited | Full |
| Customization | Template picker | Full HTML/CSS |

## Stack

Python 3.11+, Click, Pydantic, Jinja2, WeasyPrint, pyHanko, age encryption, uv.

## Links

- [GitHub](https://github.com/fortunto2/invoice-crm)
- [[privacy-as-architecture]] — the design philosophy behind this tool
- [[cli-first-testing]] — CLI-first approach used here
