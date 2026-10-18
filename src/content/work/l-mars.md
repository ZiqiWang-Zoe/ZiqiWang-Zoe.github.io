---
title: How an AI System Checks the Sources Behind Its Answers
summary: "L-MARS is a multi-agent legal question-answering system with an audit that checks each claim against its cited sources. Answer engines face similar citation decisions."
metric: 34% → 13%
metricLabel: of claims with no citation, naive RAG vs. the judge loop
org: ICML 2026 AI4Law workshop
period: "2026"
role: Co-first author. Data collection, agent harness design, paper writing
order: 2
featured: true
wide: true
tint: gray
cover: ../../assets/work/l-mars-workflow.png
coverFit: cover
coverAlt: The L-MARS system from the paper. Query, search, judge and summary agents share evidence with source details
paper:
  title: "L-MARS: Legal Multi-Agent System with Agentic Search and Citation-Faithfulness Audit"
  authors: Boqin Yuan, Ziqi Wang (co-first authors)
  venue: ICML 2026, AI4Law Workshop
status: ready
---

## The Paper

[**L-MARS: Legal Multi-Agent System with Agentic Search and Citation-Faithfulness Audit**](https://arxiv.org/abs/2509.00761), by Boqin Yuan and Ziqi Wang (co-first authors). Accepted at the AI4Law Workshop at ICML 2026.

**My part:** I collected the data, designed the agent harness, and co-wrote the paper.

The paper notes that legal AI is usually scored on multiple-choice accuracy. That score misses a common failure: an answer may cite a source that does not exist or does not support the rule attributed to it. L-MARS searches for evidence and uses a judge agent to check it over several turns. The final audit compares each claim with its cited source.

On a 100-question Bar Exam audit:

| | Naive RAG | L-MARS judge loop |
|---|---|---|
| Strict citation F1 | 0.13 | 0.25 |
| Claims with no citation | 34% | 13% |

Retrieval alone barely moved accuracy. The citation gains came from the judge loop, which keeps searching when the first evidence is weak.

## Why It Matters for Marketing

ChatGPT, Perplexity, Claude and Google's AI Overviews also retrieve sources, judge them and cite a few. L-MARS studies a version of that step in a legal setting, which is why it connects to generative engine optimization (GEO).
