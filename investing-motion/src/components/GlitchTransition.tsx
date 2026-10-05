import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { useFilterId } from "./Kinetic";

// Digital glitch: RGB split plus displaced horizontal slices.
// `intensity` returns 0..1 for the local frame; 0 renders children untouched.
export const GlitchTransition: React.FC<{
  intensity: (f: number) => number;
  seed?: string;
  background?: string;
  children: React.ReactNode;
}> = ({ intensity, seed = "gl", background = COLORS.bg, children }) => {
  const f = useCurrentFrame();
  const id = useFilterId("gl");
  const k = intensity(f);
  if (k <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;

  const r = (s: string) => random(`${seed}-${Math.floor(f)}-${s}`);
  const split = 10 + 26 * k;
  const bands = Array.from({ length: 7 }, (_, i) => {
    const top = r(`t${i}`) * 92;
    const height = 1.5 + r(`h${i}`) * 9 * k;
    const dx = (r(`x${i}`) * 2 - 1) * 160 * k;
    return { top, height, dx, on: r(`o${i}`) < 0.75 };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: background, isolation: "isolate" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={`${id}r`}>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id={`${id}c`}>
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id}r)`, transform: `translateX(${-split}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ filter: `url(#${id}c)`, transform: `translateX(${split}px)`, mixBlendMode: "screen" }}>
        {children}
      </AbsoluteFill>
      {bands
        .filter((b) => b.on)
        .map((b, i) => (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${b.top}% 0 ${Math.max(0, 100 - b.top - b.height)}% 0)`,
              backgroundColor: background,
            }}
          >
            <AbsoluteFill style={{ transform: `translateX(${b.dx}px)` }}>{children}</AbsoluteFill>
          </AbsoluteFill>
        ))}
    </AbsoluteFill>
  );
};
