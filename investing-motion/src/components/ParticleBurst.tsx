import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS } from "../config";

// Deterministic particle system: burst, drag, gravity, streaked shards.
export const ParticleBurst: React.FC<{
  x: number;
  y: number;
  start: number;
  count?: number;
  speed?: readonly [number, number];
  angle?: readonly [number, number]; // radians
  gravity?: number;
  drag?: number;
  life?: number;
  size?: readonly [number, number];
  color?: string;
  shape?: "dot" | "shard";
  spawnRadius?: number;
  seed?: string;
}> = ({
  x,
  y,
  start,
  count = 60,
  speed = [6, 24],
  angle = [0, Math.PI * 2],
  gravity = 0,
  drag = 0.9,
  life = 36,
  size = [3, 9],
  color = COLORS.ink,
  shape = "dot",
  spawnRadius = 0,
  seed = "pb",
}) => {
  const f = useCurrentFrame();
  const a = f - start;
  if (a < 0 || a > life) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const th = angle[0] + (angle[1] - angle[0]) * r("a");
        const sp = speed[0] + (speed[1] - speed[0]) * Math.pow(r("s"), 1.6);
        const sz = size[0] + (size[1] - size[0]) * Math.pow(r("z"), 2);
        const ownLife = life * (0.5 + 0.5 * r("l"));
        if (a > ownLife) return null;
        const dist = drag === 1 ? sp * a : (sp * (1 - Math.pow(drag, a))) / (1 - drag);
        const sx = x + Math.cos(th) * (dist + spawnRadius * r("r"));
        const sy = y + Math.sin(th) * (dist + spawnRadius * r("r")) + 0.5 * gravity * a * a;
        const vNow = sp * Math.pow(drag, a);
        const vy = Math.sin(th) * vNow + gravity * a;
        const vx = Math.cos(th) * vNow;
        const vel = Math.hypot(vx, vy);
        const rot = (Math.atan2(vy, vx) * 180) / Math.PI;
        const op = 1 - Math.pow(a / ownLife, 1.5);
        const len = shape === "shard" ? sz * (1.5 + vel * 0.6) : sz;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sx - len / 2,
              top: sy - sz / 2,
              width: len,
              height: shape === "shard" ? Math.max(2, sz * 0.35) : sz,
              borderRadius: shape === "dot" ? "50%" : 1,
              background: color,
              opacity: op,
              transform: `rotate(${rot}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
