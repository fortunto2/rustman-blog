---
type: hub
title: "Genealogy Research"
description: "Family-history research done with AI agents: how to work through archives, civil records and Wikipedia, and which tools and methods hold up."
created: 2026-11-04
tags: [hub, genealogy, research, archives, agents]
publish: true
index_line: "Hub: genealogy research with AI agents. Methods and tools for archives, civil records, Wikipedia; no private family data. 1 article: genealogy-with-ai-agents (setup, traps, publishing rule as a script)"
---

# Genealogy Research

Family-history research with AI agents: finding people in archives and civil records, checking a
claim against a source, and getting a result into Wikipedia when it is notable. This section holds
methods and tools (what to search, which archive answers, where an agent fails and a person must
look), not private family data.

## Articles

- [[genealogy-with-ai-agents]]: the setup, where agents work and where they make things up, and a publishing rule enforced by a script (22 generations, last 4 closed)

<!--
HOW TO ADD AN ARTICLE (this comment is not rendered)

1. Create wiki/<human-name>.md with this frontmatter:

   ---
   type: concept
   title: "..."
   description: "One sentence for SEO and RSS"
   created: YYYY-MM-DD
   tags: [genealogy, research, archives]
   publish: true
   feed: true            # a dated write-up: also listed on the homepage
   ---

   In the body link back to the hub: [[genealogy-research]]. Only methods and public sources;
   no private family data.

2. Add the article to the list under "Articles" above: `- [[slug]]: one line`.

3. Flip the section on: set `publish: true` in THIS file's frontmatter (it is `false` while the
   list is empty, because an empty section page is worse than none). No blog nav change is needed:
   `type: hub` pages show up under Topics on /wiki/ by themselves.

4. `make wiki-catalog && make wiki-check`, then `make blog-publish`.
-->
