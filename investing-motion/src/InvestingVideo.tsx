import type React from "react";
import { AbsoluteFill } from "remotion";
import { Scene } from "./components/Scene";
import { Texture } from "./components/Texture";
import { COLORS, SCENES } from "./config";
import { GraphStory } from "./scenes/GraphStory";
import { S01Hook } from "./scenes/S01Hook";
import { S02Inflation } from "./scenes/S02Inflation";
import { S03Choice } from "./scenes/S03Choice";
import { S04Compounding } from "./scenes/S04Compounding";
import { S08Time } from "./scenes/S08Time";
import { S09Final } from "./scenes/S09Final";

export const InvestingVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Scene name="01 Hook" from={SCENES.hook.from} duration={SCENES.hook.duration}>
      <S01Hook />
    </Scene>
    <Scene name="02 Purchasing power" from={SCENES.inflation.from} duration={SCENES.inflation.duration}>
      <S02Inflation />
    </Scene>
    <Scene name="03 The choice" from={SCENES.choice.from} duration={SCENES.choice.duration}>
      <S03Choice />
    </Scene>
    <Scene name="04 Compounding" from={SCENES.compounding.from} duration={SCENES.compounding.duration}>
      <S04Compounding />
    </Scene>
    <Scene name="04–07 Graph: growth, crash, recovery" from={SCENES.graph.from} duration={SCENES.graph.duration}>
      <GraphStory />
    </Scene>
    <Scene name="08 Time" from={SCENES.time.from} duration={SCENES.time.duration}>
      <S08Time />
    </Scene>
    <Scene name="09 Final" from={SCENES.final.from} duration={SCENES.final.duration}>
      <S09Final />
    </Scene>
    <Texture />
  </AbsoluteFill>
);
