import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate } from "remotion";
import { RoundedBox, Text3D, Center } from "@react-three/drei";
import { Canvas3D, FX, Env, Cam, Lights, IPhone, Card, Dust, Glow, Blob, Tap, phoneScreen, useCanvasTex, ui, logo, kf, k1, pr, mix, back, easeIO, rnd, BRANDS, GOLD_L, V3 } from "./kit";
import { Person, POSE, EMPLOYEE, lerpPose, Pose } from "./chars";
import { M } from "./timing";

/* =============== shared office set =============== */
const walnut = new THREE.MeshPhysicalMaterial({ color: "#3b281b", roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 });
const metal = new THREE.MeshPhysicalMaterial({ color: "#2a2a2c", metalness: 0.9, roughness: 0.35 });
const blackGloss = new THREE.MeshPhysicalMaterial({ color: "#0d0d0f", metalness: 0.4, roughness: 0.25, clearcoat: 1 });

export const Office: React.FC<{ f: number; pose: Pose; laptopGold?: number; children?: React.ReactNode; phoneShots?: { src: string; at: number }[] }> = ({ f, pose, laptopGold = 0, children, phoneShots }) => (
  <group>
    {/* floor + far back wall */}
    <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[14, 64]} /><meshPhysicalMaterial color="#17110c" roughness={0.38} metalness={0.2} clearcoat={0.6} clearcoatRoughness={0.4} /></mesh>
    <mesh position={[0, 3, -4]}><planeGeometry args={[20, 8]} /><meshStandardMaterial color="#120d09" roughness={1} /></mesh>
    <Blob position={[0, 0.002, -0.2]} s={[2.4, 1.6]} op={0.6} />
    {/* desk */}
    <RoundedBox args={[1.6, 0.045, 0.78]} radius={0.018} smoothness={4} position={[0, 0.76, 0]} material={walnut} />
    {[[-0.74, -0.32], [0.74, -0.32], [-0.74, 0.32], [0.74, 0.32]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.37, z]} material={metal}><cylinderGeometry args={[0.018, 0.018, 0.74, 12]} /></mesh>))}
    {/* chair */}
    <group position={[0, 0, -0.66]}>
      <RoundedBox args={[0.5, 0.07, 0.48]} radius={0.03} position={[0, 0.44, 0]} material={blackGloss} />
      <RoundedBox args={[0.48, 0.62, 0.06]} radius={0.03} position={[0, 0.82, -0.26]} rotation={[-0.12, 0, 0]} material={blackGloss} />
      <mesh position={[0, 0.22, 0]} material={metal}><cylinderGeometry args={[0.025, 0.025, 0.4, 12]} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[Math.cos(i * 1.256) * 0.16, 0.03, Math.sin(i * 1.256) * 0.16]} rotation={[0, -i * 1.256, Math.PI / 2]} material={metal}><cylinderGeometry args={[0.015, 0.015, 0.32, 8]} /></mesh>)}
    </group>
    {/* employee, facing camera (+z) */}
    <Person look={EMPLOYEE} pose={pose} position={[0, 0.5, -0.6]} />
    {/* laptop (screen faces the employee) */}
    <group position={[0, 0.785, -0.12]}>
      <RoundedBox args={[0.5, 0.014, 0.34]} radius={0.006} material={metal} />
      <group position={[0, 0.005, -0.17]} rotation={[-0.42, Math.PI, 0]}>
        <RoundedBox args={[0.44, 0.27, 0.01]} radius={0.006} position={[0, 0.135, 0]} material={metal} />
        <mesh position={[0, 0.135, 0.0065]}><planeGeometry args={[0.41, 0.24]} /><meshBasicMaterial color={new THREE.Color("#cfe0ff").lerp(new THREE.Color(GOLD_L), laptopGold).multiplyScalar(1 + laptopGold * 0.8)} toneMapped={false} /></mesh>
      </group>
    </group>
    {/* monitor, angled toward the employee, spreadsheet on it */}
    <group position={[-0.56, 0.78, -0.02]} rotation={[0, Math.PI + 0.75, 0]}>
      <mesh position={[0, 0.06, 0]} material={metal}><cylinderGeometry args={[0.015, 0.02, 0.12, 12]} /></mesh>
      <RoundedBox args={[0.2, 0.012, 0.14]} radius={0.005} material={metal} />
      <RoundedBox args={[0.74, 0.46, 0.025]} radius={0.01} position={[0, 0.36, -0.01]} material={blackGloss} />
      <Card src={ui("m_sheet_wide")} w={0.71} position={[0, 0.36, 0.004]} op={1} />
      <mesh position={[0.32, 0.56, 0.006]} rotation={[0, 0, 0.12]}><planeGeometry args={[0.07, 0.07]} /><meshStandardMaterial color="#f3d55b" /></mesh>
      <mesh position={[-0.33, 0.55, 0.006]} rotation={[0, 0, -0.18]}><planeGeometry args={[0.07, 0.07]} /><meshStandardMaterial color="#f7a7b5" /></mesh>
    </group>
    {/* phone lying on the desk, screen up */}
    <group position={[0.42, 0.79, 0.12]} rotation={[-Math.PI / 2, 0, -0.35]}>
      <IPhone h={0.16} shots={phoneShots ?? [{ src: ui("m_ig_inbox"), at: 0 }]} island={false} />
    </group>
    {/* mug + papers */}
    <mesh position={[0.6, 0.83, -0.18]} material={new THREE.MeshPhysicalMaterial({ color: "#efe9df", roughness: 0.3, clearcoat: 0.8 })}><cylinderGeometry args={[0.04, 0.036, 0.1, 24]} /></mesh>
    {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[-0.25 + rnd(i) * 0.04, 0.786 + i * 0.006, 0.18]} rotation={[-Math.PI / 2, 0, rnd(i + 9) * 0.5 - 0.25]}><planeGeometry args={[0.21, 0.29]} /><meshStandardMaterial color="#f4f1ea" side={THREE.DoubleSide} /></mesh>)}
    {/* screen glow lighting the employee */}
    <spotLight position={[0.3, 2.6, 1.2]} angle={0.5} penumbra={1} intensity={1.2 + laptopGold * 0.8} distance={5} color={laptopGold > 0.3 ? GOLD_L : "#dbe4ff"} />
    {children}
  </group>
);

/* =============== S1: the old way, at the desk =============== */
const BANNERS: { at: number; p: V3; r: number; i: number }[] = [
  { at: 28, p: [0.22, 1.92, 0.3], r: -0.05, i: 0 }, { at: 48, p: [-0.24, 1.72, 0.35], r: 0.06, i: 1 }, { at: 66, p: [0.26, 1.55, 0.45], r: -0.03, i: 2 },
  { at: 82, p: [-0.2, 2.1, 0.25], r: 0.05, i: 3 }, { at: 96, p: [0.18, 2.28, 0.2], r: -0.07, i: 4 }, { at: 108, p: [-0.28, 1.42, 0.55], r: 0.04, i: 5 },
  { at: 118, p: [0.05, 2.42, 0.15], r: 0.02, i: 2 }, { at: 127, p: [0.3, 1.3, 0.62], r: -0.05, i: 1 }, { at: 135, p: [-0.15, 2.45, 0.3], r: 0.06, i: 0 },
  { at: 142, p: [-0.32, 1.22, 0.7], r: 0.03, i: 4 }, { at: 148, p: [0.2, 1.75, 0.75], r: -0.04, i: 3 }, { at: 154, p: [-0.05, 2.0, 0.8], r: -0.02, i: 5 },
];
const typingPose = (f: number): Pose => {
  const b = Math.sin(f * 0.9) * 0.012, c = Math.sin(f * 0.9 + 1.7) * 0.012;
  return { ...POSE.sit, ...POSE.type, lT: [-0.08, -0.08 + b, 0.4], rT: [0.08, -0.08 + c, 0.4], head: [0.18 + Math.sin(f * 0.05) * 0.03, Math.sin(f * 0.03) * 0.15, 0] };
};
const hh = (f: number): Pose => ({ ...POSE.sit, ...POSE.headHands, head: [0.32, Math.sin(f * 0.25) * 0.18, 0] });

export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const pose = lerpPose(typingPose(f), hh(f), pr(f, 160, 182));
  const cam = kf(f, [0, 200, 250], [[0.25, 2.05, 4.9], [0.45, 1.78, 2.75], [0.48, 1.1, 0.6]]);
  const look = kf(f, [0, 200, 250], [[0, 1.2, -0.5], [0, 1.3, -0.45], [0.42, 0.79, 0.12]]);
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0c0907" envI={0.45} /><Lights k={1.15} amb={0.18} />
    <Cam pos={cam} look={look} />
    <Office f={f} pose={pose} />
    {BANNERS.map((b, i) => {
      const s = pr(f, b.at, b.at + 10, back); const fl = Math.sin((f - b.at) * 0.05 + i) * 0.02;
      return <Card key={i} src={ui(`m_bn${b.i}`)} w={0.5} position={[b.p[0], b.p[1] + fl, b.p[2]]} rotation={[-0.15, -b.p[0] * 0.4, b.r]} scale={s} op={Math.min(1, s * 1.5) * (1 - pr(f, 205, 230))} order={30 + i} />;
    })}
    <Dust n={120} spread={[8, 5, 4]} center={[0, 1.6, -1.5]} size={0.03} />
    <Glow position={[0, 1.4, -2.5]} scale={5} opacity={0.25} />
    <FX bloom={0.5} />
  </Canvas3D>
    <UnreadChip f={f} />
  </AbsoluteFill>);
};

const UnreadChip: React.FC<{ f: number }> = ({ f }) => {
  const o = pr(f, 30, 44) * (1 - pr(f, 205, 225));
  const n = Math.round(interpolate(f, [30, 160], [12, 248], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (o <= 0) return null;
  return (<AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: "13%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderRadius: 999, background: "rgba(18,14,10,.72)", border: "1.5px solid rgba(255,255,255,.14)", backdropFilter: "blur(16px)", opacity: o, transform: `translateY(${(1 - o) * 24}px)`, fontFamily: "Inter", fontWeight: 600, fontSize: 40, color: "#fff" }}>
      Unread messages <span style={{ background: "#ff3b30", borderRadius: 999, padding: "4px 18px", fontSize: 38, minWidth: 90, textAlign: "center", transform: `scale(${1 + 0.12 * Math.max(0, Math.sin(f * 0.8))})` }}>{n}</span>
    </div>
  </AbsoluteFill>);
};

/* =============== S2: the Instagram reality, on an iPhone =============== */
export const S2: React.FC = () => {
  const lf = useCurrentFrame(); const f = lf + 250;
  const { sw, sh } = phoneScreen(4);
  const sw1 = pr(f, 365, 385, easeIO); // app switch to spreadsheet
  const spin = pr(f, 430, 490, easeIO);
  const lap = Math.floor(spin * 4.999);
  const shotsA = [{ src: ui("m_ig_inbox"), at: 0 }, { src: ui("m_ig_old2"), at: 306 }, { src: ui("m_ig_old7"), at: 328 }, { src: ui("m_ig_old9"), at: 348 }];
  const camZ = mix(9.4, 8.6, pr(f, 250, 360));
  const brand = BRANDS[lap % 7];
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0b0806" envI={0.7} /><Lights k={1.2} />
    <Cam pos={[0.2 * Math.sin(f * 0.01), 0.05, camZ]} look={[0, 0, 0]} />
    <Glow position={[0, 0.3, -3]} scale={9} opacity={0.32} />
    <Dust n={150} spread={[10, 12, 6]} center={[0, 0, -4]} />
    {/* phone A: Instagram */}
    <group position={[mix(0, -3.2, sw1) + mix(0, 0, spin), 0, mix(0, -1.5, sw1)]} rotation={[0.04 * Math.sin(f * 0.02), mix(-0.12 + 0.08 * Math.sin(f * 0.015), -0.5, sw1), 0]}>
      <IPhone h={4} shots={shotsA} sheen={f * 0.004} t0={250}>
        <Tap sw={sw} sh={sh} x={0.42} y={0.21} at={300} t0={250} />
      </IPhone>
    </group>
    {/* phone B: the spreadsheet, then the endless loop */}
    {sw1 > 0 && <group position={[mix(3.2, 0, sw1), 0, mix(-1.5, 0, sw1)]} rotation={[0, mix(0.5, 0, sw1) + spin * Math.PI * 4, 0]}>
      <IPhone h={4} shots={[{ src: ui("m_sheet"), at: 0 }, { src: ui("m_ig_inbox"), at: 442 }, { src: ui("m_ig_old9"), at: 454 }, { src: ui("m_sheet"), at: 466 }, { src: ui("m_ig_inbox"), at: 478 }]} sheen={f * 0.004} t0={250} />
    </group>}
    {spin > 0 && spin < 1 && <Card src={logo(brand)} w={0.9} r={0.18} position={[0, 2.55, 0.4]} scale={1} op={Math.sin(spin * Math.PI)} order={80} />}
    <FX bloom={0.45} />
  </Canvas3D>
    {spin > 0.02 && <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: "6%" }}><div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 34, letterSpacing: "0.2em", color: "#E9C46A", opacity: Math.sin(spin * Math.PI) }}>RESTAURANT {lap + 2} · AGAIN</div></AbsoluteFill>}
  </AbsoluteFill>);
};

/* =============== S3: the real cost: two invoices =============== */
const RW = 1360, RH = 2000, PW = 0.36; const PU = PW / RW; // units per px
type Line = { y: number; l?: string; r?: string; size?: number; bold?: boolean; color?: string; center?: boolean; rule?: "dash" | "double" };
const INV_A: Line[] = [
  { y: 110, l: "MICROBLOGGER CAMPAIGN", size: 44, center: true, color: "#6b6258" },
  { y: 205, l: "AGENCY INVOICE", size: 92, bold: true, center: true },
  { y: 275, l: "Billed to: Marketing", size: 42, center: true, color: "#6b6258" },
  { y: 335, rule: "dash" },
  { y: 430, l: "Blogger sourcing", r: "1,500 KD", size: 58, bold: true },
  { y: 495, l: "100 bloggers", size: 44, color: "#6b6258" },
  { y: 560, rule: "double" },
  { y: 670, l: "TOTAL DUE", r: "1,500 KD", size: 74, bold: true },
  { y: 750, l: "Food not included", size: 44, center: true, color: "#b3261e" },
  { y: 810, rule: "dash" },
];
const INV_B: Line[] = [
  { y: 110, l: "MICROBLOGGER VISITS", size: 44, center: true, color: "#6b6258" },
  { y: 205, l: "RESTAURANT INVOICE", size: 80, bold: true, center: true },
  { y: 275, l: "Billed to: Marketing", size: 42, center: true, color: "#6b6258" },
  { y: 335, rule: "dash" },
  { y: 425, l: "Blogger visits", r: "100", size: 52 },
  { y: 505, l: "Average table check", r: "40 KD", size: 52 },
  { y: 585, l: "Marketing discount", r: "−70%", size: 52 },
  { y: 665, l: "Cost per blogger", r: "12 KD", size: 54, bold: true },
  { y: 730, rule: "double" },
  { y: 840, l: "TOTAL DUE", r: "1,200 KD", size: 74, bold: true },
  { y: 910, rule: "dash" },
];
const REV_A: [number, number][] = [[505, 0], [518, 300], [M.fee1500 + 4, 520], [M.fee1500 + 40, 600], [M.justFee, 790], [M.justFee + 40, 1000]];
const REV_B: [number, number][] = [[M.dines - 6, 0], [M.dines + 4, 300], [M.table40 - 8, 450], [M.table40 + 10, 530], [M.disc, 610], [M.each12, 690], [M.food1200, 870], [M.food1200 + 50, 1080]];
const printed = (f: number, R: [number, number][]) => { let v = 0; for (let i = 0; i < R.length; i++) { const [a, px] = R[i]; if (f < a) break; const prev = i ? R[i - 1][1] : 0; v = mix(prev, px, pr(f, a, a + 12, easeIO)); } return v; };

const Receipt: React.FC<{ f: number; lines: Line[]; rev: [number, number][]; seed: number }> = ({ f, lines, rev, seed }) => {
  const tex = useCanvasTex(RW, RH, (g) => {
    g.fillStyle = "#f7f4ee"; g.fillRect(0, 0, RW, RH);
    for (let i = 0; i < 2200; i++) { g.fillStyle = `rgba(0,0,0,${0.012 + rnd(i + seed) * 0.02})`; g.fillRect(rnd(i * 3 + seed) * RW, rnd(i * 7 + seed) * RH, 2, 2); }
    const pad = 90;
    for (const L of lines) {
      if (L.rule) { g.strokeStyle = "#2b2622"; g.lineWidth = 4; g.setLineDash(L.rule === "dash" ? [18, 14] : []); g.beginPath(); g.moveTo(pad, L.y); g.lineTo(RW - pad, L.y); g.stroke(); if (L.rule === "double") { g.beginPath(); g.moveTo(pad, L.y + 14); g.lineTo(RW - pad, L.y + 14); g.stroke(); } g.setLineDash([]); continue; }
      g.font = `${L.bold ? 700 : 500} ${L.size}px "DejaVu Sans Mono", monospace`; g.fillStyle = L.color ?? "#1d1a17"; g.textBaseline = "alphabetic";
      if (L.center) { g.textAlign = "center"; g.fillText(L.l!, RW / 2, L.y); }
      else { g.textAlign = "left"; g.fillText(L.l!, pad, L.y); if (L.r) { g.textAlign = "right"; g.fillText(L.r, RW - pad, L.y); } }
    }
    const by = lines[lines.length - 1].y + 50;
    for (let i = 0; i < 70; i++) { const w = 3 + Math.floor(rnd(i * 5 + seed) * 9); g.fillStyle = "#1d1a17"; g.fillRect(260 + i * 12, by, w * 0.8, 100); }
  }, []);
  const px = Math.max(2, printed(f, rev)); const L = px * PU;
  const geo = useMemo(() => new THREE.PlaneGeometry(PW, 1, 1, 30), []);
  const pos = geo.attributes.position; const base = useMemo(() => Float32Array.from(pos.array as Float32Array), [pos]);
  for (let i = 0; i < pos.count; i++) {
    const y = (base[i * 3 + 1] + 0.5) * L; const over = Math.max(0, y - 0.3);
    pos.setXYZ(i, base[i * 3], y, -over * over * 0.8 + Math.sin(y * 9 + f * 0.05 + seed) * 0.002);
  }
  pos.needsUpdate = true; geo.computeVertexNormals();
  tex.repeat.set(1, px / RH); tex.offset.set(0, 1 - px / RH);
  return <mesh geometry={geo}><meshStandardMaterial map={tex} roughness={0.85} side={THREE.DoubleSide} /></mesh>;
};
const Printer: React.FC = () => (<group>
  <RoundedBox args={[0.42, 0.12, 0.24]} radius={0.04} smoothness={5} position={[0, -0.061, 0]} material={blackGloss} />
  <mesh position={[0, 0.0, 0]}><boxGeometry args={[0.37, 0.004, 0.015]} /><meshBasicMaterial color="#000" /></mesh>
  <mesh position={[0.16, -0.04, 0.121]}><circleGeometry args={[0.009, 16]} /><meshBasicMaterial color={new THREE.Color("#7CFC9A").multiplyScalar(2)} toneMapped={false} /></mesh>
</group>);

const BigTotal: React.FC<{ f: number; s: number; pos: V3; op: number }> = ({ f, s, pos, op }) => {
  const shake = f > M.total && f < M.total + 12 ? (rnd(f) - 0.5) * 0.015 : 0;
  if (op <= 0) return null;
  return (<group position={[pos[0] + shake, pos[1], pos[2]]} scale={s}>
    <Center>
      <Text3D font={staticFile("film/helvetiker_bold.typeface.json")} size={0.068} height={0.018} bevelEnabled bevelSize={0.002} bevelThickness={0.003} bevelSegments={4} curveSegments={10}>
        2,700 KD
        <meshPhysicalMaterial color="#f2c45a" metalness={1} roughness={0.18} clearcoat={1} emissive="#8a5200" emissiveIntensity={0.7} transparent opacity={op} />
      </Text3D>
    </Center>
  </group>);
};

export const S3: React.FC = () => {
  const lf = useCurrentFrame(); const f = lf + 500;
  const slotY = 0.9; const XA = -0.21, XB = 0.21;
  const pA = printed(f, REV_A) * PU, pB = printed(f, REV_B) * PU;
  const fy = (p: number) => slotY + Math.min(p, 0.5) * 0.55;
  const side = pr(f, M.dines - 14, M.dines + 10, easeIO);
  const both = pr(f, M.total - 10, M.total + 8, easeIO);
  const wide = pr(f, M.oneCamp - 6, M.oneCamp + 50, easeIO);
  const fx = mix(XA, XB, side), fY = mix(fy(pA), fy(pB), side);
  let camPos: V3 = [fx + 0.02, fY + 0.04, 1.75]; let look: V3 = [fx, fY, 0.2];
  if (f < 540) { const t = pr(f, 500, 540, easeIO); camPos = [mix(0.5, camPos[0], t), mix(1.8, camPos[1], t), mix(2.8, camPos[2], t)]; }
  camPos = [mix(camPos[0], 0, both), mix(camPos[1], 1.32, both), mix(camPos[2], 2.6, both)]; look = [mix(look[0], 0, both), mix(look[1], 1.2, both), look[2]];
  camPos = [mix(camPos[0], 0.45, wide), mix(camPos[1], 1.9, wide), mix(camPos[2], 3.2, wide)]; look = [look[0], mix(look[1], 1.22, wide), mix(look[2], -0.2, wide)];
  const tS = pr(f, M.total, M.total + 10, back); const flash = pr(f, M.total - 2, M.total + 1) * (1 - pr(f, M.total + 1, M.total + 16));
  const pose = lerpPose({ ...POSE.sit, ...POSE.type }, hh(f), pr(f, M.dines, M.dines + 30));
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0c0907" envI={0.5} /><Lights k={1.25} amb={0.2} />
    <Cam pos={camPos} look={look} />
    <Office f={f} pose={pose}>
      <group position={[XA, slotY, 0.2]}><Printer /><Receipt f={f} lines={INV_A} rev={REV_A} seed={1} /></group>
      <group position={[XB, slotY, 0.24]}><Printer /><Receipt f={f} lines={INV_B} rev={REV_B} seed={7} /></group>
      <BigTotal f={f} s={tS * mix(1, 1.5, wide)} pos={[0, mix(1.5, 1.62, wide), 0.5]} op={pr(f, M.total - 1, M.total + 3)} />
      {f > M.total - 2 && <pointLight position={[0, 1.7, 0.9]} intensity={1.6 * tS} distance={1.6} color="#ffb060" />}
    </Office>
    <Dust n={80} spread={[4, 3, 3]} center={[0, 1.4, -1]} size={0.02} />
    <FX bloom={0.5 + flash * 0.6} />
  </Canvas3D>
    {flash > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, rgba(255,190,120,${0.3 * flash}) 0%, rgba(255,120,60,0) 60%)` }} />}
    <Sum f={f} />
  </AbsoluteFill>);
};
const Sum: React.FC<{ f: number }> = ({ f }) => {
  const o = pr(f, M.total - 8, M.total + 4) * (1 - pr(f, 1128, 1140));
  if (o <= 0) return null;
  return (<AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: "7%" }}>
    <div style={{ opacity: o, display: "flex", gap: 22, alignItems: "baseline", fontFamily: "Inter", fontWeight: 600, fontSize: 44, color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,.6)" }}>
      <span><span style={{ color: "#E9C46A", fontSize: 26, letterSpacing: "0.18em", display: "block", textAlign: "center" }}>AGENCY</span>1,500 KD</span>
      <span style={{ fontSize: 50, opacity: 0.8 }}>+</span>
      <span><span style={{ color: "#E9C46A", fontSize: 26, letterSpacing: "0.18em", display: "block", textAlign: "center" }}>RESTAURANTS</span>1,200 KD</span>
    </div>
  </AbsoluteFill>);
};

/* =============== S4: "So we built our own." =============== */
export const S4: React.FC = () => {
  const lf = useCurrentFrame(); const f = lf + 1140;
  const relax = pr(f, 1168, 1200, easeIO);
  const pose = lerpPose(hh(f), { ...POSE.sit, ...POSE.relax }, relax);
  const burst = pr(f, 1150, 1215);
  const gold = pr(f, 1170, 1205);
  const cam = kf(f, [1140, 1215, 1250], [[0.55, 1.75, 2.9], [0.0, 1.6, 2.4], [0.0, 1.05, 0.3]]);
  const look = kf(f, [1140, 1215, 1250], [[0, 1.12, -0.2], [0, 1.1, -0.3], [0, 0.95, -0.3]]);
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0c0907" envI={0.5} /><Lights k={1.25} amb={0.2} />
    <Cam pos={cam} look={look} />
    <Office f={f} pose={pose} laptopGold={gold}>
      {/* the receipt turns to gold dust */}
      {Array.from({ length: 140 }).map((_, i) => {
        const a = rnd(i), b = rnd(i + 50), c = rnd(i + 99); const t = Math.max(0, burst - a * 0.25);
        if (t <= 0 || t >= 1) return null;
        return <mesh key={i} position={[(b - 0.5) * 0.36 + Math.sin(i + t * 6) * 0.1 * t, 0.95 + c * 0.45 + t * 1.2, 0.2 + (a - 0.5) * 0.2]} scale={0.012 * (1 - t)}><sphereGeometry args={[1, 6, 6]} /><meshBasicMaterial color={new THREE.Color(GOLD_L).multiplyScalar(2.4)} toneMapped={false} /></mesh>;
      })}
      <Card src={staticFile("film2/mnh_mark_hd.png")} w={0.22} position={[0, mix(1.3, 1.55, gold), -0.25]} op={gold} scale={mix(0.6, 1, gold)} order={60} />
      <Glow position={[0, 1.4, -0.3]} scale={1.6 * gold + 0.01} opacity={0.5 * gold} />
    </Office>
    <Dust n={120} spread={[5, 4, 3]} center={[0, 1.5, -1]} size={0.03} />
    <FX bloom={0.55 + gold * 0.4} />
  </Canvas3D></AbsoluteFill>);
};
