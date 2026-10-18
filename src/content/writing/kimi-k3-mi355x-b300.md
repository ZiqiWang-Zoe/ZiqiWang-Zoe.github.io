---
title: "Kimi K3 on AMD MI355X and NVIDIA B300: What the Benchmark Measured"
summary: "Two GPUs with matching memory specs, a 24% throughput gap, and the software work behind it"
date: 2026-10-18
# draft: shown only in local dev (npm run dev). Change to published to put it on the live site.
status: published
# The same post on beehiiv, once it is up. Leave empty until then.
beehiiv: ""
---
![Three bar charts. Peak dense 4-bit math: AMD MI355X 10.1 petaflops, NVIDIA B300 13.5. Total tokens per second per GPU at 50 tokens per second per user: AMD 7,567, NVIDIA 6,083. Total tokens per modeled dollar: AMD 18.2 million, NVIDIA 9.7 million.](./kimi-k3-figure.png)

*The B300 has more peak math, and the MI355X served more tokens in this benchmark. Data: AMD and Embedded LLM on the vLLM blog, from SemiAnalysis InferenceX (retrieved October 9, 2026). Chart by Silicon to Serving.*

On October 16, two posts on the vLLM blog described the same open model running on rival hardware. AMD and Embedded LLM reported that eight AMD Instinct MI355X GPUs served Moonshot AI's Kimi K3 at about 7,567 tokens per second per GPU. Eight NVIDIA HGX B300 GPUs served about 6,083. That is 24% more total throughput from the AMD system, counting both input and generated tokens. The same day, an NVIDIA engineer described how coding agents helped write faster Kimi K3 kernels for NVIDIA's rack-scale GB300 platform.

Two things frame the result. AMD and NVIDIA submitted their runs to SemiAnalysis's public InferenceX benchmark. The comparison targets one service level: 50 tokens per second per user. This post covers what the benchmark measured, why two chips with matching memory specs produced different results, and what that means for people who build, buy or sell inference. It ends with the research the work builds on.

## What Was Measured

The numbers come from vendor-submitted runs published through InferenceX, a public inference benchmark from the research firm SemiAnalysis. The workload, called AgentX, replays real coding-agent sessions with synthetic text. It keeps each session's request lengths, timing and repeated context. Coding agents resend much of the same context on every turn, so with unlimited cache, more than 96% of the prompt text could in theory be reused.

The service level comes from the time between tokens: the 90th-percentile gap is one fiftieth of a second, or 50 tokens per second per user. The measure leaves out the wait for the first token. At that service level, the post reports total tokens per second for each GPU.

| | AMD MI355X | NVIDIA HGX B300 |
|---|---|---|
| GPUs, and how the model is split | 8, with eight-way tensor parallelism (TP8) | 8, with eight-way tensor parallelism (TP8) |
| Number formats | 4-bit weights (MXFP4), 8-bit KV cache | 4-bit weights (FP4), 8-bit KV cache |
| Published dense 4-bit math peak | 10.1 petaflops (MXFP4) | 13.5 petaflops (FP4) |
| Memory | 288 GB HBM3E, 8 TB/s peak | 288 GB HBM3E, 8 TB/s peak |
| Configured host-memory cache budget | 224.875 GB per GPU | 281 GB per GPU |
| Submission date | September 30, 2026 | August 16, 2026 |
| Total tokens per second per GPU at 50 tokens/s/user | about 7,567 | about 6,083 |

Two details matter when reading the last row. The post interpolates between published runs to compare both systems at exactly 50 tokens per second. The runs on either side can differ in load, cache settings and drafting depth. AMD and its partners wrote the comparison, and the post links every configuration.

## Two Chips with Matching Memory Specs

On paper, the B300 has more compute: 13.5 petaflops of dense FP4 math, against 10.1 for the MI355X. The two GPUs list the same memory: 288 GB of HBM3E, the stacked memory next to the chip, with a peak bandwidth of 8 TB per second.

Serving a language model has two phases. Prefill processes the prompt tokens that are not already cached, all in parallel, and often keeps the math units busy. Decode then produces the answer one token at a time. For every new token, the GPU reads the active weights and the stored context of the conversation, called the KV cache, from memory. At the small batch sizes that fast per-user speeds require, these memory reads often limit decode more than math does.

Matching peak specs still leave three things open. Real kernels reach different shares of peak bandwidth, the eight GPUs exchange data over different links, and the software takes a different number of steps to produce each token. Software shapes all three.

## What the Software Changed

Kimi K3 is a mixture-of-experts model: for each token, a router picks 16 of its 896 expert sub-networks, so only a small part of the model runs per token. Its attention layers come in two kinds. Twenty-four layers use multi-head latent attention (MLA), which stores a compressed history that grows with the conversation. Sixty-nine layers use Kimi Delta Attention (KDA), a linear attention that keeps a fixed-size state.

The AMD post lists more than a dozen changes to vLLM. Four of them show the main ideas.

**Spreading the history across GPUs.** With the model split eight ways, each GPU still kept a full copy of the MLA history. The team changed this so each GPU holds one eighth of the cached positions, and the GPUs combine their partial attention results. For a 142,000-token conversation, the post estimates that the MLA history per GPU falls from 1.96 GB to 245 MB, before allocation overhead. The freed memory can hold more conversations at once.

**Keeping old context in host memory.** When a coding agent returns to a session, recomputing its long history is expensive. When reusable state no longer fits in GPU memory, vLLM can keep MLA history and KDA checkpoints in the server's CPU memory and copy them back when the session resumes.

**Faster kernels.** One change padded MLA's 12 query heads per GPU to 16 so the work could use AMD's hand-tuned assembly kernels. The post tested it with one user, 32,000 input tokens and 1,000 output tokens, without the history split or speculative decoding. The average time per output token fell from 43.8 to 23.6 milliseconds. Other changes fused several small kernels into one, which matters because each kernel launch costs a few microseconds.

**Speculative decoding.** A cheap draft step proposes several tokens, and the full model checks them all in one pass. The AMD setup drafted three to seven tokens in some runs and turned drafting off in the higher-load runs that spread the history across all eight GPUs.

The cost model widens the gap. SemiAnalysis's total-cost-of-ownership model assigns $1.50 per MI355X GPU-hour and $2.26 per B300 GPU-hour. At the reported throughput, that works out to about 87% more total tokens per modeled dollar for AMD. Some of the model's capital and utilization assumptions are not published.

## NVIDIA's Side of the Same Day

The NVIDIA post, by Benjamin Chislett, runs Kimi K3 on B300 GPUs inside the rack-scale GB300 platform. The comparison above used the eight-GPU HGX B300 server, and this work is not part of it.

The post describes a decode path in which most operations run as custom kernels written in CuTe DSL, NVIDIA's Python language for GPU kernels. Coding agents helped write the kernels, fuse operations together and tune settings. In the post's timeline of one layer, stock vLLM ran 23 kernels in 130 microseconds, and the new path ran 13 kernels in 69 microseconds. Without speculative decoding, decode ran 1.3 to 1.9 times faster, depending on batch size and on whether the model ran on 8 or 16 GPUs.

Chislett devotes a full section to validation. Kernel tests check the numbers. Full-model evaluations with long contexts check that the answers stay correct. The long-context evaluations found numerical problems in attention and communication kernels that the standalone tests had missed. The author writes that agent-optimized code is now arriving faster than people can review it. The proposed answer is for agents to supply tests, evaluations and the conditions under which each change works, while people judge the design and the evidence.

## What It Means

**For people who build inference systems.** Both posts treat memory traffic as central, from different directions. AMD focuses on where the KV cache lives and how it moves between GPUs and host memory. NVIDIA focuses on fusing kernels, overlapping communication with compute and prefetching weights. On this model and benchmark, the AMD system came out ahead despite less peak compute, and its post credits the software work.

**For people who buy it.** A hardware ranking is a snapshot of hardware plus a software version. The two results here were submitted six weeks apart, and both engines keep improving. Cost per token is worth measuring on your own workload, at the per-user speed your product needs, with the engine version you plan to run. Host memory and GPU-to-GPU bandwidth belong in that evaluation too, since both posts lean on them.

**For people who market it.** Peak petaflops and peak memory bandwidth did not predict this result. Equal HBM specs say little about achieved bandwidth, the links between GPUs, power or the cost of the whole system. The benchmark that carried the story compared tokens per modeled dollar at a fixed per-user speed, on replayed agent sessions. Buyers can check that kind of claim against their own workloads.

## Related Research

- **[DeepSeek-V2](https://arxiv.org/abs/2405.04434) (2024)** introduced multi-head latent attention, which compresses the KV cache into a smaller latent vector. DeepSeek-V2 reports a KV cache 93.3% smaller than DeepSeek 67B's. Kimi K3's MLA layers use this design.
- **[Kimi Linear](https://arxiv.org/abs/2510.26692) (2025)** introduced Kimi Delta Attention and mixed it with MLA. It reports up to 75% less KV cache and up to six times the decoding throughput at a one-million-token context.
- **[Leviathan et al., Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192) (ICML 2023)** showed that a small model can draft tokens for a large model to verify in parallel without changing the output distribution. It reports two to three times faster generation on T5-XXL.
- **[ThunderKittens](https://arxiv.org/abs/2410.20399) (2024)** showed that a few tile-level building blocks make fast GPU kernels much simpler to write, matching cuBLAS and FlashAttention-3. It is related background on tile-level GPU programming; the NVIDIA post does not cite it.

## Sources

- AMD and Embedded LLM, [Scaling Kimi K3 on AMD Instinct MI355X: Matching NVIDIA HGX B300 Throughput per GPU on AgentX](https://vllm.ai/blog/2026-10-16-kimi-k3-mi355x), vLLM blog, October 16, 2026. Data from SemiAnalysis InferenceX, retrieved October 9, 2026.
- Benjamin Chislett, [Hyper Optimizing Kimi K3 in vLLM: Moving Fast and Responsibly](https://vllm.ai/blog/2026-10-16-kimi-k3-megakernel), vLLM blog, October 16, 2026.
