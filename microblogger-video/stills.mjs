import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const frames = process.argv.slice(2).map(Number);
const B = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), rspack: true });
const opts = { browserExecutable: B, chromeMode: "headless-shell", chromiumOptions: { gl: "swangle" } };
const comp = await selectComposition({ serveUrl, id: "MicrobloggerFilm", ...opts });
for (const fr of frames) {
  const t = Date.now();
  await renderStill({ composition: comp, serveUrl, output: `out/stills/f${String(fr).padStart(4, "0")}.png`, frame: fr, scale: 0.5, ...opts, timeoutInMilliseconds: 120000 });
  console.log("frame", fr, (Date.now() - t) / 1000, "s");
}
