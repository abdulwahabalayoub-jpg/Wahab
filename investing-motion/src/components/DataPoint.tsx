import type React from "react";
import { COLORS } from "../config";

// Data node with a repeating pulse ring (SVG).
export const DataPoint: React.FC<{
  x: number;
  y: number;
  r?: number;
  color?: string;
  frame: number;
  pulse?: boolean;
}> = ({ x, y, r = 9, color = COLORS.accent, frame, pulse = true }) => {
  const p = (frame % 24) / 24;
  return (
    <g>
      {pulse ? <circle cx={x} cy={y} r={r * (1 + p * 3.2)} fill="none" stroke={color} strokeWidth={2} opacity={0.7 * (1 - p)} /> : null}
      <circle cx={x} cy={y} r={r * 1.9} fill={color} opacity={0.18} />
      <circle cx={x} cy={y} r={r} fill={COLORS.bg} stroke={color} strokeWidth={r * 0.55} />
    </g>
  );
};
