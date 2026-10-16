---
title: A daily industry briefing for an IC lab
summary: I built the morning semiconductor briefing Futurewei's IC lab reads, from story selection to Outlook delivery.
metric: "~8"
metricLabel: selected stories in every morning's briefing
org: Futurewei Technologies
period: "2026"
role: Creator, editorial and Python
order: 1
featured: true
wide: true
tint: blue
cover: ../../assets/work/news-email.png
coverAlt: The IC News Daily briefing from October 10, 2026
status: draft
todo:
  - "Why the lab needed this: one or two sentences in Ziqi's words"
  - "The editorial criteria: what makes a story worth sending to this audience"
  - Number of recipients, if it can be shared
  - One sentence from lab leadership on how the briefing is used (with permission)
---

## Result

The lab receives about eight selected stories each morning. Leadership has given positive feedback on the briefing's usefulness.

## The problem

Part of my job in Ecosystem Development is distilling 30+ industry-news items a week into market insight reports. I built a way to put a selected version of that reading in front of the IC lab every morning.

## What I built

A daily email briefing, *IC News Daily*, delivered to the lab each morning.

- **Editorial criteria first.** I defined what counts as a story for this audience. The research pass runs through Claude Code against those criteria and selects about eight stories.
- **Collection and formatting in Python.** RSS and site collection, full-text extraction, image preparation and the HTML email are scripts I wrote.
- **Delivery through Outlook,** with subscription handling so readers can join or leave by email, and a test mode that restricts recipients while I make changes.

[Read a sample briefing (Oct 10, 2026)](/work/news-email-2026-10-10.html)

## How I made it reliable

A daily briefing has to arrive every day. Three fixes made the sends dependable:

- **Easy to join.** Readers could not reliably reach the original subscription link on the private network, so subscribing now works by replying with a tagged email.
- **A send only counts when it is sent.** Outlook could report success while the briefing sat in the Outbox. Now a run succeeds only once the message appears in Sent Items.
- **AI writes, code decides.** A reworded AI summary once triggered a false failure alert. Success is now judged from the mail state, never from generated text.

## Source excerpts

For readers who want to see the implementation: [selected sources](/work/news-code/selected-source.txt), [delivery check](/work/news-code/delivery.txt), [send verification](/work/news-code/verification.txt), [subscriptions](/work/news-code/subscriptions.txt).
