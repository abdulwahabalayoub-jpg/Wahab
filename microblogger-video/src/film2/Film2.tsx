import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import "../theme";
import { S1, S2, S3, S4 } from "./scenesA";
import * as B from "./scenesB";
import { SC, LEN, CAPS } from "./timing";
import { FilmFinish, Streak } from "../film/overlay";

const starts = [SC.s1, SC.s2, SC.s3, SC.s4, SC.s5, SC.s6, SC.s7, SC.s8, SC.s9, LEN];
const SCENES: React.FC[] = [S1, S2, S3, S4, B.S5, B.S6, B.S7, B.S8, B.S9];
const XF = 10;
const Fade: React.FC<{ children: React.ReactNode; first: boolean; len: number }> = ({ children, first }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const c = CAPS.find(([a, b]) => f >= a - 2 && f <= b + 8);
  if (!c) return null;
  const [a, b, text] = c;
  const i = interpolate(f, [a - 2, a + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = i * interpolate(f, [b + 2, b + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const big = /KD|DMs|built our own|No calls|No chasing|Microblogger Dashboard/.test(text);
  return (<AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "21%", pointerEvents: "none" }}>
    <div style={{ maxWidth: "84%", textAlign: "center", fontFamily: "Inter", fontWeight: 700, fontSize: big ? 58 : 50, lineHeight: 1.18, letterSpacing: "-0.01em", color: "#fff", opacity: o,
      transform: `translateY(${(1 - i) * 16}px) scale(${0.96 + 0.04 * i})`, textShadow: "0 2px 6px rgba(0,0,0,.55), 0 8px 34px rgba(0,0,0,.6)",
      background: "rgba(10,8,6,.38)", padding: "12px 26px", borderRadius: 22, backdropFilter: "blur(6px)" }}>
      {text.split(/(\d[\d,]*\s?KD|\d+%|WhatsApp|one link|one tap|We own it,)/).map((p, k) => /KD|%|WhatsApp|one link|one tap|We own it/.test(p) ? <span key={k} style={{ color: "#F2CC6B" }}>{p}</span> : <span key={k}>{p}</span>)}
    </div>
  </AbsoluteFill>);
};

export const Film2: React.FC<{ only?: number; muted?: boolean }> = ({ only, muted }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map((Sc, i) => (only === undefined || only === i) ? (
      <Sequence key={i} from={starts[i]} durationInFrames={starts[i + 1] - starts[i] + (i < 8 ? XF : 0)} premountFor={0}>
        <Fade first={i === 0} len={starts[i + 1] - starts[i]}><Sc /></Fade>
      </Sequence>) : null)}
    {[SC.s2, SC.s5, SC.s6, SC.s7, SC.s8, SC.s9].map((s, i) => <Streak key={i} at={s - 4} dur={16} />)}
    <Captions />
    <FilmFinish fadeIn={14} fadeOut={[LEN - 22, LEN]} />
    {!muted && <Audio src={staticFile("film2/mix.wav")} />}
  </AbsoluteFill>
);
