import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { C, prog, serif, typed } from "../theme";
import { BRANDS, BrandLogo, Btn, Count, Cursor, Field, PBtn, PHello, Phone, Reveal, Stage, Win } from "../ui";

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: "13px 18px", borderRadius: 14, border: `1.5px solid #e3dccb`, background: "#fff", fontSize: 18, flex: 1, whiteSpace: "nowrap" }}>{children}</div>
);

const SlotRow: React.FC<{ d: number; date?: string; a: string; b: string; n: number }> = ({ d, date, a, b, n }) => {
  const f = useCurrentFrame();
  const p = prog(f, d, 18);
  const box: React.CSSProperties = { flex: 1, padding: "11px 16px", borderRadius: 12, border: "1.5px solid #e3dccb", background: "#fff", fontSize: 18 };
  return (
    <div style={{ display: "flex", gap: 10, opacity: p, translate: `0 ${(1 - p) * 14}px`, marginBottom: 10 }}>
      {date ? <div style={{ ...box, flex: 1.3 }}>{date}</div> : null}
      <div style={box}>{a}</div>
      <div style={box}>{b}</div>
      <div style={{ ...box, flex: 1.1, borderColor: C.gold, background: C.goldBg, fontWeight: 600 }}>{n} tables</div>
    </div>
  );
};

const Labels: React.FC<{ single: boolean }> = ({ single }) => (
  <div style={{ display: "flex", gap: 10, fontSize: 14, color: C.mute, marginBottom: 6 }}>
    {single ? <div style={{ flex: 1.3 }}>Visit date</div> : null}
    <div style={{ flex: 1 }}>Start time</div>
    <div style={{ flex: 1 }}>End time</div>
    <div style={{ flex: 1.1 }}>Number of tables</div>
  </div>
);

/* 6. Create campaign */
export const Campaign: React.FC = () => {
  const f = useCurrentFrame();
  const openP = prog(f, 200, 16);
  const toast = prog(f, 312, 16);
  const tab = (on: boolean): React.CSSProperties => ({ flex: 1, padding: "13px 18px", borderRadius: 16, fontSize: 18, fontWeight: 600, border: `2px solid ${on ? C.goldD : C.line}`, background: on ? C.goldBg : "#fff", color: C.ink });
  return (
    <Stage side="admin" title="Step 3. Create a campaign in one form" sub="One restaurant, or open to every restaurant. Same simple layout." bullets={["Tables per time slot, total added up for you", "Guests and table budget in the same place", "Choose exactly who is invited"]} bulletsAt={60}>
      <Win active="Campaigns">
        <div style={{ padding: "22px 28px", position: "relative", height: "100%" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ ...tab(openP < 0.5) }}>📍 One restaurant visit</div>
            <div style={{ ...tab(openP >= 0.5) }}>🗓️ Open invitation</div>
          </div>

          {/* single layer */}
          <div style={{ position: "absolute", left: 28, right: 28, top: 94, opacity: 1 - openP }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
              <div style={{ flex: 1 }}><Field label="Campaign name" value={typed("Autumn Menu Tasting", f, 16, 20)} caret={f > 14 && f < 54} size={18} /></div>
              <div style={{ flex: 1 }}><Field label="Restaurant" value="Solia" size={18} /></div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: 1.2, color: C.mute, margin: "16px 0 8px" }}>TIME SLOTS AND TABLES</div>
            <Labels single />
            <SlotRow d={58} date="Sat 28 Nov" a="2:00 PM" b="4:00 PM" n={5} />
            <SlotRow d={76} date="Sat 28 Nov" a="6:00 PM" b="8:00 PM" n={5} />
            <div style={{ display: "flex", justifyContent: "flex-end", opacity: prog(f, 96, 14) }}>
              <div style={{ background: C.goldBg, border: `1.5px solid #f1e3b8`, borderRadius: 99, padding: "9px 22px", fontSize: 20 }}>🍽️ Total available: <b><Count to={10} from={98} dur={22} /> tables</b></div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 18, opacity: prog(f, 128, 16) }}>
              <Chip>👥 Guests: <b>+1</b></Chip>
              <Chip>💰 Table budget: <b>25 KD</b></Chip>
              <Chip>🌟 <b>All approved bloggers</b></Chip>
            </div>
          </div>

          {/* open layer */}
          <div style={{ position: "absolute", left: 28, right: 28, top: 94, opacity: openP }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
              <div style={{ flex: 1 }}><Field label="Campaign name" value="November Open Invitation" size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.ink2, fontWeight: 500, marginBottom: 6 }}>Restaurants</div>
                <div style={{ display: "flex", gap: 6, height: 54, alignItems: "center" }}>
                  {BRANDS.map((b) => <BrandLogo key={b} name={b} size={46} />)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
              <Chip>From <b>1 Nov</b></Chip>
              <Chip>Until <b>30 Nov</b></Chip>
              <Chip>Max <b>2 visits</b> / month</Chip>
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: 1.2, color: C.mute, margin: "14px 0 8px" }}>TIME SLOTS AND TABLES</div>
            <Labels single={false} />
            <SlotRow d={226} a="2:00 PM" b="4:00 PM" n={5} />
            <SlotRow d={240} a="6:00 PM" b="8:00 PM" n={5} />
            <div style={{ display: "flex", justifyContent: "flex-end", opacity: prog(f, 252, 14) }}>
              <div style={{ background: C.goldBg, border: `1.5px solid #f1e3b8`, borderRadius: 99, padding: "9px 22px", fontSize: 20 }}>🍽️ <b>10 tables</b> per restaurant, per day</div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16, opacity: prog(f, 266, 16) }}>
              <Chip>👥 Guests: <b>+1</b></Chip>
              <Chip>💰 Table budget: <b>25 KD</b></Chip>
              <Chip>🌟 <b>All approved bloggers</b></Chip>
            </div>
          </div>

          <div style={{ position: "absolute", left: 28, bottom: 22, display: "flex", gap: 12 }}>
            <Btn ghost style={{ fontSize: 17, padding: "11px 24px" }}>Save as draft</Btn>
            <Btn style={{ fontSize: 17, padding: "11px 26px" }}>✈ Save & launch</Btn>
          </div>
          <div style={{ position: "absolute", right: 28, bottom: 84, opacity: toast, translate: `0 ${(1 - toast) * 14}px`, background: C.ink, color: "#fff", padding: "12px 22px", borderRadius: 14, fontSize: 17 }}>
            ✓ Campaign launched · 13 invitations prepared
          </div>
        </div>
        <Cursor keys={[[120, 600, 520], [186, 590, 46], [200, 590, 46], [250, 560, 400], [296, 275, 606], [306, 275, 606], [330, 400, 520]]} clicks={[200, 306]} />
      </Win>
    </Stage>
  );
};

/* 7. Invitations */
export const Invite: React.FC = () => {
  const f = useCurrentFrame();
  const lines: [number, React.ReactNode][] = [
    [16, <b key="a">Hi Ahmed! 👋</b>],
    [30, "We'd love to invite you to visit Solia."],
    [48, "🍽️ You + 1 guest · Table budget up to 25 KD"],
    [66, "Open your personal invitation page to reserve your visit:"],
    [86, <u key="l" style={{ color: "#1a6ea8" }}>bloggers.yourdomain.com/p/mfj8a8ft…</u>],
  ];
  const tick = f < 118 ? "✓" : "✓✓";
  return (
    <Stage side="admin" title="Step 4. Each blogger gets a personal invitation" bullets={["Written once, personalised for every blogger", "Their own private link inside", "Prepared, sent and delivered are tracked"]} bulletsAt={30}
      extra={<div style={{ marginTop: 30, fontSize: 21, color: C.mute, maxWidth: 640, lineHeight: 1.4 }}>Messages are simulated in this demo. The official WhatsApp Business connection comes with the live build.</div>}>
      <Phone bg="#ece5dd">
        <div style={{ background: "#fff", padding: "10px 18px", display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #e7e0d4" }}>
          <div style={{ width: 44, height: 44, borderRadius: 99, background: C.goldBg, display: "grid", placeItems: "center" }}><Img src={staticFile("mnh_mark.png")} style={{ width: 24 }} /></div>
          <div><div style={{ fontWeight: 600, fontSize: 18 }}>MNH Al-Hajery</div><div style={{ fontSize: 13, color: C.mute }}>Business account</div></div>
        </div>
        <div style={{ padding: "26px 16px" }}>
          <div style={{ background: "#fff", borderRadius: "6px 20px 20px 20px", padding: "16px 18px", fontSize: 18, lineHeight: 1.45, boxShadow: "0 2px 6px rgba(0,0,0,.08)", display: "grid", gap: 10, opacity: prog(f, 8, 12) }}>
            {lines.map(([d, t], i) => (
              <div key={i} style={{ opacity: prog(f, d, 14), translate: `0 ${(1 - prog(f, d, 14)) * 10}px` }}>{t}</div>
            ))}
            <div style={{ textAlign: "right", fontSize: 13, color: tick === "✓✓" ? "#2f7fb5" : C.mute, opacity: prog(f, 104, 10) }}>10:24 {tick}</div>
          </div>
          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", opacity: prog(f, 130, 16) }}>
            <div style={{ background: "#dff0e3", color: C.green, padding: "10px 20px", borderRadius: 99, fontWeight: 600, fontSize: 16 }}>13 invitations delivered</div>
          </div>
        </div>
      </Phone>
    </Stage>
  );
};

/* 8. Verify */
const win = (f: number, a: number, b: number) => prog(f, a, 12) * (1 - prog(f, b, 12));

export const Verify: React.FC = () => {
  const f = useCurrentFrame();
  const code = typed("482196", f, 136, 9);
  const layer = (o: number): React.CSSProperties => ({ position: "absolute", inset: 0, paddingTop: 56, opacity: o, translate: `${(1 - o) * 22}px 0` });
  return (
    <Stage side="blogger" title="Step 5. Private link, then phone check, then a code"
      extra={
        <div style={{ marginTop: 32, display: "grid", gap: 16 }}>
          {[["🔗", "Personal link, unique to each blogger"], ["📞", "Phone number must match the registration"], ["🔢", "One-time code to finish"]].map(([e, t], i) => (
            <Reveal key={t} d={26 + i * 14} y={14}><div style={{ fontSize: 30, display: "flex", gap: 16, alignItems: "center" }}><span style={{ fontSize: 34 }}>{e}</span>{t}</div></Reveal>
          ))}
          <Reveal d={140} y={14}>
            <div style={{ marginTop: 14, padding: "20px 26px", borderRadius: 22, background: C.redBg, border: "1.5px solid #f0c9c1", color: C.red, fontSize: 27, fontWeight: 600, lineHeight: 1.3 }}>
              🚫 A forwarded link stops here. The number will not match.
            </div>
          </Reveal>
        </div>
      }>
      <Phone>
        <div style={layer(win(f, 0, 64))}>
          <div style={{ padding: "20px 22px" }}>
            <Img src={staticFile("mnh_full.png")} style={{ width: 150 }} />
            <div style={{ marginTop: 22 }}><PHello size={34}>Your invitations</PHello></div>
            <div style={{ color: C.ink2, fontSize: 17, margin: "8px 0 20px" }}>Open the personal link we sent you on WhatsApp.</div>
            <Field label="Personal link" value={typed("bloggers.yourdomain.com/p/mfj8a8ft", f, 10, 28)} size={16} />
            <div style={{ marginTop: 18 }}><PBtn>Continue</PBtn></div>
          </div>
        </div>
        <div style={layer(win(f, 62, 128))}>
          <div style={{ padding: "26px 22px" }}>
            <div style={{ width: 80, height: 80, borderRadius: 99, background: "#f1ebe2", display: "grid", placeItems: "center", fontSize: 40 }}>🛡️</div>
            <div style={{ marginTop: 18 }}><PHello size={34}>Verify it's you</PHello></div>
            <div style={{ color: C.ink2, fontSize: 17, margin: "8px 0 20px", lineHeight: 1.4 }}>Enter the phone number you registered with.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 90 }}><Field label="Code" value="+965" size={18} /></div>
              <div style={{ flex: 1 }}><Field label="Phone number" value={typed("5430 2707", f, 80, 14)} caret size={18} /></div>
            </div>
            <div style={{ marginTop: 18 }}><PBtn>Send code</PBtn></div>
          </div>
        </div>
        <div style={layer(win(f, 126, 190))}>
          <div style={{ padding: "26px 22px" }}>
            <PHello size={34}>Enter your code</PHello>
            <div style={{ color: C.ink2, fontSize: 17, margin: "8px 0 24px" }}>We sent a 6-digit code to +965 •••• 07.</div>
            <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 62, borderRadius: 12, border: `1.5px solid ${code[i] ? C.gold : "#e3dccb"}`, background: "#fff", display: "grid", placeItems: "center", fontSize: 28, fontWeight: 600 }}>{code[i] ?? ""}</div>
              ))}
            </div>
            <div style={{ marginTop: 22 }}><PBtn>Verify & continue</PBtn></div>
          </div>
        </div>
        <div style={layer(prog(f, 188, 14))}>
          <div style={{ padding: "26px 22px" }}>
            <Img src={staticFile("mnh_mark.png")} style={{ width: 30, marginBottom: 14 }} />
            <PHello size={36}>Hi Ahmed 👋</PHello>
            <div style={{ color: C.ink2, fontSize: 18, marginTop: 6 }}>You have 1 invitation.</div>
            <div style={{ marginTop: 22, borderRadius: 24, background: "#fff", border: `1px solid ${C.line}`, padding: 18, boxShadow: "0 10px 24px rgba(59,42,26,.08)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}><BrandLogo name="solia" size={70} /><div><div style={{ fontFamily: serif, fontSize: 24, fontWeight: 600, letterSpacing: 1.5 }}>SOLIA</div><div style={{ color: C.ink2, fontSize: 16 }}>Autumn Menu Tasting</div></div></div>
            </div>
          </div>
        </div>
        <Cursor keys={[[30, 300, 640], [58, 190, 392], [64, 190, 392], [100, 300, 400], [120, 190, 442], [128, 190, 442], [170, 190, 520], [186, 190, 468], [194, 190, 468]]} clicks={[58, 122, 188]} />
      </Phone>
    </Stage>
  );
};


