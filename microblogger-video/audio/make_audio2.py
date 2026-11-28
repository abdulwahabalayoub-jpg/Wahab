"""Original score + sound design for the Microblogger film (all synthesized, no samples).
Writes public/film/music.wav, public/film/sfx.wav and public/film/mix.wav (48 kHz stereo)."""
import numpy as np, soundfile as sf, subprocess, os
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000; FPS = 30; LEN = 90.0; N = int(SR * LEN)
ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "film2")
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


def notif(amp=0.06, pan=0.0):
    a = ping(1568, 1, 9); b = ping(2093, 1, 7); out = np.zeros(len(b) + int(0.09 * SR)); out[:len(a)] += a; out[int(0.09 * SR):] += b; return out * amp
def printer(dur=0.4, amp=0.07):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for k in range(int(dur * 55)):
        i = int(k / 55 * SR); m = int(0.01 * SR); out[i:i + m] += bp(rng.standard_normal(m), 1200, 5000) * np.exp(-np.arange(m) / SR * 500)[:m]
    out += np.sin(2 * np.pi * 180 * t) * 0.15 + lp(rng.standard_normal(n), 400) * 0.25
    return out * env(n, 0.01, 0.05) * amp
def kaching(amp=0.12):
    out = np.zeros(int(2.0 * SR))
    for f0, d in [(2637, 0.0), (3322, 0.06), (3951, 0.12)]:
        p = ping(f0, 1, 3.5); i = int(d * SR); out[i:i + len(p)] += p[: len(out) - i]
    sc = scatter(1, 0.6); out[: len(sc)] += sc * 0.6
    return out * amp
def success(amp=0.07):
    out = np.zeros(int(1.6 * SR)); a = ping(note(88), 1, 5); b = ping(note(95), 1, 4); out[:len(a)] += a; i = int(0.11 * SR); out[i:i + len(b)] += b[: len(out) - i]; return out * amp
def tap(amp=0.1): return click(amp) + np.concatenate([blip(1500, amp * 0.25), np.zeros(0)])[: int(0.03 * SR)] if False else click(amp)
def bonk(amp=0.1):
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 520 * np.exp(-t * 4)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) * amp
def thud(amp=0.4): return impact(amp, 1.4)

# ---- transitions
for a in [250, 1250, 1780, 1980, 2240, 2420]: place(sfx, whoosh(0.9, amp=0.17), fr(a) - 0.4, pan=0.2)
# ---- S1: typing + notifications piling up
t = 0.15
while t < fr(160):
    place(sfx, click(0.035 + rng.uniform(0, 0.02)), t, pan=rng.uniform(-0.2, 0.2)); t += rng.uniform(0.06, 0.16)
for k, a in enumerate([28, 48, 66, 82, 96, 108, 118, 127, 135, 142, 148, 154]): place(sfx, notif(0.05 + 0.002 * k), fr(a), pan=(-1) ** k * 0.4)
place(sfx, whoosh(1.2, 100, 1200, 0.1, up=False), fr(162))
place(sfx, thud(0.25), fr(180))
# ---- S2: Instagram
place(sfx, click(0.12), fr(300))
for a in [306, 328]: place(sfx, blip(950, 0.08), fr(a))
place(sfx, bonk(0.12), fr(349))
place(sfx, whoosh(0.7, 300, 5000, 0.12), fr(362))
t = fr(388)
while t < fr(428): place(sfx, click(0.04), t, pan=rng.uniform(-0.2, 0.2)); t += rng.uniform(0.05, 0.12)
place(sfx, whoosh(2.0, 200, 4000, 0.1, up=False), fr(430))
for k in range(5): place(sfx, whoosh(0.35, 800, 6000, 0.08), fr(432 + k * 12), pan=(-1) ** k * 0.5)
# ---- S3: two invoices
REV_A = [518, 568 + 4, 568 + 40, 669, 669 + 40]
REV_B = [720 + 4, 779 - 8, 779 + 10, 815, 853, 908, 908 + 50]
for a in REV_A[:4] + REV_B[:6]: place(sfx, printer(0.42, 0.075), fr(a))
place(sfx, whoosh(0.8, 200, 3000, 0.08), fr(706))
place(sfx, riser(1.0, 0.12), fr(996) - 1.0)
place(sfx, impact(0.75, 3.0), fr(996)); place(sfx, kaching(0.14), fr(997))
place(sfx, thud(0.3), fr(1063))
# ---- S4: turn
place(sfx, scatter(0.1, 1.0), fr(1150)); place(sfx, shimmer(2.0, 0.06, 2400), fr(1152))
place(sfx, whoosh(1.4, 100, 2000, 0.1), fr(1165))
place(sfx, success(0.06), fr(1200))
place(sfx, riser(1.2, 0.08), fr(1215))
# ---- S5: one link → apply → approve → network
for a in [1292, 1310]: place(sfx, whoosh(0.35, 1500, 8000, 0.06), fr(a)); place(sfx, blip(1100, 0.06), fr(a) + 0.05)
for a in [1350, 1408, 1462, 1490]: place(sfx, click(0.12), fr(a))
for a in [1356, 1376, 1396]: place(sfx, whoosh(0.35, 800, 6000, 0.05), fr(a) - 0.05)
t = fr(1378)
while t < fr(1394): place(sfx, click(0.035), t); t += rng.uniform(0.05, 0.1)
place(sfx, success(0.06), fr(1414))
place(sfx, whoosh(0.9, 300, 6000, 0.12), fr(1418))
place(sfx, success(0.09), fr(1496)); place(sfx, notif(0.05), fr(1502), pan=-0.3)
place(sfx, whoosh(1.5, 100, 2500, 0.12), fr(1545)); place(sfx, shimmer(1.4, 0.04, 2600), fr(1560))
for k in range(26): place(sfx, ping(note(84 + [0, 2, 4, 7, 9][k % 5]), 0.025, 7), fr(1563 + k * 7.5), pan=rng.uniform(-0.6, 0.6))
place(sfx, impact(0.3, 2.0), fr(1629)); place(sfx, shimmer(1.2, 0.05, 2200), fr(1630))
for k in range(7): place(sfx, blip(700 + k * 90, 0.06), fr(1655) + k * 0.25, pan=-0.6 + k * 0.2)
# ---- S6: campaign → WhatsApp
for a in [1800, 1860]: place(sfx, click(0.12), fr(a))
place(sfx, whoosh(0.4, 800, 6000, 0.06), fr(1806))
place(sfx, whoosh(1.0, 400, 8000, 0.16), fr(1896))
for k in range(16): place(sfx, blip(1000 + rng.uniform(0, 600), 0.03), fr(1900) + k * 0.05, pan=rng.uniform(-0.8, 0.8))
place(sfx, notif(0.07), fr(1912))
# ---- S7: booking + reminder
for a in [2004, 2026, 2042, 2140, 2168]: place(sfx, click(0.12), fr(a))
for a in [2010]: place(sfx, whoosh(0.4, 800, 6000, 0.06), fr(a))
place(sfx, success(0.08), fr(2048))
place(sfx, whoosh(0.6, 200, 3000, 0.08, up=False), fr(2086))
place(sfx, notif(0.08), fr(2098))
place(sfx, thud(0.22), fr(2150)); place(sfx, thud(0.22), fr(2184))
# ---- S8
place(sfx, hum(fr(2420) - fr(2240), 0.035), fr(2240)); place(sfx, whoosh(0.5, 600, 5000, 0.06), fr(2354))
for a in [2250, 2280, 2313, 2357]: place(sfx, ping(2349, 0.025, 6), fr(a), pan=0.3)
# ---- S9
place(sfx, whoosh(0.5, 1000, 7000, 0.1), fr(2452)); place(sfx, impact(0.45, 2.2), fr(2464)); place(sfx, shimmer(1.2, 0.05, 2600), fr(2465))
place(sfx, whoosh(1.4, 100, 2500, 0.1), fr(2486)); place(sfx, shimmer(1.8, 0.04, 3000), fr(2495))
place(sfx, riser(1.4, 0.12), fr(2584) - 1.4); place(sfx, impact(0.7, 3.5), fr(2584)); place(sfx, shimmer(2.6, 0.07, 2600), fr(2586))
sfx = reverb(sfx, 0.2)

vo = np.zeros((N, 2))
VO_AT = [15, 262, 512, 1165, 1262, 1792, 1992, 2250, 2440]
for i, a in enumerate(VO_AT, 1):
    x, sr = sf.read(os.path.join(ROOT, "vo", f"f{i}.wav")); assert sr == SR
    if x.ndim == 1: x = np.stack([x, x], 1)
    place(vo, x, fr(a))
level = np.sqrt(lp(np.mean(vo ** 2, 1), 8, 1).clip(0))
duck = lp(1 - 0.35 * np.clip(level / (level.max() * 0.25 + 1e-9), 0, 1), 3, 1)
mix = sfx * 0.85 * duck[:, None] + vo * 1.0
mix /= np.abs(mix).max() / 0.95
sf.write(os.path.join(ROOT, "sfx.wav"), sfx / (np.abs(sfx).max() / 0.9), SR)
raw = os.path.join(ROOT, "mix_raw.wav"); sf.write(raw, mix, SR)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", "48000", os.path.join(ROOT, "mix.wav")], check=True)
print("done")
