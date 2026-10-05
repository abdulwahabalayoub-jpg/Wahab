import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, easeOut, fullFrame } from "../anim";

// Category icon columns rise in sequence.
export const Icons: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#2c2f25" }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const start = (0.15 + i * 0.16) * fps;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(0 ${80 - i * 20}% 0 ${i * 20}%)` }}>
            <Img
              src={staticFile("icons.jpg")}
              style={{
                ...fullFrame,
                translate: interpolate(frame, [start, start + 1.2 * fps], ["0px 1080px", "0px 0px"], {
                  ...clamp,
                  easing: easeOut,
                }),
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
