# Builds the vertical reel's layers from the 10 brand slides.
import numpy as np
from PIL import Image
import sys, shutil
SRC = sys.argv[1]
OUT = "public/reel/"

def load(n):
    return np.asarray(Image.open(f"{SRC}/{n}.jpg").convert("RGB")).astype(np.float32)

def mask_from(img, bg, box=None, pad=12):
    # Alpha = distance from the flat background colour, as a white glyph.
    if box:
        x0, y0, x1, y1 = box
        img = img[y0:y1, x0:x1]
    d = np.sqrt(((img - np.array(bg, np.float32)) ** 2).sum(-1))
    a = np.clip((d - 10) / 60, 0, 1)
    ys, xs = np.where(a > 0.05)
    y0, y1, x0, x1 = ys.min() - pad, ys.max() + pad, xs.min() - pad, xs.max() + pad
    a = a[max(y0, 0):y1, max(x0, 0):x1]
    rgba = np.zeros(a.shape + (4,), np.uint8)
    rgba[..., :3] = 255
    rgba[..., 3] = (a * 255).astype(np.uint8)
    return Image.fromarray(rgba)

DARK, MUTED, ECRU = (63, 67, 53), (106, 109, 82), (227, 227, 220)

mask_from(load(4), DARK, (600, 150, 1400, 960)).save(OUT + "mark.png")
mask_from(load(5), MUTED, (600, 150, 1400, 960)).save(OUT + "curves.png")
mask_from(load(6), ECRU, (600, 150, 1400, 960)).save(OUT + "vine.png")
icons = load(10)
bgs = [DARK, MUTED, ECRU, DARK, MUTED]
for i, bg in enumerate(bgs):
    mask_from(icons, bg, (i * 400 + 20, 330, i * 400 + 380, 780)).save(OUT + f"icon{i}.png")
    mask_from(icons, bg, (i * 400 + 10, 830, i * 400 + 390, 930), pad=6).save(OUT + f"label{i}.png")
mask_from(load(3), ECRU, (240, 580, 760, 790)).save(OUT + "wordmark.png")

typ = Image.open(f"{SRC}/9.jpg")
for i in range(3):
    typ.crop((i * 667 + 2, 0, i * 667 + 665, 1125)).save(OUT + f"type{i}.jpg", quality=92)
for n, name in [(1, "concept"), (2, "construction"), (3, "fulllogo"), (7, "pattern"), (8, "colors")]:
    shutil.copy(f"{SRC}/{n}.jpg", OUT + f"{name}.jpg")

# Coloured variants (Img preloads reliably; CSS masks do not delay the render).
import json, glob, os
COLS = {"ecru": ECRU, "dark": DARK}
for f in glob.glob(OUT + "*.png"):
    base = os.path.basename(f)[:-4]
    if "_" in base:
        continue
    a = np.asarray(Image.open(f))[..., 3]
    for cname, c in COLS.items():
        rgba = np.zeros(a.shape + (4,), np.uint8)
        rgba[..., :3] = c
        rgba[..., 3] = a
        Image.fromarray(rgba).save(OUT + f"{base}_{cname}.png")

# Anchor points along the mark, as fractions of its box, for the "vector edit" shot.
a = np.asarray(Image.open(OUT + "mark.png"))[..., 3] > 128
ys, xs = np.where(a)
rng = np.random.default_rng(3)
order = rng.permutation(len(xs))
pts = []
for i in order:
    x, y = xs[i], ys[i]
    if all((x - px) ** 2 + (y - py) ** 2 > 38 ** 2 for px, py in pts):
        pts.append((int(x), int(y)))
h, w = a.shape
json.dump([[round(x / w, 4), round(y / h, 4)] for x, y in pts], open(OUT + "anchors.json", "w"))
print(len(pts), "anchors")
