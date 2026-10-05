import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Camera } from "../components/Camera";
import { GlitchTransition } from "../components/GlitchTransition";
import { Kinetic, KineticText } from "../components/Kinetic";
import { Flash } from "../components/Transitions";
import { COLORS } from "../config";
import { between, ease, punch, SPRINGS, springAt, tween } from "../lib/anim";
import { display, mono } from "../lib/type";

const HIT = { impact: 16, every: 54, single: 62, day: 70, whip: 80 } as const;

// Words that hit the screen like objects: oversized, spring-landed, no fades.
const hit = (start: number, y: number, from = 3.2, tilt = 0) => (f: number) => ({
  y: y + (1 - springAt(f, start, SPRINGS.snappy)) * -80,
  scale: punch(f, start, from),
  rotate: tilt * (1 - springAt(f, start, SPRINGS.impact)),
  opacity: f >= start ? 1 : 0,
});

const glitchLosing = (f: number) =>
  between(f, 24, 28) ? 0.9 : between(f, 34, 36) ? 0.55 : between(f, 43, 49) ? 1 : 0;

export const S01Hook: React.FC = () => {
  const f = useCurrentFrame();
  const typed = "YOUR MONEY".slice(0, Math.max(0, Math.floor((f - 3) / 1.1)));
  const cursorOn = f < HIT.impact && Math.floor(f / 4) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Camera
        shake={[
          [HIT.impact, 14, 30],
          [HIT.every, 8, 14],
          [HIT.single, 8, 16],
          [HIT.day, 12, 28],
        ]}
        pose={(fr) => ({ y: tween(fr, [HIT.whip, 90], [0, -2600], ease.inExpo) })}
        motionBlur={0.45}
      >
        {f < 52 ? (
          <>
            <Kinetic
              motionBlur={0.3}
              pose={(fr) => ({
                y: tween(fr, [HIT.impact, HIT.impact + 5], [0, -420], ease.outExpo),
                scale: tween(fr, [HIT.impact, HIT.impact + 5], [1, 0.82], ease.outExpo),
              })}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={mono(46, f < HIT.impact ? COLORS.ink : COLORS.dim, 700)}>{typed}</div>
                <div style={{ width: 22, height: 44, background: COLORS.accent, opacity: cursorOn ? 1 : 0 }} />
              </div>
            </Kinetic>
            <KineticText text="IS" textStyle={display(150)} pose={hit(HIT.impact, -250, 3.6)} />
            <GlitchTransition intensity={glitchLosing} seed="losing">
              <Kinetic
                pose={(fr) => {
                  const p = hit(HIT.impact + 2, -50, 4.2)(fr);
                  const jitter = between(fr, 22, 50) ? (random(`lj${fr}`) * 2 - 1) * 5 : 0;
                  return { ...p, x: jitter, skewX: jitter * 0.8 };
                }}
              >
                <div style={display(250, COLORS.crash)}>LOSING</div>
              </Kinetic>
            </GlitchTransition>
            <KineticText text="VALUE." textStyle={display(250)} pose={hit(HIT.impact + 4, 175, 4.2)} />
          </>
        ) : null}
        {f >= HIT.every ? (
          <>
            <KineticText text="EVERY." textStyle={display(210)} pose={hit(HIT.every, -280, 2.6, -7)} />
            <KineticText text="SINGLE." textStyle={display(210)} pose={hit(HIT.single, -60, 2.6, 6)} />
            <KineticText text="DAY." textStyle={display(330, COLORS.ink)} pose={hit(HIT.day, 225, 3.2, -4)} />
          </>
        ) : null}
      </Camera>
      <Flash hits={[[HIT.impact, 0.55], [HIT.every, 0.2], [HIT.single, 0.2], [HIT.day, 0.6]]} />
    </AbsoluteFill>
  );
};
