import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { V3, mix } from "./kit";

/** Polished, faceless 3D figure (premium "clay" look). Faces +z. Origin at the hips. */
export type Pose = {
  root?: V3; rootRot?: V3; spine?: V3; chest?: V3; head?: V3;
  lT?: V3; lPole?: V3; lHand?: V3; rT?: V3; rPole?: V3; rHand?: V3;
  lHip?: V3; lKnee?: number; rHip?: V3; rKnee?: number;
};
export type Look = { skin: string; top: string; top2?: string; bottom: string; hair: string; shoes: string; long?: boolean; female?: boolean };

export const EMPLOYEE: Look = { skin: "#c9946c", top: "#1e2638", top2: "#f2eee6", bottom: "#2a2a2e", hair: "#17110d", shoes: "#151515" };
export const BLOGGER: Look = { skin: "#d9a982", top: "#efe2cc", top2: "#efe2cc", bottom: "#6b5a48", hair: "#2a1a12", shoes: "#e9e2d6", long: true, female: true };

const Z: V3 = [0, 0, 0];
export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const o: any = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  keys.forEach((k) => {
    const va = (a as any)[k], vb = (b as any)[k];
    if (typeof (va ?? vb) === "number") o[k] = mix(va ?? 0, vb ?? 0, t);
    else { const A = va ?? Z, B = vb ?? Z; o[k] = [mix(A[0], B[0], t), mix(A[1], B[1], t), mix(A[2], B[2], t)]; }
  });
  return o;
};

const useMats = (L: Look) => useMemo(() => ({
  skin: new THREE.MeshPhysicalMaterial({ color: L.skin, roughness: 0.62, sheen: 0.35, sheenColor: new THREE.Color("#ffd9c0"), envMapIntensity: 0.5 }),
  top: new THREE.MeshPhysicalMaterial({ color: L.top, roughness: 0.78, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color(L.top).lerp(new THREE.Color("#ffffff"), 0.35) }),
  top2: new THREE.MeshPhysicalMaterial({ color: L.top2 ?? L.top, roughness: 0.7, sheen: 0.6 }),
  bottom: new THREE.MeshPhysicalMaterial({ color: L.bottom, roughness: 0.8, sheen: 0.8, sheenColor: new THREE.Color(L.bottom).lerp(new THREE.Color("#ffffff"), 0.3) }),
  hair: new THREE.MeshPhysicalMaterial({ color: L.hair, roughness: 0.55, clearcoat: 0.15, clearcoatRoughness: 0.6, envMapIntensity: 0.5 }),
  shoes: new THREE.MeshPhysicalMaterial({ color: L.shoes, roughness: 0.55, clearcoat: 0.3 }),
}), [L]);

const Cap: React.FC<{ r: number; len: number; m: THREE.Material; y?: number; s?: V3 }> = ({ r, len, m, y = -len / 2, s = [1, 1, 1] }) => (
  <mesh material={m} position={[0, y, 0]} scale={s}><capsuleGeometry args={[r, len, 8, 20]} /></mesh>
);

const UA = 0.27, FA = 0.29;
const DOWN = new THREE.Vector3(0, -1, 0);
/** two-bone IK: target hand position & pole (elbow hint), both relative to the shoulder, in chest space */
export const solveArm = (t: V3, pole: V3) => {
  const T = new THREE.Vector3(...t); let d = T.length(); d = Math.min(Math.max(d, 0.08), UA + FA - 0.002);
  const tn = T.clone().normalize();
  const a = Math.acos(THREE.MathUtils.clamp((UA * UA + d * d - FA * FA) / (2 * UA * d), -1, 1));
  const P = new THREE.Vector3(...pole); const n = P.sub(tn.clone().multiplyScalar(P.dot(tn))).normalize();
  const elbow = tn.clone().multiplyScalar(Math.cos(a) * UA).add(n.multiplyScalar(Math.sin(a) * UA));
  const q1 = new THREE.Quaternion().setFromUnitVectors(DOWN, elbow.clone().normalize());
  const hand = tn.multiplyScalar(d).sub(elbow).normalize().applyQuaternion(q1.clone().invert());
  const q2 = new THREE.Quaternion().setFromUnitVectors(DOWN, hand);
  return [q1, q2] as const;
};
const Arm: React.FC<{ side: 1 | -1; q1: THREE.Quaternion; q2: THREE.Quaternion; hand: V3; M: ReturnType<typeof useMats>; hold?: React.ReactNode; fem?: boolean }> = ({ side, q1, q2, hand, M, hold, fem }) => {
  const ua = fem ? 0.047 : 0.056, fa = fem ? 0.041 : 0.049;
  return (<group position={[side * (fem ? 0.17 : 0.195), 0.42, 0]} quaternion={q1}>
    <mesh material={M.top}><sphereGeometry args={[ua * 1.12, 24, 18]} /></mesh>
    <Cap r={ua} len={0.22} m={M.top} y={-0.135} />
    <group position={[0, -UA, 0]} quaternion={q2}>
      <mesh material={M.top}><sphereGeometry args={[(fa + ua) / 2, 20, 14]} /></mesh>
      <Cap r={fa} len={0.2} m={M.top} y={-0.12} />
      <mesh material={M.top2} position={[0, -0.235, 0]}><cylinderGeometry args={[fa * 1.08, fa * 1.08, 0.025, 20]} /></mesh>
      <group position={[0, -0.26, 0]} rotation={hand}>
        <mesh material={M.skin} position={[0, -0.035, 0]} scale={[0.85, 1.25, 0.48]}><sphereGeometry args={[0.042, 20, 16]} /></mesh>
        <mesh material={M.skin} position={[side * 0.03, -0.02, 0.012]} rotation={[0, 0, side * -0.7]} scale={[0.55, 1, 0.55]}><capsuleGeometry args={[0.012, 0.03, 4, 10]} /></mesh>
        {hold}
      </group>
    </group>
  </group>);
};

const Leg: React.FC<{ side: 1 | -1; hip: V3; knee: number; M: ReturnType<typeof useMats>; fem?: boolean }> = ({ side, hip, knee, M, fem }) => (
  <group position={[side * (fem ? 0.085 : 0.095), -0.04, 0]} rotation={hip}>
    <mesh material={M.bottom}><sphereGeometry args={[0.082, 20, 16]} /></mesh>
    <Cap r={fem ? 0.068 : 0.074} len={0.34} m={M.bottom} y={-0.21} />
    <group position={[0, -0.43, 0]} rotation={[knee, 0, 0]}>
      <mesh material={M.bottom}><sphereGeometry args={[0.063, 16, 12]} /></mesh>
      <Cap r={fem ? 0.052 : 0.058} len={0.33} m={M.bottom} y={-0.2} />
      <group position={[0, -0.42, 0.04]}>
        <RoundedBox args={[0.1, 0.07, 0.25]} radius={0.034} smoothness={4} material={M.shoes} />
      </group>
    </group>
  </group>
);

export const Person: React.FC<{ look: Look; pose: Pose; position?: V3; rotation?: V3; scale?: number; rHold?: React.ReactNode; lHold?: React.ReactNode }> = ({ look, pose, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, rHold, lHold }) => {
  const M = useMats(look); const fem = !!look.female;
  const torsoGeo = useMemo(() => {
    const pts = (fem
      ? [[0.001, -0.02], [0.15, -0.01], [0.155, 0.08], [0.13, 0.18], [0.15, 0.3], [0.165, 0.4], [0.13, 0.46], [0.06, 0.5], [0.001, 0.505]]
      : [[0.001, -0.02], [0.16, -0.01], [0.165, 0.1], [0.17, 0.22], [0.19, 0.34], [0.2, 0.42], [0.15, 0.48], [0.06, 0.515], [0.001, 0.52]]
    ).map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, 40); g.scale(1, 1, 0.68); return g;
  }, [fem]);
  const p = pose;
  return (<group position={position} rotation={rotation} scale={scale}>
    <group position={p.root ?? [0, 0, 0]} rotation={p.rootRot ?? Z}>
      {/* pelvis */}
      <mesh material={M.bottom} scale={[1, 0.75, 0.72]}><sphereGeometry args={[fem ? 0.165 : 0.17, 28, 20]} /></mesh>
      <Leg side={1} hip={p.lHip ?? Z} knee={p.lKnee ?? 0} M={M} fem={fem} />
      <Leg side={-1} hip={p.rHip ?? Z} knee={p.rKnee ?? 0} M={M} fem={fem} />
      <group rotation={p.spine ?? Z}>
        <group rotation={p.chest ?? Z}>
          <mesh geometry={torsoGeo} material={M.top} />
          {/* collar / shirt hint */}
          <mesh material={M.top2} position={[0, 0.5, 0.012]}><cylinderGeometry args={[0.062, 0.075, 0.05, 24]} /></mesh>
          {!fem && <mesh material={M.top2} position={[0, 0.39, 0.105]} rotation={[0.3, 0, 0]} scale={[1, 1, 0.3]}><coneGeometry args={[0.06, 0.16, 3]} /></mesh>}
          <mesh material={M.skin} position={[0, 0.55, 0]}><cylinderGeometry args={[0.047, 0.055, 0.1, 20]} /></mesh>
          {(() => { const [a1, a2] = solveArm(p.lT ?? [0.05, -0.5, 0.06], p.lPole ?? [0.3, 0, -1]); const [b1, b2] = solveArm(p.rT ?? [-0.05, -0.5, 0.06], p.rPole ?? [-0.3, 0, -1]); return (<>
          <Arm side={1} q1={a1} q2={a2} hand={p.lHand ?? Z} M={M} hold={lHold} fem={fem} />
          <Arm side={-1} q1={b1} q2={b2} hand={p.rHand ?? Z} M={M} hold={rHold} fem={fem} /></>); })()}
          <group position={[0, 0.6, 0]} rotation={p.head ?? Z}>
            <mesh material={M.skin} position={[0, 0.115, 0.005]} scale={[0.9, 1.08, 0.98]}><sphereGeometry args={[0.112, 40, 32]} /></mesh>
            {/* jaw / chin shaping */}
            <mesh material={M.skin} position={[0, 0.06, 0.035]} scale={[0.75, 0.7, 0.8]}><sphereGeometry args={[0.09, 28, 20]} /></mesh>
            {/* nose ridge: gives the face a direction without features */}
            <mesh material={M.skin} position={[0, 0.105, 0.108]} scale={[0.5, 1, 0.6]}><sphereGeometry args={[0.022, 16, 12]} /></mesh>
            <mesh material={M.skin} position={[0.1, 0.11, -0.005]} scale={[0.45, 1, 0.8]}><sphereGeometry args={[0.025, 12, 10]} /></mesh>
            <mesh material={M.skin} position={[-0.1, 0.11, -0.005]} scale={[0.45, 1, 0.8]}><sphereGeometry args={[0.025, 12, 10]} /></mesh>
            {/* hair */}
            <mesh material={M.hair} position={[0, 0.125, -0.008]} rotation={[-0.62, 0, 0]} scale={[0.96, 1.03, 1.03]}><sphereGeometry args={[0.118, 48, 28, 0, Math.PI * 2, 0, 1.62]} /></mesh>
            {look.long && <>
              <mesh material={M.hair} position={[0, 0.02, -0.06]} rotation={[0.12, 0, 0]} scale={[1.05, 1, 0.55]}><capsuleGeometry args={[0.1, 0.2, 8, 24]} /></mesh>
              <mesh material={M.hair} position={[0, 0.15, -0.02]} scale={[1.0, 0.95, 0.95]}><sphereGeometry args={[0.118, 32, 20, 0, Math.PI * 2, 0, 1.2]} /></mesh>
            </>}
            {!look.long && <mesh material={M.hair} position={[0, 0.09, -0.03]} scale={[0.93, 0.8, 0.9]}><sphereGeometry args={[0.112, 28, 20, 0, Math.PI * 2, 1.2, 1.2]} /></mesh>}
          </group>
        </group>
      </group>
    </group>
  </group>);
};

/* --------- poses (radians) --------- */
const P = Math.PI;
export const POSE = {
  stand: { lT: [0.04, -0.54, 0.05], rT: [-0.04, -0.54, 0.05] } as Pose,
  sit: { lHip: [-P / 2 + 0.05, 0, 0.04], rHip: [-P / 2 + 0.05, 0, -0.04], lKnee: P / 2 - 0.05, rKnee: P / 2 - 0.05, spine: [0.06, 0, 0] } as Pose,
  /* hands on a desk in front (relative to shoulders, chest space) */
  type: { lT: [-0.08, -0.08, 0.4], rT: [0.08, -0.08, 0.4], lPole: [0.6, -0.5, -0.4], rPole: [-0.6, -0.5, -0.4], lHand: [-0.6, 0, 0], rHand: [-0.6, 0, 0], spine: [0.16, 0, 0], head: [0.18, 0, 0] } as Pose,
  headHands: { lT: [-0.075, 0.29, 0.0], rT: [0.075, 0.29, 0.0], lPole: [1, 0.2, 0.3], rPole: [-1, 0.2, 0.3], spine: [0.22, 0, 0], head: [0.32, 0, 0] } as Pose,
  relax: { lT: [-0.16, 0.31, -0.13], rT: [0.16, 0.31, -0.13], lPole: [1, 0.4, -0.2], rPole: [-1, 0.4, -0.2], spine: [-0.2, 0, 0], head: [-0.2, 0, 0] } as Pose,
  holdPhone: { rT: [0.09, -0.2, 0.3], rPole: [-0.4, -1, -0.2], rHand: [-1.2, 0, 0], lT: [-0.12, -0.22, 0.31], lPole: [0.4, -1, -0.2], lHand: [-1.2, 0, 0], head: [0.42, 0, 0] } as Pose,
};
