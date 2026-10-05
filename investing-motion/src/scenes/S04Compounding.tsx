import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { Kinetic } from "../components/Kinetic";
import { TextWipe } from "../components/Transitions";
import { COLORS, VIDEO } from "../config";
import { ease, keys, punch, SPRINGS, tween } from "../lib/anim";
import { compound } from "../lib/finance";
import { mono } from "../lib/type";

const LINE_Y = 1000;
const STEPS = [32, 46, 56] as const; // +8% clicks, accelerating
const STRETCH = 64;

const valueAt = (f: number) =>
  keys(f, [
    [0, compound(0)],
    [STEPS[0], compound(0)],
    [STEPS[0] + 8, compound(1), ease.outExpo],
    [STEPS[1], compound(1)],
    [STEPS[1] + 6, compound(2), ease.outExpo],
    [STEPS[2], compound(2)],
    [STEPS[2] + 5, compound(3), ease.outExpo],
  ]);

// Clean reset: the accent collapses into a hairline, $10,000 rises from it,
// +8% clicks compound it, then the number stretches into the graph line.
export const S04Compounding: React.FC = () => {
  const f = useCurrentFrame();
  const panelY = tween(f, [0, 9], [1, 0.0025], ease.inOut);
  const lineW = tween(f, [9, 18], [VIDEO.width, 620], ease.outExpo);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {f < STRETCH ? (
        <div
          style={{
            position: "absolute",
            left: (VIDEO.width - lineW) / 2,
            width: lineW,
            top: 0,
            height: VIDEO.height,
            background: COLORS.accent,
            transformOrigin: `50% ${LINE_Y}px`,
            transform: `scaleY(${panelY})`,
          }}
        />
      ) : null}

      {/* Number rises out of the hairline */}
      <AbsoluteFill style={{ clipPath: f < 24 ? `inset(0 0 ${VIDEO.height - LINE_Y + 2}px 0)` : undefined }}>
        {f >= 10 && f < 78 ? (
          <Kinetic
            motionBlur={0.6}
            pose={(fr) => ({
              y: tween(fr, [10, 22], [140, -95], ease.outExpo) + tween(fr, [STRETCH, 72], [0, 135], ease.inExpo),
              sx: tween(fr, [STRETCH, 74], [1, 7], ease.inExpo),
              sy: tween(fr, [STRETCH, 72], [1, 0.025], ease.inExpo),
            })}
          >
            <AnimatedNumber at={valueAt} size={180} color={f >= STRETCH + 4 ? COLORS.accent : COLORS.ink} minDigits={5} />
          </Kinetic>
        ) : null}
      </AbsoluteFill>

      {f >= 16 && f < STRETCH ? (
        <Kinetic pose={() => ({ y: -270 })} motionBlur={0}>
          <TextWipe start={16} direction="right">
            <div style={mono(28)}>INITIAL INVESTMENT</div>
          </TextWipe>
        </Kinetic>
      ) : null}

      {/* Ledger of +8% clicks */}
      {f < STRETCH
        ? STEPS.map((s, i) =>
            f >= s ? (
              <Kinetic key={s} motionBlur={0} pose={(fr) => ({ y: LINE_Y - VIDEO.height / 2 + 70 + i * 74, scale: punch(fr, s, 1.6, SPRINGS.snappy) })}>
                <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                  <div style={{ ...mono(32, COLORS.accentInk, 700), background: COLORS.accent, padding: "6px 14px", letterSpacing: "0.02em" }}>+8%</div>
                  <div style={mono(28)}>{`YEAR ${i + 1}`}</div>
                  <div style={mono(28, COLORS.ink, 700)}>{`$${Math.round(compound(i + 1)).toLocaleString("en-US")}`}</div>
                </div>
              </Kinetic>
            ) : null,
          )
        : null}
    </AbsoluteFill>
  );
};
