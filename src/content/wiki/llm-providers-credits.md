---
type: catalog
title: "LLM providers & startup credits — where to get models, free tiers, and funding"
description: "Catalog of LLM providers with free tiers, startup credit programs, and open-source models. From $0 to scale."
created: 2026-04-09
tags: [llm, providers, credits, startups, infrastructure, free-tier]
course_module: 6
course_order: 5
publish: true
---

# LLM Providers & Startup Credits

Where to get LLMs: free tiers, startup credit programs, open-source models. Organized from cheapest to most powerful.

---

## Startup Credit Programs

Apply for credits when you have a registered company or VC backing.

| Provider | Credits | Requirements | What you get | Link |
|----------|---------|-------------|-------------|------|
| **Together AI** | $15K–$50K | Build (<$5M raised): $15K + 3h eng. Scale ($5-10M): $30K + 6h. Grow (>$10M): $50K + 10h | Open model inference + fine-tuning + GTM + VC network | [together.ai/startup-accelerator](https://www.together.ai/startup-accelerator) |
| **Modal** | $25K | Seed–Series A, VC-backed or raised >$1M | GPU, inference, training, batch, sandboxes | [modal.com/startups](https://modal.com/startups) |
| **Cerebras** | $22.5K | Startup deal | Inference value + priority support + co-marketing | [cerebras.ai/startup-deal](https://www.cerebras.ai/startup-deal) |
| **Fireworks** | Varies | AI-native startups | Platform, tools, expertise | [fireworks.ai/startup-program](https://fireworks.ai/startup-program) |
| **Groq** | $10K | Groq for Startups eligibility | Fast inference credits (LPU) | [console.groq.com/docs/billing-faqs](https://console.groq.com/docs/billing-faqs) |
| **Google Cloud** | $2K–$350K | Google for Startups | Vertex AI, Gemini API, GCP credits | cloud.google.com/startup |
| **AWS** | $1K–$100K | AWS Activate | Bedrock (Claude, Llama, etc), SageMaker | aws.amazon.com/activate |
| **Azure** | $1K–$150K | Microsoft for Startups | Azure OpenAI, Cognitive Services | startups.microsoft.com |
| **OpenAI** | $2.5K+ (VC referral) | VC partner referral required, varies by stage. Grove program for pre-idea founders (closed cohorts) | GPT-4/5 API credits | [openai.com/startups](https://openai.com/startups/) |
| **Anthropic** | Varies | Claude for Startups — credits, resources, community | Claude API credits | [claude.com/programs/startups](https://claude.com/programs/startups) |
| **Cloudflare** | $5K–$250K | Bootstrapped: $5K. Early: $25K. Seed ($1-5M): $100K. High growth/Tier 1 VC: $250K. Workers AI capped at $50K | CDN, Workers AI (free models), R2 storage, Pages, zero egress | [cloudflare.com/forstartups](https://www.cloudflare.com/en-gb/forstartups/) |
| **Replicate** | $1K–$10K | Startup program | GPU inference for open models | replicate.com |

### Community Signal (Reddit, Apr 2026)

- **Together AI** — wide model selection, good price/quality. Few post-mortem reviews of accelerator, but tiers are clear
- **Cerebras** — complaints about limits/queues, signup pauses due to load. Great speed when access is available
- **Groq** — very high speed, good price/perf. Rate-limit and burst error discussions
- **Fireworks** — technically solid, discussions focus on pricing/stability rather than startup program
- **Cloudflare** — Workers AI has free tier with open models, startup credits up to $250K. Already on CF Pages = easy upgrade path
- **xAI / Grok** — no public startup program found (check manually)
- **OpenRouter** — no accelerator program, standard billing model

### No-VC / Bootstrapped Friendly

| Provider | Credits | Requirements | Link |
|----------|---------|-------------|------|
| **DeepInfra DeepStart** | 1B free tokens | Startup application, no VC required | [deepinfra.com/deepstart](https://deepinfra.com/deepstart) |
| **NVIDIA Inception** | Free membership → unlocks $100K AWS + $150K Nebius | 1+ dev, website, incorporated, <10 years. No equity, no VC | [nvidia.com/startups](https://www.nvidia.com/en-us/startups/) |
| **Mistral (Mistralship)** | Up to $30K | Startup program application | [mistral.ai](https://mistral.ai) |
| **Microsoft Founders Hub** | $1K–$150K | No VC required, business verification | [startups.microsoft.com](https://startups.microsoft.com) |
| **DigitalOcean Hatch** | Up to $100K | Raised <$10M, website, AI-native preferred | [digitalocean.com/startups](https://www.digitalocean.com/startups) |
| **OVHcloud** | Up to €100K | Pre-seed/seed (START) or Series A+ (SCALE) | [startup.ovhcloud.com](https://startup.ovhcloud.com/en/) |
| **Scaleway** | Up to €36K | EU-based or EU-focused | [scaleway.com/startup-program](https://www.scaleway.com/en/startup-program/) |
| **Intel Liftoff** | Cloud credits (varies) | Early-stage to Series B, must have product | [intel.com/liftoff](https://www.intel.com/content/www/us/en/developer/tools/oneapi/liftoff.html) |
| **xAI** | $25 signup + $150/mo | Opt-in data sharing (irreversible) | [x.ai/api](https://x.ai/api) |

### Credit Stacking Strategy

Apply in this order for maximum runway (no VC required):
1. **NVIDIA Inception** (free) → unlocks $100K AWS + $150K Nebius partner credits
2. **Microsoft Founders Hub** → up to $150K Azure (incl Azure OpenAI)
3. **DeepInfra DeepStart** → 1B tokens free
4. **Mistral** → $30K
5. **Modal** → $25K (if seed-funded)
6. **Stack the rest**: Cerebras $22.5K + Groq $10K + CF $5-250K

**Total potential: $500K+** without VC funding.

*Credits and requirements change — check provider pages for current terms.*

---

## Free Tiers (no application needed)

Start building today for $0.

| Provider | Free Tier | Models | Limits | Best for |
|----------|-----------|--------|--------|----------|
| **Google AI Studio** | Free | Gemini 2.5 Pro/Flash | 15 RPM, rate limited | Prototyping, testing |
| **Groq** | Free | Llama 3, Mixtral, Gemma | Rate limited | Fast inference (LPU, 840 tok/s) |
| **Cerebras** | 1M tok/day free | Llama, Qwen, GPT-OSS | 1M tokens/day, no card | Fastest inference (2,200 tok/s) |
| **SambaNova** | $5 credits (30 days) | Llama, Qwen, DeepSeek | Limited | Fast RDU inference |
| **OpenRouter** | 29 free models | GPT-OSS 120B, Nemotron 120B, Llama 70B, DeepSeek R1, Gemma 4 | 20 RPM, 200 req/day per model | Routing + fallback, no card |
| **Cloudflare Workers AI** | 10K neurons/day free | Llama, Mistral, Gemma, Phi, etc | 10K neurons/day, zero egress | Edge inference, startup credits up to $50K |
| **NVIDIA NIM** | Free preview | Llama, Mistral, CodeLlama, DeepSeek, etc | Rate limited, API key required | Code gen, inference preview | [build.nvidia.com](https://build.nvidia.com/models) |
| **Hugging Face** | Free inference | All open models | Rate limited, queue | Testing open models |
| **Ollama** | Free (local) | Any GGUF model | Your hardware | Privacy, offline |
| **LM Studio** | Free (local) | Any GGUF model | Your hardware | GUI for local models |
| **MLX** | Free (local) | Apple Silicon models | M1+ Mac | On-device, fast |

---

## Inference Pricing ($/1M tokens, Apr 2026)

Prices dropped ~80% in 12 months. Format: input / output.

### Frontier (closed)

| Provider | Model | Input | Output |
|----------|-------|-------|--------|
| **OpenAI** | GPT-5 | ~$5 | ~$15 |
| **Anthropic** | Claude Opus 4 | ~$15 | ~$75 |
| **Anthropic** | Claude Sonnet 4 | ~$3 | ~$15 |
| **Google** | Gemini 2.5 Pro | ~$1.25 | ~$10 |

### Open Models — 70B class

| Provider | Llama 3.3 70B | Qwen 2.5 72B | DeepSeek V3 | Speed |
|----------|--------------|-------------|-------------|-------|
| **Novita AI** | $0.14 / $0.40 | $0.38 / $0.40 | $0.27 / $0.40 | GPU |
| **DeepInfra** | $0.23 / $0.40 | $0.12 / $0.39 | $0.27 / $1.10 | GPU |
| **Hyperbolic** | $0.40 | $0.40 | $0.25 | GPU |
| **Groq** | $0.59 / $0.79 | — | — | 394 tok/s (LPU) |
| **Together AI** | $0.88 | — | $0.60 / $1.70 | GPU |
| **OpenRouter** | **FREE** | $0.23 | **FREE** (R1) | varies |

### Open Models — 120B+ class

| Provider | GPT-OSS 120B | Nemotron 120B | Qwen3 235B |
|----------|-------------|---------------|------------|
| **Groq** | $0.15 / $0.60 | — | — |
| **Together AI** | $0.15 / $0.60 | — | — |
| **Fireworks** | $0.15 / $0.60 | — | — |
| **Cerebras** | $0.35 / $0.75 | — | $0.60 / $1.20 |
| **OpenRouter** | **FREE** | **FREE** | — |

### Nemotron 3 Super 120B — Full Provider Comparison

Best open model for price/quality ratio (MoE: 12B active / 120B total, 1M context).

| Provider | Input $/1M | Output $/1M | 100M tokens (50/50) | tok/s | Source |
|----------|-----------|------------|-------------------|-------|--------|
| **DeepInfra** | $0.10 | $0.50 | **$30** | 459 | [deepinfra.com](https://deepinfra.com) |
| **Hyperbolic** | $0.30 | $0.30 | **$30** | ~400 | [hyperbolic.xyz](https://hyperbolic.xyz) |
| **W&B** | ~$0.15 | ~$0.55 | **$35** | ~440 | artificialanalysis.ai |
| **Baseten** | ~$0.18 | ~$0.65 | **$41** | 485 | baseten.co |
| **Nebius** | ~$0.20 | ~$0.70 | **$45** | 464 | nebius.ai |
| **Digital Ocean** | $0.30 | $0.65 | **$48** | — | NVIDIA NIM partners |
| **Bitdeer AI** | $0.20 | $0.80 | **$50** | — | NVIDIA NIM partners |
| **CoreWeave** | $0.20 | $0.80 | **$50** | — | NVIDIA NIM partners |
| **Cloudflare** | $0.50 | $1.50 | **$100** | ~80 | CF Workers AI |
| **OpenRouter** | FREE | FREE | **$0** | varies | rate limited (20 RPM) |
| **NVIDIA NIM** | FREE | FREE | **$0** | 449 | 1000 credits, 40 RPM |

**Winner: DeepInfra** — $30 per 100M tokens, 459 tok/s. If speed critical: Baseten ($41, 485 tok/s). Cloudflare 3.3x more expensive and 6x slower — use only for edge/prototype.

### Top Open-Source Models — Price/Quality Leaders (Apr 2026)

Best bang for buck across all open models and providers.

| Model | Params (active) | Best Provider | In $/1M | Out $/1M | 100M (50/50) | tok/s |
|-------|----------------|--------------|---------|----------|-------------|-------|
| **Qwen3 235B** (A22B) | 235B (22B) | DeepInfra | $0.12 | $0.39 | **$26** | ~300 |
| **Qwen3 32B** | 32B | Novita AI | $0.10 | $0.45 | **$28** | ~500 |
| **Nemotron 120B** (A12B) | 120B (12B) | DeepInfra | $0.10 | $0.50 | **$30** | 459 |
| **DeepSeek V3.2** | 671B MoE | DeepSeek API | $0.28 | $0.42 | **$35** | ~200 |
| **GPT-OSS 120B** | 120B | Groq | $0.15 | $0.60 | **$38** | ~400 |
| **Qwen3 Coder 480B** (A35B) | 480B (35B) | DeepInfra Turbo | $0.22 | $0.90 | **$56** | 173 |
| **Llama 4 Maverick** | 400B MoE | Groq | $0.50 | $0.77 | **$64** | ~300 |
| **DeepSeek R1** (reasoning) | 671B MoE | Novita AI | $0.70 | $2.50 | **$160** | — |

**Best picks (at 80/20 input/output split — typical for agents):**

| Use Case | Model | Provider | 100M cost (80/20) | Speed |
|----------|-------|---------|-------------------|-------|
| **Best overall** | Qwen3 235B | [DeepInfra](https://deepinfra.com) | **$17** | ~300 tok/s |
| **Fastest powerful** | Nemotron 120B | [DeepInfra](https://deepinfra.com) | **$18** | 459 tok/s |
| **Cheapest with cache** | DeepSeek V3.2 | [DeepSeek API](https://platform.deepseek.com) | **$11** | ~200 tok/s |
| **Fastest overall** | GPT-OSS 120B | [Groq](https://groq.com) | **$24** | 500 tok/s |
| **Best for coding** | Qwen3 Coder 480B | [DeepInfra](https://deepinfra.com) | **$36** | 173 tok/s |
| **Best reasoning** | DeepSeek R1 | [Novita AI](https://novita.ai) | **$106** | — |
| **Budget $100** | Qwen3 235B | DeepInfra | **~600M tokens** | — |

Model ID for API: `Qwen/Qwen3-235B-A22B` (OpenAI-compatible endpoint at `api.deepinfra.com/v1/openai`)

### Nebius Token Factory — Batch = 50% Off

[Nebius](https://nebius.com/token-factory/prices) offers base (cheap) and fast (2x price) flavors. Batch inference = automatic 50% discount on base prices.

| Model | Nebius base in/out | Nebius batch in/out | 100M batch (80/20) |
|-------|-------------------|--------------------|--------------------|
| **Qwen3 235B** | $0.20 / $0.60 | $0.10 / $0.30 | **$14** |
| **Qwen3 32B** | $0.10 / $0.30 | $0.05 / $0.15 | **$7** |
| **Qwen3 30B-A3B** | $0.10 / $0.30 | $0.05 / $0.15 | **$7** |
| **Qwen3 Coder 480B** | $0.40 / $1.80 | $0.20 / $0.90 | **$34** |
| **GPT-OSS 120B** | $0.15 / $0.60 | $0.08 / $0.30 | **$12** |

Nebius batch Qwen3 235B = **$14/100M** — cheaper than DeepInfra realtime ($17). Best for non-realtime workloads (research, bulk analysis, data processing).

Also notable: **Qwen3 30B-A3B** (only 3B active params, 30B total MoE) at $0.10/$0.30 — frontier quality at micro-model cost.

### DeepSeek Cache Hack

DeepSeek auto-caches prompt prefixes. Cache hit = $0.03/M instead of $0.28/M (10x savings). For repeated system prompts this means **~$5 effective per 100M tokens** instead of $35. Best for agents with stable system prompts.

### For comparison: frontier models at 100M tokens (80/20 split)

| Model | 100M cost | vs Qwen3 235B |
|-------|----------|---------------|
| **Qwen3 235B** (open, DeepInfra) | **$17** | baseline |
| **Gemini 2.5 Flash** (Google) | **$132** | 8x more |
| **Claude Sonnet 4** (Anthropic) | **$540** | 32x more |
| **GPT-5** (OpenAI) | **$700** | 41x more |
| **Claude Opus 4** (Anthropic) | **$2,700** | 159x more |

### Speed Leaderboard (custom hardware)

| Provider | Hardware | 8B tok/s | 70B tok/s | 120B tok/s | Note |
|----------|----------|----------|-----------|-----------|------|
| **Cerebras** | WSE-3 (wafer, 4T transistors) | ~2,200 | ~1,500 | ~3,000 | 6x faster than Groq. OpenAI partner |
| **Groq** | LPU (SRAM ASIC) | 840 | 394 | 500 | Sub-100ms TTFT. Wide model selection |
| **SambaNova** | SN50 (RDU, Feb 2026) | ~988 | ~536 | — | 5x claim, 10M context support |
| GPU providers | H100/B200 | ~300 | ~150 | ~80 | DeepInfra, Together, Fireworks |

### Groq Pricing (from LPU, exact Apr 2026)

| Model | TPS | Input $/1M | Output $/1M | 100M (50/50) |
|-------|-----|-----------|------------|-------------|
| **GPT-OSS 20B** | 1,000 | $0.075 | $0.30 | **$19** |
| **Llama 4 Scout** | 594 | $0.11 | $0.34 | **$23** |
| **GPT-OSS 120B** | 500 | $0.15 | $0.60 | **$38** |
| **Qwen3 32B** | 662 | $0.29 | $0.59 | **$44** |
| **Llama 3.3 70B** | 394 | $0.59 | $0.79 | **$69** |
| **Llama 3.1 8B** | 840 | $0.05 | $0.08 | **$7** |

### Best Value Picks

| Use Case | Provider | Why |
|----------|---------|-----|
| **Cheapest 70B** | Novita AI or OpenRouter (free) | $0.14/M or $0 |
| **Cheapest 120B+** | OpenRouter free (GPT-OSS, Nemotron) | $0 with rate limits |
| **Fastest** | Cerebras | 2-6x faster than competition |
| **Fast + cheap** | Groq | Good speed/price, $0.05-0.79 |
| **Most models** | Together AI or OpenRouter | 200+ models |
| **DeepSeek R1 cheap** | Novita AI | $0.70 / $2.50 |
| **Free no card** | Cerebras free tier | 1M tokens/day |
| **29 free models** | OpenRouter | Including GPT-OSS, Nemotron, Llama, DeepSeek R1 |

### Key Providers

| Provider | Differentiator | Link |
|----------|---------------|------|
| **OpenAI** | Best ecosystem, GPT-5 | openai.com |
| **Anthropic** | Best coding, Claude | anthropic.com |
| **Google** | 1M+ context, multimodal | ai.google.dev |
| **OpenRouter** | Aggregator, 29 free models, fallback routing | [openrouter.ai](https://openrouter.ai) |
| **Groq** | LPU custom ASIC, very fast | [groq.com](https://groq.com) |
| **Cerebras** | Wafer-scale, fastest inference | [cerebras.ai](https://cerebras.ai) |
| **Together AI** | Open models, fine-tuning, ATLAS engine | [together.ai](https://together.ai) |
| **Fireworks** | Low latency, batch 50% discount | [fireworks.ai](https://fireworks.ai) |
| **SambaNova** | Custom RDU chip, fast | [sambanova.ai](https://sambanova.ai) |
| **Novita AI** | Cheapest prices across the board | [novita.ai](https://novita.ai) |
| **Hyperbolic** | Good prices, open models | [hyperbolic.xyz](https://hyperbolic.xyz) |
| **DeepInfra** | H100/B200, competitive pricing | [deepinfra.com](https://deepinfra.com) |
| **Nebius** | Wide Qwen3 selection, batch 50% off, base+fast flavors | [nebius.com/token-factory](https://nebius.com/token-factory/prices) |
| **Mistral AI** | Own models (Large/Medium/Small), EU data residency, free experiment tier | [mistral.ai](https://mistral.ai) |
| **xAI (Grok)** | Grok 4, 2M context window (largest), X/Twitter integration | [x.ai/api](https://x.ai/api) |
| **Cohere** | RAG-optimized, Rerank model, multilingual Aya, 1K free calls/mo | [cohere.com](https://cohere.com) |
| **SiliconFlow** | Chinese provider, very cheap, free Qwen3-8B/DeepSeek-7B | [siliconflow.com](https://siliconflow.com) |
| **Featherless AI** | Flat-rate: $10/mo (15B), $200/mo (all 25K+ HuggingFace models, unlimited) | [featherless.ai](https://featherless.ai) |
| **GMI Cloud** | H200 at $2.60/hr, some free models, 37% cheaper than hyperscalers | [gmicloud.ai](https://gmicloud.ai) |
| **Vast.ai** | GPU marketplace, H100 from $1.87/hr, 3-5x cheaper than hyperscalers | [vast.ai](https://vast.ai) |
| **RunPod** | Serverless inference, scale-to-zero, H100 $2.69/hr flex | [runpod.io](https://runpod.io) |
| **Modal** | GPU cloud, BYO model, autoscaling | [modal.com](https://modal.com) |

---

## Open-Source Models (self-host)

Run locally or on your own infrastructure. Zero API cost.

| Model Family | Sizes | License | Best for |
|-------------|-------|---------|----------|
| **Llama 3.x** (Meta) | 8B, 70B, 405B | Llama License | General purpose, coding |
| **Qwen 2.5** (Alibaba) | 0.5B–72B | Apache 2.0 | Multilingual, coding |
| **Mistral / Mixtral** | 7B, 8x7B, 8x22B | Apache 2.0 | Fast, efficient |
| **DeepSeek V3/R1** | 67B, 671B MoE | MIT | Reasoning, math, coding |
| **Gemma 2** (Google) | 2B, 9B, 27B | Gemma License | Lightweight, on-device |
| **Phi-3/4** (Microsoft) | 3.8B, 14B | MIT | Small, efficient |
| **Command R+** (Cohere) | 104B | CC-BY-NC | RAG-optimized |

**Local runners:** Ollama, LM Studio, llama.cpp, vLLM, MLX (Apple Silicon)

---

## Strategy: From $0 to Scale

### Phase 1: Validation ($0)
- Google AI Studio (Gemini 2.5 Flash) for prototyping
- Ollama/MLX for local development
- OpenRouter free models for testing

### Phase 2: MVP ($50-200/mo)
- Anthropic Claude for coding agent work
- OpenRouter for model routing + fallback
- Together AI for cheap open model inference

### Phase 3: Growth (startup credits)
- Apply to 2-3 startup programs ($25K-100K total)
- Modal for GPU inference at scale
- Mix providers: expensive model for hard tasks, cheap for routine

### Phase 4: Scale (optimize cost)
- Self-host open models for high-volume tasks
- Keep API providers for frontier capabilities
- [[token-efficient-web-requests|Optimize token usage]] at every level

---

## See Also

- [[token-efficient-web-requests]] — reduce API costs 80% with content negotiation
- [[infra-two-tools]] — infrastructure strategy (SST + Pulumi)
- [[privacy-as-architecture]] — when to self-host vs use API
- [[apple-on-device-ai]] — zero-cost on-device inference for iOS

---

## Pricing Comparison Sites

| Site | What | Link |
|------|------|------|
| **Artificial Analysis** | Quality + speed + price benchmarks, industry standard | [artificialanalysis.ai](https://artificialanalysis.ai) |
| **Price Per Token** | 300+ models, cheapest finder, coding/RAG leaderboards | [pricepertoken.com](https://pricepertoken.com) |
| **CostGoat** | 309 APIs, quality/price/value scoring | [costgoat.com](https://costgoat.com/compare/llm-api) |
| **Infrabase** | 53 providers, EU flagged, hosting type filters | [infrabase.ai](https://infrabase.ai/compare/inference-apis) |
| **Epoch AI** | Historical price trend analysis (academic-grade) | [epoch.ai](https://epoch.ai/data-insights/llm-inference-price-trends/) |

---

*Catalog growing. Last updated: 2026-04-10. Add providers as you discover them.*
