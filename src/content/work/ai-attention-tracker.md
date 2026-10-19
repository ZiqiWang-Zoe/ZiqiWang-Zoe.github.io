---
title: AI Attention Tracker, a Daily Market Signal Dashboard
summary: A live dashboard that tracks which AI topics are gaining share of attention on Hacker News and Hugging Face, rebuilt every morning from public data and checked by an AI reviewer before it goes live.
metric: "2.6M"
metricLabel: stories, papers and models tracked since January 2025
org: Independent project
period: "2026"
role: Analyst and builder
order: 1.5
featured: true
wide: true
tint: gray
cover: ../../assets/work/attention-tracker.png
coverAlt: Chart of AI topics rising on Hacker News in the last 30 days, comparing each topic's share with the 90 days before
coverFit: cover
status: ready
---

## At a Glance

- **The question:** where is attention in AI moving, and which audience notices first?
- **What it tracks:** every Hacker News story, every paper featured on Hugging Face, and every public model uploaded to the Hugging Face Hub, each day since January 1, 2025.
- **What it shows:** each topic's share of everything on that source, so growth in the source itself doesn't look like growth in a topic.
- **How often:** every morning, with each day's results saved so the history stays visible.

[Open the live dashboard](https://ziqiwang-zoe.github.io/ai-attention-tracker/) · [Code and data](https://github.com/ZiqiWang-Zoe/ai-attention-tracker)

## Why Share, Not Counts

Hacker News, Hugging Face papers and the Hub all grow over time, so raw counts rise for almost every topic. The dashboard divides each topic by the source's total for the same days. A topic counts as rising when its share in the last 30 days is higher than in the 90 days before.

## What the First Run Found

When the dashboard first went live (data through October 17, 2026), one topic was rising on all three sources at once: **computer and browser use**, AI that operates a browser or desktop for you. Its share was up 1.6x on Hacker News, 1.9x in research papers and 2.1x among model uploaders. Over the longer run, agents went from 11% to 34% of featured papers between early 2025 and the third quarter of 2026.

For a marketer, a topic rising with developers, researchers and model builders at the same time is one message that can work for all three audiences. A topic rising in papers but not yet on Hacker News is a chance to explain it before the developer crowd arrives.

## How It Works

1. **Collect.** Python scripts pull every item from the Hacker News and Hugging Face APIs each day, not only AI items, so the totals are honest.
2. **Match.** Each item is matched to 59 topics with keyword rules I wrote and keep refining. On Hacker News, generic topics such as "medical" only count when the title also mentions AI.
3. **Analyze.** SQL in DuckDB turns daily counts into monthly share of voice and a ranked list of rising topics.
4. **Check.** Before each update goes live, Codex reviews the new numbers for broken collection, one-day spikes and bad keyword matches. Its first two reviews caught five matching problems, which I fixed before launch.
5. **Publish.** The page rebuilds automatically and keeps a snapshot of every day's rankings.

## Limits I State on the Page

Keyword matching misses items that never use the keywords and catches some that use them in another sense. Hacker News titles are short, so every topic is undercounted there. A rising share says more people wrote or built around a topic, not why.
