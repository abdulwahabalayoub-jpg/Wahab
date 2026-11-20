import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const serif = "Fraunces, Georgia, serif";
export const sans = "Inter, system-ui, sans-serif";

for (const w of [500, 600]) {
  loadFont({ family: "Fraunces", url: staticFile(`fonts/fraunces-latin-${w}-normal.woff2`), weight: String(w) });
}
for (const w of [400, 500, 600, 700]) {
  loadFont({ family: "Inter", url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: String(w) });
}

export const C = {
  gold: "#C2941B",
  goldD: "#A67C12",
  goldDD: "#8C690F",
  goldBg: "#FBF5E6",
  goldSoft: "#F6E7B8",
  cream: "#FBF7EE",
  ink: "#1f2328",
  ink2: "#4b5158",
  mute: "#80868d",
  line: "#eadfc4",
  green: "#2f7d4f",
  greenBg: "#e8f3ec",
  red: "#b4402f",
  redBg: "#fbe9e5",
  amber: "#946512",
  amberBg: "#fbf1dc",
};

export const FPS = 30;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 -> 1 progress between start and start+dur (frames), eased. */
export const prog = (f: number, start: number, dur = 24) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

/** Typing effect: characters of text visible at frame f. */
export const typed = (text: string, f: number, start: number, cps = 16) =>
  text.slice(0, Math.max(0, Math.floor(((f - start) / FPS) * cps)));

export const lerp = (f: number, keys: number[], values: number[]) =>
  interpolate(f, keys, values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
