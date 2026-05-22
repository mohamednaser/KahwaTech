// ───────────────────────────────────────────────────────────────
// Variation C — العرض الجريء
// Bold high-contrast: deep coffee brown + saffron gold + cream.
// CAROUSEL paradigm: one huge item card centered, prev/next peek.
// Modifier picked via segmented chips, qty via tap-to-add (counts up).
// Cart sits as a tall vertical stack on the right.
// ───────────────────────────────────────────────────────────────

const boldTokens = {
  bg:        '#1a0d04',
  bg2:       '#2a1808',
  ink:       '#fff6e0',
  inkSoft:   '#b89868',
  gold:      '#e8a83a',
  cream:     '#f3e3b8',
  red:       '#c8351a',
  rule:      '#3a2814',
};

function VariationBold({ buttonScale = 1, W = 932, H = 430 }) {
  const [cart, setCart] = React.useState([
    { id:'ahwa', mod:'مظبوط', qty:1 },
    { id:'shay', mod:null, qty:2 },
    { id:'sodani', mod:null, qty:1 },
  ]);
  const [activeCat, setActiveCat] = React.useState('hot');
  const [idx, setIdx] = React.useState(0);
  const [pickedMod, setPickedMod] = React.useState(null);

  const cats = window.KAHWA_CATEGORIES;
  const items = window.KAHWA_BY_CAT(activeCat);
  const item = items[idx % items.length];
  const prevItem = items[(idx - 1 + items.length) % items.length];
  const nextItem = items[(idx + 1) % items.length];

  React.useEffect(() => { setIdx(0); setPickedMod(null); }, [activeCat]);

  const addToCart = (it, mod) => {
    setCart(c => {
      const i = c.findIndex(x => x.id === it.id && x.mod === mod);
      if (i >= 0) { const n=[...c]; n[i]={...n[i], qty:n[i].qty+1}; return n; }
      return [...c, { id:it.id, mod, qty:1 }];
    });
  };
  const incQty = (i, d) => setCart(c => {
    const n=[...c]; n[i]={...n[i], qty:Math.max(0, n[i].qty + d)};
    return n.filter(r=>r.qty>0);
  });
  const total = cart.reduce((s,r)=>{ const it=window.KAHWA_ITEMS.find(i=>i.id===r.id); return s + (it?it.price*r.qty:0); }, 0);

  // Subtle paper-cut khayameya background pattern
  const khayamiyaBg = `
    radial-gradient(circle at 30% 30%, ${boldTokens.bg2} 0 14px, transparent 14.5px),
    radial-gradient(circle at 70% 70%, ${boldTokens.bg2} 0 14px, transparent 14.5px),
    linear-gradient(135deg, ${boldTokens.bg} 0%, #0e0703 100%)
  `;

  return (
    <div dir="rtl" style={{
      width: W, height: H, background: khayamiyaBg,
      backgroundSize: '64px 64px, 64px 64px, auto',
      color: boldTokens.ink, fontFamily:'"Cairo","Tajawal",system-ui,sans-serif',
      display:'flex', position:'relative', overflow:'hidden',
    }}>
      {/* ── LEFT (carousel) ── */}
      <div style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding: '10px 16px 4px',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: boldTokens.gold, color: boldTokens.bg,
              fontWeight: 900, fontFamily:'system-ui', fontSize: 16,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>K</div>
            <div style={{
              fontSize: 13, fontWeight: 900, letterSpacing: '0.02em',
              color: boldTokens.cream,
            }}>KAHWATECH</div>
          </div>
          <div style={{ fontSize: 11, color: boldTokens.inkSoft }}>
            أوردر مفتوح · <span style={{ color: boldTokens.gold, fontWeight: 800 }}>#A-148</span>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{
          display:'flex', gap: 6, padding: '4px 16px 6px',
        }}>
          {cats.map(c => {
            const on = c.id === activeCat;
            return (
              <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{
                flex: 1, padding: `${8*buttonScale}px 4px`,
                background:'transparent', color: on ? boldTokens.gold : boldTokens.inkSoft,
                border:'none', borderBottom:`3px solid ${on ? boldTokens.gold : 'transparent'}`,
                fontFamily:'inherit', fontWeight: 900, fontSize: 14 * buttonScale,
                cursor:'pointer', letterSpacing:'0.02em',
              }}>{c.ar}</button>
            );
          })}
        </div>

        {/* Carousel */}
        <div style={{
          flex: 1, position:'relative', display:'flex', alignItems:'center',
          justifyContent:'center', overflow:'hidden',
        }}>
          {/* Prev peek */}
          <PeekCard item={prevItem} side="prev" onClick={()=>setIdx(i => i - 1)} />

          {/* Main card */}
          <div style={{
            position:'relative', zIndex: 2,
            width: 320, padding: '8px 14px 12px',
            background: boldTokens.bg2,
            border: `2px solid ${boldTokens.gold}`,
            borderRadius: 22,
            display:'flex', flexDirection:'column', alignItems:'center',
            boxShadow: `0 16px 40px -12px rgba(0,0,0,0.7), 0 0 0 6px ${boldTokens.bg}`,
          }}>
            <window.ItemPhoto item={item} size={window.KAHWA_SHOW_ITEM_NAME(item) ? 130 : 150} style={{ borderRadius: 999, boxShadow:`0 0 0 4px ${boldTokens.gold}, 0 8px 22px -4px rgba(0,0,0,0.6)` }} />
            <window.ItemName item={item} style={{
              fontSize: 24 * Math.min(buttonScale, 1.3), fontWeight: 900,
              marginTop: 6, color: boldTokens.cream, lineHeight: 1,
            }} />
            <div style={{
              fontSize: 14, color: boldTokens.gold, fontWeight: 800, marginTop: 2,
            }}>{item.price} جنيه</div>

            {/* Modifier chips */}
            {item.mods ? (
              <div style={{ display:'flex', gap: 5, marginTop: 6, flexWrap:'wrap', justifyContent:'center' }}>
                {item.mods.map(m => {
                  const on = pickedMod === m;
                  return (
                    <button key={m} onClick={()=>setPickedMod(on ? null : m)} style={{
                      padding: `${4*buttonScale}px ${10*buttonScale}px`,
                      background: on ? boldTokens.gold : 'transparent',
                      color: on ? boldTokens.bg : boldTokens.cream,
                      border:`1.5px solid ${boldTokens.gold}`,
                      borderRadius: 999, fontFamily:'inherit',
                      fontWeight: 800, fontSize: 12 * buttonScale, cursor:'pointer',
                    }}>{m}</button>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: 8 }} />
            )}

            {/* Add button */}
            <button onClick={()=>{ addToCart(item, pickedMod); setPickedMod(null); }} style={{
              marginTop: 8, width: '100%', padding: `${10*buttonScale}px`,
              background: boldTokens.red, color:'#fff', border:'none',
              borderRadius: 14, fontFamily:'inherit', fontWeight: 900,
              fontSize: 17 * buttonScale, cursor:'pointer',
              boxShadow: `0 6px 0 -2px #7a1f0c`, letterSpacing:'0.04em',
            }}>أضف للأوردر</button>
          </div>

          {/* Next peek */}
          <PeekCard item={nextItem} side="next" onClick={()=>setIdx(i => i + 1)} />

          {/* Arrow controls */}
          <button onClick={()=>setIdx(i => i + 1)} aria-label="next" style={arrowBtn(buttonScale, 'left')}>›</button>
          <button onClick={()=>setIdx(i => i - 1)} aria-label="prev" style={arrowBtn(buttonScale, 'right')}>‹</button>

          {/* Dots */}
          <div style={{
            position:'absolute', bottom: 4, left:'50%', transform:'translateX(-50%)',
            display:'flex', gap: 4,
          }}>
            {items.map((_, i) => (
              <div key={i} style={{
                width: i === (idx % items.length + items.length) % items.length ? 14 : 5,
                height: 5, borderRadius: 999,
                background: i === (idx % items.length + items.length) % items.length ? boldTokens.gold : boldTokens.inkSoft,
                opacity: i === (idx % items.length + items.length) % items.length ? 1 : 0.4,
                transition: 'width 200ms',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT (cart) ── */}
      <div style={{
        width: 270, background: boldTokens.cream, color: boldTokens.bg,
        display:'flex', flexDirection:'column', position:'relative',
      }}>
        {/* Khayameya top edge */}
        <div style={{
          height: 8,
          background: `linear-gradient(90deg, ${boldTokens.red} 0 33%, ${boldTokens.gold} 33% 66%, #3a6a48 66%)`,
        }} />
        <div style={{ padding: '10px 14px 4px' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>الأوردر</div>
            <div style={{ fontSize: 11, color: '#8a5a2a', fontWeight: 800 }}>{cart.reduce((s,r)=>s+r.qty,0)} صنف</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 10px', display:'flex', flexDirection:'column', gap: 6, overflow:'hidden' }}>
          {cart.length === 0 && (
            <div style={{ fontSize:13, padding:24, textAlign:'center', color:'#8a5a2a' }}>
              لسه فاضي — دوس على أي صنف
            </div>
          )}
          {cart.map((row, i) => {
            const it = window.KAHWA_ITEMS.find(x => x.id === row.id);
            if (!it) return null;
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap: 8,
                background:'#fff', borderRadius: 12, padding: '4px 6px',
                border: `1px solid ${boldTokens.bg}10`,
              }}>
                <div style={{
                  width: 28 * buttonScale, minWidth: 28 * buttonScale,
                  height: 28 * buttonScale,
                  borderRadius: 8, background: boldTokens.bg,
                  color: boldTokens.gold, fontWeight: 900,
                  fontSize: 14 * buttonScale, fontFamily:'system-ui',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{row.qty}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <window.ItemName item={it} style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.1 }} />
                  {row.mod && <div style={{ fontSize: 10, color: boldTokens.red, fontWeight: 700 }}>{row.mod}</div>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{it.price * row.qty}</div>
                <button onClick={()=>incQty(i,-1)} style={{
                  width: 22, height: 22, borderRadius: 6, padding:0,
                  background: 'transparent', color: boldTokens.red,
                  border:`1.5px solid ${boldTokens.red}66`,
                  fontFamily:'inherit', fontWeight: 900, fontSize: 14, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>−</button>
              </div>
            );
          })}
        </div>

        {/* Total + send */}
        <div style={{ padding: '8px 12px 10px' }}>
          <div style={{
            background: boldTokens.bg, color: boldTokens.cream,
            borderRadius: 14, padding: '8px 12px',
            display:'flex', alignItems:'baseline', justifyContent:'space-between',
          }}>
            <span style={{ fontSize: 13, opacity: 0.7 }}>الإجمالي</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: boldTokens.gold }}>{total} <span style={{ fontSize: 13, color: boldTokens.inkSoft }}>ج</span></span>
          </div>
          <button style={{
            marginTop: 8, width: '100%', padding: `${12*buttonScale}px`,
            background: '#3a6a48', color:'#fff', border:'none',
            borderRadius: 14, fontFamily:'inherit', fontWeight: 900,
            fontSize: 17 * buttonScale, cursor:'pointer',
            boxShadow: `0 6px 0 -2px #1f3a26`, letterSpacing:'0.04em',
          }}>إرسال للبوفية</button>
        </div>
      </div>
    </div>
  );
}

function PeekCard({ item, side, onClick }) {
  return (
    <button onClick={onClick} style={{
      position:'absolute', top:'50%', transform:'translateY(-50%)',
      [side === 'prev' ? 'right' : 'left']: 8,
      width: 110, height: 200, padding: 10,
      background: boldTokens.bg2, opacity: 0.55,
      border:`1px solid ${boldTokens.rule}`, borderRadius: 18, cursor:'pointer',
      display:'flex', flexDirection:'column', alignItems:'center', gap: 6,
      [side === 'prev' ? 'marginRight' : 'marginLeft']: -28,
      transition:'opacity 200ms',
    }}>
      <window.ItemPhoto item={item} size={window.KAHWA_SHOW_ITEM_NAME(item) ? 70 : 82} style={{ borderRadius: 999, boxShadow:`0 0 0 2px ${boldTokens.gold}55` }} />
      <window.ItemName item={item} style={{
        fontSize: 13, fontWeight: 800, color: boldTokens.cream,
        textAlign:'center', lineHeight: 1, fontFamily:'inherit',
      }} />
      <div style={{ fontSize: 11, color: boldTokens.gold, fontWeight: 800 }}>{item.price} ج</div>
    </button>
  );
}

function arrowBtn(scale, side) {
  return {
    position:'absolute', top:'50%', transform:'translateY(-50%)',
    [side]: 4,
    width: 34 * scale, height: 34 * scale, borderRadius: 999, padding: 0,
    background: boldTokens.gold, color: boldTokens.bg,
    border:'none', fontFamily:'system-ui', fontWeight: 900,
    fontSize: 28 * scale, cursor:'pointer', zIndex: 4,
    display:'flex', alignItems:'center', justifyContent:'center', lineHeight: 1,
    boxShadow:'0 4px 12px -2px rgba(0,0,0,0.6)',
  };
}

window.VariationBold = VariationBold;
