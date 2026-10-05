import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera } from "../components/Camera";
import { KineticText } from "../components/Kinetic";
import { ParticleBurst } from "../components/ParticleBurst";
import { Flash, TextWipe } from "../components/Transitions";
import { COLORS, FONTS, VIDEO } from "../config";
import { between, ease, punch, tween } from "../lib/anim";
import { display, mono } from "../lib/type";

const WHISPER = 8;
const START = 42;
const EARLY = 48;
const EXPAND = 72;
const OUTRO = 88;
const CUT = 112;

export const S09Final: React.FC = () => {
  const f = useCurrentFrame();
  const expand = (fr: number) => tween(fr, [EXPAND, OUTRO - 2], [1, 6], ease.inExpo);
  const push = (fr: number) => tween(fr, [EARLY, EXPAND], [1, 1.07], ease.linear);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {between(f, WHISPER, START) ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <TextWipe start={WHISPER} duration={12} direction="right">
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 44, color: COLORS.ink, letterSpacing: "-0.01em" }}>
              You don’t need to predict the future.
            </div>
          </TextWipe>
        </AbsoluteFill>
      ) : null}

      {between(f, START, OUTRO) ? (
        <Camera shake={[[START, 10, 24], [EARLY, 14, 34]]}>
          <KineticText
            text="START"
            textStyle={display(300)}
            motionBlur={0.2}
            pose={(fr) => ({
              y: -150 * expand(fr),
              scale: punch(fr, START, 2.2) * push(fr) * expand(fr),
              opacity: fr >= START ? 1 : 0,
            })}
          />
          <KineticText
            text="EARLY."
            textStyle={display(300, COLORS.accent)}
            motionBlur={0.2}
            pose={(fr) => ({
              y: 140 * expand(fr),
              scale: punch(fr, EARLY, 2.6) * push(fr) * expand(fr),
              opacity: fr >= EARLY ? 1 : 0,
            })}
          />
          <ParticleBurst
            x={VIDEO.width / 2}
            y={VIDEO.height / 2 + 140}
            start={EARLY}
            count={120}
            speed={[10, 40]}
            drag={0.88}
            life={42}
            size={[3, 10]}
            color={COLORS.accent}
            shape="shard"
            seed="early"
          />
        </Camera>
      ) : null}

      {between(f, OUTRO, CUT) ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <TextWipe start={OUTRO} duration={10}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 64, color: COLORS.ink, letterSpacing: "-0.03em" }}>
                Time compounds
              </div>
              <div style={{ width: 14, height: 14, background: COLORS.accent }} />
            </div>
          </TextWipe>
        </AbsoluteFill>
      ) : null}

      {f >= OUTRO ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: VIDEO.height / 2 + 300, textAlign: "center", ...mono(24), letterSpacing: "0.06em" }}>
          Illustrative example. Returns are not guaranteed.
        </div>
      ) : null}
      <Flash hits={[[START, 0.4], [EARLY, 0.5]]} />
    </AbsoluteFill>
  );
};
