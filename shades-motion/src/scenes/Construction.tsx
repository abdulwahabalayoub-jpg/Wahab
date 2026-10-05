import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, easeInOut, fullFrame } from "../anim";
import { Particles } from "./Particles";

// The logo line traces itself over the deer.
export const Construction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawn = interpolate(frame, [0.6 * fps, 4 * fps], [100, 0], {
    ...clamp,
    easing: easeInOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1d16", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, 6 * fps], [1.06, 1], { ...clamp, easing: easeInOut }),
        }}
      >
        <Img src={staticFile("construction_base.jpg")} style={fullFrame} />
        <Img
          src={staticFile("stroke.png")}
          style={{
            ...fullFrame,
            clipPath: `inset(0 0 ${drawn}% 0)`,
            filter: "drop-shadow(0 0 10px rgba(240,238,225,0.55))",
          }}
        />
        <Particles count={40} opacity={0.6} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
