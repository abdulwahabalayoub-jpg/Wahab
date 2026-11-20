import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, prog, sans, serif, typed, useCurrentFrame, useFormat } from "../theme";
import { Avatar, BRANDS, BrandLogo, Btn, Cursor, Field, PBtn, PHello, Phone, Pop, Reveal, Stage, Status, Win } from "../ui";

/* 1. Title */
export const Title: React.FC = () => {
  const f = useCurrentFrame();
  const port = useFormat() === "port";
  const line = prog(f, 20, 40);
  return (
    <AbsoluteFill style={{ fontFamily: sans, background: `radial-gradient(1200px 800px at 50% 30%, #fff1cf 0%, rgba(255,241,207,0) 65%), ${C.cream}`, alignItems: "center", justifyContent: "center" }}>
      <Reveal d={0} style={{ position: "absolute", top: port ? 260 : 130 }}>
        <Img src={staticFile("mnh_full.png")} style={{ width: port ? 420 : 330 }} />
      </Reveal>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Reveal d={10}>
          <div style={{ fontSize: 28, letterSpacing: 6, color: C.goldDD, fontWeight: 600, textTransform: "uppercase" }}>MNH Al-Hajery · F&B Marketing</div>
        </Reveal>
        <Reveal d={18}>
          <h1 style={{ fontFamily: serif, fontWeight: 600, fontSize: port ? 98 : 118, lineHeight: 1.02, letterSpacing: -3, margin: "24px 0 0", color: C.ink }}>Microblogger<br />Management System</h1>
        </Reveal>
        <div style={{ width: 360 * line, height: 5, background: C.gold, borderRadius: 9, margin: "34px auto 0" }} />
        <Reveal d={44}>
          <p style={{ fontSize: port ? 40 : 36, color: C.ink2, margin: "30px 60px 0" }}>One place to invite, book and track every food creator visit</p>
        </Reveal>
      </div>
      <div style={{ position: "absolute", bottom: port ? 220 : 100, left: port ? 150 : 0, right: port ? 150 : 0, display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center" }}>
        {BRANDS.map((b, i) => (
          <Pop key={b} d={58 + i * 5}><BrandLogo name={b} size={port ? 130 : 96} /></Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* 2. Problem */
const DMS = [
  { t: "Hi! Can I collaborate with Solia? 🙏", from: "left", y: 0 },
  { t: "Which dates are free this month?", from: "right", y: 1 },
  { t: "Can I bring a +1?", from: "left", y: 2 },
  { t: "Sent you my details on WhatsApp too!", from: "right", y: 3 },
  { t: "Hello? Is the invitation still open?", from: "left", y: 4 },
] as const;

export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const port = useFormat() === "port";
  const pains = ["Replying to every DM by hand", "Copying details into spreadsheets", "Chasing dates and confirmations", "Risk of double bookings"];
  return (
    <Stage
      side="both"
      title="Today, collaborations run on Instagram DMs"
      sub="Every request is answered, approved and scheduled by hand."
      extra={
        <div style={{ marginTop: 34, display: "grid", gap: 14 }}>
          {pains.map((p, i) => {
            const strike = prog(f, 120 + i * 14, 18);
            return (
              <Reveal key={p} d={50 + i * 12} y={14}>
                <div style={{ fontSize: 29, color: C.ink, position: "relative", display: "inline-block" }}>
                  <span style={{ color: C.red, marginRight: 14 }}>✕</span>{p}
                  <span style={{ position: "absolute", left: 0, top: "56%", height: 3, width: `${strike * 100}%`, background: C.red }} />
                </div>
              </Reveal>
            );
          })}
        </div>
      }
    >
      <div style={{ width: 640, display: "grid", gap: 20, scale: port ? "1.45" : "1" }}>
        <Reveal d={4}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
            <div style={{ width: 62, height: 62, borderRadius: 18, background: "linear-gradient(135deg,#f9a54a,#d6249f 60%,#6a3df0)", display: "grid", placeItems: "center", fontSize: 32 }}>📸</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>Instagram · Direct messages</div>
          </div>
        </Reveal>
        {DMS.map((m, i) => {
          const p = prog(f, 14 + i * 16, 22);
          const right = m.from === "right";
          return (
            <div key={m.t} style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start", opacity: p, translate: `${(1 - p) * (right ? 60 : -60)}px 0` }}>
              <div style={{ maxWidth: 520, padding: "18px 26px", borderRadius: 28, fontSize: 26, lineHeight: 1.3, background: right ? C.goldD : "#fff", color: right ? "#fff" : C.ink, border: right ? "none" : `1px solid ${C.line}`, boxShadow: "0 12px 28px rgba(59,42,26,.1)" }}>
                {m.t}
              </div>
            </div>
          );
        })}
        <Reveal d={110}>
          <div style={{ marginTop: 6, textAlign: "center", fontSize: 26, color: C.red, fontWeight: 600 }}>…and the same again tomorrow</div>
        </Reveal>
      </div>
    </Stage>
  );
};

/* 3. Overview */
export const Overview: React.FC = () => {
  const f = useCurrentFrame();
  const port = useFormat() === "port";
  const cards = [
    { e: "📱", t: "Apply", s: "Bloggers register once", who: "Blogger" },
    { e: "🖥️", t: "Manage", s: "Approve, invite, track", who: "Marketing team" },
    { e: "🎟️", t: "Book", s: "Private link, real-time spots", who: "Blogger" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: sans, background: `radial-gradient(1100px 700px at 50% 0%, #fff0c9 0%, rgba(255,240,201,0) 62%), ${C.cream}`, alignItems: "center" }}>
      <div style={{ marginTop: port ? 170 : 150, textAlign: "center", padding: port ? "0 60px" : 0 }}>
        <Reveal d={0}><h1 style={{ fontFamily: serif, fontWeight: 600, fontSize: port ? 84 : 92, letterSpacing: -2, margin: 0, color: C.ink }}>One platform. Three experiences.</h1></Reveal>
        <Reveal d={14}><p style={{ fontSize: port ? 38 : 34, color: C.ink2, marginTop: 22 }}>The whole collaboration, from the first application to the visit.</p></Reveal>
      </div>
      <div style={{ display: "flex", flexDirection: port ? "column" : "row", alignItems: "center", gap: port ? 14 : 36, marginTop: port ? 70 : 90 }}>
        {cards.map((c, i) => {
          const p = prog(f, 34 + i * 20, 26);
          return (
            <React.Fragment key={c.t}>
              <div style={{ width: port ? 880 : 460, padding: port ? "30px 40px" : "44px 40px", borderRadius: 36, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 30px 60px rgba(59,42,26,.12)", opacity: p, translate: `0 ${(1 - p) * 40}px`, textAlign: "center" }}>
                <div style={{ width: 120, height: 120, borderRadius: 34, background: C.goldBg, display: "grid", placeItems: "center", fontSize: 62, margin: "0 auto 26px" }}>{c.e}</div>
                <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 600 }}>{c.t}</div>
                <div style={{ fontSize: 28, color: C.ink2, margin: "10px 0 22px" }}>{c.s}</div>
                <div style={{ display: "inline-block", padding: "8px 22px", borderRadius: 99, fontSize: 22, fontWeight: 600, background: c.who === "Blogger" ? "#fff" : C.goldD, color: c.who === "Blogger" ? C.goldDD : "#fff", border: `2px solid ${C.goldD}` }}>{c.who}</div>
              </div>
              {i < 2 ? <div style={{ fontSize: port ? 44 : 60, color: C.gold, opacity: p }}>{port ? "↓" : "→"}</div> : null}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 4. Apply */
export const Apply: React.FC = () => {
  const f = useCurrentFrame();
  const done = prog(f, 168, 16);
  return (
    <Stage side="blogger" title="Step 1. A blogger applies in under a minute" bullets={["Shared as a public link", "Name, phone and Instagram only", "One account per phone number"]} bulletsAt={36}>
      <Phone>
        <div style={{ position: "absolute", inset: 0, paddingTop: 56, opacity: 1 - done }}>
          <div style={{ padding: "8px 22px" }}>
            <Img src={staticFile("mnh_full.png")} style={{ width: 130 }} />
            <div style={{ marginTop: 16 }}><PHello size={32}>Microblogger Collaborations 🍽️</PHello></div>
            <div style={{ color: C.ink2, fontSize: 17, margin: "8px 0 18px" }}>Apply to be invited to visit our restaurants.</div>
            <div style={{ display: "grid", gap: 14 }}>
              <Field label="Full name" value={typed("Ahmed Al Salem", f, 30)} caret={f > 28 && f < 72} size={19} />
              <Field label="Phone (WhatsApp)" value={typed("+965 5430 2707", f, 76, 18)} caret={f >= 72 && f < 108} size={19} />
              <Field label="Instagram username" value={typed("@ahmed.eats.kw", f, 112, 18)} caret={f >= 108 && f < 146} size={19} />
            </div>
            <div style={{ margin: "16px 0", padding: "12px 0", textAlign: "center", border: `1.5px dashed ${C.line}`, borderRadius: 99, fontSize: 17, color: C.ink2 }}>＋ Add another platform</div>
            <PBtn>Submit application</PBtn>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, paddingTop: 56, opacity: done, translate: `0 ${(1 - done) * 20}px` }}>
          <div style={{ padding: "90px 28px", textAlign: "center" }}>
            <div style={{ width: 96, height: 96, borderRadius: 99, background: "#e6f1ea", color: C.green, display: "grid", placeItems: "center", fontSize: 52, margin: "0 auto 24px" }}>✓</div>
            <PHello size={34}>Application received</PHello>
            <div style={{ color: C.ink2, fontSize: 19, margin: "14px 0 24px", lineHeight: 1.4 }}>Our team will review it and get back to you.</div>
            <Status kind="pending" label="⏳ Awaiting review" />
          </div>
        </div>
        <Cursor keys={[[100, 300, 600], [150, 200, 598], [164, 200, 598], [200, 260, 700]]} clicks={[164]} />
      </Phone>
    </Stage>
  );
};

/* 5. Approve */
export const Approve: React.FC = () => {
  const f = useCurrentFrame();
  const approved = f >= 76;
  const gen = prog(f, 88, 20);
  const link = prog(f, 150, 20);
  const rows = [["Ahmed Al Salem", "@ahmed.eats.kw"], ["Mohammed Al Enezi", "@mo.foodiekw"], ["Layla Hassan", "@layla.bites"]];
  return (
    <Stage side="admin" title="Step 2. Review, approve, issue a private link" bullets={["Every application in one list", "System username and ID are generated", "One unique link per blogger, revocable"]} bulletsAt={30}>
      <Win active="Microbloggers" focus={[[0, 500, 350, 1], [26, 610, 250, 1.5], [96, 610, 390, 1.5]]}>
        <div style={{ padding: "26px 30px" }}>
          <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 600 }}>🤳 Microbloggers</div>
          <div style={{ color: C.mute, fontSize: 16, margin: "4px 0 18px" }}>New applications</div>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 20, overflow: "hidden" }}>
            {rows.map(([n, h], i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: i < 2 ? `1px solid #f3ecda` : "none", background: i === 0 && f > 20 && f < 76 ? "#fdf8e8" : "#fff" }}>
                <Avatar name={n} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 19 }}>{n}</div>
                  <div style={{ color: C.mute, fontSize: 15 }}>{h}</div>
                </div>
                {i === 0 && !approved ? <Btn style={{ padding: "8px 20px", fontSize: 16 }}>Approve</Btn> : null}
                {i === 0 && approved ? <Status kind="approved" /> : <Status kind="pending" />}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 20, opacity: gen, translate: `0 ${(1 - gen) * 16}px` }}>
            <div style={{ flex: 1, background: C.goldBg, borderRadius: 18, padding: "16px 20px", border: `1px solid ${C.line}` }}>
              <div style={{ fontSize: 14, color: C.goldDD, fontWeight: 600, letterSpacing: 1 }}>GENERATED AUTOMATICALLY</div>
              <div style={{ fontSize: 20, marginTop: 8 }}>Account ID <b>MB-482913</b></div>
              <div style={{ fontSize: 20, marginTop: 4 }}>Username <b>ahmed_4821</b></div>
            </div>
            <div style={{ display: "grid", placeItems: "center" }}>
              {f < 150 ? <Btn style={{ fontSize: 18 }}>Activate & issue link</Btn> : <Status kind="active" />}
            </div>
          </div>
          <div style={{ marginTop: 16, opacity: link, translate: `0 ${(1 - link) * 12}px`, background: "#f4efe2", borderRadius: 16, padding: "14px 20px", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 17, color: C.ink2 }}>
            🔗 https://bloggers.yourdomain.com/p/mfj8a8ftgqhdm4g
          </div>
        </div>
        <Cursor keys={[[10, 600, 520], [44, 595, 148], [76, 595, 148], [120, 650, 412], [150, 650, 412], [190, 760, 560]]} clicks={[76, 150]} />
      </Win>
    </Stage>
  );
};

