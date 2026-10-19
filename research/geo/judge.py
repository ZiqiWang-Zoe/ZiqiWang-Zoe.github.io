"""First-pass coding of the `recommended` judgment field, for Ziqi to review row by row.

For every unbranded answer, Claude Code (Sonnet 5.5, no tools) is asked which vendor the answer presents
as the top or default pick, and must quote the sentence that shows it. The quote is checked to appear
verbatim in the answer, so each judgment can be verified by reading one line.

Output: judged.csv (engine, run, qid, top_pick, quote, recommended, judged_by)
Run: research/geo/.venv/bin/python research/geo/judge.py --date 2026-10-18
"""

import argparse
import csv
import json
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import analysis

HERE = Path(__file__).parent
MODEL = "claude-sonnet-5-5"
SYSTEM = "You code survey data. Answer with one JSON object and nothing else."
PROMPT = """A buyer asked an AI assistant: "{question}"

The assistant's answer is below, between the markers.

<<<ANSWER
{answer}
ANSWER>>>

Which single vendor or product does the answer present as its top or default pick for this question?
Rules:
- A pick is a product the answer recommends first or above the others ("best overall", "start with",
  "my pick", "the default choice", ranked number one in a recommendation).
- A plain list without a stated preference, or "it depends" with no default, means no pick.
- If the answer picks different products for different needs and names no overall default, return null.
Return JSON: {{"top_pick": "<product name>" or null, "quote": "<the exact sentence from the answer that shows the pick, copied character for character, or empty>"}}"""


def judge(item):
    a, question = item
    with tempfile.TemporaryDirectory() as cwd:
        p = subprocess.run(
            ["claude", "-p", PROMPT.format(question=question, answer=a["answer"]), "--model", MODEL,
             "--system-prompt", SYSTEM, "--tools", "", "--setting-sources", "", "--strict-mcp-config",
             "--disable-slash-commands", "--no-session-persistence", "--output-format", "json"],
            cwd=cwd, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=600)
    text = json.loads(p.stdout)["result"].strip().removeprefix("```json").removesuffix("```").strip()
    out = json.loads(text)
    quote = (out.get("quote") or "").strip()
    out["quote_found"] = "yes" if quote and quote in a["answer"] else ("" if not quote else "no")
    return a, out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--date", default="2026-10-18")
    args = p.parse_args()
    questions, answers = analysis.load_answers(args.date)
    companies = {c["company"]: c for c in analysis.read_csv("companies.csv")}
    path = HERE / "judged.csv"
    done = {}
    if path.exists():
        done = {(r["engine"], r["run"], r["qid"]): r for r in analysis.read_csv("judged.csv")}
    todo = [(a, questions[a["qid"]]["question"]) for a in answers
            if questions[a["qid"]]["branded"] == "no" and (a["engine"], str(a["run"]), a["qid"]) not in done]
    rows = list(done.values())
    with ThreadPoolExecutor(4) as pool:
        for a, out in pool.map(judge, todo):
            co = questions[a["qid"]]["company"]
            pick = out.get("top_pick") or ""
            aliases = [x.lower() for x in companies[co]["aliases"].split(";")]
            rows.append({"engine": a["engine"], "run": str(a["run"]), "qid": a["qid"], "top_pick": pick,
                         "quote": out.get("quote") or "", "quote_found": out["quote_found"],
                         "recommended": "yes" if any(x in pick.lower() for x in aliases) else "no",
                         "judged_by": f"{MODEL} first pass, not yet reviewed"})
            print(a["engine"], a["run"], a["qid"], "->", pick or "(none)", flush=True)
    rows.sort(key=lambda r: (r["qid"], r["engine"], r["run"]))
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)


if __name__ == "__main__":
    main()
