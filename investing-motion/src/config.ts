// Central configuration: format, palette, type, timing and the financial assumptions.

export const VIDEO = {
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: 1050, // 35s
} as const;

export const COLORS = {
  bg: "#060708",
  ink: "#F2F1EC",
  dim: "#7C818A",
  line: "rgba(242,241,236,0.07)",
  accent: "#D4FF3A", // growth
  accentInk: "#0B0D05", // text on accent
  crash: "#FF3D3D", // loss
} as const;

export const FONTS = {
  display: "Inter Tight",
  mono: "JetBrains Mono",
} as const;

// Illustrative assumptions only. Not a forecast, not a guaranteed return.
export const FINANCE = {
  initial: 10_000,
  rate: 0.08,
  crashYear: 30,
  crashDrop: 0.32,
  crashDuration: 0.5, // years
  recoveryRate: 0.12,
  horizon: 40,
} as const;

// Global frame where each scene starts (30fps). Scenes overlap where a
// transition hands one scene to the next.
export const SCENES = {
  hook: { from: 0, duration: 90 },
  inflation: { from: 90, duration: 120 },
  choice: { from: 210, duration: 90 },
  compounding: { from: 300, duration: 80 },
  graph: { from: 368, duration: 442 },
  time: { from: 810, duration: 120 },
  final: { from: 930, duration: 120 },
} as const;

// Imagined sound-design beats (global frames) the motion is cut to.
// Drop an audio track on these when scoring the edit.
export const BEATS = {
  impactLosing: 16,
  hitEvery: 54,
  hitSingle: 62,
  hitDay: 70,
  whooshToInflation: 82,
  slamIt: 188,
  investExplode: 262,
  whooshThroughInvest: 286,
  click8pct: [332, 346, 356],
  zoomThroughPlus8: 438,
  year10: 480,
  year20: 525,
  year30: 558,
  stop: 570,
  crash: 584,
  silencePanic: 634,
  silenceBlack: 676,
  recover: 694,
  timeSlam: 810,
  stopBeforeFinal: 922,
  finalImpact: 972,
} as const;
