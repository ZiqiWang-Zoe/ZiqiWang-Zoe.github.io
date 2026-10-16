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

## The problem

Part of my job in Ecosystem Development is distilling 30+ industry-news items a week into market insight reports. I built a way to put a selected version of that reading in front of the IC lab every morning.

## What I built

A daily email briefing, *IC News Daily*, delivered to the lab each morning.

- **Editorial criteria first.** I defined what counts as a story for this audience. The research pass runs through Claude Code against those criteria and selects about eight stories.
- **Collection and formatting in Python.** RSS and site collection, full-text extraction, image preparation and the HTML email are scripts I wrote.
- **Delivery through Outlook,** with subscription handling so readers can join or leave by email, and a test mode that restricts recipients while I make changes.

[Read a sample briefing (Oct 10, 2026)](/work/news-email-2026-10-10.html)

## What broke, and what I changed

Running something every morning for real readers surfaced problems a demo never would.

| When | What went wrong | What I changed |
|---|---|---|
| Jul 2026 | Readers could not reliably reach the subscription link on the private network. | Subscriptions now work by email with a tag in the subject, with a review step for ambiguous requests. |
| Aug 3 | Outlook returned without error while the briefing sat in the Outbox. | A send only counts once a matching message appears in Sent Items, checked for up to three minutes. |
| Aug 4 | A reworded AI summary triggered a false failure alert. | Success is decided from the mail state, never from the wording of generated text. |
| Aug 17 | An unattended run could stall on a setup step. | The launcher prepares every output folder before the AI step begins. |

## Result

The lab receives about eight selected stories each morning. Leadership has given positive feedback on the briefing's usefulness.

## Source excerpts

For readers who want to see the implementation: [selected sources](/work/news-code/selected-source.txt), [delivery check](/work/news-code/delivery.txt), [send verification](/work/news-code/verification.txt), [subscriptions](/work/news-code/subscriptions.txt).
