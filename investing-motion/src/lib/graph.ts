import { VIDEO } from "../config";
import { ease, keys, tween } from "./anim";
import { displayValueAt, PEAK } from "./finance";

// Graph-scene timeline (frames local to the graph scene).
export const G = {
  start: 0,
  zoomThrough: 70,
  arrive10: 112,
  arrive20: 157,
  arrive30: 190,
  stop: 202,
  crash: 216,
  crashEnd: 226,
  plunge: 256,
  panic: 266,
  black: 308,
  recover: 320,
  freezeCam: 400,
  end: 442,
} as const;

// Years elapsed on the graph at frame g. Never resets: the crash and
// recovery continue the same line.
export const tAt = (g: number) =>
  keys(g, [
    [0, 0],
    [12, 3, ease.outExpo],
    [82, 7, ease.inQuad],
    [G.arrive10, 10, ease.outCubic],
    [120, 10],
    [G.arrive20, 20, ease.inOut],
    [163, 20],
    [G.arrive30, 30, ease.inOut],
    [G.crash, 30],
    [G.crashEnd, 30.5, ease.outQuad],
    [G.recover, 30.5],
    [370, 32.2, ease.outQuad],
    [G.end, 40, ease.inQuad],
  ]);

export type Win = { t0: number; t1: number; v0: number; v1: number };
type Tip = { t: number; v: number };

const { width: W, height: H } = VIDEO;

export const toScreen = (w: Win, t: number, v: number) => ({
  x: ((t - w.t0) / (w.t1 - w.t0)) * W,
  y: ((w.v1 - v) / (w.v1 - w.v0)) * H,
});

// Window with the point (t, v) placed at screen fraction (ax, ay).
export const around = (t: number, v: number, spanT: number, spanV: number, ax: number, ay: number): Win => ({
  t0: t - spanT * ax,
  t1: t + spanT * (1 - ax),
  v1: v + spanV * ay,
  v0: v + spanV * ay - spanV,
});

// Camera blend: centres move linearly, spans zoom geometrically.
export const lerpWin = (a: Win, b: Win, p: number): Win => {
  const cT = (a.t0 + a.t1) / 2 + (((b.t0 + b.t1) / 2) - (a.t0 + a.t1) / 2) * p;
  const cV = (a.v0 + a.v1) / 2 + (((b.v0 + b.v1) / 2) - (a.v0 + a.v1) / 2) * p;
  const sT = Math.pow(a.t1 - a.t0, 1 - p) * Math.pow(b.t1 - b.t0, p);
  const sV = Math.pow(a.v1 - a.v0, 1 - p) * Math.pow(b.v1 - b.v0, p);
  return { t0: cT - sT / 2, t1: cT + sT / 2, v0: cV - sV / 2, v1: cV + sV / 2 };
};

const W0: Win = { t0: -1.2, t1: 7.8, v0: 800, v1: 20000 };
const follow = (p: Tip) => around(p.t, p.v, 5, p.v * 0.6, 0.66, 0.42);
const close = (p: Tip) => around(p.t, p.v, 1.3, p.v * 0.15, 0.5, 0.4);
const full = (p: Tip): Win => ({ t0: -1.5, t1: p.t + 4.5, v0: -0.2 * p.v, v1: p.v * 1.75 });
const recovery = (p: Tip) => around(p.t, p.v, 6, p.v * 1.1, 0.55, 0.45);

const tipAt = (g: number): Tip => {
  const t = tAt(g);
  return { t, v: displayValueAt(t) };
};

// The camera: which slice of data space fills the screen at frame g.
export const winAt = (g: number): Win => {
  const tip = tipAt(g);
  const seg = (a: number, b: number, A: Win, B: Win, e = ease.inOut) => lerpWin(A, B, tween(g, [a, b], [0, 1], e));
  if (g < G.zoomThrough) return W0;
  if (g < 84) return seg(G.zoomThrough, 84, W0, follow(tip), ease.inExpo);
  if (g < 100) return follow(tip);
  if (g < 110) return seg(100, 110, follow(tip), close(tip));
  if (g < 120) return close(tip);
  if (g < 140) return seg(120, 140, close(tip), full(tip), ease.outExpo);
  if (g < 150) return full(tip);
  if (g < G.arrive20) return seg(150, G.arrive20, full(tip), close(tip), ease.inExpo);
  if (g < 165) return close(tip);
  if (g < 182) return seg(165, 182, close(tip), full(tip), ease.outExpo);
  if (g < G.arrive30) return full(tip);
  if (g < G.recover) return full({ t: 30, v: PEAK });
  if (g < G.freezeCam) return recovery({ t: Math.max(30.5, tip.t), v: displayValueAt(Math.max(30.5, tip.t)) });
  return recovery(tipAt(G.freezeCam));
};

// Extra screen-space camera travel: the plunge after the crash and the
// upward whip out of the recovery.
export const camOffsetY = (g: number) =>
  (g < G.recover ? tween(g, [G.plunge, G.panic], [0, -2400], ease.inExpo) : 0) +
  tween(g, [428, G.end], [0, 1500], ease.inExpo);

export const strokeAt = (w: Win) => {
  const z = 9 / (w.t1 - w.t0);
  return Math.min(20, Math.max(4.5, 4 + 4 * Math.sqrt(z)));
};
