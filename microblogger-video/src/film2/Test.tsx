import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Canvas3D, Env, Cam, Lights, FX, Blob, IPhone, IPad, ui } from "./kit";
import { Person, POSE, EMPLOYEE, BLOGGER, lerpPose } from "./chars";
export const Test2: React.FC = () => {
  const f = useCurrentFrame();
  const v = Math.floor(f / 10);
  const poses = [POSE.stand, { ...POSE.sit, ...POSE.type }, { ...POSE.sit, ...POSE.headHands }, { ...POSE.sit, ...POSE.relax }];
  return (<AbsoluteFill style={{ background: "#000" }}><Canvas3D fov={30}>
    <Env bg="#15110c" envI={0.55} /><Lights k={1.3} />
    <Cam pos={v === 4 ? [0, 1.2, 9] : [0.0, 1.0, 5.2]} look={[0, 0.9, 0]} />
    {v < 4 && <>
      <Person look={EMPLOYEE} pose={poses[0] && v === 0 ? POSE.stand : poses[v]} position={[-0.55, v === 0 ? 0.95 : 0.52, 0]} rotation={[0, 0.5, 0]} />
      <Person look={BLOGGER} pose={POSE.holdPhone} position={[0.6, 0.92, 0]} rotation={[0, -0.4, 0]} />
      <Blob position={[0, 0.001, 0]} s={[3, 1.5]} />
    </>}
    {v === 4 && <>
      <group position={[-1.5, 1.2, 0]} rotation={[0, 0.25, 0]}><IPhone h={3.6} shots={[{ src: ui("m_ig_old9"), at: 0 }]} /></group>
      <group position={[1.6, 1.2, -0.5]} rotation={[0, -0.25, 0]}><IPad h={4.6} shots={[{ src: ui("t_pending"), at: 0 }]} /></group>
    </>}
    <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[8, 48]} /><meshPhysicalMaterial color="#2a2019" roughness={0.6} /></mesh>
    <FX />
  </Canvas3D></AbsoluteFill>);
};
