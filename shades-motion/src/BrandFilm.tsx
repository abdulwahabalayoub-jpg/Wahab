import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { useVideoConfig } from "remotion";
import { Construction } from "./scenes/Construction";
import { EndCard } from "./scenes/EndCard";
import { Emergence } from "./scenes/Emergence";
import { FullLogo } from "./scenes/FullLogo";
import { Icons } from "./scenes/Icons";
import { Palette } from "./scenes/Palette";

export const BrandFilm: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Emergence" durationInFrames={14 * fps} premountFor={fps}>
        <Emergence />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
      <TransitionSeries.Sequence name="Construction" durationInFrames={6 * fps} premountFor={fps}>
        <Construction />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
      <TransitionSeries.Sequence name="Full logo" durationInFrames={5 * fps} premountFor={fps}>
        <FullLogo />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
      <TransitionSeries.Sequence name="Palette" durationInFrames={5 * fps} premountFor={fps}>
        <Palette />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
      <TransitionSeries.Sequence name="Icons" durationInFrames={5 * fps} premountFor={fps}>
        <Icons />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
      <TransitionSeries.Sequence name="End card" durationInFrames={4 * fps} premountFor={fps}>
        <EndCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
