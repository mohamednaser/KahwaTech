// ───────────────────────────────────────────────────────────────
// Variation A — البلدي المودرن
// Warm earthy palette, subtle Islamic geometric pattern accent.
// 3×2 grid of large photo cards · right sidebar live cart.
// Modifiers picked via a center bottom sheet with chip selectors.
// ───────────────────────────────────────────────────────────────

const baladiTokens = {
  bg:        '#f5ecdb',
  ink:       '#241612',
  inkSoft:   '#5a3e2a',
  card:      '#fffaf0',
  cardSoft:  '#efe1c3',
  terracotta:'#b9351a',
  saffron:   '#c89858',
  green:     '#3a6a48',
  rule:      '#d4bd92',
  shadow:    '0 8px 24px -10px rgba(60,30,10,0.35), 0 2px 6px -2px rgba(60,30,10,0.25)',
};

// Subtle 8-point star pattern (CSS-only, repeating)
const arabesqueBg = `
  radial-gradient(circle at 0 0, transparent 9px, ${baladiTokens.saffron}11 9.5px, ${baladiTokens.saffron}11 10px, transparent 10.5px),
  radial-gradient(circle at 20px 20px, transparent 9px, ${baladiTokens.saffron}11 9.5px, ${baladiTokens.saffron}11 10px, transparent 10.5px),
  linear-gradient(${baladiTokens.bg}, ${baladiTokens.bg})
`;

function VariationBaladi({ buttonScale = 1, W = 932, H = 430 }) {
  const [cart, setCart] = React.useState([
    { id:'shay', mod:'مظبوط', qty:2 },
    { id:'sh-tof', mod:'تفاحتين', qty:1 },
  ]);
  const [activeCat, setActiveCat] = React.useState('hot');
  const [pickingMods, setPickingMods] = React.useState(null); // item or null

  const cats = window.KAHWA_CATEGORIES;
  const items = window.KAHWA_BY_CAT(activeCat);

  const addToCart = (item, mod) => {
    setCart(c => {
      const i = c.findIndex(x => x.id === item.id && x.mod === mod);
      if (i >= 0) {
        const n = [...c]; n[i] = { ...n[i], qty: n[i].qty + 1 }; return n;
      }
      return [...c, { id: item.id, mod, qty: 1 }];
    });
  };
  const tap = (item) => {
    if (item.mods && item.mods.length) setPickingMods(item);
    else addToCart(item, null);
  };
  const incQty = (idx, d) => setCart(c => {
    const n = [...c]; n[idx] = { ...n[idx], qty: Math.max(0, n[idx].qty + d) };
    return n.filter(r => r.qty > 0);
  });

  const total = cart.reduce((s, r) => {
    const it = window.KAHWA_ITEMS.find(i => i.id === r.id);
    return s + (it ? it.price * r.qty : 0);
  }, 0);

  const cardSize = 100 * buttonScale;

  return (
    <div dir="rtl" style={{
      width: W, height: H, background: arabesqueBg, backgroundSize: '40px 40px, 40px 40px, auto',
      color: baladiTokens.ink, fontFamily: '"Cairo", "Tajawal", system-ui, sans-serif',
      display: 'flex', position:'relative', overflow:'hidden',
    }}>
      {/* ── MENU SIDE ── */}
      <div style={{ flex: 1, padding: '14px 16px', display:'flex', flexDirection:'column', gap: 10, minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <BaladiLogo />
          <div style={{ flex: 1, height: 1, background: baladiTokens.rule }} />
          <div style={{ fontSize: 11, color: baladiTokens.inkSoft, fontWeight: 600 }}>
            <span style={{ background:baladiTokens.cardSoft, padding:'4px 10px', borderRadius:999 }}>الموظف: أحمد</span>
          </div>
        </div>

        {/* Category strip */}
        <div style={{ display:'flex', gap: 8 }}>
          {cats.map(c => {
            const on = c.id === activeCat;
            return (
              <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{
                flex: 1, padding: `${10*buttonScale}px 8px`,
                background: on ? baladiTokens.terracotta : baladiTokens.card,
                color: on ? '#fff' : baladiTokens.ink,
                border: `2px solid ${on ? baladiTokens.terracotta : baladiTokens.rule}`,
                borderRadius: 14, fontFamily:'inherit', fontWeight: 800,
                fontSize: 16 * buttonScale, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
                boxShadow: on ? baladiTokens.shadow : 'none',
              }}>
                <CategoryGlyph cat={c.id} color={on ? '#fff' : baladiTokens.terracotta} size={18*buttonScale} />
                <span>{c.ar}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div style={{
          flex: 1, display:'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: cardSize + 50, gap: 10, alignContent:'start',
          overflow:'hidden',
        }}>
          {items.slice(0, 6).map(item => (
            <button key={item.id} onClick={()=>tap(item)} style={{
              background: baladiTokens.card,
              border: `2px solid ${baladiTokens.rule}`,
              borderRadius: 18, padding: 8, cursor:'pointer',
              display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
              boxShadow: baladiTokens.shadow, fontFamily:'inherit',
              transition:'transform 80ms',
            }}>
              <window.ItemPhoto item={item} size={cardSize - 18} />
              <div style={{
                fontWeight: 800, fontSize: 14 * buttonScale, color: baladiTokens.ink,
                lineHeight: 1.1, textAlign:'center', marginTop: 2,
              }}>{item.ar}</div>
              <div style={{
                fontSize: 11 * buttonScale, color: baladiTokens.terracotta, fontWeight: 800,
              }}>{item.price} ج</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── CART SIDEBAR ── */}
      <div style={{
        width: 280, background: baladiTokens.ink, color: '#f5ecdb',
        display:'flex', flexDirection:'column', padding: '14px 14px 10px',
        position:'relative',
      }}>
        {/* Decorative top stripe */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height: 6,
          background: `repeating-linear-gradient(90deg, ${baladiTokens.terracotta} 0 8px, ${baladiTokens.saffron} 8px 16px, ${baladiTokens.green} 16px 24px)`,
        }} />
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginTop:4, marginBottom: 6 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>الأوردر الحالي</div>
          <div style={{ fontSize: 12, color: baladiTokens.saffron, fontWeight: 700 }}>#A-148</div>
        </div>

        <div style={{ flex: 1, overflow:'hidden', display:'flex', flexDirection:'column', gap: 6 }}>
          {cart.length === 0 && (
            <div style={{ opacity: 0.5, fontSize: 13, padding: 20, textAlign:'center' }}>
              دوس على أي صنف عشان تضيفه للأوردر
            </div>
          )}
          {cart.map((row, i) => {
            const it = window.KAHWA_ITEMS.find(x => x.id === row.id);
            if (!it) return null;
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap: 8,
                background:'#3a2614', borderRadius: 12, padding: '6px 8px',
              }}>
                <window.ItemPhoto item={it} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.1 }}>{it.ar}</div>
                  {row.mod && <div style={{ fontSize: 11, color: baladiTokens.saffron, fontWeight: 600 }}>{row.mod}</div>}
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{it.price * row.qty} ج</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap: 4 }}>
                  <button onClick={()=>incQty(i,-1)} style={qbtn(buttonScale, '#fff')}>−</button>
                  <div style={{ width: 22, textAlign:'center', fontWeight: 900, fontSize: 16 }}>{row.qty}</div>
                  <button onClick={()=>incQty(i,+1)} style={qbtn(buttonScale, baladiTokens.terracotta)}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals + send */}
        <div style={{ borderTop: `1px dashed ${baladiTokens.saffron}66`, paddingTop: 8, marginTop: 6 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 13, opacity: 0.8 }}>
            <span>عدد الأصناف</span><span>{cart.reduce((s,r)=>s+r.qty,0)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 22, fontWeight: 900, marginTop: 2 }}>
            <span>الإجمالي</span><span style={{ color: baladiTokens.saffron }}>{total} ج</span>
          </div>
          <button style={{
            marginTop: 8, width: '100%', padding: `${12*buttonScale}px`,
            background: baladiTokens.terracotta, color:'#fff', border: 'none',
            borderRadius: 14, fontFamily:'inherit', fontWeight: 900,
            fontSize: 18 * buttonScale, cursor:'pointer',
            boxShadow:`0 6px 0 -2px #7a1f0c, 0 8px 18px -4px rgba(0,0,0,0.5)`,
          }}>إرسال للبوفية ←</button>
        </div>
      </div>

      {/* ── MODIFIER SHEET ── */}
      {pickingMods && (
        <div onClick={()=>setPickingMods(null)} style={{
          position:'absolute', inset:0, background:'rgba(20,10,5,0.55)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex: 5,
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background: baladiTokens.card, borderRadius: 20, padding: 16,
            width: 540, boxShadow: baladiTokens.shadow,
            border: `2px solid ${baladiTokens.rule}`,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
              <window.ItemPhoto item={pickingMods} size={60} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{pickingMods.ar}</div>
                <div style={{ fontSize: 13, color: baladiTokens.inkSoft }}>اختار التحضير</div>
              </div>
            </div>
            <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
              {pickingMods.mods.map(m => (
                <button key={m} onClick={()=>{ addToCart(pickingMods, m); setPickingMods(null); }} style={{
                  padding: `${10*buttonScale}px ${16*buttonScale}px`,
                  background: baladiTokens.card, color: baladiTokens.ink,
                  border:`2px solid ${baladiTokens.terracotta}`, borderRadius: 14,
                  fontFamily:'inherit', fontWeight: 800, fontSize: 16 * buttonScale, cursor:'pointer',
                }}>{m}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function qbtn(scale, color) {
  return {
    width: 28 * scale, height: 28 * scale, borderRadius: 8,
    background:'transparent', color, border:`2px solid ${color}`,
    fontFamily:'inherit', fontWeight: 900, fontSize: 16 * scale, cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', padding: 0,
  };
}

function BaladiLogo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: baladiTokens.terracotta, color:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontWeight: 900, fontSize: 14, fontFamily:'system-ui',
        boxShadow: baladiTokens.shadow,
      }}>K</div>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 900 }}>KahwaTech</div>
        <div style={{ fontSize: 9, color: baladiTokens.inkSoft, letterSpacing: '0.04em' }}>قهوة الأهلي · فرع الزمالك</div>
      </div>
    </div>
  );
}

function CategoryGlyph({ cat, color, size = 18 }) {
  const stroke = Math.max(1.5, size * 0.1);
  if (cat === 'hot') {
    // steaming cup
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M5 11h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4v-5z" stroke={color} strokeWidth={stroke}/>
        <path d="M16 12h2a2 2 0 010 4h-2" stroke={color} strokeWidth={stroke}/>
        <path d="M8 4c0 2 2 2 2 4M12 4c0 2 2 2 2 4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
      </svg>
    );
  }
  if (cat === 'cold') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M6 6h12l-1.5 13a2 2 0 01-2 1.8h-5a2 2 0 01-2-1.8L6 6z" stroke={color} strokeWidth={stroke}/>
        <path d="M9 10h6" stroke={color} strokeWidth={stroke}/>
      </svg>
    );
  }
  if (cat === 'shisha') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="18" rx="4" ry="2.5" stroke={color} strokeWidth={stroke}/>
        <path d="M12 16V6" stroke={color} strokeWidth={stroke}/>
        <circle cx="12" cy="5" r="2.5" stroke={color} strokeWidth={stroke}/>
      </svg>
    );
  }
  if (cat === 'snacks') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 13h16l-2 6a2 2 0 01-2 1.5H8a2 2 0 01-2-1.5l-2-6z" stroke={color} strokeWidth={stroke}/>
        <ellipse cx="12" cy="11" rx="8" ry="2" stroke={color} strokeWidth={stroke}/>
      </svg>
    );
  }
  if (cat === 'water') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z" stroke={color} strokeWidth={stroke}/>
      </svg>
    );
  }
}

window.VariationBaladi = VariationBaladi;
