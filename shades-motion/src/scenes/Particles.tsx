import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

// Floating dust motes drifting through the light shaft.
export const Particles: React.FC<{ count?: number; opacity?: number }> = ({
  count = 70,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {new Array(count).fill(true).map((_, i) => {
        const x0 = 20 + random(`x${i}`) * 50;
        const y0 = random(`y${i}`) * 70;
        const size = 1.5 + random(`s${i}`) ** 3 * 5;
        const speed = 0.02 + random(`v${i}`) * 0.05;
        const phase = random(`p${i}`) * Math.PI * 2;
        const y = (y0 + frame * speed) % 72;
        const x = x0 + Math.sin(frame / 40 + phase) * 1.2;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame / 25 + phase));
        const edge = interpolate(y, [0, 8, 60, 72], [0, 1, 1, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(240, 238, 225, 0.95)",
              boxShadow: `0 0 ${size * 3}px rgba(240, 238, 225, 0.8)`,
              filter: size > 4 ? "blur(1.5px)" : undefined,
              opacity: twinkle * edge,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
