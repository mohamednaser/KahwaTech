# Item icons

Drop one transparent, square (1:1) image per menu item here, named by the
item's **id** with a `.png` extension (e.g. `shay.png`). PNG ≥ 512×512 with a
transparent background, the cup/glass centered with ~12% padding, no baked-in
background or shadow-on-color.

Once the files are in, enable them by setting **one** flag (already supported by
`ItemPhoto`):

```js
window.KAHWA_ICON_DIR = 'icons';
```

`ItemPhoto` then loads `icons/<id>.png` for every item and **falls back to the
built-in CSS glyph** for any file that is missing or fails to load — so a
partial set works fine.

## Filenames expected (23 items)

| id (filename) | الصنف | الفئة |
|---|---|---|
| `shay.png`      | شاي            | سخن |
| `shay-nana.png` | شاي بالنعناع   | سخن |
| `ahwa.png`      | قهوة تركي      | سخن |
| `nescafe.png`   | نسكافيه        | سخن |
| `helba.png`     | حلبة           | سخن |
| `yansoon.png`   | ينسون          | سخن |
| `sahlab.png`    | سحلب           | سخن |
| `hot-choco.png` | هوت شوكولات    | سخن |
| `pepsi.png`     | بيبسي          | سقع |
| `seven.png`     | سفن أب         | سقع |
| `limon.png`     | ليمون          | سقع |
| `karkade.png`   | كركديه         | سقع |
| `tamr.png`      | تمر هندي       | سقع |
| `sh-tof.png`    | شيشة تفاح      | شيشة |
| `sh-3nb.png`    | شيشة عنب       | شيشة |
| `sh-mix.png`    | شيشة ميكس      | شيشة |
| `lib-ab.png`    | لب أبيض        | تسالي |
| `sodani.png`    | سوداني         | تسالي |
| `bondoq.png`    | بندق           | تسالي |
| `water-s.png`   | مياه صغيرة     | مياه |
| `water-l.png`   | مياه كبيرة     | مياه |

> Note: the generated "HOT DRINKS" sheet covers only the 8 سخن items. The
> سقع / شيشة / تسالي / مياه icons still need to be generated the same way.
