import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { Camera } from "../components/Camera";
import { Grid } from "../components/Grid";
import { Kinetic, KineticText } from "../components/Kinetic";
import { ParticleBurst } from "../components/ParticleBurst";
import { Flash, TextWipe, WhipTransition } from "../components/Transitions";
import { COLORS, VIDEO } from "../config";
import { ease, keys, punch, SPRINGS, springAt, tween } from "../lib/anim";
import { display, mono } from "../lib/type";

const STEPS = [14, 28, 42] as const;
const SHRINK = 56;
const EAT = 88;
const DOT = { x: 690, y: 1500, start: 106 } as const;

const valueAt = (f: number) =>
  keys(f, [
    [0, 100],
    [STEPS[0], 100],
    [STEPS[0] + 6, 97, ease.outExpo],
    [STEPS[1], 97],
    [STEPS[1] + 6, 94, ease.outExpo],
    [STEPS[2], 94],
    [STEPS[2] + 6, 91, ease.outExpo],
  ]);

export const S02Inflation: React.FC = () => {
  const f = useCurrentFrame();
  const speed = Math.abs(valueAt(f) - valueAt(f - 1));
  const lossLabel = f >= STEPS[2] ? "−9.0%" : f >= STEPS[1] ? "−6.0%" : f >= STEPS[0] ? "−3.0%" : "";
  const lastStep = [...STEPS].reverse().find((s) => f >= s) ?? 0;
  const spark = Array.from({ length: 30 }, (_, i) => {
    const u = i / 29;
    const v = valueAt(Math.min(f, 48) * u);
    return `${i ? "L" : "M"}${(u * 200).toFixed(1)},${((100 - v) * 5 + 8).toFixed(1)}`;
  }).join("");

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <WhipTransition enter={{ start: 0, duration: 9, from: { y: 2200 } }}>
        <Grid start={2} />
        <Camera
          shake={[
            [STEPS[0], 8, 10],
            [STEPS[1], 8, 13],
            [STEPS[2], 9, 17],
            [82, 8, 14],
            [90, 8, 14],
            [98, 14, 34],
          ]}
        >
          {/* Financial UI: real-value readout */}
          {f < SHRINK ? (
            <div style={{ position: "absolute", left: 80, top: 250 }}>
              <TextWipe start={6} direction="right">
                <div style={mono(24)}>USD · REAL VALUE</div>
              </TextWipe>
              <svg width={220} height={60} style={{ marginTop: 14 }}>
                <path d={spark} stroke={COLORS.crash} strokeWidth={3} fill="none" />
              </svg>
            </div>
          ) : null}
          {f < SHRINK && f >= 8 ? (
            <div style={{ position: "absolute", right: 80, top: 250, textAlign: "right" }}>
              <div style={mono(24)}>CPI</div>
              <div style={{ ...mono(30, COLORS.ink, 700), marginTop: 10 }}>+3.0%/YR</div>
            </div>
          ) : null}

          {/* The $100 that rots */}
          {f < EAT ? (
            <Kinetic
              motionBlur={0.4}
              pose={(fr) => ({
                y: tween(fr, [SHRINK, 80], [0, -150], ease.inOut),
                scale: tween(fr, [SHRINK, 80], [1, 0.42], ease.inOut),
                sy: 1 + Math.min(0.45, Math.abs(valueAt(fr) - valueAt(fr - 1)) * 0.22),
                skewX: -Math.min(10, Math.abs(valueAt(fr) - valueAt(fr - 1)) * 5),
              })}
            >
              <AnimatedNumber at={valueAt} size={400} color={speed > 0.05 ? "#FFFFFF" : COLORS.ink} minDigits={2} />
            </Kinetic>
          ) : null}
          {STEPS.map((s, i) => (
            <ParticleBurst
              key={s}
              x={VIDEO.width / 2 + (i - 1) * 90}
              y={VIDEO.height / 2 + 170}
              start={s + 1}
              count={22}
              speed={[4, 14]}
              angle={[Math.PI * 0.15, Math.PI * 0.85]}
              gravity={1.4}
              drag={0.94}
              life={30}
              size={[6, 18]}
              shape="shard"
              seed={`frag${i}`}
            />
          ))}
          {lossLabel && f < SHRINK ? (
            <Kinetic pose={(fr) => ({ x: 290, y: -330, scale: punch(fr, lastStep + 1, 1.7, SPRINGS.snappy) })}>
              <div style={{ ...mono(40, COLORS.bg, 700), background: COLORS.crash, padding: "8px 16px", letterSpacing: "0.04em" }}>{lossLabel}</div>
            </Kinetic>
          ) : null}

          {/* Number breaks into particles: inflation eats it */}
          <ParticleBurst
            x={VIDEO.width / 2}
            y={VIDEO.height / 2 - 150}
            start={EAT}
            count={150}
            speed={[6, 30]}
            drag={0.88}
            gravity={0.25}
            life={40}
            size={[3, 8]}
            spawnRadius={90}
            seed="eat"
          />

          {f >= SHRINK ? (
            <Kinetic pose={() => ({ y: -430 })} motionBlur={0}>
              <TextWipe start={SHRINK} duration={9}>
                <div style={display(104, COLORS.ink, 800)}>PURCHASING POWER</div>
              </TextWipe>
            </Kinetic>
          ) : null}
          {f >= SHRINK + 4 ? (
            <Kinetic pose={(fr) => ({ y: -350, sx: tween(fr, [SHRINK + 4, SHRINK + 14], [0, 1], ease.outExpo) })} motionBlur={0}>
              <div style={{ width: 880, height: 4, background: COLORS.crash }} />
            </Kinetic>
          ) : null}

          <KineticText
            text="INFLATION"
            textStyle={display(170)}
            pose={(fr) => ({ x: -1400 * (1 - springAt(fr, 82, SPRINGS.snappy)), y: 30, opacity: fr >= 82 ? 1 : 0 })}
          />
          <KineticText
            text="EATS"
            textStyle={display(170)}
            pose={(fr) => ({ x: 1400 * (1 - springAt(fr, 90, SPRINGS.snappy)), y: 195, opacity: fr >= 90 ? 1 : 0 })}
          />
          {/* "IT" + its full stop: the dot becomes the transition */}
          {f >= 98 ? (
            <Kinetic
              motionBlur={0.5}
              pose={(fr) => ({ y: (1 - springAt(fr, 98, SPRINGS.impact)) * -1500, sy: 1 + (1 - springAt(fr, 98, SPRINGS.bouncy)) * 0.25 })}
              style={{ display: "block" }}
            >
              <div style={{ position: "absolute", right: VIDEO.width - DOT.x + 40, top: DOT.y - 250, ...display(290) }}>IT</div>
            </Kinetic>
          ) : null}
        </Camera>
        {f >= 98 ? (
          <div
            style={{
              position: "absolute",
              left: DOT.x - 28,
              top: DOT.y - 58 + (1 - springAt(f, 98, SPRINGS.impact)) * -1500,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: COLORS.accent,
              transform: `scale(${tween(f, [DOT.start, 119], [1, 75], ease.inExpo)})`,
            }}
          />
        ) : null}
      </WhipTransition>
      <Flash hits={[[82, 0.15], [90, 0.15], [98, 0.5]]} />
    </AbsoluteFill>
  );
};
