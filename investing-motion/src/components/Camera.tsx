import type React from "react";
import { useCurrentFrame } from "remotion";
import { type Hit, shakeAt } from "../lib/anim";
import { Kinetic, type Pose } from "./Kinetic";

// Wraps a whole scene: camera moves (with motion blur), punches and a
// decaying shake (kept sharp so impacts stay crisp).
export const Camera: React.FC<{
  pose?: (f: number) => Pose;
  shake?: readonly Hit[];
  motionBlur?: number;
  children: React.ReactNode;
}> = ({ pose, shake = [], motionBlur = 0.25, children }) => {
  const f = useCurrentFrame();
  const s = shakeAt(f, shake);
  return (
    <Kinetic motionBlur={motionBlur} pose={(fr) => (pose ? pose(fr) : {})} style={{ display: "block" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` }}>{children}</div>
    </Kinetic>
  );
};
