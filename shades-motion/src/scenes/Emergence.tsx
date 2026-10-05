import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cinematic, clamp, easeInOut, easeOut, fullFrame } from "../anim";
import { Particles } from "./Particles";

// The deer emerges from the mist and settles into the exact hero frame.
// The final frame reproduces the "Symbol of Pure Grace" still.
export const Emergence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blur = interpolate(frame, [1.5 * fps, 9 * fps], [22, 0], {
    ...clamp,
    easing: easeInOut,
  });
  const brightness = interpolate(frame, [2 * fps, 9.5 * fps], [0.1, 1], {
    ...clamp,
    easing: easeInOut,
  });
  const rim = interpolate(frame, [6 * fps, 9.5 * fps, 10.5 * fps], [0, 0.55, 0], clamp);
  const breath = frame > 10 * fps ? Math.sin((frame - 10 * fps) / (1.3 * fps)) * 0.004 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1d16", overflow: "hidden" }}>
      {/* Camera: slow reveal that eases to a dead stop on the hero framing */}
      <AbsoluteFill
        style={{
          transformOrigin: "36% 38%",
          scale: interpolate(frame, [0, 10 * fps], [1.14, 1], {
            ...clamp,
            easing: cinematic,
          }),
        }}
      >
        <Img src={staticFile("forest_empty.jpg")} style={fullFrame} />
        <Img
          src={staticFile("forest_lit.jpg")}
          style={{
            ...fullFrame,
            opacity: interpolate(frame, [7.5 * fps, 10 * fps], [0, 1], {
              ...clamp,
              easing: easeInOut,
            }),
          }}
        />

        {/* Glowing haze in the gap between the trunks */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 22% 38% at 34% 26%, rgba(225,228,212,0.55), rgba(225,228,212,0) 70%)",
            mixBlendMode: "screen",
            opacity: interpolate(frame, [0, 4 * fps, 10 * fps], [0.9, 0.75, 0], clamp),
          }}
        />

        {/* The deer: silhouette in the haze, walking forward into the light */}
        <AbsoluteFill
          style={{
            transformOrigin: "24% 100%",
            opacity: interpolate(frame, [1.5 * fps, 5 * fps], [0, 1], clamp),
            scale: interpolate(frame, [1.5 * fps, 10 * fps], [0.78, 1], {
              ...clamp,
              easing: cinematic,
              output: "perceptual-scale",
            }),
            translate: interpolate(frame, [1.5 * fps, 10 * fps], ["150px -20px", "0px 0px"], {
              ...clamp,
              easing: cinematic,
            }),
          }}
        >
          <AbsoluteFill style={{ transformOrigin: "24% 100%", scale: `1 ${1 + breath}` }}>
            <Img
              src={staticFile("deer.png")}
              style={{
                ...fullFrame,
                filter: `blur(${blur}px) brightness(${brightness}) drop-shadow(0 0 14px rgba(255,236,200,${rim}))`,
              }}
            />
          </AbsoluteFill>
        </AbsoluteFill>

        {/* Drifting mist in front of the deer */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 45% 30% at 30% 55%, rgba(200,204,188,0.6), rgba(200,204,188,0) 70%), radial-gradient(ellipse 50% 35% at 70% 70%, rgba(190,195,178,0.45), rgba(190,195,178,0) 70%)",
            filter: "blur(30px)",
            translate: interpolate(frame, [0, 14 * fps], ["-60px 0px", "80px -10px"]),
            opacity: interpolate(frame, [0, 3 * fps, 9 * fps], [0.95, 0.7, 0], {
              ...clamp,
              easing: easeInOut,
            }),
          }}
        />

        <Particles />
      </AbsoluteFill>

      {/* Typography reveal over the settled hold */}
      <Img
        src={staticFile("text.png")}
        style={{
          ...fullFrame,
          clipPath: `inset(0 ${interpolate(frame, [10.5 * fps, 12.5 * fps], [52, 0], {
            ...clamp,
            easing: easeOut,
          })}% 0 0)`,
          opacity: interpolate(frame, [10.5 * fps, 11.5 * fps], [0, 1], clamp),
        }}
      />

      {/* Fade up from black */}
      <AbsoluteFill
        style={{
          backgroundColor: "#0d0e0b",
          opacity: interpolate(frame, [0, 1.5 * fps], [1, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
