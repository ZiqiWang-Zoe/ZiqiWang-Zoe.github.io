---
title: How an AI system decides which sources to trust
summary: "L-MARS, a multi-agent legal research system with a citation-faithfulness audit. The same question answer engines face when they pick what to cite."
metric: "200"
metricLabel: legal questions in the evaluation benchmark
org: ICML 2026 AI4Law workshop
period: "2026"
role: Co-author
order: 4
featured: true
status: draft
todo:
  - "Confirm authorship: co-author or co-first author"
  - "Ziqi's own contribution to the paper, in one or two sentences"
  - A figure from the paper (system diagram) as the cover image
  - "Ziqi to confirm the 'Why a marketer worked on this' section in her own words"
---

## The paper

**L-MARS** is a multi-agent system for legal question answering. Instead of answering from memory, it searches across different kinds of sources (web search, a local document index, and CourtListener case law), then a judge agent checks whether the evidence is sufficient, from the right jurisdiction, and still current before an answer is allowed through. If not, it searches again.

On a benchmark of 200 legal questions, this loop improved factual accuracy and the preference scores given by human experts and LLM judges.

[Read it on arXiv](https://arxiv.org/abs/2509.00761)

## Why a marketer worked on this

ChatGPT, Perplexity, Claude and Google's AI Overviews now answer many of the questions buyers used to search for. Each of them runs some version of the loop above: retrieve, judge which sources are credible, cite a few.

That makes "which sources does the model trust, and why" a marketing question. It decides whether a company's own pages are cited, or a competitor's comparison post is. Working on L-MARS gave me a working model of that selection step, which is the starting point for answer engine optimization (AEO).

The [AEO teardown](/work/aeo-teardown/) applies this to real AI companies.
