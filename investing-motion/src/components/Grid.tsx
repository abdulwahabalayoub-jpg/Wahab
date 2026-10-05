import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, VIDEO } from "../config";
import { ease, tween } from "../lib/anim";

// Background grid that draws on from the centre and can drift (parallax).
export const Grid: React.FC<{
  start?: number;
  cell?: number;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
}> = ({ start = 0, cell = 120, offsetX = 0, offsetY = 0, opacity = 1 }) => {
  const f = useCurrentFrame();
  const p = tween(f, [start, start + 18], [0, 1], ease.outExpo);
  const { width: W, height: H } = VIDEO;
  const ox = ((offsetX % cell) + cell) % cell;
  const oy = ((offsetY % cell) + cell) % cell;
  const vs = Array.from({ length: Math.ceil(W / cell) + 2 }, (_, i) => i * cell - cell + ox);
  const hs = Array.from({ length: Math.ceil(H / cell) + 2 }, (_, i) => i * cell - cell + oy);

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={W} height={H}>
        {vs.map((x) => (
          <line key={`v${x}`} x1={x} x2={x} y1={H / 2 - (H / 2) * p} y2={H / 2 + (H / 2) * p} stroke={COLORS.line} strokeWidth={1} />
        ))}
        {hs.map((y) => (
          <line key={`h${y}`} y1={y} y2={y} x1={W / 2 - (W / 2) * p} x2={W / 2 + (W / 2) * p} stroke={COLORS.line} strokeWidth={1} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
