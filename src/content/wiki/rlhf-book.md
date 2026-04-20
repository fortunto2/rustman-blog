---
type: note
title: RLHF Book (Nathan Lambert)
created: 2026-04-18
publish: true
description: Nathan Lambert's living textbook on Reinforcement Learning from Human Feedback — end-to-end pipeline from preference data to DPO/PPO/RLVR, free online, 1.8k stars.
tags: [rlhf, training, alignment, llm, dpo, ppo, reward-models, book]
---

# RLHF Book

Nathan Lambert's open textbook on Reinforcement Learning from Human Feedback. Free online at [rlhfbook.com](https://rlhfbook.com/), source on [GitHub](https://github.com/natolambert/rlhf-book) (1.8k stars, heading to Manning print edition April 2026). Gentle introduction for readers with a quantitative background — not a blog dump, an actual book that covers the full optimization pipeline.

## Why this resource is load-bearing

Most RLHF knowledge is scattered across papers, blog posts, and Twitter threads. Lambert stitches it into one linear progression:

1. **Origins & foundations** — economics, philosophy, optimal control. Where the preference-learning idea actually came from.
2. **Fundamentals** — problem formulation, preference data collection, math framework.
3. **Core pipeline** — instruction tuning (IFT) → reward model training → rejection sampling → PPO → direct alignment (DPO).
4. **Advanced** — synthetic data, evaluation, tool use, RLVR (reinforcement learning from verifiable rewards, the reasoning-model trick).
5. **Open questions** — product applications, future directions.

The book is a living document: v0 April 2025 → v2 February 2026 with reorg, editor feedback, expansion. Companion code library, video course, Kindle + PDF support, Discord community.

## What to take from it

- **RLHF is a deployment tool, not just an algorithm.** The pipeline matters as much as the loss function. Data collection → reward model → policy optimization → eval — each stage has its own failure modes.
- **DPO vs PPO is not religion.** Lambert treats direct alignment algorithms as one branch, not the branch. For small labs, DPO is simpler; for large-scale production, PPO+reward-model still wins.
- **RLVR is the reasoning unlock.** The chapter on reinforcement learning from verifiable rewards is the clearest explanation of how o1/R1-style reasoning models are actually trained. Verifiable = unit tests, math answer checkers, code execution traces.
- **Evaluation is the hard part.** Lambert spends serious pages on eval methods — because reward hacking, preference-collection bias, and benchmark gaming make "did it work?" non-trivial.

## Connections

- [[schema-guided-reasoning]] — SGR is the **inference-time** alignment trick (structure the output space). RLHF is the **training-time** alignment trick (train the model to prefer good outputs). Complementary, not competing — we use SGR because we don't train our own models.
- [[sgr-deep-dive]] — extends the SGR note with code. RLHF teaches when SGR alone isn't enough: if the base model lacks a capability, structured prompting won't summon it — you need to train or pick a stronger base.
- [[agent-benchmarks]] — the book's eval chapter pairs with our agent-benchmark survey. RLHF eval (reward hacking, Goodhart's law) explains why SWE-bench numbers keep climbing without real capability gains.
- [[erc3-agents-competition]] — our ERC3 results used prompting + evolution, not RLHF. The book is the "what we're not doing" reference — useful to know the ceiling of in-context methods.
- [[shinka-evolve]] — evolutionary code optimization is adjacent to RLHF in the "optimize LLM behavior without gradient descent on weights" family. RLHF trains the model; Shinka evolves the prompt/program around the model.
- [[stanford-ai-index-2026]] — macro context for why RLHF matters: post-training is where the capability gap between open and closed models is being decided.

## How we use this

Solo founders don't train foundation models. So the book is a **literacy tool**, not a manual:

- Read the first 3 chapters (origins, fundamentals, pipeline) to understand what you're buying when you pick a model.
- Skim the DPO and RLVR chapters to know which open models are worth fine-tuning for narrow tasks (verifiable reward = we can make a reward signal from tests/code execution).
- Skip the PPO deep-dive unless you're actually shipping reward models.

Link: [rlhfbook.com](https://rlhfbook.com/) · [github.com/natolambert/rlhf-book](https://github.com/natolambert/rlhf-book)
