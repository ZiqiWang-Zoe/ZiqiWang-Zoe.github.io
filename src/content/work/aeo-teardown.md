---
title: What AI Search Cites When Buyers Ask About Five AI Companies
summary: "60 buyer questions about Mintlify, Exa, Fireworks AI, AssemblyAI and LangChain, put to an OpenAI model, a Claude model and Google AI Overviews. Each engine drew on a different part of the web."
metric: "47%"
metricLabel: of the OpenAI model's citations pointed to tracked competitors' pages
org: Independent research
period: October 2026
role: Author. Question set, data collection, coding and analysis
order: 6
status: ready
cover: ../../assets/work/geo-cited-sources.png
coverFit: cover
coverAlt: "Stacked bars of cited sources. OpenAI GPT-6 Sol, 516 citations: company's own pages 33%, tracked competitors 47%, other companies 19%, review sites 0%, community and other 1%. Claude Sonnet 5.5, 238 citations: own 15%, competitors 18%, other companies 33%, review sites 26%, community and other 8%. Google AI Overviews, 350 citations: own 16%, competitors 9%, other companies 41%, review sites 12%, community and other 22%."
---

*Each engine leaned on a different kind of source. Data: 1,104 cited sources from 300 answers, collected October 18 to 19, 2026. Chart by Ziqi Wang.*

**TL;DR**

- I asked 60 buyer questions about five AI companies to three AI engines and recorded every source they cited: 1,104 citations across 300 answers.
- The engines cited different parts of the web. The OpenAI model favored the companies' own pages and tracked competitors' pages. Claude favored other companies' posts and review sites, and Google AI Overviews also cited community sources often.
- For a marketer, that means one engine mostly cites your docs and pricing pages, while the other two mostly cite comparison posts written by others.

## Why This Study

Generative engine optimization (GEO) is the work of getting a brand described correctly in AI answers. An answer engine searches the web, picks a few pages, and writes an answer that links to them. The cited pages show which sources each engine attached to its answer.

My co-authored paper [L-MARS](/work/l-mars/) studies that selection step for legal questions. This study looks at it for companies that sell to developers.

## What I Did

- **Five companies:** Mintlify (developer docs), Exa (web search API), Fireworks AI (model serving), AssemblyAI (speech to text) and LangChain (agent frameworks).
- **12 questions each.** Six don't name the company, the way a buyer starts ("What is the fastest inference API for open-source LLMs?"). Six do: comparisons, alternatives, pricing, fit and "what is it".
- **Three engines.** OpenAI's GPT-6 Sol through Codex, OpenAI's command-line tool, with web search on. Claude Sonnet 5.5 through Claude Code, limited to web search and page fetch. Google AI Overviews, the AI summary at the top of Google results, in a logged-out browser.
- **Runs.** The two models answered every question twice on October 18. AI Overviews was captured once per question on October 18 and 19.
- **Coding.** Each cited source went into one of five groups: own pages, tracked competitors, other companies, review sites, and community, news or other sources.

## What I Found

**The OpenAI model mostly cited vendors' own sites.** It searched for all 120 answers and cited about four sources each. 80% of its citations were pages from the company asked about (33%) or a tracked competitor (47%), mostly docs and pricing pages. Most of the rest were platform docs from companies such as OpenAI, Microsoft and Google. It cited no review sites.

**Claude and AI Overviews read what others wrote about the companies.** Pages from companies outside the tracked set were 33% of Claude's citations and 41% of AI Overviews'. Review and comparison sites added another 26% for Claude. On "Mintlify vs GitBook", AI Overviews cited Mintlify's own comparison page and eleven others. Eight of the twelve came from other documentation tools and agencies. On Exa's questions, Claude cited comparison posts by Parallel, an Exa competitor, nine times across four questions.

**Claude often answered from memory.** It searched in only 47 of its 120 answers. The other 73 came from what the model already knew, so a page published this month could not reach those answers through live search.

**Being mentioned and being named first are different results.** On Exa's six unbranded questions, Claude mentioned Exa in all 12 answers. It named Tavily first in six of them and Exa first in three. On Fireworks AI's, Claude named Together AI first in five answers and Fireworks in two, while the OpenAI model named Fireworks first in seven. Mintlify led on all three engines.

**Main list prices were right, and the errors were in the details.** All 25 pricing answers stated the main list price correctly. One Claude answer and one AI Overview repeated a claim from third-party guides that LangSmith keeps extended traces for 400 days. LangChain's pricing page says 180.

## What Each Company Could Look At

| Company | What the engines did | Our reading: one thing to check |
|---|---|---|
| Mintlify | Named first in 9 of 12 OpenAI answers, 11 of 12 Claude answers and 4 of 6 AI Overviews on unbranded questions. | Mintlify publishes its own GitBook comparison, and AI Overviews cited it. The other cited comparisons mostly came from rival docs tools, so their facts are worth checking. |
| Exa | Mentioned often, but Claude and AI Overviews named Tavily first more often than Exa. | The comparison posts that rank search APIs, starting with Parallel's, which Claude cited nine times on Exa's questions, and what each says about Exa. |
| Fireworks AI | Named first in 7 of 12 OpenAI answers and 2 of 12 Claude answers on unbranded questions. | The Claude answers that named Together AI first (5 of 12), compared with Fireworks AI's own pages on speed, price, fine-tuning and structured output. Claude named Cerebras first on the fastest-inference question. |
| AssemblyAI | Mentioned in every Claude answer and AI Overview on unbranded questions, named first in 5 of 12 Claude answers. | One Claude answer could not load the pricing page and used third-party prices, including a model rate the pricing page does not list. |
| LangChain | Mentioned in 10 of 12 OpenAI answers on unbranded questions, named first in 2. | The framework comparisons the OpenAI model cites on agent and retrieval-augmented generation (RAG, answering from a document store) questions. In both runs it picked Pydantic AI for a Python agent and LlamaIndex for RAG. |

## What Marketers Can Take From It

- **Check citations engine by engine.** The same question drew on a company's docs in one engine and on other companies' blog posts in another. Plan content per engine.
- **Keep docs and pricing pages current.** The OpenAI model cited them more than any other source. Make them easy for AI tools to fetch.
- **Review the third-party pages engines cite about you.** Competitors' comparison posts were cited as evidence about the companies they compete with. Find the ones that get cited, and make sure your own facts are published where engines can find them.

## Limits

- Codex and Claude Code are developer tools. Their answers can differ from the ChatGPT and Claude apps, which use other system prompts and may use other models. Codex also opened its own built-in OpenAI docs guide in 12 of its 120 answers. A buyer in the ChatGPT or Claude app may see different sources.
- Perplexity was left out. Its API needs a paid key, and its website asked for a sign-up before answering.
- One weekend, two runs. The OpenAI model named the same vendor first in both runs for 52 of 60 questions, and Claude for 48. Answers change week to week, so this is a snapshot.
- I chose the 60 questions and the 56 tracked competitors. Other questions or another competitor list could change the shares. English, asked from the US.
- Percentages count citations, so answers with more links carry more weight. A citation shows which page an engine attached to its answer; it does not prove the page caused the answer.
- "Named first" means the first vendor named in the text, which is not always the one recommended. Top picks were coded separately.
- One person reviewed the coding; there is no second coder or agreement score.
- Source types and top picks were coded by an AI first pass and then reviewed by hand against the quoted sentence or the site. The review changed 3 of 150 top-pick judgments and 2 of 284 source types; no percentage in this write-up moved. Every row is published with the data.
- AI Overviews hides source URLs behind Google redirect links, so its sources are recorded by the publisher name and page title Google shows.

## Under the Hood

**Questions and companies.** `questions.csv` holds the 60 questions, frozen before the run. `companies.csv` lists each company's own domains and aliases, and `competitors.csv` the 56 tracked competitors with their domains. Three legacy docs hosts (two for Exa, one for LangChain) were added as own pages during coding; `analysis.py` lists them.

**Collection.** `run.py` asked each question with no conversation history. Codex ran GPT-6 Sol with live web search, a read-only sandbox and no user config, rules or memory. Claude Code ran Sonnet 5.5 with a one-line system prompt and only the WebSearch and WebFetch tools. User settings, skills and MCP servers (Model Context Protocol tool connections) were turned off. Every raw response is stored, with local paths removed. AI Overviews was read from the page by a script in a logged-out browser, then saved as text with its source list.

**What counts as a citation.** For the two models: every link in the final answer, with placeholder hosts such as acme.com in code samples dropped. Pages the model retrieved but did not link are stored separately and not counted. For AI Overviews: each entry in the source list Google shows beside the summary.

**Coding.** `analysis.py` matches company and competitor names in the answer text, records the order in which they appear, and sorts cited domains into own, competitor or third party. Third-party sources were typed in `host_types.csv`, then reviewed by hand. `judge.py` asked a separate Claude call, with no tools, which product each unbranded answer recommends first, and to quote the sentence that shows it. Every quote was checked to appear word for word in the answer, and every judgment was reviewed by hand. When an answer named two options side by side, it counts as no single pick. Pricing answers were checked against each company's pricing page, copied on October 19 into `claims/`.

**Reproduce it.** `python3 research/geo/analysis.py` rebuilds every table in `results/` from the raw files, and `make_figure.py` redraws the chart.

## Data

All questions, raw answers, coded data and analysis scripts are in [research/geo](https://github.com/ZiqiWang-Zoe/ZiqiWang-Zoe.github.io/tree/main/research/geo) in this site's repository. AI Overviews was captured in a browser; the captured text and sources are in `aio/`. The stored data reproduces every table, but a new run will not give the same answers, because search results and models change.
