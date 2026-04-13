---
type: concept
title: "ASI-Evolve: autonomous AI research agents"
description: "Agent framework for full-cycle AI research: architecture search, data curation, RL algorithms. Found 105 new attention architectures, +18 MMLU points from data strategies."
created: 2026-04-14
tags: [agents, research, ai, evolution, architecture, rl]
publish: true
source_url: "https://arxiv.org/abs/2603.29640"
---

# ASI-Evolve: AI Accelerates AI

Agent framework that automates the full AI research cycle: learning, design, experiment, analysis. Not another paper-writing bot. This one searches across three pillars simultaneously: model architectures, pretraining data curation, and RL algorithms.

Paper: [arxiv.org/abs/2603.29640](https://arxiv.org/abs/2603.29640). Code: [github.com/GAIR-NLP/ASI-Evolve](https://github.com/GAIR-NLP/ASI-Evolve).

## What it found

- **105 new linear attention architectures** that beat established baselines
- Data curation strategies that raised **MMLU by 18+ points**
- Novel RL update rules derived from automated hypothesis search

The system uses a cognitive base of prior human research (semantic search over literature) plus a dedicated analyzer that distills multi-dimensional training logs into causal insights.

## The loop

```
Prior knowledge (papers, results)
    → Hypothesis generation
    → Experiment design
    → Training run
    → Log analysis (causal, not just metrics)
    → New knowledge → next cycle
```

Previous evolution agents worked on narrow algorithmic tasks. ASI-Evolve runs a unified search across architecture, data, and training -- three dimensions that researchers usually optimize separately.

## Why this matters for agent builders

The human role shifts from solving engineering problems to setting the right constraints for autonomous search. You don't tune attention formulas. You define the search space and let the agent explore it.

This is [[agent-patterns-stream2|self-evolution]] taken to the research level. Our agents evolve skills and prompts (fixed/mutable partition). ASI-Evolve evolves the models themselves.

The pattern also connects to [[agent-mistake-fix-harness]]: both create ratcheting loops where each iteration compounds on previous results. ASI-Evolve's cognitive base is the harness -- it accumulates knowledge so mistakes aren't repeated.

And it's a concrete example of [[decision-traces-compound]]: the agent's experiment logs become retrievable precedents for future hypothesis generation.

## Links

- [Paper](https://arxiv.org/abs/2603.29640) (Xu et al., 2026)
- [Code](https://github.com/GAIR-NLP/ASI-Evolve)
- [Review](https://arxiviq.substack.com/p/asi-evolve-ai-accelerates-ai)
- [Telegram discussion](https://t.me/gonzo_ML_podcasts/3157)
