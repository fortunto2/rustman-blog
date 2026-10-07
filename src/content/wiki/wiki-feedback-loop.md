---
type: concept
title: Wiki Feedback Loop
description: How corrections and unanswered questions flow back into the wiki, borrowed from PromptQL's context wiki and reduced to files, grep and git.
index_line: "Two files close the raw→wiki loop: `_gaps.md` (questions /wiki-query answered from <2 pages, most-asked first) and `_pending-*.md` (corrections from a session, reviewed before landing, `learned_from: <session-id>`). Borrowed from PromptQL's 'wants to learn' + 'AI flags gaps'; heuristic scanner measured 28 candidates/108 sessions"
created: 2026-10-07
tags: [wiki, memory, harness, agents, context-engineering]
learned_from: 7d5bb78e-28d5-4bbc-8632-3f8ad5cb16b1
publish: true
---

# Wiki Feedback Loop

## Definition

The wiki learned only when someone sat down to ingest a source or write a note. Two
things leaked out between those moments: questions it could not answer, and
corrections given to the agent mid-session ("нет, у нас pnpm", "never use PostHog").
The feedback loop catches both in files next to the pages, so the next page to write
is a report, not a guess. See [[agent-memory-architecture]] and [[decision-traces-compound]]: this is the compound-learning layer for the wiki itself.

## Rule

- `/wiki-query` logs every question it answered from fewer than two relevant pages:
  `make wiki-gap Q="..." HITS=n PAGES=...`. `make wiki-gaps` prints open gaps most-asked
  first and re-checks each against the FTS index, so a gap a later page silently closed
  shows up as answerable. `make wiki-gap-close Q=... PAGE=slug` records the answer.
- A Stop hook scans the session transcript for corrections (messages that open with
  pushback or state a rule) and says how many it found. `/wiki-learn` triages them into
  wiki / project memory / noise, drafts `wiki/_pending-<slug>.md` with `target:` and
  `learned_from: <session-id>`, and nothing lands until the human applies it.
- Every page born this way carries `learned_from`, resolvable with solograph's
  `session_search`. A fact stays traceable to the conversation that taught it.
- Concept pages separate Definition / Rule / Exceptions / Numbers / Learned from, so
  the number and the exception are headings, not a clause in a paragraph.

## Exceptions

- The scanner is a heuristic, not a judge. It must stay cheap (<1s on Stop, no LLM),
  so it over-reports and the skill triages. A question like "нет ответа?" passes the
  filter; a correction phrased politely ("может, лучше pnpm?") does not.
- Project-local corrections go to auto-memory or CLAUDE.md, not the wiki. The wiki is
  for what is still true next month in another repo.
- Underscore files (`_gaps.md`, `_pending-*.md`) are never indexed, cataloged or
  published; they are the loop's working memory, git is their history.

## Numbers

- Candidate precision, measured 2026-10-07 on the 150 most recent transcripts (108
  parseable): 381 candidates before filtering, 28 after; roughly half are real
  corrections. The filters that mattered: skip compact summaries, non-human origins
  (task notifications, scheduled prompts), messages over 800 characters, pasted content.
- A bare "always"/"всегда" in the rule regex matched travel questions and cron
  prompts; the rule list is now explicit phrasings only.

## Learned from

PromptQL (Hasura) rebuilt itself around a "context wiki" instead of a semantic layer or
knowledge graph, and argues those don't scale. Three mechanics transferred: the agent
proposes a wiki edit from a chat correction and the human approves ("PromptQL wants to
learn"); the agent flags where context is missing; every edit is versioned, attributed,
reversible. What did not transfer: multiplayer threads and per-request permissions
(solo), and "reusable programs" for repeated queries, which skills and make targets
already are. Session [[harness-engineering-summary]]: an agent mistake becomes a
harness fix, and here the harness is the wiki itself.
