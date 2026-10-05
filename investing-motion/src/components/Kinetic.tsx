import type React from "react";
import { useId } from "react";
import { useCurrentFrame } from "remotion";

export type Pose = {
  x?: number;
  y?: number;
  scale?: number;
  sx?: number;
  sy?: number;
  rotate?: number;
  skewX?: number;
  opacity?: number;
  blur?: number;
};

export const poseTransform = (p: Pose) =>
  `translate(${p.x ?? 0}px, ${p.y ?? 0}px) rotate(${p.rotate ?? 0}deg) skewX(${p.skewX ?? 0}deg) scale(${(p.scale ?? 1) * (p.sx ?? 1)}, ${(p.scale ?? 1) * (p.sy ?? 1)})`;

export const useFilterId = (prefix: string) => prefix + useId().replace(/[^a-zA-Z0-9]/g, "");

// Directional gaussian blur, used as fake per-object motion blur.
export const MotionBlurFilter: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
      </filter>
    </defs>
  </svg>
);

type KineticProps = {
  // Pose as a function of the local frame. Evaluated at f and f-1 so the
  // velocity can drive motion blur.
  pose: (f: number) => Pose;
  motionBlur?: number;
  origin?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

// A full-frame layer whose content is centred and offset by the pose.
export const Kinetic: React.FC<KineticProps> = ({
  pose,
  motionBlur = 0.5,
  origin = "50% 50%",
  style,
  children,
}) => {
  const f = useCurrentFrame();
  const id = useFilterId("mb");
  const p = pose(f);
  const q = pose(f - 1);
  if ((p.opacity ?? 1) <= 0) return null;

  const s = Math.max(0.02, p.scale ?? 1);
  const dScale = Math.abs((p.scale ?? 1) - (q.scale ?? 1)) / s;
  const bx = Math.min(
    60,
    (Math.abs((p.x ?? 0) - (q.x ?? 0)) * motionBlur + dScale * 50 * motionBlur) / (s * (p.sx ?? 1)),
  );
  const by = Math.min(
    60,
    (Math.abs((p.y ?? 0) - (q.y ?? 0)) * motionBlur + dScale * 50 * motionBlur) / (s * (p.sy ?? 1)),
  );
  const useMb = motionBlur > 0 && (bx > 0.4 || by > 0.4);
  const filter = [useMb ? `url(#${id})` : "", p.blur ? `blur(${p.blur}px)` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {useMb ? <MotionBlurFilter id={id} x={bx} y={by} /> : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: poseTransform(p),
          transformOrigin: origin,
          opacity: p.opacity ?? 1,
          filter: filter || undefined,
          ...style,
        }}
      >
        {children}
      </div>
    </>
  );
};

// Kinetic typography: a single styled line driven by a pose.
export const KineticText: React.FC<
  Omit<KineticProps, "children"> & { text: string; textStyle: React.CSSProperties }
> = ({ text, textStyle, ...rest }) => (
  <Kinetic {...rest}>
    <div style={textStyle}>{text}</div>
  </Kinetic>
);
