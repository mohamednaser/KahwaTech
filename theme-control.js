// theme-control.js
// Standalone, persistent theme switcher for the deployed demo.
//
// The screens already support themes via the in-app Tweaks panel, but that
// panel only opens when a design-tool host activates it — so on GitHub Pages
// there is no way to change the theme. This adds an always-visible switcher
// that:
//   • persists the choice in localStorage (survives reloads + page changes)
//   • recolors the launcher's accent via CSS variables
//   • live-updates the React screens by dispatching a `kahwa:theme` event
//     (boufiya.html / menu.html listen for it and re-render)
//
// No build step, no framework — plain DOM so it runs identically on every page.

(function () {
  var KEY = 'kahwa.theme';
  var THEMES = [
    { id: 'cream', ar: 'كريمي', accent: '#a85a2a', deep: '#8a4720', soft: '#ecd9c4' },
    { id: 'sage',  ar: 'رمادي', accent: '#3a6a48', deep: '#2a5236', soft: '#d9e3d4' },
    { id: 'white', ar: 'أبيض',  accent: '#1a3e6a', deep: '#142f50', soft: '#cdd9e8' },
  ];
  var DEFAULT = 'sage';

  function find(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
    return null;
  }

  function get() {
    var v;
    try { v = localStorage.getItem(KEY); } catch (e) { v = null; }
    return find(v) ? v : DEFAULT;
  }

  // Recolors the launcher (and anything reading these vars) without touching
  // the React screens, which compute their own palette from `themeKey`.
  function applyRootVars(id) {
    var t = find(id) || find(DEFAULT);
    var r = document.documentElement.style;
    r.setProperty('--sage', t.accent);
    r.setProperty('--sage-deep', t.deep);
    r.setProperty('--sage-soft', t.soft);
    r.setProperty('--kahwa-accent', t.accent);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t.accent);
  }

  function reflect(id) {
    var btns = document.querySelectorAll('.kt-theme [data-theme]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-checked', btns[i].dataset.theme === id ? 'true' : 'false');
    }
  }

  function set(id, opts) {
    if (!find(id)) return;
    try { localStorage.setItem(KEY, id); } catch (e) { /* private mode — runtime only */ }
    applyRootVars(id);
    reflect(id);
    if (!(opts && opts.silent)) {
      window.dispatchEvent(new CustomEvent('kahwa:theme', { detail: id }));
    }
  }

  var STYLE = ''
    + '.kt-theme{position:fixed;left:16px;bottom:16px;z-index:2147483645;'
    + 'display:flex;align-items:center;gap:8px;padding:6px 8px 6px 10px;border-radius:999px;'
    + 'background:rgba(255,255,255,.82);-webkit-backdrop-filter:blur(20px) saturate(160%);'
    + 'backdrop-filter:blur(20px) saturate(160%);border:1px solid rgba(20,12,5,.10);'
    + 'box-shadow:0 1px 0 rgba(255,255,255,.6) inset,0 10px 30px -12px rgba(20,12,5,.35);'
    + 'font-family:"Tajawal",system-ui,sans-serif;direction:rtl}'
    + '.kt-theme .kt-lbl{font-size:11px;font-weight:700;color:#4a4036;letter-spacing:.01em;'
    + 'padding:0 2px}'
    + '.kt-theme .kt-seg{display:flex;gap:3px;background:rgba(20,12,5,.05);padding:3px;border-radius:999px}'
    + '.kt-theme button{appearance:none;border:0;cursor:pointer;display:flex;align-items:center;gap:6px;'
    + 'padding:5px 11px;border-radius:999px;background:transparent;color:#4a4036;'
    + 'font-family:inherit;font-size:12.5px;font-weight:600;line-height:1;transition:all .18s ease}'
    + '.kt-theme button .dot{width:11px;height:11px;border-radius:999px;'
    + 'box-shadow:0 0 0 1px rgba(20,12,5,.12) inset}'
    + '.kt-theme button:hover{background:rgba(20,12,5,.06)}'
    + '.kt-theme button[aria-checked="true"]{background:#fff;color:#1a1410;'
    + 'box-shadow:0 1px 2px rgba(20,12,5,.18)}'
    + '@media (max-width:560px){.kt-theme .kt-lbl{display:none}'
    + '.kt-theme button span.kt-name{display:none}.kt-theme button{padding:6px}}';

  function build() {
    if (document.querySelector('.kt-theme')) return;
    var style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'kt-theme';
    wrap.setAttribute('role', 'radiogroup');
    wrap.setAttribute('aria-label', 'اختيار الثيم');

    var lbl = document.createElement('span');
    lbl.className = 'kt-lbl';
    lbl.textContent = 'الثيم';
    wrap.appendChild(lbl);

    var seg = document.createElement('div');
    seg.className = 'kt-seg';
    THEMES.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.dataset.theme = t.id;
      b.title = t.ar;
      b.innerHTML = '<span class="dot" style="background:' + t.accent + '"></span>'
        + '<span class="kt-name">' + t.ar + '</span>';
      b.addEventListener('click', function () { set(t.id); });
      seg.appendChild(b);
    });
    wrap.appendChild(seg);
    document.body.appendChild(wrap);
    reflect(get());
  }

  // Public API used by the screen pages to seed their initial theme.
  window.KahwaTheme = { get: get, set: set, themes: THEMES };

  // Paint accent vars as early as possible to avoid a flash on the launcher.
  applyRootVars(get());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
