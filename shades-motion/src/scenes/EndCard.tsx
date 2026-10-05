import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, clamp, easeInOut, easeOut, fullFrame } from "../anim";

// Centered ecru logo on dark olive to close the film.
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.darkOlive }}>
      <AbsoluteFill
        style={{
          translate: "-25% 0%",
          scale: interpolate(frame, [0, durationInFrames], [1.0, 1.04]),
          opacity: interpolate(frame, [durationInFrames - 0.8 * fps, durationInFrames], [1, 0], clamp),
        }}
      >
        <Img
          src={staticFile("logo_r_icon.png")}
          style={{
            ...fullFrame,
            clipPath: `inset(0 0 ${interpolate(frame, [0.2 * fps, 1.6 * fps], [100, 0], {
              ...clamp,
              easing: easeInOut,
            })}% 0)`,
          }}
        />
        <Img
          src={staticFile("logo_r_word.png")}
          style={{
            ...fullFrame,
            opacity: interpolate(frame, [0.9 * fps, 2 * fps], [0, 1], clamp),
            translate: interpolate(frame, [0.9 * fps, 2.2 * fps], ["0px 20px", "0px 0px"], {
              ...clamp,
              easing: easeOut,
            }),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
