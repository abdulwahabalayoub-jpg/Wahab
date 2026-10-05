import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BRAND, clamp, easeInOut, easeOut } from "../anim";
import anchors from "../../public/reel/anchors.json";

// 30fps, 1080x1920. Scene boundaries follow the reference edit's cut points.
export const REEL_FRAMES = 925;
const W = 1080;
const H = 1920;
const PAPER = "#F7F7F3";

for (const weight of ["300", "400", "500"]) {
  loadFont({
    family: "Poppins",
    url: staticFile(`fonts/poppins-latin-${weight}-normal.woff2`),
    weight,
  });
}

const r = (name: string) => staticFile(`reel/${name}`);

const lerp = (
  f: number,
  input: number[],
  output: number[],
  easing = easeInOut,
) => interpolate(f, input, output, { ...clamp, easing });

const centered = (w: number, h: number): React.CSSProperties => ({
  position: "absolute",
  left: (W - w) / 2,
  top: (H - h) / 2,
  width: w,
  height: h,
});

// A 16:9 slide turned on its side fills the 9:16 frame exactly.
const Landscape: React.FC<{
  rotate: number;
  transform?: string;
  children: React.ReactNode;
}> = ({ rotate, transform = "", children }) => (
  <div
    style={{
      ...centered(H, W),
      overflow: "visible",
      transform: `rotate(${rotate}deg) ${transform}`,
    }}
  >
    {children}
  </div>
);

const Cover: React.FC<{ src: string; style?: React.CSSProperties }> = ({
  src,
  style,
}) => (
  <Img
    src={src}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      ...style,
    }}
  />
);

// Opener: forest at rest, then the camera swings onto its side and drifts.
const Opener: React.FC = () => {
  const f = useCurrentFrame();
  const rot = lerp(f, [12, 46], [0, 90]);
  const swing = interpolate(f, [12, 46], [0, 1], clamp);
  const scale =
    (lerp(f, [12, 46], [1.95, 1]) + Math.sin(Math.PI * swing) * 0.9) *
    lerp(f, [46, 127], [1, 1.07]);
  const tx = lerp(f, [12, 46], [500, 0]) + lerp(f, [46, 127], [0, -40]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#11120e", overflow: "hidden" }}>
      <Landscape rotate={rot} transform={`scale(${scale}) translateX(${tx}px)`}>
        <Cover src={r("concept.jpg")} />
      </Landscape>
      <div
        style={{
          ...centered(74, 136),
          border: `3px solid ${BRAND.ecru}`,
          borderRadius: 14,
          opacity: lerp(f, [0, 4, 22, 30], [0, 1, 1, 0]),
          transform: `rotate(${rot * 1.15}deg) scale(${lerp(f, [12, 30], [1, 1.6])})`,
        }}
      />
    </AbsoluteFill>
  );
};

// Closer on the construction plate while the line mark draws itself.
const DrawOn: React.FC = () => {
  const f = useCurrentFrame();
  const hidden = lerp(f, [28, 48], [100, 0]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#11120e", overflow: "hidden" }}>
      <Landscape
        rotate={90}
        transform={`scale(${lerp(f, [0, 90], [1.32, 1.42])}) translateY(${lerp(f, [0, 90], [-60, -20])}px)`}
      >
        <Cover src={staticFile("construction_base.jpg")} />
      </Landscape>
      <Img
        src={r("mark.png")}
        style={{
          position: "absolute",
          height: 560,
          left: 540,
          top: 640,
          clipPath: `inset(${hidden}% 0 0 0)`,
          filter: "drop-shadow(0 0 14px rgba(240,238,225,0.6))",
          scale: String(lerp(f, [28, 90], [1, 1.04])),
        }}
      />
    </AbsoluteFill>
  );
};

const Mark: React.FC<{
  color: "ecru" | "dark";
  height: number;
  style?: React.CSSProperties;
}> = ({ color, height, style }) => {
  const width = (height * 314) / 733;
  return (
    <Img
      src={r(`mark_${color}.png`)}
      style={{ ...centered(width, height), ...style }}
    />
  );
};

// Hard cut to ecru; the mark pulls back to a small centred lockup.
const MarkPullBack: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.ecru }}>
      <Mark color="dark" height={lerp(f, [0, 22], [620, 230], easeOut)} />
    </AbsoluteFill>
  );
};

// "Vector edit" beat: the mark blown up with its anchor points showing.
const VectorEdit: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 8) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#D3D3C9" }}>
        <Mark color="dark" height={230} />
      </AbsoluteFill>
    );
  }
  const h = 1180;
  const w = (h * 314) / 733;
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.mutedOlive }}>
      <div
        style={{
          ...centered(w, h),
          transform: `rotate(${lerp(f, [8, 45], [-5, 3])}deg) scale(${lerp(f, [8, 45], [1, 1.05])})`,
        }}
      >
        <Img
          src={r("mark_ecru.png")}
          style={{ width: "100%", height: "100%", opacity: 0.88 }}
        />
        {(anchors as number[][]).map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x * w - 7,
              top: y * h - 7,
              width: 14,
              height: 14,
              backgroundColor: "#fff",
              border: `2px solid ${BRAND.darkOlive}`,
              opacity: lerp(f, [8 + (i % 10), 14 + (i % 10)], [0, 1]),
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Mark shrinks beside the wordmark, set on its side.
const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const wordIn = lerp(f, [22, 34], [0, 1], easeOut);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.ecru }}>
      <Mark
        color="dark"
        height={lerp(f, [0, 22], [900, 210], easeOut)}
        style={{ translate: `${lerp(f, [18, 32], [0, 150])}px 0` }}
      />
      <Img
        src={r("wordmark_dark.png")}
        style={{
          ...centered(860, 358),
          transform: `translateX(${lerp(f, [22, 34], [-60, -110])}px) rotate(90deg)`,
          opacity: wordIn,
        }}
      />
    </AbsoluteFill>
  );
};

// The mark tumbles, sheds to its neck curves, then grows into the vine motif.
const Tumble: React.FC = () => {
  const f = useCurrentFrame();
  const spin = lerp(f, [0, 12, 22, 30], [0, -28, 18, 0]);
  const vineSpin = lerp(f, [38, 50], [0, 90]);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.darkOlive }}>
      <div style={{ ...centered(300, 700), transform: `rotate(${spin + vineSpin}deg) scaleY(${lerp(f, [42, 52], [1, 1.35])})` }}>
        <Img
          src={r("mark_ecru.png")}
          style={{ position: "absolute", width: 129, height: 300, left: 86, top: 200, opacity: lerp(f, [18, 24], [1, 0]) }}
        />
        <Img
          src={r("curves_ecru.png")}
          style={{ position: "absolute", width: 92, height: 276, left: 104, top: 212, opacity: lerp(f, [20, 25, 30, 34], [0, 1, 1, 0]) }}
        />
        <Img
          src={r("vine_ecru.png")}
          style={{ position: "absolute", width: 127, height: 294, left: 87, top: 203, opacity: lerp(f, [29, 35], [0, 1]) }}
        />
      </div>
    </AbsoluteFill>
  );
};

// A strip of vines, then the full repeat that tilts and turns.
const Pattern: React.FC = () => {
  const f = useCurrentFrame();
  const tw = 120;
  const th = 278;
  const strip = f < 9;
  const cols = strip ? 1 : 18;
  const rows = 14;
  const tilt = lerp(f, [18, 30, 32, 44], [0, -16, 74, 90]);
  const zoom = lerp(f, [18, 30, 32, 53], [1, 1.25, 1.2, 1.05]);
  const tiles = [];
  for (let c = 0; c < cols; c++) {
    for (let row = -1; row < rows; row++) {
      const col = strip ? 0 : c - 8;
      tiles.push(
        <Img
          key={`${c}-${row}`}
          src={r("vine_ecru.png")}
          style={{
            position: "absolute",
            width: tw,
            height: th,
            left: W / 2 - tw / 2 + col * tw * 1.05,
            top: row * th * 0.62 + (col % 2 === 0 ? 0 : th * 0.31) - 200,
            opacity: strip ? lerp(f, [row, row + 3], [0, 0.95]) : 0.92,
          }}
        />,
      );
    }
  }
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.darkOlive, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `rotate(${tilt}deg) scale(${zoom})` }}>
        {tiles}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Palette board assembles tile by tile, zoomed in, then pulls out.
const Palette: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = lerp(f, [6, 22, 34], [1.75, 1.75, 1]);
  const pan = lerp(f, [6, 22, 34], [-330, -250, 0]);
  const tiles = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;
      const t = lerp(f, [4 + i * 2, 16 + i * 2], [1, 0], easeOut);
      tiles.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: col * 640,
            top: row * 540,
            width: 640,
            height: 540,
            overflow: "hidden",
            transform: `translateY(${-t * 900}px)`,
          }}
        >
          <Img
            src={r("colors.jpg")}
            style={{ position: "absolute", width: H, height: W, left: -col * 640, top: -row * 540 }}
          />
        </div>,
      );
    }
  }
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.ecru, overflow: "hidden" }}>
      <Landscape rotate={90} transform={`scale(${zoom}) translateX(${pan}px)`}>
        {tiles}
      </Landscape>
      <AbsoluteFill style={{ backgroundColor: PAPER, opacity: lerp(f, [60, 66], [0, 1]) }} />
    </AbsoluteFill>
  );
};

const USAGE = [
  { name: "White", color: "#FFFFFF", track: "#F1F1EE", pct: 10 },
  { name: "Ecru", color: "#D6D6CB", track: "#EDEDE7", pct: 15 },
  { name: "Muted Olive", color: BRAND.mutedOlive, track: "#E2E3DA", pct: 25 },
  { name: "Dark Olive", color: BRAND.darkOlive, track: "#D9DAD3", pct: 50 },
];

const sideways: React.CSSProperties = {
  position: "absolute",
  fontFamily: "Poppins",
  color: BRAND.darkOlive,
  transform: "rotate(90deg)",
  transformOrigin: "left top",
  whiteSpace: "nowrap",
};

// Colour usage bars fill, then bands of colour drop in and flood the frame.
const Usage: React.FC = () => {
  const f = useCurrentFrame();
  const top = 170;
  const tall = 1580;
  const drop = lerp(f, [50, 60], [0, 1], easeOut);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <div style={{ ...sideways, left: 960, top: 760, fontSize: 64, fontWeight: 300, opacity: lerp(f, [0, 8], [0, 1]) }}>
        Color Usage
      </div>
      {USAGE.map((u, i) => {
        const fill = lerp(f, [14 + i * 3, 40 + i * 3], [0, u.pct / 100]);
        const x = 170 + i * 175;
        return (
          <div key={u.name}>
            <div style={{ position: "absolute", left: x, top, width: 76, height: tall, backgroundColor: u.track }} />
            <div
              style={{
                position: "absolute",
                left: x,
                top,
                width: 76,
                height: tall * fill,
                backgroundColor: u.color,
                boxShadow: u.name === "White" ? "inset 0 0 0 1px #DADAD2" : undefined,
              }}
            />
            <div style={{ ...sideways, left: x - 14, top: top + tall * fill - 70, fontSize: 24, fontWeight: 400, opacity: lerp(f, [30, 40], [0, 1]) }}>
              {`${Math.round(fill * 100)}%`}
            </div>
            <div style={{ ...sideways, left: x + 122, top: top + 20, fontSize: 26, fontWeight: 300, opacity: lerp(f, [8 + i * 2, 16 + i * 2], [0, 1]) }}>
              {u.name}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: H * 0.62 * drop + lerp(f, [58, 68], [0, H]), backgroundColor: BRAND.darkOlive }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.62 * drop, height: 70 * drop, backgroundColor: BRAND.ecru, opacity: f < 66 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.62 * drop + 70 * drop, height: 50 * drop, backgroundColor: "#1E2019", opacity: f < 66 ? 1 : 0 }} />
    </AbsoluteFill>
  );
};

// Typography: each specimen panel pushes in from the left over the last.
const Type: React.FC = () => {
  const f = useCurrentFrame();
  const panel = (i: number, x: number, y: number, o = 1) => (
    <div
      key={i}
      style={{ position: "absolute", inset: 0, overflow: "hidden", transform: `translate(${x}px, ${y}px)`, opacity: o }}
    >
      <Img src={r(`type${i}.jpg`)} style={{ ...centered(1132, 1920), objectFit: "cover" }} />
    </div>
  );
  const in1 = lerp(f, [30, 44], [-W, 0]);
  const in2 = lerp(f, [54, 66], [-W, 0]);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.darkOlive, overflow: "hidden" }}>
      {panel(0, lerp(f, [30, 44], [0, 320]), lerp(f, [4, 22], [-520, 0], easeOut), lerp(f, [4, 14], [0, 1]))}
      {f >= 30 && panel(1, in1, 0)}
      {f >= 54 && panel(2, in2, 0)}
    </AbsoluteFill>
  );
};

const ICONS = [
  { w: 177, h: 318, lw: 266 },
  { w: 134, h: 295, lw: 279 },
  { w: 220, h: 269, lw: 123 },
  { w: 180, h: 358, lw: 201 },
  { w: 181, h: 330, lw: 138 },
];

// Category icons: each spins in, holds, then splits apart into the next.
const Icons: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(4, Math.floor(f / 28));
  const t = f - i * 28;
  const ic = ICONS[i];
  const s = 1.75;
  const last = i === 4;
  const split = last ? lerp(t, [22, 28], [0, 0]) : lerp(t, [21, 28], [0, 1], easeOut);
  const spin = lerp(t, [0, 9], [i % 2 === 0 ? -35 : 35, 0], easeOut);
  const pop = lerp(t, [0, 9], [0.55, 1], easeOut);
  const half = (side: "l" | "r") => (
    <Img
      src={r(`icon${i}_dark.png`)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        clipPath: side === "l" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
        transform:
          side === "l"
            ? `translate(${-split * 160}px, ${-split * 90}px) rotate(${-split * 25}deg)`
            : `translate(${split * 160}px, ${split * 90}px) rotate(${split * 25}deg)`,
        opacity: 1 - split,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <div style={{ ...centered(ic.w * s, ic.h * s), top: 760 - (ic.h * s) / 2, transform: `rotate(${spin}deg) scale(${pop})` }}>
        {half("l")}
        {half("r")}
      </div>
      <Img
        src={r(`label${i}_dark.png`)}
        style={{
          ...centered(ic.lw * 2.2, 93),
          top: 1260,
          opacity: lerp(t, [5, 11, 20, 25], [0, 1, 1, last ? 1 : 0]),
          translate: `0 ${lerp(t, [5, 11], [24, 0], easeOut)}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const card: React.CSSProperties = {
  position: "absolute",
  width: 600,
  height: 880,
  borderRadius: 6,
  boxShadow: "0 40px 70px rgba(30,32,25,0.28), 0 6px 14px rgba(30,32,25,0.18)",
};

// Stationery mockup: two cards drift, then a close pass on the front card.
const Cards: React.FC = () => {
  const f = useCurrentFrame();
  const close = f >= 36;
  if (!close) {
    return (
      <AbsoluteFill style={{ backgroundColor: PAPER, overflow: "hidden" }}>
        <div
          style={{
            ...card,
            left: 130,
            top: 380,
            backgroundColor: BRAND.ecru,
            transform: `translate(${lerp(f, [0, 36], [0, 30])}px, ${lerp(f, [0, 36], [0, -20])}px) rotate(${lerp(f, [0, 36], [-24, -20])}deg)`,
          }}
        >
          <Img src={r("mark_dark.png")} style={{ position: "absolute", height: 300, left: 236, top: 290 }} />
        </div>
        <div
          style={{
            ...card,
            left: 360,
            top: 720,
            backgroundColor: BRAND.darkOlive,
            transform: `translate(${lerp(f, [0, 36], [0, -40])}px, ${lerp(f, [0, 36], [40, 0])}px) rotate(${lerp(f, [0, 36], [10, 6])}deg)`,
          }}
        >
          <Img src={r("wordmark_ecru.png")} style={{ position: "absolute", width: 420, left: 90, top: 360 }} />
        </div>
      </AbsoluteFill>
    );
  }
  const t = f - 36;
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, overflow: "hidden" }}>
      <div
        style={{
          ...card,
          left: 240,
          top: 520,
          backgroundColor: BRAND.darkOlive,
          transform: `translate(${lerp(t, [0, 34, 40], [60, -120, -900])}px, ${lerp(t, [0, 34, 40], [-40, 120, 500])}px) rotate(${lerp(t, [0, 40], [-28, -20])}deg) scale(1.3)`,
        }}
      >
        <Img src={r("mark_ecru.png")} style={{ position: "absolute", height: 150, left: 70, top: 80 }} />
        <Img src={r("wordmark_ecru.png")} style={{ position: "absolute", width: 250, left: 290, top: 700 }} />
      </div>
    </AbsoluteFill>
  );
};

// White flash back to the opening frame so the reel loops.
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#11120e", overflow: "hidden" }}>
      <Landscape rotate={0} transform="scale(1.95) translateX(500px)">
        <Cover src={r("concept.jpg")} />
      </Landscape>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: lerp(f, [0, 8, 19], [1, 0.55, 0.1]) }} />
    </AbsoluteFill>
  );
};

const SCENES: [number, number, React.FC][] = [
  [0, 127, Opener],
  [127, 217, DrawOn],
  [217, 255, MarkPullBack],
  [255, 300, VectorEdit],
  [300, 360, Lockup],
  [360, 412, Tumble],
  [412, 465, Pattern],
  [465, 532, Palette],
  [532, 600, Usage],
  [600, 690, Type],
  [690, 830, Icons],
  [830, 906, Cards],
  [906, 925, Outro],
];

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {SCENES.map(([from, to, Scene]) => (
      <Sequence key={from} from={from} durationInFrames={to - from}>
        <Scene />
      </Sequence>
    ))}
    <Audio src={r("audio.wav")} />
  </AbsoluteFill>
);
