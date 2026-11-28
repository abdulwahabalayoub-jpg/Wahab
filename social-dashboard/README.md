# Social Media Intelligence Dashboard V2 — prototype

Open `index.html` in a browser. It is a single self-contained file. **All data is synthetic.** The live Meta integration starts later.

- `index.html`: the built prototype (the continuation of `reference/Social_Intelligence_V2_With_Targets_Grading.html`). Don't edit it by hand.
- `src/`: the source. `styles.css`, `sidebar.html`, `main.html` and `app.js` (core helpers, charts, grading engine), `pages.js` (dashboard pages), `shell.js` (Content Analysis, Targets & Grading, navigation).
- `tools/build.py`: assembles `src/` into `index.html` and runs the data generator. Run `python3 tools/build.py` after any change.
- `reference/`: the original handover pack (source PDF, blueprint, earlier prototypes, handover prompt).
- `data/`: the 6-month synthetic CSVs.
- `tools/generate_demo_data.py`: generates six months of synthetic data (Mar–Aug 2026) into `index.html`.

## Changelog — v2.2 (28 Nov 2026)

**Six months of synthetic data, Mar–Aug 2026, for all 10 brands**
- 1,224 posts (Reels, carousels, images), each with a content pillar, organic vs ad-driven actions, profile visits, follows and watch metrics.
- 134 campaigns (Sales, Engagement, Traffic) with budgets. Monthly spend matches the CSV, relabelled USD.
- Account follower history, new follows, unfollows and profile visits.
- Aggregated audience data (gender, age, countries, Kuwait areas, activity heatmap).
- Three fictional competitors per brand, with public metrics only.
- The story in the data comes from the CSV: paid reach rises month by month while organic reach falls in August. Sutis's sales campaigns have no conversion tracking until June.

**Global controls:** a brand picker and a reporting-period picker on every page. Every page compares with the previous month.

**All sidebar pages now have content**
- Portfolio Overview: KPIs with sparklines, brand comparison, management attention flags, grade ranking, reach and posts charts.
- Brand Overview: KPIs, reach by month, grades over time, top and weakest posts, takeaways, flags.
- Organic Performance: KPIs, trends, format and pillar breakdowns, top posts.
- Paid Performance: KPIs, spend vs budget, CPM trend, campaign table linking to grade breakdowns.
- Audience Analysis: growth, follows vs unfollows, demographics, areas, activity heatmap, personas labelled as hypotheses.
- Content & Campaigns: monthly calendar, planned vs published, pillar mix, campaigns.
- Competitor Intelligence: public snapshot, follower trend, Ad Library activity, themes.
- AI Intelligence: rule-generated findings with evidence, period, confidence, assumptions and next step. Lifecycle: Proposed → Accepted / Rejected → Completed → Evaluated. Plus a SWOT.
- Management & Reports: budget pacing heatmap, objectives with status, tasks (accepted recommendations appear here), print to PDF.

**Grading across months:** each month is graded with the formula version in effect for it. Saving a version lets you choose where it starts: next month, this month, or all months.

Charts are hand-built SVG. They have hover tooltips, a highlighted selected month and a "Show data table" option.

## Changelog — v2.1 (28 Nov 2026)

**Content Analysis fixes**
- Damlooj Lounge posts had the same IDs as Danish Bakery (`DA-xx`), so clicking one opened the wrong post. They are now `DL-xx`.
- The "Organic + Paid" and "Paid only" filters were identical. "Paid only" now means ads that never appear on the profile, and it shows an explanatory empty state.
- The format filter only lists formats that exist in the data.
- Reach sort and paid share are labelled as reported reach, not deduplicated people.
- Carousels no longer show video length or watch time.
- The post detail now splits each engagement action into organic and ad-driven, shows profile visits and follows, links the post to its campaign, and includes a post grade breakdown.

**Targets & Grading now calculates grades**
- Organic account grade, organic post grades, per-campaign paid grades, paid account grade and overall grade.
- Every grade shows actual vs target, target achievement %, effective weight, points and a plain-language explanation.
- Missing data is excluded and the remaining weights are rescaled. A scorecard below 60% data coverage shows "Insufficient data".
- Lenient, Standard and Strict profiles have real cutoffs. A Custom profile has editable cutoffs and a cap.
- When weights change, users choose between automatic rebalancing and manual balancing. Manual mode blocks grading and saving until weights total 100%.
- Separate account and post formulas. Account-only metrics are shown greyed out in the post formula.
- Volume targets are set per campaign and can be edited in the campaign drill-down. Formula targets act as defaults.
- Paid account grade aggregation: equal weight per campaign (default) or spend-weighted.
- Formula history: saves are versioned with an effective period. A locked view shows Aug 2026 graded with the version in effect for that period.
- Portfolio grades table and a spend-vs-budget context card.

## Demo decisions (change any of these freely)
| Decision | Demo choice |
|---|---|
| Currency | USD everywhere. CSV "KD" spend is relabelled USD with no conversion. |
| Brands | All 10 from the source PDF, including Bait Jafra and Catering |
| Paid objectives | Sales, Engagement, Traffic |
| Grade cutoffs (A+/A/B+/B/C+/C/D) | Standard 95/90/85/80/75/70/60 · Lenient 88/82/76/70/64/58/50 · Strict 98/95/92/88/84/80/70 |
| Over-achievement cap per metric | Lenient 120%, Standard 110%, Strict 100% |
| Lower-is-better scoring | target ÷ actual |
| Minimum data coverage for a grade | 60% of the formula's weight |
| Overall mix | 70% organic / 30% paid |
| Paid account grade | Equal weight per campaign (budget-neutral) |
| Engagement rate | (likes + comments + saves + shares) ÷ organic reach |
| Watch time / retention | Average seconds per view / average watch ÷ video length |
| Profile visit rate | Only for posts with no paid distribution (otherwise the denominator is incompatible) |
| Paid formula additions | Revenue (Sales) and CPC (Traffic) added. Paid reach set to optional (0%) for Engagement. |

## Still to do
- Arabic / RTL language switch (earlier prototypes in `reference/` have one to port).
- Settings & Data area from the blueprint (organizations, integrations, permissions, metric dictionary, audit log).
- AI findings are rule-based in the demo. A real model would come with the backend.
