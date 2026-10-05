import { FINANCE } from "../config";

const { initial, rate, crashYear, crashDrop, crashDuration, recoveryRate } = FINANCE;

export const compound = (years: number) => initial * Math.pow(1 + rate, years);

export const PEAK = compound(crashYear); // $100,627
export const TROUGH = PEAK * (1 - crashDrop);
export const CRASH_END = crashYear + crashDuration;

// Market texture that is exactly zero on 10-year milestones, so the
// labelled values stay true to the 8% assumption.
const wiggle = (t: number) =>
  Math.sin((Math.PI * t) / 10) *
  (0.42 * Math.sin(t * 3.1) + 0.27 * Math.sin(t * 7.9 + 1) + 0.18 * Math.sin(t * 17.3 + 2) + 0.13 * Math.sin(t * 41.7 + 4)) *
  0.04;

const recoveryWiggle = (s: number) =>
  (1 - Math.exp(-s * 2)) *
  (0.4 * Math.sin(s * 2.9) + 0.3 * Math.sin(s * 8.3 + 0.7) + 0.18 * Math.sin(s * 19.1 + 2) + 0.12 * Math.sin(s * 43.3 + 1)) *
  0.035;

// Value plotted on the graph at time t (years).
export const valueAt = (t: number): number => {
  if (t <= crashYear) return compound(Math.max(0, t)) * (1 + wiggle(t));
  if (t <= CRASH_END) {
    const u = (t - crashYear) / crashDuration;
    const fall = 1 - Math.pow(1 - u, 2.2);
    const jag = Math.sin(u * Math.PI * 7) * 0.025 * Math.sin(u * Math.PI);
    return PEAK * (1 - crashDrop * fall + jag);
  }
  const s = t - CRASH_END;
  return TROUGH * Math.pow(1 + recoveryRate, s) * (1 + recoveryWiggle(s));
};

// Smooth value for counters (no texture).
export const displayValueAt = (t: number) => {
  if (t <= crashYear) return compound(Math.max(0, t));
  if (t <= CRASH_END) return PEAK * (1 - crashDrop * ((t - crashYear) / crashDuration));
  return TROUGH * Math.pow(1 + recoveryRate, t - CRASH_END);
};

export const sampleSeries = (tEnd: number) => {
  const pts: { t: number; v: number }[] = [];
  const end = Math.max(0, tEnd);
  let t = 0;
  while (t < end) {
    pts.push({ t, v: valueAt(t) });
    t += t >= crashYear && t < CRASH_END ? 0.01 : 0.05;
  }
  pts.push({ t: end, v: valueAt(end) });
  return pts;
};
