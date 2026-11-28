import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ThreeCanvas } from "@remotion/three";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const GOLD = "#C2941B";
export const GOLD_L = "#E9C46A";
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
export const back = Easing.bezier(0.34, 1.56, 0.64, 1);
export const pr = (f: number, a: number, b: number, e = ease) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export type V3 = [number, number, number];
export const kf = (f: number, keys: number[], vals: number[][], e = easeIO): V3 => {
  if (f <= keys[0]) return vals[0] as V3;
  for (let i = 0; i < keys.length - 1; i++) if (f <= keys[i + 1]) { const t = pr(f, keys[i], keys[i + 1], e); return vals[i].map((x, j) => mix(x, vals[i + 1][j], t)) as V3; }
  return vals[vals.length - 1] as V3;
};
/** scalar keyframes */
export const k1 = (f: number, keys: number[], vals: number[], e = easeIO) => kf(f, keys, vals.map((v) => [v, 0, 0]), e)[0];
export const ui = (n: string) => staticFile(`film2/ui/${n}.png`);
export const logo = (n: string) => staticFile(`film2/logos/${n}.png`);
export const BRANDS = ["solia", "khaneen", "delfino", "danish-bakery", "haagen-dazs", "illy", "sutis"];
/** deterministic random */
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const Canvas3D: React.FC<{ children: React.ReactNode; fov?: number }> = ({ children, fov = 30 }) => {
  const { width, height } = useVideoConfig();
  return <ThreeCanvas width={width} height={height} camera={{ fov, near: 0.05, far: 200, position: [0, 0, 10] }} gl={{ antialias: true, powerPreference: "high-performance" }}>{children}</ThreeCanvas>;
};

export const FX: React.FC<{ bloom?: number; vig?: number }> = ({ bloom = 0.6, vig = 0.45 }) => (
  <EffectComposer multisampling={0}>
    <SMAA />
    <Bloom intensity={bloom} luminanceThreshold={1.05} luminanceSmoothing={0.1} mipmapBlur />
    <Vignette darkness={vig} offset={0.3} />
  </EffectComposer>
);

export const Env: React.FC<{ bg?: string; fog?: [number, number]; envI?: number; exposure?: number }> = ({ bg = "#0b0907", fog, envI = 0.9, exposure = 1 }) => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as any).environmentIntensity = envI;
    scene.background = new THREE.Color(bg);
    scene.fog = fog ? new THREE.Fog(bg, fog[0], fog[1]) : null;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
  }, [gl, scene, bg, envI, fog, exposure]);
  return null;
};

export const Cam: React.FC<{ pos: V3; look: V3; fov?: number; roll?: number }> = ({ pos, look, fov, roll = 0 }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.lookAt(...look);
    const c = camera as THREE.PerspectiveCamera;
    if (fov && c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  });
  return null;
};

export const Lights: React.FC<{ k?: number; warm?: string; rim?: string; amb?: number }> = ({ k = 2.2, warm = "#ffe2b0", rim = "#E9C46A", amb = 0.25 }) => (<>
  <ambientLight intensity={amb} />
  <directionalLight position={[3, 5, 4]} intensity={k} color={warm} />
  <directionalLight position={[-4, 2, -3]} intensity={k * 0.8} color={rim} />
  <directionalLight position={[-2, 1, 5]} intensity={k * 0.25} color="#cfd8ff" />
</>);

export const roundedShape = (w: number, h: number, r: number) => {
  const s = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
};
export const roundedPlane = (w: number, h: number, r: number, seg = 12) => {
  const g = new THREE.ShapeGeometry(roundedShape(w, h, r), seg);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
  uv.needsUpdate = true; return g;
};

export const useTex = (src: string) => {
  const t = useTexture(src);
  useMemo(() => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.needsUpdate = true; }, [t]);
  return t;
};

export const useCanvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, deps: unknown[] = []) =>
  useMemo(() => {
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!; draw(g);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

/** Screen content: crossfading real UI captures. Opaque when settled so nothing can show through. */
export type Shot = { src: string; at: number; y?: [number, number, number, number] };
const Layer: React.FC<{ src: string; w: number; h: number; r: number; op: number; order: number; yoff?: number }> = ({ src, w, h, r, op, order, yoff = 0 }) => {
  const tex = useTex(src);
  const geo = useMemo(() => roundedPlane(w, h, r), [w, h, r]);
  const t = useMemo(() => { const c = tex.clone(); c.needsUpdate = true; return c; }, [tex]);
  const img = tex.image as HTMLImageElement; const ar = img.height / img.width; const rep = Math.min(1, (h / w) / ar);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, rep); t.offset.set(0, (1 - rep) * (1 - yoff));
  if (op <= 0.002) return null;
  return (<mesh geometry={geo} renderOrder={order} position={[0, 0, order * 0.0004]}>
    <meshBasicMaterial map={t} toneMapped={false} transparent={op < 0.999} opacity={op} depthWrite={op >= 0.999} color={new THREE.Color(0.96, 0.96, 0.96)} />
  </mesh>);
};
export const Screen: React.FC<{ shots: Shot[]; w: number; h: number; r: number; fade?: number; t0?: number }> = ({ shots, w, h, r, fade = 5, t0 = 0 }) => {
  const f = useCurrentFrame() + t0;
  let cur = 0; shots.forEach((s, i) => { if (f >= s.at) cur = i; });
  return (<group>
    {shots.map((s, i) => {
      if (i < cur - 1 || i > cur) return null;
      const op = i === cur ? (i === 0 ? 1 : pr(f, s.at, s.at + fade, easeIO)) : 1;
      const y = s.y ? interpolate(f, [s.y[0], s.y[1]], [s.y[2], s.y[3]], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO }) : 0;
      return <Layer key={i} src={s.src} w={w} h={h} r={r} op={op} order={10 + i} yoff={y} />;
    })}
  </group>);
};

/** Touch indicator: soft white disc that presses and ripples (fractions of screen from top-left) */
export const Tap: React.FC<{ sw: number; sh: number; x: number; y: number; at: number; t0?: number }> = ({ sw, sh, x, y, at, t0 = 0 }) => {
  const f = useCurrentFrame() + t0;
  const d = f - at; if (d < -8 || d > 22) return null;
  const inP = pr(f, at - 8, at); const out = 1 - pr(f, at + 4, at + 20);
  const ring = pr(f, at, at + 20);
  const s = Math.min(sw * 0.075, 0.12);
  return (<group position={[(x - 0.5) * sw, (0.5 - y) * sh, 0.02]} renderOrder={50}>
    <mesh scale={[s * (1.15 - 0.15 * inP), s * (1.15 - 0.15 * inP), 1]} renderOrder={50}><circleGeometry args={[1, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.55 * inP * out} depthWrite={false} toneMapped={false} /></mesh>
    <mesh scale={[s * (1 + ring * 1.4), s * (1 + ring * 1.4), 1]} renderOrder={51}><ringGeometry args={[0.9, 1, 64]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7 * (1 - ring) * (d >= 0 ? 1 : 0)} depthWrite={false} toneMapped={false} /></mesh>
    <mesh scale={[s * 0.62, s * 0.62, 1]} renderOrder={52}><circleGeometry args={[1, 48]} /><meshBasicMaterial color="#8a8a8a" transparent opacity={0.35 * inP * out} depthWrite={false} toneMapped={false} /></mesh>
  </group>);
};

/** Gold outline that draws attention to a part of a screen; outline only, never a fill */
export const Ring: React.FC<{ sw: number; sh: number; box: [number, number, number, number]; on: number }> = ({ sw, sh, box, on }) => {
  const w = (box[2] - box[0]) * sw, h = (box[3] - box[1]) * sh;
  const cx = (box[0] + box[2]) / 2 * sw - sw / 2, cy = sh / 2 - (box[1] + box[3]) / 2 * sh;
  const geo = useMemo(() => {
    const t = Math.min(w, h) * 0.035 + 0.008, r = Math.min(w, h) * 0.18;
    const o = roundedShape(w + t * 2, h + t * 2, r + t); o.holes.push(new THREE.Path(roundedShape(w, h, r).getPoints(40).reverse()));
    return new THREE.ShapeGeometry(o, 16);
  }, [w, h]);
  if (on <= 0.01) return null;
  const s = 1.08 - 0.08 * on;
  return (<group position={[cx, cy, 0.015]} scale={[s, s, 1]}>
    <mesh geometry={geo} renderOrder={40}><meshBasicMaterial color={new THREE.Color(GOLD_L).multiplyScalar(1.5)} transparent opacity={on} depthWrite={false} toneMapped={false} /></mesh>
  </group>);
};

/* ---------------- devices ---------------- */
const glassSheen = () => {
  const c = document.createElement("canvas"); c.width = 256; c.height = 512; const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 256, 512); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.42, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,.55)"); gr.addColorStop(0.58, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 512); return new THREE.CanvasTexture(c);
};
export const Sheen: React.FC<{ w: number; h: number; r: number; t: number; op?: number }> = ({ w, h, r, t, op = 0.07 }) => {
  const tex = useMemo(glassSheen, []); const geo = useMemo(() => roundedPlane(w, h, r), [w, h, r]);
  tex.wrapS = THREE.RepeatWrapping; tex.offset.set(t, 0);
  return <mesh geometry={geo} position={[0, 0, 0.03]} renderOrder={60}><meshBasicMaterial map={tex} transparent opacity={op} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>;
};

/** iPhone (Pro proportions). Height in units; screen shows real captures. */
export const IPhone: React.FC<{ shots: Shot[]; h?: number; color?: string; children?: React.ReactNode; sheen?: number; island?: boolean; t0?: number }> = ({ shots, h = 4, color = "#9a8c78", children, sheen = 0, island = true, t0 = 0 }) => {
  const w = h * 0.4816; const bez = h * 0.018; const sw = w - bez * 2, sh = sw * (844 / 390);
  const r = w * 0.19; const depth = h * 0.056;
  const front = useMemo(() => roundedPlane(w - h * 0.004, h - h * 0.004, r * 0.97), [w, h, r]);
  return (<group>
    <RoundedBox args={[w, h, depth]} radius={Math.min(r, depth / 2) * 0.98} smoothness={8} position={[0, 0, -depth / 2]}>
      <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.28} clearcoat={0.4} clearcoatRoughness={0.3} />
    </RoundedBox>
    {/* rounded-corner block so the frame reads rounded in plan view */}
    <mesh geometry={front} position={[0, 0, 0.001]}><meshPhysicalMaterial color="#030303" roughness={0.06} metalness={0.1} clearcoat={1} /></mesh>
    <group position={[0, 0, 0.004]}><Screen shots={shots} w={sw} h={sh} r={r * 0.82} t0={t0} /></group>
    {island && <mesh position={[0, sh / 2 - sh * 0.0255, 0.012]} renderOrder={70}><shapeGeometry args={[roundedShape(sw * 0.31, sh * 0.044, sh * 0.022)]} /><meshBasicMaterial color="#000" /></mesh>}
    {/* side buttons */}
    <RoundedBox args={[h * 0.012, h * 0.09, depth * 0.45]} radius={h * 0.005} position={[w / 2 + h * 0.003, h * 0.17, -depth / 2]}><meshPhysicalMaterial color={color} metalness={1} roughness={0.25} /></RoundedBox>
    <RoundedBox args={[h * 0.012, h * 0.06, depth * 0.45]} radius={h * 0.005} position={[-w / 2 - h * 0.003, h * 0.22, -depth / 2]}><meshPhysicalMaterial color={color} metalness={1} roughness={0.25} /></RoundedBox>
    <RoundedBox args={[h * 0.012, h * 0.06, depth * 0.45]} radius={h * 0.005} position={[-w / 2 - h * 0.003, h * 0.14, -depth / 2]}><meshPhysicalMaterial color={color} metalness={1} roughness={0.25} /></RoundedBox>
    <Sheen w={sw} h={sh} r={r * 0.82} t={sheen} />
    <group position={[0, 0, 0.01]}>{children}</group>
  </group>);
};
export const phoneScreen = (h = 4) => { const w = h * 0.4816; const sw = w - h * 0.036; return { sw, sh: sw * (844 / 390) }; };

/** iPad (portrait, 834x1194 content + status bar) */
export const IPad: React.FC<{ shots: Shot[]; h?: number; children?: React.ReactNode; sheen?: number; t0?: number }> = ({ shots, h = 5.2, children, sheen = 0, t0 = 0 }) => {
  const sh = h * 0.94; const sw = sh * (834 / 1194); const bez = h * 0.03; const w = sw + bez * 2; const depth = h * 0.028; const r = h * 0.045;
  const front = useMemo(() => roundedPlane(w - 0.01, h - 0.01, r), [w, h, r]);
  return (<group>
    <RoundedBox args={[w, h, depth]} radius={depth / 2 * 0.98} smoothness={8} position={[0, 0, -depth / 2]}>
      <meshPhysicalMaterial color="#5d5c60" metalness={0.9} roughness={0.32} clearcoat={0.3} />
    </RoundedBox>
    <mesh geometry={front} position={[0, 0, 0.001]}><meshPhysicalMaterial color="#040404" roughness={0.06} metalness={0.1} clearcoat={1} /></mesh>
    <group position={[0, 0, 0.004]}><Screen shots={shots} w={sw} h={sh} r={r * 0.55} t0={t0} /></group>
    <mesh position={[0, h / 2 - bez / 2, 0.006]}><circleGeometry args={[h * 0.006, 24]} /><meshBasicMaterial color="#1a1d26" /></mesh>
    <Sheen w={sw} h={sh} r={r * 0.55} t={sheen} op={0.05} />
    <group position={[0, 0, 0.01]}>{children}</group>
  </group>);
};
export const padScreen = (h = 5.2) => { const sh = h * 0.94; return { sw: sh * (834 / 1194), sh }; };

/** soft contact shadow blob */
export const Blob: React.FC<{ position: V3; s?: [number, number]; op?: number }> = ({ position, s = [1, 1], op = 0.55 }) => {
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!; const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.5, "rgba(0,0,0,.5)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); }, []);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} scale={[s[0], s[1], 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={tex} transparent opacity={op} depthWrite={false} /></mesh>;
};

export const Glow: React.FC<{ position: V3; scale?: number; color?: string; opacity?: number }> = ({ position, scale = 6, color = GOLD, opacity = 0.35 }) => {
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d")!; const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); }, []);
  return (<mesh position={position} scale={[scale, scale, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={tex} color={new THREE.Color(color).multiplyScalar(1.4)} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>);
};

/** drifting bokeh dust */
export const Dust: React.FC<{ n?: number; spread?: V3; center?: V3; color?: string; size?: number; seed?: number }> = ({ n = 180, spread = [12, 14, 8], center = [0, 0, -3], color = GOLD_L, size = 0.05, seed = 1 }) => {
  const f = useCurrentFrame();
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!; const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.4, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); }, []);
  const arr = useMemo(() => new Float32Array(n * 3), [n]);
  for (let i = 0; i < n; i++) {
    const a = rnd(i + seed * 100), b = rnd(i * 3 + seed), c = rnd(i * 7 + seed * 3), sp = 0.3 + rnd(i * 11);
    arr[i * 3] = center[0] + (a - 0.5) * spread[0] + Math.sin(f * 0.012 * sp + i) * 0.2;
    arr[i * 3 + 1] = center[1] + (((b + f * 0.0006 * sp) % 1) - 0.5) * spread[1];
    arr[i * 3 + 2] = center[2] + (c - 0.5) * spread[2];
  }
  return (<points key={f}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[arr, 3]} /></bufferGeometry>
    <pointsMaterial map={tex} color={new THREE.Color(color).multiplyScalar(1.8)} size={size} sizeAttenuation transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
  </points>);
};

/** textured flat card (for banners, logos) */
export const Card: React.FC<{ src: string; w: number; position?: V3; rotation?: V3; scale?: number; op?: number; r?: number; order?: number }> = ({ src, w, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, op = 1, r = 0, order = 0 }) => {
  const tex = useTex(src); const img = tex.image as HTMLImageElement; const h = w * img.height / img.width;
  const geo = useMemo(() => r ? roundedPlane(w, h, r) : new THREE.PlaneGeometry(w, h), [w, h, r]);
  if (op <= 0.002 || scale <= 0.001) return null;
  return <mesh geometry={geo} position={position} rotation={rotation} scale={[scale, scale, scale]} renderOrder={order}><meshBasicMaterial map={tex} transparent opacity={op} depthWrite={false} toneMapped={false} color={new THREE.Color(0.97, 0.97, 0.97)} /></mesh>;
};
