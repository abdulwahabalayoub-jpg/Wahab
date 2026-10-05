import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { ease, flashAt, tween } from "../lib/anim";
import { Kinetic } from "./Kinetic";

// Camera flies through the content: exponential scale-up with blur.
export const ZoomTransition: React.FC<{
  start: number;
  duration: number;
  to?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({ start, duration, to = 40, origin = "50% 50%", children }) => (
  <Kinetic
    origin={origin}
    motionBlur={0.15}
    pose={(f) => ({
      scale: tween(f, [start, start + duration], [1, to], ease.inExpo),
      opacity: f > start + duration ? 0 : 1,
    })}
    style={{ display: "block" }}
  >
    {children}
  </Kinetic>
);

// Whip: content enters from / exits towards an offset with heavy motion blur.
export const WhipTransition: React.FC<{
  enter?: { start: number; duration: number; from: { x?: number; y?: number } };
  exit?: { start: number; duration: number; to: { x?: number; y?: number } };
  children: React.ReactNode;
}> = ({ enter, exit, children }) => (
  <Kinetic
    motionBlur={0.6}
    style={{ display: "block" }}
    pose={(f) => {
      let x = 0;
      let y = 0;
      if (enter) {
        x += tween(f, [enter.start, enter.start + enter.duration], [enter.from.x ?? 0, 0], ease.outExpo);
        y += tween(f, [enter.start, enter.start + enter.duration], [enter.from.y ?? 0, 0], ease.outExpo);
      }
      if (exit) {
        x += tween(f, [exit.start, exit.start + exit.duration], [0, exit.to.x ?? 0], ease.inExpo);
        y += tween(f, [exit.start, exit.start + exit.duration], [0, exit.to.y ?? 0], ease.inExpo);
      }
      return { x, y };
    }}
  >
    {children}
  </Kinetic>
);

// Mask reveal for a line of type.
export const TextWipe: React.FC<{
  start: number;
  duration?: number;
  direction?: "up" | "right";
  children: React.ReactNode;
}> = ({ start, duration = 10, direction = "up", children }) => {
  const f = useCurrentFrame();
  const p = tween(f, [start, start + duration], [0, 1], ease.outExpo);
  if (f < start) return null;
  const clip = direction === "up" ? `inset(${(1 - p) * 100}% -5% -5% -5%)` : `inset(-5% ${(1 - p) * 100}% -5% -5%)`;
  const shift = direction === "up" ? `translateY(${(1 - p) * 40}%)` : `translateX(${-(1 - p) * 12}%)`;
  return (
    <div style={{ clipPath: clip }}>
      <div style={{ transform: shift }}>{children}</div>
    </div>
  );
};

export const Flash: React.FC<{ hits: readonly (readonly [number, number])[]; color?: string }> = ({
  hits,
  color = COLORS.ink,
}) => {
  const f = useCurrentFrame();
  const o = Math.min(0.9, flashAt(f, hits));
  if (o < 0.01) return null;
  return <AbsoluteFill style={{ backgroundColor: color, opacity: o, mixBlendMode: "screen" }} />;
};
