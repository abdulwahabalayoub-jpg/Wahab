import type React from "react";
import { COLORS, FONTS } from "../config";

export const display = (
  size: number,
  color: string = COLORS.ink,
  weight = 900,
): React.CSSProperties => ({
  fontFamily: FONTS.display,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: "-0.055em",
  lineHeight: 0.9,
  color,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  fontVariantNumeric: "tabular-nums",
});

export const mono = (
  size: number,
  color: string = COLORS.dim,
  weight = 500,
): React.CSSProperties => ({
  fontFamily: FONTS.mono,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: "0.16em",
  color,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
});

export const money = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
