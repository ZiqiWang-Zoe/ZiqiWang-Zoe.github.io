---
title: How an AI system decides which sources to trust
summary: "L-MARS, a multi-agent legal question-answering system audited claim by claim against its cited sources. The same question answer engines face when they pick what to cite."
metric: 34% → 13%
metricLabel: answers with no citation, naive RAG vs. the judge loop
org: ICML 2026 AI4Law workshop
period: "2026"
role: Co-first author. Data collection, agent harness design, paper writing
order: 2
featured: true
wide: true
tint: gray
cover: ../../assets/work/l-mars-workflow.png
coverFit: cover
coverAlt: The L-MARS system, from the paper. Query, search, judge and summary agents share evidence with provenance
paper:
  title: "L-MARS: Legal Multi-Agent System with Agentic Search and Citation-Faithfulness Audit"
  authors: Boqin Yuan, Ziqi Wang (co-first authors)
  venue: ICML 2026, AI4Law Workshop
status: draft
todo:
  - "Ziqi to confirm the 'Why a marketer worked on this' section in her own words"
---

## The paper

[**L-MARS: Legal Multi-Agent System with Agentic Search and Citation-Faithfulness Audit**](https://arxiv.org/abs/2509.00761), by Boqin Yuan and Ziqi Wang (co-first authors). Accepted at the AI4Law Workshop at ICML 2026.

**My part:** I collected the data, designed the agent harness, and co-wrote the paper.

Legal AI is usually scored on multiple-choice accuracy. That misses a common failure: whether the source attached to an answer exists, and whether it supports the rule the system attributes to it. L-MARS searches for evidence, lets a judge agent check it over several turns, and is then audited claim by claim against what it cited.

On a 100-question Bar Exam audit:

| | Naive RAG | L-MARS judge loop |
|---|---|---|
| Strict citation F1 | 0.13 | 0.25 |
| Answers with no citation | 34% | 13% |

Retrieval alone barely moved accuracy. The gain came from checking sources before answering.

## Why a marketer worked on this

ChatGPT, Perplexity, Claude and Google's AI Overviews now answer many of the questions buyers used to search for. Each of them runs some version of the same loop: retrieve, judge which sources are credible, cite a few.

That makes "which sources does the model trust, and why" a marketing question. It decides whether a company's own pages are cited, or a competitor's comparison post is. Working on L-MARS gave me a working model of that selection step, which is the starting point for answer engine optimization (AEO).
