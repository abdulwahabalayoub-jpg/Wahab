"""Speed up the quiet gaps between voice lines. Source frames -> output frames (piecewise linear)."""
import json, subprocess, sys
G = [(223, 259), (496, 509), (1102, 1162), (1203, 1259), (1531, 1560), (1736, 1789), (1960, 1989), (2215, 2247), (2423, 2437)]
SRC_LEN = 2700
segs = []; p = 0
for a, b in G:
    if a > p: segs.append((p, a, 1.0))
    L = b - a; Lo = max(10, round(L * 0.33)); segs.append((a, b, L / Lo)); p = b
segs.append((p, SRC_LEN, 1.0))
# knots for time map (source frame -> output frame)
knots = [(0, 0.0)]; o = 0.0
for a, b, s in segs: o += (b - a) / s; knots.append((b, o))
json.dump({"segs": segs, "knots": knots}, open("audio/retime.json", "w"))
print("output frames", round(o), "seconds", round(o / 30, 2))
if len(sys.argv) > 2:
    src, out = sys.argv[1], sys.argv[2]
    parts = []; fc = []
    for i, (a, b, s) in enumerate(segs):
        fc.append(f"[0:v]trim=start_frame={a}:end_frame={b},setpts=(PTS-STARTPTS)/{s}[v{i}]"); parts.append(f"[v{i}]")
    fc.append("".join(parts) + f"concat=n={len(segs)}:v=1:a=0,fps=30[v]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-filter_complex", ";".join(fc), "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", out], check=True)
