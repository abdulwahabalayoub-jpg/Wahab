import { Easing, interpolate, random, spring } from "remotion";
import { VIDEO } from "../config";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const ease = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  snap: Easing.bezier(0.2, 0, 0, 1),
  inQuad: Easing.in(Easing.quad),
  outQuad: Easing.out(Easing.quad),
  outCubic: Easing.out(Easing.cubic),
  linear: Easing.linear,
};

export type EaseFn = (t: number) => number;

export const tween = (
  f: number,
  range: readonly [number, number],
  out: readonly [number, number],
  easing: EaseFn = ease.outExpo,
) => interpolate(f, [range[0], range[1]], [out[0], out[1]], { ...clamp, easing });

export const SPRINGS = {
  impact: { damping: 10, stiffness: 230, mass: 0.7 },
  snappy: { damping: 18, stiffness: 320, mass: 0.5 },
  bouncy: { damping: 7, stiffness: 200, mass: 0.6 },
  soft: { damping: 22, stiffness: 110, mass: 1 },
};

export const springAt = (f: number, start: number, config = SPRINGS.impact) =>
  spring({ frame: f - start, fps: VIDEO.fps, config });

// Scale punch: starts at `from` and lands on 1. Interpolated in log space
// so the spring overshoot stays proportional however big the punch is.
export const punch = (f: number, start: number, from: number, config = SPRINGS.impact) =>
  Math.pow(from, 1 - springAt(f, start, config));

export type Hit = readonly [start: number, duration: number, amplitude: number];

// Deterministic decaying camera shake for a list of hits.
export const shakeAt = (f: number, hits: readonly Hit[], seed = "cam") => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const [start, dur, amp] of hits) {
    if (f < start || f >= start + dur) continue;
    const k = Math.pow(1 - (f - start) / dur, 2);
    const fr = Math.floor(f);
    x += (random(`${seed}x${fr}`) * 2 - 1) * amp * k;
    y += (random(`${seed}y${fr}`) * 2 - 1) * amp * k;
    r += (random(`${seed}r${fr}`) * 2 - 1) * amp * k * 0.05;
  }
  return { x, y, r };
};

export type Key = readonly [frame: number, value: number, easing?: EaseFn];

// Piecewise keyframes. Equal consecutive frames act as a hard step.
export const keys = (f: number, k: readonly Key[]): number => {
  if (f <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [a, va] = k[i];
    const [b, vb, e] = k[i + 1];
    if (f <= b) {
      if (b === a) return vb;
      return interpolate(f, [a, b], [va, vb], { ...clamp, easing: e ?? ease.inOut });
    }
  }
  return k[k.length - 1][1];
};

export const between = (f: number, from: number, to = Infinity) => f >= from && f < to;

// Exponential flash decay summed over impact frames.
export const flashAt = (f: number, hits: readonly (readonly [number, number])[]) =>
  hits.reduce((acc, [h, s]) => (f >= h ? acc + s * Math.exp(-(f - h) / 2.2) : acc), 0);
