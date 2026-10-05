import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS, VIDEO } from "../config";
import { compound } from "../lib/finance";
import { display, mono } from "../lib/type";
import { MotionBlurFilter, useFilterId } from "./Kinetic";

const { width: W, height: H } = VIDEO;
const PX = 92; // pixels per year on the tape

// Years flying past: parallax tape, playhead, calendar cells and a growth trace.
export const Timeline: React.FC<{ age: (f: number) => number; opacity?: number }> = ({ age, opacity = 1 }) => {
  const f = useCurrentFrame();
  const id = useFilterId("tl");
  const a = age(f);
  const vel = Math.abs(a - age(f - 1)) * PX;
  const blur = Math.min(50, vel * 0.35);
  const tapeY = H / 2 + 330;
  const ticks = Array.from({ length: 41 }, (_, i) => 15 + i);
  const month = Math.floor((((a % 1) + 1) % 1) * 12);
  const traceEnd = Math.min(1, (a - 20) / 30);

  return (
    <AbsoluteFill style={{ opacity }}>
      <MotionBlurFilter id={id} x={blur} y={0} />
      {/* Far layer: giant ghost numerals, slow parallax */}
      <AbsoluteFill style={{ filter: blur > 0.5 ? `url(#${id})` : undefined }}>
        {[20, 25, 30, 35, 40, 45, 50, 55].map((n) => (
          <div
            key={n}
            style={{
              position: "absolute",
              left: W / 2 + (n - a) * PX * 0.75 - 200,
              top: H / 2 - 470,
              width: 400,
              textAlign: "center",
              ...display(200, COLORS.ink, 900),
              opacity: 0.06,
            }}
          >
            {n}
          </div>
        ))}
      </AbsoluteFill>
      {/* Growth trace in the background */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path
          d={Array.from({ length: 61 }, (_, i) => {
            const u = (i / 60) * traceEnd;
            const x = 90 + u * (W - 180);
            const y = H / 2 + 120 - ((compound(u * 30) - 10000) / 90627) * 520;
            return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join("")}
          stroke={COLORS.accent}
          strokeOpacity={0.35}
          strokeWidth={3}
          fill="none"
        />
      </svg>
      {/* Near layer: the tape */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, filter: blur > 0.5 ? `url(#${id})` : undefined }}>
        <line x1={0} x2={W} y1={tapeY} y2={tapeY} stroke={COLORS.ink} strokeOpacity={0.25} />
        {ticks.map((n) => {
          const x = W / 2 + (n - a) * PX;
          const major = n % 5 === 0;
          return (
            <g key={n}>
              <line x1={x} x2={x} y1={tapeY} y2={tapeY + (major ? 60 : 26)} stroke={COLORS.ink} strokeOpacity={major ? 0.9 : 0.35} strokeWidth={major ? 3 : 2} />
              {major ? (
                <text x={x} y={tapeY + 110} textAnchor="middle" fill={COLORS.ink} fontFamily={FONTS.mono} fontWeight={700} fontSize={34}>
                  {n}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {/* Playhead */}
      <div style={{ position: "absolute", left: W / 2 - 2, top: tapeY - 70, width: 4, height: 150, background: COLORS.accent }} />
      <div style={{ position: "absolute", left: W / 2 - 14, top: tapeY - 86, width: 28, height: 28, background: COLORS.accent, transform: "rotate(45deg)" }} />
      {/* Calendar cells */}
      <div style={{ position: "absolute", left: W / 2 - 230, top: tapeY + 190, display: "grid", gridTemplateColumns: "repeat(12, 30px)", gap: 8 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 30,
              height: 30,
              background: i === month ? COLORS.accent : COLORS.ink,
              opacity: i === month ? 1 : i < month ? 0.35 : 0.08,
            }}
          />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: tapeY + 250, textAlign: "center", ...mono(24) }}>
        {`YEAR ${Math.floor(2026 + (a - 20))}  ·  ${String(month + 1).padStart(2, "0")}`}
      </div>
    </AbsoluteFill>
  );
};
