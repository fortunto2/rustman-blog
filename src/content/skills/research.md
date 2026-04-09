---
title: "/research"
description: "\"research this idea\", \"find competitors\", \"check the market\", \"domain availability\", \"market size\", \"analyze opportunity\", or need evidence before validation."
created: 2026-04-09
tags: [skill, analysis, solo-factory]
phase: "analysis"
phase_order: 1
publish: true
source_url: "https://github.com/fortunto2/solo-factory/tree/main/skills/research"
---

Deep research before PRD generation. Produces a structured `research.md` with competitive analysis, user pain points, SEO/ASO keywords, naming/domain options, and market sizing.

````markdown
# /research

Deep research before PRD generation. Produces a structured `research.md` with competitive analysis, user pain points, SEO/ASO keywords, naming/domain options, and market sizing.

## Live Context
- Branch: !`git branch --show-current 2>/dev/null`
- Recent changes: !`git log --oneline -5 2>/dev/null`

## MCP Tools (use if available)

If MCP tools are available, prefer them over CLI:
- `kb_search(query, n_results)` — search knowledge base for related docs
- `web_search(query, engines, include_raw_content)` — web search with engine routing
- `session_search(query, project)` — find how similar research was done before
- `project_info(name)` — check project details and stacks
- `codegraph_explain(project)` — architecture overview of an existing project (stack, patterns, deps)
- `codegraph_query(query)` — raw Cypher queries against code graph (find shared packages, dependencies)
- `project_code_search(query, project)` — semantic search over project source code

MCP `web_search` supports engine override: `engines="reddit"`, `engines="youtube"`, etc.
If MCP tools are not available, use WebSearch/WebFetch as primary. If MCP web_search tool is available, use it for better results.

### Reddit Search Best Practices

- **Max 3 keywords** in reddit queries — more keywords = fewer results
- Good: `"product hunt outreach launch"` — Bad: `"product hunt scraper maker profiles linkedin outreach launch strategy"`
- `include_raw_content=true` rarely works for Reddit — use fallback chain below

### Reddit Content Access — Fallback Chain

When a search finds a relevant Reddit post, reading its full content requires a fallback chain:

```
1. MCP Playwright (old.reddit.com)     ← BEST: bypasses CAPTCHA, full post + comments
2. PullPush API (api.pullpush.io)      ← search by query/subreddit/author/score/date
3. MCP web_search include_raw_content   ← sometimes works, often truncated
4. WebFetch / WebSearch snippets        ← last resort, partial data only
```

**Method 1: MCP Playwright** (recommended for full post content)
- Use `browser_navigate("https://old.reddit.com/r/...")` — old.reddit.com loads without CAPTCHA
- `www.reddit.com` shows CAPTCHA ("Prove your humanity"), always use `old.reddit.com`
- Snapshot contains full post text + comments in structured YAML
- Example: `old.reddit.com/r/indiehackers/comments/abc123/post_title/`

**Method 2: PullPush API** (for search/discovery)
- Endpoint: `https://api.pullpush.io/reddit/submission/search`
- Params: `q`, `subreddit`, `author`, `score` (e.g. `>10,<100`), `since`/`until` (unix timestamps), `size` (max 100)
- Rate limits: soft 15 req/min, hard 30 req/min, 1000 req/hr. Sleep 4 sec between requests.
- Returns JSON with full `selftext`, author, score, created_utc
- Comment search: `/reddit/comment/search` (same params)
- Can use via curl:
```bash
curl -s "https://api.pullpush.io/reddit/submission/search?q=product+hunt+launch&subreddit=indiehackers&size=10"
```

**Method 3: Reddit .json endpoint** (often blocked)
- Append `.json` to any Reddit URL: `reddit.com/r/sub/comments/id.json`
- Returns raw JSON with full post + comments
- Frequently blocked (403/429) — use as opportunistic fallback only

**Method 4: PRAW** (Reddit Official API, for live search/user profiles)
- [praw-dev/praw](https://github.com/praw-dev/praw) — Python Reddit API Wrapper
- OAuth2 auth, built-in rate limiting, sync/async support
- Best for: live subreddit search, user profiles, comment trees
- `pip install praw` / `uv add praw`

## Search Strategy: Hybrid (MCP + WebSearch)

Use **multiple** search backends together. Each has strengths:

| Step | Best backend | Why |
|------|-------------|-----|
| **Competitors** | WebSearch + `site:producthunt.com` + `site:g2.com` | Broad discovery + Product Hunt + B2B reviews |
| **Reddit / Pain points** | MCP `web_search` with `engines: reddit` (max 3 keywords!) + MCP Playwright for full posts | PullPush API, selftext in content |
| **YouTube reviews** | MCP `web_search` with `engines: youtube` | Video reviews (views = demand) |
| **Market size** | WebSearch | Synthesizes numbers from 10 sources |
| **SEO / ASO** | WebSearch | Broader coverage, trend data |
| **Page scraping** | WebFetch or MCP `web_search` with `include_raw_content` | Up to 5000 chars of page content |
| **Hacker News** | WebSearch `site:news.ycombinator.com` | HN discussions and opinions |
| **Funding / Companies** | WebSearch `site:crunchbase.com` | Competitor funding, team size |
| **Verified revenue** | WebFetch `trustmrr.com/startup/<slug>` | Stripe-verified MRR, growth, tech stack, traffic |

### Search Availability

Use WebSearch/WebFetch as primary. If MCP `web_search` tool is available, use it for better results (supports engine routing and raw content extraction).

## Steps

1. **Parse the idea** from `$ARGUMENTS`. If empty, ask the user what idea they want to research.

2. **Detect product type** — infer from the idea description:
   - Keywords like "app", "mobile", "iPhone", "Android" → mobile (ios/android)
   - Keywords like "website", "SaaS", "dashboard", "web app" → web
   - Keywords like "CLI", "terminal", "command line" → cli
   - Keywords like "API", "backend", "service" → api
   - Keywords like "extension", "plugin", "browser" → web (extension)
   - Default if unclear → web
   - Only ask via AskUserQuestion if truly ambiguous (e.g., "build a todo app" could be web or mobile)
   - This determines which research sections apply (ASO for mobile, SEO for web, etc.)

3. **Search knowledge base and past work:**
   - If MCP `kb_search` available: `kb_search(query="<idea keywords>", n_results=5)`
   - If MCP `session_search` available: `session_search(query="<idea keywords>")` — check if this idea was researched before
   - Otherwise: Grep for keywords in `.md` files
   - Check if `research.md` or `prd.md` already exist for this idea.

4. **Check existing portfolio** (if MCP codegraph tools available):
   - `codegraph_explain(project="<similar project>")` — architecture overview of related projects in the portfolio
   - `project_code_search(query="<relevant pattern>", project="<sibling>")` — find reusable code, patterns, infrastructure
   - `codegraph_query("MATCH (p:Project)-[:DEPENDS_ON]->(pkg:Package) WHERE pkg.name CONTAINS '<relevant tech>' RETURN p.name, pkg.name")` — find projects using similar tech
   - This helps assess: feasibility, reusable code, stack decisions, and time estimates
   - If no MCP tools available, skip this step.

5. **Competitive analysis** — use WebSearch (primary) + MCP web_search (if available):
   - `"<idea> competitors alternatives 2026"` — broad discovery
   - `"<idea> app review pricing"` — pricing data
   - WebFetch or MCP `include_raw_content=true`: scrape competitor URLs for detailed pricing
   - MCP `engines: reddit` or WebSearch: `"<idea> vs"` — user opinions
   - `"site:producthunt.com <idea>"` — Product Hunt launches
   - `"site:g2.com <idea>"` or `"site:capterra.com <idea>"` — B2B reviews
   - `"site:crunchbase.com <competitor>"` — funding, team size
   - `"site:trustmrr.com <idea>"` or WebFetch `trustmrr.com/startup/<slug>` — Stripe-verified MRR, growth %, tech stack, traffic (24h/7d/30d)
   - For each competitor extract: name, URL, pricing, key features, weaknesses, verified MRR (if on TrustMRR)

6. **User pain points** — use MCP web_search / WebSearch + YouTube:
   - MCP `engines: reddit` or WebSearch: `"<problem>"` — Reddit discussions (**max 3 keywords!**)
   - If Reddit post found but content not available → open via MCP Playwright: `browser_navigate("https://old.reddit.com/r/...")` — old.reddit.com bypasses CAPTCHA
   - MCP `engines: youtube` or WebSearch: `"<problem> review"` — video reviews
   - `"site:news.ycombinator.com <problem>"` — Hacker News opinions
   - WebSearch: `"<problem> frustrating OR annoying"` — broader sweep
   - Synthesis: top 5 pain points with quotes and source URLs

7. **SEO / ASO analysis** (depends on product type from step 2):

   **For web apps:**
   - `"<competitor> SEO keywords ranking"` — competitor keywords
   - `"<problem domain> search volume trends 2026"` — demand signals
   - WebFetch or MCP `include_raw_content`: scrape competitor pages for meta tags
   - Result: keyword table (keyword, intent, competition, relevance)

   **For mobile apps:**
   - `"<category> App Store top apps keywords 2026"` — category landscape
   - `"site:reddit.com <competitor app> review"` — user complaints
   - Result: ASO keywords, competitor ratings, common complaints

8. **Naming, domains, and company registration:**
   - Generate 7-10 name candidates (mix of descriptive + invented/brandable)
   - Domain availability: triple verification (whois → dig → RDAP)
   - Trademark + company name conflict checks

   See `references/domain-check.md` (bundled with this skill) for TLD priority tiers, bash scripts, gotchas, and trademark check methods.

9. **User Personas** (2-3 quick personas from research data):

   Based on pain points (step 6) and competitive gaps (step 5), generate 2-3 lightweight personas:

   | Field | Example |
   |-------|---------|
   | **Name** | "Alex, freelance designer" |
   | **Segment** | Early-career freelancers, $3-8K/mo |
   | **JTBD** | "When I finish a project, I want to send a professional invoice in under 60 seconds so I can get paid faster" |
   | **Pain** | Top pain point from step 6 with source quote |
   | **Current solution** | What they use today (competitor or workaround) |
   | **Switching trigger** | What would make them try something new |

   Keep personas grounded in evidence from steps 5-6. No fictional demographics — only what the data supports. These feed directly into `/validate` for ICP and PRD generation.

10. **Interview Script** (optional, if user plans customer interviews):

   Generate a 7-question JTBD interview script based on the personas above:

   1. **Context:** "Tell me about the last time you [core action]..." (open-ended, past tense)
   2. **Trigger:** "What prompted you to look for a solution?" (switching moment)
   3. **Current workflow:** "Walk me through how you do this today, step by step"
   4. **Pain:** "What's the most frustrating part?" (don't lead — let them name it)
   5. **Alternatives tried:** "What else have you tried? What happened?"
   6. **Outcome:** "What would 'solved' look like for you?"
   7. **Willingness to pay:** "If something did exactly that, what would it be worth to you?"

   Rules: past tense only (what they DID, not what they WOULD do), no leading questions, no feature pitching. Reference: JTBD interview methodology (Bob Moesta).

   Write to `docs/interview-script.md` if generated.

11. **Market sizing** (TAM/SAM/SOM) — use WebSearch (primary):
   - WebSearch: `"<market> market size 2025 2026 report"` — synthesizes numbers
   - WebSearch: `"<market> growth rate CAGR billion"` — growth projections
   - Extrapolation: TAM → SAM → SOM (Year 1)

12. **Write `research.md`** — write to `docs/research.md` in the current project directory. Create the directory if needed.

13. **Output summary:**
    - Key findings (3-5 bullets)
    - Recommendation: GO / NO-GO / PIVOT with brief reasoning
    - Path to generated research.md
    - Suggested next step: `/validate <idea>`

## research.md Format

See `references/research-template.md` (bundled with this skill) for the full output template (frontmatter, 6 sections, tables).

## Notes

- Always use kebab-case for project directory names
- If research.md already exists, ask before overwriting
- Run search queries in parallel when independent

## Common Issues

### MCP web_search not available
**Cause:** MCP server not running or not configured.
**Fix:** Use WebSearch/WebFetch as primary. For better results with engine routing (Reddit, GitHub, YouTube), set up [SearXNG](https://github.com/fortunto2/searxng-docker-tavily-adapter) (private, self-hosted, free) and configure solograph MCP.

### Domain check returns wrong results
**Cause:** `.app`/`.dev` whois shows TLD creation date for unregistered domains.
**Fix:** Use the triple verification method (whois -> dig -> RDAP). Check Name Server and Registrar fields, not creation date.

### research.md already exists
**Cause:** Previous research run for this idea.
**Fix:** Skill asks before overwriting. Choose to merge new findings or start fresh.

## Proactive Search Practices

### Reddit Deep Dive

1. **MCP web_search or WebSearch** — use for discovery (max 3 keywords for Reddit), get post URLs
2. **MCP Playwright** — open `old.reddit.com` URLs to read full post + comments (bypasses CAPTCHA)
3. **Extract quotes** — copy key phrases with attribution (u/username, subreddit, date)
4. **Cross-post detection** — same post in multiple subreddits = higher signal

### Product Hunt Research

1. **producthunt.com/visit-streaks** — streak leaderboard (scrapeable via Playwright)
2. **producthunt.com/@username** — profile with social links, maker history, points
3. **PH API v2 is broken** — redacts usernames/Twitter since Feb 2023, use scraping
4. **Apify actors** — check for DEPRECATED status before relying on them (mass deprecation Sep 2025)

### TrustMRR Revenue Validation

1. **`trustmrr.com/startup/<slug>`** — Stripe-verified MRR, growth %, subscriptions, traffic
2. **WebFetch works** — no auth needed, returns full page with JSON-LD structured data
3. **Data fields:** MRR, all-time revenue, last 30 days, active subs, tech stack, traffic (24h/7d/30d), category, founder X handle
4. **Use for:** competitor revenue validation, market sizing with real data, tech stack discovery
5. **Search:** `"site:trustmrr.com <category or idea>"` to find similar startups with verified revenue
6. **Apify scrapers:** [TrustMRR Scraper](https://apify.com/actor_builder/trustmrr-scraper/api) for bulk extraction

### GitHub Library Discovery

1. **MCP `engines: github`** — often returns empty, use WebSearch as primary
2. **github.com/topics/<keyword>** — browse topic pages via Playwright or WebFetch
3. **Check stars, last update, open issues** — avoid abandoned repos

### Blocked Content Fallback Chain

```
MCP Playwright (best) → PullPush API (Reddit) → WebFetch → WebSearch snippets → MCP web_search include_raw_content
```

If a page returns 403/CAPTCHA via WebFetch:
1. **Reddit:** MCP Playwright → `old.reddit.com` (always works, no CAPTCHA)
2. **Reddit search:** PullPush API `api.pullpush.io` (structured JSON, full selftext)
3. **Product Hunt / other sites:** MCP Playwright `browser_navigate` (no captcha on most sites)
4. **General:** WebSearch snippets + WebSearch synthesis
````
