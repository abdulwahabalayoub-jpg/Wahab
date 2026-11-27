import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { RoundedBox, Text3D, Center } from "@react-three/drei";
import { Env, Cam, Dust, Glow, Floor, Display, Phone, Highlight, kf, pr, lin, mix, useTex, useCanvasTex, roundedPlane, GOLD, GOLD_L, ui } from "./common";
import { Kinetic, Chip, Eyebrow } from "./overlay";
import { Canvas3D, FX, BRANDS } from "./scenes1";

/* ======================= S5 · Admin dashboard ======================= */
const DW = 3.2, DH = 2.0;
const at = (fx: number, fy: number, dist: number, ox = 0.5, oy = -0.25): [number[], number[]] => {
  const x = (fx - 0.5) * DW, y = (0.5 - fy) * DH; return [[x + ox, y + oy, dist], [x, y, 0]];
};
export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const K = [0, 140, 168, 200, 228, 264, 300, 342, 386];
  const P = [
    [[-3.6, 0.6, 6.2], [0, 0, 0]], [[0.9, 0.2, 5.4], [0, 0, 0]],
    at(0.6, 0.21, 3.4), at(0.92, 0.21, 2.6, -0.3, -0.1), at(0.28, 0.24, 3.0, 0.6),
    at(0.5, 0.5, 3.6, -0.5, -0.1), at(0.44, 0.3, 3.5, 0.5), at(0.58, 0.5, 3.6, -0.4, 0.2), [[0.6, 0.3, 6.6], [0, 0, 0]],
  ];
  const pos = kf(f, K, P.map((p) => p[0])); const look = kf(f, K, P.map((p) => p[1]));
  const shots = [
    { src: ui("a_overview"), at: 0 }, { src: ui("a_bloggers_pending"), at: 154 }, { src: ui("a_groups"), at: 220 },
    { src: ui("a_campaign_form"), at: 256 }, { src: ui("a_messages"), at: 292 }, { src: ui("a_reservations"), at: 334 },
  ];
  const hl = (a: number, b: number) => pr(f, a, a + 10) * (1 - pr(f, b, b + 8));
  return (<AbsoluteFill style={{ background: "#0a0806" }}>
    <Canvas3D>
      <Env fog={[8, 28]} envI={1.1} />
      <Cam pos={pos} look={look} />
      <ambientLight intensity={0.25} />
      <spotLight position={[2, 6, 5]} angle={0.6} penumbra={1} intensity={60} color="#ffe6b5" />
      <Glow position={[0, 0, -2.2]} scale={10} opacity={0.3} />
      <group rotation={[0, 0, 0]}>
        <Display shots={shots}>
          <Highlight sw={DW} sh={DH} box={[0.2, 0.185, 0.985, 0.235]} on={hl(170, 198)} />
          <Highlight sw={DW} sh={DH} box={[0.905, 0.185, 0.985, 0.235]} on={hl(200, 222)} />
          <Highlight sw={DW} sh={DH} box={[0.185, 0.13, 0.38, 0.33]} on={hl(232, 256)} />
          <Highlight sw={DW} sh={DH} box={[0.25, 0.46, 0.76, 0.59]} on={hl(268, 292)} />
          <Highlight sw={DW} sh={DH} box={[0.195, 0.17, 0.69, 0.43]} on={hl(302, 330)} />
          <Highlight sw={DW} sh={DH} box={[0.19, 0.405, 0.985, 0.46]} on={hl(346, 386)} />
        </Display>
      </group>
      <Floor y={-1.7} />
      <Dust n={200} />
      <FX dof={2} bloom={0.45} focus={0.015} />
    </Canvas3D>
    <Eyebrow text="ADMIN DASHBOARD" at={16} out={140} top="9%" />
    <Kinetic text="Complete control." at={110} out={150} top="12%" size={86} />
    <Chip text="Applications" at={160} out={196} />
    <Chip text="Approve bloggers" at={198} out={224} icon="✓" />
    <Chip text="Groups" at={226} out={260} icon="👥" />
    <Chip text="Campaigns" at={262} out={296} icon="✨" />
    <Chip text="WhatsApp invitations" at={298} out={338} icon="📢" />
    <Chip text="Reservations" at={340} out={400} icon="📅" />
  </AbsoluteFill>);
};

/* ======================= S6 · Blogger app ======================= */
export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const inP = pr(f, 0, 50);
  const ry = mix(-1.1, -0.18, inP) + Math.sin(f * 0.02) * 0.08 + pr(f, 150, 230) * 0.32 - pr(f, 230, 300) * 0.22;
  const pos = kf(f, [0, 120, 200, 310], [[0.4, 0.2, 8.0], [0.1, 0.1, 6.6], [-0.3, -0.2, 6.1], [0.2, 0.1, 6.8]]);
  const shots = [
    { src: ui("b_signin"), at: 0 }, { src: ui("b_register"), at: 108 }, { src: ui("b_home"), at: 142 },
    { src: ui("b_sheet_time"), at: 182 }, { src: ui("b_confirmed"), at: 222 }, { src: ui("b_bookings"), at: 258 },
  ];
  return (<AbsoluteFill style={{ background: "#0a0806" }}>
    <Canvas3D>
      <Env fog={[7, 24]} envI={1.2} />
      <Cam pos={pos} look={[0, 0, 0]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[-3, 5, 5]} angle={0.6} penumbra={1} intensity={70} color="#ffe6b5" />
      <pointLight position={[3, -1, 3]} intensity={18} color="#ffd38a" />
      <Glow position={[0.4, 0.2, -2.4]} scale={8} opacity={0.38} />
      <group rotation={[0.05, ry, 0.02]} position={[0, (1 - inP) * -0.6, 0]}><Phone shots={shots} /></group>
      <group position={[-2.1, 0.7, -3.4]} rotation={[0.1, 0.5, 0.05]}><Phone shots={[{ src: ui("b_waitlist"), at: 0 }]} h={3} /></group>
      <group position={[2.3, -0.4, -4.2]} rotation={[0.05, -0.55, -0.04]}><Phone shots={[{ src: ui("b_home"), at: 0 }]} h={3} /></group>
      <Floor y={-2.0} />
      <Dust n={220} />
      <FX dof={4} bloom={0.45} focus={0.012} />
    </Canvas3D>
    <Eyebrow text="THE BLOGGER APP" at={14} out={104} top="8%" />
    <Chip text="Register" at={112} out={144} icon="📝" />
    <Chip text="Receive invitations" at={146} out={184} icon="🎟️" />
    <Chip text="Choose a time" at={186} out={224} icon="🕑" />
    <Chip text="Manage bookings" at={226} out={260} icon="📅" />
    <Chip text="Upcoming visits" at={262} out={330} icon="📍" />
  </AbsoluteFill>);
};

/* ======================= S7 · The journey ======================= */
const NODES = [
  { img: "j_apply", label: "Apply", w: 1.45 }, { img: "j_approve", label: "Approve", w: 1.75 }, { img: "j_invite", label: "Invite", w: 1.25 },
  { img: "j_booked", label: "Confirm", w: 1.45 }, { img: "j_remind", label: "Remind", w: 1.45 }, { img: "j_wait", label: "Waitlist", w: 1.35 }, { img: "j_attend", label: "Attend", w: 1.75 },
];
const NP = NODES.map((_, i) => new THREE.Vector3(i % 2 ? 0.7 : -0.7, Math.sin(i * 1.3) * 0.3, -i * 7));
const Card: React.FC<{ img: string; label: string; w: number; p: number; i: number }> = ({ img, label, w, p, i }) => {
  const tex = useTex(ui(img));
  const im = tex.image as HTMLImageElement; const h = w * (im.height / im.width);
  const geo = useMemo(() => roundedPlane(w, h, 0.07), [w, h]);
  const lab = useCanvasTex(640, 160, (g) => { g.font = "600 84px Inter"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#F3D98E"; g.fillText(label, 320, 84); }, [label]);
  const num = useCanvasTex(160, 160, (g) => { g.fillStyle = "#C2941B"; g.beginPath(); g.arc(80, 80, 76, 0, Math.PI * 2); g.fill(); g.font = "700 78px Inter"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#1a1408"; g.fillText(String(i + 1), 80, 86); }, [i]);
  const s = 0.6 + 0.4 * p;
  return (<group scale={[s, s, s]} rotation={[0, (i % 2 ? -1 : 1) * 0.12, 0]}>
    <RoundedBox args={[w + 0.08, h + 0.08, 0.05]} radius={0.08} smoothness={5} position={[0, 0, -0.04]}><meshPhysicalMaterial color="#fbf7ee" roughness={0.15} clearcoat={1} transparent opacity={p} /></RoundedBox>
    <mesh geometry={geo}><meshBasicMaterial map={tex} toneMapped={false} transparent opacity={p} color={new THREE.Color(0.9, 0.9, 0.9)} /></mesh>
    <mesh position={[0, -h / 2 - 0.36, 0]}><planeGeometry args={[1.6, 0.4]} /><meshBasicMaterial map={lab} transparent opacity={p} toneMapped={false} /></mesh>
    <mesh position={[-w / 2 + 0.05, h / 2 - 0.05, 0.03]}><planeGeometry args={[0.32, 0.32]} /><meshBasicMaterial map={num} transparent opacity={p} toneMapped={false} /></mesh>
  </group>);
};
export const S7: React.FC = () => {
  const f = useCurrentFrame();
  const T = [18, 62, 104, 196, 230, 262, 296];
  const curve = useMemo(() => new THREE.CatmullRomCurve3(NP.map((v) => new THREE.Vector3(v.x * 0.9, v.y - 1.55, v.z)), false, "catmullrom", 0.5), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 600, 0.03, 10, false), [curve]);
  const pathP = interpolate(f, [0, ...T, 330], [0, ...T.map((_, i) => (i + 0.2) / 6.2), 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  tube.setDrawRange(0, Math.floor(tube.index!.count * Math.min(1, pathP)));
  const camKeys = [0, ...T, 330, 384];
  const camPos = [[-2.2, 1.4, 8.4], ...NP.map((v, i) => [v.x * 0.35 + (i % 2 ? -0.6 : 0.6), v.y + 0.15, v.z + 5.0]), [0.6, 8, 12], [0.4, 9.5, 15]];
  const camLook = [[-0.7, 0, 0], ...NP.map((v) => [v.x, v.y, v.z]), [0, -1, -22], [0, -1, -22]];
  const pos = kf(f, camKeys, camPos); const look = kf(f, camKeys, camLook);
  return (<AbsoluteFill style={{ background: "#0a0806" }}>
    <Canvas3D>
      <Env fog={[12, 60]} envI={1} />
      <Cam pos={pos} look={look} />
      <ambientLight intensity={0.3} />
      <spotLight position={[0, 8, 4]} angle={0.9} penumbra={1} intensity={70} color="#ffe6b5" />
      <mesh geometry={tube}><meshBasicMaterial color={new THREE.Color("#F3C95E").multiplyScalar(2.4)} toneMapped={false} /></mesh>
      {NODES.map((n, i) => {
        const p = pr(f, T[i] - 18, T[i] + 4);
        const v = NP[i];
        const away = i < 6 ? pr(f, T[i + 1] - 26, T[i + 1] - 4) * (1 - pr(f, 310, 340)) : 0;
        return (<group key={i} position={[v.x + (i % 2 ? 1 : -1) * away * 2.4, v.y + 0.1, v.z]}>
          <Card {...n} p={p} i={i} />
          <mesh position={[0 - v.x * 0.1, -1.55, 0]}><sphereGeometry args={[0.09 + 0.05 * p, 24, 24]} /><meshBasicMaterial color={new THREE.Color("#fff1c4").multiplyScalar(3)} toneMapped={false} /></mesh>
          <Glow position={[-v.x * 0.1, -1.55, 0.05]} scale={1.2 * p + 0.01} opacity={0.8} color={GOLD_L} />
        </group>);
      })}
      <Floor y={-1.9} />
      <Dust n={320} spread={[12, 12, 60]} />
      <FX dof={1.6} bloom={0.6} focus={0.02} />
    </Canvas3D>
    <Kinetic text="Every step, connected." at={150} out={214} top="10%" size={80} />
    <Kinetic text="All in one place." at={326} top="10%" size={84} gold />
  </AbsoluteFill>);
};

/* ======================= S8 · The bigger picture ======================= */
const Tile: React.FC<{ name: string; position: [number, number, number]; s: number }> = ({ name, position, s }) => {
  const tex = useTex(staticFile(`${name}.png`));
  const geo = useMemo(() => roundedPlane(0.78, 0.78, 0.16), []);
  return (<group position={position} scale={[s, s, s]}>
    <RoundedBox args={[0.92, 0.92, 0.06]} radius={0.18} smoothness={5} position={[0, 0, -0.04]}><meshPhysicalMaterial color="#f5efe3" roughness={0.12} clearcoat={1} /></RoundedBox>
    <mesh geometry={geo}><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
  </group>);
};
const Beam: React.FC<{ from: THREE.Vector3; to: THREE.Vector3; p: number }> = ({ from, to, p }) => {
  if (p <= 0.01) return null;
  const end = from.clone().lerp(to, p); const mid = from.clone().add(end).multiplyScalar(0.5); const len = from.distanceTo(end);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(from).normalize());
  return (<mesh position={mid} quaternion={q}><cylinderGeometry args={[0.012, 0.012, len, 8]} /><meshBasicMaterial color={new THREE.Color("#F3C95E").multiplyScalar(2)} toneMapped={false} transparent opacity={0.85} /></mesh>);
};
export const S8: React.FC = () => {
  const f = useCurrentFrame();
  const core = new THREE.Vector3(0, 0.2, 0);
  const rot = f * 0.006;
  const beams = pr(f, 140, 196);
  const grow = pr(f, 296, 374);
  const feeOut = pr(f, 236, 254), sheetOut = pr(f, 280, 298);
  const pos = kf(f, [0, 150, 296, 374], [[0, 0.8, 9.2], [0.8, 1.6, 8.4], [-0.6, 1.0, 8.0], [0, 2.6, 10.6]]);
  const nodes = useMemo(() => Array.from({ length: 90 }).map((_, i) => { const y = 1 - (i / 89) * 2; const r = Math.sqrt(1 - y * y); const th = i * 2.39996; return new THREE.Vector3(Math.cos(th) * r * 3.4, y * 3.4 * 0.8 + 0.2, Math.sin(th) * r * 3.4); }), []);
  return (<AbsoluteFill style={{ background: "#0a0806" }}>
    <Canvas3D>
      <Env fog={[9, 30]} envI={1} />
      <Cam pos={pos} look={[0, 0.2, 0]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0.2, 0]} intensity={30} color="#ffcf6a" />
      <spotLight position={[0, 7, 5]} angle={0.7} penumbra={1} intensity={60} color="#ffe6b5" />
      {/* core */}
      <mesh position={core}><sphereGeometry args={[0.34 + Math.sin(f * 0.08) * 0.01, 48, 48]} /><meshBasicMaterial color={new THREE.Color("#ffe8a6").multiplyScalar(3.2)} toneMapped={false} /></mesh>
      <mesh position={core}><sphereGeometry args={[0.95, 64, 64]} /><meshPhysicalMaterial color="#fff3d6" transmission={1} thickness={0.6} roughness={0.06} ior={1.35} transparent opacity={0.45} metalness={0} clearcoat={1} /></mesh>
      {[0, 1, 2].map((k) => (<mesh key={k} position={core} rotation={[0.9 + k * 0.7 + rot * (k + 1), rot * 2 + k, 0.3 * k]}><torusGeometry args={[1.22 + k * 0.16, 0.008, 8, 128]} /><meshBasicMaterial color={new THREE.Color("#E9C46A").multiplyScalar(2)} toneMapped={false} /></mesh>))}
      <Glow position={[0, 0.2, -0.5]} scale={6} opacity={0.6} color={GOLD} />
      {/* brands */}
      {BRANDS.map((b, i) => { const a = (i / BRANDS.length) * Math.PI * 2 + rot; const p = pr(f, 120 + i * 5, 150 + i * 5);
        const v = new THREE.Vector3(Math.cos(a) * 2.7, 0.2 + Math.sin(a * 2) * 0.35 + (i % 2 ? 0.6 : -0.6), Math.sin(a) * 2.2);
        return (<group key={b}><Tile name={b} position={[v.x, v.y, v.z]} s={0.85 * p} /><Beam from={v} to={core} p={beams * p} /></group>); })}
      {/* bloggers flowing into the database */}
      {Array.from({ length: 36 }).map((_, i) => { const t = lin(f, 10 + i * 2.2, 70 + i * 2.2); if (t <= 0 || t >= 1) return null; const a = i * 1.7; const st = new THREE.Vector3(Math.cos(a) * 6, Math.sin(a * 1.3) * 4, Math.sin(a) * 4 - 2); const p = st.lerp(core, t * t);
        return <mesh key={i} position={p}><sphereGeometry args={[0.06, 12, 12]} /><meshBasicMaterial color={new THREE.Color("#fff1c4").multiplyScalar(3)} toneMapped={false} /></mesh>; })}
      {/* the network grows */}
      {nodes.map((n, i) => { const p = pr(f, 300 + i * 0.7, 316 + i * 0.7); if (p <= 0) return null; return (<group key={i}><mesh position={n}><sphereGeometry args={[0.05 * p, 12, 12]} /><meshBasicMaterial color={new THREE.Color("#F3C95E").multiplyScalar(2.5)} toneMapped={false} /></mesh>{i % 3 === 0 && <Beam from={n} to={core} p={p * 0.999} />}</group>); })}
      {/* what goes away */}
      {f > 200 && f < 262 && <group position={[0, -1.6, 2.2]} scale={[0.5 * (1 - feeOut), 0.5 * (1 - feeOut), 0.5]}>
        <Center><Text3D font={staticFile("film/helvetiker_bold.typeface.json")} size={0.8} height={0.2} bevelEnabled bevelSize={0.02} bevelThickness={0.03}>1,500 KD<meshPhysicalMaterial color="#d2685a" metalness={1} roughness={0.2} transparent opacity={pr(f, 204, 216) * (1 - feeOut)} /></Text3D></Center>
      </group>}
      <Floor y={-3.4} />
      <Dust n={260} />
      <FX bloom={0.8} />
    </Canvas3D>
    <SheetFade f={f} out={sheetOut} />
    <Kinetic text="Built once." at={60} out={130} top="10%" size={90} />
    <Kinetic text="Reused across every brand." at={136} out={200} top="10%" size={74} />
    <Kinetic text="No repeated agency fees." at={206} out={246} top="10%" size={72} />
    <Kinetic text="No scattered spreadsheets." at={250} out={290} top="10%" size={72} />
    <Kinetic text="One network that grows." at={296} top="10%" size={80} gold />
  </AbsoluteFill>);
};
const SheetFade: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  const p = pr(f, 248, 262) * (1 - out);
  if (p <= 0) return null;
  return (<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
    <div style={{ marginTop: 560, display: "grid", gridTemplateColumns: "repeat(5, 110px)", gap: 6, opacity: p, filter: `blur(${out * 14}px)`, transform: `scale(${1 + out * 0.3}) rotate(${out * 8}deg)` }}>
      {Array.from({ length: 25 }).map((_, i) => <div key={i} style={{ height: 38, background: i < 5 ? "#e4e6e2" : "#f6f6f3", borderRadius: 4, transform: `translate(${Math.sin(i * 3.1) * out * 220}px, ${Math.cos(i * 2.3) * out * 220}px)`, opacity: 0.9 }} />)}
    </div>
  </AbsoluteFill>);
};

/* ======================= S9 · Conclusion ======================= */
export const S9: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = pr(f, 150, 196);
  const pos = kf(f, [0, 150, 251], [[-1.2, 0.5, 7.6], [0.9, 0.3, 6.6], [0.2, 1.6, 9.4]]);
  return (<AbsoluteFill style={{ background: "#0a0806" }}>
    <Canvas3D>
      <Env fog={[8, 26]} envI={1.2} />
      <Cam pos={pos} look={[0, -0.1, 0]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[0, 7, 4]} angle={0.6} penumbra={1} intensity={80} color="#ffe6b5" />
      <Glow position={[0, 0, -3]} scale={11} opacity={0.35} />
      <group position={[-0.55, 0.55, -0.8]} rotation={[0, 0.28, 0]} scale={[0.85, 0.85, 0.85]}><Display shots={[{ src: ui("a_reports"), at: 0 }]} /></group>
      <group position={[1.05, -0.55, 0.7]} rotation={[0.04, -0.32, 0.03]}><Phone shots={[{ src: ui("b_bookings"), at: 0 }]} h={2.5} /></group>
      <Floor y={-1.85} />
      <Dust n={240} />
      <FX dof={2} bloom={0.55} focus={0.02} />
    </Canvas3D>
    <AbsoluteFill style={{ background: "#070504", opacity: reveal * 0.82 }} />
    <Kinetic text="Less manual work." at={10} out={56} top="10%" size={86} />
    <Kinetic text="More control." at={58} out={100} top="10%" size={86} />
    <Kinetic text="A network we own." at={102} out={146} top="10%" size={86} gold />
    <Final reveal={reveal} f={f} />
  </AbsoluteFill>);
};
const Final: React.FC<{ reveal: number; f: number }> = ({ reveal, f }) => {
  if (reveal <= 0) return null;
  const t = pr(f, 160, 210), s = pr(f, 176, 226), sh = interpolate(f, [170, 250], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
    <Img src={staticFile("mnh_mark.png")} style={{ width: 150, opacity: t, transform: `translateY(${(1 - t) * 30}px)`, filter: `drop-shadow(0 0 40px rgba(233,196,106,${0.5 * t}))`, marginBottom: 46 }} />
    <div style={{ fontFamily: "Inter", fontWeight: 600, letterSpacing: "0.38em", fontSize: 30, color: "#E9C46A", opacity: t }}>THE</div>
    <div style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: 118, lineHeight: 1.02, textAlign: "center", marginTop: 14, opacity: s, transform: `scale(${0.94 + 0.06 * s})`, filter: `blur(${(1 - s) * 12}px)`,
      background: `linear-gradient(100deg, #a67c12 ${sh - 30}%, #fff6d8 ${sh}%, #E9C46A ${sh + 12}%, #a67c12 ${sh + 40}%)`, WebkitBackgroundClip: "text", color: "transparent" }}>Microblogger<br />Dashboard</div>
    <div style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 32, color: "rgba(255,255,255,.7)", marginTop: 36, opacity: pr(f, 200, 226) }}>MNH Al-Hajery</div>
  </AbsoluteFill>);
};
