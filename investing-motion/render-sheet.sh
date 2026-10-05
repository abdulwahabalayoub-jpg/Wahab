#!/bin/sh
# Usage: ./render-sheet.sh "f1,f2,..." out.jpg  — renders frames and tiles them for review.
set -e
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
rm -rf out/sheet && npx remotion render InvestingTimeCompounds out/sheet --frames="$1" --image-format=jpeg --browser-executable=$B --log=error
python3 - "$2" <<'PY'
import sys, glob, cv2, numpy as np
fs = sorted(glob.glob('out/sheet/*.jpeg'))
ims = [cv2.resize(cv2.imread(p), (270, 480)) for p in fs]
for p, im in zip(fs, ims): cv2.putText(im, p.split('-')[-1].split('.')[0], (8, 24), 0, 0.7, (0, 0, 255), 2)
while len(ims) % 6: ims.append(np.zeros_like(ims[0]))
rows = [np.hstack(ims[i:i+6]) for i in range(0, len(ims), 6)]
cv2.imwrite(sys.argv[1], np.vstack(rows))
PY
