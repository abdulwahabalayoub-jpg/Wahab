"""Generate the synthetic demo dataset embedded in index.html.

All values are fabricated for interface demonstration only. Run:
    python3 tools/generate_demo_data.py
It rewrites the block between /*DEMO_DATA_START*/ and /*DEMO_DATA_END*/ in index.html.

Base post rows (reach, views, impressions, watch time, saves, shares, comments,
ad spend) come from the original V2 prototype. This script adds the fields the
grading demo needs and reconciles campaign spend to the August 2026 rows of
data/Social_Intelligence_Demo_Data_6_Months_Expanded.csv (spend relabelled USD).
"""
import csv
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
BASE = ROOT / "reference" / "Social_Intelligence_V2_With_Targets_Grading.html"
CSV = ROOT / "data" / "Social_Intelligence_Demo_Data_6_Months_Expanded.csv"

rng = random.Random(2026)


def u(a, b):
    return rng.uniform(a, b)


# ---------- posts ----------
src = BASE.read_text(encoding="utf-8")
posts = json.loads(re.search(r"const DATA=(\[.*?\]);", src, re.S).group(1))
for p in posts:
    if p["brand"] == "Damlooj Lounge":  # fix duplicate DA-xx ids shared with Danish Bakery
        p["id"] = p["id"].replace("DA-", "DL-")
    if p["id"].startswith("HÄ"):
        p["id"] = p["id"].replace("HÄ", "HD")

out_posts = []
for p in posts:
    boosted = p["paid_reach"] > 0
    paid_frac = (p["paid_reach"] / (p["organic_reach"] + p["paid_reach"]) * u(0.45, 0.8)) if boosted else 0
    likes_total = round((p["organic_reach"] + p["paid_reach"]) * u(0.012, 0.03))
    totals = {"likes": likes_total, "comments": p["comments"], "saves": p["saves"], "shares": p["shares"]}
    paid = {k: round(v * paid_frac) for k, v in totals.items()}
    organic = {k: totals[k] - paid[k] for k in totals}
    is_video = p["format"] == "Reel"
    row = {
        "id": p["id"], "brand": p["brand"], "title": p["title"], "date": p["date"], "format": p["format"],
        "organic_reach": p["organic_reach"], "paid_reach": p["paid_reach"],
        "organic_views": p["organic_views"], "paid_impressions": p["paid_impressions"],
        "organic": organic, "paid": paid,
        # Instagram reports post profile visits / follows for the media as a whole (organic + paid viewers)
        "profile_visits": round((p["organic_reach"] + p["paid_reach"]) * u(0.008, 0.03)),
        "follows": 0,
        "avg_watch_sec": p["avg_watch_sec"] if is_video else None,
        "video_length_sec": p["video_length_sec"] if is_video else None,
        "completion_pct": p["completion_pct"] if is_video else None,
        "skip_rate_pct": round(min(70, max(15, 75 - p["completion_pct"] * u(0.7, 1.0))), 1) if is_video else None,
        "ad_spend_USD": p["ad_spend_USD"],
        "campaign_id": None,
    }
    row["follows"] = round(row["profile_visits"] * u(0.06, 0.2))
    out_posts.append(row)

# ---------- brand accounts (Jul -> Aug 2026 from the expanded CSV) ----------
rows = list(csv.DictReader(CSV.open(encoding="utf-8")))
accounts = {}
for r in rows:
    if r["month"] in ("Jul 2026", "Aug 2026"):
        a = accounts.setdefault(r["brand"], {})
        key = "jul" if r["month"].startswith("Jul") else "aug"
        a[key] = r
ACCOUNTS = {}
for brand, a in accounts.items():
    f_jul, f_aug = int(a["jul"]["followers"]), int(a["aug"]["followers"])
    new_follows = round((f_aug - f_jul) * u(1.25, 1.6))  # gross follows; net growth is after unfollows
    pv = round(new_follows / u(0.08, 0.2))
    ACCOUNTS[brand] = {
        "followers_jul": f_jul, "followers_aug": f_aug,
        "profile_visits": pv, "new_follows": new_follows,
        "ad_spend_USD": float(a["aug"]["meta_ad_spend_KD"]),  # relabelled as USD, no conversion
    }

# ---------- campaigns ----------
by_id = {p["id"]: p for p in out_posts}
PLAN = {
    "Khaneen": [("engagement", "August menu boosts", ["KH-02", "KH-03", "KH-04"], 80), ("sales", "Weekend brunch online orders", [], 300), ("traffic", "New menu landing page", [], 150)],
    "Sutis": [("engagement", "August Reel boosts", ["SU-02", "SU-03"], 90), ("sales", "Dinner reservations", [], 250)],
    "Solia": [("sales", "Delivery orders", [], 300), ("traffic", "Menu launch page", [], 200)],
    "illy Cafe": [("engagement", "Reel boosts", ["IL-01", "IL-04"], 20), ("traffic", "Coffee menu page", [], 200), ("engagement", "Coffee moments", [], 150)],
    "Danish Bakery": [("sales", "Pastry pre-orders", [], 300)],
    "Häagen-Dazs": [("engagement", "Breakfast Reel boost", ["HD-04"], 30), ("sales", "Summer tubs delivery", [], 400)],
    "Bait Jafra": [("engagement", "Weekend special boost", ["BA-02"], 50), ("traffic", "Family packs page", [], 180)],
    "Delfino": [("engagement", "August Reel boosts", ["DE-01", "DE-04"], 45), ("traffic", "Seafood menu page", [], 350)],
    "Catering": [("engagement", "Menu carousel boost", ["CA-03"], 40), ("traffic", "Events enquiry page", [], 150)],
    "Damlooj Lounge": [("engagement", "Lounge nights", [], 160)],
}
NO_TRACKING = {("Sutis", "Dinner reservations")}
CODES = {"Khaneen": "KH", "Sutis": "SU", "Solia": "SO", "illy Cafe": "IL", "Danish Bakery": "DA", "Häagen-Dazs": "HD",
         "Bait Jafra": "BA", "Delfino": "DE", "Catering": "CA", "Damlooj Lounge": "DL"}

campaigns = []
for brand, plan in PLAN.items():
    total = ACCOUNTS[brand]["ad_spend_USD"]
    boost_spend = {name: round(sum(by_id[i]["ad_spend_USD"] for i in ids), 2) for _, name, ids, _ in plan if ids}
    others = [c for c in plan if not c[2]]
    remaining = round(total - sum(boost_spend.values()), 2)
    shares = [u(0.8, 1.2) * c[3] for c in others]
    alloc = {}
    acc = 0
    for i, c in enumerate(others):
        v = remaining - acc if i == len(others) - 1 else round(remaining * shares[i] / sum(shares), 2)
        alloc[c[1]] = round(v, 2)
        acc += alloc[c[1]]
    for n, (obj, name, ids, budget) in enumerate(plan, 1):
        spend = boost_spend.get(name, alloc.get(name))
        budget = max(budget, round(spend * u(1.0, 1.15)))
        cid = f"{CODES[brand]}-C{n}"
        purchases = None
        if ids:
            impressions = sum(by_id[i]["paid_impressions"] for i in ids)
            reach = sum(by_id[i]["paid_reach"] for i in ids)  # not deduplicated across posts
            for i in ids:
                by_id[i]["campaign_id"] = cid
            link_clicks = round(impressions * u(0.3, 1.0) / 100)
            lpv = round(link_clicks * u(0.55, 0.85))
        elif obj == "sales":
            purchases = round(spend / u(1.5, 3.6))          # cost per purchase around the $2 default target
            lpv = round(purchases / u(0.025, 0.07))          # conversion rate around 3%
            link_clicks = round(lpv / u(0.6, 0.85))
            impressions = round(link_clicks / u(0.009, 0.02))
            reach = round(impressions / u(1.6, 2.5))
        else:
            impressions = round(spend / u(2.2, 4.4) * 1000)
            reach = round(impressions / u(1.6, 2.5))
            link_clicks = round(impressions * (u(0.6, 2.0) if obj == "traffic" else u(0.3, 1.0)) / 100)
            lpv = round(link_clicks * u(0.55, 0.85))
        c = {"id": cid, "brand": brand, "name": name, "objective": obj, "period": "Aug 2026",
             "budget_USD": budget, "spend_USD": round(spend, 2), "impressions": impressions, "reach": reach,
             "link_clicks": link_clicks, "landing_page_views": lpv, "linked_posts": ids,
             "engagements": None, "purchases": None, "revenue_USD": None, "conversion_tracking": None,
             "targets": {}}
        if obj == "engagement":
            if ids:
                c["engagements"] = sum(sum(by_id[i]["paid"].values()) for i in ids)
            else:
                c["engagements"] = round(spend / u(0.09, 0.24))
            c["targets"] = {"Engagement actions": round(spend / 0.15 / 10) * 10}
        if obj == "traffic":
            c["targets"] = {"Landing page views": round(spend / 0.25 / 10) * 10,
                            "Link clicks": round(spend / 0.2 / 10) * 10}
        if obj == "sales":
            if (brand, name) in NO_TRACKING:
                c["conversion_tracking"] = "Not set up"
            else:
                c["conversion_tracking"] = "Pixel + Conversions API"
                c["purchases"] = purchases
                c["revenue_USD"] = round(purchases * u(6.5, 12.5), 2)  # average order value
            c["targets"] = {"Purchases": round(spend / 2.2), "Revenue": round(spend * 4)}
        campaigns.append(c)

block = (
    "/*DEMO_DATA_START*/\n"
    "// Synthetic demo data generated by tools/generate_demo_data.py. Not real results.\n"
    f"const DATA={json.dumps(out_posts, ensure_ascii=False)};\n"
    f"const ACCOUNTS={json.dumps(ACCOUNTS, ensure_ascii=False)};\n"
    f"const CAMPAIGNS={json.dumps(campaigns, ensure_ascii=False)};\n"
    "/*DEMO_DATA_END*/"
)
html = HTML.read_text(encoding="utf-8")
if "/*DEMO_DATA_START*/" not in html:
    raise SystemExit("index.html has no DEMO_DATA markers")
html = re.sub(r"/\*DEMO_DATA_START\*/.*?/\*DEMO_DATA_END\*/", lambda _: block, html, flags=re.S)
HTML.write_text(html, encoding="utf-8")
print(f"{len(out_posts)} posts, {len(ACCOUNTS)} accounts, {len(campaigns)} campaigns written")
for c in campaigns:
    print(c["id"], c["brand"], c["objective"], c["spend_USD"], c["budget_USD"], c["engagements"], c["purchases"], c["revenue_USD"], c["landing_page_views"])
