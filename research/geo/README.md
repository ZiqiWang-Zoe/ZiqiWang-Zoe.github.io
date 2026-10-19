# What AI search says about five AI companies: data and method

Raw data and scripts behind `src/content/work/aeo-teardown.md`. Every number in the case study must be
reproducible from the files here.

## Scope (agreed 2026-10-16)

- **Companies:** Mintlify, Exa, Fireworks AI, AssemblyAI, LangChain. Domains, aliases and the
  competitors we track are in `companies.csv`.
- **Questions:** 60 in `questions.csv`, 12 per company. Six per company are unbranded (category and
  use case, where a buyer has not named a vendor yet) and six are branded (comparison, alternatives,
  pricing, fit, brand). Share of voice is measured on the unbranded six only.
- **Engines (as run on 2026-10-18):**
  - OpenAI GPT-6 Sol through the Codex CLI with live web search, on the user's ChatGPT subscription (`run.py`, engine `codex`)
  - Claude Sonnet 5.5 through Claude Code with only WebSearch and WebFetch, on the user's Claude subscription (`run.py`, engine `claude_code`)
  - Google AI Overviews: read from a logged-out browser by a script, saved to `aio/2026-10-18-raw.json`
  - Perplexity was dropped: its API needs a paid key and the website asked for sign-up. The API engines in `run.py` remain for a later run with keys.
- **Runs:** 2 per question per API engine, on the same day, to show how stable answers are.
  AI Overviews: 1 run.
- **Spot check:** 10 questions also asked in the consumer ChatGPT, Claude and Perplexity apps and
  pasted into `consumer-check/<date>.csv` (MIN-01, MIN-04, EXA-01, EXA-07, FW-01,
  FW-09, AAI-01, AAI-07, LC-01, LC-09), to report how closely API answers match what a buyer sees.
- **Bonus baseline:** `baseline-ziqi.csv`, the same engines asked about Ziqi herself, before the new
  site is indexed. Re-run later with the same file to measure the change.

## Files

| Path | What it is |
|---|---|
| `questions.csv`, `companies.csv`, `baseline-ziqi.csv` | Inputs, frozen before the run |
| `run.py` | Asks the API engines and stores full responses |
| `raw/<date>/<engine>.jsonl` | One line per question and run: answer text, cited URLs, full API response |
| `aio/<date>.csv` | Hand-captured AI Overviews: `qid,shown,answer,cited_urls` |
| `claims/<company>.md` | The company's own claims, copied from its site on run day, with URLs |
| `coded.csv` | One row per answer, coded per the codebook below |
| `analysis.py`, `results/` | Tables used in the case study; `make_figure.py` draws the lead figure |
| `competitors.csv`, `host_types.csv` | Competitor domains, and the hand-coded type of each third-party source |
| `judge.py`, `judged.csv` | First-pass top-pick coding, with a verbatim quote per answer |
| `pricing_check.csv`, `claims/` | Pricing answers checked against each pricing page (copied 2026-10-19) |

## Codebook (per answer)

| Field | Rule |
|---|---|
| `mentioned` | Company name or an alias from `companies.csv` appears in the answer text |
| `position` | Rank of the company among all vendors named, in order of first appearance (1 = named first). Blank if not mentioned |
| `vendors_named` | Every tracked company or competitor named, in order |
| `recommended` | The answer picks the company as the top or default choice (judgment, see below) |
| `citations_own` / `_competitor` / `_third_party` | Count of cited URLs on the company's own domains, a competitor's domain, or anywhere else |
| `third_party_types` | Third-party citations grouped as review/listicle, docs/blog of another vendor, community (Reddit, HN, Stack Overflow), GitHub, news, other |
| `claims_survive` | For branded questions: which of the company's claims from `claims/<company>.md` appear correctly, appear wrong (for example an outdated price), or are missing |

`mentioned`, `position`, `vendors_named` and the citation counts are computed by `analysis.py` from
string and domain matching. `recommended` and `claims_survive` need judgment: Claude codes a first
pass, and Ziqi reviews every row before any number is published. `coded.csv` records who coded each
judgment field.

## Limits to state in the write-up

- API answers can differ from the consumer apps (different default model, no personalization or
  location). The spot check measures how much.
- One day, two runs. AI answers change week to week, so this is a snapshot, not a ranking.
- English questions, asked from the US.

## Hand capture

- **AI Overviews:** copy `aio/template.csv` to `aio/<date>.csv`. For each question, search Google in a
  logged-out (private) window. Set `shown` to yes or no, paste the Overview text into `answer`, and
  put the source links in `cited_urls`, separated by spaces.
- **Consumer spot check:** copy `consumer-check/template.csv` to `consumer-check/<date>.csv`. Ask each
  question in a new chat in each app. Note the model the app shows, then paste the answer and the
  source links.
