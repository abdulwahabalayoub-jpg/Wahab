"""Generate the six-month synthetic demo dataset embedded in index.html.

All values are fabricated for interface demonstration only. Run:
    python3 tools/generate_demo_data.py
It rewrites the block between /*DEMO_DATA_START*/ and /*DEMO_DATA_END*/ in index.html.

Monthly account totals (followers, organic/paid reach, posts published, ad spend,
watch time) come from data/Social_Intelligence_Demo_Data_6_Months_Expanded.csv
(Mar-Aug 2026). The CSV's "KD" spend is relabelled USD with no conversion.
Posts, campaigns, audience, competitors and plans are generated around those totals.
"""
import csv
import json
import math
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
CSV = ROOT / "data" / "Social_Intelligence_Demo_Data_6_Months_Expanded.csv"

rng = random.Random(2026)
u = rng.uniform


def lognorm(sigma=0.45):
    return math.exp(rng.gauss(0, sigma) - sigma * sigma / 2)


MONTHS = ["Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026"]
MONTH_NUM = {m: i + 3 for i, m in enumerate(MONTHS)}
CODES = {"Khaneen": "KH", "Sutis": "SU", "Solia": "SO", "illy Cafe": "IL", "Danish Bakery": "DA", "Häagen-Dazs": "HD",
         "Bait Jafra": "BA", "Delfino": "DE", "Catering": "CA", "Damlooj Lounge": "DL"}
# Typical non-boost campaign objectives per brand (synthetic)
OBJECTIVES = {"Khaneen": ["sales", "traffic"], "Sutis": ["sales"], "Solia": ["sales", "traffic"], "illy Cafe": ["traffic", "engagement"],
              "Danish Bakery": ["sales"], "Häagen-Dazs": ["sales"], "Bait Jafra": ["traffic"], "Delfino": ["traffic"],
              "Catering": ["traffic"], "Damlooj Lounge": ["engagement"]}
CAMPAIGN_NAMES = {"sales": ["Online orders", "Delivery orders", "Weekend orders", "Pre-orders", "Family bundles"],
                  "traffic": ["Menu landing page", "New menu page", "Reservations page", "Offers page", "Events enquiry page"],
                  "engagement": ["Community moments", "Brand moments", "Lounge nights", "Seasonal story"]}
PILLARS = {"Product": ["New menu feature", "Signature dish", "Dessert feature", "Breakfast spread", "Coffee pour"],
           "Behind the scenes": ["Chef preparation", "Behind the scenes", "Kitchen morning", "Meet the team"],
           "Offers": ["Weekend special", "Limited-time offer", "Combo deal", "Delivery offer"],
           "Community": ["Customer experience", "Guest reactions", "User-generated repost", "Q&A with the chef"],
           "Atmosphere": ["Restaurant atmosphere", "Evening ambience", "Terrace view", "Table setting"]}
# Each brand has a content personality so insights differ (synthetic)
PILLAR_LIFT = {b: {p: u(0.75, 1.3) for p in PILLARS} for b in CODES}
FORMAT_LIFT = {"Reel": 1.25, "Carousel": 0.95, "Image": 0.7}

rows = list(csv.DictReader(CSV.open(encoding="utf-8")))
acct_csv = {(r["brand"], r["month"]): r for r in rows}
BRANDS = list(CODES)

posts, campaigns, ACCOUNTS = [], [], {}
for brand in BRANDS:
    code = CODES[brand]
    ACCOUNTS[brand] = {}
    prev_followers = None
    for mi, month in enumerate(MONTHS):
        r = acct_csv[(brand, month)]
        n_posts = int(r["posts_published"])
        org_month = int(r["organic_reach"])
        mean_post_reach = org_month * u(0.16, 0.22)
        watch_base = float(r["avg_watch_time_sec"])
        boost_prob = 0.12 + 0.045 * mi  # paid amplification rises over the period (matches the CSV trend)
        month_posts = []
        days = sorted(rng.choice(range(1, 29)) for _ in range(n_posts))
        for k in range(n_posts):
            fmt = rng.choices(["Reel", "Carousel", "Image"], [0.55, 0.3, 0.15])[0]
            pillar = rng.choice(list(PILLARS))
            title = rng.choice(PILLARS[pillar])
            org = round(mean_post_reach * lognorm(0.5) * FORMAT_LIFT[fmt] * PILLAR_LIFT[brand][pillar])
            boosted = rng.random() < boost_prob
            paid_reach = round(org * u(0.5, 2.2)) if boosted else 0
            reach_total = org + paid_reach
            q = PILLAR_LIFT[brand][pillar] * u(0.8, 1.2)
            totals = {"likes": round(reach_total * u(0.012, 0.028) * q), "comments": round(reach_total * u(0.0005, 0.0025) * q),
                      "saves": round(reach_total * u(0.004, 0.012) * q), "shares": round(reach_total * u(0.002, 0.007) * q)}
            paid_frac = paid_reach / reach_total * u(0.45, 0.8) if boosted else 0
            paid = {k2: round(v * paid_frac) for k2, v in totals.items()}
            organic = {k2: totals[k2] - paid[k2] for k2 in totals}
            is_video = fmt == "Reel"
            length = rng.randint(10, 40) if is_video else None
            watch = round(min(length * 0.92, watch_base * u(0.6, 1.5) * (1.1 if length and length < 18 else 1)), 1) if is_video else None
            completion = round(watch / length * 100, 1) if is_video else None
            pv = round(reach_total * u(0.008, 0.028))
            p = {"id": "", "brand": brand, "period": month,
                 "date": f"{days[k]:02d} {month[:3]} 2026", "format": fmt, "pillar": pillar, "title": title,
                 "organic_reach": org, "paid_reach": paid_reach,
                 "organic_views": round(org * u(1.15, 1.8)), "paid_impressions": round(paid_reach * u(1.1, 1.5)) if boosted else 0,
                 "organic": organic, "paid": paid, "profile_visits": pv, "follows": round(pv * u(0.06, 0.2)),
                 "avg_watch_sec": watch, "video_length_sec": length, "completion_pct": completion,
                 "skip_rate_pct": round(min(70, max(15, 72 - completion * u(0.6, 1.0))), 1) if is_video else None,
                 "ad_spend_USD": round(paid_reach / 1000 * u(1.4, 3.2), 2) if boosted else 0.0, "campaign_id": None}
            month_posts.append(p)
        for k, p in enumerate(month_posts):
            p["id"] = f"{code}-{MONTH_NUM[month]:02d}{k + 1:02d}"

        # ----- account-level month -----
        followers = int(r["followers"])
        net = followers - prev_followers if prev_followers else None
        new_follows = round((net if net else followers * 0.035) * u(1.25, 1.6))
        acc = {"followers": followers, "followers_prev": prev_followers,
               "new_follows": new_follows, "unfollows": new_follows - net if net is not None else None,
               "profile_visits": round(new_follows / u(0.08, 0.2)),
               "organic_reach": org_month, "paid_reach": int(r["paid_reach"]),
               "posts_published": n_posts, "posts_planned": n_posts + rng.choice([0, 0, 1, 1, 2, 3, -1]),
               "ad_spend_USD": float(r["meta_ad_spend_KD"])}
        prev_followers = followers

        # ----- campaigns -----
        total_spend = acc["ad_spend_USD"]
        boosted = [p for p in month_posts if p["paid_reach"]]
        boost_spend = sum(p["ad_spend_USD"] for p in boosted)
        cap = total_spend * 0.45
        if boost_spend > cap:  # keep boosts within the monthly total
            f = cap / boost_spend
            for p in boosted:
                p["ad_spend_USD"] = round(p["ad_spend_USD"] * f, 2)
            boost_spend = sum(p["ad_spend_USD"] for p in boosted)
        plan = []
        if boosted:
            plan.append(("engagement", f"{month[:3]} post boosts", [p["id"] for p in boosted], round(boost_spend, 2)))
        remaining = round(total_spend - boost_spend, 2)
        objs = OBJECTIVES[brand]
        n_other = 1 if remaining < 160 or len(objs) == 1 else 2
        weights = [u(0.8, 1.2) for _ in range(n_other)]
        acc_alloc = 0
        for j in range(n_other):
            obj = objs[(j + mi) % len(objs)]
            v = round(remaining - acc_alloc, 2) if j == n_other - 1 else round(remaining * weights[j] / sum(weights), 2)
            acc_alloc += v
            plan.append((obj, rng.choice(CAMPAIGN_NAMES[obj]), [], v))
        by_id = {p["id"]: p for p in month_posts}
        for n, (obj, name, ids, spend) in enumerate(plan, 1):
            cid = f"{code}-{MONTH_NUM[month]:02d}C{n}"
            purchases = None
            if ids:
                impressions = sum(by_id[i]["paid_impressions"] for i in ids)
                reach = sum(by_id[i]["paid_reach"] for i in ids)  # not deduplicated across posts
                for i in ids:
                    by_id[i]["campaign_id"] = cid
                link_clicks = round(impressions * u(0.3, 1.0) / 100)
                lpv = round(link_clicks * u(0.55, 0.85))
            elif obj == "sales":
                purchases = round(spend / u(1.5, 3.6))
                lpv = round(purchases / u(0.025, 0.07))
                link_clicks = round(lpv / u(0.6, 0.85))
                impressions = round(link_clicks / u(0.009, 0.02))
                reach = round(impressions / u(1.6, 2.5))
            else:
                impressions = round(spend / u(2.2, 4.4) * 1000)
                reach = round(impressions / u(1.6, 2.5))
                link_clicks = round(impressions * (u(0.6, 2.0) if obj == "traffic" else u(0.3, 1.0)) / 100)
                lpv = round(link_clicks * u(0.55, 0.85))
            c = {"id": cid, "brand": brand, "period": month, "name": name, "objective": obj,
                 "budget_USD": max(round(spend * u(1.0, 1.15)), 1), "spend_USD": round(spend, 2),
                 "impressions": impressions, "reach": reach, "link_clicks": link_clicks, "landing_page_views": lpv,
                 "linked_posts": ids, "engagements": None, "purchases": None, "revenue_USD": None,
                 "conversion_tracking": None, "targets": {}}
            if obj == "engagement":
                c["engagements"] = sum(sum(by_id[i]["paid"].values()) for i in ids) if ids else round(spend / u(0.09, 0.24))
                c["targets"] = {"Engagement actions": round(spend / 0.15 / 10) * 10}
            elif obj == "traffic":
                c["targets"] = {"Landing page views": round(spend / 0.25 / 10) * 10, "Link clicks": round(spend / 0.2 / 10) * 10}
            else:
                if brand == "Sutis" and mi < 3:  # tracking set up from June: "insufficient data" before that
                    c["conversion_tracking"] = "Not set up"
                else:
                    c["conversion_tracking"] = "Pixel + Conversions API"
                    c["purchases"] = purchases
                    c["revenue_USD"] = round(purchases * u(6.5, 12.5), 2)
                c["targets"] = {"Purchases": round(spend / 2.2), "Revenue": round(spend * 4)}
            campaigns.append(c)
        acc["ad_budget_USD"] = sum(c["budget_USD"] for c in campaigns if c["brand"] == brand and c["period"] == month)
        ACCOUNTS[brand][month] = acc
        posts.extend(month_posts)

# ----- audience aggregates (synthetic) -----
AREAS = ["Salmiya", "Kuwait City", "Hawalli", "Jabriya", "Fintas", "Mangaf", "Mishref", "Shuwaikh"]
AUDIENCE = {}
for b in BRANDS:
    women = round(u(42, 68))
    ages = [u(5, 9), u(25, 38), u(26, 34), u(12, 18), u(5, 9), u(2, 4)]
    s = sum(ages)
    ages = [round(a / s * 100) for a in ages]
    ages[1] += 100 - sum(ages)
    areas = rng.sample(AREAS, 5)
    aw = sorted([u(8, 30) for _ in areas], reverse=True)
    peaks = [rng.choice([12, 13, 14]), rng.choice([20, 21, 22])]
    heat = []
    for d in range(7):
        weekend = d in (3, 4)  # Thu, Fri (week starts Sun)
        heat.append([round(min(100, max(0, sum(100 * math.exp(-((h - pk) ** 2) / 10) for pk in peaks) * u(0.55, 0.8) * (1.15 if weekend else 1) + u(0, 8)))) for h in range(24)])
    AUDIENCE[b] = {"gender": {"Women": women, "Men": 100 - women},
                   "age": dict(zip(["13-17", "18-24", "25-34", "35-44", "45-54", "55+"], ages)),
                   "countries": {"Kuwait": round(u(78, 90)), "Saudi Arabia": round(u(3, 7)), "UAE": round(u(2, 5)), "Other": 0},
                   "areas": {a: round(w, 1) for a, w in zip(areas, aw)}, "activity": heat}
    c = AUDIENCE[b]["countries"]
    c["Other"] = 100 - sum(v for k, v in c.items() if k != "Other")

# ----- fictional competitors (public, visible metrics only) -----
COMP_NAMES = ["Crumb & Co", "Brew Lane", "Saffron House", "The Daily Loaf", "Olive Table", "Gelato Corner", "Marina Grill",
              "Bayt Al Qahwa", "Hearth Kitchen", "Velvet Spoon", "Coastline Cafe", "Majlis Lounge", "Morning Batch",
              "Copper Pot", "Sugar Street", "Citrus Bowl", "Harbour Fish", "Golden Dallah", "Event Feast", "Noon Lounge"]
COMPETITORS = {}
pool = COMP_NAMES[:]
rng.shuffle(pool)
for i, b in enumerate(BRANDS):
    names = [pool[(i * 2 + k) % len(pool)] for k in range(3)]
    base = ACCOUNTS[b]["Aug 2026"]["followers"]
    comps = []
    for nme in names:
        f0 = round(base * u(0.5, 2.0))
        g = u(0.005, 0.045)
        months = {}
        for mi, m in enumerate(MONTHS):
            f = round(f0 * (1 + g) ** mi)
            months[m] = {"followers": f, "posts": rng.randint(10, 30), "avg_likes": round(f * u(0.008, 0.03)),
                         "avg_comments": round(f * u(0.0005, 0.002)), "reels_share": round(u(30, 80)),
                         "active_ads": rng.randint(0, 14)}
        comps.append({"name": nme, "handle": "@" + re.sub(r"[^a-z]", "", nme.lower()), "months": months,
                      "themes": rng.sample(["Breakfast", "Desserts", "Coffee", "Family offers", "Delivery deals", "Seasonal menu",
                                            "Chef stories", "Events", "Kids menu", "Healthy options"], 3)})
    COMPETITORS[b] = comps

block = (
    "/*DEMO_DATA_START*/\n"
    "// Synthetic demo data generated by tools/generate_demo_data.py. Not real results.\n"
    f"const MONTHS={json.dumps(MONTHS)};\n"
    f"const DATA={json.dumps(posts, ensure_ascii=False, separators=(',', ':'))};\n"
    f"const ACCOUNTS={json.dumps(ACCOUNTS, ensure_ascii=False, separators=(',', ':'))};\n"
    f"const CAMPAIGNS={json.dumps(campaigns, ensure_ascii=False, separators=(',', ':'))};\n"
    f"const AUDIENCE={json.dumps(AUDIENCE, ensure_ascii=False, separators=(',', ':'))};\n"
    f"const COMPETITORS={json.dumps(COMPETITORS, ensure_ascii=False, separators=(',', ':'))};\n"
    "/*DEMO_DATA_END*/"
)
html = HTML.read_text(encoding="utf-8")
if "/*DEMO_DATA_START*/" not in html:
    raise SystemExit("index.html has no DEMO_DATA markers")
html = re.sub(r"/\*DEMO_DATA_START\*/.*?/\*DEMO_DATA_END\*/", lambda _: block, html, flags=re.S)
HTML.write_text(html, encoding="utf-8")
print(f"{len(posts)} posts, {len(campaigns)} campaigns, {len(block) // 1024} KB")
