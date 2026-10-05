import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONTS } from "./config";

const display = [500, 700, 800, 900].map((w) =>
  loadFont({
    family: FONTS.display,
    url: staticFile(`fonts/inter-tight-latin-${w}-normal.woff2`),
    weight: String(w),
  }),
);

const mono = [400, 500, 700].map((w) =>
  loadFont({
    family: FONTS.mono,
    url: staticFile(`fonts/jetbrains-mono-latin-${w}-normal.woff2`),
    weight: String(w),
  }),
);

export const fontsLoaded = Promise.all([...display, ...mono]);
