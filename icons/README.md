# Item icons

Illustrated menu icons with **Arabic labels baked into the image** (from the
complete drinks & snacks sheet). One file per item id: `icons/<id>.jpg`.

Enabled globally via `menu-data.js`:

```js
window.KAHWA_ICON_DIR = 'icons';
window.KAHWA_LABELED_ICON_IDS  // items whose UI name is hidden
```

`ItemPhoto` loads `KAHWA_ITEM_ICON(item)` and falls back to the built-in SVG
glyph when a file is missing.

## Files in this set (15 from sheet + shay)

| id | الصنف |
|---|---|
| `pepsi.jpg` | بيبسي |
| `seven.jpg` | سفن أب |
| `limon.jpg` | ليمون |
| `ahwa.jpg` | قهوة عربي |
| `tamr.jpg` | تمر هندي |
| `sh-tof.jpg` | شيشة (also used for `sh-3nb`, `sh-mix`) |
| `water-s.jpg` | مياه صغيرة |
| `water-l.jpg` | مياه كبيرة |
| `nescafe.jpg` | قهوة سادة |
| `sodani.jpg` | مكسرات مشكلة |
| `lib-ab.jpg` | لب سوري |
| `bondoq.jpg` | بندق مقشر |
| `helba.jpg` | حلبة |
| `sahlab.jpg` | سحلب |
| `shay.jpg` | شاي (separate asset) |

Items **without** an icon still show their Arabic name in the UI:
`shay-nana`, `yansoon`, `hot-choco`, `karkade`.

`lib-mix.jpg` is cropped from the sheet but not wired to a menu item yet.
