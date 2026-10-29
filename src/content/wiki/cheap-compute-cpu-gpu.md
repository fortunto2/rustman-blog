---
type: catalog
title: "Cheap compute: where to rent 64 CPU cores or one GPU by the hour (Oct 2026)"
description: "Measured price list for burst CPU (64 cores for 1-3 hours), a small CUDA job and single-GPU training, with free credits and the one-time setup for a one-command run."
created: 2026-10-29
tags: [compute, gpu, cpu, spot, vast-ai, runpod, hetzner, oracle-cloud, modal, free-credits, infra]
publish: true
index_line: "Rent-compute price list read 2026-10-29: 64 vCPU x 1.5 h costs ~$0.23 on Vast.ai, ~$0 on Oracle A1 (Arm, free 1,500 OCPU-h/mo), ~$1.4-1.8 AWS/GCP spot, $3.2 Hetzner CCX63 (48 vCPU max; CCX prices 2-3x since 15 Jun 2026). GPU: Kaggle free, Vast 3090/4090 $0.16-0.5/h, Thunder A100-80GB $1.09/h, Modal T4 $0.59/h covered by $30/mo free. Oracle Always Free A1 is now 2 OCPU/12 GB"
index_section: "concept"
---

# Cheap compute: CPU burst and single GPU (Oct 2026)

All prices read on **2026-10-29** unless a date is given. `[P]` = provider's own page, `[T]` = third party, `[API]` = provider's public API queried today. USD unless marked. Money is per hour of one box; "vCPU" is a hardware thread on x86 clouds (so 64 vCPU is 32 physical cores), while Modal "cores" and Oracle Ampere A1 OCPUs are physical. Compare per vCPU, not per name.

Baseline we already have: Kaggle free (4 vCPU Xeon 2.2 GHz / 31 GB, or 2x T4, ~30 GPU-h/week) and the M5 Mac (10 cores, one core is about 2.4 Kaggle vCPUs).

## Short version

| Workload | Cheapest sane choice | Cost | Fallback |
|---|---|---|---|
| 1. CPU burst, 64 vCPU, 32-64 GB, 1-3 h | **Vast.ai** on-demand, a 64-thread EPYC host with a throwaway small GPU attached | **~$0.16/h, $0.23 for 1.5 h** | AWS spot `c7a.16xlarge` $0.94-1.21/h (~$1.5 per run); Oracle Ampere A1 free if the build runs on arm64 |
| 2. Small CUDA job, T4 or better, 1-2 h | **Kaggle free** while developing, then **Vast.ai** RTX 3090/4090 on-demand | **$0.16-0.5/h**, a 2 h run is under $1 | Modal T4 $0.59/h, free inside the $30/month credit |
| 3. Fine-tuning, 24-80 GB, hours to a day | 24 GB: **Vast.ai** 4090. 80 GB: **Thunder Compute** A100 80GB | 4090 $0.34-0.5/h; A100 80GB $1.09/h; H100 $2.3-3.2/h | RunPod (per-second, simplest UI), Lambda for H100 with no marketplace risk |

The surprise of this pass: **Hetzner is no longer the cheap CPU answer.** On 15 June 2026 CCX (dedicated vCPU) prices rose 2.3-3.4x and CCX tops out at 48 vCPU.

## 1. CPU burst (64 vCPU, 1-3 h)

Cost column = 64 vCPU for 1.5 h, RAM 64-128 GB, no storage or egress.

| Provider / shape | $/h, 64 vCPU class | One run (1.5 h) | Billing | Interruption | Source |
|---|---|---|---|---|---|
| **Vast.ai** on-demand, EPYC 7B12 64-thread host (RTX A2000 attached), 110 GB RAM, reliability 0.998, Denmark | **0.156** | **$0.23** | per second | none on-demand; interruptible type can be paused when outbid | [API] bundles query; [docs](https://docs.vast.ai/guides/instances/pricing) |
| **Oracle Ampere A1 Flex** (Arm, 1 OCPU = 1 core, no SMT) | $0.01/OCPU-h + $0.0015/GB-h | **$0** while under the monthly free allowance of 1,500 OCPU-h and 9,000 GB-h (64 OCPU x 1.5 h = 96 OCPU-h). Without the allowance ~$1.25 | per second, 1 min minimum (T, not rechecked) | none | [P] [price API](https://apexapps.oracle.com/pls/apex/cetools/api/v1/products/?currencyCode=USD), [P] [free-tier doc](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) |
| **AWS spot** `c7a.16xlarge` (64 vCPU, 128 GiB, EPYC 9R14, us-east-1) | 0.94 low, 1.17 avg c8a / 1.21 c7a | **$1.4-1.8** | per second, 60 s minimum | 10-15% interruption band, 2 min warning | [T] [DoiT](https://www.doit.com/compute/spot/us-east-1/c7a.16xlarge), [T] [cloud-9](https://cloud-9opt.com/aws/c8a.16xlarge). On-demand $3.28 |
| **GCP spot** `n2d-standard-64` (64 vCPU, 256 GB) | 0.83 (Ohio) to 1.30 (Iowa); on-demand 2.70 | $1.2-2.0 | per second, 1 min minimum | preempted any time, 30 s notice | [T] [Spare Cores](https://sparecores.com/server/gcp/911064) |
| **Azure spot** `F64als_v7` | 0.46 (cheapest region) to 1.01; on-demand 2.50 India / 3.87 US | $0.7-1.5 | per second | evicted any time | [T] [azurehub](https://azurehub.org/tools/vm-pricing/Standard_F64als_v7/) |
| **Oracle E5 Flex** x86 (32 OCPU = 64 vCPU + 128 GB) | 0.03/OCPU-h + 0.002/GB-h = **1.22** | $1.82 | per second | none | [P] price API. Preemptible capacity exists at about half price (T, not checked) |
| **OVH** `c3-128` (64 vCPU, 128 GB) | 1.724 | $2.6 (billed as 2 h if hourly) | hourly (not verified whether per minute) | none | [P] [OVH prices](https://www.ovhcloud.com/en/public-cloud/prices/) |
| **Scaleway** `POP2-HC-64C-128G` | EUR 1.7024 (~$2.0) | ~$3.0 | not verified | none | [P] [Scaleway](https://www.scaleway.com/en/pricing/virtual-instances/) |
| **Modal** CPU function, 32 physical cores (= 64 vCPU) + 64 GiB | 1.51 CPU + 0.51 RAM = **2.02** | $3.0 list, **$0 inside the $30/month Starter credit** | per second | "all functions preemptible", auto-restarts on same input; 3x price for non-preemptible | [P] [Modal pricing](https://modal.com/pricing), [P] [preemption](https://modal.com/docs/guide/preemption) |
| **Hetzner** `CCX63` (48 vCPU max, 192 GB, EU) | EUR 1.3678 = **$1.61**; need 64/48 more time, so 2 h billed | **$3.2** | hourly, rounded up | none | [P] [price adjustment 15 Jun 2026](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/). Before the rise it was $0.71 |
| **DigitalOcean** CPU-optimized `c-48` (48 vCPU) | 1.50 | $3.0 for 48 vCPU, no 64 size | per second (T) | none | [P] [DO droplets](https://www.digitalocean.com/pricing/droplets) |
| **Salad** CPU container group | $0.005/vCPU-h + $0.001/GB-h = 0.38 for 64+64 | n/a | per second | Lowest tier preempts | [P] [Salad](https://salad.com/pricing). Container docs cap one instance at **16 vCPU / 60 GB** (docs dated 2024), so it cannot hold one 64-thread job |

Hetzner dedicated boxes (AX/EX/GEX) have **setup fees and monthly billing**, no hourly: AX162-1 (EPYC, 48 cores) EUR 612.30/month + EUR 304 setup (AX102-1: 257.30 + 129; limited "LTD" offers cost 0-39 setup). Not a burst option. Server Auction has no hourly billing either. [P] same Hetzner page.

Not usable here: **RunPod CPU pods** (rate not published, only visible in console or `GET /v2/catalog/cpus` [T] [flexprice](https://flexprice.io/blog/runprod-pricing-guide-with-gpu-costs)), **Latitude.sh** (hourly bare metal exists, price table did not load, see "Could not verify"), **Vultr** (page did not load).

Oracle Always Free was **cut in half** on 15 June 2026: A1 is now 2 OCPU / 12 GB, not 4 / 24 [P] free-tier doc above, [T] [terminalbytes](https://terminalbytes.com/oracle-cloud-free-tier-changes-2026/). Idle Always Free instances (7 days, CPU/network/memory low) can be reclaimed. The 1,500 OCPU-h/month allowance is stated for all tenancies, which is why a short 64-core Arm run can be free on a pay-as-you-go account. Egress: first 10 TB/month free [P] price API.

### Cost of one run, 64 vCPU x 1.5 h, top three

| # | Option | Cost | Catch |
|---|---|---|---|
| 1 | Vast.ai on-demand 64-thread EPYC host | **$0.23** | Marketplace host, not a datacenter. Storage bills while the instance exists, bandwidth per host. Keep a copy of results off the box |
| 2 | Oracle Ampere A1 64 OCPU | **$0** (about $1.25 if the allowance is used up) | arm64 build (GCC `__int128` works, check 256-bit helpers). A1 "out of host capacity" errors are common (T), PAYG upgrade needed for more than 2 OCPU, real credit card required |
| 3 | AWS spot `c7a.16xlarge` | **$1.4-1.8** | New-account spot vCPU quota is small and must be raised in advance. Reclaim risk is irrelevant for a run under 1 h |

If x86 only and no marketplace: AWS spot. If you want zero setup friction and a $30 monthly credit: Modal.

## 2. Small CUDA job (T4 or better, 1-2 h)

Custom kernels and 64-bit atomics (`atomicAdd` on `unsigned long long`) run on any sm_60+ card, so pick by price. A 720k-bin histogram is 5.8 MB, it sits in L2 on Ampere/Ada.

| Option | GPU | $/h | Billing | Source |
|---|---|---|---|---|
| **Kaggle free** | 2x T4 | 0 (about 30 GPU-h/week) | session | known, measured earlier |
| **Vast.ai** on-demand | T4 0.15 (1 offer), RTX 3090 0.16 low / 0.29 median, RTX 4090 0.34 low / 0.51 median | see left | per second | [API] |
| Vast.ai interruptible | RTX 3090 0.08, RTX 4090 0.16 | | per second | [API] |
| **Modal** | T4 0.59, L4 0.80, A10 1.10, L40S 1.95 | | per second | [P] Modal pricing. $30/month free credit covers about 50 T4 hours |
| **RunPod** | RTX A5000 0.27, L4 0.59, RTX 3090 0.50, RTX 4090 0.89 | | per second | [P] [RunPod](https://www.runpod.io/pricing) (page shows one tier; see caveats) |
| **Thunder Compute** | RTX A6000 0.35 (48 GB) | | per minute | [P] [Thunder](https://www.thundercompute.com/pricing) |
| **Scaleway** | L4 EUR 0.79 | | not verified | [P] [Scaleway GPU](https://www.scaleway.com/en/pricing/gpu/) |
| **Salad** | RTX 4090 0.16 lowest tier (preemptible) to 0.44; 3090 0.09-0.20 | | per second | [P] Salad. Prices rise on 1 Nov 2026 except the lowest tier |
| **Colab** | T4 about 0.12, L4 0.17 (units, third-party rates) | | compute units, expire in 90 days | [T] [gpuperhour](https://gpuperhour.com/blog/google-colab-alternatives); $9.99 per 100 units, no subscription |
| Lightning AI | interruptible GPUs from the free credits | | | [P] [Lightning](https://lightning.ai/pricing): 5 credits at sign-up, 25 more with a card (about 80 interruptible GPU hours), phone number required |

**Pick:** develop on Kaggle, run the timed benchmark on a rented 3090/4090 on Vast ($0.3-1 for the session). For a reproducible one-command run with no marketplace, Modal T4 inside the free credit.

## 3. Training and fine-tuning (24-80 GB, hours to a day)

| GPU | Best price seen | Where | Notes |
|---|---|---|---|
| RTX 4090 24 GB | 0.34 on-demand low, 0.16 interruptible low | Vast.ai [API] | RunPod 0.89, Salad 0.16-0.44 (container, 60 GB RAM cap) |
| A6000 / L40 48 GB | 0.35 / 0.79 | Thunder [P] | RunPod A40/A6000 0.59, L40S 1.09; Lambda A6000 1.09 |
| A100 80 GB | **1.09** | Thunder [P] (never preempted, per-minute, no egress fee, CLI `tnr`) | Vast SXM4 0.54 low / 1.11 median [API] (40 or 80 GB, check the card); RunPod 1.79; Modal 2.50; Lambda A100 40GB 1.99 [P] [Lambda](https://lambda.ai/pricing) |
| H100 80 GB | 2.25 TensorDock marketing "from"; Vast PCIe 2.27 low on-demand, 0.68 interruptible; RunPod PCIe 2.89 | | Hyperbolic 3.19, Thunder 3.20, Modal 3.95, Lambda 3.99-4.29; sources [T] TensorDock home, [P] [Hyperbolic](https://www.hyperbolic.ai/marketplace), [P] others above |
| H200 / B200 | RunPod 5.29 / 7.99, Lambda B200 6.69, Hyperbolic 3.99 / 5.99 | | only if 80 GB is not enough |

Overnight (10 h) A100 80GB on Thunder is about $11; the same hours on a Vast interruptible 4090 are about $2-4 if the job checkpoints.

Lambda has no spot tier, bills per minute, no ingress or egress fees, but H100 stock sells out [P] [Lambda billing](https://docs.lambda.ai/public-cloud/billing/), [T] [spheron](https://www.spheron.network/blog/runpod-vs-lambda-labs-2026/). CoreWeave publishes enterprise pricing only and routes to sales, so not for an individual [P] [CoreWeave](https://www.coreweave.com/pricing). DigitalOcean/Paperspace GPU Droplets range $0.76-4.47 per GPU-hour with a spot tier that gives about 2 h notice [P] [DO](https://www.digitalocean.com/pricing/gpu-droplets); the page lost its GPU labels, so no model-level numbers here. Paperspace H100 is $5.95/h on-demand [T] search snippet.

## Free credits and programs

| Program | What an individual gets | Catch | Source |
|---|---|---|---|
| **Modal Starter** | $30/month free credit, no seat fee, 10 GPU concurrency | Resets monthly, which makes it the only recurring free GPU/CPU credit besides Kaggle | [P] Modal pricing |
| **Modal academics** | up to $10k for grad students, labs, researchers | Needs academic affiliation | [P] Modal pricing |
| **Modal startups** | up to $25K | Seed to Series A | [[llm-providers-credits]] |
| **Lightning AI** | 30 credits once (about 80 interruptible GPU hours) + 1 free CPU studio | Phone number; credits expire in 12 months | [P] Lightning |
| **Colab** | Free T4 (limited); paid credits $0.10 per unit | Units expire in 90 days; H100/G4 reports of "can't connect" | [T] gpuperhour |
| **Google Cloud trial** | $300, 90 days, card required | While on the trial account **no GPUs and no quota increases** (Google's own doc), so a 64-vCPU VM is not possible until you upgrade to paid | [P] [GCP free features](https://docs.cloud.google.com/free/docs/free-cloud-features) |
| **AWS Free plan** | $100 on sign-up + up to $100 more, 6 months; account closes when credits run out | Free plan restrictions on instance sizes not verified; promotional credits only on the Paid plan | [P] [AWS free](https://aws.amazon.com/free/) |
| **Azure** | $200 30-day trial (not re-read this pass) | | [P] snippet only |
| **Oracle** | $300 for 30 days + Always Free (2 OCPU Arm now) | Real credit/debit card only; no prepaid, virtual or PIN debit cards | [P] [Oracle free](https://www.oracle.com/cloud/free/) |
| **Google TRC** | free Cloud TPUs, invitation on rolling basis, anyone may apply | TPUs only (JAX/PyTorch-XLA), no CUDA, you must publish results | [P] [TRC](https://sites.research.google/trc/about/) |
| **Google Cloud research credits** | faculty up to $5,000, PhD up to $1,000 | Accredited institution required | [P] [Google](https://edu.google.com/programs/credits/research/) |
| **NVIDIA Inception** | startup credits via partners | Needs a company | [T] |

## Payment, KYC and billing for a non-US resident with a non-US card

| Provider | What it takes | Evidence |
|---|---|---|
| Vast.ai | Prepaid credits. Stripe cards **and crypto** (BitPay, Crypto.com). Credits are refundable only if bought by card. Keep a card on file or instances are deleted when the balance hits $0 | [P] [billing](https://docs.vast.ai/guides/reference/billing) |
| RunPod | Prepaid credits, must hold at least 1 hour of credit to start on-demand. Card, crypto (KYC before first crypto payment). Spend limit $80/h default. No egress fees | [P] [billing](https://docs.runpod.io/get-started/billing-information), [P] [pricing doc](https://docs.runpod.io/pods/pricing) |
| Thunder Compute | Card (not re-verified). No egress | [P] pricing page |
| Lambda | Weekly invoices after use. No egress | [P] billing doc |
| Modal | Card, billed monthly in arrears, credits applied first | [P] [billing](https://modal.com/docs/guide/billing) |
| Hetzner | Per-account resource limits, raise via "Limit increase" request; manual ID review reported for new accounts (not verified here) | [P] [support](https://www.hetzner.com/support/), [T] |
| AWS / GCP / Azure | Card. Default spot vCPU quota is small and adjustable (AWS quotas are in vCPUs) | [P] [AWS spot quotas](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-limits.html) |
| Oracle | Card verification with temporary hold; card must be credit-like | [P] Oracle free |

Egress: AWS about $0.09/GB (T, not rechecked), Oracle 10 TB/month free, Modal $0.04/GiB after 1 TiB/month, Vast per host (API field `inet_down_cost`, 0.0026-0.052 in the offers I pulled, unit assumed $/GB), RunPod, Thunder and Lambda none.

## Set up once so a run is one command

Already on the Mac: `aws` and `gcloud`. Not installed: `vastai`, `hcloud`, `runpodctl`, `tnr`, `modal`, `oci`.

1. **Vast.ai** (primary): create account, add $10-20 of credits (card or crypto), upload an SSH key in the console, `uv tool install vastai`, `vastai set api-key ...`. Save the search once:
   `vastai search offers 'cpu_cores_effective>=64 cpu_ram>=64 reliability>0.98 num_gpus=1 rentable=true' -o 'dph+'`
   then a script `burst.sh` that does search, `vastai create instance <id> --image ubuntu:24.04 --disk 40 --ssh --direct`, waits for SSH, rsyncs the binary, runs, pulls results, `vastai destroy instance`. Check flags with `--help`; I did not run the CLI.
   Time to a running box is minutes, not seconds, and varies by host and image pull.
2. **AWS spot** (fallback): request the Spot vCPU quota to 64 now, since a quota increase can take hours to days. Then one launch template (AMI, key pair, security group) and `aws ec2 run-instances --launch-template ... --instance-market-options MarketType=spot --instance-type c7a.16xlarge`. `aws` is already installed.
3. **Modal**: `uv tool install modal`, `modal setup`. Needed anyway for the zero-cost GPU test route. Verify the maximum `cpu=` it will accept for one function before relying on 32 cores.
4. **Thunder** for 80 GB training days: `tnr` CLI, card on file.
5. **Oracle**: create the account only if an arm64 build of the DP is cheap to make. Create the account early; capacity and card checks take time.

Do not set up RunPod, TensorDock or Lambda until a job needs them.

## Could not verify

- **Vast.ai CPU-only offers** at $0.010-0.013/h for 128-384 cores showed up with `num_gpus=0` and `cpu_ram=0`; the API does not say how RAM and cores are billed, so I did not count them. Worth one real rental to learn if it is a pure CPU product.
- **Vast "cores effective"** is a share of the host's threads proportional to the GPU share. Check real `nproc` and a short benchmark on arrival.
- **RunPod tier**: the page toggles Community vs Secure and the extractor lost which one is shown. Aug 2026 third-party card had A100 PCIe 80GB Secure at $1.39; the page today shows $1.79, so prices moved or the tier differs. RunPod spot and CPU pod rates are not published.
- **Hetzner**: ID check and default server limits for a new non-EU account, and whether CCX63 has stock. Second source for hourly rounding is a third-party site.
- **Latitude.sh, Vultr, TensorDock, Hyperbolic spot**: pages needed a browser. TensorDock's public host-node API returned nothing today, so its stock is unknown. Hyperbolic H100 $3.19 is its own page.
- **Modal** maximum CPU request per function.
- **Oracle**: how often A1 capacity is available in practice, whether a non-US card passes, per-second billing granularity (third-party memory).
- **AWS Free plan** limits on large instances, default spot quota of a brand-new account, Azure trial terms.
- **Salad** vCPU cap comes from 2024 docs.
- **Colab** units per hour are one blogger's measurement (Mar 2026), Google publishes none.
- **Scaleway and OVH** billing granularity (per hour or per minute).
- EUR to USD uses Hetzner's own ratio on the same page (about 1.18).

## Related

- [[llm-providers-credits]] for model API credits (Modal $25K, Vast and RunPod mentioned there are older numbers)
- [[infra-two-tools]] for where the products themselves run (Cloudflare by default, nothing on Hetzner)
