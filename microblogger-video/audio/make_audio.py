"""Original score + sound design for the Microblogger film (all synthesized, no samples).
Writes public/film/music.wav, public/film/sfx.wav and public/film/mix.wav (48 kHz stereo)."""
import numpy as np, soundfile as sf, subprocess, os
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000; FPS = 30; LEN = 90.0; N = int(SR * LEN)
ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "film")
rng = np.random.default_rng(7)
fr = lambda f: f / FPS  # frames -> seconds

def lp(x, fc, o=2): return sosfilt(butter(o, fc, "low", fs=SR, output="sos"), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def note(n): return 440.0 * 2 ** ((n - 69) / 12)
def env(n, a, r, sus=1.0):
    e = np.ones(n) * sus; ai = max(1, int(a * SR)); ri = max(1, int(r * SR))
    e[:ai] = np.linspace(0, sus, ai); e[-ri:] *= np.linspace(1, 0, ri); return e
def place(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); sig = np.asarray(sig)
    if sig.ndim == 1: sig = np.stack([sig * np.sqrt(0.5 * (1 - pan)), sig * np.sqrt(0.5 * (1 + pan))], 1)
    j = min(N, i + len(sig))
    if j > i >= 0: buf[i:j] += sig[: j - i] * gain
def make_ir(sec=2.8, damp=3000):
    n = int(sec * SR); t = np.arange(n) / SR
    ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)], 1) * np.exp(-t * 3.2)[:, None]
    ir[:, 0] = lp(ir[:, 0], damp); ir[:, 1] = lp(ir[:, 1], damp); ir /= np.abs(ir).max(); return ir
IR = make_ir()
def reverb(x, wet=0.3):
    y = np.stack([fftconvolve(x[:, k], IR[:, k])[: len(x)] for k in range(2)], 1)
    y *= np.abs(x).max() / (np.abs(y).max() + 1e-9)
    return x * (1 - wet) + y * wet

# ---------- instruments ----------
def saw(freq, dur, harm=14, det=0.0):
    t = np.arange(int(dur * SR)) / SR; out = np.zeros_like(t)
    for k in range(1, harm + 1):
        if freq * k > 9000: break
        out += np.sin(2 * np.pi * freq * (1 + det) * k * t + k) / k
    return out
def pad(notes, dur, cutoff=1400, a=1.6, r=1.8, amp=0.06):
    n = int(dur * SR); L = np.zeros(n); R = np.zeros(n)
    for m in notes:
        f0 = note(m); L += saw(f0, dur, det=-0.003); R += saw(f0, dur, det=0.003)
    e = env(n, a, r); L = lp(L, cutoff) * e; R = lp(R, cutoff) * e
    return np.stack([L, R], 1) * amp
def piano(m, dur=2.6, amp=0.22):
    f0 = note(m); n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for k, g in [(1, 1), (2, 0.45), (3, 0.22), (4, 0.12), (5, 0.06)]:
        fk = f0 * k * np.sqrt(1 + 0.0004 * k * k); out += g * np.sin(2 * np.pi * fk * t) * np.exp(-t * (1.6 + k * 0.9))
    out += lp(rng.standard_normal(n), 3000) * np.exp(-t * 60) * 0.05
    out *= env(n, 0.004, 0.3); return out * amp
def pluck(m, dur=0.5, amp=0.1):
    f0 = note(m); n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f0 * t) + 0.35 * np.sin(4 * np.pi * f0 * t) + 0.15 * np.sin(6 * np.pi * f0 * t)
    return s * np.exp(-t * 9) * env(n, 0.002, 0.05) * amp
def kick(amp=0.5):
    n = int(0.45 * SR); t = np.arange(n) / SR; f = 46 + 90 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * amp
def hat(amp=0.05, dec=60):
    n = int(0.08 * SR); t = np.arange(n) / SR; return hp(rng.standard_normal(n), 7000) * np.exp(-t * dec) * amp
def clap(amp=0.08):
    n = int(0.3 * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 900, 3500)
    e = np.exp(-t * 18) + 0.6 * np.exp(-np.maximum(0, t - 0.012) * 40) * (t > 0.012); return x * e * amp
def sub(m, dur, amp=0.18):
    n = int(dur * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * note(m) * t) * env(n, 0.01, dur * 0.6) * amp

# ---------- the score ----------
music = np.zeros((N, 2))
BPM = 96; beat = 60 / BPM; bar = beat * 4
T_TENSION = fr(203); T_DROP = fr(871); T_END = fr(2449)
# A · calm intro: D minor add9 pad + sparse piano motif
place(music, pad([50, 57, 62, 64, 69], T_TENSION + 2.5, cutoff=1100, a=2.5, r=2.5, amp=0.05), 0)
for t, m in [(0.8, 74), (2.3, 69), (3.1, 72), (4.6, 76), (6.0, 74)]: place(music, piano(m, 3.2, 0.16), t, pan=0.2)
# B · tension: dissonant pad, low pulse, ticking, rising filter (S2-S3)
dur_b = T_DROP - T_TENSION
pb = pad([46, 53, 58, 63], dur_b, cutoff=900, a=3, r=1.2, amp=0.05)
pb = np.stack([lp(pb[:, k], 2500) for k in range(2)], 1) * np.linspace(0.6, 1.3, len(pb))[:, None]
place(music, pb, T_TENSION)
t = T_TENSION + 0.5; i = 0
while t < T_DROP - 1.6:
    place(music, sub(38, beat * 0.45, 0.16 + 0.1 * (t - T_TENSION) / dur_b), t)
    place(music, hat(0.025 + 0.03 * (t - T_TENSION) / dur_b, 80), t + beat / 2, pan=0.4 if i % 2 else -0.4)
    if (t - T_TENSION) > 10: place(music, hat(0.02, 120), t + beat / 4, pan=-0.3); place(music, hat(0.02, 120), t + 3 * beat / 4, pan=0.3)
    t += beat; i += 1
for t, m in [(fr(260), 62), (fr(420), 61), (fr(600), 62), (fr(700), 63)]: place(music, piano(m, 3, 0.12), t, pan=-0.3)
# C · solution: F major progression, warm and confident
prog = [[41, 53, 57, 60, 65], [36, 52, 55, 60, 64], [38, 53, 57, 62, 65], [34, 50, 53, 58, 62]]  # F C Dm Bb
arps = [[65, 69, 72, 77], [64, 67, 72, 76], [62, 65, 69, 74], [62, 65, 70, 74]]
t = T_DROP; c = 0
while t < T_END + 1.2:
    ch = prog[c % 4]; d = bar * 2
    place(music, pad(ch[1:], d + 0.6, cutoff=1800 if t < fr(1051) else 2600, a=0.6, r=0.9, amp=0.045), t)
    place(music, sub(ch[0] + 12, d * 0.95, 0.15), t)
    for b in range(8):
        tb = t + b * beat
        if tb > T_END + 1.2: break
        if t > fr(1051) and b % 2 == 0: place(music, kick(0.32), tb)
        if t > fr(1423) and b % 2 == 1: place(music, clap(0.05), tb, pan=0.1)
        place(music, hat(0.018, 70), tb + beat / 2, pan=0.35)
        for s in range(2):
            m = arps[c % 4][(b * 2 + s) % 4] + (12 if t > fr(1719) and s else 0)
            place(music, pluck(m, 0.45, 0.06 if t < fr(1051) else 0.075), tb + s * beat / 2, pan=-0.35 + 0.7 * ((b * 2 + s) % 4) / 3)
    if c % 2 == 0: place(music, piano(arps[c % 4][3] + 12, 2.6, 0.08), t + beat * 0.5, pan=0.25)
    t += d; c += 1
# D · ending: big F major swell and resolve on the logo
place(music, pad([41, 53, 57, 60, 65, 69, 72], LEN - T_END, cutoff=3200, a=1.4, r=3.0, amp=0.07), T_END)
for k, m in enumerate([65, 69, 72, 77, 81]): place(music, piano(m, 4.5, 0.12), fr(2609) + k * 0.09, pan=-0.3 + k * 0.15)
place(music, sub(29, 5.5, 0.22), fr(2609))
music = reverb(music, 0.32)
music *= np.clip(np.interp(np.arange(N) / SR, [0, 1.5, LEN - 3.5, LEN], [0, 1, 1, 0]), 0, 1)[:, None]

# ---------- sound design ----------
sfx = np.zeros((N, 2))
def whoosh(dur=0.9, lo=300, hi=6000, amp=0.22, up=True):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); bands = np.geomspace(lo, hi, 9)
    for k in range(8):
        y = bp(x, bands[k], bands[k + 1]); c = (k / 7) if up else 1 - k / 7
        t = np.linspace(0, 1, n); out += y * np.exp(-((t - (0.25 + 0.5 * c)) ** 2) / 0.03)
    return out * env(n, 0.05, 0.25) * amp
def riser(dur=2.0, amp=0.16):
    n = int(dur * SR); t = np.arange(n) / SR; f = 200 * (8 ** (t / dur))
    s = 0.4 * np.sin(2 * np.pi * np.cumsum(f) / SR) + hp(rng.standard_normal(n), 2000) * (t / dur)
    return s * (t / dur) ** 2 * amp
def impact(amp=0.6, tail=2.5):
    n = int(tail * SR); t = np.arange(n) / SR; f = 30 + 60 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) + lp(rng.standard_normal(n), 1200) * np.exp(-t * 14) * 0.6
    return s * amp
def blip(f0=900, amp=0.12):
    n = int(0.09 * SR); t = np.arange(n) / SR; f = f0 * (1 + 0.6 * t / 0.09)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.09) ** 2 * amp
def ping(f0=1760, amp=0.08, dec=4):
    n = int(1.4 * SR); t = np.arange(n) / SR
    return sum(g * np.sin(2 * np.pi * f0 * r * t) for r, g in [(1, 1), (2.76, 0.35), (5.4, 0.12)]) * np.exp(-t * dec) * env(n, 0.002, 0.2) * amp
def click(amp=0.09):
    n = int(0.03 * SR); t = np.arange(n) / SR; return (hp(rng.standard_normal(n), 3000) * np.exp(-t * 400) + np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 200) * 0.5) * amp
def shimmer(dur=1.6, amp=0.05, base=2200):
    out = np.zeros(int((dur + 1.4) * SR))
    for k in range(14):
        p = ping(base * 2 ** (rng.integers(0, 12) / 12), 1, 5); i = int(rng.uniform(0, dur) * SR); out[i:i + len(p)] += p[: len(out) - i]
    return out * amp
def hum(dur, amp=0.06):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 55 * t) + 0.5 * np.sin(2 * np.pi * 110.4 * t) + 0.2 * np.sin(2 * np.pi * 165 * t)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.4 * t)) * env(n, 1.2, 1.2) * amp
def scatter(amp=0.08, dur=0.8):
    n = int(dur * SR); t = np.arange(n) / SR; x = hp(rng.standard_normal(n), 2500) * np.exp(-t * 6)
    for k in range(10):
        p = ping(3000 + rng.uniform(0, 3000), 0.5, 18); i = int(rng.uniform(0, dur * 0.7) * SR); x[i:i + len(p)] += p[: n - i]
    return x * amp

STARTS = [0, 203, 549, 813, 1051, 1423, 1719, 2089, 2449]
for k, s in enumerate(STARTS[1:], 1):
    if k == 3: continue
    place(sfx, whoosh(1.0, amp=0.2), fr(s) - 0.45, pan=-0.3 + 0.6 * (k % 2))
# S1
place(sfx, riser(2.2, 0.07), 0.0)
for i in range(7): place(sfx, ping(1320 * 2 ** ([0, 2, 4, 7, 9, 12, 14][i] / 12), 0.045, 5), fr(18 + i * 7), pan=-0.5 + i / 6)
place(sfx, whoosh(1.4, 120, 1500, 0.08, up=False), fr(150))
# S2: message pops, typing, chaos swirl
for i in range(10): place(sfx, blip(820 + (i % 4) * 120, 0.12), fr(203 + 30 + i * 18), pan=(-1) ** i * 0.4)
for i in range(9): place(sfx, ping(2093, 0.03, 9), fr(203 + 48 + i * 30), pan=0.6)
place(sfx, whoosh(0.8, 200, 3000, 0.12), fr(203 + 180))
for i in range(28): place(sfx, click(0.05), fr(203 + 188) + i * 0.085 + rng.uniform(0, 0.03), pan=rng.uniform(-0.3, 0.3))
place(sfx, riser(2.4, 0.12), fr(203 + 286))
# S3: the cost
place(sfx, impact(0.55), fr(549 + 70)); place(sfx, shimmer(0.8, 0.03, 1800), fr(549 + 72))
for i in range(30): place(sfx, click(0.035), fr(549 + 128) + i * 0.035, pan=rng.uniform(-0.6, 0.6))
place(sfx, impact(0.4, 1.8), fr(549 + 214)); place(sfx, impact(0.36, 1.8), fr(549 + 236))
place(sfx, whoosh(1.1, 200, 4000, 0.12), fr(549 + 214))
# S4: collapse, flash, reveal
place(sfx, riser(1.9, 0.2), fr(813)); place(sfx, whoosh(1.9, 100, 2000, 0.1, up=True), fr(813))
place(sfx, impact(0.7, 3.2), fr(871)); place(sfx, shimmer(2.2, 0.06, 2600), fr(871))
place(sfx, whoosh(1.6, 100, 1800, 0.12), fr(875))
# S5: screen changes, highlights, chips
for a in [154, 220, 256, 292, 334]: place(sfx, click(0.08), fr(1051 + a)); place(sfx, whoosh(0.5, 800, 7000, 0.05), fr(1051 + a) - 0.15)
for a in [170, 200, 232, 268, 302, 346]: place(sfx, ping(2637, 0.04, 6), fr(1051 + a), pan=0.3)
# S6: phone in, taps
place(sfx, whoosh(1.2, 150, 3000, 0.12), fr(1423))
for a in [108, 142, 182, 222, 258]: place(sfx, click(0.07), fr(1423 + a)); place(sfx, blip(1200, 0.05), fr(1423 + a) + 0.02)
place(sfx, ping(1568, 0.05, 5), fr(1423 + 224))
# S7: node chimes rising
for k, a in enumerate([18, 62, 104, 196, 230, 262, 296]): place(sfx, ping(note(72 + [0, 2, 4, 7, 9, 12, 14][k]), 0.06, 3.5), fr(1719 + a), pan=(-1) ** k * 0.35)
place(sfx, whoosh(1.6, 100, 2500, 0.1), fr(1719 + 312))
# S8: hum, inflow sparkle, beams, dissolves, growth
place(sfx, hum(LEN - fr(2089) - 6, 0.05), fr(2089))
place(sfx, shimmer(2.0, 0.035, 3000), fr(2089 + 15))
for i in range(7): place(sfx, ping(note(79 + [0, 2, 4, 7, 9, 11, 12][i]), 0.03, 6), fr(2089 + 140 + i * 8))
place(sfx, scatter(0.09), fr(2089 + 236)); place(sfx, scatter(0.08), fr(2089 + 280))
place(sfx, shimmer(2.4, 0.05, 2400), fr(2089 + 298))
# S9: line hits and the final logo
for a in [10, 58, 102]: place(sfx, impact(0.18, 1.2), fr(2449 + a)); place(sfx, ping(1046, 0.03, 4), fr(2449 + a))
place(sfx, impact(0.6, 3.5), fr(2449 + 160)); place(sfx, shimmer(2.5, 0.07, 2600), fr(2449 + 162))
sfx = reverb(sfx, 0.22)

# ---------- voice + ducking ----------
vo = np.zeros((N, 2))
VO_AT = [18, 215, 561, 829, 1065, 1437, 1733, 2103, 2463]
for i, a in enumerate(VO_AT, 1):
    x, sr = sf.read(os.path.join(ROOT, "vo", f"f{i}.wav")); assert sr == SR
    if x.ndim == 1: x = np.stack([x, x], 1)
    place(vo, x, fr(a))
level = np.sqrt(lp(np.mean(vo ** 2, 1), 8, 1).clip(0))
duck = 1 - 0.55 * np.clip(level / (level.max() * 0.25 + 1e-9), 0, 1)
duck = lp(duck, 3, 1)
MUSIC_GAIN = 0.0  # Abdulwahab: no music, sound effects only
mix = music * duck[:, None] * MUSIC_GAIN + sfx * 0.8 + vo * 1.0
mix /= np.abs(mix).max() / 0.95
sf.write(os.path.join(ROOT, "music.wav"), music / (np.abs(music).max() / 0.9), SR)
sf.write(os.path.join(ROOT, "sfx.wav"), sfx / (np.abs(sfx).max() / 0.9), SR)
raw = os.path.join(ROOT, "mix_raw.wav"); sf.write(raw, mix, SR)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", "48000", os.path.join(ROOT, "mix.wav")], check=True)
print("done")
