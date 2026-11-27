import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { pr } from "./common";

const serif = "Fraunces, Georgia, serif";
const sans = "Inter, system-ui, sans-serif";

/** Kinetic headline: words rise out of a soft blur, one after another */
export const Kinetic: React.FC<{ text: string; at: number; out?: number; top?: string; size?: number; color?: string; italic?: boolean; gold?: boolean; stagger?: number; weight?: number }> = ({ text, at, out = 1e9, top = "11%", size = 78, color = "#fff", gold, stagger = 4, weight = 500 }) => {
  const f = useCurrentFrame();
  const o = 1 - pr(f, out, out + 14);
  if (f < at - 2 || o <= 0) return null;
  const words = text.split(" ");
  return (<AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: top, pointerEvents: "none" }}>
    <div style={{ width: "86%", textAlign: "center", fontFamily: serif, fontSize: size, fontWeight: weight, lineHeight: 1.08, letterSpacing: "-0.015em", opacity: o, filter: `blur(${(1 - o) * 8}px)` }}>
      {words.map((w, i) => {
        const p = pr(f, at + i * stagger, at + i * stagger + 18);
        return (<span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: p, transform: `translateY(${(1 - p) * 34}px)`, filter: `blur(${(1 - p) * 10}px)`,
          ...(gold ? { background: "linear-gradient(180deg,#fff3c4 0%,#E9C46A 45%,#a67c12 100%)", WebkitBackgroundClip: "text", color: "transparent" } : { color }),
          textShadow: gold ? undefined : "0 6px 40px rgba(0,0,0,.45)" }}>{w}</span>);
      })}
    </div>
  </AbsoluteFill>);
};

/** Small feature chip that slides in, glass style */
export const Chip: React.FC<{ text: string; at: number; out: number; bottom?: string; icon?: string }> = ({ text, at, out, bottom = "9%", icon }) => {
  const f = useCurrentFrame();
  const p = pr(f, at, at + 14), o = 1 - pr(f, out, out + 10);
  if (f < at || o <= 0) return null;
  return (<AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom, pointerEvents: "none" }}>
    <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "20px 34px", borderRadius: 999, background: "rgba(20,16,10,.55)", border: "1.5px solid rgba(233,196,106,.55)", backdropFilter: "blur(14px)", boxShadow: "0 18px 50px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12)",
      color: "#fff", fontFamily: sans, fontWeight: 600, fontSize: 40, letterSpacing: "-0.01em", opacity: p * o, transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + 0.06 * p})` }}>
      {icon ? <span style={{ fontSize: 40 }}>{icon}</span> : <span style={{ width: 14, height: 14, borderRadius: 99, background: "#E9C46A", boxShadow: "0 0 18px #E9C46A" }} />}
      {text}
    </div>
  </AbsoluteFill>);
};

/** Eyebrow line (small caps) */
export const Eyebrow: React.FC<{ text: string; at: number; out?: number; top?: string }> = ({ text, at, out = 1e9, top = "8%" }) => {
  const f = useCurrentFrame();
  const p = pr(f, at, at + 20) * (1 - pr(f, out, out + 12));
  if (p <= 0) return null;
  return (<AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: top, pointerEvents: "none" }}>
    <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 28, letterSpacing: "0.32em", color: "#E9C46A", opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>{text}</div>
  </AbsoluteFill>);
};

/** Film finish: grain, vignette, letterbox fade */
export const FilmFinish: React.FC<{ fadeIn?: number; fadeOut?: [number, number] }> = ({ fadeIn = 0, fadeOut }) => {
  const f = useCurrentFrame();
  const black = Math.max(fadeIn ? 1 - pr(f, 0, fadeIn) : 0, fadeOut ? pr(f, fadeOut[0], fadeOut[1]) : 0);
  const seed = (f * 7919) % 1000;
  return (<>
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.12,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${seed}'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")` }} />
    <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    {black > 0 && <AbsoluteFill style={{ background: "#000", opacity: black }} />}
  </>);
};

/** Bright light flash for dramatic cuts */
export const Flash: React.FC<{ at: number; dur?: number; color?: string }> = ({ at, dur = 18, color = "255,236,190" }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at - 6, at, at + dur], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(circle at 50% 50%, rgba(${color},${o}) 0%, rgba(${color},${o * 0.6}) 30%, rgba(${color},0) 75%)` }} />;
};

/** Light streak wipe used between scenes */
export const Streak: React.FC<{ at: number; dur?: number }> = ({ at, dur = 16 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [-0.4, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = Math.sin(Math.min(1, Math.max(0, (f - at) / dur)) * Math.PI);
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: o,
    background: `linear-gradient(115deg, rgba(0,0,0,0) ${p * 100 - 18}%, rgba(233,196,106,.55) ${p * 100 - 4}%, rgba(255,250,235,.9) ${p * 100}%, rgba(233,196,106,.5) ${p * 100 + 4}%, rgba(0,0,0,0) ${p * 100 + 18}%)` }} />;
};
