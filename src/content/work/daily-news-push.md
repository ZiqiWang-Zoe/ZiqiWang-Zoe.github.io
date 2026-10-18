---
title: IC News Daily, a newsletter I built for an IC lab
summary: A daily semiconductor newsletter for Futurewei's IC lab. I set the editorial line, and an AI pipeline I built with Claude Code and Codex collects, selects and sends it every morning.
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
coverAlt: The October 10, 2026 issue of IC News Daily
status: draft
todo:
  - "How the 97% open rate is measured (read receipts, tracking or estimate), for interviews"
---

## At a glance

- **What:** a daily email newsletter of 6 to 8 semiconductor and AI-infrastructure stories.
- **Who reads it:** 40 subscribers in Futurewei's IC lab.
- **My role:** editor and builder. I decide what belongs in it, and I built the pipeline that produces and sends it.
- **Track record:** sent every day since July 1, 2026, with an open rate above 97%.

[Read the October 10, 2026 issue](/work/news-email-2026-10-10.html)

## The editorial idea

Part of my job is reading 30+ industry-news items a week for market insight reports. IC News Daily turns that reading into a short morning newsletter for the lab.

Each issue opens with an **Editor's pick**, then a short list of stories. Every story gets a source, a date, a headline and a one- or two-sentence summary. The October 10 issue, for example, covered GPU supply, the cost of powering data centers, AI startup funding and a Senate probe into data-center subsidies.

## How it is produced

I used **Claude Code** and **Codex** to build the pipeline, which runs on its own every morning:

1. **Collect.** Python scripts pull new articles from RSS feeds and trade sites, with full-text extraction when a page allows it.
2. **Select.** An AI research pass reads the candidates against the editorial criteria I wrote and picks 6 to 8 stories, with a short summary for each.
3. **Format.** The issue is rendered as an HTML email with consistent thumbnails that display correctly in Outlook.
4. **Send.** It goes out through Outlook to the subscriber list. Readers join or leave by sending an email with a tag in the subject.

## Keeping it reliable

Three fixes keep the daily send on schedule:

- **Confirm the send.** Outlook could report success while the issue was still in the Outbox. A run now counts as sent only once the message appears in Sent Items.
- **Check the mailbox, not the summary.** A reworded AI summary once triggered a false failure alert. Success is now checked against the mail state rather than the generated text.
- **Safe testing.** A test mode limits recipients to approved addresses, so changes never reach the whole lab by accident.

## What I would measure next

Opens and clicks per story, to learn which topics the lab actually reads and tune the editorial criteria around them.

## Source excerpts

For readers who want to see the implementation: [selected sources](/work/news-code/selected-source.txt), [delivery check](/work/news-code/delivery.txt), [send verification](/work/news-code/verification.txt), [subscriptions](/work/news-code/subscriptions.txt).
