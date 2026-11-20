import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { C, sans, SpeedContext } from "./theme";
import { Apply, Overview, Problem, Title, Approve } from "./scenes/A";
import { Campaign, Invite, Verify } from "./scenes/B";
import { BookOpen, BookSingle, Close, Track } from "./scenes/C";

export const TRANSITION = 10;
// d = frames in the final cut, k = playback speed (scene length at normal speed = d * k)
export const SCENES: { id: string; c: React.FC; d: number; k: number; vo: string }[] = [
  { id: "title", c: Title, d: 100, k: 1.3, vo: "01" },
  { id: "problem", c: Problem, d: 120, k: 1.833, vo: "02" },
  { id: "overview", c: Overview, d: 86, k: 2.209, vo: "03" },
  { id: "apply", c: Apply, d: 100, k: 2.2, vo: "04" },
  { id: "approve", c: Approve, d: 118, k: 1.949, vo: "05" },
  { id: "campaign", c: Campaign, d: 202, k: 1.683, vo: "06" },
  { id: "invite", c: Invite, d: 90, k: 2.111, vo: "07" },
  { id: "verify", c: Verify, d: 120, k: 2.0, vo: "08" },
  { id: "single", c: BookSingle, d: 156, k: 1.603, vo: "09" },
  { id: "open", c: BookOpen, d: 140, k: 2.0, vo: "10" },
  { id: "track", c: Track, d: 94, k: 2.128, vo: "11" },
  { id: "close", c: Close, d: 100, k: 1.7, vo: "12" },
];
export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - TRANSITION * (SCENES.length - 1);

const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / TOTAL) * 100}%`, background: C.gold }} />
      <div style={{ position: "absolute", left: 60, top: 44, display: "flex", alignItems: "center", gap: 14, fontFamily: sans, fontSize: 20, color: C.mute }}>
        <Img src={staticFile("mnh_mark.png")} style={{ width: 28 }} />
        Microblogger Management System
      </div>
    </>
  );
};

export const Explainer: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream }}>
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const items = [
          <TransitionSeries.Sequence key={s.id} durationInFrames={s.d} premountFor={30}>
            <SpeedContext.Provider value={s.k}>
              <s.c />
            </SpeedContext.Provider>
            <Sequence from={6} layout="none">
              <Audio src={staticFile(`vo/${s.vo}.mp3`)} premountFor={30} />
            </Sequence>
          </TransitionSeries.Sequence>,
        ];
        if (i < SCENES.length - 1) {
          items.push(
            <TransitionSeries.Transition key={`${s.id}-t`} presentation={i % 3 === 2 ? slide({ direction: "from-right" }) : fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />,
          );
        }
        return items;
      })}
    </TransitionSeries>
    <Chrome />
  </AbsoluteFill>
);
