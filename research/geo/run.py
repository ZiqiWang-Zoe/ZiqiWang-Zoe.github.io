"""Ask every question in a CSV to ChatGPT and Claude with web search on, and save the full raw
answers, so every number in the case study traces back to a stored response.

Default engines run on the user's own subscriptions through the local CLIs, so no API key is needed:
  codex        Codex CLI (`codex --search exec`), signed in with ChatGPT. Model: GEO_CODEX_MODEL.
  claude_code  Claude Code (`claude -p`) with only WebSearch and WebFetch. Model: GEO_CLAUDE_MODEL.
Both run in an empty folder with user config, memory, skills and MCP servers switched off, and with a
one-line assistant system prompt in place of the coding-agent prompt where the CLI allows it (Claude
Code does; Codex keeps its own). Codex needs GEO_CODEX_HOME: a folder holding only a copy of
~/.codex/auth.json, so ~/.codex/AGENTS.md, memories and skills are not loaded.

The API engines (openai, anthropic, perplexity) are kept for a later run with API keys from
OPENAI_API_KEY, ANTHROPIC_API_KEY, PERPLEXITY_API_KEY, exported or as KEY=value lines in
research/geo/.env (gitignored).

Usage:
  research/geo/.venv/bin/python research/geo/run.py --engines codex,claude_code --runs 2
  research/geo/.venv/bin/python research/geo/run.py --questions research/geo/baseline-ziqi.csv --runs 2

Output: research/geo/raw/<date>/<engine>.jsonl, one line per (question, run). Re-running skips
lines that already exist, so an interrupted run can be resumed. Google AI Overviews has no API and is
captured in a logged-out browser (see README).
"""

import argparse
import csv
import datetime as dt
import json
import os
import re
import subprocess
import sys
import tempfile
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
    "codex": os.environ.get("GEO_CODEX_MODEL", "gpt-6-sol"),
    "claude_code": os.environ.get("GEO_CLAUDE_MODEL", "claude-sonnet-5-5"),
    "openai": os.environ.get("GEO_OPENAI_MODEL", "gpt-5"),
    "anthropic": os.environ.get("GEO_ANTHROPIC_MODEL", "claude-opus-5-5"),
    "perplexity": os.environ.get("GEO_PERPLEXITY_MODEL", "fast"),
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
    # Sonar Chat Completions was retired on 2026-09-27; its replacement is the Agent API.
    # The "fast" preset is the documented equivalent of the old "sonar" model.
    import httpx

    r = httpx.post(
        "https://api.perplexity.ai/v1/agent",
        headers={"Authorization": f"Bearer {os.environ['PERPLEXITY_API_KEY']}"},
        json={"preset": model, "input": question},
        timeout=180,
    )
    r.raise_for_status()
    data = r.json()
    text, cited = [], []
    for item in data.get("output") or []:
        if item.get("type") == "message":
            text += [c.get("text", "") for c in item.get("content") or [] if c.get("type") == "output_text"]
        elif item.get("type") == "search_results":
            cited += [{"url": s["url"], "title": s.get("title")} for s in item.get("results") or []]
    return "".join(text), cited, [], data


LINK = re.compile(r"\]\((https?://[^)\s]+)\)|(https?://[^\s)\]>\"'<]+)")


def links(text):
    out = []
    for m in LINK.finditer(text or ""):
        url = (m.group(1) or m.group(2)).rstrip(".,;:")
        if url not in out:
            out.append(url)
    return out


def ask_codex(question, model):
    home = os.environ["GEO_CODEX_HOME"]
    with tempfile.TemporaryDirectory() as cwd:
        cmd = ["codex", "--search", "exec", "--json", "--skip-git-repo-check", "--ephemeral",
               "--ignore-rules", "-s", "read-only", "-m", model, question]
        p = subprocess.run(cmd, cwd=cwd, env={**os.environ, "CODEX_HOME": home}, stdin=subprocess.DEVNULL,
                           capture_output=True, text=True, timeout=900)
    events = []
    for l in p.stdout.splitlines():
        try:
            events.append(json.loads(l))
        except json.JSONDecodeError:
            pass
    messages = [e["item"]["text"] for e in events
                if e.get("type") == "item.completed" and e["item"].get("type") == "agent_message"]
    if p.returncode or not messages:
        raise RuntimeError(f"codex exit {p.returncode}: {p.stderr[-500:]}")
    answer = messages[-1]
    retrieved = []
    for e in events:
        item = e.get("item") or {}
        if e.get("type") == "item.completed" and item.get("type") == "web_search":
            for r in item.get("results") or []:
                if r.get("url"):
                    retrieved.append({"url": r["url"], "title": r.get("title")})
            if (item.get("action") or {}).get("url"):
                retrieved.append({"url": item["action"]["url"], "title": None})
    return answer, [{"url": u, "title": None} for u in links(answer)], retrieved, {"events": scrub(events)}


CLAUDE_SYSTEM = ("You are Claude, an AI assistant made by Anthropic. The current date is {date}. "
                 "Search the web when a question needs current information.")


def ask_claude_code(question, model):
    with tempfile.TemporaryDirectory() as cwd:
        cmd = ["claude", "-p", question, "--model", model,
               "--system-prompt", CLAUDE_SYSTEM.format(date=dt.date.today().isoformat()),
               "--tools", "WebSearch,WebFetch", "--allowedTools", "WebSearch", "WebFetch",
               "--setting-sources", "", "--strict-mcp-config", "--disable-slash-commands",
               "--no-session-persistence", "--output-format", "stream-json", "--verbose"]
        p = subprocess.run(cmd, cwd=cwd, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=900)
    events = [json.loads(l) for l in p.stdout.splitlines() if l.startswith("{")]
    result = next((e for e in events if e.get("type") == "result"), None)
    if p.returncode or not result or result.get("subtype") != "success":
        raise RuntimeError(f"claude exit {p.returncode}: {(result or {}).get('subtype')} {p.stderr[-500:]}")
    retrieved = []
    for e in events:
        if e.get("type") != "user":
            continue
        for block in e["message"].get("content") or []:
            if isinstance(block, dict) and block.get("type") == "tool_result":
                content = block.get("content")
                text = content if isinstance(content, str) else json.dumps(content)
                retrieved += [{"url": u, "title": None} for u in links(text)]
    answer = result["result"]
    return answer, [{"url": u, "title": None} for u in links(answer)], retrieved, {"events": scrub(events)}


KEEP_INIT = ("type", "subtype", "model", "tools", "claude_code_version", "permissionMode")
PATH = re.compile(r"(/private)?/(var/folders|tmp|Users)/[^\s\"']*")


def scrub(events):
    """Drop local paths, session plumbing and account rate-limit events before saving raw output."""
    out = []
    for e in events:
        if e.get("type") == "rate_limit_event":
            continue
        if e.get("type") == "system" and e.get("subtype") == "init":
            e = {k: v for k, v in e.items() if k in KEEP_INIT}
        out.append(json.loads(PATH.sub("<local path>", json.dumps(e))))
    return out


ENGINES = {"codex": ask_codex, "claude_code": ask_claude_code, "openai": ask_openai, "anthropic": ask_anthropic, "perplexity": ask_perplexity}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--questions", default=str(HERE / "questions.csv"))
    p.add_argument("--engines", default="codex,claude_code")
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
