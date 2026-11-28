import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Canvas3D, FX, Env, Cam, Lights, IPhone, IPad, Card, Dust, Glow, Blob, Tap, Ring, phoneScreen, padScreen, ui, logo, kf, k1, pr, mix, back, easeIO, rnd, BRANDS, GOLD_L, GOLD, V3 } from "./kit";
import { Person, POSE, BLOGGER, lerpPose, Pose } from "./chars";
import { M, SC } from "./timing";

const serif = "Fraunces, Georgia, serif";

/* ---------- overlays ---------- */
const Title: React.FC<{ f: number; at: number; out: number; text: string; top?: string; size?: number; gold?: boolean }> = ({ f, at, out, text, top = "9%", size = 76, gold }) => {
  const o = pr(f, at, at + 14) * (1 - pr(f, out, out + 12));
  if (o <= 0) return null;
  return (<AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: top, pointerEvents: "none" }}>
    <div style={{ width: "88%", textAlign: "center", fontFamily: serif, fontWeight: 600, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.015em", opacity: o, transform: `translateY(${(1 - o) * 26}px)`, filter: `blur(${(1 - o) * 6}px)`,
      ...(gold ? { backgroundImage: "linear-gradient(180deg,#fff3c4 0%,#E9C46A 45%,#a67c12 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" } : { color: "#fff", textShadow: "0 6px 40px rgba(0,0,0,.5)" }) }}>{text}</div>
  </AbsoluteFill>);
};
const Chip: React.FC<{ f: number; at: number; out: number; text: string; top: string; icon?: string }> = ({ f, at, out, text, top, icon }) => {
  const p = pr(f, at, at + 12, back), o = 1 - pr(f, out, out + 10);
  if (f < at || o <= 0) return null;
  return (<AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: top, pointerEvents: "none" }}>
    <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 30px", borderRadius: 999, background: "rgba(20,16,10,.66)", border: "1.5px solid rgba(233,196,106,.6)", backdropFilter: "blur(14px)", boxShadow: "0 18px 50px rgba(0,0,0,.45)",
      color: "#fff", fontFamily: "Inter", fontWeight: 600, fontSize: 38, opacity: Math.min(1, p) * o, transform: `translateY(${(1 - p) * 24}px) scale(${0.92 + 0.08 * p})` }}>
      {icon ? <span>{icon}</span> : <span style={{ width: 14, height: 14, borderRadius: 99, background: "#E9C46A", boxShadow: "0 0 18px #E9C46A" }} />}{text}
    </div>
  </AbsoluteFill>);
};

/* ---------- the blogger network: a glowing sphere that keeps growing ---------- */
const fib = (n: number, r: number) => Array.from({ length: n }, (_, i) => { const y = 1 - (i / (n - 1)) * 2; const rad = Math.sqrt(1 - y * y); const th = i * 2.39996; return new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r); });
export const Network: React.FC<{ f: number; grow: number; core?: number; brands?: number; spin?: number; scale?: number; newcomer?: number }> = ({ f, grow, core = 0, brands = 0, spin = 0, scale = 1, newcomer = 0 }) => {
  const N = 140; const pts = useMemo(() => fib(N, 1.25), []);
  const order = useMemo(() => pts.map((_, i) => i).sort((a, b) => rnd(a * 3.3) - rnd(b * 3.3)), [pts]);
  const vis = Math.floor(mix(60, N, grow));
  const shown = new Set(order.slice(0, vis));
  const edges = useMemo(() => { const e: [number, number][] = []; pts.forEach((p, i) => { const d = pts.map((q, j) => [p.distanceTo(q), j] as [number, number]).sort((a, b) => a[0] - b[0]); for (let k = 1; k <= 3; k++) if (i < d[k][1]) e.push([i, d[k][1]]); }); return e; }, [pts]);
  const lineArr = useMemo(() => new Float32Array(edges.length * 6), [edges]);
  let n = 0; edges.forEach(([a, b]) => { if (shown.has(a) && shown.has(b)) { lineArr.set([pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z], n * 6); n++; } });
  const lineGeo = useMemo(() => new THREE.BufferGeometry(), []);
  lineGeo.setAttribute("position", new THREE.BufferAttribute(lineArr.slice(0, n * 6), 3));
  const nodeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(GOLD_L).multiplyScalar(1.7), toneMapped: false }), []);
  return (<group scale={scale} rotation={[0.25, spin, 0]}>
    <lineSegments geometry={lineGeo}><lineBasicMaterial color={new THREE.Color(GOLD_L).multiplyScalar(1.1)} transparent opacity={0.35} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} /></lineSegments>
    {order.slice(0, vis).map((i, k) => {
      const born = k >= 60 ? pr(grow * (N - 60) - (k - 60), 0, 1, back) : 1;
      return <mesh key={i} position={pts[i]} material={nodeMat} scale={0.035 * born * (1 + 0.25 * Math.sin(f * 0.1 + i))}><sphereGeometry args={[1, 10, 10]} /></mesh>;
    })}
    {/* Sara: the newest node */}
    {newcomer > 0 && <mesh position={pts[order[60]].clone().multiplyScalar(mix(2.6, 1, newcomer))} scale={0.075}><sphereGeometry args={[1, 18, 18]} /><meshBasicMaterial color={new THREE.Color("#fff2c8").multiplyScalar(2.4)} toneMapped={false} /></mesh>}
    {/* glass core with the brand mark */}
    <mesh scale={0.62}><sphereGeometry args={[1, 48, 48]} /><meshPhysicalMaterial transmission={0.9} roughness={0.08} thickness={0.6} color="#fff4d8" transparent opacity={0.5} /></mesh>
    {core > 0 && <group rotation={[-0.25, -spin, 0]}><Card src={staticFile("film2/mnh_mark_hd.png")} w={0.55} op={core} scale={mix(0.6, 1, core)} order={90} /></group>}
    <Glow position={[0, 0, -0.3]} scale={3.2} opacity={0.25 + core * 0.25} />
    {BRANDS.map((b, i) => {
      const a = i / 7 * Math.PI * 2 + f * 0.012; const t = pr(brands, i / 9, i / 9 + 0.3, back);
      if (t <= 0) return null;
      const p: V3 = [Math.cos(a) * 2.05, Math.sin(i * 1.7) * 0.3 + 0.15, Math.sin(a) * 1.6 - 0.2];
      return (<group key={b} position={p} rotation={[-0.25, -spin - a + Math.PI / 2, 0]}>
        <Card src={logo(b)} w={0.62} r={0.12} scale={t} order={95 + i} />
      </group>);
    })}
  </group>);
};

/* =============== S5: one link, they apply, approve in one tap, the network grows =============== */
export const S5: React.FC = () => {
  const f = useCurrentFrame() + SC.s5;
  const { sw, sh } = phoneScreen(4); const pad = padScreen(3.5);
  const phoneShots = [
    { src: ui("m_ig_new1"), at: 0 }, { src: ui("m_ig_new2"), at: 1292 }, { src: ui("m_ig_new3"), at: 1310 },
    { src: ui("p_reg"), at: 1356 }, { src: ui("p_reg_fill"), at: 1376 }, { src: ui("p_reg_submit"), at: 1396 }, { src: ui("p_reg_done"), at: 1414 }, { src: ui("m_wa1"), at: 1502 },
  ];
  const padShots = [{ src: ui("t_pending"), at: 0 }, { src: ui("t_sara"), at: 1468 }, { src: ui("t_sara_ok"), at: 1496 }];
  // phases
  const intro = 1 - pr(f, 1270, 1290, easeIO); // Sara establishing shot
  const toPad = pr(f, 1416, 1440, easeIO);
  const toNet = pr(f, 1545, 1585, easeIO);
  const fly = pr(f, 1418, 1446, easeIO);
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0d0a07" envI={0.7} /><Lights k={1.2} />
    {intro > 0.001 ? (<>
      <Cam pos={kf(f, [1250, 1290], [[0.35, 1.45, 3.1], [0.1, 1.42, 1.6]])} look={kf(f, [1250, 1290], [[0, 1.2, 0], [0, 1.32, 0.1]])} />
      <SaraSet f={f} pose={{ ...POSE.stand, ...POSE.holdPhone }} phone={[{ src: ui("m_ig_new1"), at: 0 }]} />
    </>) : (<>
      <Cam pos={[0.15 * Math.sin(f * 0.01), 0.05, mix(8.8, 12, toNet)]} look={[0, 0, 0]} />
      <Glow position={[0, 0.3, -3]} scale={9} opacity={0.3} />
      <Dust n={150} spread={[10, 12, 6]} center={[0, 0, -4]} />
      {toNet < 1 && <group position={[mix(0, -0.78, toPad), mix(0, -1.25, toPad), mix(0, 1.6, toPad)]} rotation={[0, mix(-0.1 + 0.06 * Math.sin(f * 0.015), 0.3, toPad), 0]} scale={mix(1, 0.42, toPad) * (1 - toNet)}>
        <IPhone h={4} shots={phoneShots} sheen={f * 0.004} t0={SC.s5}>
          <Tap sw={sw} sh={sh} x={0.6} y={0.6} at={1350} t0={SC.s5} />
          <Tap sw={sw} sh={sh} x={0.5} y={0.92} at={1408} t0={SC.s5} />
        </IPhone>
      </group>}
      {toPad > 0 && toNet < 1 && <group position={[mix(3.5, 0.12, toPad), 0.45, -0.4]} rotation={[0, mix(-0.5, -0.1, toPad), 0]} scale={1 - toNet}>
        <IPad h={3.5} shots={padShots} sheen={f * 0.003} t0={SC.s5}>
          <Ring sw={pad.sw} sh={pad.sh} box={[0.32, 0.24, 0.97, 0.3]} on={pr(f, 1440, 1452) * (1 - pr(f, 1464, 1470))} />
          <Tap sw={pad.sw} sh={pad.sh} x={0.6} y={0.27} at={1462} t0={SC.s5} />
          <Tap sw={pad.sw} sh={pad.sh} x={0.413} y={0.213} at={1490} t0={SC.s5} />
          <Ring sw={pad.sw} sh={pad.sh} box={[0.33, 0.1, 0.98, 0.25]} on={pr(f, 1498, 1510) * (1 - pr(f, 1535, 1545))} />
        </IPad>
      </group>}
      {/* Sara's application flies from phone to dashboard */}
      {fly > 0 && fly < 1 && <mesh position={[mix(-1.2, 0.4, fly), mix(-0.2, 0.9, fly) + Math.sin(fly * Math.PI) * 0.8, mix(0.8, -0.3, fly)]} scale={0.09 * Math.sin(fly * Math.PI) + 0.02}><sphereGeometry args={[1, 16, 16]} /><meshBasicMaterial color={new THREE.Color("#fff2c8").multiplyScalar(2.5)} toneMapped={false} /></mesh>}
      {toNet > 0 && <group position={[0, 0.2, 0]} scale={toNet}>
        <Network f={f} grow={pr(f, M.grows, 1760, easeIO)} core={pr(f, M.own, M.own + 16)} brands={pr(f, M.brands, M.brands + 70, easeIO)} spin={f * 0.004} newcomer={pr(f, 1560, 1590, easeIO)} scale={1.25} />
      </group>}
    </>)}
    <FX bloom={0.55} />
  </Canvas3D>
    <Chip f={f} at={1500} out={1540} text="Sara approved. She can sign in now." top="8%" icon="✅" />
    <Counter f={f} />
  </AbsoluteFill>);
};
const Counter: React.FC<{ f: number }> = ({ f }) => {
  const o = pr(f, M.grows - 6, M.grows + 8) * (1 - pr(f, 1770, 1782));
  if (o <= 0) return null;
  const n = Math.round(interpolate(f, [M.grows, 1760], [61, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO }));
  return (<AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: "9%" }}>
    <div style={{ opacity: o, textAlign: "center", fontFamily: "Inter" }}>
      <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.03em", backgroundImage: "linear-gradient(180deg,#fff3c4 0%,#E9C46A 50%,#a67c12 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
      <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "0.22em", color: "#E9C46A", marginTop: -6 }}>BLOGGERS IN OUR NETWORK</div>
    </div>
  </AbsoluteFill>);
};

/* Sara in a warm, bright lounge */
const SaraSet: React.FC<{ f: number; pose: Pose; phone: { src: string; at: number }[]; sit?: boolean }> = ({ f, pose, phone, sit }) => (<group>
  <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[12, 64]} /><meshPhysicalMaterial color="#2a2018" roughness={0.45} clearcoat={0.5} /></mesh>
  <mesh position={[0, 2.5, -2.5]}><planeGeometry args={[14, 6]} /><meshStandardMaterial color="#1e1610" /></mesh>
  <Glow position={[0.4, 1.7, -2.3]} scale={3.2} opacity={0.4} />
  <Blob position={[0, 0.002, 0]} s={[0.9, 0.7]} />
  {sit && <group position={[0, 0, -0.05]}>
    <mesh position={[0, 0.25, 0]}><boxGeometry args={[1.3, 0.5, 0.62]} /><meshPhysicalMaterial color="#b88a5a" roughness={0.7} sheen={1} sheenColor="#f4d2a6" /></mesh>
    <mesh position={[0, 0.62, -0.26]}><boxGeometry args={[1.3, 0.55, 0.14]} /><meshPhysicalMaterial color="#b88a5a" roughness={0.7} sheen={1} sheenColor="#f4d2a6" /></mesh>
  </group>}
  <Person look={BLOGGER} pose={pose} position={sit ? [0, 0.55, 0.05] : [0, 0.92, 0]}
    rHold={<group position={[-0.03, -0.075, 0.02]} rotation={[-0.15, 0.15, 0]}><group rotation={[0, Math.PI, 0]}><group rotation={[0, Math.PI, 0]}><IPhone h={0.15} shots={phone} island={false} /></group></group></group>} />
  <Dust n={90} spread={[4, 3, 3]} center={[0, 1.5, -1.2]} size={0.03} />
</group>);

/* =============== S6: campaign → WhatsApp invitations =============== */
export const S6: React.FC = () => {
  const f = useCurrentFrame() + SC.s6;
  const pad = padScreen(3.9); const { sw, sh } = phoneScreen(4);
  const out = pr(f, 1898, 1925, easeIO);
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0d0a07" envI={0.7} /><Lights k={1.2} />
    <Cam pos={[0.12 * Math.sin(f * 0.012), 0.05, mix(9.2, 9.8, out)]} look={[0, 0, 0]} />
    <Glow position={[0, 0.3, -3]} scale={9} opacity={0.3} />
    <Dust n={140} spread={[10, 12, 6]} center={[0, 0, -4]} />
    <group position={[mix(0, 0, out), mix(0, 0.9, out), mix(0, -3.2, out)]} rotation={[0, -0.08 + 0.05 * Math.sin(f * 0.02), 0]} scale={1}>
      <IPad h={3.9} shots={[{ src: ui("t_campaigns"), at: 0 }, { src: ui("t_form"), at: 1808 }, { src: ui("t_camp_inv"), at: 1868 }]} sheen={f * 0.003} t0={SC.s6}>
        <Tap sw={pad.sw} sh={pad.sh} x={0.875} y={0.072} at={1800} t0={SC.s6} />
        <Ring sw={pad.sw} sh={pad.sh} box={[0.056, 0.155, 0.494, 0.227]} on={pr(f, 1818, 1828) * (1 - pr(f, 1846, 1852))} />
        <Tap sw={pad.sw} sh={pad.sh} x={0.858} y={0.838} at={1860} t0={SC.s6} />
      </IPad>
    </group>
    {/* invitations fly out as messages to many phones */}
    {out > 0 && [-2, -1, 1, 2].map((k) => (
      <group key={k} position={[k * 1.25, -0.2 - Math.abs(k) * 0.12, mix(-2, -0.6 - Math.abs(k) * 0.5, out)]} rotation={[0, -k * 0.22, 0]} scale={0.6 * out}>
        <IPhone h={4} shots={[{ src: ui("m_wa0x"), at: 0 }, { src: ui("m_wa2"), at: 1905 + Math.abs(k) * 5 }].slice(1)} sheen={f * 0.004} t0={SC.s6} />
      </group>))}
    {out > 0 && <group position={[0, -0.15, mix(-1, 1.3, out)]} rotation={[0, 0.05 * Math.sin(f * 0.02), 0]} scale={0.8 * out}>
      <IPhone h={4} shots={[{ src: ui("m_wa1"), at: 0 }, { src: ui("m_wa2"), at: 1912 }]} sheen={f * 0.004} t0={SC.s6} />
    </group>}
    {out > 0 && Array.from({ length: 26 }).map((_, i) => {
      const t = pr(f, 1898 + i * 1.6, 1925 + i * 1.6, easeIO); if (t <= 0 || t >= 1) return null;
      const tx = (rnd(i) - 0.5) * 6;
      return <mesh key={i} position={[mix(0, tx, t), mix(1.2, -0.2, t) + Math.sin(t * Math.PI) * 0.8, mix(-3, 0.3, t)]} scale={0.05}><sphereGeometry args={[1, 10, 10]} /><meshBasicMaterial color={new THREE.Color("#5dfc9a").multiplyScalar(2)} toneMapped={false} /></mesh>;
    })}
    <FX bloom={0.5} />
  </Canvas3D>
    <Chip f={f} at={1866} out={1896} text="50 invitations sent" top="6%" icon="📨" />
  </AbsoluteFill>);
};

/* =============== S7: Sara books, gets a reminder =============== */
export const S7: React.FC = () => {
  const f = useCurrentFrame() + SC.s7;
  const { sw, sh } = phoneScreen(4);
  const intro = 1 - pr(f, 1990, 2004, easeIO);
  const shots = [{ src: ui("p_home"), at: 0 }, { src: ui("p_sheet_time"), at: 2010 }, { src: ui("p_confirmed"), at: 2048 }, { src: ui("m_lock"), at: 2086 }, { src: ui("m_lock1"), at: 2098 }, { src: ui("p_bookings"), at: 2146 }];
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0d0a07" envI={0.7} /><Lights k={1.2} />
    {intro > 0.001 ? (<>
      <Cam pos={kf(f, [1980, 2004], [[0.7, 1.3, 2.9], [0.3, 1.15, 1.7]])} look={kf(f, [1980, 2004], [[0, 0.9, 0], [0.0, 0.95, 0.2]])} />
      <SaraSet f={f} sit pose={{ ...POSE.sit, ...POSE.holdPhone }} phone={[{ src: ui("p_home"), at: 0 }]} />
    </>) : (<>
      <Cam pos={[0.15 * Math.sin(f * 0.01), 0.05, 8.7]} look={[0, 0, 0]} />
      <Glow position={[0, 0.3, -3]} scale={9} opacity={0.3} />
      <Dust n={150} spread={[10, 12, 6]} center={[0, 0, -4]} />
      <group position={[0, -0.55 * pr(f, 2146, 2160, easeIO), 0]} scale={1 - 0.14 * pr(f, 2146, 2160, easeIO)} rotation={[0.03 * Math.sin(f * 0.02), -0.1 + 0.07 * Math.sin(f * 0.013), 0]}>
        <IPhone h={4} shots={shots} sheen={f * 0.004} t0={SC.s7}>
          <Tap sw={sw} sh={sh} x={0.5} y={0.784} at={2004} t0={SC.s7} />
          <Tap sw={sw} sh={sh} x={0.78} y={0.517} at={2026} t0={SC.s7} />
          <Tap sw={sw} sh={sh} x={0.5} y={0.92} at={2042} t0={SC.s7} />
          <Tap sw={sw} sh={sh} x={0.5} y={0.68} at={2140} t0={SC.s7} />
          <Tap sw={sw} sh={sh} x={0.28} y={0.29} at={2168} t0={SC.s7} />
        </IPhone>
      </group>
    </>)}
    <FX bloom={0.5} />
  </Canvas3D>
    <Chip f={f} at={2092} out={2138} text="Automatic reminder, 24 hours before" top="7%" icon="⏰" />
    <Title f={f} at={2150} out={2228} text="No calls." top="5%" size={74} gold />
    <Title f={f} at={2184} out={2228} text="No chasing." top="13.5%" size={74} gold />
  </AbsoluteFill>);
};

/* =============== S8: control: bookings, visits, no-shows, reports =============== */
export const S8: React.FC = () => {
  const f = useCurrentFrame() + SC.s8;
  const orbit = interpolate(f, [2240, 2420], [-0.35, 0.3]);
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0d0a07" envI={0.75} /><Lights k={1.3} />
    <Cam pos={[Math.sin(orbit) * 8.4, 0.5, Math.cos(orbit) * 8.4]} look={[0.1, -0.05, 0]} />
    <Glow position={[0, 0.4, -3.5]} scale={10} opacity={0.32} />
    <Dust n={150} spread={[12, 12, 6]} center={[0, 0, -4]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.95, 0]}><circleGeometry args={[3.4, 96]} /><meshPhysicalMaterial color="#17120d" metalness={0.6} roughness={0.25} clearcoat={1} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.94, 0]}><ringGeometry args={[3.35, 3.42, 128]} /><meshBasicMaterial color={new THREE.Color(GOLD_L).multiplyScalar(1.6)} toneMapped={false} /></mesh>
    <group position={[-0.35, 0.35, -0.6]} rotation={[0, 0.12, 0]}>
      <IPad h={3.7} shots={[{ src: ui("t_res"), at: 0 }, { src: ui("t_reports"), at: 2354 }]} sheen={f * 0.003} t0={SC.s8} />
    </group>
    <group position={[0.85, -1.05, 1.2]} rotation={[0, -0.25, 0]}>
      <IPhone h={2.3} shots={[{ src: ui("p_bookings"), at: 0 }]} sheen={f * 0.004} t0={SC.s8} />
    </group>
    <FX bloom={0.5} />
  </Canvas3D></AbsoluteFill>);
};

/* =============== S9: no more agency fees → end card =============== */
export const S9: React.FC = () => {
  const f = useCurrentFrame() + SC.s9;
  const strike = pr(f, 2452, 2470, easeIO);
  const net = pr(f, 2488, 2520, easeIO) * (1 - pr(f, 2560, 2590, easeIO));
  const end = pr(f, 2570, 2610, easeIO);
  return (<AbsoluteFill><Canvas3D fov={30}>
    <Env bg="#0b0806" envI={0.6} /><Lights k={1.1} />
    <Cam pos={[0, 0.1, mix(9, 8, net)]} look={[0, 0, 0]} />
    <Glow position={[0, 0.2, -3]} scale={10} opacity={0.3 + end * 0.15} />
    <Dust n={170} spread={[10, 14, 6]} center={[0, 0, -3]} />
    {net > 0 && <group scale={net} position={[0, -0.3, 0]}><Network f={f} grow={pr(f, 2488, 2560)} core={1} brands={1} spin={f * 0.005} scale={1.2} /></group>}
    {end > 0 && <group position={[0, -2.2, -2]} scale={end}>
      <group position={[-1.1, 0, 0]} rotation={[0, 0.3, 0]}><IPad h={3.2} shots={[{ src: ui("t_overview"), at: 0 }]} /></group>
      <group position={[1.25, -0.2, 0.5]} rotation={[0, -0.3, 0]}><IPhone h={2.4} shots={[{ src: ui("p_home"), at: 0 }]} /></group>
    </group>}
    <FX bloom={0.55} />
  </Canvas3D>
    {f < 2492 && <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: pr(f, 2420, 2436) * (1 - pr(f, 2482, 2492)) }}>
      <div style={{ textAlign: "center", fontFamily: "Inter" }}>
        <div style={{ position: "relative", display: "inline-block", fontSize: 64, fontWeight: 600, color: "rgba(255,255,255,.85)" }}>Agency fees
          <div style={{ position: "absolute", left: -10, top: "52%", height: 7, borderRadius: 4, width: `calc(${strike * 100}% + 20px)`, background: "#ff4d3d", boxShadow: "0 0 18px #ff4d3d" }} /></div>
        <div style={{ position: "relative", fontSize: 150, fontWeight: 800, letterSpacing: "-0.04em", marginTop: 10, color: "#fff" }}>
          <span style={{ opacity: 1 - strike * 0.75, textDecoration: "none" }}>1,500 KD</span>
          <div style={{ position: "absolute", left: "-3%", top: "50%", height: 12, borderRadius: 6, width: `${strike * 106}%`, background: "#ff4d3d", boxShadow: "0 0 24px #ff4d3d" }} />
        </div>
        <div style={{ fontSize: 170, fontWeight: 800, letterSpacing: "-0.04em", marginTop: -10, opacity: pr(f, 2464, 2476), transform: `scale(${0.8 + 0.2 * pr(f, 2464, 2478, back)})`, backgroundImage: "linear-gradient(180deg,#fff3c4 0%,#E9C46A 45%,#a67c12 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>0 KD</div>
      </div>
    </AbsoluteFill>}
    {end > 0 && <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: "20%" }}>
      <img src={staticFile("film2/mnh_mark_hd.png")} style={{ width: 150, opacity: end, transform: `translateY(${(1 - end) * 30}px)`, filter: `drop-shadow(0 0 40px rgba(233,196,106,${0.5 * end}))`, marginBottom: 40 }} />
      <div style={{ fontFamily: "Inter", fontWeight: 600, letterSpacing: "0.38em", fontSize: 30, color: "#E9C46A", opacity: end }}>THE</div>
      <div style={{ marginTop: 14, opacity: pr(f, 2584, 2620), transform: `scale(${0.94 + 0.06 * pr(f, 2584, 2620)})` }}>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 118, lineHeight: 1.02, textAlign: "center", padding: "0 10px 12px",
          backgroundImage: `linear-gradient(100deg, #a67c12 ${interpolate(f, [2590, 2680], [-30, 130]) - 30}%, #fff6d8 ${interpolate(f, [2590, 2680], [-30, 130])}%, #E9C46A ${interpolate(f, [2590, 2680], [-30, 130]) + 12}%, #a67c12 ${interpolate(f, [2590, 2680], [-30, 130]) + 40}%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Microblogger<br />Dashboard</div>
      </div>
      <div style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 32, color: "rgba(255,255,255,.72)", marginTop: 26, opacity: pr(f, 2612, 2636), letterSpacing: "0.04em" }}>Built in-house by MNH Al-Hajery</div>
    </AbsoluteFill>}
  </AbsoluteFill>);
};
