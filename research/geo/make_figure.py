"""Lead figure for the GEO case study: who wrote the pages each engine cited.
Reads results/source_groups.csv (written by analysis.py). Run: python3 research/geo/make_figure.py"""
import csv
import pathlib

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = pathlib.Path(__file__).parent
OUT = HERE.parent.parent / "src" / "assets" / "work" / "geo-cited-sources.png"
SURFACE, INK, MUTED, GRID = "#ffffff", "#0b0b0b", "#52514e", "#e6e6e8"
# Validated categorical slots 1 to 4 (dataviz reference palette), plus a neutral gray for the remainder.
GROUPS = [("The company's own pages", "#2a78d6"), ("Tracked competitors' pages", "#eb6834"),
          ("Other companies' pages", "#1baf7a"), ("Review and comparison sites", "#eda100"),
          ("Community, news and other", "#b9b8b2")]
ENGINES = [("codex", "OpenAI GPT-6 Sol", "via Codex"), ("claude_code", "Claude Sonnet 5.5", "via Claude Code"),
           ("aio", "Google AI Overviews", "logged out")]
# Geist, the site's typeface (OFL), instanced at fixed weights in fonts/.
from matplotlib import font_manager
for _w in (500, 600):
    font_manager.fontManager.addfont(str(pathlib.Path(__file__).with_name("fonts") / f"Geist-{_w}.ttf"))
plt.rcParams.update({"font.family": ["Geist 500"], "font.size": 12})

rows = list(csv.DictReader(open(HERE / "results" / "source_groups.csv")))
data = {(r["engine"], r["group"]): (int(r["citations"]), int(r["total"])) for r in rows}

fig, ax = plt.subplots(figsize=(8.6, 4.4), dpi=150, facecolor=SURFACE)
ax.set_facecolor(SURFACE)
ys = [2, 1, 0]
for y, (eng, name, sub) in zip(ys, ENGINES):
    left = 0.0
    for group, color in GROUPS:
        n, total = data[(eng, group)]
        share = 100 * n / total
        if share:
            ax.barh(y, share, left=left, height=0.56, color=color, edgecolor=SURFACE, linewidth=2)
        if share >= 7:
            ax.text(left + share / 2, y, f"{share:.0f}%", ha="center", va="center", color=INK,
                    fontsize=12, fontfamily="Geist 600")
        left += share
    total = data[(eng, GROUPS[0][0])][1]
    ax.text(-2, y + 0.09, name, ha="right", va="center", color=INK, fontsize=12.5, fontfamily="Geist 600")
    ax.text(-2, y - 0.2, f"{sub}, {total} citations", ha="right", va="center", color=MUTED, fontsize=10)

ax.set_xlim(0, 100)
ax.set_ylim(-0.5, 2.5)
ax.set_xticks([])
ax.set_yticks([])
for side in ("top", "right", "bottom", "left"):
    ax.spines[side].set_visible(False)

handles = [plt.Rectangle((0, 0), 1, 1, color=c) for _, c in GROUPS]
fig.legend(handles, [g for g, _ in GROUPS], loc="upper left", bbox_to_anchor=(0.012, 0.9), ncol=3,
           frameon=False, fontsize=10.5, handlelength=1.1, columnspacing=1.4, labelcolor=INK)
fig.text(0.012, 0.965, "Who wrote the pages AI engines cited", color=INK, fontsize=13, fontfamily="Geist 600")
fig.text(0.012, 0.92, "Share of all cited sources, 60 buyer questions about five AI companies",
         color=MUTED, fontsize=10.5)
fig.text(0.012, 0.03,
         "OpenAI and Claude models: two runs per question with web search on, Oct 18, 2026.\n"
         "AI Overviews: one logged-out Google search per question, Oct 18 to 19. Source types: AI first pass, reviewed by hand.",
         color=MUTED, fontsize=9.5, linespacing=1.4)
fig.subplots_adjust(left=0.27, right=0.98, top=0.72, bottom=0.17)
OUT.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(OUT, facecolor=SURFACE, bbox_inches="tight", pad_inches=0.15)
print(OUT)
