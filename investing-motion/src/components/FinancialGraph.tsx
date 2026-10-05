import type React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS, VIDEO } from "../config";
import { CRASH_END, displayValueAt, sampleSeries } from "../lib/finance";
import { strokeAt, tAt, toScreen, type Win, winAt } from "../lib/graph";
import { DataPoint } from "./DataPoint";

const { width: W, height: H } = VIDEO;
const V_STEPS = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
const T_STEPS = [1, 5, 10];

const path = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("");

const kFmt = (v: number) => (v >= 1000 ? `$${Math.round(v / 1000)}K` : `$${v}`);

// Data grid that lives in data space, so it moves with the camera.
const DataGrid: React.FC<{ win: Win }> = ({ win }) => {
  const spanV = win.v1 - win.v0;
  const spanT = win.t1 - win.t0;
  const labelStep = V_STEPS.find((s) => (s / spanV) * H >= 170) ?? V_STEPS[V_STEPS.length - 1];
  const yearLabelStep = T_STEPS.find((s) => (s / spanT) * W >= 150) ?? 10;
  const lines: React.ReactNode[] = [];

  for (const step of V_STEPS) {
    const px = (step / spanV) * H;
    const a = Math.min(1, Math.max(0, (px - 45) / 110));
    if (a <= 0) continue;
    for (let v = Math.ceil(win.v0 / step) * step; v <= win.v1; v += step) {
      const y = toScreen(win, 0, v).y;
      lines.push(<line key={`v${step}-${v}`} x1={0} x2={W} y1={y} y2={y} stroke={COLORS.ink} strokeOpacity={0.05 * a} strokeWidth={1} />);
      if (step === labelStep && v >= 0) {
        lines.push(
          <text key={`vl${v}`} x={56} y={y - 10} fill={COLORS.dim} fontFamily={FONTS.mono} fontSize={22} letterSpacing={2}>
            {kFmt(v)}
          </text>,
        );
      }
    }
  }
  for (const step of T_STEPS) {
    const px = (step / spanT) * W;
    const a = Math.min(1, Math.max(0, (px - 40) / 100));
    if (a <= 0) continue;
    for (let t = Math.ceil(win.t0 / step) * step; t <= win.t1; t += step) {
      if (t < 0) continue;
      const x = toScreen(win, t, 0).x;
      lines.push(<line key={`t${step}-${t}`} x1={x} x2={x} y1={0} y2={H} stroke={COLORS.ink} strokeOpacity={0.045 * a} strokeWidth={1} />);
      if (step === yearLabelStep) {
        lines.push(
          <text key={`tl${t}`} x={x + 10} y={H - 330} fill={COLORS.dim} fontFamily={FONTS.mono} fontSize={20} letterSpacing={2}>
            {`Y${String(t).padStart(2, "0")}`}
          </text>,
        );
      }
    }
  }
  return <g>{lines}</g>;
};

// The one continuous investment line: draws itself, follows the camera,
// crashes in red and recovers into the accent colour.
export const FinancialGraph: React.FC<{ g: number }> = ({ g }) => {
  const frame = useCurrentFrame();
  const t = tAt(g);
  const win = winAt(g);
  const sw = strokeAt(win);
  const pts = sampleSeries(t).map((p) => ({ ...toScreen(win, p.t, p.v), t: p.t }));
  const main = pts.filter((p) => p.t <= 30);
  const crash = pts.filter((p) => p.t >= 29.99 && p.t <= CRASH_END + 0.001);
  const rec = pts.filter((p) => p.t >= CRASH_END - 0.001);
  const tip = pts[pts.length - 1];
  const crashX = toScreen(win, CRASH_END, 0).x;
  const tipColor = t > 30 && t <= CRASH_END + 0.4 ? COLORS.crash : COLORS.accent;
  const area = pts.length > 1 ? `${path(pts)}L${tip.x},${H + 60}L${pts[0].x},${H + 60}Z` : "";
  const years = Array.from({ length: Math.min(30, Math.floor(t)) }, (_, i) => i + 1).filter((y) => y % 10 !== 0);

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="fg-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.2} />
          <stop offset="70%" stopColor={COLORS.accent} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="fg-rec" gradientUnits="userSpaceOnUse" x1={crashX} x2={crashX + 260} y1={0} y2={0}>
          <stop offset="0%" stopColor={COLORS.crash} />
          <stop offset="100%" stopColor={COLORS.accent} />
        </linearGradient>
        <filter id="fg-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={sw * 1.4} />
        </filter>
      </defs>
      <DataGrid win={win} />
      {area ? <path d={area} fill="url(#fg-area)" /> : null}
      {years.map((y) => {
        const p = toScreen(win, y, displayValueAt(y));
        return <circle key={y} cx={p.x} cy={p.y} r={Math.max(3, sw * 0.45)} fill={COLORS.ink} opacity={0.55} />;
      })}
      <g filter="url(#fg-glow)" opacity={0.55}>
        <path d={path(main)} stroke={COLORS.accent} strokeWidth={sw * 1.6} fill="none" />
        {crash.length > 1 ? <path d={path(crash)} stroke={COLORS.crash} strokeWidth={sw * 1.6} fill="none" /> : null}
      </g>
      <path d={path(main)} stroke={COLORS.accent} strokeWidth={sw} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {crash.length > 1 ? (
        <path d={path(crash)} stroke={COLORS.crash} strokeWidth={sw} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      ) : null}
      {rec.length > 1 ? (
        <path d={path(rec)} stroke="url(#fg-rec)" strokeWidth={sw} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      ) : null}
      {tip ? (
        <g>
          <line x1={0} x2={W} y1={tip.y} y2={tip.y} stroke={COLORS.ink} strokeOpacity={0.22} strokeDasharray="6 10" />
          <line x1={tip.x} x2={tip.x} y1={0} y2={H} stroke={COLORS.ink} strokeOpacity={0.1} strokeDasharray="6 10" />
          <DataPoint x={tip.x} y={tip.y} r={sw * 0.9} color={tipColor} frame={frame} />
          <g transform={`translate(${W - 200}, ${tip.y - 24})`}>
            <rect width={200} height={48} fill={tipColor} />
            <text x={16} y={33} fill={COLORS.accentInk} fontFamily={FONTS.mono} fontWeight={700} fontSize={24}>
              {`$${Math.round(displayValueAt(t)).toLocaleString("en-US")}`}
            </text>
          </g>
        </g>
      ) : null}
    </svg>
  );
};
