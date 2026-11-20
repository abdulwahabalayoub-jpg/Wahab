import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, prog, sans, serif } from "../theme";
import { Avatar, BRANDS, BrandLogo, Count, Cursor, PBtn, PHello, Phone, Pop, Reveal, Sheet, Stage, Status, Win } from "../ui";

const layer = (o: number): React.CSSProperties => ({ position: "absolute", inset: 0, paddingTop: 56, opacity: o });
const win = (f: number, a: number, b: number) => prog(f, a, 12) * (1 - prog(f, b, 12));

const Confirmed: React.FC<{ name: string; when: string; at: number }> = ({ name, when, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 16);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fffcf5", zIndex: 40, opacity: p, paddingTop: 56 }}>
      <div style={{ padding: "60px 26px", textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: 99, background: "#e6f1ea", color: C.green, display: "grid", placeItems: "center", fontSize: 54, margin: "0 auto 22px", scale: String(0.6 + 0.4 * p) }}>✓</div>
        <PHello size={36}>See you at {name}!</PHello>
        <div style={{ margin: "22px 0", padding: 18, borderRadius: 22, background: "#fff", border: `1px solid ${C.line}`, textAlign: "left", fontSize: 18, lineHeight: 1.7 }}>
          <div>📅 {when}</div>
          <div>🎟️ Reference <b style={{ fontFamily: "ui-monospace, monospace", background: "#f3eee7", padding: "2px 8px", borderRadius: 6 }}>RSV-7K3M9Q</b></div>
          <div>🍽️ You + 1 guest · Table budget 25 KD</div>
        </div>
        <div style={{ color: C.mute, fontSize: 15 }}>You can cancel up to 24 hours before your visit.</div>
      </div>
    </div>
  );
};

const Dots: React.FC<{ n: number; free: number }> = ({ n, free }) => (
  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 150, justifyContent: "flex-end" }}>
    {Array.from({ length: n }).map((_, i) => <i key={i} style={{ width: 10, height: 10, borderRadius: 99, background: i < n - free ? C.gold : "#e3ddd3", display: "block" }} />)}
  </div>
);

/* 9. Book single */
export const BookSingle: React.FC = () => {
  const f = useCurrentFrame();
  const left = f < 122 ? 10 : 9;
  return (
    <Stage side="blogger" title="Step 6. Booking a one-restaurant visit" bullets={["Restaurant, date, time and what is included", "Live count of tables left", "Pick a time slot and confirm"]} bulletsAt={24}
      extra={
        <Reveal d={150} y={16}>
          <div style={{ marginTop: 34, padding: "22px 26px", borderRadius: 24, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 16px 34px rgba(59,42,26,.1)", maxWidth: 650 }}>
            <div style={{ fontSize: 22, color: C.goldDD, fontWeight: 600, letterSpacing: 1 }}>NEVER OVERBOOKED</div>
            <div style={{ fontSize: 28, margin: "8px 0 14px", lineHeight: 1.3 }}>Two bloggers tap the last table at the same moment.</div>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ flex: 1, padding: "12px 16px", borderRadius: 16, background: C.greenBg, color: C.green, fontWeight: 600, fontSize: 22 }}>Fatma ✓ Booked</div>
              <div style={{ flex: 1, padding: "12px 16px", borderRadius: 16, background: C.redBg, color: C.red, fontWeight: 600, fontSize: 22 }}>Noura ✕ Fully booked</div>
            </div>
          </div>
        </Reveal>
      }>
      <Phone>
        <div style={layer(1)}>
          <div style={{ padding: "8px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><Img src={staticFile("mnh_mark.png")} style={{ width: 26 }} /><PHello size={26}>Hi Ahmed 👋</PHello></div>
            <div style={{ borderRadius: 26, background: "#fff", boxShadow: "0 12px 28px rgba(59,42,26,.1)", overflow: "hidden", border: `1px solid ${C.line}` }}>
              <div style={{ height: 130, display: "grid", placeItems: "center", background: "#fff", borderBottom: "1px solid #f1ece4" }}><BrandLogo name="solia" size={116} /></div>
              <div style={{ padding: "14px 18px 18px" }}>
                <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 24, letterSpacing: 2 }}>SOLIA</div>
                <div style={{ color: C.ink2, fontSize: 16 }}>Autumn Menu Tasting</div>
                <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 15, color: "#5c554c", flexWrap: "wrap" }}><span>📅 Sat 28 Nov</span><span>🕑 2 PM – 8 PM</span><span>📍 Shuwaikh</span></div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <span style={{ background: "#f3eee7", padding: "4px 10px", borderRadius: 99, fontSize: 14, fontWeight: 500 }}>You + 1 guest</span>
                  <span style={{ background: "#f3eee7", padding: "4px 10px", borderRadius: 99, fontSize: 14, fontWeight: 500 }}>Table budget 25 KD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 15, fontWeight: 500 }}><span>{left} of 10 spots remaining</span><Dots n={10} free={left} /></div>
                <div style={{ marginTop: 12 }}><PBtn style={{ padding: "13px 0", fontSize: 18 }}>Choose a time slot</PBtn></div>
              </div>
            </div>
          </div>
        </div>
        <Sheet from={52} to={124} h={470}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 10 }}>Confirm your reservation</div>
          <div style={{ fontSize: 16, color: C.ink2, marginBottom: 10 }}>Choose your time</div>
          {[["Sat 28 Nov · 2 – 4 PM", "Fully booked", true], ["Sat 28 Nov · 6 – 8 PM", "5 spots left", false]].map(([t, s, off]) => (
            <div key={String(t)} style={{ padding: "12px 16px", borderRadius: 14, marginBottom: 10, border: `1.5px solid ${off ? "#e8e3db" : C.gold}`, background: off ? "#faf8f4" : C.goldBg, color: off ? "#a39b8e" : C.ink, fontSize: 17, fontWeight: 500 }}>{t}<div style={{ fontSize: 14, color: off ? "#a39b8e" : C.ink2, fontWeight: 400 }}>{s}</div></div>
          ))}
          <div style={{ fontSize: 14, color: C.mute, margin: "6px 0 12px" }}>You can cancel up to 24 hours before your visit.</div>
          <PBtn style={{ padding: "14px 0", fontSize: 18 }}>Confirm reservation</PBtn>
        </Sheet>
        <Confirmed name="Solia" when="Sat 28 Nov · 6 – 8 PM · Shuwaikh" at={126} />
        <Cursor keys={[[16, 300, 640], [46, 185, 481], [52, 185, 481], [90, 185, 481], [104, 185, 606], [120, 185, 606]]} clicks={[50, 118]} />
      </Phone>
    </Stage>
  );
};

/* 10. Book open */
export const BookOpen: React.FC = () => {
  const f = useCurrentFrame();
  const rests = [["solia", "Solia", "Shuwaikh"], ["khaneen", "Khaneen", "Sharq"], ["delfino", "Delfino", "Salmiya"]];
  return (
    <Stage side="blogger" title="Step 7. Booking an open invitation" bullets={["Choose any restaurant in the campaign", "Pick a date and a time slot", "Monthly limit applied for you"]} bulletsAt={24}>
      <Phone>
        <div style={layer(win(f, 0, 58))}>
          <div style={{ padding: "8px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><Img src={staticFile("mnh_mark.png")} style={{ width: 26 }} /><PHello size={26}>Hi Ahmed 👋</PHello></div>
            <div style={{ borderRadius: 26, background: "#fff", boxShadow: "0 12px 28px rgba(59,42,26,.1)", overflow: "hidden", border: `1px solid ${C.line}` }}>
              <div style={{ position: "relative", padding: 12, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, background: "#f6f1e6" }}>
                {BRANDS.map((b) => <BrandLogo key={b} name={b} size={74} />)}
                <div style={{ background: "#fff", borderRadius: 18, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: C.goldDD, textAlign: "center", padding: 6 }}>OPEN INVITATION</div>
              </div>
              <div style={{ padding: "14px 18px 18px" }}>
                <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 22, letterSpacing: 1.5 }}>ALL RESTAURANTS</div>
                <div style={{ color: C.ink2, fontSize: 16 }}>November Open Invitation</div>
                <div style={{ fontSize: 15, color: "#5c554c", marginTop: 8 }}>📅 1 – 30 Nov · 🕑 2 – 4 PM · 6 – 8 PM</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 15, fontWeight: 500 }}><span>1 of 2 visits used in November</span><span style={{ display: "flex", gap: 4 }}><i style={{ width: 10, height: 10, borderRadius: 99, background: C.gold, display: "block" }} /><i style={{ width: 10, height: 10, borderRadius: 99, background: "#e3ddd3", display: "block" }} /></span></div>
                <div style={{ marginTop: 14 }}><PBtn style={{ padding: "13px 0", fontSize: 18 }}>Choose a restaurant</PBtn></div>
              </div>
            </div>
          </div>
        </div>
        <div style={layer(win(f, 56, 200))}>
          <div style={{ padding: "8px 18px" }}>
            <div style={{ color: C.mute, fontSize: 15 }}>‹ Invitations</div>
            <div style={{ marginTop: 8 }}><PHello size={32}>Choose a restaurant</PHello></div>
            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              {rests.map(([b, n, l], i) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: 12, borderRadius: 20, background: i === 1 && f > 96 ? C.goldBg : "#fff", border: `1.5px solid ${i === 1 && f > 96 ? C.gold : C.line}` }}>
                  <BrandLogo name={b} size={74} />
                  <div style={{ flex: 1 }}><div style={{ fontFamily: serif, fontWeight: 600, fontSize: 21, letterSpacing: 1.5 }}>{n.toUpperCase()}</div><div style={{ color: C.ink2, fontSize: 15 }}>📍 {l}</div></div>
                  <div style={{ fontSize: 24, color: C.goldD }}>›</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Sheet from={106} to={196} h={560}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 10 }}>Book your visit</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}><BrandLogo name="khaneen" size={64} /><div><div style={{ fontFamily: serif, fontWeight: 600, fontSize: 22, letterSpacing: 1.5 }}>KHANEEN</div><div style={{ color: C.ink2, fontSize: 15 }}>November Open Invitation</div></div></div>
          <div style={{ fontSize: 15, color: C.ink2, marginBottom: 6 }}>Date</div>
          <div style={{ padding: "12px 16px", borderRadius: 14, border: "1.5px solid #e3dccb", fontSize: 18, marginBottom: 14 }}>Sat 28 Nov 2026</div>
          <div style={{ fontSize: 15, color: C.ink2, marginBottom: 6 }}>Time slot</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[["2 – 4 PM", "Fully booked", true], ["6 – 8 PM", "5 left", false]].map(([t, s, off]) => (
              <div key={String(t)} style={{ flex: 1, padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${off ? "#e8e3db" : C.gold}`, background: off ? "#faf8f4" : C.goldBg, color: off ? "#a39b8e" : C.ink, fontSize: 17, fontWeight: 600 }}>{t}<div style={{ fontSize: 14, fontWeight: 400 }}>{s}</div></div>
            ))}
          </div>
          <div style={{ fontSize: 14, color: C.mute, margin: "14px 0" }}>You can cancel up to 24 hours before your visit.</div>
          <PBtn style={{ padding: "14px 0", fontSize: 18 }}>Confirm reservation</PBtn>
        </Sheet>
        <Confirmed name="Khaneen" when="Sat 28 Nov · 6 – 8 PM · Sharq" at={200} />
        <Cursor keys={[[10, 300, 640], [46, 185, 444], [54, 185, 444], [90, 300, 360], [100, 255, 306], [106, 255, 306], [140, 267, 506], [150, 267, 506], [186, 185, 608], [196, 185, 608]]} clicks={[52, 104, 150, 196]} />
      </Phone>
    </Stage>
  );
};

/* 11. Manage and cancel */
export const Manage: React.FC = () => {
  const f = useCurrentFrame();
  const gone = prog(f, 150, 14);
  const toast = prog(f, 156, 14);
  const left = f < 150 ? 4 : 5;
  const row = (rest: string, brand: string, when: string, extra: number) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", borderRadius: 18, padding: 12, border: `1px solid ${C.line}`, opacity: 1 - extra, scale: String(1 - 0.05 * extra) }}>
      <BrandLogo name={brand} size={64} />
      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 18 }}>{rest}</div><div style={{ color: C.ink2, fontSize: 14 }}>{when}</div><div style={{ marginTop: 4 }}><Status kind="confirmed" /></div></div>
      <div style={{ padding: "6px 14px", borderRadius: 99, border: `1.5px solid ${C.line}`, fontSize: 14, fontWeight: 600 }}>View</div>
    </div>
  );
  return (
    <Stage side="blogger" title="Step 8. Bookings and cancellations" bullets={["Upcoming and past visits in one place", "Cancel until the window closes", "The spot goes back to the campaign"]} bulletsAt={24}
      extra={
        <Reveal d={50} y={16}>
          <div style={{ marginTop: 32, padding: "22px 28px", borderRadius: 24, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 16px 34px rgba(59,42,26,.1)", maxWidth: 560, display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 22, color: C.mute }}>Solia · 6 – 8 PM</div><div style={{ fontSize: 26, fontWeight: 600 }}>Tables left</div></div>
            <div style={{ fontFamily: serif, fontSize: 80, fontWeight: 600, color: left === 5 ? C.green : C.ink, lineHeight: 1 }}>{left}</div>
          </div>
        </Reveal>
      }>
      <Phone>
        <div style={layer(1)}>
          <div style={{ padding: "8px 20px" }}>
            <PHello size={32}>My bookings 📅</PHello>
            <div style={{ fontSize: 13, letterSpacing: 1.4, color: C.goldDD, fontWeight: 700, margin: "18px 0 10px" }}>📅 UPCOMING</div>
            <div style={{ display: "grid", gap: 12 }}>
              {row("Solia", "solia", "Sat 28 Nov · 6 – 8 PM", gone)}
              {row("Khaneen", "khaneen", "Sun 6 Dec · 6 – 8 PM", 0)}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 40, opacity: toast, background: C.ink, color: "#fff", padding: "12px 18px", borderRadius: 14, fontSize: 16, textAlign: "center" }}>Reservation cancelled</div>
        <Sheet from={52} to={104} h={460}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 12 }}>Your reservation</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", padding: 12, border: `1px solid ${C.line}`, borderRadius: 18 }}><BrandLogo name="solia" size={60} /><div><div style={{ fontWeight: 600, fontSize: 18 }}>Solia</div><div style={{ color: C.ink2, fontSize: 15 }}>Sat 28 Nov · 6 – 8 PM</div></div></div>
          <div style={{ fontSize: 16, lineHeight: 1.9, margin: "14px 0" }}>Reference <b>RSV-7K3M9Q</b><br />Status <Status kind="confirmed" /></div>
          <div style={{ textAlign: "center", color: "#9b3526", fontWeight: 600, fontSize: 18, padding: "10px 0" }}>Cancel reservation</div>
          <PBtn style={{ padding: "14px 0", fontSize: 18 }}>Done</PBtn>
        </Sheet>
        <Sheet from={100} to={146} h={400}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 10 }}>Cancel this reservation?</div>
          <div style={{ fontSize: 17, color: C.ink2, lineHeight: 1.5, marginBottom: 20 }}>Your spot will be released for another blogger. This can't be undone.</div>
          <PBtn style={{ background: "#9b3526", boxShadow: "none", padding: "14px 0", fontSize: 18 }}>Yes, cancel</PBtn>
          <div style={{ textAlign: "center", padding: 16, fontWeight: 600, fontSize: 17 }}>Keep my reservation</div>
        </Sheet>
        <Cursor keys={[[10, 300, 640], [44, 305, 194], [52, 305, 194], [84, 185, 594], [96, 185, 594], [128, 185, 542], [142, 185, 542]]} clicks={[50, 94, 138]} />
      </Phone>
    </Stage>
  );
};

/* 12. Track */
export const Track: React.FC = () => {
  const f = useCurrentFrame();
  const a1 = f >= 96, a2 = f >= 140;
  const tiles: [string, string, number][] = [["✅", "Approved bloggers", 16], ["✨", "Active campaigns", 4], ["🎟️", "Confirmed bookings", 18], ["🗓️", "Upcoming visits", 16]];
  const rows: [string, string, string, number][] = [["Ahmed Al Salem", "Solia", "Sat 28 Nov · 6 PM", 0], ["Fatma Al Rashed", "Khaneen", "Sat 28 Nov · 6 PM", 1], ["Noura Al Ali", "Delfino", "Sun 29 Nov · 2 PM", 2]];
  return (
    <Stage side="admin" title="Step 9. Track every visit" bullets={["Live counts for bloggers, campaigns and bookings", "Mark attended or no-show after the visit", "Full history for each blogger"]} bulletsAt={24}
      extra={<div style={{ marginTop: 26, fontSize: 21, color: C.mute }}>Figures shown are sample data.</div>}>
      <Win active="Overview">
        <div style={{ padding: "24px 28px" }}>
          <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, marginBottom: 16 }}>Good morning, Marketing Team 👋</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {tiles.map(([e, l, n], i) => (
              <Pop key={l} d={8 + i * 8}>
                <div style={{ background: "#fff", borderRadius: 18, padding: "14px 16px", border: `1px solid ${C.line}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: C.mute }}><span style={{ width: 28, height: 28, borderRadius: 9, background: C.goldBg, display: "grid", placeItems: "center", fontSize: 15 }}>{e}</span>{l}</div>
                  <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 600, marginTop: 8 }}><Count to={n} from={14 + i * 8} dur={36} /></div>
                </div>
              </Pop>
            ))}
          </div>
          <div style={{ marginTop: 20, background: "#fff", borderRadius: 20, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", fontWeight: 600, fontSize: 18, borderBottom: "1px solid #f3ecda" }}>📅 Reservations</div>
            {rows.map(([n, r, w, i]) => {
              const state = i === 0 ? (a1 ? "attended" : "confirmed") : i === 1 ? (a2 ? "noshow" : "confirmed") : "confirmed";
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < 2 ? "1px solid #f3ecda" : "none", opacity: prog(f, 56 + i * 8, 14) }}>
                  <Avatar name={n} size={38} />
                  <div style={{ flex: 1.4, fontWeight: 600, fontSize: 18 }}>{n}</div>
                  <div style={{ flex: 1, fontSize: 17, color: C.ink2 }}>{r}</div>
                  <div style={{ flex: 1.2, fontSize: 16, color: C.ink2 }}>{w}</div>
                  <Status kind={state as "attended" | "noshow" | "confirmed"} />
                </div>
              );
            })}
          </div>
        </div>
        <Cursor keys={[[60, 600, 520], [90, 672, 302], [96, 672, 302], [120, 672, 365], [140, 672, 365]]} clicks={[96, 140]} />
      </Win>
    </Stage>
  );
};

/* 13. Close */
export const Close: React.FC = () => {
  const items = [["💬", "No manual DMs"], ["🔐", "Private personal links"], ["🎟️", "Never overbooked"], ["📊", "Every visit tracked"]];
  return (
    <AbsoluteFill style={{ fontFamily: sans, background: `radial-gradient(1200px 800px at 50% 20%, #fff1cf 0%, rgba(255,241,207,0) 65%), ${C.cream}`, alignItems: "center" }}>
      <Reveal d={0} style={{ marginTop: 110 }}><Img src={staticFile("mnh_full.png")} style={{ width: 260 }} /></Reveal>
      <Reveal d={8}><h1 style={{ fontFamily: serif, fontWeight: 600, fontSize: 104, letterSpacing: -2.5, lineHeight: 1.05, textAlign: "center", margin: "34px 0 0", color: C.ink }}>From first message<br />to finished visit.</h1></Reveal>
      <div style={{ display: "flex", gap: 22, marginTop: 64 }}>
        {items.map(([e, t], i) => (
          <Pop key={t} d={26 + i * 10}>
            <div style={{ width: 360, padding: "30px 28px", borderRadius: 28, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 22px 44px rgba(59,42,26,.1)", textAlign: "center" }}>
              <div style={{ fontSize: 54 }}>{e}</div>
              <div style={{ fontSize: 30, fontWeight: 600, marginTop: 12 }}>{t}</div>
            </div>
          </Pop>
        ))}
      </div>
      <Reveal d={80}><div style={{ marginTop: 60, fontSize: 32, color: C.ink2 }}>Interactive mock-up ready. Next step: the live build.</div></Reveal>
    </AbsoluteFill>
  );
};
