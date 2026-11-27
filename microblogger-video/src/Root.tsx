import React from "react";
import { Composition } from "remotion";
import { FPS } from "./theme";
import { Explainer, ExplainerVertical, TOTAL } from "./Video";
import { Film, FILM_LEN } from "./film/Film";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Explainer" component={Explainer} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="ExplainerVertical" component={ExplainerVertical} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="MicrobloggerFilm" component={Film} durationInFrames={FILM_LEN} fps={FPS} width={1080} height={1920} />
  </>
);
