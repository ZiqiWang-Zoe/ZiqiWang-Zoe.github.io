"""Code every stored answer with the mechanical fields of the codebook and write the tables.

Inputs:  questions.csv, companies.csv, competitors.csv, raw/<date>/*.jsonl, aio/<date>-raw.json,
         judged.csv (judgment fields, if present)
Outputs: coded.csv (one row per answer), citations.csv (one row per cited source), results/*.csv

Run: python3 research/geo/analysis.py --date 2026-10-18
"""

import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).parent
ENGINE_NAMES = {"codex": "ChatGPT (GPT-6 Sol, Codex CLI)", "claude_code": "Claude (Sonnet 5.5, Claude Code)",
                "aio": "Google AI Overviews"}
# Placeholder hosts used in code samples, not citations.
EXAMPLE_HOSTS = ("acme.com", "example.com", "example.org", "localhost", "your-domain.com", "yourdomain.com")
# Own pages found while coding that companies.csv missed (legacy or third-party-hosted docs).
EXTRA_OWN = {"Exa": ["metaphorapi.readme.io", "exa.mintlify.app"], "LangChain": ["langchain-ai.github.io"]}
COMMUNITY = ("reddit.com", "news.ycombinator.com", "stackoverflow.com", "stackexchange.com", "x.com",
             "twitter.com", "discord.com", "quora.com")
PUBLISHING = ("medium.com", "dev.to", "substack.com", "hashnode.dev", "linkedin.com", "towardsdatascience.com")


def read_csv(name):
    return list(csv.DictReader(open(HERE / name)))


def host(url):
    h = urlparse(url).netloc.lower()
    return h[4:] if h.startswith("www.") else h


def on_domain(url, domains):
    """domains may carry a path prefix, e.g. aws.amazon.com/bedrock."""
    h, path = host(url), urlparse(url).path.lower()
    for d in domains:
        dh, _, dp = d.partition("/")
        if (h == dh or h.endswith("." + dh)) and path.startswith("/" + dp if dp else ""):
            return True
    return False


def name_pattern(aliases):
    return re.compile(r"(?<![\w.])(" + "|".join(re.escape(a) for a in aliases) + r")(?![\w])")


HOST_TYPES = {}


def third_party_type(h):
    key = h.lower().removeprefix("www.").split("·")[0]
    if key in HOST_TYPES:
        return HOST_TYPES[key]
    if any(h == d or h.endswith("." + d) for d in COMMUNITY):
        return "community"
    if h.endswith("github.com") or h.endswith("github.io"):
        return "github"
    if h.endswith("youtube.com") or h == "youtu.be":
        return "video"
    if any(h == d or h.endswith("." + d) for d in PUBLISHING):
        return "blog platform"
    if h.endswith("wikipedia.org"):
        return "wikipedia"
    return "other site"


def load_answers(date):
    questions = {q["qid"]: q for q in read_csv("questions.csv")}
    answers = []
    for engine in ("codex", "claude_code"):
        for line in open(HERE / "raw" / date / f"{engine}.jsonl"):
            r = json.loads(line)
            if r["qid"] not in questions:
                continue  # baseline questions are reported separately
            answers.append({"engine": engine, "run": r["run"], "qid": r["qid"], "answer": r["answer"],
                            "urls": [c["url"] for c in r["citations"]
                                     if not any(host(c["url"]) == h or host(c["url"]).endswith("." + h)
                                                for h in EXAMPLE_HOSTS)], "searched": bool(r["retrieved"]),
                            "sources": None})
    aio_path = HERE / "aio" / f"{date}-raw.json"
    if aio_path.exists():
        for qid, o in json.load(open(aio_path)).items():
            if o.get("shown") != "yes":
                continue
            # Google's source list: each link's label is "<page title>. Opens in new tab." and the
            # first entry for it reads "<publisher> | <page title>". Keep one row per page title.
            sources, seen = [], set()
            for s in o["sites"]:
                if not s["site"].endswith(". Opens in new tab."):
                    continue
                page = s["site"][: -len(". Opens in new tab.")]
                i = s["title"].find(page)
                if page in seen or i <= 0:
                    continue
                seen.add(page)
                sources.append((s["title"][:i].rstrip(" |"), page))
            answer = o["answer"].split("\nShow more")[0]
            answers.append({"engine": "aio", "run": 1, "qid": qid, "answer": answer, "urls": [],
                            "searched": True, "sources": sources})
    return questions, answers


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--date", default="2026-10-18")
    args = p.parse_args()
    HOST_TYPES.update({r["host"]: r["type"] for r in read_csv("host_types.csv")})
    questions, answers = load_answers(args.date)
    companies = {c["company"]: c for c in read_csv("companies.csv")}
    comps = defaultdict(list)
    for c in read_csv("competitors.csv"):
        comps[c["company"]].append(c)

    judged = {}
    if (HERE / "judged.csv").exists():
        for j in read_csv("judged.csv"):
            judged[(j["engine"], j["run"], j["qid"])] = j

    coded, cites = [], []
    for a in answers:
        q = questions[a["qid"]]
        co = companies[q["company"]]
        own_domains = co["own_domains"].split(";") + EXTRA_OWN.get(q["company"], [])
        vendors = [(q["company"], co["aliases"].split(";"), own_domains)]
        vendors += [(c["competitor"], c["aliases"].split(";"), c["domains"].split(";")) for c in comps[q["company"]]]
        text = a["answer"]
        first = {}
        for name, aliases, _ in vendors:
            m = name_pattern(aliases).search(text)
            if m:
                first[name] = m.start()
        named = sorted(first, key=first.get)
        counts = Counter()
        if a["sources"] is not None:  # AI Overviews: classify by the site name Google shows
            for site, page in a["sources"]:
                kind, who = "third_party", ""
                for name, aliases, domains in vendors:
                    labels = [x.lower() for x in aliases + [name] + domains]
                    label = site.lower().removeprefix("www.")
                    if (label in labels or any(label == d.split("/")[0] for d in domains)
                            or any(label.startswith(a.lower() + " ") for a in aliases)):
                        kind, who = ("own" if name == q["company"] else "competitor"), name
                        break
                counts[kind] += 1
                cites.append({"engine": a["engine"], "run": a["run"], "qid": a["qid"], "company": q["company"],
                              "branded": q["branded"], "url": "", "host": site, "page_title": page, "kind": kind,
                              "vendor": who, "third_party_type": third_party_type(site) if kind == "third_party" else ""})
        else:
            for url in a["urls"]:
                kind, who = "third_party", ""
                for name, _, domains in vendors:
                    if on_domain(url, domains):
                        kind, who = ("own" if name == q["company"] else "competitor"), name
                        break
                counts[kind] += 1
                cites.append({"engine": a["engine"], "run": a["run"], "qid": a["qid"], "company": q["company"],
                              "branded": q["branded"], "url": url, "host": host(url), "page_title": "",
                              "kind": kind, "vendor": who,
                              "third_party_type": third_party_type(host(url)) if kind == "third_party" else ""})
        j = judged.get((a["engine"], str(a["run"]), a["qid"]), {})
        coded.append({
            "engine": a["engine"], "run": a["run"], "qid": a["qid"], "company": q["company"],
            "intent": q["intent"], "branded": q["branded"], "searched": "yes" if a["searched"] else "no",
            "mentioned": "yes" if q["company"] in first else "no",
            "position": named.index(q["company"]) + 1 if q["company"] in first else "",
            "vendors_named": ";".join(named), "first_named": named[0] if named else "",
            "citations": sum(counts.values()), "citations_own": counts["own"],
            "citations_competitor": counts["competitor"], "citations_third_party": counts["third_party"],
            "top_pick": j.get("top_pick", ""), "recommended": j.get("recommended", ""), "claims_correct": j.get("claims_correct", ""),
            "claims_wrong": j.get("claims_wrong", ""), "claims_missing": j.get("claims_missing", ""),
            "judged_by": j.get("judged_by", ""),
        })

    with open(HERE / "coded.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(coded[0]))
        w.writeheader()
        w.writerows(coded)
    with open(HERE / "citations.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(cites[0]))
        w.writeheader()
        w.writerows(cites)
    write_tables(coded, cites, list(companies))


def pct(n, d):
    return f"{100 * n / d:.0f}%" if d else ""


def write_tables(coded, cites, company_names):
    out = HERE / "results"
    out.mkdir(exist_ok=True)
    engines = ["codex", "claude_code", "aio"]

    # 1. Unbranded questions: how often each company is named, and named first, per engine.
    rows = []
    for co in company_names:
        row = {"company": co}
        for e in engines:
            sub = [r for r in coded if r["company"] == co and r["engine"] == e and r["branded"] == "no"]
            row[f"{e}_answers"] = len(sub)
            row[f"{e}_named"] = sum(r["mentioned"] == "yes" for r in sub)
            row[f"{e}_named_first"] = sum(r["first_named"] == co for r in sub)
        rows.append(row)
    write(out / "unbranded_visibility.csv", rows)

    # 2. Who is named first on unbranded questions when it is not the company.
    rows = []
    for co in company_names:
        for e in engines:
            c = Counter(r["first_named"] or "(no tracked vendor)" for r in coded
                        if r["company"] == co and r["engine"] == e and r["branded"] == "no")
            for name, n in c.most_common():
                rows.append({"company": co, "engine": e, "first_named": name, "answers": n})
    write(out / "first_named.csv", rows)

    # 3. Citation mix per engine and question type.
    rows = []
    for e in engines:
        for branded in ("no", "yes"):
            sub = [c for c in cites if c["engine"] == e and c["branded"] == branded]
            k = Counter(c["kind"] for c in sub)
            n_answers = len([r for r in coded if r["engine"] == e and r["branded"] == branded])
            rows.append({"engine": e, "branded": branded, "answers": n_answers, "citations": len(sub),
                         "own": k["own"], "competitor": k["competitor"], "third_party": k["third_party"],
                         "own_pct": pct(k["own"], len(sub)), "competitor_pct": pct(k["competitor"], len(sub)),
                         "third_party_pct": pct(k["third_party"], len(sub))})
    write(out / "citation_mix.csv", rows)

    # 4. Citation mix per company (all questions, all engines).
    rows = []
    for co in company_names:
        for e in engines:
            sub = [c for c in cites if c["company"] == co and c["engine"] == e]
            k = Counter(c["kind"] for c in sub)
            rows.append({"company": co, "engine": e, "citations": len(sub), "own": k["own"],
                         "competitor": k["competitor"], "third_party": k["third_party"],
                         "own_pct": pct(k["own"], len(sub)), "competitor_pct": pct(k["competitor"], len(sub))})
    write(out / "citation_mix_by_company.csv", rows)

    # 5. Most cited hosts per company.
    rows = []
    for co in company_names:
        c = Counter((x["host"], x["kind"], x["third_party_type"]) for x in cites if x["company"] == co)
        for (h, kind, t), n in c.most_common(15):
            rows.append({"company": co, "host": h, "kind": kind, "third_party_type": t, "citations": n})
    write(out / "top_hosts.csv", rows)

    # 5b. Who wrote the cited pages, per engine (all 60 questions). Feeds the lead figure.
    groups = {"own": "The company's own pages", "competitor": "Tracked competitors' pages",
              "other vendor": "Other companies' pages", "platform docs": "Other companies' pages",
              "review or comparison site": "Review and comparison sites"}
    rows = []
    for e in engines:
        sub = [c for c in cites if c["engine"] == e]
        k = Counter(groups.get(c["kind"] if c["kind"] != "third_party" else c["third_party_type"],
                               "Community, news and other") for c in sub)
        for g in ["The company's own pages", "Tracked competitors' pages", "Other companies' pages",
                  "Review and comparison sites", "Community, news and other"]:
            rows.append({"engine": e, "group": g, "citations": k[g], "total": len(sub), "pct": pct(k[g], len(sub))})
    write(out / "source_groups.csv", rows)

    # 5c. Third-party citations by type, per engine.
    rows = []
    for e in engines:
        sub = [c for c in cites if c["engine"] == e and c["kind"] == "third_party"]
        for t, n in Counter(c["third_party_type"] for c in sub).most_common():
            rows.append({"engine": e, "third_party_type": t, "citations": n, "pct_of_third_party": pct(n, len(sub))})
    write(out / "third_party_types.csv", rows)

    # 5d. Top picks on unbranded questions (judgment field, first pass).
    rows = []
    for e in engines:
        sub = [r for r in coded if r["engine"] == e and r["branded"] == "no"]
        rows.append({"engine": e, "answers": len(sub), "picked_the_company": sum(r["recommended"] == "yes" for r in sub),
                     "picked_another_vendor": sum(1 for r in sub if r["top_pick"] and r["recommended"] != "yes"),
                     "no_single_pick": sum(1 for r in sub if not r["top_pick"])})
    write(out / "top_picks.csv", rows)

    # 6. Search behaviour and run-to-run stability.
    rows = []
    for e in ("codex", "claude_code"):
        sub = [r for r in coded if r["engine"] == e]
        by_q = defaultdict(dict)
        for r in sub:
            by_q[r["qid"]][r["run"]] = r
        same_first = sum(1 for q in by_q.values() if len(q) == 2 and q[1]["first_named"] == q[2]["first_named"])
        same_named = sum(1 for q in by_q.values() if len(q) == 2 and q[1]["mentioned"] == q[2]["mentioned"])
        rows.append({"engine": e, "answers": len(sub), "searched": sum(r["searched"] == "yes" for r in sub),
                     "with_citations": sum(r["citations"] > 0 for r in sub),
                     "mean_citations": f"{sum(r['citations'] for r in sub) / len(sub):.1f}",
                     "questions": len(by_q), "same_first_named_both_runs": same_first,
                     "same_mentioned_both_runs": same_named})
    write(out / "engine_behaviour.csv", rows)


def write(path, rows):
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)


if __name__ == "__main__":
    main()
