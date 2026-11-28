"""Assemble index.html from src/ and inject the synthetic demo data.

    python3 tools/build.py
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
css = (SRC / "styles.css").read_text(encoding="utf-8")
sidebar = (SRC / "sidebar.html").read_text(encoding="utf-8")
main = (SRC / "main.html").read_text(encoding="utf-8")
app = "\n".join((SRC / f).read_text(encoding="utf-8") for f in ("app.js", "pages.js", "shell.js"))
html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Social Media Intelligence Dashboard V2</title>
<style>{css}</style></head><body><div class="shell">{sidebar}<main class="mainarea"><div class="wrap">
{main}
</div>
<div id="tip" class="tip hidden"></div>
<script>
/*DEMO_DATA_START*//*DEMO_DATA_END*/
</script>
<script>
{app}
</script></main></div></body></html>
"""
(ROOT / "index.html").write_text(html, encoding="utf-8")
subprocess.run([sys.executable, str(ROOT / "tools" / "generate_demo_data.py")], check=True)
