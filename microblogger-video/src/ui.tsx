import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, lerp, prog, sans, serif } from "./theme";
import { useCurrentFrame } from "./theme";

export const Reveal: React.FC<{
  d: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ d, y = 26, children, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, d);
  return <div style={{ opacity: p, translate: `0 ${(1 - p) * y}px`, ...style }}>{children}</div>;
};

export const Pop: React.FC<{ d: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  d,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, d, 18);
  return <div style={{ opacity: p, scale: String(0.8 + 0.2 * p), ...style }}>{children}</div>;
};

export const SidePill: React.FC<{ side: "admin" | "blogger" | "both" }> = ({ side }) => {
  const label = side === "admin" ? "🖥️  Marketing team" : side === "blogger" ? "📱  Blogger" : "✨  Whole journey";
  const filled = side !== "blogger";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 24px",
        borderRadius: 99,
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: 0.3,
        background: filled ? C.goldD : "#fff",
        color: filled ? "#fff" : C.goldDD,
        border: `2px solid ${C.goldD}`,
      }}
    >
      {label}
    </div>
  );
};

/** Standard scene: text on the left, visual on the right. */
export const Stage: React.FC<{
  side: "admin" | "blogger" | "both";
  title: string;
  sub?: string;
  bullets?: string[];
  bulletsAt?: number;
  extra?: React.ReactNode;
  children: React.ReactNode;
}> = ({ side, title, sub, bullets, bulletsAt = 40, extra, children }) => (
  <AbsoluteFill
    style={{
      fontFamily: sans,
      background: `radial-gradient(1100px 700px at 88% 8%, #fff0c9 0%, rgba(255,240,201,0) 62%), ${C.cream}`,
    }}
  >
    <div style={{ position: "absolute", left: 120, top: 170, width: 780 }}>
      <Reveal d={0}>
        <SidePill side={side} />
      </Reveal>
      <Reveal d={6}>
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 68,
            lineHeight: 1.08,
            letterSpacing: -1.6,
            color: C.ink,
            margin: "28px 0 0",
            textWrap: "balance",
          }}
        >
          {title}
        </h1>
      </Reveal>
      {sub ? (
        <Reveal d={16}>
          <p style={{ fontSize: 33, lineHeight: 1.42, color: C.ink2, margin: "26px 0 0" }}>{sub}</p>
        </Reveal>
      ) : null}
      {bullets ? (
        <div style={{ marginTop: 34, display: "grid", gap: 18 }}>
          {bullets.map((b, i) => (
            <Reveal key={b} d={bulletsAt + i * 16} y={18}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 30, color: C.ink }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 99,
                    background: C.goldBg,
                    border: `2px solid ${C.gold}`,
                    color: C.goldDD,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    flex: "none",
                  }}
                >
                  ✓
                </span>
                {b}
              </div>
            </Reveal>
          ))}
        </div>
      ) : null}
      {extra}
    </div>
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 1000, display: "grid", placeItems: "center" }}>
      {children}
    </div>
  </AbsoluteFill>
);

export const Phone: React.FC<{ children: React.ReactNode; scale?: number; bg?: string }> = ({
  children,
  scale = 1.12,
  bg = "#fffcf5",
}) => (
  <div
    style={{
      width: 390,
      height: 800,
      borderRadius: 56,
      border: "10px solid #2a2d33",
      background: bg,
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 50px 90px rgba(59,42,26,.28), 0 8px 20px rgba(59,42,26,.12)",
      scale: String(scale),
      fontFamily: sans,
      color: C.ink,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        translate: "-50% 0",
        width: 112,
        height: 30,
        borderRadius: 20,
        background: "#2a2d33",
        zIndex: 30,
      }}
    />
    <div style={{ position: "absolute", inset: 0, paddingTop: 56 }}>{children}</div>
  </div>
);

/** Admin window. Content area is 1000 x 620 natural pixels. */
export const Win: React.FC<{
  children: React.ReactNode;
  active?: string;
  scale?: number;
  badge?: number;
}> = ({ children, active = "Overview", scale = 0.95, badge = 4 }) => {
  const nav = [
    ["🏠", "Overview"],
    ["🤳", "Microbloggers"],
    ["👥", "Groups"],
    ["✨", "Campaigns"],
    ["📱", "Blogger journey"],
    ["📅", "Reservations"],
    ["🍽️", "Restaurants"],
  ];
  return (
    <div
      style={{
        width: 1000,
        height: 700,
        borderRadius: 26,
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 50px 90px rgba(59,42,26,.25), 0 8px 20px rgba(59,42,26,.1)",
        border: `1px solid ${C.line}`,
        scale: String(scale),
        fontFamily: sans,
        color: C.ink,
        position: "relative",
      }}
    >
      <div style={{ height: 46, background: "#f6f1e4", display: "flex", alignItems: "center", gap: 9, padding: "0 18px", borderBottom: `1px solid ${C.line}` }}>
        {["#e6685c", "#e8b84c", "#62b863"].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
        ))}
        <div style={{ marginLeft: 16, padding: "5px 18px", borderRadius: 99, background: "#fff", fontSize: 15, color: C.mute, border: `1px solid ${C.line}` }}>
          bloggers.yourdomain.com/admin
        </div>
      </div>
      <div style={{ display: "flex", height: 654 }}>
        <div style={{ width: 218, borderRight: `1px solid ${C.line}`, padding: "18px 12px", display: "flex", flexDirection: "column", gap: 4, background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 8px 16px" }}>
            <Img src={staticFile("mnh_mark.png")} style={{ width: 30 }} />
            <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 19 }}>Al-Hajery</div>
          </div>
          {nav.map(([e, n]) => (
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 14,
                fontSize: 17,
                fontWeight: n === active ? 600 : 500,
                background: n === active ? "linear-gradient(90deg,#fbefc9,#fdf6e2)" : "transparent",
                color: n === active ? C.ink : C.ink2,
              }}
            >
              <span style={{ fontSize: 20 }}>{e}</span>
              {n}
              {n === "Microbloggers" && badge ? (
                <span style={{ marginLeft: "auto", background: C.goldD, color: "#fff", borderRadius: 99, fontSize: 13, padding: "1px 8px", fontWeight: 600 }}>{badge}</span>
              ) : null}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, position: "relative", background: "#fdfaf3", overflow: "hidden" }}>{children}</div>
      </div>
    </div>
  );
};

export const Btn: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; ghost?: boolean }> = ({
  children,
  style,
  ghost,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "13px 26px",
      borderRadius: 99,
      fontWeight: 600,
      fontSize: 19,
      background: ghost ? "#fff" : "linear-gradient(135deg,#c79a1f,#a67c12)",
      color: ghost ? C.ink : "#fff",
      border: ghost ? `1.5px solid ${C.line}` : "none",
      boxShadow: ghost ? "none" : "0 6px 16px rgba(166,124,18,.3)",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Status: React.FC<{ kind: "pending" | "approved" | "active" | "confirmed" | "attended" | "noshow" | "cancelled"; label?: string }> = ({
  kind,
  label,
}) => {
  const map = {
    pending: [C.amberBg, C.amber, "Pending"],
    approved: [C.greenBg, C.green, "Approved"],
    active: [C.greenBg, C.green, "Link active"],
    confirmed: [C.greenBg, C.green, "Confirmed"],
    attended: [C.greenBg, C.green, "Attended"],
    noshow: [C.redBg, C.red, "No-show"],
    cancelled: ["#efefeb", "#62676d", "Cancelled"],
  } as const;
  const [bg, fg, t] = map[kind];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: bg, color: fg, fontSize: 16, fontWeight: 600 }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: "currentColor" }} />
      {label ?? t}
    </span>
  );
};

export const Field: React.FC<{ label: string; value?: string; w?: number | string; caret?: boolean; size?: number }> = ({
  label,
  value = "",
  w = "100%",
  caret,
  size = 20,
}) => (
  <div style={{ width: w }}>
    <div style={{ fontSize: size - 6, color: C.ink2, fontWeight: 500, marginBottom: 6 }}>{label}</div>
    <div
      style={{
        height: size + 36,
        borderRadius: 14,
        border: `1.5px solid ${caret ? C.gold : "#e3dccb"}`,
        boxShadow: caret ? "0 0 0 4px rgba(194,148,27,.15)" : "none",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        fontSize: size,
        color: C.ink,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {value}
      {caret ? <span style={{ width: 2, height: size + 2, background: C.goldD, marginLeft: 2 }} /> : null}
    </div>
  </div>
);

export const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 44 }) => (
  <div style={{ width: size, height: size, borderRadius: 99, background: C.goldBg, color: C.goldDD, display: "grid", placeItems: "center", fontWeight: 700, fontSize: size * 0.4, flex: "none" }}>
    {name[0]}
  </div>
);

export const BrandLogo: React.FC<{ name: string; size?: number; bg?: string }> = ({ name, size = 110, bg = "#fff" }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: name === "haagen-dazs" ? "#600624" : bg, display: "grid", placeItems: "center", boxShadow: "0 10px 24px rgba(59,42,26,.12)", border: `1px solid ${C.line}`, overflow: "hidden" }}>
    <Img src={staticFile(`${name}.png`)} style={{ width: size, height: size, objectFit: "cover" }} />
  </div>
);

export const BRANDS = ["solia", "khaneen", "delfino", "danish-bakery", "haagen-dazs", "illy", "sutis"];

/** Animated cursor. keys: [frame, x, y]. clicks: frames where it taps. */
export const Cursor: React.FC<{ keys: [number, number, number][]; clicks?: number[] }> = ({ keys, clicks = [] }) => {
  const f = useCurrentFrame();
  const fr = keys.map((k) => k[0]);
  const x = lerp(f, fr, keys.map((k) => k[1]));
  const y = lerp(f, fr, keys.map((k) => k[2]));
  const op = lerp(f, [fr[0], fr[0] + 8], [0, 1]);
  const tap = clicks.reduce((a, c) => Math.max(a, f >= c && f < c + 14 ? 1 - (f - c) / 14 : 0), 0);
  const press = clicks.some((c) => f >= c && f < c + 6);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, translate: `${x}px ${y}px`, opacity: op, zIndex: 60, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: 99, border: `3px solid ${C.goldD}`, opacity: tap, scale: String(0.5 + (1 - tap) * 1.1) }} />
      <svg width="34" height="34" viewBox="0 0 24 24" style={{ scale: press ? "0.9" : "1", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.3))" }}>
        <path d="M5 3l14 8-6 1.5L10.5 19z" fill="#1f2328" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const PhoneHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: "6px 22px 0" }}>
    <Img src={staticFile("mnh_mark.png")} style={{ width: 30, marginBottom: 12 }} />
    {children}
  </div>
);

export const PHello: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 31 }) => (
  <div style={{ fontFamily: serif, fontWeight: 500, fontSize: size, lineHeight: 1.12 }}>{children}</div>
);

export const PBtn: React.FC<{ children: React.ReactNode; ok?: boolean; style?: React.CSSProperties }> = ({ children, ok, style }) => (
  <div
    style={{
      width: "100%",
      padding: "16px 0",
      borderRadius: 99,
      textAlign: "center",
      fontWeight: 600,
      fontSize: 19,
      background: ok ? "#e6f1ea" : "linear-gradient(135deg,#c79a1f,#a67c12)",
      color: ok ? C.green : "#fff",
      boxShadow: ok ? "none" : "0 8px 18px rgba(166,124,18,.28)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A bottom sheet that slides up inside a phone. */
export const Sheet: React.FC<{ from: number; to?: number; children: React.ReactNode; h?: number }> = ({ from, to, children, h = 560 }) => {
  const f = useCurrentFrame();
  const inP = prog(f, from, 22);
  const outP = to ? prog(f, to, 14) : 0;
  const p = inP * (1 - outP);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(31,35,40,.38)", opacity: p, zIndex: 20 }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: h,
          background: "#fff",
          borderRadius: "28px 28px 0 0",
          padding: "14px 22px",
          zIndex: 21,
          translate: `0 ${(1 - p) * h}px`,
          boxShadow: "0 -12px 30px rgba(0,0,0,.2)",
        }}
      >
        <div style={{ width: 44, height: 5, borderRadius: 9, background: "#ddd5ca", margin: "0 auto 14px" }} />
        {children}
      </div>
    </>
  );
};

export const Count: React.FC<{ to: number; from: number; dur?: number; suffix?: string }> = ({ to, from, dur = 30, suffix = "" }) => {
  const f = useCurrentFrame();
  const v = Math.round(prog(f, from, dur) * to);
  return <>{v}{suffix}</>;
};
