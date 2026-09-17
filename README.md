# martina
[Client work] A dynamic portfolio website for artist Martina Jakobsson

A static AngularJS site served straight off the `gh-pages` branch — no build step.

## Images

Two sizes of every painting, both WebP:

| | | |
|---|---|---|
| `data/thumbs/` | max 600px | the gallery grid, lazy-loaded |
| `data/gallery/` | max 1600px | the lightroom, loaded on click |
| `data/about/` | max 1200px | the about page |

The site has no image paths in its data — it derives them from the painting's
title (spaces to underscores, lowercase), so `"Sol över Sidikauki"` is served
from `data/thumbs/sol_över_sidikauki.webp`.

## Adding a painting

1. Save the photo into `data/gallery/` as a `.jpg` named after the title:
   `sol_över_sidikauki.jpg`.
2. Add an entry at the top of `data/gallery.json` — new work goes first:

   ```json
   {
     "name": "Sol över Sidikauki",
     "info": "Acrylics on canvas, 100cm x 99cm"
   }
   ```

   `info` is `<medium>, <height> x <width>`; the lightroom splits it on the
   comma. Leave `width`/`height` out — the next step fills them in.
3. Run `./bin/optimise.sh` (needs `brew install webp`). It converts the photo to
   WebP, builds the thumbnail, and writes each entry's `width`/`height` — the
   thumbnail's pixel size, which reserves space in the grid so lazy loading
   works.

Re-running `./bin/optimise.sh` is always safe: it only converts what's new, and
it warns about a painting with no entry in `gallery.json` or an entry with no
painting.
