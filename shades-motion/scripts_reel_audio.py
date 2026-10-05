# Original ambient score for the reel: warm pad, soft plucks, whooshes on the cuts.
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR, DUR, FPS = 48000, 30.9, 30
t = np.arange(int(SR * DUR)) / SR
out = np.zeros((len(t), 2))
rng = np.random.default_rng(7)

def note(f):
    return 440 * 2 ** ((f - 69) / 12)

def env(start, length, a=0.01, rel=0.4):
    e = np.zeros(len(t))
    i0, i1 = int(start * SR), min(len(t), int((start + length + rel) * SR))
    tt = t[i0:i1] - start
    e[i0:i1] = np.minimum(1, tt / a) * np.where(tt < length, 1, np.exp(-(tt - length) / (rel / 4)))
    return e

# Pad: four slow chords, detuned saws softened by a low-pass.
chords = [[57, 64, 67, 71, 76], [53, 60, 64, 69, 72], [55, 62, 65, 69, 74], [52, 59, 64, 67, 71]]
pad = np.zeros(len(t))
for k, ch in enumerate(chords * 2):
    s = k * 3.86
    e = env(s, 3.86, a=1.2, rel=1.5)
    for m in ch:
        for d in (-0.08, 0.08):
            ph = 2 * np.pi * note(m + d) * t
            pad += e * (np.sin(ph) + 0.3 * np.sin(2 * ph)) / 14
pad = sosfilt(butter(2, 1800, fs=SR, output="sos"), pad)
out += np.stack([pad, np.roll(pad, 240)], 1) * 0.55

# Plucks on the beat (≈ 124 bpm), a simple original arpeggio.
beat = 60 / 124
arp = [69, 72, 76, 79, 77, 76, 72, 74]
for i in range(int(DUR / (beat / 2))):
    st = i * beat / 2
    if st < 1.4:
        continue
    m = arp[i % len(arp)] + (-12 if (i // 16) % 2 else 0)
    e = env(st, 0.02, a=0.003, rel=0.9)
    sig = e * np.sin(2 * np.pi * note(m) * t) * np.exp(-np.maximum(0, t - st) * 6)
    pan = 0.5 + 0.35 * np.sin(i)
    out[:, 0] += sig * 0.11 * (1 - pan)
    out[:, 1] += sig * 0.11 * pan

# Soft kick every beat from the drop.
for i in range(int(DUR / beat)):
    st = i * beat
    if st < 4.2 or st > 30.1:
        continue
    tt = np.clip(t - st, 0, None)
    k = (t >= st) * np.sin(2 * np.pi * (48 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9)
    out += k[:, None] * 0.28

# Whooshes leading into each cut.
cuts = [15, 127, 217, 255, 300, 360, 412, 465, 532, 585, 630, 654, 690, 718, 746, 774, 802, 830, 866, 906]
noise = rng.standard_normal(len(t))
for c in cuts:
    end = c / FPS
    st = max(0, end - 0.35)
    i0, i1 = int(st * SR), min(len(t), int((end + 0.12) * SR))
    seg = noise[i0:i1].copy()
    seg = sosfilt(butter(2, [400, 5000], btype="band", fs=SR, output="sos"), seg)
    tt = np.linspace(0, 1, i1 - i0)
    shape = np.where(tt < 0.75, (tt / 0.75) ** 2, np.exp(-(tt - 0.75) * 18))
    out[i0:i1, 0] += seg * shape * 0.16
    out[i0:i1, 1] += seg * shape[::-1] * 0.0 + seg * shape * 0.16

fade = np.minimum(1, t / 0.6) * np.minimum(1, (DUR - t) / 0.5)
out *= fade[:, None]
out /= np.abs(out).max() / 0.89
wavfile.write("public/reel/audio.wav", SR, (out * 32767).astype(np.int16))
print("ok")
