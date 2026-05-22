# Item icons

Illustrated menu icons with **Arabic labels baked into the image**. One file per
item id: `icons/<id>.jpg`.

Enabled globally via `menu-data.js`:

```js
window.KAHWA_ICON_DIR = 'icons';
window.KAHWA_LABELED_ICON_IDS  // items whose UI name is hidden
```

`ItemPhoto` loads `KAHWA_ITEM_ICON(item)` and falls back to the built-in SVG
glyph when a file is missing.

## Export size (responsive web)

Full-screen source art is exported at **320×320 px** JPEG (~22–35 KB). That
covers 2× retina up to the largest UI tile without shipping multi-megabyte PNGs.

`ItemPhoto` scales with CSS (`object-fit: contain` for labeled icons; tile
height is `size × 1.28`).

## All menu icons (19)

| id | الصنف |
|---|---|
| `shay.jpg` | شاي |
| `ahwa.jpg` | قهوة تركي |
| `nescafe.jpg` | نسكافيه |
| `helba.jpg` | حلبة |
| `yansoon.jpg` | ينسون |
| `sahlab.jpg` | سحلب |
| `hot-choco.jpg` | هوت شوكليت |
| `pepsi.jpg` | بيبسي |
| `seven.jpg` | سفن أب |
| `limon.jpg` | ليمون |
| `tamr.jpg` | تمر هندي |
| `sh-tof.jpg` | شيشة تفاح |
| `sh-3nb.jpg` | شيشة عنب |
| `sh-mix.jpg` | شيشة ميكس |
| `lib-ab.jpg` | لب أبيض |
| `sodani.jpg` | سوداني |
| `bondoq.jpg` | بندق |
| `water-s.jpg` | مياه صغيرة |
| `water-l.jpg` | مياه كبيرة |

Items **without** an icon still show their Arabic name in the UI:
`shay-nana`, `karkade`.
