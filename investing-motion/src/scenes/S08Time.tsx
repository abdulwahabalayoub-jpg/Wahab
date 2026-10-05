import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { Camera } from "../components/Camera";
import { Grid } from "../components/Grid";
import { Kinetic } from "../components/Kinetic";
import { Timeline } from "../components/Timeline";
import { Flash, TextWipe } from "../components/Transitions";
import { COLORS } from "../config";
import { ease, keys, springAt, SPRINGS, tween } from "../lib/anim";
import { display, mono } from "../lib/type";

const LAND = 0;
const TAG = 14;
const RECEDE = 30;
const STOP = 112;

// Ages fly 20 → 50: holds get shorter each time, then a final rush.
const ageAt = (f: number) =>
  keys(f, [
    [0, 20],
    [36, 20],
    [42, 25, ease.outExpo],
    [50, 25],
    [55, 30, ease.outExpo],
    [62, 30],
    [66, 35, ease.outExpo],
    [71, 35],
    [74, 40, ease.outExpo],
    [78, 40],
    [80, 45, ease.outExpo],
    [84, 45],
    [STOP, 50, ease.inExpo],
  ]);

export const S08Time: React.FC = () => {
  const f = useCurrentFrame();
  const fr = Math.min(f, STOP); // hard stop: everything freezes
  const steps = [42, 55, 66, 74, 80];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Camera
        shake={[[LAND + 2, 10, 22], ...steps.map((s) => [s, 5, 8] as const)]}
        pose={() => ({
          scale:
            1 +
            steps.reduce((a, s) => a + (fr >= s ? 0.05 * Math.exp(-(fr - s) / 3) : 0), 0) +
            tween(fr, [86, STOP], [0, 0.55], ease.inExpo),
        })}
      >
        <Grid start={0} offsetX={-ageAt(fr) * 60} opacity={0.8} />
        {/* TIME lands from the whip, then recedes into depth */}
        <Kinetic
          motionBlur={0.5}
          pose={() => ({
            y: (1 - springAt(fr, LAND, SPRINGS.impact)) * -1700 + tween(fr, [RECEDE, RECEDE + 14], [0, -600], ease.inOut),
            scale: tween(fr, [RECEDE, RECEDE + 14], [1, 0.4], ease.inOut),
            sy: 1 - (1 - springAt(fr, LAND + 3, SPRINGS.bouncy)) * 0.18,
            opacity: tween(fr, [RECEDE, RECEDE + 14], [1, 0.5], ease.linear),
          })}
        >
          <div style={display(400)}>TIME</div>
        </Kinetic>
        <Kinetic motionBlur={0} pose={() => ({ y: 230 + tween(fr, [RECEDE, RECEDE + 14], [0, -620], ease.inOut), opacity: tween(fr, [RECEDE, RECEDE + 10], [1, 0], ease.linear) })}>
          <TextWipe start={TAG} duration={10} direction="right">
            <div style={mono(34, COLORS.ink, 500)}>IS THE REAL ADVANTAGE.</div>
          </TextWipe>
        </Kinetic>

        {fr >= RECEDE + 6 ? (
          <>
            <Timeline age={(x) => ageAt(Math.min(x, STOP))} opacity={tween(fr, [RECEDE + 6, RECEDE + 12], [0, 1], ease.linear)} />
            <Kinetic motionBlur={0} pose={() => ({ y: -40, scale: tween(fr, [RECEDE + 6, RECEDE + 14], [0.6, 1], ease.outExpo) })}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={mono(30)}>AGE</div>
                <AnimatedNumber at={(x) => ageAt(Math.min(x, STOP))} size={380} prefix="" minDigits={2} />
              </div>
            </Kinetic>
          </>
        ) : null}
      </Camera>
      <Flash hits={[[LAND + 2, 0.3]]} />
    </AbsoluteFill>
  );
};
