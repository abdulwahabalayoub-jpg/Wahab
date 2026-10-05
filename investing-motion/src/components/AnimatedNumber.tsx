import type React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { display, money } from "../lib/type";
import { MotionBlurFilter, useFilterId } from "./Kinetic";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Odometer position (0..10) of the digit at 10^k. A wheel only turns
// while every lower wheel is finishing its last step (a true carry), and
// the turn is eased so each digit rests crisply. Columns spinning faster
// than ~0.6 digits/frame snap to whole digits instead of smearing.
const easeRoll = (x: number) => 1 - Math.pow(1 - clamp01((x - 0.55) / 0.45), 3);

const digitPos = (v: number, k: number, rate: number) => {
  const pow = Math.pow(10, k);
  const digit = Math.floor(v / pow) % 10;
  if (rate > 0.6) return digit;
  const carry = k === 0 ? v % 1 : clamp01((v % pow) - (pow - 1));
  return digit + easeRoll(carry);
};

const columnVisibility = (v: number, k: number, minDigits: number) =>
  k < minDigits ? 1 : clamp01(v - (Math.pow(10, k) - 1));

// Odometer counter: every digit physically rolls, gets motion blur from
// its own velocity, and leading columns collapse as the value shrinks.
export const AnimatedNumber: React.FC<{
  at: (f: number) => number;
  size: number;
  color?: string;
  prefix?: string;
  minDigits?: number;
  weight?: number;
}> = ({ at, size, color = COLORS.ink, prefix = "$", minDigits = 1, weight = 900 }) => {
  const f = useCurrentFrame();
  const id = useFilterId("num");
  const v = Math.max(0, at(f));
  const pv = Math.max(0, at(f - 1));
  const h = size * 0.98;
  const colW = size * 0.6;
  const digits = Math.max(minDigits, Math.floor(Math.log10(Math.max(1, v, pv))) + 2);
  const cols = Array.from({ length: digits }, (_, i) => digits - 1 - i);
  const base = display(size, color, weight);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", ...base, letterSpacing: 0 }}>
      {prefix ? <div style={{ height: h, lineHeight: `${h}px`, marginRight: size * 0.02 }}>{prefix}</div> : null}
      {cols.map((k) => {
        const vis = columnVisibility(v, k, minDigits);
        if (vis <= 0) return null;
        const rate = Math.abs(v - pv) / Math.pow(10, k);
        const pos = digitPos(v, k, rate);
        let d = pos - digitPos(pv, k, rate);
        if (d > 5) d -= 10;
        if (d < -5) d += 10;
        const blur = rate > 0.6 ? 0 : Math.min(24, Math.abs(d) * h * 0.18);
        const showComma = k > 0 && k % 3 === 0;
        return (
          <div key={k} style={{ display: "flex" }}>
            <div style={{ width: colW * vis, height: h, overflow: "hidden", position: "relative" }}>
              {blur > 0.5 ? <MotionBlurFilter id={`${id}${k}`} x={0} y={blur} /> : null}
              <div
                style={{
                  position: "absolute",
                  left: -(colW * (1 - vis)) / 2,
                  width: colW,
                  transform: `translateY(${-pos * h}px)`,
                  filter: blur > 0.5 ? `url(#${id}${k})` : undefined,
                  opacity: vis,
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => (
                  <div key={i} style={{ height: h, lineHeight: `${h}px`, textAlign: "center" }}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
            {showComma ? (
              <div style={{ width: size * 0.26 * vis, height: h, lineHeight: `${h}px`, overflow: "hidden", opacity: vis }}>
                ,
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

// Lightweight counter for HUD readouts.
export const Counter: React.FC<{ value: number; style: React.CSSProperties }> = ({ value, style }) => (
  <div style={{ ...style, fontVariantNumeric: "tabular-nums" }}>{money(value)}</div>
);
