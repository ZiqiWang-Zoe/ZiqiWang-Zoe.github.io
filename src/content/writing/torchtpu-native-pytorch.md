---
title: "Google's TorchTPU Launch: The Claim, the Proof and What Buyers Should Check"
summary: "A launch teardown: how Google pitched native PyTorch on TPUs, what AWS announced that week, and how far the evidence goes"
date: 2026-10-26
# draft: shown only in local dev (npm run dev). Change to published to put it on the live site.
status: published
# The same post on beehiiv, once it is up. Leave empty until then.
beehiiv: ""
---
**TL;DR**

- Google says PyTorch code now runs on its TPU chips "out of the box." Moving a model can be as simple as changing `"cuda"` to `"tpu"`.
- The proof is strong on compatibility: 4,917 popular models tested, with 98% running without a crash. The speed numbers come from tuned setups.
- AWS made the same pitch for its Trainium chips that week. Buyers should test their own models and count the tuning work before comparing prices.

![Bar chart of time per training step for a FLUX model on TorchTPU. Out of the box in eager mode: 11.49 seconds. Adding DeferAndFuse eager mode: 9.95 seconds, 1.15 times faster. Adding SimpleFSDP sharding: 6.52 seconds, 1.76 times. Adding a Pallas attention kernel: 5.55 seconds, 2.07 times. Adding torch.compile: 3.02 seconds, 3.80 times. Adding peephole rewrites: 2.78 seconds, 4.13 times faster than the first row.](./torchtpu-figure.png)

*The model ran out of the box, and it ran about four times faster after five added changes. Data: TorchTPU team, [Introducing TorchTPU](https://pytorch.org/blog/introducing-torchtpu/), PyTorch blog, October 20, 2026. Chart by Silicon to Serving.*

## What Happened

On October 20, at PyTorch Conference North America in San Jose, Google released TorchTPU as open source. PyTorch is a widely used software framework for building AI models. TPUs are Google's own AI chips, offered through Google Cloud. TorchTPU lets PyTorch treat a TPU like any other device.

The [PyTorch blog post](https://pytorch.org/blog/introducing-torchtpu/) calls it "an open source collaboration between Google and Meta," the company that started PyTorch. Google first described the project [in April](https://developers.googleblog.com/torchtpu-running-pytorch-natively-on-tpus-at-google-scale/). The October release made the code public, with a 0.2.0 package on PyPI.

Also on October 20, [vLLM](https://vllm.ai/blog/2026-10-20-vllm-torchtpu), the popular open-source software for serving AI models, and [Hugging Face](https://huggingface.co/blog/hf-torchtpu), a popular hub for open models, published their own TorchTPU integrations. The same day, AWS opened a public beta of [TorchNeuron](https://pytorch.org/blog/introducing-torchneuron-native-pytorch-backend-for-aws-trainium/), the same kind of software for its Trainium chips.

## The Positioning Story

**Google leads with switching cost.** The post's headline promise is that "porting a workload to TPU should be as simple as changing `model.to("cuda")` to `model.to("tpu")`." Most AI code is written for NVIDIA GPUs, whose software is called CUDA. The pitch speaks to that habit. It also names the problems of Google's earlier tool, PyTorch/XLA: required code changes, slow compiles and no support for PyTorch's normal step-by-step mode. The [TorchTPU FAQ](https://torchtpu.readthedocs.io/en/0.2.0/faq/) now says PyTorch/XLA "is deprecated and replaced by TorchTPU."

**Proof by coverage.** The post tested 4,917 popular open models from Hugging Face, and 98% ran without crashing. A second test covered 657 models from more than 500 model families, and 97% matched GPU results within set tolerances. The post states both bars, "no crash" and "numerical parity," next to each count.

**Partners carry part of the message.** Inferact, a company founded by vLLM's creators, wrote the vLLM post with Google. Hugging Face said its older TPU add-on, Optimum TPU, is no longer needed for its main libraries. It also wrote that "it's not all green yet": 96.5% of its library tests that run on TPU pass. Our reading: posts from these partners tell developers the support reaches the tools they already use.

**AWS published the same pitch that week.** TorchNeuron runs PyTorch on Trainium2 and Trainium3 chips with `.to('neuron')`. Hugging Face reports that 89% of the 100 most-used text-generation architectures run out of the box, against 46% with its older Optimum Neuron tool. Hugging Face says both backends replace older integrations built on PyTorch/XLA. Neither launch post mentions the other.

| | Google TorchTPU | AWS TorchNeuron |
|---|---|---|
| The one-line change | `.to("tpu")` | `.to('neuron')` |
| Chips | TPU v5e, v5p, v6e and v7x | Trainium2 and Trainium3 |
| Headline coverage claim | 98% of 4,917 popular models run without a crash (Google's test) | 89% of the 100 most-used text-generation architectures (Hugging Face's count) |
| Release status | Open source, version 0.2.0 | Open source, public beta from October 20 |
| License | Apache 2.0 | Apache 2.0 |
| Custom kernels in | Pallas (from JAX) | NKI, AWS's kernel interface |

The two coverage numbers use different tests and denominators, so they cannot be ranked against each other.

## The Marketing Lens

| | Google's TorchTPU launch |
|---|---|
| **Claim** | "Existing PyTorch workloads run out of the box with trivial code changes," with "industry-competitive" speed. The data supports the first part well. |
| **Metric chosen** | Model coverage (share of models that run, share that match GPU results), then MFU (model FLOPs utilization): the math the model needs per second, divided by the chip's peak math rate. The post compares training speed with Google's own JAX stack. The post runs no speed test against NVIDIA GPUs; that comparison comes from SemiAnalysis. |
| **Proof** | Large published test counts, linked code, a public package, and integrations from vLLM and Hugging Face. Inference cost results come from the SemiAnalysis InferenceX benchmark. The newest cost claims are Google's own AgentX submissions. |
| **Likely audience** | Our reading: PyTorch teams who have looked at TPU prices but did not want to rewrite their code. |
| **Competitor's message that week** | AWS's TorchNeuron offers the same one-line change for Trainium, with its own coverage count. It does not compare against TPUs. |
| **Caveats the post states** | A one-line change will not reach peak speed. FlexAttention, a PyTorch attention feature, is not yet supported. One TPU serves one process, so some reinforcement-learning setups do not work yet. |
| **Verdict** | Strong evidence that PyTorch code now runs on TPUs. Thinner evidence on speed and cost: the TorchTPU team reports the training numbers, SemiAnalysis tested an early version of the serving stack, and Google submitted the newer AgentX results. |

## What Buyers Should Check

- **Test your own models.** Include custom layers. FlexAttention is not yet supported, and running without a crash says nothing about speed.
- **Which TPU you will get.** vLLM's TPU backend recommends TPU v7x (Ironwood) and tests it on every change. The launch post calls v6e, v5e and v5p experimental.
- **Your serving setup.** SemiAnalysis's cost lead for TPU was in FP8, with prefill and decode on the same chips. NVIDIA led in FP4 and in split prefill and decode on GB300 racks.
- **The tuning budget.** The FLUX example needed sharding, a custom kernel and compilation to run four times faster. Ask what tuning sits behind any quoted speed.

## What Marketers Can Take from It

- **Name the old problem plainly, then retire it.** The post lists its own predecessor's flaws, and the FAQ deprecates it. Users who gave up on PyTorch/XLA get a clear reason to try again.
- **Answer the buyer's first doubt first.** The post answers "will my code run?" with coverage counts before it gets to speed. Each count names its bar (no crash, or matching GPU results) and its denominator, so readers can check it.
- **Put the limit next to the promise.** The post qualifies its one-line promise in the same bullet: the change runs the model, and peak speed takes more work.

## Under the Hood

This section is for readers who want the technical detail.

**What "native" means.** TorchTPU plugs into PrivateUse1, PyTorch's official slot for new hardware. Code sees an ordinary PyTorch tensor on a device called "tpu." Underneath, Google's XLA compiler turns the work into TPU programs. Tuned paths still use TPU-specific kernels written in Pallas, a language for custom chip code. SemiAnalysis [puts it this way](https://newsletter.semianalysis.com/p/tpu-inferencex-full-steam): native covers PyTorch's tensors, dispatch and APIs, while "XLA remains the compiler."

**Three ways to run.** Strict eager mode sends one operation at a time, as PyTorch does on GPUs. Debug mode does the same but waits after each one. DeferAndFuse mode groups several operations into one chunk. The post says it "can be 50% or more faster than Strict Eager." For full speed, `torch.compile` hands the whole model graph to XLA.

**Known limits.** XLA expects tensor shapes to be fixed before running, so a new shape can mean a new compile. TorchTPU is adding "bounded dynamism," where only a maximum size is fixed; it gave correct results on 834 of 839 language models tested. A TPU can be used by only one process, which blocks running training and sampling on the same chips for reinforcement learning. vLLM notes that the first startup "can take a few minutes" while it compiles.

**Speed on plain PyTorch code.** The team wrote a 30-billion-parameter model, Muse Glimmer 30B, using only standard PyTorch parts. The results below are from the post; MFU is the model's math per second divided by the chip's peak rate.

| Test | Chips | Sequence length | Result |
|---|---|---|---|
| Prefill (reading the prompt), team's own code | 1 TPU v7 | 5,120 tokens | about 25,700 tokens/s, 59% MFU |
| Training, team's own code | 4 TPU v7 | 5,120 tokens | about 5,600 tokens/s per chip, 38% MFU |
| Training, TorchTitan's GPU code, lightly adapted | 4 TPU v7 | 5,120 tokens | about 5,300 tokens/s per chip, 36% MFU |

The adapted version swapped FlexAttention for standard attention and added `torch.compile` and SimpleFSDP sharding. TorchTitan is PyTorch's reference training library.

**Against Google's own JAX stack.** On 64 TPU v7 chips, TorchTitan on TorchTPU trained the Qwen3 235B mixture-of-experts model at 1,828 tokens per second. JAX with MaxText, Google's established TPU stack, reached 1,937. The post does not say whether these are totals or per-chip rates. A mixture-of-experts model sends each token to a few of many sub-networks. The post calls this "an initial smoke test."

**Scaling to a pod.** The same model trained on 1,024 to 8,192 TPU v7 chips, in BF16 at a sequence length of 4,096. MFU moved from 28.8% to 27.1%, and tokens per second per core from 2,236 to 2,104. The post credits XLA for hiding the communication between chip groups behind computation.

**Inference cost.** The cost claims rest on SemiAnalysis InferenceX, a public serving benchmark. In September, SemiAnalysis tested an early, private-beta version of the TorchTPU vLLM stack, serving Qwen3.5 397B. Its article reported "up to 50% better performance per dollar" for Ironwood than NVIDIA B200 and B300, using modeled costs and FP8 (8-bit numbers). Each system read prompts (prefill) and wrote answers (decode) on the same chips. The same article lists limits. NVIDIA "still maintains the lead" in FP4 (4-bit), because TPU v7 has no native FP4 math. GB300 NVL72 racks with prefill and decode on separate GPUs held about a 30% performance-per-dollar advantage in the middle of the latency range. At 256 concurrent requests, TPU's average wait for the first token was 5.41 seconds, against 2.40 for B300. The PyTorch post adds newer AgentX cost results that Google submitted. Those figures do not appear in the September article.

**Kernels in the serving stack.** The vLLM backend uses Pallas kernels for attention, mixture-of-experts and quantized math. Its attention kernels include multi-head latent attention, an attention design used by DeepSeek and Kimi models that compresses the saved conversation state. The PyTorch post describes one fix: in prefill-heavy steps with 256 requests at once, a reduce-scatter step, which combines results across chips, took 22% of device time. The team rewrote the expert layer as one program.

## Further Reading

- **The project:** Google's [April introduction of TorchTPU](https://developers.googleblog.com/torchtpu-running-pytorch-natively-on-tpus-at-google-scale/) and the [torch_tpu repository](https://github.com/google-pytorch/torch_tpu).
- **The serving stack:** Inferact and Google, [Introducing vLLM TorchTPU](https://vllm.ai/blog/2026-10-20-vllm-torchtpu), with its supported-models list and roadmap.
- **The benchmark:** SemiAnalysis, [TPU Inference Externalization Full Steam Ahead](https://newsletter.semianalysis.com/p/tpu-inferencex-full-steam), September 7, 2026, and the live [InferenceX](https://inferencex.semianalysis.com/) results.
- **The same-day rival launch:** AWS, [Introducing TorchNeuron](https://pytorch.org/blog/introducing-torchneuron-native-pytorch-backend-for-aws-trainium/), and Hugging Face, [TorchNeuron: running HF models on AWS Trainium](https://huggingface.co/blog/hf-torchneuron).

## Sources

- The TorchTPU Team, [Introducing TorchTPU](https://pytorch.org/blog/introducing-torchtpu/), PyTorch blog, October 20, 2026.
- Claudio Basile, Kat Ko and others (Google), [TorchTPU: Running PyTorch Natively on TPUs at Google Scale](https://developers.googleblog.com/torchtpu-running-pytorch-natively-on-tpus-at-google-scale/), Google Developers Blog, April 7, 2026.
- Inferact and Google teams, [Introducing vLLM TorchTPU](https://vllm.ai/blog/2026-10-20-vllm-torchtpu), vLLM blog, October 20, 2026.
- Alvaro Moran, Jingya Huang, Simon Pagezy, Jeff Boudier, Régis Pierrard and others (Hugging Face), [Hugging Face ❤️ TorchTPU: TPUs, Natively](https://huggingface.co/blog/hf-torchtpu), October 20, 2026.
- AWS, [Introducing TorchNeuron](https://pytorch.org/blog/introducing-torchneuron-native-pytorch-backend-for-aws-trainium/), PyTorch blog, October 2026, and Hugging Face, [TorchNeuron: running HF models on AWS Trainium is easier than ever](https://huggingface.co/blog/hf-torchneuron), October 19, 2026.
- Alec Ibarra, Cam Quilici, Bryan Shan and others (SemiAnalysis), [TPU Inference Externalization Full Steam Ahead](https://newsletter.semianalysis.com/p/tpu-inferencex-full-steam), September 7, 2026.
