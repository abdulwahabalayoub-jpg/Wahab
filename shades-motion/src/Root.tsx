import { Composition, Folder } from "remotion";
import { BrandFilm } from "./BrandFilm";
import { Construction } from "./scenes/Construction";
import { EndCard } from "./scenes/EndCard";
import { Emergence } from "./scenes/Emergence";
import { FullLogo } from "./scenes/FullLogo";
import { Icons } from "./scenes/Icons";
import { Palette } from "./scenes/Palette";

// 24fps, 1920x1080. BrandFilm = 39s of scenes minus 5 x 18-frame crossfades.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="BrandFilm" component={BrandFilm} durationInFrames={846} fps={24} width={1920} height={1080} />
      <Folder name="Scenes">
        <Composition id="Emergence" component={Emergence} durationInFrames={336} fps={24} width={1920} height={1080} />
        <Composition id="Construction" component={Construction} durationInFrames={144} fps={24} width={1920} height={1080} />
        <Composition id="FullLogo" component={FullLogo} durationInFrames={120} fps={24} width={1920} height={1080} />
        <Composition id="Palette" component={Palette} durationInFrames={120} fps={24} width={1920} height={1080} />
        <Composition id="Icons" component={Icons} durationInFrames={120} fps={24} width={1920} height={1080} />
        <Composition id="EndCard" component={EndCard} durationInFrames={96} fps={24} width={1920} height={1080} />
      </Folder>
    </>
  );
};
