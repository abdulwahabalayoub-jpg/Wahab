import { Easing } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const cinematic = Easing.bezier(0.33, 0, 0.15, 1);

export const BRAND = {
  darkOlive: "#3F4335",
  mutedOlive: "#6A6D52",
  ecru: "#E3E3DC",
};

export const fullFrame: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};
