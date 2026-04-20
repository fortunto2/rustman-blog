---
type: concept
title: "ShinkaEvolve -- LLM-powered evolutionary code discovery"
description: "Framework from Sakana AI: evolve code with LLMs as mutation operators. Multi-island populations, archive-based selection, meta-evolution of prompts. Won ICFP 2025 contest."
created: 2026-04-14
tags: [agents, evolution, ai, tools, open-source, optimization]
course_module: 5
course_order: 18
publish: true
source_url: "https://github.com/SakanaAI/ShinkaEvolve"
---

# ShinkaEvolve

LLMs as mutation operators for evolutionary code optimization. Sakana AI, 1.1k stars, Apache-2.0. Maintains populations of programs that evolve toward a fitness function.

I used this heavily ~6 months ago. Revisiting: major API refactor (Mar 2026), PyPI package, agent skills, ICLR 2026 acceptance.

Source: [github.com/SakanaAI/ShinkaEvolve](https://github.com/SakanaAI/ShinkaEvolve)

## How it works

Multi-island evolutionary algorithm where LLMs propose code changes:

1. **Population** -- archive of programs (default 40), split across islands
2. **Selection** -- elite parents chosen (top 30%), weighted/power-law/beam search
3. **Mutation** -- LLM generates patches: diff (60%), full rewrite (30%), crossover (10%)
4. **Evaluation** -- program runs `run_experiment()`, returns `combined_score`
5. **Migration** -- best programs move between islands every N generations

Three patch types keep diversity: small diffs for local search, full rewrites for exploration, crossover for combining good ideas from different lineages.

## What changed since Oct 2025

| When | What |
|------|------|
| Oct 2025 | Won ICFP 2025 Programming Contest (Team Unagi) |
| Jan 2026 | ICLR 2026 accepted. Budget control (`max_api_costs`), adaptive targeting, WebUI |
| Feb 2026 | Agent skills for Claude Code/Codex: `shinka-setup`, `shinka-run`, `shinka-inspect`, `shinka-convert` |
| Mar 2026 | Major refactor: unified `ShinkaEvolveRunner`, PyPI as `shinka-evolve`, uv support |
| Apr 2026 | New docs site: sakanaai.github.io/ShinkaEvolve/ |

## Key design choices

**Model ensemble with cost-aware UCB bandit:** rotates between gpt-5-mini, gemini-3-flash, gemini-3.1-pro, gpt-5.4. Cheaper models get more tries, expensive ones only when they prove better. Budget cap in USD.

**Meta-evolution:** the system prompt itself evolves every N generations. Archive of 10 prompts, UCB sampling. The prompts that produce better mutations survive.

**Novelty search:** code embedding similarity (text-embedding-3-small) prevents the population from collapsing to one solution. Threshold 0.99, optional LLM judgment.

**Async 5-10x speedup:** proposals and evaluations run concurrently with EWMA smoothing for adaptive pacing.

## How we use it

Our skills (`/shinka-setup`, `/shinka-run`, `/shinka-inspect`, `/shinka-convert`) wrap ShinkaEvolve for agent-bit prompt evolution and code optimization. The `prompts/system.md` in agent-bit was evolved through ShinkaEvolve runs.

This is the production implementation of [[agent-patterns-stream2|self-evolution]]: the fixed/mutable partition. System prompt is mutable, tool definitions are fixed. ShinkaEvolve searches the mutable space.

Connects to [[erc3-agents-competition]]: ERC3 used evolution (68→100%) on agent configurations. ShinkaEvolve is the general-purpose version of that pattern.

And to [[asi-evolve-ai-research-agents]]: both use LLMs in evolutionary loops, but ASI-Evolve targets model architectures while ShinkaEvolve targets code/prompts.

## Quick start

```bash
pip install shinka-evolve
shinka_launch variant=circle_packing_example
```

Or via our skills:
```
/shinka-setup    # scaffold evaluate.py + initial.py
/shinka-run      # launch evolution
/shinka-inspect  # load top programs into context
```

## Links

- [GitHub](https://github.com/SakanaAI/ShinkaEvolve) -- 1.1k stars, Apache-2.0
- [Docs](https://sakanaai.github.io/ShinkaEvolve/)
- [ICLR 2026 paper](https://openreview.net/forum?id=shinkaevolve)
- [Agent skills](https://github.com/SakanaAI/ShinkaEvolve) -- `npx skills add SakanaAI/ShinkaEvolve`
