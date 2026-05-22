// ItemPhoto — clean SVG icon system replacing the gradient placeholders.
// Each item gets a categorized icon (glass / fenjan / mug / can / bottle /
// bowl / shisha) drawn in a 64×64 viewBox, tinted with the item's accent
// color, on a soft accent-tinted rounded-square background.
// Hot drinks add steam wisps; cold get optional ice; soda cans get the
// brand-color body; shisha gets a glowing coal.
//
// All vessels share a single dark ink stroke (#241a10) for visual coherence.

const ICON_INK = '#241a10';

function _stroke(s) {
  return { stroke: ICON_INK, strokeWidth: Math.max(1.6, s * 0.04), fill: 'none', strokeLinecap:'round', strokeLinejoin:'round' };
}

function Steam({ x = 32, y = 8 }) {
  // Three small wisps above the vessel
  return (
    <g opacity="0.55">
      <path d={`M${x-8} ${y+10} c -2 -3, 2 -5, 0 -8`} stroke={ICON_INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M${x} ${y+6} c -2 -4, 2 -6, 0 -10`} stroke={ICON_INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M${x+8} ${y+10} c -2 -3, 2 -5, 0 -8`} stroke={ICON_INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function GlassIcon({ accent, hot }) {
  // Tapered drinking glass (kobaya). Wider at top, narrower at bottom.
  // Outer outline: top 16,16 — 48,16 ; bottom 22,54 — 42,54
  return (
    <g>
      {hot && <Steam x={32} y={4} />}
      {/* liquid */}
      <path d="M19 22 L45 22 L42 52 L22 52 Z" fill={accent} opacity="0.85" />
      {/* glass outline */}
      <path d="M16 16 L48 16 L42 54 Q42 56 40 56 L24 56 Q22 56 22 54 Z" fill="none" stroke={ICON_INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* rim ellipse for depth */}
      <ellipse cx="32" cy="16" rx="16" ry="3" fill="none" stroke={ICON_INK} strokeWidth="2.6" />
      {/* liquid surface highlight */}
      <ellipse cx="32" cy="22" rx="12.6" ry="2" fill={accent} stroke={ICON_INK} strokeWidth="1.4" />
    </g>
  );
}

function FenjanIcon({ accent, hot }) {
  // Turkish-coffee fenjan: smaller squat cup with tiny handle, on a saucer.
  return (
    <g>
      {hot && <Steam x={28} y={6} />}
      {/* saucer */}
      <ellipse cx="32" cy="54" rx="22" ry="4" fill="#f3eedf" stroke={ICON_INK} strokeWidth="2.4" />
      {/* coffee */}
      <ellipse cx="28" cy="24" rx="13" ry="2.6" fill={accent} />
      <path d="M15 24 Q15 44 22 48 Q28 51 34 48 Q41 44 41 24" fill={accent} />
      {/* cup outline */}
      <path d="M15 22 Q15 44 22 48 Q28 51 34 48 Q41 44 41 22" fill="none" stroke={ICON_INK} strokeWidth="2.6" strokeLinejoin="round" />
      <ellipse cx="28" cy="22" rx="13" ry="3" fill="none" stroke={ICON_INK} strokeWidth="2.6" />
      {/* tiny handle */}
      <path d="M41 28 Q50 30 49 36 Q48 40 42 39" fill="none" stroke={ICON_INK} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function MugIcon({ accent, hot }) {
  // Tall mug with substantial handle.
  return (
    <g>
      {hot && <Steam x={28} y={6} />}
      {/* liquid */}
      <path d="M14 22 L40 22 L38 50 Q38 52 36 52 L18 52 Q16 52 16 50 Z" fill={accent} opacity="0.9" />
      {/* mug body */}
      <path d="M12 18 L42 18 L40 52 Q40 56 36 56 L18 56 Q14 56 14 52 Z" fill="none" stroke={ICON_INK} strokeWidth="2.6" strokeLinejoin="round" />
      <ellipse cx="27" cy="18" rx="15" ry="3" fill="none" stroke={ICON_INK} strokeWidth="2.6" />
      {/* surface */}
      <ellipse cx="27" cy="22" rx="13" ry="2.4" fill={accent} stroke={ICON_INK} strokeWidth="1.2" />
      {/* handle */}
      <path d="M42 26 Q54 28 54 38 Q54 46 42 46" fill="none" stroke={ICON_INK} strokeWidth="2.6" strokeLinecap="round" />
    </g>
  );
}

function CanIcon({ accent, label }) {
  // Soda can — body is the brand color, white label band with text.
  // Keep label short — 2 chars max for legibility at small sizes.
  const short = label.length > 3 ? label.slice(0, 3) : label;
  return (
    <g>
      {/* shadow ellipse */}
      <ellipse cx="32" cy="58" rx="14" ry="2.4" fill="#241a1011" />
      {/* body */}
      <path d="M18 12 Q18 10 20 10 L44 10 Q46 10 46 12 L44 56 Q44 58 42 58 L22 58 Q20 58 20 56 Z" fill={accent} stroke={ICON_INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* lid */}
      <ellipse cx="32" cy="11" rx="13.5" ry="3" fill="#d8d4ca" stroke={ICON_INK} strokeWidth="2.2" />
      {/* tab */}
      <rect x="29" y="9" width="6" height="2.2" rx="0.6" fill={ICON_INK} />
      {/* label */}
      <rect x="20" y="26" width="24" height="14" fill="#ffffff" />
      <text x="32" y="37" textAnchor="middle" fontFamily='"Tajawal", system-ui' fontWeight="900" fontSize="9" fill={accent}>{short}</text>
      {/* highlight stripe */}
      <path d="M21 14 L21 54" stroke="#ffffff55" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function BottleIcon({ accent }) {
  // Water bottle — slim, light blue body with a cap.
  return (
    <g>
      {/* cap */}
      <rect x="27" y="6" width="10" height="6" rx="1.4" fill="#c83a18" stroke={ICON_INK} strokeWidth="2" />
      {/* neck */}
      <rect x="28" y="12" width="8" height="6" fill="#a8d4e2" stroke={ICON_INK} strokeWidth="2" />
      {/* body */}
      <path d="M22 20 Q22 18 24 18 L40 18 Q42 18 42 20 L42 54 Q42 58 38 58 L26 58 Q22 58 22 54 Z"
            fill={accent} opacity="0.75" stroke={ICON_INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* label band */}
      <rect x="22" y="30" width="20" height="14" fill="#ffffff" stroke={ICON_INK} strokeWidth="1.6" />
      {/* water level lines */}
      <path d="M26 36 Q32 34 38 36" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M26 40 Q32 38 38 40" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

function BowlIcon({ accent, kind = 'oval' }) {
  // Small bowl with one big hero snack on top + 2 small accents.
  // `kind` controls the snack shape so each snack reads distinctly.

  let hero;
  if (kind === 'oval') {
    // لب أبيض — sunflower seed (long pointed almond shape, striped)
    hero = (
      <g transform="translate(32 22) rotate(-15)">
        <ellipse cx="0" cy="0" rx="14" ry="6" fill="#e6d8a8" stroke={ICON_INK} strokeWidth="2.6" />
        {/* dark stripes for visibility */}
        <path d="M-10 -2 Q-6 -4 -2 -2" stroke="#3a2a14" strokeWidth="1.6" fill="none" />
        <path d="M-10 2 Q-6 4 -2 2" stroke="#3a2a14" strokeWidth="1.6" fill="none" />
        <path d="M2 -2 Q6 -4 10 -2" stroke="#3a2a14" strokeWidth="1.6" fill="none" />
        <path d="M2 2 Q6 4 10 2" stroke="#3a2a14" strokeWidth="1.6" fill="none" />
        {/* center seam */}
        <path d="M-12 0 L12 0" stroke={ICON_INK} strokeWidth="1.2" />
      </g>
    );
  } else if (kind === 'round') {
    // سوداني — peanut figure-8
    hero = (
      <g transform="translate(32 22) rotate(-20)">
        {/* outer shape: figure-8 / pinched oval */}
        <path d="M -12 0 Q -12 -8 -5 -8 Q -1 -8 0 -3 Q 1 -8 5 -8 Q 12 -8 12 0 Q 12 8 5 8 Q 1 8 0 3 Q -1 8 -5 8 Q -12 8 -12 0 Z"
              fill="#c89858" stroke={ICON_INK} strokeWidth="2.2" strokeLinejoin="round" />
        {/* texture dots */}
        <circle cx="-6" cy="-3" r="0.9" fill="#6a4218" />
        <circle cx="-5" cy="3" r="0.9" fill="#6a4218" />
        <circle cx="6" cy="-3" r="0.9" fill="#6a4218" />
        <circle cx="5" cy="3" r="0.9" fill="#6a4218" />
        {/* middle pinch */}
        <path d="M -3 0 Q 0 0 3 0" stroke={ICON_INK} strokeWidth="1.4" fill="none" />
      </g>
    );
  } else {
    // بندق — hazelnut: round nut with little leaf-cap on top
    hero = (
      <g transform="translate(32 24)">
        {/* nut body */}
        <circle cx="0" cy="0" r="11" fill="#a87340" stroke={ICON_INK} strokeWidth="2.2" />
        {/* darker rim line */}
        <ellipse cx="0" cy="2" rx="9" ry="6" fill="none" stroke="#5a3a18" strokeWidth="1.2" opacity="0.6" />
        {/* leafy cap on top */}
        <path d="M -8 -8 Q -10 -14 -3 -14 Q 0 -16 3 -14 Q 10 -14 8 -8 Z" fill="#3a8a4a" stroke={ICON_INK} strokeWidth="2" strokeLinejoin="round" />
        {/* highlight */}
        <ellipse cx="-4" cy="-3" rx="3" ry="2" fill="#ffffff55" />
      </g>
    );
  }

  return (
    <g>
      {hero}
      {/* bowl */}
      <path d="M6 38 Q6 36 8 36 L56 36 Q58 36 58 38 Q58 52 42 56 Q32 58 22 56 Q6 52 6 38 Z"
            fill="#fffaf0" stroke={ICON_INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* bowl rim */}
      <ellipse cx="32" cy="38" rx="26" ry="3.4" fill="none" stroke={ICON_INK} strokeWidth="2" />
    </g>
  );
}

function ShishaIcon({ accent, flavor }) {
  // Smaller hookah body, MUCH bigger colored bowl/head + fruit garnish so
  // flavor reads at a glance.
  const headColor = flavor === 'grape' ? '#6a2a8a'
                  : flavor === 'mix'   ? '#c84a18'
                  :                       '#c84a18';   // apple/default

  // Fruit garnish above the head — colored circle with leaf
  const renderFruit = () => {
    if (flavor === 'mix') {
      // Three small fruits clustered
      return (
        <g>
          <circle cx="20" cy="10" r="4" fill="#c84a18" stroke={ICON_INK} strokeWidth="1.6" />
          <circle cx="26" cy="6"  r="4" fill="#6a2a8a" stroke={ICON_INK} strokeWidth="1.6" />
          <circle cx="33" cy="9"  r="4" fill="#3a8a4a" stroke={ICON_INK} strokeWidth="1.6" />
        </g>
      );
    }
    const fruitColor = flavor === 'grape' ? '#6a2a8a' : '#c84a18';
    return (
      <g>
        {/* main fruit */}
        <circle cx="26" cy="8" r="6" fill={fruitColor} stroke={ICON_INK} strokeWidth="2" />
        <ellipse cx="24" cy="6" rx="2" ry="1.3" fill="#ffffff66" />
        {/* leaf */}
        <path d="M26 3 Q31 -1 34 3 Q31 6 26 3 Z" fill="#3a8a4a" stroke={ICON_INK} strokeWidth="1.6" strokeLinejoin="round" />
        {/* stem */}
        <path d="M26 3 L26 1" stroke={ICON_INK} strokeWidth="1.6" strokeLinecap="round" />
      </g>
    );
  };

  return (
    <g>
      {/* fruit garnish */}
      {renderFruit()}
      {/* hose */}
      <path d="M42 32 Q56 32 56 44 Q56 52 49 54" fill="none" stroke="#5a3a1a" strokeWidth="3" strokeLinecap="round" />
      {/* mouthpiece */}
      <rect x="47" y="52" width="6" height="6" rx="1" fill="#241a10" />
      {/* vase (compact) */}
      <ellipse cx="26" cy="54" rx="11" ry="6" fill="#3a1f0a" stroke={ICON_INK} strokeWidth="2.2" />
      <path d="M15 54 Q15 42 22 42 L30 42 Q37 42 37 54" fill="#3a1f0a" stroke={ICON_INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* stem */}
      <rect x="24" y="26" width="4" height="16" fill="#5a3a1a" stroke={ICON_INK} strokeWidth="2" />
      {/* BIG colored bowl/head */}
      <ellipse cx="26" cy="26" rx="11" ry="3" fill={ICON_INK} stroke={ICON_INK} strokeWidth="2" />
      <path d="M15 26 Q15 18 26 18 Q37 18 37 26 Z" fill={headColor} stroke={ICON_INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* coal on top of head */}
      <circle cx="26" cy="20" r="2" fill="#ff7028" />
    </g>
  );
}

// Item-id → glyph kind mapping (overrides item.glyph for special cases)
function glyphFor(item) {
  // Use existing item.glyph but split 'cup' → fenjan for turkish coffee
  if (item.id === 'ahwa') return 'fenjan';
  return item.glyph || 'glass';
}

function ItemPhoto({ item, size = 64, style = {} }) {
  const s = size;
  const accent = item.accent || '#7a6a52';
  const kind = glyphFor(item);
  const hot = item.cat === 'hot';

  // Optional real icon per item. Either set item.icon explicitly, or drop
  // files in a folder and set window.KAHWA_ICON_DIR (e.g. 'icons') to use
  // `<dir>/<id>.png` for every item. If the file is missing or fails to
  // load we fall back to the CSS glyph below — so a partial set is fine.
  const iconSrc = (window.KAHWA_ITEM_ICON && window.KAHWA_ITEM_ICON(item))
    || item.icon
    || (window.KAHWA_ICON_DIR ? `${window.KAHWA_ICON_DIR}/${item.id}.jpg` : null);
  const labeledIcon = window.KAHWA_LABELED_ICON_IDS && window.KAHWA_LABELED_ICON_IDS.has(item.id);
  const [imgError, setImgError] = React.useState(false);
  React.useEffect(() => { setImgError(false); }, [iconSrc]);

  // Render the glyph
  let glyph;
  if (kind === 'glass')   glyph = <GlassIcon accent={accent} hot={hot} />;
  else if (kind === 'fenjan') glyph = <FenjanIcon accent={accent} hot={hot} />;
  else if (kind === 'mug')    glyph = <MugIcon accent={accent} hot={hot} />;
  else if (kind === 'cup')    glyph = <MugIcon accent={accent} hot={hot} />;
  else if (kind === 'can')    {
    // Use brand-specific 2-letter mark
    const mark = item.id === 'pepsi' ? 'P' : item.id === 'seven' ? '7' : item.ar.slice(0,2);
    glyph = <CanIcon accent={accent} label={mark} />;
  }
  else if (kind === 'bottle') glyph = <BottleIcon accent={accent} />;
  else if (kind === 'bowl') {
    const bowlKind = item.id === 'lib-ab' ? 'oval'
                   : item.id === 'sodani' ? 'round'
                   : 'pointy';
    glyph = <BowlIcon accent={accent} kind={bowlKind} />;
  }
  else if (kind === 'pipe') {
    const flavor = item.id === 'sh-tof' ? 'apple'
                 : item.id === 'sh-3nb' ? 'grape'
                 : 'mix';
    glyph = <ShishaIcon accent={accent} flavor={flavor} />;
  }

  const useImg = iconSrc && !imgError;
  const tileH = labeledIcon ? Math.round(s * 1.28) : s;
  return (
    <div style={{
      width: s, height: tileH, borderRadius: labeledIcon ? s * 0.12 : s * 0.22,
      background: useImg ? 'transparent' : `${accent}14`,
      display:'flex', alignItems:'center', justifyContent:'center',
      flexShrink: 0, overflow:'hidden', ...style,
    }}>
      {useImg ? (
        <img src={iconSrc} alt="" draggable={false}
          onError={() => setImgError(true)}
          style={{
            width: s, height: tileH,
            objectFit: labeledIcon ? 'contain' : 'cover',
            display:'block',
          }} />
      ) : (
        <svg width={s * 0.86} height={s * 0.86} viewBox="0 0 64 64" style={{ display:'block' }}>
          {glyph}
        </svg>
      )}
    </div>
  );
}

// ── ModVisual — small icon for a modifier ───────────────────────
// Sugar levels: 0..3 cubes shown above a tiny coffee dot.
// Shisha flavors: colored fruit/leaf icon.
// Fallback: tinted block with first letter.
function ModVisual({ item, mod, size = 48 }) {
  const s = size;
  const sugarLevels = { 'سادة': 0, 'ع الريحة': 1, 'مظبوط': 2, 'زيادة': 3 };
  const flavorColors = {
    'تفاحتين': '#c84a18',
    'عنب':     '#6a2a8a',
    'نعناع':   '#3a8a4a',
    'ليمون':   '#d8b020',
  };

  // Turkish-coffee sugar control
  if (item && item.id === 'ahwa' && sugarLevels[mod] !== undefined) {
    const cubes = sugarLevels[mod];
    return (
      <div style={{
        width: s, height: s, borderRadius: s * 0.22,
        background: '#f5efe2',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 4,
        flexShrink: 0,
      }}>
        {/* sugar cubes row */}
        <div style={{ display:'flex', gap: 3, height: s * 0.22 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: s * 0.18, height: s * 0.18, borderRadius: 3,
              background: i < cubes ? '#f3e3b8' : 'transparent',
              border: `1.5px solid ${i < cubes ? '#a87320' : '#d8c8a8'}`,
            }} />
          ))}
        </div>
        {/* tiny fenjan */}
        <svg width={s * 0.5} height={s * 0.35} viewBox="0 0 32 22">
          <ellipse cx="14" cy="6" rx="11" ry="2.4" fill="#3a1f0a" stroke={ICON_INK} strokeWidth="1.6"/>
          <path d="M3 6 Q3 18 10 20 Q14 21 18 20 Q25 18 25 6" fill="#3a1f0a" stroke={ICON_INK} strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M25 9 Q31 10 30 14 Q29 17 25 17" fill="none" stroke={ICON_INK} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }

  // Shisha flavor — colored coal/fruit
  if (flavorColors[mod]) {
    const c = flavorColors[mod];
    return (
      <div style={{
        width: s, height: s, borderRadius: s * 0.22,
        background: `${c}1a`,
        display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink: 0,
      }}>
        <svg width={s * 0.7} height={s * 0.7} viewBox="0 0 48 48">
          {/* apple-like fruit (we use the same shape but recolor for all flavors) */}
          <circle cx="24" cy="28" r="14" fill={c} stroke={ICON_INK} strokeWidth="2" />
          <ellipse cx="20" cy="22" rx="4" ry="2" fill="#ffffff66" />
          {/* leaf */}
          <path d="M24 14 Q28 8 34 10 Q32 16 26 16 Z" fill="#3a8a4a" stroke={ICON_INK} strokeWidth="1.6" strokeLinejoin="round" />
          {/* stem */}
          <path d="M24 14 L24 10" stroke={ICON_INK} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Fallback: tinted block with first char
  return (
    <div style={{
      width: s, height: s, borderRadius: s * 0.22,
      background: '#efe6d0', color: '#2a1d10',
      display:'flex', alignItems:'center', justifyContent:'center',
      flexShrink: 0,
      fontWeight: 900, fontSize: s * 0.36, fontFamily:'system-ui',
    }}>{(mod || '?').charAt(0)}</div>
  );
}

// Renders the Arabic item name only when the icon does not already include it.
function ItemName({ item, children, style = {} }) {
  if (!item || (window.KAHWA_SHOW_ITEM_NAME && !window.KAHWA_SHOW_ITEM_NAME(item))) return null;
  return <div style={style}>{children ?? item.ar}</div>;
}

window.ItemPhoto = ItemPhoto;
window.ItemIcon = ItemPhoto;  // alias
window.ItemName = ItemName;
window.ModVisual = ModVisual;
