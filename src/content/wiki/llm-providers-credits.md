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

*Credits and requirements change — check provider pages for current terms.*

---

## Free Tiers (no application needed)

Start building today for $0.

| Provider | Free Tier | Models | Limits | Best for |
|----------|-----------|--------|--------|----------|
| **Google AI Studio** | Free | Gemini 2.5 Pro/Flash | 15 RPM, rate limited | Prototyping, testing |
| **Groq** | Free | Llama 3, Mixtral, Gemma | Rate limited | Fast inference |
| **OpenRouter** | Free models | Various open models | Per-model limits | Routing + fallback |
| **Cloudflare Workers AI** | 10K neurons/day free | Llama, Mistral, Gemma, Phi, etc | 10K neurons/day, zero egress | Edge inference, startup credits up to $50K |
| **NVIDIA NIM** | Free preview | Llama, Mistral, CodeLlama, DeepSeek, etc | Rate limited, API key required | Code gen, inference preview | [build.nvidia.com](https://build.nvidia.com/models) |
| **Hugging Face** | Free inference | All open models | Rate limited, queue | Testing open models |
| **Ollama** | Free (local) | Any GGUF model | Your hardware | Privacy, offline |
| **LM Studio** | Free (local) | Any GGUF model | Your hardware | GUI for local models |
| **MLX** | Free (local) | Apple Silicon models | M1+ Mac | On-device, fast |

---

## API Providers (pay-as-you-go)

| Provider | Key Models | Pricing Model | Differentiator |
|----------|-----------|---------------|----------------|
| **OpenAI** | GPT-4o, GPT-5, o3 | Per token | Best overall ecosystem |
| **Anthropic** | Claude Opus 4, Sonnet 4 | Per token | Best for coding, long context |
| **Google** | Gemini 2.5 Pro/Flash | Per token | Longest context (1M+), multimodal |
| **OpenRouter** | 100+ models | Per token (markup) | Single API for all providers, fallback routing |
| **Together AI** | Open models (Llama, Mixtral) | Per token | Cheapest for open models |
| **Groq** | Llama, Mixtral | Per token | Fastest inference (LPU) |
| **Fireworks** | Open models | Per token | Low latency, fine-tuning |
| **Modal** | Any (BYO model) | Per GPU-second | Run your own models, autoscaling |
| **Replicate** | Open models | Per prediction | Simple API, community models |

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

*Catalog growing. Last updated: 2026-04-09. Add providers as you discover them.*
