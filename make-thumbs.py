import os
from PIL import Image

# Generates grid/carousel thumbnails in images/Thumb/, mirroring the folder
# structure of the full-size images (images/Cars/X.webp -> images/Thumb/Cars/X.webp).
# Re-run after adding new photos; existing up-to-date thumbnails are skipped.

SOURCE_DIRS = ["Aerial", "Astro", "BandW", "Cars", "Events", "Nature",
               "Night", "People", "Urban", "Album", "Prom"]
THUMB_ROOT = os.path.join("images", "Thumb")
THUMB_WIDTH = 800
QUALITY = 78

def make_thumb(src_path, dst_path):
    img = Image.open(src_path)
    if img.width > THUMB_WIDTH:
        h = round(img.height * THUMB_WIDTH / img.width)
        img = img.resize((THUMB_WIDTH, h), Image.LANCZOS)
    img.save(dst_path, format="WEBP", quality=QUALITY, method=6)

made = skipped = 0
for d in SOURCE_DIRS:
    src_dir = os.path.join("images", d)
    dst_dir = os.path.join(THUMB_ROOT, d)
    os.makedirs(dst_dir, exist_ok=True)
    for name in sorted(os.listdir(src_dir)):
        src = os.path.join(src_dir, name)
        if not (os.path.isfile(src) and name.lower().endswith(".webp")):
            continue
        dst = os.path.join(dst_dir, name)
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            skipped += 1
            continue
        make_thumb(src, dst)
        made += 1
        print(f"{dst}  {os.path.getsize(dst) // 1024} KB")

print(f"Done: {made} created, {skipped} up to date")
