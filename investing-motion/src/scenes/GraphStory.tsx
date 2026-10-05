import type React from "react";
import { AbsoluteFill, Freeze, random, useCurrentFrame } from "remotion";
import { AnimatedNumber, Counter } from "../components/AnimatedNumber";
import { FinancialGraph } from "../components/FinancialGraph";
import { GlitchTransition } from "../components/GlitchTransition";
import { Kinetic, KineticText } from "../components/Kinetic";
import { Flash, ZoomTransition } from "../components/Transitions";
import { COLORS } from "../config";
import { between, ease, punch, shakeAt, SPRINGS, springAt, tween } from "../lib/anim";
import { compound, displayValueAt, valueAt } from "../lib/finance";
import { camOffsetY, G, strokeAt, tAt, toScreen, winAt } from "../lib/graph";
import { display, mono } from "../lib/type";


const MILESTONES = [
  { year: 10, at: G.arrive10, size: 100 },
  { year: 20, at: G.arrive20, size: 100 },
  { year: 30, at: G.arrive30, size: 116 },
] as const;

// First graph frame at which the line passes each early year.
const PASS = Array.from({ length: 9 }, (_, i) => {
  for (let g = 0; g < G.arrive10; g++) if (tAt(g) >= i + 1) return g;
  return G.arrive10;
});

const screenAt = (g: number, t: number) => toScreen(winAt(g), t, valueAt(t));
const slopeDeg = (g: number, t: number) => {
  const a = screenAt(g, t - 0.25);
  const b = screenAt(g, t + 0.25);
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
};

// Point on the graph that morphs into a pill carrying the milestone value.
const Milestone: React.FC<{ g: number; year: number; at: number; size: number }> = ({ g, year, at, size }) => {
  if (g < at) return null;
  const value = compound(year);
  const p = toScreen(winAt(g), year, value);
  const q = springAt(g, at, SPRINGS.snappy);
  const pillW = size * 5.2;
  const pillH = size * 1.32;
  const w = 30 + (pillW - 30) * q;
  const h = 30 + (pillH - 30) * q;
  const shrink = year === 30 ? 1 : tween(g, [at + 22, at + 40], [1, 0.55], ease.inOut);
  const crashed = g >= G.crash;
  const left = Math.max(40 - (1 - shrink) * pillW, p.x - w + 15);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: p.y - h - 22 * q,
        transformOrigin: `${p.x - left}px ${h + 22 * q}px`,
        transform: `scale(${shrink})`,
        opacity: crashed ? (year === 30 ? 0 : 0.35) : 1,
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          borderRadius: Math.min(h / 2, 15 + 4 * q),
          background: COLORS.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {q > 0.45 ? (
          <AnimatedNumber at={(fr) => tween(fr, [at + 2, at + 14], [value * 0.82, Math.round(value)], ease.outExpo)} size={size} color={COLORS.accentInk} minDigits={5} />
        ) : null}
      </div>
      <div style={{ ...mono(32, COLORS.ink, 700), marginTop: 16, textAlign: "right", opacity: q > 0.6 ? 1 : 0 }}>{`${year} YEARS`}</div>
    </div>
  );
};

const RecoveryWords: React.FC<{ g: number }> = ({ g }) => {
  const tipT = tAt(g);
  const win = winAt(g);
  const tip = toScreen(win, tipT, valueAt(tipT));
  const nodes: React.ReactNode[] = [];

  // RECOVER. rides on the line, revealed as the line draws beneath it.
  if (between(g, 324, 380)) {
    const t = 31.1;
    const p = screenAt(g, t);
    const reveal = Math.min(1, Math.max(0, (tip.x - (p.x - 360)) / 720));
    nodes.push(
      <div
        key="recover"
        style={{
          position: "absolute",
          left: p.x,
          top: p.y - 22,
          transformOrigin: "50% 100%",
          transform: `translate(-50%, -100%) rotate(${slopeDeg(g, t) * 0.55}deg) translateY(${tween(g, [370, 380], [0, -260], ease.inExpo)}px)`,
          opacity: tween(g, [372, 380], [1, 0], ease.linear),
          clipPath: `inset(-20% ${(1 - reveal) * 100}% -20% -5%)`,
          ...display(140),
        }}
      >
        RECOVER.
      </div>,
    );
  }

  // COMPOUND. sits in the line's path and is sliced as the line runs through.
  if (between(g, 372, 408)) {
    const t = 33.0;
    const p = screenAt(g, t);
    const cut = Math.min(1, Math.max(0, (tip.x - p.x + 20) / 60));
    const exitX = tween(g, [400, 408], [0, -1400], ease.inExpo);
    const half = (top: boolean) => (
      <div
        style={{
          position: "absolute",
          left: p.x + exitX,
          top: p.y,
          transform: `translate(-50%, -50%) translateX(${(top ? 22 : -22) * cut}px) scale(${punch(g, 372, 1.5, SPRINGS.snappy)})`,
          clipPath: top ? "inset(-10% -10% 50% -10%)" : "inset(50% -10% -10% -10%)",
          ...display(126),
        }}
      >
        COMPOUND.
      </div>
    );
    nodes.push(<div key="ct">{half(true)}</div>, <div key="cb">{half(false)}</div>);
  }

  // CONTINUE. is hooked to the tip and dragged upward with it.
  if (g >= 406) {
    const vy = tip.y - toScreen(winAt(g - 1), tAt(g - 1), valueAt(tAt(g - 1))).y;
    nodes.push(
      <div
        key="continue"
        style={{
          position: "absolute",
          left: tip.x - 30,
          top: tip.y - 30,
          transformOrigin: "100% 100%",
          transform: `translate(-100%, -100%) rotate(${slopeDeg(g, tipT) * 0.6}deg) scale(${punch(g, 406, 0.4, SPRINGS.bouncy)}) scaleY(${1 + Math.min(0.6, Math.abs(vy) * 0.012)})`,
          ...display(150, COLORS.accent),
        }}
      >
        CONTINUE.
      </div>,
    );
  }
  return <>{nodes}</>;
};

const glitchIntensity = (g: number) =>
  between(g, G.crash, G.crash + 3) ? 1 : between(g, 223, 225) ? 0.7 : between(g, 231, 233) ? 0.5 : between(g, 252, 256) ? 0.9 : 0;

export const GraphStory: React.FC = () => {
  const g = useCurrentFrame();
  const t = tAt(g);
  const win = winAt(g);
  const offY = camOffsetY(g);
  const sh = shakeAt(g, [[G.crash, 16, 46], [222, 22, 26], [G.plunge, 10, 24]], "crash");
  const distort = between(g, G.crash, 234) ? (random(`dist${g}`) * 2 - 1) * 4 : 0;
  const frozen = between(g, G.stop, G.crash);
  const graphVisible = g < G.panic || g >= G.recover;
  const hudVisible = g >= 8 && graphVisible && g < 428;
  const crashing = t > 30 && t < 31.6;
  const trough = toScreen(win, 30.5, valueAt(30.5));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {graphVisible ? (
        <GlitchTransition intensity={glitchIntensity} seed="crash">
          <Freeze frame={G.stop} active={frozen}>
            <AbsoluteFill
              style={{
                transform: `translate(${sh.x}px, ${offY + sh.y}px) rotate(${sh.r}deg) skewY(${distort}deg) scaleY(${1 + Math.abs(distort) * 0.01})`,
              }}
            >
              <FinancialGraph g={g} />
              {g < G.arrive10 + 10
                ? PASS.map((at, i) =>
                    g >= at && g < at + 22 ? (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          left: toScreen(win, i + 1, compound(i + 1)).x - 40,
                          top: toScreen(win, i + 1, compound(i + 1)).y - 70 - (g - at) * 2.4,
                          opacity: 1 - (g - at) / 22,
                          ...mono(26, COLORS.accent, 700),
                        }}
                      >
                        +8%
                      </div>
                    ) : null,
                  )
                : null}
              {g < G.panic ? MILESTONES.map((m) => <Milestone key={m.year} g={g} year={m.year} at={m.at} size={m.size} />) : null}
              <RecoveryWords g={g} />
              {g >= G.plunge && g < G.panic ? (
                <div
                  style={{
                    position: "absolute",
                    left: trough.x - strokeAt(win) / 2,
                    top: trough.y,
                    width: strokeAt(win),
                    height: tween(g, [G.plunge, G.panic], [0, 3400], ease.inExpo),
                    background: COLORS.crash,
                    boxShadow: `0 0 30px ${COLORS.crash}`,
                  }}
                />
              ) : null}
            </AbsoluteFill>
            {hudVisible ? (
              <AbsoluteFill style={{ transform: `translate(${sh.x * 0.5}px, ${sh.y * 0.5}px)` }}>
                <div style={{ position: "absolute", left: 70, top: 230 }}>
                  <div style={mono(24)}>PORTFOLIO VALUE</div>
                  <Counter value={displayValueAt(t)} style={{ ...display(92, crashing ? COLORS.crash : COLORS.ink, 800), letterSpacing: "-0.03em", marginTop: 10 }} />
                </div>
                <div style={{ position: "absolute", right: 70, top: 230, textAlign: "right" }}>
                  <div style={mono(24)}>YEAR</div>
                  <div style={{ ...display(92, COLORS.ink, 800), marginTop: 10 }}>{String(Math.floor(t)).padStart(2, "0")}</div>
                </div>
                <div style={{ position: "absolute", left: 70, top: 404, ...mono(18), letterSpacing: "0.08em" }}>
                  ILLUSTRATIVE · $10,000 AT 8%/YR · NO CONTRIBUTIONS · NOT GUARANTEED
                </div>
              </AbsoluteFill>
            ) : null}
          </Freeze>
        </GlitchTransition>
      ) : null}

      {/* Zoom through +8% into the graph */}
      {between(g, 58, 84) ? (
        <ZoomTransition start={66} duration={14} to={30} origin="50% 50%">
          <KineticText text="+8%" textStyle={display(330, COLORS.accent)} pose={(fr) => ({ scale: punch(fr, 58, 0.3, SPRINGS.bouncy) })} />
        </ZoomTransition>
      ) : null}

      {/* STOP: total freeze */}
      {between(g, G.stop + 2, G.crash) ? (
        <AbsoluteFill style={{ backgroundColor: "rgba(6,7,8,0.55)", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...mono(28, COLORS.crash, 700), marginBottom: 24 }}>● MARKET EVENT</div>
          <div style={display(280)}>STOP.</div>
        </AbsoluteFill>
      ) : null}

      {/* −32% */}
      {between(g, 222, G.plunge + 4) ? (
        <GlitchTransition intensity={(fr) => (between(fr, 222, 225) || between(fr, 238, 240) ? 0.8 : 0)} seed="m32" background="transparent">
          <Kinetic pose={(fr) => ({ y: -300 + tween(fr, [G.plunge, G.plunge + 4], [0, -900], ease.inExpo), scale: punch(fr, 222, 2.4) })}>
            <div style={display(340, COLORS.crash)}>−32%</div>
          </Kinetic>
        </GlitchTransition>
      ) : null}

      {/* PANIC? — then silence */}
      {between(g, G.panic, G.black) ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={display(230)}>PANIC?</div>
        </AbsoluteFill>
      ) : null}

      <Flash hits={[[G.crash, 0.55], [222, 0.35]]} color={COLORS.crash} />
      <Flash hits={[[G.arrive10, 0.18], [G.arrive20, 0.18], [G.arrive30, 0.28]]} color={COLORS.accent} />
    </AbsoluteFill>
  );
};
