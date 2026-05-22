// Shared menu data + photographic CSS placeholders for KahwaTech variations
// All items are typical Egyptian baladi-cafe items.

window.KAHWA_CATEGORIES = [
  { id: 'hot',   ar: 'سخن',     en: 'Hot',     hue: 22 },
  { id: 'cold',  ar: 'سقع',     en: 'Cold',    hue: 200 },
  { id: 'shisha',ar: 'شيشة',    en: 'Shisha',  hue: 280 },
  { id: 'snacks',ar: 'تسالي',   en: 'Snacks',  hue: 40 },
  { id: 'water', ar: 'مياه',    en: 'Water',   hue: 190 },
];

// Each item has: id, name (ar), category, price (EGP), photo (CSS for a
// photographic-looking radial gradient that hints at the drink), an
// iconography descriptor (drawn via simple CSS shapes by the variation),
// and optional modifiers.
window.KAHWA_ITEMS = [
  // ── HOT ──
  { id: 'shay',  ar: 'شاي',         cat: 'hot',  price: 15,
    photo: 'radial-gradient(circle at 50% 38%, #8a1e0a 0%, #5a0c00 38%, #260400 70%), radial-gradient(circle at 50% 50%, #3d1a0a, #1a0a05)',
    rim: '#c8a878', glyph: 'glass', accent: '#b9351a', icon: 'icons/shay.jpg' },
  { id: 'shay-nana', ar: 'شاي بالنعناع', cat: 'hot', price: 18,
    photo: 'radial-gradient(circle at 50% 35%, #5e4f1a 0%, #3a3210 40%, #1c1808 75%)',
    rim: '#c8a878', glyph: 'glass', accent: '#7aa83a' },
  { id: 'ahwa',  ar: 'قهوة تركي',    cat: 'hot',  price: 20,
    photo: 'radial-gradient(circle at 50% 35%, #3a1d0a 0%, #1a0b03 45%, #0a0502 75%)',
    rim: '#d4b07a', glyph: 'cup',  accent: '#c69b5a',
    mods: ['سادة','ع الريحة','مظبوط','زيادة'], icon: 'icons/ahwa.jpg' },
  { id: 'nescafe', ar: 'نسكافيه',   cat: 'hot',  price: 25,
    photo: 'radial-gradient(circle at 50% 32%, #f1d9a8 0%, #b88a4a 25%, #4a2a10 60%, #1a0c05 85%)',
    rim: '#e8d4ad', glyph: 'mug',  accent: '#a87340', icon: 'icons/nescafe.jpg' },
  { id: 'helba', ar: 'حلبة',         cat: 'hot',  price: 18,
    photo: 'radial-gradient(circle at 50% 38%, #d8a020 0%, #9a6810 40%, #4a3008 75%)',
    rim: '#c8a878', glyph: 'glass', accent: '#d8a020', icon: 'icons/helba.jpg' },
  { id: 'yansoon', ar: 'ينسون',     cat: 'hot',  price: 18,
    photo: 'radial-gradient(circle at 50% 38%, #c08a30 0%, #7a541a 45%, #2e1f08 78%)',
    rim: '#c8a878', glyph: 'glass', accent: '#c08a30' },
  { id: 'sahlab', ar: 'سحلب',       cat: 'hot',  price: 30,
    photo: 'radial-gradient(circle at 50% 30%, #fff7e8 0%, #ead8b8 38%, #b89870 70%, #5a4828 90%)',
    rim: '#e8d4ad', glyph: 'mug',  accent: '#c89858', icon: 'icons/sahlab.jpg' },
  { id: 'hot-choco', ar: 'هوت شوكليت', cat: 'hot', price: 35,
    photo: 'radial-gradient(circle at 50% 32%, #f1d9a8 0%, #6b3a18 30%, #2a1408 65%, #0e0703 88%)',
    rim: '#e8d4ad', glyph: 'mug',  accent: '#6b3a18' },

  // ── COLD ──
  { id: 'pepsi', ar: 'بيبسي',       cat: 'cold', price: 20,
    photo: 'radial-gradient(circle at 50% 35%, #2a4ea8 0%, #0a1c4a 50%, #02061a 85%)',
    rim: '#e8e8ea', glyph: 'can',  accent: '#2a4ea8', icon: 'icons/pepsi.jpg' },
  { id: 'seven', ar: 'سفن أب',      cat: 'cold', price: 20,
    photo: 'radial-gradient(circle at 50% 35%, #4ea850 0%, #1a5a20 50%, #061a0a 85%)',
    rim: '#e8e8ea', glyph: 'can',  accent: '#4ea850', icon: 'icons/seven.jpg' },
  { id: 'limon', ar: 'ليمون',       cat: 'cold', price: 22,
    photo: 'radial-gradient(circle at 50% 30%, #f4e878 0%, #c8a830 45%, #6a4a10 80%)',
    rim: '#e8d4ad', glyph: 'glass', accent: '#c8a830', icon: 'icons/limon.jpg' },
  { id: 'karkade', ar: 'كركديه',    cat: 'cold', price: 22,
    photo: 'radial-gradient(circle at 50% 32%, #c8123a 0%, #6a0820 45%, #2a0410 80%)',
    rim: '#e8d4ad', glyph: 'glass', accent: '#c8123a' },
  { id: 'tamr', ar: 'تمر هندي',     cat: 'cold', price: 22,
    photo: 'radial-gradient(circle at 50% 32%, #6b3a18 0%, #3a1f08 45%, #160a04 80%)',
    rim: '#e8d4ad', glyph: 'glass', accent: '#6b3a18', icon: 'icons/tamr.jpg' },

  // ── SHISHA ──
  { id: 'sh-tof', ar: 'شيشة تفاح',     cat: 'shisha', price: 60,
    photo: 'radial-gradient(circle at 50% 40%, #3a1f0a 0%, #1a0b03 55%, #050200 85%), radial-gradient(circle at 70% 25%, #c84a18, #6a1a08)',
    rim: '#8a5a30', glyph: 'pipe', accent: '#c84a18', icon: 'icons/sh-tof.jpg',
    mods: ['تفاحتين','عنب','نعناع','ليمون'] },
  { id: 'sh-3nb', ar: 'شيشة عنب',      cat: 'shisha', price: 60,
    photo: 'radial-gradient(circle at 50% 40%, #3a1f0a 0%, #1a0b03 55%, #050200 85%), radial-gradient(circle at 70% 25%, #6a2a8a, #2a0a4a)',
    rim: '#8a5a30', glyph: 'pipe', accent: '#6a2a8a', icon: 'icons/sh-tof.jpg' },
  { id: 'sh-mix', ar: 'شيشة ميكس',     cat: 'shisha', price: 70,
    photo: 'radial-gradient(circle at 50% 40%, #3a1f0a 0%, #1a0b03 55%, #050200 85%), conic-gradient(from 0deg at 70% 25%, #c84a18, #6a2a8a, #4ea850, #c84a18)',
    rim: '#8a5a30', glyph: 'pipe', accent: '#c84a18', icon: 'icons/sh-tof.jpg' },

  // ── SNACKS ──
  { id: 'lib-ab', ar: 'لب أبيض',      cat: 'snacks', price: 10,
    photo: 'radial-gradient(circle at 50% 40%, #e8d8a8 0%, #a88a48 50%, #4a3a18 85%)',
    rim: '#c8a878', glyph: 'bowl', accent: '#c8a878', icon: 'icons/lib-ab.jpg' },
  { id: 'sodani', ar: 'سوداني',       cat: 'snacks', price: 12,
    photo: 'radial-gradient(circle at 50% 40%, #c89858 0%, #8a5a28 50%, #3a2410 85%)',
    rim: '#c8a878', glyph: 'bowl', accent: '#a87340', icon: 'icons/sodani.jpg' },
  { id: 'bondoq', ar: 'بندق',         cat: 'snacks', price: 15,
    photo: 'radial-gradient(circle at 50% 40%, #b87838 0%, #6a4218 50%, #2a1808 85%)',
    rim: '#c8a878', glyph: 'bowl', accent: '#8a5a28', icon: 'icons/bondoq.jpg' },

  // ── WATER ──
  { id: 'water-s', ar: 'مياه صغيرة',  cat: 'water', price: 10,
    photo: 'linear-gradient(180deg, #cfe4ec 0%, #8ab8c8 40%, #4a7a8a 80%, #1a3a4a 100%)',
    rim: '#e8eef0', glyph: 'bottle', accent: '#4a7a8a', icon: 'icons/water-s.jpg' },
  { id: 'water-l', ar: 'مياه كبيرة',  cat: 'water', price: 15,
    photo: 'linear-gradient(180deg, #cfe4ec 0%, #8ab8c8 40%, #4a7a8a 80%, #1a3a4a 100%)',
    rim: '#e8eef0', glyph: 'bottle', accent: '#4a7a8a', icon: 'icons/water-l.jpg' },
];

window.KAHWA_BY_CAT = (cat) => window.KAHWA_ITEMS.filter(i => i.cat === cat);

// Illustration icons (Arabic labels baked into the image) live in icons/<id>.jpg
window.KAHWA_ICON_DIR = 'icons';

// Items whose icon image already shows the name — hide duplicate text in the UI.
window.KAHWA_LABELED_ICON_IDS = new Set([
  'shay', 'ahwa', 'nescafe', 'helba', 'sahlab',
  'pepsi', 'seven', 'limon', 'tamr',
  'sh-tof', 'sh-3nb', 'sh-mix',
  'water-s', 'water-l',
  'sodani', 'lib-ab', 'bondoq',
]);

window.KAHWA_SHOW_ITEM_NAME = (item) =>
  item && !window.KAHWA_LABELED_ICON_IDS.has(item.id);

window.KAHWA_ITEM_ICON = (item) =>
  item.icon || (window.KAHWA_ICON_DIR ? `${window.KAHWA_ICON_DIR}/${item.id}.jpg` : null);
