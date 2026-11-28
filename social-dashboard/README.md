# Social Media Intelligence Dashboard V2 — prototype

Open `index.html` in a browser. It is a single file with no build step. **All data is synthetic.** The live Meta integration starts later.

- `index.html`: the current working prototype. It is the continuation of `reference/Social_Intelligence_V2_With_Targets_Grading.html`.
- `reference/`: the original handover pack (source PDF, blueprint, earlier prototypes, handover prompt).
- `data/`: the 6-month synthetic CSVs.
- `tools/generate_demo_data.py`: regenerates the demo data block inside `index.html`.

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

## Still placeholders
Portfolio Overview, Brand Overview, Organic, Paid, Audience, Content & Campaigns, Competitors, AI Intelligence, Management. Also still to do: the Arabic/RTL switch and the global brand/date pickers. Earlier prototypes in `reference/` have versions of these to port.
