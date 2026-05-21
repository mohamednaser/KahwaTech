// ───────────────────────────────────────────────────────────────
// Variation B — الكاش السريع
// Modern dark teal/cream. Pill category carousel.
// Vertical scrollable LIST of items: photo + name + inline +/- buttons.
// Modifiers expand inline (chips below row) — no modal.
// Right: a tight live order card.
// ───────────────────────────────────────────────────────────────

const fastTokens = {
  bg:       '#0f1a18',
  bg2:      '#152523',
  ink:      '#f3eedf',
  inkSoft:  '#a3b3af',
  cream:    '#f3eedf',
  accent:   '#e8c66a',     // saffron
  accent2:  '#1fb88a',     // mint
  danger:   '#e26a4a',
  rule:     '#2a3a36',
};

function VariationFast({ buttonScale = 1, W = 932, H = 430 }) {
  const [cart, setCart] = React.useState([
    { id:'ahwa', mod:'مظبوط', qty:3 },
    { id:'shay-nana', mod:null, qty:2 },
    { id:'lib-ab', mod:null, qty:1 },
  ]);
  const [activeCat, setActiveCat] = React.useState('hot');
  const [expanded, setExpanded] = React.useState(null); // item id

  const cats = window.KAHWA_CATEGORIES;
  const items = window.KAHWA_BY_CAT(activeCat);
  const addToCart = (item, mod) => {
    setCart(c => {
      const i = c.findIndex(x => x.id === item.id && x.mod === mod);
      if (i >= 0) { const n=[...c]; n[i]={...n[i], qty:n[i].qty+1}; return n; }
      return [...c, { id:item.id, mod, qty:1 }];
    });
  };
  const incQty = (idx, d) => setCart(c => {
    const n = [...c]; n[idx] = { ...n[idx], qty: Math.max(0, n[idx].qty + d) };
    return n.filter(r => r.qty > 0);
  });
  const total = cart.reduce((s,r)=>{ const it=window.KAHWA_ITEMS.find(i=>i.id===r.id); return s + (it?it.price*r.qty:0); }, 0);

  return (
    <div dir="rtl" style={{
      width: W, height: H, background: fastTokens.bg, color: fastTokens.ink,
      fontFamily: '"Cairo", "Tajawal", system-ui, sans-serif',
      display:'flex', flexDirection:'column', position:'relative', overflow:'hidden',
    }}>
      {/* Khayameya stripe accent */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height: 4,
        background: `repeating-linear-gradient(90deg, ${fastTokens.accent} 0 12px, ${fastTokens.accent2} 12px 24px, ${fastTokens.danger} 24px 36px)`,
      }} />

      {/* Top bar */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '10px 16px 6px',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, background: fastTokens.accent,
            color: fastTokens.bg, fontWeight: 900, fontSize: 16,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'system-ui',
          }}>K</div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 15 }}>KahwaTech</div>
            <div style={{ fontSize: 10, color: fastTokens.inkSoft }}>أوردر مفتوح · 14:32</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <div style={{ fontSize: 11, color: fastTokens.inkSoft }}>الموظف</div>
          <div style={{
            background: fastTokens.bg2, padding: '4px 10px', borderRadius: 999,
            fontWeight: 700, fontSize: 12,
          }}>محمود ع.</div>
        </div>
      </div>

      {/* Category pill carousel */}
      <div style={{
        display:'flex', gap: 8, padding: '4px 16px 8px',
        overflowX:'auto', flexShrink: 0,
      }}>
        {cats.map(c => {
          const on = c.id === activeCat;
          const hue = c.hue;
          return (
            <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{
              flex:'0 0 auto', padding: `${10*buttonScale}px ${14*buttonScale}px`,
              background: on ? fastTokens.cream : fastTokens.bg2,
              color: on ? fastTokens.bg : fastTokens.ink,
              border: 'none', borderRadius: 999,
              fontFamily:'inherit', fontWeight: 800, fontSize: 14 * buttonScale,
              cursor:'pointer',
              display:'flex', alignItems:'center', gap: 8,
            }}>
              <span style={{
                width: 20*buttonScale, height: 20*buttonScale, borderRadius: 999,
                background: `oklch(0.75 0.15 ${hue})`,
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                color: '#000', fontSize: 10*buttonScale, fontWeight: 900,
              }}>{c.ar.charAt(0)}</span>
              {c.ar}
            </button>
          );
        })}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display:'flex', minHeight: 0, padding: '0 16px 12px', gap: 12 }}>
        {/* List */}
        <div style={{ flex: 1, display:'flex', flexDirection:'column', gap: 6, overflow:'hidden' }}>
          {items.slice(0, 4).map(item => {
            const isOpen = expanded === item.id;
            return (
              <div key={item.id} style={{
                background: fastTokens.bg2, borderRadius: 16,
                border: `1px solid ${fastTokens.rule}`,
                overflow:'hidden',
              }}>
                <div style={{
                  display:'flex', alignItems:'center', gap: 10, padding: 8,
                }}>
                  <window.ItemPhoto item={item} size={56} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 17 * buttonScale, lineHeight: 1.1 }}>{item.ar}</div>
                    <div style={{ fontSize: 12, color: fastTokens.inkSoft, marginTop: 2 }}>{item.price} ج.م</div>
                  </div>
                  {item.mods && item.mods.length ? (
                    <button onClick={()=>setExpanded(isOpen ? null : item.id)} style={{
                      padding: `${8*buttonScale}px ${12*buttonScale}px`,
                      background:'transparent', color: fastTokens.accent,
                      border:`2px solid ${fastTokens.accent}66`, borderRadius: 12,
                      fontFamily:'inherit', fontWeight: 800, fontSize: 13 * buttonScale,
                      cursor:'pointer',
                    }}>{isOpen ? 'إخفاء' : 'تخصيص'}</button>
                  ) : null}
                  <button onClick={()=>addToCart(item, null)} style={{
                    width: 44 * buttonScale, height: 44 * buttonScale, borderRadius: 14,
                    background: fastTokens.accent, color: fastTokens.bg,
                    border:'none', fontFamily:'inherit', fontWeight: 900,
                    fontSize: 24 * buttonScale, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:`0 4px 0 -1px #a78840`,
                  }}>+</button>
                </div>
                {isOpen && item.mods && (
                  <div style={{
                    display:'flex', gap: 6, flexWrap:'wrap',
                    padding: '0 10px 10px',
                    borderTop: `1px dashed ${fastTokens.rule}`,
                    paddingTop: 8,
                  }}>
                    {item.mods.map(m => (
                      <button key={m} onClick={()=>{ addToCart(item, m); setExpanded(null); }} style={{
                        padding: `${6*buttonScale}px ${12*buttonScale}px`,
                        background: fastTokens.bg, color: fastTokens.ink,
                        border:`1px solid ${fastTokens.accent2}`, borderRadius: 999,
                        fontFamily:'inherit', fontWeight: 700, fontSize: 13 * buttonScale,
                        cursor:'pointer',
                      }}>{m}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {items.length > 4 && (
            <div style={{ fontSize: 11, color: fastTokens.inkSoft, textAlign:'center', opacity:0.6 }}>
              ⌄ مرر للأسفل عشان تشوف باقي الأصناف ({items.length - 4})
            </div>
          )}
        </div>

        {/* Cart */}
        <div style={{
          width: 290, background: fastTokens.cream, color: fastTokens.bg,
          borderRadius: 18, padding: '10px 12px 10px',
          display:'flex', flexDirection:'column', position:'relative',
        }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>الأوردر</div>
            <div style={{ fontSize: 11, color: '#8a7a4a', fontWeight: 800, background: '#fff3c8', padding: '2px 8px', borderRadius: 999 }}>
              {cart.reduce((s,r)=>s+r.qty,0)} صنف
            </div>
          </div>

          <div style={{ flex: 1, display:'flex', flexDirection:'column', gap: 4, overflow:'hidden' }}>
            {cart.length === 0 && (
              <div style={{ fontSize:13, color:'#8a7a4a', padding:24, textAlign:'center' }}>
                ضيف صنف من الشمال
              </div>
            )}
            {cart.map((row, i) => {
              const it = window.KAHWA_ITEMS.find(x => x.id === row.id);
              if (!it) return null;
              return (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap: 8, padding: 4,
                  borderBottom: `1px dashed ${fastTokens.bg}22`,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: `oklch(0.75 0.15 ${window.KAHWA_CATEGORIES.find(c=>c.id===it.cat).hue})`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight: 900, fontSize: 11, color:'#000', fontFamily:'system-ui',
                  }}>×{row.qty}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.1 }}>{it.ar}</div>
                    {row.mod && <div style={{ fontSize: 10, color: '#8a7a4a' }}>{row.mod}</div>}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{it.price * row.qty}</div>
                  <button onClick={()=>incQty(i,+1)} style={miniBtn(buttonScale, fastTokens.accent2)}>+</button>
                  <button onClick={()=>incQty(i,-1)} style={miniBtn(buttonScale, fastTokens.danger)}>−</button>
                </div>
              );
            })}
          </div>

          <div style={{
            background: fastTokens.bg, color: fastTokens.cream,
            borderRadius: 14, padding: '8px 10px', marginTop: 6,
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <div>
              <div style={{ fontSize: 10, opacity: 0.6 }}>الإجمالي</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: fastTokens.accent }}>{total} ج</div>
            </div>
            <button style={{
              padding: `${10*buttonScale}px ${14*buttonScale}px`,
              background: fastTokens.accent2, color: fastTokens.bg, border:'none',
              borderRadius: 12, fontFamily:'inherit', fontWeight: 900,
              fontSize: 14 * buttonScale, cursor:'pointer',
            }}>أرسل ←</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function miniBtn(scale, color) {
  return {
    width: 24 * scale, height: 24 * scale, borderRadius: 7,
    background: color, color:'#fff', border:'none',
    fontFamily:'inherit', fontWeight: 900, fontSize: 14 * scale, cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', padding: 0,
  };
}

window.VariationFast = VariationFast;
