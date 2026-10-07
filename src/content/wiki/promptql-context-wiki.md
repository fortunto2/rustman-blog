---
type: summary
title: "PromptQL: a context wiki instead of a semantic layer"
description: What PromptQL (Hasura) does to make an agent accurate on company data, and which of its mechanics transfer to a one-person LLM wiki.
index_line: "PromptQL (Hasura) dropped 'semantic layer / knowledge graph' for a context wiki: agent proposes a page edit from a chat correction ('wants to learn'), human approves; agent flags missing context; edits versioned, attributed, reversible; repeated work saved as programs; permissions checked per request; Confidence/Approve/Inaccurate on answers. Taken: 3 of 7 → [[wiki-feedback-loop]]"
created: 2026-10-07
tags: [agents, memory, context-engineering, harness, inspiration]
source_url: https://promptql.io/why-promptql-works
learned_from: 7d5bb78e-28d5-4bbc-8632-3f8ad5cb16b1
publish: true
index_section: summary
---

# PromptQL: a context wiki instead of a semantic layer

## Definition

PromptQL is Hasura's product for asking questions over company data. It started as
"accurate text-to-SQL through a semantic layer" (an explicit query plan over Hasura's
supergraph metadata) and by late 2026 had rebuilt itself around a different claim: the
thing that makes an agent accurate is not a schema catalog but a **wiki of operational
context** that grows in the flow of work. Their page says it outright: semantic layers
and knowledge graphs "don't scale"; definitions, exceptions and tribal rules do.

## Rule

Seven mechanics, as they present them:

1. **Context wiki, not a graph.** A page per metric or process: formula, policy rule,
   categories, regional targets, exceptions. Tags and a Talk tab. The agent reads these
   pages before it reads the data.
2. **"PromptQL wants to learn."** A user states a rule in a thread. The agent drafts
   the wiki edit, shows it, and the user reviews, edits, then clicks "Add to wiki" or
   tags someone who knows. Nothing lands without that click.
3. **AI flags gaps.** When context is missing, the agent says so and suggests the page
   to write, instead of answering confidently from nothing.
4. **Versioned, attributed, reversible.** Every edit has an author, a revision
   history and a rollback. They sell this as governance; it is also what makes the
   wiki trustworthy enough to act on.
5. **Repeated work becomes a program.** A workflow that is asked twice is saved and
   re-run, not re-planned. Also their cost lever: no regenerating plans.
6. **Permissions per request.** The bot has no access of its own; each action borrows
   the permissions of whoever asked. A shared bot is not a side door.
7. **Feedback on the answer.** Confidence shown; Approve / Inaccurate buttons. Plus
   multiplayer threads where people @-mention each other and the bot.

## Exceptions

What did not transfer, and why:

- **Multiplayer threads and per-request permissions**: one person, one wiki, one git
  identity. There is nothing to arbitrate.
- **Saved programs**: already exist here as skills and `make` targets. The missing
  piece was only the trigger, "asked three times → write it", which the gaps log gives.
- **Confidence on answers**: a number without a calibration is decoration. Logging
  the gap says the same thing with evidence attached.
- **Their original query-plan idea** (plan as explicit Python over semantic metadata,
  visible before execution) is still good and still absent from their marketing. It
  is the same insight as [[schema-guided-reasoning]]: make the plan a typed object,
  not a hidden chain of thought.

## Numbers

- Pricing, 2026-10-07: Free playground; Team $40 per user per month; Enterprise from
  $1,000 per month, single-tenant; Custom with BYOC and forward-deployed engineers.
- Landing page, docs overview and "why it works" page carry zero architecture
  detail: no plan format, no benchmark, no accuracy figure. Everything above is
  mechanics they show in demos, not measured claims.

## Learned from

Fetched promptql.io, /accurate-ai, /why-promptql-works and /docs on 2026-10-07 while
asking what our LLM wiki was missing. Taken: mechanics 2, 3 and 4, implemented as
files, grep and git in [[wiki-feedback-loop]]. The shape rhymes with
[[agent-mistake-fix-harness]]: a correction is a harness defect, and here the harness
is the wiki.
