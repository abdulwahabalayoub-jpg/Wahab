# Handover: Microblogger Management & Restaurant Booking Platform

Prepared 20 November 2026 for continuing this project in Claude Code.

---

## 1. Read this first (for Claude Code)

**Who you are working with**
- Abdulwahab Al-Ayoub, Digital Marketing Specialist at **MNH Al-Hajery** (Hajery Group), Kuwait.
- He has **no coding experience**. Explain steps in plain language, give him exact commands to run, and avoid jargon.
- He builds hosted apps in **Replit** and is open to other hosting. He presents this to management.

**How he likes to work**
- Short, direct answers. Bullet points and clear structure.
- No em dashes in writing. Natural, human wording. No hype or marketing clichés.
- Work step by step. Leave decisions open when they can wait. Don't lock things in early.
- When you leave something out or skip data, say exactly what and why.
- Never upgrade plans, make payments or change subscriptions on his accounts. Only he does that.
- Don't open his browser to check things unless he asks.
- Arabic customer-facing copy (if needed later) should be in **Kuwaiti dialect**, shown side by side with English.

**What exists today**
- A working, clickable **prototype** in one HTML file: `prototype.html`. No build step, no server, no real database.
- It is published as a public Claude artifact (his link). Data is saved in each viewer's browser only (localStorage).
- `ORIGINAL_BRIEF.md` is his original full requirements document. This handover records every change made since.

**The likely next job**
Turn the prototype into a real app: React + TypeScript + Tailwind + Supabase (as the brief suggests), with real auth, database, OTP and later WhatsApp. See section 9.

---

## 2. Files in this handover

```
handover/
  HANDOVER.md            this document
  ORIGINAL_BRIEF.md      his original requirements (the starting brief)
  prototype.html         the full working prototype (open in any browser)
  assets/logos/
    MNH_Al-Hajery.pdf    company logo (vector, from Illustrator)
    danish-bakery.png  delfino.png  haagen-dazs.png  illy.png
    khaneen.png  solia.png  sutis.png     brand logos (1920x1920 PNG)
```

Run the prototype: open `prototype.html` in Chrome or Safari. That's it.
To reset its data: in the app go to **Settings → Integrations → Reset demo data**, or clear localStorage key `mbms-demo-v7`.

---

## 3. What the product is

A central platform for MNH's F&B marketing team to manage food microbloggers across all restaurant brands, replacing manual Instagram DMs.

Three experiences (switched by the dark "DEMO PROTOTYPE" bar at the top of the prototype):

1. **Registration page** (public, mobile-first). Bloggers apply.
2. **Admin dashboard** (desktop SaaS style). Marketing team manages everything.
3. **Blogger portal** (private, mobile-first). Approved bloggers open their personal link, verify by phone OTP, and book visits.

Most important goals (from the brief): no manual coordination, identity-based private booking, multi-restaurant management, real-time capacity that can never overbook.

---

## 4. Branding and restaurants

**Company**: MNH Al-Hajery, since 1946. Brand colours are **gold and white**.
- Logo gold: `#C2941B`. Darker gold used for buttons (readable white text): `#A67C12`, hover `#8C690F`. Light gold background: `#FBF5E6`.
- Grey in logo: `#616161`. App text: charcoal `#1f2328`.
- Admin: white/very light neutral, subtle borders, gold for primary buttons, active nav, progress bars, tabs.
- Blogger portal: warm off-white `#fbf8f4`, serif headings (Fraunces), Inter for body.

**Restaurants in the prototype** (logos embedded; descriptions and locations are placeholders he hasn't confirmed):

| Brand | Description used | Location used | Logo background |
|---|---|---|---|
| Solia | Mediterranean all-day dining | Shuwaikh | white |
| Khaneen | Modern Kuwaiti and Gulf home-style cooking | Sharq | white (navy circle logo) |
| Delfino | **Italian restaurant** (he corrected this; not seafood) | Salmiya | white (logo reads "Delfino Mayfair, Est. 1953") |
| Danish Bakery | Breads, pastries, cakes | Hawally | white |
| Häagen-Dazs | Ice cream and desserts | The Avenues | maroon `#600624` |
| illy | Italian espresso bar and café | Kuwait City | white |
| Sutis | Casual dining | Jabriya | white (logo reads "Emirgan Sütiş 1953") |

Open question: real descriptions and locations for each brand, and whether "Sutis" should display as "Emirgan Sütiş". Ask him with one fill-in template.

---

## 5. Everything the prototype does (feature inventory)

### 5.1 Registration (public)
- Phone-style screen with MNH logo and restaurant logos.
- Fields: full name, country code + phone (WhatsApp), Instagram username, Instagram URL (**optional**, auto-built from username if empty), "Add another platform" (TikTok, Snapchat, YouTube, X, Other) each with username + URL.
- No follower counts or analytics (per brief).
- Validation: name required (single word allowed), phone ≥ 7 digits, Instagram username required, **one account per phone number** (duplicate blocked).
- On submit: creates a **Pending** blogger with auto **system username** (`firstname_####`, unique) and **account ID** (`MB-######`, unique).
- Success screen shows 3 "what happens next" steps, plus presentation buttons:
  - **Review it in the admin dashboard** → opens that blogger's admin profile (Pending) to Approve/Reject.
  - **Or skip: approve & send link instantly** → shows the simulated WhatsApp message with the personal link, then **Open my personal link** → OTP → portal.

### 5.2 Admin dashboard
Collapsible sidebar: Overview, Microbloggers, Blogger Groups, Campaigns, Reservations, Restaurants, Settings.

**Overview**: 7 stats (total, pending, approved, active = link issued, active campaigns, confirmed reservations, upcoming visits), recent registrations, upcoming campaigns, upcoming visits table.

**Microbloggers**: search (name, username, phone, handle, account ID), filter by status and by group, table with name, username, phone, Instagram, other platforms, registered date, status, access. Inline Approve/Reject for pending.

**Blogger profile**: Approve, Reject, Suspend, Reactivate, Edit (name, phone, socials, notes; username and account ID are permanent), **Activate & issue link**, Revoke access, Copy link, **Open portal as blogger (demo)**, group chips (add/remove), reservation history, attendance history (attended, no-shows, cancelled, rate), message history.
- Approving auto-adds the blogger to "General Microbloggers".
- Issuing a link **auto-invites them to running campaigns** whose audience includes them.
- Suspending revokes the link and removes group memberships; reservations are kept.

**Blogger Groups**: an **"All bloggers"** page first (every approved blogger with their groups, add/remove from a dropdown, filter "Not in any group"), then the custom groups (General, Food, Lifestyle, Regular Collaborators, Priority). Create, rename, delete, add/remove members. A blogger can be in many groups.
- He asked whether "General" is still needed now that "All bloggers" exists. **Not decided yet.** Currently General is still the default group on approval.

**Campaigns**: filter tabs by status. Two campaign types (see 6.3 and 6.4). Detail page has actions by status (Edit, Launch, Pause, Resume, Close, Reopen, Cancel/Discard), stats, tabs: Invited bloggers (delivery status), Bookings (attendance actions), By restaurant (open type only), Message preview. "Send to new audience members" invites people added to target groups later. Single-type has an **overbooking test** button (fires remaining+1 simultaneous bookings, shows only the available number succeed).

**Reservations**: stats, search, filters (date scope, reservation status, attendance, restaurant), table per brief columns. Actions: Attended, No-show (enabled from visit start), Change (move to another campaign for single type; change restaurant/date/slot for open type), Cancel (releases the spot).

**Restaurants**: cards with logo, status, description, location, campaign count. Add/edit (name, description, location, image upload, placeholder colours, active toggle), activate/deactivate. Inactive restaurants can't be used for new campaigns.

**Settings**: Message outbox (all simulated WhatsApp messages, status "Queued (demo)"), default invitation template + default cancellation window, Integrations status (WhatsApp, OTP, Supabase all "Not connected"), Reset demo data, Data model tab.

### 5.3 Blogger portal (private)
- Step 1: personal link (`https://bloggers.yourdomain.com/p/<token>`, placeholder domain). Invalid, revoked and suspended links are refused with clear messages. "New blogger? Apply here" link.
- Step 2: enter registered phone number. Must match the account the link belongs to, so a forwarded link is useless.
- Step 3: 6-digit OTP (shown on screen in demo), 5 attempts max.
- Tabs: **Invitations**, **My bookings** (upcoming, previous visits, cancelled), **Account**.
- Single-type card: restaurant logo, date, time window, what's included chips, "X of Y spots remaining" with dots, states: Reserve / You're booked / FULLY BOOKED / Paused / Closed.
- Open-type card: grid of all restaurant logos, period, slots, chips, "1 of 2 visits used in November", **Choose a restaurant** → list of all restaurants with description and location → booking sheet (date + **time slot buttons** showing spots left / Fully booked / Passed) → confirmation with reference `RSV-XXXXXX`.
- Cancel allowed until the campaign's cancellation window (default 24h before visit).

---

## 6. Business rules (the important part)

### 6.1 Identity and access
- Every applicant gets a unique system username (`firstname_####`) and unique account ID. Never chosen by the blogger. Never changes.
- One account per phone number.
- Personal link is unique per blogger (random token). Link alone never grants access: phone number must match + OTP.
- Admin can revoke a link (instant) and issue a new one. Suspended accounts can't log in.
- Bloggers only ever see their own data.

### 6.2 Statuses
- Blogger: Pending, Approved, Rejected, Suspended. Access label: Not issued, Link active, Revoked.
- Campaign: Draft, Active, Paused, Closed, Cancelled, Completed (Active/Paused/Closed become Completed automatically after the end).
- Reservation: Confirmed, Cancelled, Completed, No-show.
- Attendance (tracked separately): Not marked, Attended, No-show. Marking Attended sets reservation to Completed.
- Invitation delivery: Prepared → Sent (simulated) → Delivered (simulated).

### 6.3 Single restaurant campaign
- One restaurant, one date, start-end time, **total spots**, optional "number of bloggers to invite" (limit), target groups and/or individual bloggers, description, instructions, message template, cancellation window.
- Only invited bloggers see it. One booking per blogger per campaign.
- Can't book when Paused/Closed/Cancelled/past. Capacity can be raised or lowered, but not below existing bookings.
- Cancelling a campaign cancels its confirmed reservations and queues notices.

### 6.4 Open invitation (all restaurants), added at his request
- Admin chooses which restaurants are included (all by default), **Available from / until** (defaults to the whole current month; quick buttons for this month / next month), and **time slots** (any number, e.g. 10–12, 2–4, 6–8; no overlaps).
- **Max visits per blogger per month** (default 2). Counted per **calendar month of the visit date**.
- **Max bloggers per restaurant per slot** (optional).
- Blogger picks restaurant → date (from tomorrow, inside the period) → slot.
- A blogger can't book the same restaurant twice on the same day.
- Open decisions he hasn't answered yet:
  - Can a blogger visit the **same restaurant twice in one month**? (Currently yes, just not the same day.)
  - Is the limit **per calendar month** or **rolling 30 days**? (Currently calendar month.)

### 6.5 What's included (both campaign types, all optional)
- **Guests allowed**: Not specified / Just the blogger / +1 / +2.
- **What we provide**: Nothing specified / **Table budget (KD)** / **Set menu (text)**. It's one or the other, never both (he was explicit about this).
- These appear in the invitation message (via `{offer}`), on the blogger's card, the booking sheet and the confirmation.

### 6.6 Invitation message
Default template (editable per campaign and in Settings):
```
Hi {name}!

We'd love to invite you to visit {restaurant}.

We have an upcoming microblogger invitation available.

{offer}You can access your personal invitation page through the link below, where you can view available restaurants, dates and reserve your visit.

{link}

Looking forward to seeing you!
```
Placeholders: `{name}` (first name), `{restaurant}` ("our restaurants" for open type), `{date}`, `{time}`, `{offer}` (bullet list of what's included), `{link}` (personal link).

### 6.7 Booking integrity (must hold in production)
- Never overbook. Two people taking the last spot at once: only one succeeds.
- One booking per blogger per single campaign; monthly limit for open type; per-slot cap for open type.
- Capacity updates instantly; cancelling restores it.

### 6.8 Messaging
- Nothing is actually sent. All messages go to the outbox as "Queued (demo)" and the UI says so. The brief says: never pretend WhatsApp messages were sent, and don't use unofficial WhatsApp automation.
- Planned automated messages: approval, rejection, personal access link, campaign invitation, booking confirmation, booking cancellation, visit reminder, campaign update.

---

## 7. Prototype code map (`prototype.html`, ~1,470 lines, vanilla JS, no framework)

Everything is in one file: `<style>`, then one `<script>`.

| Area | Key names |
|---|---|
| Storage | `KEY` (`mbms-demo-v7`; bump it to force a reseed), `DB` object, `save()`, `load()`, `seed()` |
| Embedded images | `LOGOS` (restaurant `image` banner 720x432 + `logo` 160x160, base64), `MNH_FULL`, `MNH_MARK` |
| Utils | `uid`, `mkToken`, `addDays`, `fmtD`, `fmtT`, `at(date,time)` |
| Data access | `bl`, `rs`, `cp`, `socialsOf`, `igOf`, `groupsOf`, `membersOf`, `hasAccess`, `audience(c)` |
| Campaign helpers | `isOpen`, `cStatus`, `campEnded`, `taken`, `remaining`, `slotsOf`, `slotLabel`, `offerType`, `offerLines`, `renderMsg` |
| Reservation helpers | `rInfo(r)` (normalises single vs open: restaurant, date, start, end), `resPast`, `resStarted`, `usedInMonth`, `dayCount(c,rid,date,slot)` |
| Generators | `genUsername`, `genAccountId`, `genRef` |
| Core logic | `reserveSpot(cid,bid,opts)`, `reserveOpen(...)`, `cancelReservation`, `canBloggerCancel`, `sendInvites`, `inviteOne`, `notify` |
| Admin UI | `renderAdmin` + `pgOverview`, `pgBloggers`, `pgBlogger`, `pgGroups`/`allGroupsView`, `pgCampaigns`, `pgCampaign`, `pgReservations`, `pgRestaurants`, `pgSettings`; forms `campaignForm`, `readCampaignForm`, `bloggerForm`, `restaurantForm`, `resEditForm` |
| Public/portal UI | `renderRegister`, `submitRegistration`, `renderPortal`, `portalApp`, `invCard`, `openCard`, `openChooser`, `pOpenSheet`, `slotPick`, `pResSheet` |
| Events | one object `A` of actions, triggered by `data-action="..."` attributes via a single delegated click listener; `input`/`change` listeners for filters and forms |
| State | `S` (current view/page/filters/portal step), `M` (modal scratch data) |

Data shapes in the prototype (camelCase here; use snake_case in Postgres):
- **blogger**: `id, accountId, username, name, cc, phone, status, createdAt, notes, access{token, issuedAt, revoked, revokedAt}, lastLogin`
- **social**: `id, bloggerId, platform, username, url, primary`
- **group**: `id, name, description`; **membership**: `groupId, bloggerId`
- **restaurant**: `id, name, description, location, colors[2], image, logo, active`
- **campaign** (common): `id, type ('single'|'open'), name, status, groupIds[], manualIds[], inviteLimit, cancelHours, guests ('',0,1,2), offerType ('','budget','menu'), budget, setMenu, description, instructions, message, createdAt, launchedAt`
  - single: `restaurantId, date, start, end, capacity`
  - open: `restaurantIds[], startDate, endDate, slots[{start,end}], perMonth, dailyCap (= per-slot cap), start/end (= first slot start / last slot end)`
- **invitation**: `id, campaignId, bloggerId, token, status, createdAt, message`
- **reservation**: `id, ref, campaignId, bloggerId, status, attendance, bookedAt, cancelledAt, cancelledBy, notes` + open-type: `restaurantId, date, time (slot start), slotEnd`
- **notification**: `id, bloggerId, type, channel ('WhatsApp'), message, createdAt, status`

Sample data: 22 bloggers (**first names only**; he asked to remove family names), 16 approved, 13 with links, 1 suspended, 1 rejected, 4 pending; 5 groups; 7 restaurants; 9 campaigns covering every status, including one open invitation with 3 slots and a 25 KD table budget.

---

## 8. Change log (decisions made with him, in order)

1. Built prototype from the brief as a Claude artifact (he chose this over Replit for the demo).
2. Delfino is an **Italian** restaurant (not seafood).
3. Blogger Groups needs an **All bloggers** page, not only groups.
4. Campaigns get **guests (+1/+2)**, and what's provided. All optional.
5. Added the 7 **brand logos**.
6. Added the **MNH Al-Hajery logo** and **gold + white** branding.
7. Removed **family names** from sample bloggers.
8. Registration shown from the **blogger's perspective** (phone layout) with the full journey to the portal.
9. New **Open invitation** campaign type: all restaurants, blogger chooses, **max 2 per month**.
10. Submit application → **review in admin → approve/reject** flow for presenting.
11. **Table budget OR set menu** (one choice, not both). **Whole-month periods** (e.g. 1–30 Nov). **Multiple time slots** per open invitation.

---

## 9. Recommended path to production

Suggested stack (from the brief): **React + TypeScript + Tailwind + Supabase**. He's comfortable with Replit for hosting; Vercel/Netlify also work. Confirm with him before choosing, and never sign him up for paid plans.

### 9.1 Steps
1. Scaffold Vite + React + TS + Tailwind. Recreate the 3 experiences as routes: `/apply`, `/admin/*`, `/p/:token`.
2. Port the design (colours in section 4, Inter + Fraunces) and components from the prototype.
3. Create the Supabase schema (9.2), RLS policies (9.3) and the booking functions (9.4).
4. Admin auth: Supabase email login for marketing staff (`administrators` table).
5. Blogger auth: personal link token → phone match → OTP. Use Supabase Auth phone OTP (needs an SMS/WhatsApp provider such as Twilio) and bind the auth user to the blogger row on first verified login.
6. Messaging: build an outbox table + a worker (Supabase Edge Function) that later sends via **WhatsApp Business Platform (Cloud API)** with approved templates. Until connected, keep "queued, not sent" in the UI.
7. Storage bucket for restaurant images/logos.
8. Replace seed data with a small SQL seed for demos.
9. Test the race condition (two bookings for the last spot) against the real database.

### 9.2 Schema draft (Postgres / Supabase)
```sql
create type blogger_status as enum ('pending','approved','rejected','suspended');
create type campaign_type as enum ('single','open');
create type campaign_status as enum ('draft','active','paused','closed','cancelled','completed');
create type reservation_status as enum ('confirmed','cancelled','completed','no_show');
create type attendance_status as enum ('not_marked','attended','no_show');
create type offer_type as enum ('none','budget','menu');

create table administrators (
  id uuid primary key references auth.users(id),
  name text not null, email text unique not null, role text default 'admin'
);

create table bloggers (
  id uuid primary key default gen_random_uuid(),
  account_id text unique not null,              -- MB-######
  username text unique not null,                -- firstname_####
  full_name text not null,
  phone_cc text not null, phone text not null,
  status blogger_status not null default 'pending',
  access_token text unique,                     -- personal link token
  access_issued_at timestamptz, access_revoked_at timestamptz,
  auth_user_id uuid unique references auth.users(id),  -- set after first OTP login
  notes text, last_login_at timestamptz,
  created_at timestamptz default now(),
  unique (phone_cc, phone)
);

create table social_accounts (
  id uuid primary key default gen_random_uuid(),
  blogger_id uuid not null references bloggers(id) on delete cascade,
  platform text not null, username text not null, profile_url text,
  is_primary boolean default false
);

create table blogger_groups (id uuid primary key default gen_random_uuid(), name text unique not null, description text);
create table blogger_group_memberships (
  group_id uuid references blogger_groups(id) on delete cascade,
  blogger_id uuid references bloggers(id) on delete cascade,
  primary key (group_id, blogger_id)
);

create table restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null, description text, location text, image_url text, logo_url text,
  is_active boolean default true
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  type campaign_type not null default 'single',
  name text not null, status campaign_status not null default 'draft',
  -- single
  restaurant_id uuid references restaurants(id), visit_date date, start_time time, end_time time, capacity int,
  -- open
  start_date date, end_date date, per_month_limit int, per_slot_cap int,
  -- common
  invite_limit int, cancel_hours int default 24,
  guests smallint, offer offer_type default 'none', budget_kd numeric(8,3), set_menu text,
  description text, instructions text, message_template text,
  created_at timestamptz default now(), launched_at timestamptz,
  check ((type='single' and restaurant_id is not null and visit_date is not null and capacity > 0)
      or (type='open' and start_date is not null and end_date >= start_date and per_month_limit > 0)),
  check ((offer='budget' and budget_kd is not null and set_menu is null)
      or (offer='menu' and set_menu is not null and budget_kd is null)
      or (offer='none'))
);
create table campaign_restaurants (campaign_id uuid references campaigns(id) on delete cascade, restaurant_id uuid references restaurants(id), primary key (campaign_id, restaurant_id));
create table campaign_slots (id uuid primary key default gen_random_uuid(), campaign_id uuid references campaigns(id) on delete cascade, start_time time not null, end_time time not null, check (end_time > start_time));
create table campaign_target_groups (campaign_id uuid references campaigns(id) on delete cascade, group_id uuid references blogger_groups(id) on delete cascade, primary key (campaign_id, group_id));
create table campaign_target_bloggers (campaign_id uuid references campaigns(id) on delete cascade, blogger_id uuid references bloggers(id) on delete cascade, primary key (campaign_id, blogger_id));

create table campaign_invitations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  blogger_id uuid not null references bloggers(id) on delete cascade,
  token text unique not null default encode(gen_random_bytes(16),'hex'),
  delivery_status text default 'prepared', sent_at timestamptz, created_at timestamptz default now(),
  unique (campaign_id, blogger_id)
);

create table reservations (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  campaign_id uuid not null references campaigns(id),
  blogger_id uuid not null references bloggers(id),
  restaurant_id uuid not null references restaurants(id),   -- copied from campaign for single type
  visit_date date not null,
  slot_id uuid references campaign_slots(id),               -- open type
  status reservation_status not null default 'confirmed',
  booked_at timestamptz default now(), cancelled_at timestamptz, cancelled_by text, notes text
);
-- one active booking per blogger per single campaign is enforced in the booking function;
-- plus: no double booking of the same restaurant/day for a blogger
create unique index one_per_blogger_restaurant_day on reservations (campaign_id, blogger_id, restaurant_id, visit_date) where status <> 'cancelled';

create table attendance_records (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid unique not null references reservations(id) on delete cascade,
  status attendance_status not null default 'not_marked',
  marked_by uuid references administrators(id), marked_at timestamptz
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  blogger_id uuid references bloggers(id) on delete cascade,
  type text not null, channel text default 'whatsapp', body text not null,
  status text default 'queued', provider_message_id text, created_at timestamptz default now()
);
```

### 9.3 Access rules (RLS)
- Enable RLS on every table.
- Admins (user id in `administrators`): full read/write.
- Bloggers (session's `auth.uid()` = `bloggers.auth_user_id`, status approved, link not revoked): read their own blogger row, social accounts, invitations, reservations; read campaigns they're invited to; read active restaurants. **No direct insert/update on reservations**: bookings and cancellations only through the functions below.
- Public (anon): only the registration insert (via a `security definer` function that also generates username/account ID and blocks duplicate phones).

### 9.4 Booking functions (prevent overbooking)
- `book_single(campaign_id)` and `book_open(campaign_id, restaurant_id, visit_date, slot_id)` as `security definer` Postgres functions.
- Inside one transaction: `select ... from campaigns where id = $1 for update` (row lock), verify status active, invitation exists, blogger approved and link active, then check:
  - single: count of non-cancelled reservations < capacity, and blogger has none for this campaign.
  - open: date within period and from tomorrow; slot belongs to campaign; blogger's non-cancelled count in that calendar month < `per_month_limit`; count for restaurant+date+slot < `per_slot_cap` (if set).
- Insert reservation with a unique reference, insert attendance row, enqueue confirmation notification.
- `cancel_reservation(reservation_id)`: blogger allowed only before `cancel_hours`; admin anytime.
- Use Supabase Realtime on `reservations` so remaining spots update live on open screens.

---

## 10. Known limits of the prototype (by design)
- Data lives in each browser. Shared viewers don't see each other's changes.
- OTP code is shown on screen; no SMS/WhatsApp is sent.
- No admin login screen.
- Personal link domain `bloggers.yourdomain.com` is a placeholder.
- Restaurant descriptions/locations are placeholders.
- Overbooking safety is simulated in single-threaded JS; production must use the DB functions in 9.4.
- Not built (future, per brief section 18): analytics, follower/engagement tracking, scoring, ROI reports, recommendations, content submission, table management.

---

## 11. Open questions to raise with him (one message, fill-in style)
1. Keep the "General Microbloggers" group or remove it now that "All bloggers" exists?
2. Open invitation: same restaurant twice in one month allowed? Limit per calendar month or rolling 30 days?
3. Real description and location for each of the 7 brands. Display name for Sutis.
4. Add the other MNH brands too (Danish Bakery Catering, Bait Jafra, Damloj)?
5. Hosting choice for the real build (Replit or another).
6. Real domain for personal links.
7. Arabic version of the blogger pages (Kuwaiti dialect)?

---

## 12. Suggested first prompt to paste into Claude Code

> Read HANDOVER.md, ORIGINAL_BRIEF.md and prototype.html in this folder. The prototype is the approved design and behaviour. Plan the production build (React + TypeScript + Tailwind + Supabase) following section 9, keeping every rule in section 6. Show me the plan in short bullet points first, then build it step by step. I don't code, so tell me exactly what to run and what to click.

## 13. Later change (mock-up, `microblogger/mockup.html`)
12. Friendlier look (gold and white, emoji icons, greeting, action cards).
13. **No default groups.** The sample groups (General, Food, Lifestyle, Regular, Priority) were removed. Everyone is just a blogger. Campaigns can target "All approved bloggers" (`everyone` flag) or individual bloggers. Groups are an optional feature: the Groups page has a "Create a group" button, and group filters and group boxes only appear once at least one group exists. Storage key bumped to `mbms-demo-v8`.
14. **Blogger journey page** (admin sidebar, "📱 Blogger journey"). Storyboard of the real portal screens for a one-restaurant campaign (7 steps) and an open invitation (8 steps), built from the live campaign settings. "Try it live" opens the real portal as a sample blogger. Overview stat tiles are clickable and open the filtered list behind each number.
15. Mock-up now starts with **no campaigns, invitations, reservations or messages**. Sample bloggers (22) and restaurants (7) are kept. Storage key bumped to `mbms-demo-v9`.
16. Open invitation: the tables limit is now set **per time slot** in the same row (dropdown 1 to 20 or No limit; one table = one blogger per restaurant). Stored as `cap` on each slot. Replaces the single 'max bloggers per restaurant per slot' field.
17. **Campaign form unified.** Single restaurant visit and open invitation now share one layout: name, restaurant(s), then time slot rows. Single rows: visit date, start, end, number of tables (1 to 20); a single campaign can have several dates and slots. Open rows: start, end, tables (or no limit). Total tables is calculated automatically. Guests and table budget or set menu sit directly under the slots. A blogger books one slot per single campaign; stored on the reservation as restaurant, date, time and slot end (same shape for both types). Per-slot capacity is enforced with `slotLeft`.
18. Removed the 'Number of bloggers to invite' field. The Audience section (all approved bloggers, groups, individual bloggers) is the only place to choose who is invited.

## 14. Requirement for the live build (not in the mock-up or the video)
19. **Google Sheets sync for restaurants.** Each restaurant gets a Google Sheet that fills in automatically from confirmed reservations. Per visit it shows: date and time, blogger name, phone number, number of guests, and what is provided (table budget in KD or a set menu), plus status. Restaurants can see each day how many bloggers will attend and who they are. Updates when a booking is made, changed or cancelled. To plan: Google Sheets API with a service account, one sheet or tab per restaurant, written from a database trigger or the booking functions. Also add a "Google Sheets" row to Settings > Integrations ("Not connected") in the mock-up when we next update it.

20. **Blogger sign-in options (decision for management).** Personal link + phone match stay. After that, three modes, switchable in Settings > Blogger sign-in: (a) code every time, (b) password after the first code (code only for first sign-in and resets), (c) both, blogger chooses. Reason: a code on every sign-in is a paid SMS/WhatsApp message each time; a password removes the recurring cost. The mock-up also has a phone-only login page ("Lost your link?"), a "set your password" step after the first code, and a cost comparison with editable numbers. Passwords in the mock-up are demo-only; production uses real auth (Supabase) with hashed passwords, rate limits and lockout. Demo accounts have password `demo1234`. Storage key is now `mbms-demo-v10`.
21. Sign-up form now asks for **nationality** (required dropdown). Stored on the blogger, shown in the Microbloggers table and profile, editable by admins, and included in search. Sample bloggers have nationalities.
    The field is a **text box**: the blogger types their country, with suggestions (Kuwait, Saudi Arabia, Bahrain and so on) that appear as they type. Any country can be typed. The text is tidied (spaces, capital letters) and stored as the nationality. The sign-up label is 'Nationality', with the placeholder 'Type your country'.

22. **Fresh workspace build (behaves like the finished product).** `mockup-fresh.html` is the same app with `FRESH=true`: only the 7 restaurants, no bloggers, campaigns, reservations or messages, and its own storage key (`mbms-fresh-v1`). In this mode all presentation helpers are off: no checklist or welcome card, no "Demo" boxes, no fill-in buttons, no blank-Continue shortcuts, no "approve instantly" button on the sign-up result, no Blogger journey page, no "open portal as blogger" button. Links, phone numbers and codes must be entered correctly. Messages show "Queued, not sent". The only simulation left is the one-time code, shown on screen because no SMS/WhatsApp is connected. To rebuild it from `mockup.html`, change `const FRESH=false;` to `true`. First-time bloggers (no password yet) land on the Code tab at sign-in.
    In the fresh build the blogger portal opens directly on **phone number + password** sign-in (no link to paste). The password is the decided option for the live build (a code on every sign-in costs a paid message each time). A blogger with no password yet gets one code to confirm the phone, then must create a password (no skip). After that, sign-in costs no codes. Only approved bloggers with an active account can sign in; other numbers see a generic 'couldn't find an active account' message.
    Sign-in messages are specific: not registered (with an 'Apply to join' button), application under review (a calm note, not an error), rejected, suspended, or not active yet. Note for production: telling a stranger that a number is registered or pending leaks a little information. Options are to rate-limit attempts, or to show one generic message until the phone is verified with a code.
23. **Presentation mode** (Settings > Blogger sign-in, on by default in the mock-up). The blogger portal accepts any phone number and password with no errors: it uses the blogger with that phone, else the newest blogger, else creates a 'Guest Blogger', and activates the account if needed. Turn it off to show the real checks (numbers, passwords, codes, account states). Not part of the live build.
24. Choosing **Set menu** in a campaign no longer asks for a description. It is just a choice: the invitation, booking and admin screens show "Set menu".
25. **Campaign name is optional.** If left empty, the name is made automatically: 'Solia · 4 Dec 2026' (one restaurant) or 'Open invitation · November' (open). Useful for general campaigns that just fill a restaurant.
26. **Blogger profile shows upcoming visits and history separately.** 'Upcoming visits' lists confirmed future bookings in date order (date, time, restaurant, campaign, reference, what is provided, and 'In 3 days'), plus campaigns the blogger is invited to but has not booked. 'History' lists past, completed, no-show and cancelled visits. The Microbloggers list has a 'Next visit' column. Clicking a blogger's name in a campaign's invited list opens the same profile.

## 15. Decisions and open items from the 4-role review (27 Nov 2026)
- **Guests:** the team decides how many people a blogger can bring (set per campaign: just the blogger, +1 or +2). Bloggers are not asked at booking.
- **Open item, attendance / no-show check (revisit later):** idea from Abdulwahab: 72 hours after each visit's date and time, check Instagram to see if the blogger sent a DM, tagged or mentioned the restaurant. If nothing is found, flag the booking as "possible no-show / no content" for the team to confirm. To explore: Meta's official Instagram API on the brands' business accounts (messages, mentions and tags; story mentions only last 24 hours). No unofficial scraping. A missing post does not prove a no-show, so a person confirms before marking it.

## 16. Review replies, batch 1 (done in the mock-up, 27 Nov 2026)
- T2: one visit per blogger per day, across all campaigns and restaurants (booking, open invitations and admin changes).
- T6 / D1: "tables" everywhere; campaign types are "One restaurant" and "Open invitation" everywhere.
- T7: no "personal link" wording. Both versions open on phone + password sign-in. "Activate & issue link" is now "Activate account"; the profile card is "Portal access". The {link} in messages is the sign-in page.
- D2: campaign tiles are Total tables / Booked / Tables left / Invitations sent; zero counts are hidden.
- G1: "Save & launch" and "Launch" ask first ("Send this invitation to 13 bloggers on WhatsApp now?").
- G2: the individual bloggers list is hidden while "All approved bloggers" is ticked.
- G3: Duplicate button on every campaign.
- G5: overbooking test hidden in the real-product version.
- G6: optional reason when rejecting an application or cancelling a reservation.
- G7: new campaigns cannot use time slots in the past; profile shows a red "no-shows" badge.
- O9: "Arrive any time between 2 PM and 4 PM" on the booking, the confirmation and the WhatsApp confirmation.
- M2: live message preview in the campaign form.
- M4: optional email on sign-up (shown and editable in the admin).
- M7: "Invite to a campaign" button on the blogger profile.
- M8: confirmation shows arrival time, phone, "Open in Google Maps" and "Add to calendar"; the WhatsApp confirmation includes the Google Maps link. Restaurants have optional phone and Google Maps link fields.
- S1: "Today's visits" card first on the Overview. S2: visits this week on each restaurant card. S3: upcoming visits and open-invitation visits left on the blogger's home. S6: Today / Tomorrow / This week on Reservations, grouped by restaurant.
