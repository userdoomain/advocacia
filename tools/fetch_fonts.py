import re, os, urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(BASE, "fonts")
os.makedirs(FONTS, exist_ok=True)

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
URL = ("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400"
       "&family=Inter:wght@300;400;500;600;700&display=swap")

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

css = get(URL).decode("utf-8")

refs = re.findall(r"https://fonts\.gstatic\.com/([^)]+\.woff2)", css)
print("refs:", len(refs))
done = set()
for path in refs:
    base = os.path.basename(path)
    if base in done:
        continue
    done.add(base)
    dest = os.path.join(FONTS, base)
    if not os.path.exists(dest):
        with open(dest, "wb") as f:
            f.write(get("https://fonts.gstatic.com/" + path))
    print("ok", base)

def local(m):
    return "../fonts/" + os.path.basename(m.group(1))

newcss = re.sub(r"https://fonts\.gstatic\.com/([^)]+\.woff2)", local, css)
with open(os.path.join(BASE, "css", "fonts.css"), "w", encoding="utf-8") as f:
    f.write(newcss)
print("fonts.css rewritten,", len(done), "arquivos locais")