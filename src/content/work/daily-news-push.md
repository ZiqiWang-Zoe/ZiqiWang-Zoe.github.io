---
title: IC News Daily, a newsletter I built for an IC lab
summary: A daily semiconductor newsletter for Futurewei's IC lab. I set the editorial line, and an AI pipeline I built with Claude Code and Codex collects, selects and sends it every morning.
metric: "~8"
metricLabel: curated stories in every morning's issue
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
  - "Number of subscribers and issues sent so far, if it can be shared"
  - "One sentence from lab leadership on how the newsletter is used (with permission)"
  - "Why the lab needed this, in Ziqi's words"
---

## At a glance

- **What:** a daily email newsletter of about eight semiconductor and AI-infrastructure stories.
- **Who reads it:** Futurewei's IC lab.
- **My role:** editor and builder. I decide what belongs in it, and I built the pipeline that produces and sends it.
- **Result:** it reaches the lab every morning, and leadership has given positive feedback on how useful it is.

[Read the October 10, 2026 issue](/work/news-email-2026-10-10.html)

## The editorial idea

Part of my job is reading 30+ industry-news items a week for market insight reports. IC News Daily turns that reading into a short morning newsletter for the lab.

Each issue opens with an **Editor's pick**, then a short list of stories. Every story gets a source, a date, a headline and two or three sentences on why it matters. The October 10 issue, for example, covered GPU supply, the cost of powering data centers, AI startup funding and a Senate probe into data-center subsidies.

## How it is produced

I used **Claude Code** and **Codex** to build the pipeline, which runs on its own every morning:

1. **Collect.** Python scripts pull new articles from RSS feeds and trade sites, with full-text extraction when a page allows it.
2. **Select.** An AI research pass reads the candidates against the editorial criteria I wrote and picks about eight stories, with a short summary for each.
3. **Format.** The issue is rendered as an HTML email with consistent thumbnails that display correctly in Outlook.
4. **Send.** It goes out through Outlook to the subscriber list. Readers join or leave by sending an email with a tag in the subject.

## Keeping it reliable

A newsletter that arrives some mornings is worse than none. Three fixes made every send dependable:

- **A send only counts when it is sent.** Outlook could report success while the issue sat in the Outbox. Now a run succeeds only once the message appears in Sent Items.
- **AI writes, code decides.** A reworded AI summary once triggered a false failure alert. Success is now judged from the mail state, never from generated text.
- **Safe testing.** A test mode limits recipients to approved addresses, so changes never reach the whole lab by accident.

## What I would measure next

Opens and clicks per story, to learn which topics the lab actually reads and tune the editorial criteria around them.

## Source excerpts

For readers who want to see the implementation: [selected sources](/work/news-code/selected-source.txt), [delivery check](/work/news-code/delivery.txt), [send verification](/work/news-code/verification.txt), [subscriptions](/work/news-code/subscriptions.txt).
