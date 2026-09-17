#!/usr/bin/env bash
#
# Optimises the site's images. Safe to re-run — it only does work that's needed.
#
#   data/gallery/  full-size WebP, max 1600px  — shown in the lightroom
#   data/thumbs/   small WebP, max 600px       — shown in the gallery grid
#   data/about/    WebP, max 1200px            — shown on the about page
#
# Drop a new painting into data/gallery/ as a .jpg (named after its title, spaces
# as underscores, lowercase) and run this. The .jpg is converted to WebP and the
# matching thumbnail is generated. Remember to add the entry to data/gallery.json.
#
# Needs cwebp (brew install webp) and sips (built into macOS).

set -euo pipefail
cd "$(dirname "$0")/.."

GALLERY_MAX=1600
THUMB_MAX=600
ABOUT_MAX=1200
GALLERY_Q=80
THUMB_Q=72

command -v cwebp >/dev/null || { echo "cwebp not found — brew install webp"; exit 1; }

# Longest edge of an image.
longest () {
  sips -g pixelWidth -g pixelHeight "$1" \
    | awk '/pixel(Width|Height)/ { if ($2 > m) m = $2 } END { print m }'
}

# encode <src> <dest> <max-edge> <quality>
# Only ever scales down: upscaling a small original inflates the file for no gain.
encode () {
  local src=$1 dest=$2 max=$3 q=$4
  local w h resize=()
  w=$(sips -g pixelWidth "$src" | awk '/pixelWidth/ { print $2 }')
  h=$(sips -g pixelHeight "$src" | awk '/pixelHeight/ { print $2 }')
  if [ "$(longest "$src")" -gt "$max" ]; then
    if [ "$w" -ge "$h" ]; then resize=(-resize "$max" 0); else resize=(-resize 0 "$max"); fi
  fi
  mkdir -p "$(dirname "$dest")"
  # ${a[@]+"${a[@]}"} so an empty array is not an "unbound variable" on bash 3.2
  cwebp -quiet -q "$q" -metadata none ${resize[@]+"${resize[@]}"} "$src" -o "$dest"
}

converted=0 thumbed=0 pruned=0

# 1. Any JPEG dropped into data/gallery becomes the full-size WebP.
for jpg in data/gallery/*.jpg; do
  [ -e "$jpg" ] || continue
  encode "$jpg" "${jpg%.jpg}.webp" "$GALLERY_MAX" "$GALLERY_Q"
  rm "$jpg"
  converted=$((converted + 1))
done

# 2. A thumbnail per full-size image, rebuilt when the source is newer.
for src in data/gallery/*.webp; do
  [ -e "$src" ] || continue
  thumb="data/thumbs/$(basename "$src")"
  if [ ! -e "$thumb" ] || [ "$src" -nt "$thumb" ]; then
    encode "$src" "$thumb" "$THUMB_MAX" "$THUMB_Q"
    thumbed=$((thumbed + 1))
  fi
done

# 3. Thumbnails whose painting has been removed.
for thumb in data/thumbs/*.webp; do
  [ -e "$thumb" ] || continue
  if [ ! -e "data/gallery/$(basename "$thumb")" ]; then
    rm "$thumb"
    pruned=$((pruned + 1))
  fi
done

# 4. About-page photographs.
for jpg in data/about/*.jpg; do
  [ -e "$jpg" ] || continue
  encode "$jpg" "${jpg%.jpg}.webp" "$ABOUT_MAX" "$GALLERY_Q"
  rm "$jpg"
  converted=$((converted + 1))
done

printf '%d converted, %d thumbnails built, %d stale thumbnails removed\n' \
  "$converted" "$thumbed" "$pruned"

# 5. Keep the derived width/height in gallery.json in step with the thumbnails,
#    and point out anything that has a painting but no entry, or the reverse.
python3 - <<'PY'
import io, json, os, re, subprocess, unicodedata

path = 'data/gallery.json'
entries = json.load(io.open(path, encoding='utf-8'))

def filename(name):
    return unicodedata.normalize('NFC', name.replace(' ', '_').lower() + '.webp')

def dimensions(p):
    out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', p],
                         capture_output=True, text=True).stdout
    return (int(re.search(r'pixelWidth: (\d+)', out).group(1)),
            int(re.search(r'pixelHeight: (\d+)', out).group(1)))

blocks, updated, missing = [], 0, []
for e in entries:
    thumb = os.path.join('data/thumbs', filename(e['name']))
    if os.path.exists(thumb):
        w, h = dimensions(thumb)
        if (w, h) != (e.get('width'), e.get('height')):
            updated += 1
        e['width'], e['height'] = w, h
    else:
        missing.append(e['name'])
    blocks.append('  {\n    "name": "%s",\n    "info": "%s",\n'
                  '    "width": %s,\n    "height": %s\n  }'
                  % (unicodedata.normalize('NFC', e['name']), e['info'],
                     e.get('width', 'null'), e.get('height', 'null')))

io.open(path, 'w', encoding='utf-8').write('[\n' + ',\n'.join(blocks) + '\n]\n')

listed = {filename(e['name']) for e in entries}
orphans = sorted(f for f in os.listdir('data/gallery')
                 if f.endswith('.webp') and unicodedata.normalize('NFC', f) not in listed)

print('gallery.json: %d entries, %d dimensions updated' % (len(entries), updated))
for name in missing:
    print('  ! "%s" is in gallery.json but has no image' % name)
for f in orphans:
    print('  ! %s has no entry in gallery.json — it will not appear on the site' % f)
PY

du -sh data/gallery data/thumbs data/about | sed 's/^/  /'
