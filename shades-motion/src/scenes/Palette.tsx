import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, easeOut, fullFrame } from "../anim";

const third = 100 / 3;

// Colour board tiles settle in one after another.
export const Palette: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#2c2f25" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const start = (0.2 + i * 0.18) * fps;
        return (
          <AbsoluteFill
            key={i}
            style={{ clipPath: `inset(${row * 50}% ${100 - (col + 1) * third}% ${50 - row * 50}% ${col * third}%)` }}
          >
            <Img
              src={staticFile("colors.jpg")}
              style={{
                ...fullFrame,
                transformOrigin: `${(col + 0.5) * third}% ${row * 50 + 25}%`,
                scale: interpolate(frame, [start, start + 1.6 * fps], [1.18, 1], { ...clamp, easing: easeOut }),
                opacity: interpolate(frame, [start, start + 0.6 * fps], [0, 1], clamp),
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
