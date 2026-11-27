import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { RoundedBox, Text3D, Center } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { Env, Cam, Dust, Glow, Floor, Display, kf, pr, lin, mix, useTex, useCanvasTex, rr, roundedPlane, GOLD, GOLD_L, ui } from "./common";
import { Kinetic, Flash, Eyebrow } from "./overlay";

export const BRANDS = ["solia", "khaneen", "delfino", "danish-bakery", "haagen-dazs", "illy", "sutis"];

export const FX: React.FC<{ dof?: number; bloom?: number; focus?: number }> = ({ dof, bloom = 0.55, focus = 0.02 }) => (
  <EffectComposer multisampling={0}>
    {dof ? <DepthOfField focusDistance={focus} focalLength={0.06} bokehScale={dof} /> : <></>}
    <Bloom intensity={bloom * 1.4} luminanceThreshold={1.0} luminanceSmoothing={0.15} mipmapBlur />
    <Vignette darkness={0.55} offset={0.25} />
  </EffectComposer>
);

export const Canvas3D: React.FC<{ children: React.ReactNode; fov?: number }> = ({ children, fov = 35 }) => {
  const { width, height } = useVideoConfig();
  return <ThreeCanvas width={width} height={height} camera={{ fov, near: 0.1, far: 120, position: [0, 0, 8] }} gl={{ antialias: true, powerPreference: "high-performance" }}>{children}</ThreeCanvas>;
};

/* ---------- glass tile with a real brand logo ---------- */
const LogoTile: React.FC<{ name: string; position: [number, number, number]; rotation?: [number, number, number]; s?: number; op?: number; tint?: number }> = ({ name, position, rotation = [0, 0, 0], s = 1, op = 1, tint = 1 }) => {
  const tex = useTex(staticFile(`${name}.png`));
  const geo = useMemo(() => roundedPlane(0.92, 0.92, 0.18), []);
  return (<group position={position} rotation={rotation} scale={[s, s, s]}>
    <RoundedBox args={[1.08, 1.08, 0.06]} radius={0.2} smoothness={5} position={[0, 0, -0.04]}>
      <meshPhysicalMaterial color="#f5efe3" metalness={0.1} roughness={0.12} clearcoat={1} transparent opacity={op} />
    </RoundedBox>
    <mesh geometry={geo}><meshBasicMaterial map={tex} toneMapped={false} transparent opacity={op} color={new THREE.Color(tint, tint, tint)} /></mesh>
  </group>);
};

/* ---------- creator avatar disc ---------- */
const AVC = ["#C2941B", "#8C690F", "#d8b46a", "#7a5a2b", "#e9d3a0", "#5d4a2e"];
const Avatar: React.FC<{ position: [number, number, number]; i: number; s?: number; op?: number }> = ({ position, i, s = 1, op = 1 }) => {
  const initials = ["SA", "FM", "NE", "YH", "DR", "MS", "AA", "SK", "HA", "KO", "LS", "BF"][i % 12];
  const tex = useCanvasTex(256, 256, (g) => { const gr = g.createLinearGradient(0, 0, 256, 256); gr.addColorStop(0, AVC[i % 6]); gr.addColorStop(1, "#2a2116"); g.fillStyle = gr; g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.fill(); g.fillStyle = "rgba(255,255,255,.92)"; g.font = "600 92px Inter"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(initials, 128, 136); }, [i]);
  return (<group position={position} scale={[s, s, s]}>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]}><cylinderGeometry args={[0.42, 0.42, 0.05, 48]} /><meshPhysicalMaterial color="#d9b25b" metalness={1} roughness={0.25} transparent opacity={op} /></mesh>
    <mesh position={[0, 0, 0.001]}><circleGeometry args={[0.38, 48]} /><meshBasicMaterial map={tex} toneMapped={false} transparent opacity={op} /></mesh>
  </group>);
};

/* ======================= S1 · Introduction ======================= */
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const cool = pr(f, 140, 200); // "but for us, it used to be"
  const pos = kf(f, [0, 217], [[0, 0.5, 12.5], [0.5, 0.2, 9.2]]);
  const ring = f * 0.004;
  return (<AbsoluteFill style={{ background: "#0a0806" }}>
    <Canvas3D>
      <Env fog={[6, 22]} />
      <Cam pos={pos} look={[0, 0, 0]} roll={mix(-0.03, 0.02, lin(f, 0, 217))} />
      <ambientLight intensity={0.15} />
      <spotLight position={[3, 6, 6]} angle={0.5} penumbra={1} intensity={mix(60, 25, cool)} color={new THREE.Color().lerpColors(new THREE.Color("#ffd998"), new THREE.Color("#9fb4d9"), cool)} />
      <Glow position={[0, 0, -4]} scale={11} opacity={mix(0.42, 0.18, cool)} color={cool > 0.5 ? "#6d7fa3" : GOLD} />
      {BRANDS.map((b, i) => {
        const a = (i / BRANDS.length) * Math.PI * 2 + ring;
        const p = pr(f, 6 + i * 7, 40 + i * 7);
        return <LogoTile key={b} name={b} position={[Math.sin(a) * 1.3, Math.cos(a) * 2.5 + 0.2, Math.cos(a) * 0.9 - 0.6 + (1 - p) * -4]} rotation={[0, -Math.sin(a) * 0.5, 0]} s={0.92 * p} tint={mix(1, 0.55, cool)} />;
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - ring * 1.6 + 0.3;
        const p = pr(f, 40 + i * 5, 80 + i * 5);
        return <Avatar key={i} i={i} position={[Math.sin(a) * 1.9, Math.cos(a) * 3.9 + 0.2, Math.cos(a) * 1.4 - 2.2]} s={0.55 * p} op={mix(1, 0.6, cool)} />;
      })}
      <Dust n={320} />
      <FX dof={4} bloom={0.6} />
    </Canvas3D>
    <Eyebrow text="RESTAURANTS · CREATORS · CAMPAIGNS" at={20} out={130} top="10%" />
  </AbsoluteFill>);
};

/* ======================= S2 · The problem ======================= */
const MSGS = ["Hi! Are you free this Friday? 🙏", "Can you send me your number?", "Just following up 😊", "Which date works for you?", "Sorry, who is this?", "Still interested?", "Sent you a DM!", "What's your follower count?", "Can I bring a friend?", "Following up again…"];
const Bubble: React.FC<{ text: string; i: number; position: [number, number, number]; s: number; out?: boolean }> = ({ text, i, position, s, out }) => {
  const tex = useCanvasTex(1024, 220, (g) => {
    g.clearRect(0, 0, 1024, 220); g.font = "500 64px Inter"; const tw = Math.min(980, g.measureText(text).width + 90);
    const x = out ? 1024 - tw - 6 : 6; rr(g, x, 20, tw, 170, 80); g.fillStyle = out ? "#3d6ff0" : "#26282d"; g.fill();
    g.fillStyle = "#fff"; g.textBaseline = "middle"; g.fillText(text, x + 45, 106);
  }, [text, out]);
  if (s <= 0.001) return null;
  return (<mesh position={position} scale={[s * 1.75, s * 0.38, 1]} rotation={[0, (i % 2 ? -1 : 1) * 0.18, 0]}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} /></mesh>);
};
const Sheet: React.FC<{ rows: number; position: [number, number, number]; rotation?: [number, number, number]; s?: number }> = ({ rows, position, rotation = [0, 0, 0], s = 1 }) => {
  const names = ["sara.eats", "fatma.foodie", "noura.kitchen", "yousef.tastes", "dana.brunch", "mariam.dines", "abdullah.bites", "hessa.daily", "khaled.grills", "lulwa.cafe", "bader.trail", "rawan.plates"];
  const tex = useCanvasTex(1200, 1000, (g) => {
    g.fillStyle = "#f7f7f5"; g.fillRect(0, 0, 1200, 1000);
    const cols = [60, 330, 640, 860, 1060]; const hd = ["Instagram", "Phone", "Followers", "Replied?", "Visit"];
    g.fillStyle = "#e9ebe7"; g.fillRect(0, 0, 1200, 70); g.font = "600 30px Inter"; g.fillStyle = "#3a3f45"; hd.forEach((h, i) => g.fillText(h, cols[i], 46));
    g.strokeStyle = "#d4d7d2"; g.lineWidth = 2;
    for (let r = 0; r <= 12; r++) { g.beginPath(); g.moveTo(0, 70 + r * 76); g.lineTo(1200, 70 + r * 76); g.stroke(); }
    cols.forEach((c) => { g.beginPath(); g.moveTo(c - 24, 0); g.lineTo(c - 24, 1000); g.stroke(); });
    g.font = "400 28px Inter";
    names.forEach((n, r) => { const y = 70 + r * 76 + 48; g.fillStyle = "#2b2f33"; g.fillText("@" + n, 60, y); g.fillText(r % 3 === 2 ? "—" : `+965 ${5 + (r % 4)}${(1234567 + r * 7919).toString().slice(0, 3)} ${(4421 + r * 37) % 10000}`, 330, y); g.fillText(`${(3 + r * 1.7).toFixed(1)}k`, 640, y); g.fillStyle = r % 3 === 1 ? "#b4402f" : "#2f7d4f"; g.fillText(r % 3 === 1 ? "No reply" : r % 3 === 2 ? "Waiting" : "Yes", 860, y); g.fillStyle = "#80868d"; g.fillText(r % 2 ? "?" : "Fri", 1060, y); });
  }, []);
  const vis = Math.max(0, Math.min(1, rows / 12));
  const k = 0.07 + 0.93 * vis;
  const t = useMemo(() => { const c = tex.clone(); c.needsUpdate = true; return c; }, [tex]);
  t.repeat.set(1, k); t.offset.set(0, 1 - k);
  return (<group position={position} rotation={rotation} scale={[s, s, s]}>
    <RoundedBox args={[3.1, 2.65, 0.04]} radius={0.04} position={[0, 0, -0.03]}><meshPhysicalMaterial color="#e8e8e4" roughness={0.4} /></RoundedBox>
    <mesh position={[0, (1 - k) * 2.58 / 2, 0]}>
      <planeGeometry args={[3.0, 2.58 * k]} />
      <meshBasicMaterial toneMapped={false} map={t} />
    </mesh>
  </group>);
};
export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const chaos = pr(f, 286, 360, (t) => t);
  const pos = kf(f, [0, 150, 240, 360], [[0, 0, 11.5], [-0.8, 0.4, 9.6], [0.7, -0.4, 9.0], [0, 0, 6.5]]);
  const bubbles = MSGS.map((m, i) => {
    const t0 = 30 + i * 18; const s = pr(f, t0, t0 + 14);
    const a = i * 2.4; const rad = 1.4 + (i % 3) * 0.7;
    const spin = chaos * (i % 2 ? 1 : -1) * 1.2;
    return { m, i, s: s * (1 - pr(f, 340, 360)), pos: [Math.cos(a + spin) * rad * 0.45, 2.7 - i * 0.58 + Math.sin(f * 0.03 + i) * 0.06, Math.sin(a + spin) * 1.2 - 0.5] as [number, number, number], out: i % 3 === 1 };
  });
  const rows = interpolate(f, [186, 262], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sheetIn = pr(f, 180, 210);
  return (<AbsoluteFill style={{ background: "#0b0c0f" }}>
    <Canvas3D>
      <Env bg="#0b0c0f" fog={[5, 20]} envI={0.6} />
      <Cam pos={pos} look={[0, 0.3, 0]} roll={chaos * 0.12 * Math.sin(f * 0.05)} />
      <ambientLight intensity={0.25} />
      <pointLight position={[2, 3, 4]} intensity={30} color="#c9d4ea" />
      <Glow position={[0, 0.5, -5]} scale={12} color="#3b4a6b" opacity={0.35} />
      <Glow position={[1.8, -1.5, -3]} scale={7} color="#b4402f" opacity={0.18 + chaos * 0.25} />
      {bubbles.map((b) => <Bubble key={b.i} text={b.m} i={b.i} position={b.pos} s={b.s} out={b.out} />)}
      {sheetIn > 0 && <Sheet rows={rows} position={[0.15 + chaos * 2, -1.9 - chaos * 0.5, 0.6 - chaos * 2]} rotation={[-0.25 + chaos, -0.35 + chaos * 1.5, 0.05]} s={0.82 * sheetIn * (1 - pr(f, 336, 360))} />}
      {/* repetition: copies of the sheet spiralling away */}
      {chaos > 0 && Array.from({ length: 10 }).map((_, i) => {
        const a = i * 0.63 + f * 0.03; const r = 2 + i * 0.45 * chaos;
        return <Sheet key={i} rows={12} position={[Math.cos(a) * r, Math.sin(a) * r * 1.4, -2 - i * 0.6]} rotation={[a, a * 0.7, 0]} s={0.55 * chaos} />;
      })}
      <Dust n={160} color="#9fb4d9" />
      <FX dof={3} bloom={0.4} />
    </Canvas3D>
    <Badge />
  </AbsoluteFill>);
};
/** DM counter that keeps climbing */
const Badge: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [40, 340], [3, 286], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t }));
  const p = pr(f, 36, 52) * (1 - pr(f, 344, 358));
  if (p <= 0) return null;
  return (<AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-start", padding: "180px 90px", pointerEvents: "none" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 28px", borderRadius: 999, background: "rgba(16,17,21,.7)", border: "1.5px solid rgba(255,255,255,.14)", backdropFilter: "blur(10px)", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
      <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 34, color: "#d8dbe2" }}>Unread messages</span>
      <span style={{ minWidth: 74, textAlign: "center", padding: "6px 16px", borderRadius: 999, background: "#e0453a", color: "#fff", fontFamily: "Inter", fontWeight: 700, fontSize: 36, boxShadow: "0 0 30px rgba(224,69,58,.6)" }}>{n}</span>
    </div>
  </AbsoluteFill>);
};

/* ======================= S3 · The cost ======================= */
const Money: React.FC<{ at: number; z: number; x?: number; y?: number; s?: number; red?: boolean }> = ({ at, z, x = 0, y = 1.4, s = 1, red }) => {
  const f = useCurrentFrame();
  const p = pr(f, at, at + 22);
  if (p <= 0) return null;
  return (<group position={[x, y + (1 - p) * 0.6, z - (1 - p) * 6]} rotation={[(1 - p) * -0.6, (1 - p) * 0.4 + Math.sin(f * 0.02) * 0.06, 0]} scale={[s, s, s]}>
    <Center>
      <Text3D font={staticFile("film/helvetiker_bold.typeface.json")} size={0.5} height={0.16} bevelEnabled bevelSize={0.022} bevelThickness={0.03} bevelSegments={6} curveSegments={10} letterSpacing={-0.02}>
        1,500 KD
        <meshPhysicalMaterial color={red ? "#d2685a" : "#e2b24a"} metalness={1} roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} />
      </Text3D>
    </Center>
  </group>);
};
export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const scatter = pr(f, 214, 250);
  const pos = kf(f, [0, 120, 278], [[0, 0.4, 10.4], [0, 0.0, 9.4], [0.3, 0.4, 11.2]]);
  const grid = useMemo(() => Array.from({ length: 100 }).map((_, i) => ({ i, x: (i % 10) - 4.5, y: Math.floor(i / 10) - 4.5, d: ((i * 7919) % 100) / 100 })), []);
  return (<AbsoluteFill style={{ background: "#080605" }}>
    <Canvas3D>
      <Env bg="#080605" fog={[7, 26]} envI={1.1} />
      <Cam pos={pos} look={[0, 0.2, 0]} />
      <ambientLight intensity={0.12} />
      <spotLight position={[0, 6, 5]} angle={0.45} penumbra={1} intensity={90} color="#ffe2a8" />
      <spotLight position={[-5, 2, 2]} angle={0.6} penumbra={1} intensity={40} color="#ffb070" />
      <Glow position={[0, 1.4, -2]} scale={8} opacity={0.3} />
      <Money at={70} z={0} />
      <Money at={214} z={-2.2} y={2.3} s={0.8} red />
      <Money at={236} z={-4.4} y={3.2} s={0.7} red />
      {grid.map((g) => {
        const t0 = 128 + g.d * 30 + (g.y + 4.5) * 2; const p = pr(f, t0, t0 + 16);
        const sx = g.x * 0.3, sy = -0.55 - (g.y + 4.5) * 0.3;
        const fly = scatter * (1 + g.d);
        return <Avatar key={g.i} i={g.i} position={[sx + fly * g.x * 0.6, sy - fly * 3 + Math.sin(g.i) * fly, (1 - p) * 3 + fly * 2 * g.d]} s={0.3 * p * (1 - scatter * 0.6)} op={1 - scatter} />;
      })}
      <Floor y={-4.2} />
      <Dust n={160} />
      <FX bloom={0.7} />
    </Canvas3D>
    <Kinetic text="for every 100 bloggers" at={150} out={208} top="13%" size={64} color="#e9dcc0" />
    <Kinetic text="Every campaign. Again." at={238} top="76%" size={70} gold />
  </AbsoluteFill>);
};

/* ======================= S4 · The solution ======================= */
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const FL = 58; // flash frame
  const before = f < FL;
  const suck = pr(f, 0, FL, (t) => t * t);
  const rise = pr(f, FL + 4, FL + 70);
  const pos = before ? kf(f, [0, FL], [[0, 0, 7], [0, 0, 3.2]]) : kf(f, [FL, FL + 90, 252], [[0, -1.0, 12.5], [0, 0.2, 9.6], [0.4, 0.3, 8.8]]);
  return (<AbsoluteFill style={{ background: "#0a0806" }}>
    <Canvas3D>
      <Env fog={[8, 30]} envI={before ? 0.6 : 1.2} bg={before ? "#0b0c0f" : "#0a0806"} />
      <Cam pos={pos} look={before ? [0, 0, 0] : [0, 0.1, 0]} roll={before ? suck * 0.4 : 0} />
      <ambientLight intensity={0.2} />
      {before ? (<>
        {MSGS.map((m, i) => { const a = i * 0.9 + suck * 9; const r = (2.6 + (i % 3) * 0.6) * (1 - suck); return <Bubble key={i} text={m} i={i} position={[Math.cos(a) * r, Math.sin(a) * r * 1.3, -suck * 2]} s={0.9 * (1 - suck * 0.9)} out={i % 3 === 1} />; })}
        <mesh><sphereGeometry args={[0.08 + suck * 0.25, 32, 32]} /><meshBasicMaterial color={new THREE.Color("#fff3c4").multiplyScalar(4)} toneMapped={false} /></mesh>
        <Glow position={[0, 0, 0.2]} scale={1 + suck * 5} opacity={0.9} color={GOLD_L} />
        <FX bloom={1.4} />
      </>) : (<>
        <spotLight position={[0, 7, 4]} angle={0.5} penumbra={1} intensity={80} color="#ffe6b5" />
        <pointLight position={[-4, 1, 3]} intensity={25} color="#ffd890" />
        <group position={[0, -2.6 + rise * 2.6, 0]} rotation={[0, (1 - rise) * 0.5, 0]}>
          <Display shots={[{ src: ui("a_overview"), at: 0 }]} />
        </group>
        <Glow position={[0, 0, -2.5]} scale={9} opacity={0.35 * rise} />
        <Floor y={-1.6} />
        <Dust n={220} />
        <FX bloom={0.5} />
      </>)}
    </Canvas3D>
    <Flash at={FL} dur={22} />
    <Kinetic text="So we built our own." at={FL + 30} out={190} top="12%" size={84} />
    <Kinetic text="From applications to restaurant visits." at={176} top="74%" size={54} color="#e9dcc0" />
  </AbsoluteFill>);
};
