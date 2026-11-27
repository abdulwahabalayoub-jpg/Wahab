import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";

export const FPS = 30;
export const GOLD = "#C2941B";
export const GOLD_L = "#E9C46A";
export const BG = "#0a0806";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
/** eased 0..1 between frames a and b */
export const pr = (f: number, a: number, b: number, e = ease) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const v3 = (a: number[], b: number[], t: number) => a.map((x, i) => mix(x, b[i], t)) as [number, number, number];
/** piecewise keyframes: keys frames, values arrays */
export const kf = (f: number, keys: number[], vals: number[][], e = easeIO): [number, number, number] => {
  if (f <= keys[0]) return vals[0] as [number, number, number];
  for (let i = 0; i < keys.length - 1; i++) {
    if (f <= keys[i + 1]) return v3(vals[i], vals[i + 1], pr(f, keys[i], keys[i + 1], e));
  }
  return vals[vals.length - 1] as [number, number, number];
};
export const ui = (n: string) => staticFile(`film/ui/${n}.png`);

/** Studio lighting: procedural room environment for reflections + warm background */
export const Env: React.FC<{ bg?: string; fog?: [number, number]; envI?: number }> = ({ bg = BG, fog, envI = 1 }) => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = env;
    (scene as any).environmentIntensity = envI;
    scene.background = new THREE.Color(bg);
    if (fog) scene.fog = new THREE.Fog(bg, fog[0], fog[1]);
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
  }, [gl, scene, bg, envI, fog]);
  return null;
};

/** Camera rig: position + target per frame */
export const Cam: React.FC<{ pos: [number, number, number]; look: [number, number, number]; fov?: number; roll?: number }> = ({ pos, look, fov, roll = 0 }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.lookAt(...look);
    if (fov && (camera as THREE.PerspectiveCamera).fov !== fov) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
};

/** plane geometry with rounded corners and 0..1 UVs */
export const roundedPlane = (w: number, h: number, r: number, seg = 10) => {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ShapeGeometry(s, seg);
  const p = g.attributes.position; const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - x) / w, (p.getY(i) - y) / h);
  uv.needsUpdate = true;
  return g;
};
/** rounded rectangle outline (frame) */
export const roundedFrame = (w: number, h: number, r: number, t: number) => {
  const mk = (w2: number, h2: number, r2: number) => {
    const s = new THREE.Path(); const x = -w2 / 2, y = -h2 / 2;
    s.moveTo(x + r2, y); s.lineTo(x + w2 - r2, y); s.quadraticCurveTo(x + w2, y, x + w2, y + r2);
    s.lineTo(x + w2, y + h2 - r2); s.quadraticCurveTo(x + w2, y + h2, x + w2 - r2, y + h2);
    s.lineTo(x + r2, y + h2); s.quadraticCurveTo(x, y + h2, x, y + h2 - r2); s.lineTo(x, y + r2); s.quadraticCurveTo(x, y, x + r2, y);
    return s;
  };
  const outer = new THREE.Shape(mk(w + t, h + t, r + t / 2).getPoints(24));
  outer.holes.push(new THREE.Path(mk(w, h, r).getPoints(24).reverse()));
  return new THREE.ShapeGeometry(outer);
};

export const useTex = (src: string) => {
  const t = useTexture(src);
  useMemo(() => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; t.needsUpdate = true; }, [t]);
  return t;
};

/** A screen that shows one of several real UI captures, cross-fading between them */
export type Shot = { src: string; at: number; scroll?: [number, number, number, number] };
const ScreenLayer: React.FC<{ src: string; w: number; h: number; r: number; opacity: number; z: number; scroll?: number }> = ({ src, w, h, r, opacity, z, scroll = 0 }) => {
  const tex = useTex(src);
  const geo = useMemo(() => roundedPlane(w, h, r), [w, h, r]);
  useMemo(() => {
    const img = tex.image as HTMLImageElement;
    const aspectImg = img.height / img.width; const aspectScreen = h / w;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    const rep = Math.min(1, aspectScreen / aspectImg);
    tex.repeat.set(1, rep);
    tex.offset.set(0, 1 - rep - scroll * (1 - rep));
  }, [tex, w, h, scroll]);
  if (opacity <= 0.001) return null;
  return (<mesh geometry={geo} position={[0, 0, z]}><meshBasicMaterial map={tex} toneMapped={false} transparent opacity={opacity} color={new THREE.Color(0.9, 0.9, 0.9)} /></mesh>);
};
export const Screen: React.FC<{ shots: Shot[]; w: number; h: number; r?: number; fade?: number }> = ({ shots, w, h, r = 0.04, fade = 12 }) => {
  const f = useCurrentFrame();
  let cur = 0; shots.forEach((s, i) => { if (f >= s.at) cur = i; });
  return (<group>
    {shots.map((s, i) => {
      const nextAt = shots[i + 1]?.at ?? 1e9;
      const op = i === 0 ? 1 - pr(f, nextAt, nextAt + fade) : pr(f, s.at, s.at + fade) * (1 - pr(f, nextAt, nextAt + fade));
      if (Math.abs(i - cur) > 1) return null;
      const sc = s.scroll ? interpolate(f, [s.scroll[0], s.scroll[1]], [s.scroll[2], s.scroll[3]], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO }) : 0;
      return <ScreenLayer key={i} src={s.src} w={w} h={h} r={r} opacity={op} z={0.0005 * i} scroll={sc} />;
    })}
  </group>);
};

/** Glowing highlight frame on a screen, coordinates as fractions of the screen (x0,y0,x1,y1 from top-left) */
export const Highlight: React.FC<{ sw: number; sh: number; box: [number, number, number, number]; on: number; color?: string }> = ({ sw, sh, box, on, color = GOLD_L }) => {
  const w = (box[2] - box[0]) * sw, h = (box[3] - box[1]) * sh;
  const cx = (box[0] + box[2]) / 2 * sw - sw / 2, cy = sh / 2 - (box[1] + box[3]) / 2 * sh;
  const geo = useMemo(() => roundedFrame(w, h, Math.min(w, h) * 0.12, Math.min(w, h) * 0.05 + 0.006), [w, h]);
  const fill = useMemo(() => roundedPlane(w, h, Math.min(w, h) * 0.12), [w, h]);
  if (on <= 0.01) return null;
  const s = 1.06 - 0.06 * on;
  return (<group position={[cx, cy, 0.01]} scale={[s, s, 1]}>
    <mesh geometry={fill}><meshBasicMaterial color={color} transparent opacity={0.1 * on} toneMapped={false} /></mesh>
    <mesh geometry={geo}><meshBasicMaterial color={new THREE.Color(color).multiplyScalar(2.2)} transparent opacity={on} toneMapped={false} /></mesh>
  </group>);
};

/** Premium display: thin aluminium bezel with the real dashboard on it */
export const Display: React.FC<{ shots: Shot[]; children?: React.ReactNode; w?: number }> = ({ shots, children, w = 3.2 }) => {
  const h = w * 0.625; const b = 0.07;
  return (<group>
    <RoundedBox args={[w + b * 2, h + b * 2, 0.08]} radius={0.04} smoothness={4} position={[0, 0, -0.045]}>
      <meshPhysicalMaterial color="#17161a" metalness={0.85} roughness={0.28} clearcoat={1} clearcoatRoughness={0.1} />
    </RoundedBox>
    <mesh position={[0, 0, -0.002]}><planeGeometry args={[w + 0.02, h + 0.02]} /><meshBasicMaterial color="#000" /></mesh>
    <Screen shots={shots} w={w} h={h} r={0.012} />
    {children}
    {/* glass reflection sheen */}
    <mesh position={[0, 0, 0.004]}><planeGeometry args={[w, h]} /><meshPhysicalMaterial transparent opacity={0.06} roughness={0.05} metalness={0} color="#ffffff" clearcoat={1} /></mesh>
  </group>);
};

/** Realistic phone: titanium frame, black glass, dynamic island, real app on screen */
export const Phone: React.FC<{ shots: Shot[]; children?: React.ReactNode; h?: number; frameColor?: string }> = ({ shots, children, h = 3.2, frameColor = "#b8a27a" }) => {
  const w = h * (390 / 844); const sw = w * 0.94, sh = sw * (844 / 390);
  const body = useMemo(() => roundedPlane(w + 0.06, h + 0.06, 0.24), [w, h]);
  return (<group>
    <RoundedBox args={[w + 0.08, h + 0.08, 0.16]} radius={0.075} smoothness={6} position={[0, 0, -0.085]}>
      <meshPhysicalMaterial color={frameColor} metalness={1} roughness={0.22} clearcoat={0.6} />
    </RoundedBox>
    <mesh geometry={body} position={[0, 0, -0.003]}><meshPhysicalMaterial color="#050505" roughness={0.08} metalness={0.2} clearcoat={1} /></mesh>
    <group scale={[1, 1, 1]}><Screen shots={shots} w={sw} h={sh} r={0.2} /></group>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[0, sh / 2 - 0.13, 0.004]}><capsuleGeometry args={[0.055, 0.22, 6, 16]} /><meshBasicMaterial color="#000" /></mesh>
    {children}
  </group>);
};

/** Drifting gold dust, defocused by depth of field */
export const Dust: React.FC<{ n?: number; spread?: number[]; color?: string; size?: number; seed?: number }> = ({ n = 260, spread = [10, 14, 10], color = GOLD_L, size = 0.035, seed = 1 }) => {
  const f = useCurrentFrame();
  const { pos, sp } = useMemo(() => {
    let s = seed * 9301; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const pos = new Float32Array(n * 3), sp = new Float32Array(n);
    for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * spread[0]; pos[i * 3 + 1] = (r() - 0.5) * spread[1]; pos[i * 3 + 2] = (r() - 0.5) * spread[2] - 2; sp[i] = 0.2 + r(); }
    return { pos, sp };
  }, [n, seed, spread]);
  const ref = useRef<THREE.BufferGeometry>(null);
  const cur = useMemo(() => new Float32Array(n * 3), [n]);
  for (let i = 0; i < n; i++) { cur[i * 3] = pos[i * 3] + Math.sin(f * 0.01 * sp[i] + i) * 0.15; cur[i * 3 + 1] = pos[i * 3 + 1] + ((f * 0.004 * sp[i]) % 2); cur[i * 3 + 2] = pos[i * 3 + 2]; }
  useLayoutEffect(() => { if (ref.current) { ref.current.attributes.position.needsUpdate = true; } });
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!; const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.4, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; }, []);
  return (<points>
    <bufferGeometry ref={ref}><bufferAttribute attach="attributes-position" args={[cur, 3]} /></bufferGeometry>
    <pointsMaterial map={tex} color={new THREE.Color(color).multiplyScalar(2.2)} size={size} sizeAttenuation transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
  </points>);
};

/** Canvas-drawn texture (for chat bubbles, sheets, avatars) */
export const useCanvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, deps: unknown[] = []) =>
  useMemo(() => {
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!; draw(g);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

export const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
};

/** Glossy dark floor that reflects the environment */
export const Floor: React.FC<{ y?: number; color?: string }> = ({ y = -2, color = "#0d0b09" }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
    <circleGeometry args={[30, 64]} />
    <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.32} clearcoat={1} clearcoatRoughness={0.25} />
  </mesh>
);

/** Soft gold light pool on the floor / background glow */
export const Glow: React.FC<{ position: [number, number, number]; scale?: number; color?: string; opacity?: number }> = ({ position, scale = 6, color = GOLD, opacity = 0.35 }) => {
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d")!; const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); }, []);
  return (<mesh position={position} scale={[scale, scale, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={tex} color={new THREE.Color(color).multiplyScalar(1.6)} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>);
};
