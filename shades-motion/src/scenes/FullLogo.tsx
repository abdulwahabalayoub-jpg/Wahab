import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, clamp, easeInOut, easeOut, fullFrame } from "../anim";

// Light and dark logo lockups, mirroring the "Full Logo" board.
export const FullLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconClip = interpolate(frame, [0.4 * fps, 2 * fps], [100, 0], {
    ...clamp,
    easing: easeInOut,
  });
  const word = {
    opacity: interpolate(frame, [1.2 * fps, 2.4 * fps], [0, 1], clamp),
    translate: interpolate(frame, [1.2 * fps, 2.6 * fps], ["0px 24px", "0px 0px"], {
      ...clamp,
      easing: easeOut,
    }),
    filter: `blur(${interpolate(frame, [1.2 * fps, 2.4 * fps], [8, 0], clamp)}px)`,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.darkOlive }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "47.65%", backgroundColor: BRAND.ecru }} />
      <div
        style={{
          position: "absolute",
          left: "47.65%",
          top: 0,
          bottom: 0,
          width: "4.65%",
          backgroundColor: BRAND.mutedOlive,
          scale: `1 ${interpolate(frame, [0, 1.2 * fps], [0, 1], { ...clamp, easing: easeOut })}`,
        }}
      />
      <Img src={staticFile("logo_l_icon.png")} style={{ ...fullFrame, clipPath: `inset(0 0 ${iconClip}% 0)` }} />
      <Img src={staticFile("logo_r_icon.png")} style={{ ...fullFrame, clipPath: `inset(0 0 ${iconClip}% 0)` }} />
      <Img src={staticFile("logo_l_word.png")} style={{ ...fullFrame, ...word }} />
      <Img src={staticFile("logo_r_word.png")} style={{ ...fullFrame, ...word }} />
    </AbsoluteFill>
  );
};
