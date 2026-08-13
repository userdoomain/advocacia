import re, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(BASE, "css", "fonts.css")

with open(CSS, encoding="utf-8") as f:
    css = f.read()

blocks = re.split(r"(/\* .+? \*/)", css)
kept = [blocks[0]]
used = []
for i in range(1, len(blocks), 2):
    header = blocks[i]
    body = blocks[i + 1] if i + 1 < len(blocks) else ""
    if "/* latin */" in header:
        kept.append(header)
        kept.append(body)
        used += re.findall(r"url\(\.\./fonts/([^)]+\.woff2)\)", body)

with open(CSS, "w", encoding="utf-8") as f:
    f.write("".join(kept))

remaining = [u for u in sorted(os.listdir(os.path.join(BASE, "fonts"))) if u.endswith(".woff2")]
for name in remaining:
    if name not in used:
        os.remove(os.path.join(BASE, "fonts", name))

print("latin blocks:", len(used), "| arquivos mantidos:", len(used))
for u in sorted(used):
    print(" -", u[:60])