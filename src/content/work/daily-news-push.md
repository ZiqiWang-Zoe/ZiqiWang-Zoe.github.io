---
title: IC News Daily, a Newsletter I Built for an IC Lab
summary: A daily semiconductor newsletter for Futurewei's IC lab. I choose what it covers, and an AI pipeline I built with Claude Code and Codex collects, selects and sends it every morning.
metric: "40"
metricLabel: subscribers, with an open rate above 97%
org: Futurewei Technologies
period: "2026"
role: Editor and builder
order: 1
featured: true
wide: true
tint: blue
cover: ../../assets/work/news-email.png
coverAlt: A sample issue of IC News Daily, with company branding removed
status: draft
todo:
  - "How the 97% open rate is measured (read receipts, tracking or estimate), for interviews"
---

## At a Glance

- **What:** a daily email newsletter of 6 to 8 semiconductor and AI-infrastructure stories.
- **Who reads it:** 40 subscribers in Futurewei's IC lab.
- **My role:** editor and builder. I decide what belongs in it, and I built the pipeline that produces and sends it.
- **Track record:** sent every day since July 1, 2026, with an open rate above 97%.

[Read a sample issue](/work/news-email-sample.html) (company branding removed)

## The Editorial Idea

Part of my job is reading 30+ industry-news items a week for market insight reports. IC News Daily turns that reading into a short morning newsletter for the lab.

Each issue opens with an **Editor's pick**, then a short list of stories. Every story gets a source, a date, a headline and a one- or two-sentence summary. The October 10 issue, for example, covered GPU supply, the cost of powering data centers, AI startup funding and a Senate probe into data-center subsidies.

## How the Pipeline Works

I used **Claude Code** and **Codex** to build the pipeline, which runs on its own every morning:

1. **Collect.** Python scripts pull new articles from RSS feeds and trade sites, with full-text extraction when a page allows it.
2. **Select.** An AI research pass reads the candidates against the editorial criteria I wrote and picks 6 to 8 stories, with a short summary for each.
3. **Format.** The pipeline renders the issue as an HTML email with consistent thumbnails that display correctly in Outlook.
4. **Send.** It goes out through Outlook to the subscriber list. Readers join or leave by sending an email with a tag in the subject.

## Keeping It Reliable

Three problems came up in the first weeks, and each one led to a fix. Outlook sometimes reported a send while the issue was still in the Outbox, so a run now counts as sent only after the message reaches Sent Items. A reworded AI summary once set off a false failure alert, so the success check now reads the mailbox state. A test mode limits recipients to approved addresses, which lets me try changes safely.

## What I Would Measure Next

Opens and clicks per story, to learn which topics the lab actually reads and tune the editorial criteria around them.
