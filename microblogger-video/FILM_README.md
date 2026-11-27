# Microblogger Dashboard: cinematic intro film (90 s, 9:16)

- Composition: `MicrobloggerFilm` (src/film/Film.tsx). It has 9 scenes, built with Three.js through @remotion/three, react-three-fiber, drei and postprocessing.
- UI on screen: real captures of `microblogger/mockup-lived.html` in `public/film/ui/`. The demo bar is hidden in the captures; the app itself is unchanged.
- Voice-over: ElevenLabs, voice "Mike" (eleven_v3). The raw clips are in `public/film/vo_raw/`.
- Music and sound effects: synthesized from scratch in `audio/make_audio.py`.

Rebuild audio:
1. Voice clips: trim silence and loudnorm (-16 LUFS), then atempo 1.05 → `public/film/vo/f1..f9.wav`.
2. Run `python3 audio/make_audio.py`. This writes `music.wav`, `sfx.wav` and `mix.wav` (-14 LUFS).

Render (no GPU needed, about 2.5 h on 4 cores):
npx remotion render MicrobloggerFilm out/film_video.mp4 --gl=swangle --concurrency=4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --chrome-mode=headless-shell

Preview stills: `node stills.mjs 120 900 1600`
