---
title: Sector Performance from Yahoo Finance Data
summary: A course project that scrapes Yahoo Finance, cleans the data with pandas and compares how stocks in eight sectors moved against the major US indices.
org: University of Southern California
period: "2025"
role: Analyst
order: 7
featured: false
status: ready
---

## At a Glance

- **The question:** how do different market sectors perform relative to the major indices, and what patterns show up in trending stocks?
- **The data:** Yahoo Finance's trending stocks, the S&P 500, Dow Jones, NASDAQ and Russell 2000, and stocks from technology, healthcare, financial, energy and consumer sectors.
- **Tools:** Python, requests and BeautifulSoup for collection, pandas and NumPy for cleaning and analysis, matplotlib for charts.

[Code, data and charts on GitHub](https://github.com/ZiqiWang-Zoe/yahoo_finance_final_project)

## How It Works

The project runs as four scripts, each one feeding the next:

1. **Collect.** Scrape the trending-stocks page, the four index pages and a set of sector stocks, and save the raw HTML and JSON.
2. **Clean.** Parse prices, changes and volumes into numbers, handle missing values, and remove duplicates and invalid rows.
3. **Analyze.** Compute descriptive statistics, top gainers and losers, sector averages, index comparisons and volatility.
4. **Visualize.** Chart index performance, gainers and losers, sector comparisons, price distribution, price against volume and overall market sentiment.

On the day the data was collected, 31 of the 48 trending stocks were up.

## What I Would Do Differently

This is a single-day snapshot, so it shows how sectors moved on one day rather than a trend. Comparing percent changes instead of dollar changes would keep high-priced stocks from dominating the sector averages. The [AI Attention Tracker](/work/ai-attention-tracker/) applies those lessons: it collects data every day, reports shares instead of raw counts, and keeps the full history.
