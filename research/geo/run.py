"""Ask every question in a CSV to ChatGPT, Claude and Perplexity (via their APIs, with web search on)
and save the full raw answers, so every number in the case study traces back to a stored response.

Usage:
  python3 research/geo/run.py --engines openai,anthropic,perplexity --runs 2
  python3 research/geo/run.py --questions research/geo/baseline-ziqi.csv --engines perplexity --runs 1

Keys come from OPENAI_API_KEY, ANTHROPIC_API_KEY, PERPLEXITY_API_KEY, either exported or as
KEY=value lines in research/geo/.env (gitignored). Exported values win.
Output: research/geo/raw/<date>/<engine>.jsonl, one line per (question, run). Re-running skips
lines that already exist, so an interrupted run can be resumed.

The question is sent as-is, with no system prompt, so each engine answers the way it would answer a
user. Google AI Overviews has no API and is captured by hand (see README).
"""

import argparse
import csv
import datetime as dt
import json
import os
import sys
import threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).parent

env_file = HERE / ".env"
if env_file.exists():
    for line in env_file.read_text().splitlines():
        key, sep, value = line.strip().partition("=")
        if sep and not key.startswith("#"):
            os.environ.setdefault(key.strip(), value.strip().strip("'\""))

MODELS = {
    "openai": os.environ.get("GEO_OPENAI_MODEL", "gpt-5"),
    "anthropic": os.environ.get("GEO_ANTHROPIC_MODEL", "claude-opus-5-5"),
    "perplexity": os.environ.get("GEO_PERPLEXITY_MODEL", "sonar"),
}


def ask_openai(question, model):
    from openai import OpenAI

    resp = OpenAI().responses.create(model=model, tools=[{"type": "web_search"}], input=question)
    citations = []
    for item in resp.output:
        if item.type == "message":
            for part in item.content:
                for a in getattr(part, "annotations", None) or []:
                    if a.type == "url_citation":
                        citations.append({"url": a.url, "title": a.title})
    return resp.output_text, citations, [], resp.model_dump()


def ask_anthropic(question, model):
    import anthropic

    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": question}]
    tools = [{"type": "web_search_20260209", "name": "web_search", "max_uses": 5}]
    # No refusal fallback on purpose: a fallback would silently answer with a different model.
    # A refusal is recorded as a refusal.
    raws = []
    for _ in range(5):
        resp = client.messages.create(model=model, max_tokens=16000, tools=tools, messages=messages)
        raws.append(resp.model_dump())
        if resp.stop_reason != "pause_turn":
            break
        messages.append({"role": "assistant", "content": resp.content})
    text, cited, retrieved = [], [], []
    for raw in raws:
        for block in raw["content"]:
            if block["type"] == "text":
                text.append(block["text"])
                for c in block.get("citations") or []:
                    if c.get("url"):
                        cited.append({"url": c["url"], "title": c.get("title")})
            elif block["type"] == "web_search_tool_result" and isinstance(block["content"], list):
                retrieved += [{"url": r["url"], "title": r.get("title")} for r in block["content"]]
    return "".join(text), cited, retrieved, {"responses": raws, "stop_reason": raws[-1]["stop_reason"]}


def ask_perplexity(question, model):
    import httpx

    r = httpx.post(
        "https://api.perplexity.ai/chat/completions",
        headers={"Authorization": f"Bearer {os.environ['PERPLEXITY_API_KEY']}"},
        json={"model": model, "messages": [{"role": "user", "content": question}]},
        timeout=120,
    )
    r.raise_for_status()
    data = r.json()
    results = data.get("search_results") or [{"url": u} for u in data.get("citations") or []]
    cited = [{"url": s["url"], "title": s.get("title")} for s in results]
    return data["choices"][0]["message"]["content"], cited, [], data


ENGINES = {"openai": ask_openai, "anthropic": ask_anthropic, "perplexity": ask_perplexity}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--questions", default=str(HERE / "questions.csv"))
    p.add_argument("--engines", default="openai,anthropic,perplexity")
    p.add_argument("--runs", type=int, default=2)
    p.add_argument("--date", default=dt.date.today().isoformat())
    p.add_argument("--limit", type=int, default=0, help="only the first N questions (smoke test)")
    p.add_argument("--workers", type=int, default=4)
    args = p.parse_args()

    questions = list(csv.DictReader(open(args.questions)))
    if args.limit:
        questions = questions[: args.limit]
    out_dir = HERE / "raw" / args.date
    out_dir.mkdir(parents=True, exist_ok=True)

    for engine in args.engines.split(","):
        model = MODELS[engine]
        path = out_dir / f"{engine}.jsonl"
        done = set()
        if path.exists():
            for line in open(path):
                row = json.loads(line)
                done.add((row["qid"], row["run"]))
        todo = [(q, n) for q in questions for n in range(1, args.runs + 1) if (q["qid"], n) not in done]
        print(f"{engine} ({model}): {len(todo)} to ask, {len(done)} already saved", file=sys.stderr)
        lock = threading.Lock()

        def work(item):
            q, n = item
            row = {"date": args.date, "engine": engine, "model": model, "run": n,
                   "qid": q["qid"], "question": q["question"]}
            try:
                text, cited, retrieved, raw = ENGINES[engine](q["question"], model)
                row.update(answer=text, citations=cited, retrieved=retrieved, raw=raw)
            except Exception as e:  # keep going; failed rows are retried on the next run
                print(f"  {q['qid']} run {n}: {e!r}", file=sys.stderr)
                return
            row["asked_at"] = dt.datetime.now(dt.timezone.utc).isoformat()
            with lock, open(path, "a") as f:
                f.write(json.dumps(row, default=str) + "\n")
            print(f"  {q['qid']} run {n}: {len(row['citations'])} citations", file=sys.stderr)

        with ThreadPoolExecutor(args.workers) as pool:
            list(pool.map(work, todo))


if __name__ == "__main__":
    main()
