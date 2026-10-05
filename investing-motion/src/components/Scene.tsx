import type React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";

export const Scene: React.FC<{
  name: string;
  from: number;
  duration: number;
  children: React.ReactNode;
}> = ({ name, from, duration, children }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence name={name} from={from} durationInFrames={duration} premountFor={fps}>
      <AbsoluteFill style={{ overflow: "hidden" }}>{children}</AbsoluteFill>
    </Sequence>
  );
};
