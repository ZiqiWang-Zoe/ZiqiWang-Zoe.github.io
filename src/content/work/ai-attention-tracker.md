---
title: AI Attention Tracker, a Daily Dashboard of AI Topic Trends
summary: I built an automated dashboard in Python and SQL that shows which AI topics are gaining ground with developers, researchers and model builders, so a marketer can see where interest is moving.
metric: "2.6M"
metricLabel: stories, papers and models analyzed, refreshed every morning
org: Independent project
period: "2026"
role: Sole analyst and builder
order: 1.5
featured: true
wide: true
tint: gray
cover: ../../assets/work/attention-tracker.png
coverAlt: The dashboard's summary tiles and its chart of AI topics rising on Hacker News in the last 30 days
coverFit: cover
status: ready
---

**[Open the live dashboard](https://ziqiwang-zoe.github.io/ai-attention-tracker/)** · [Code and data on GitHub](https://github.com/ZiqiWang-Zoe/ai-attention-tracker)

## What I Built

A public dashboard that tracks 59 AI topics across three places where AI work shows up first: Hacker News (what developers discuss), Hugging Face's daily papers (what researchers publish) and the Hugging Face Hub (what model builders release). Every morning it collects the previous day's data, updates the numbers and publishes a new snapshot.

## My Contribution

- **Framed the question and the metric.** Each topic is measured as a share of everything posted on that source, so the growth of the source itself doesn't look like growth in a topic.
- **Defined the 59 topics** and the keyword rules behind them, including competing terms such as "open weights" and "open source".
- **Wrote the data collection** in Python against the Hacker News and Hugging Face APIs: about 2.6 million items since January 2025.
- **Wrote the analysis in SQL** (DuckDB): monthly share by topic and a ranked list of rising topics.
- **Designed and built the dashboard**, including the charts, topic comparison and the evidence links behind each number.
- **Automated the daily refresh**, with an AI review step that checks the numbers before anything goes live.

I used Claude Code and Codex as coding assistants throughout.

**Skills shown:** Python, SQL, API data collection, data quality checks, dashboard design, automation and turning data into marketing recommendations.

## Key Finding

When the dashboard first went live (data through October 17, 2026), one topic was gaining share on all three sources at once: **computer and browser use**, AI that operates a browser or desktop for you. Its share was up 1.6x on Hacker News, 1.9x in research papers and 2.1x among model uploaders, and the rise was spread across many days rather than one spike.

Over the longer run, agents went from 11% to 34% of featured research papers between early 2025 and the third quarter of 2026.

## What a Marketer Could Do With It

- **If you market an agent or automation product to developers,** computer use is a theme developers, researchers and model builders are all moving toward right now, so one message can serve all three audiences.
- **What to check first:** search interest and your own pipeline. This data measures what people post and build, not what customers buy.

The dashboard writes suggestions like these from the latest numbers every day, and labels them as leads to check rather than conclusions.

## How I Checked the Data

Before each update goes live, Codex reviews the new numbers for broken collection, one-day spikes and bad keyword matches. Its first reviews caught five problems, which I fixed before launch. One example: model tags containing "perplexity", an evaluation metric, were being counted as Perplexity, the AI search company. I added an exclude rule and re-ran the full history, and AI search dropped out of the list of rising topics for models, where it had been ranked first.

## What the Dashboard Lets You Do

- **Check the evidence.** Click any rising topic to see the most-upvoted stories, papers or models behind it, with links. Mistral's jump on Hacker News, for example, traces back to the Mistral Large 4 launch.
- **Compare words.** Put up to three topics side by side for any range of months. "Open weights" has been gaining on "open source" across all three sources, which matters for anyone positioning an AI model.
- **See how the list moved.** Every day's rankings are saved, so you can go back and see what was new.

## Limits

This measures activity, what people post, publish and release, not customer demand. Keyword matching misses items that never use the keywords and catches some that use them in another sense. Hacker News titles are short, so every topic is undercounted there. A rising share says more people wrote or built around a topic, not why.
