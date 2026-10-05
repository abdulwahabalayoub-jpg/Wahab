import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera } from "../components/Camera";
import { Kinetic, KineticText } from "../components/Kinetic";
import { ParticleBurst } from "../components/ParticleBurst";
import { Flash, ZoomTransition } from "../components/Transitions";
import { COLORS, VIDEO } from "../config";
import { ease, punch, SPRINGS, springAt, tween } from "../lib/anim";
import { display } from "../lib/type";

const CUT = 30;
const SAVE = 30;
const SPEND = 40;
const INVEST = 52;
const STRIKE = 60;
const CENTER = 66;
const THROUGH = 76;

export const S03Choice: React.FC = () => {
  const f = useCurrentFrame();

  if (f < CUT) {
    // Inverted editorial card: black type on the accent that swallowed "IT."
    return (
      <AbsoluteFill style={{ backgroundColor: COLORS.accent }}>
        <Camera pose={(fr) => ({ scale: tween(fr, [16, CUT], [1, 1.05], ease.linear) })}>
          {(
            [
              ["SO WHAT", -210, 2],
              ["DO YOU", 0, 7],
              ["DO?", 210, 12],
            ] as const
          ).map(([w, y, s]) => (
            <KineticText
              key={w}
              text={w}
              textStyle={display(200, COLORS.accentInk)}
              pose={(fr) => ({ y, scale: punch(fr, s, 1.3, SPRINGS.snappy), opacity: fr >= s ? 1 : 0 })}
            />
          ))}
        </Camera>
      </AbsoluteFill>
    );
  }

  const dim = (start: number) => tween(f, [start, start + 6], [1, 0.22], ease.outQuad);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Camera shake={[[SPEND, 8, 12], [INVEST, 16, 34]]}>
        {/* SAVE slides */}
        <Kinetic
          pose={(fr) => ({
            x: tween(fr, [SAVE, SAVE + 8], [-1300, 0], ease.outExpo),
            y: -340 + tween(fr, [CENTER, CENTER + 9], [0, -1400], ease.inExpo),
            opacity: dim(STRIKE),
          })}
        >
          <div style={{ position: "relative" }}>
            <div style={display(230)}>SAVE</div>
            <div
              style={{
                position: "absolute",
                left: -20,
                right: -20,
                top: "48%",
                height: 10,
                background: COLORS.ink,
                transformOrigin: "left",
                transform: `scaleX(${tween(f, [STRIKE, STRIKE + 5], [0, 1], ease.outExpo)})`,
              }}
            />
          </div>
        </Kinetic>
        {/* SPEND rotates and punches */}
        <Kinetic
          pose={(fr) => ({
            y: -70 + tween(fr, [CENTER, CENTER + 9], [0, 1500], ease.inExpo),
            rotate: 38 * (1 - springAt(fr, SPEND, SPRINGS.impact)),
            scale: punch(fr, SPEND, 2.6),
            opacity: fr >= SPEND ? dim(STRIKE + 3) : 0,
          })}
        >
          <div style={{ position: "relative" }}>
            <div style={display(230)}>SPEND</div>
            <div
              style={{
                position: "absolute",
                left: -20,
                right: -20,
                top: "48%",
                height: 10,
                background: COLORS.ink,
                transformOrigin: "left",
                transform: `scaleX(${tween(f, [STRIKE + 3, STRIKE + 8], [0, 1], ease.outExpo)})`,
              }}
            />
          </div>
        </Kinetic>
        {/* INVEST explodes, centres, then the camera flies through it */}
        <ZoomTransition start={THROUGH} duration={14} to={34}>
          <Kinetic
            pose={(fr) => ({
              y: tween(fr, [CENTER, CENTER + 10], [270, 0], ease.outExpo),
              scale: punch(fr, INVEST, 0.05, SPRINGS.bouncy) * tween(fr, [CENTER, THROUGH], [1, 1.35], ease.outQuad),
              opacity: fr >= INVEST ? 1 : 0,
            })}
          >
            <div style={display(250, COLORS.accent)}>INVEST</div>
          </Kinetic>
        </ZoomTransition>
        <ParticleBurst
          x={VIDEO.width / 2}
          y={VIDEO.height / 2 + 270}
          start={INVEST}
          count={90}
          speed={[16, 46]}
          drag={0.86}
          life={30}
          size={[5, 14]}
          color={COLORS.accent}
          shape="shard"
          seed="invest"
        />
      </Camera>
      {/* Accent iris guarantees a clean full-frame handoff */}
      {f >= 84 ? (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.accent,
            clipPath: `circle(${tween(f, [84, 90], [0, 75], ease.inExpo)}% at 50% 50%)`,
          }}
        />
      ) : null}
      <Flash hits={[[INVEST, 0.5]]} />
    </AbsoluteFill>
  );
};
