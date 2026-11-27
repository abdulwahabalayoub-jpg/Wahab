import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import "../theme";
import { S1, S2, S3, S4 } from "./scenes1";
import { S5, S6, S7, S8, S9 } from "./scenes2";
import { FilmFinish, Streak } from "./overlay";

export const STARTS = [0, 203, 549, 813, 1051, 1423, 1719, 2089, 2449];
export const LENS = [217, 360, 278, 252, 386, 310, 384, 374, 251];
export const FILM_LEN = 2700;
const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];
const XF = 14;

const Fade: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = first ? 1 : interpolate(f, [0, XF + 6], [1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const Film: React.FC<{ only?: number }> = ({ only }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map((Sc, i) => (only === undefined || only === i) ? (
      <Sequence key={i} from={STARTS[i]} durationInFrames={LENS[i]} premountFor={0}>
        <Fade first={i === 0}><Sc /></Fade>
      </Sequence>) : null)}
    {STARTS.slice(1).filter((_, i) => i !== 2).map((s, i) => <Streak key={i} at={s - 4} dur={18} />)}
    <FilmFinish fadeIn={18} fadeOut={[2676, 2700]} />
    <Audio src={staticFile("film/mix.wav")} />
  </AbsoluteFill>
);
