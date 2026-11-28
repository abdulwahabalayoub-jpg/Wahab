import React from "react";
import { Composition } from "remotion";
import { FPS } from "./theme";
import { Explainer, ExplainerVertical, TOTAL } from "./Video";
import { Film, FILM_LEN } from "./film/Film";
import { Test2 } from "./film2/Test";
import { Film2 } from "./film2/Film2";
import { LEN as LEN2 } from "./film2/timing";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Explainer" component={Explainer} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="ExplainerVertical" component={ExplainerVertical} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="MicrobloggerFilm" component={Film} durationInFrames={FILM_LEN} fps={FPS} width={1080} height={1920} />
    <Composition id="MicrobloggerFilm2" component={Film2} durationInFrames={LEN2} fps={FPS} width={1080} height={1920} defaultProps={{ muted: true }} />
    <Composition id="Test2" component={Test2} durationInFrames={60} fps={FPS} width={1080} height={1920} />
  </>
);
