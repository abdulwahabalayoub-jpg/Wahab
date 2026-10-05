import "./fonts";
import { Composition } from "remotion";
import { VIDEO } from "./config";
import { InvestingVideo } from "./InvestingVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="InvestingTimeCompounds"
      component={InvestingVideo}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
