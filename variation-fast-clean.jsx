// ───────────────────────────────────────────────────────────────
// Variation B v2 — الكاش السريع (نظيف)
// Single fixed palette: sage (muted green) on a light background · Tajawal.
// ───────────────────────────────────────────────────────────────

const FAST_THEMES = {
  sage: {
    bg:      '#f4f4f0',
    surface: '#ffffff',
    ink:     '#1a1a14',
    inkSoft: '#7a7a6a',
    accent:  '#3a6a48',     // muted green
    accentInk:'#ffffff',
    rule:    '#e2e2dc',
    pillBg:  '#eaeae2',
  },
};

function VariationFastClean({ buttonScale = 1, themeKey = 'sage', layout = 'list', W = 932, H = 430 }) {
  const T = FAST_THEMES[themeKey] || FAST_THEMES.sage;
  const [cart, setCart] = React.useState([
    { id:'ahwa', mod:'مظبوط', qty:3 },
    { id:'shay-nana', mod:null, qty:2 },
    { id:'lib-ab', mod:null, qty:1 },
  ]);
  const [activeCat, setActiveCat] = React.useState('hot');
  const [expanded, setExpanded] = React.useState(null);
  const [modalItem, setModalItem] = React.useState(null);
  const [flashId, setFlashId] = React.useState(null);
  const flash = (id) => {
    setFlashId(id);
    clearTimeout(window.__kahwaFlashT);
    window.__kahwaFlashT = setTimeout(() => setFlashId(null), 800);
  };

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
  const removeRow = (idx) => setCart(c => c.filter((_, i) => i !== idx));
  const clearCart = () => setCart([]);

  // ── Past orders + notifications ──
  const [tab, setTab] = React.useState('current');
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);
  const [pastOrders, setPastOrders] = React.useState(() => [
    { num:'A-147', sentAt: Date.now() - 2*60*1000, items:[
      { id:'shay', mod:null, qty:2, status:'cooking' },
      { id:'ahwa', mod:'مظبوط', qty:1, status:'queued' },
      { id:'lib-ab', mod:null, qty:1, status:'done' },
    ]},
    { num:'A-145', sentAt: Date.now() - 11*60*1000, items:[
      { id:'shay-nana', mod:null, qty:1, status:'done' },
      { id:'sodani', mod:null, qty:1, status:'done' },
    ], delivered: true },
  ]);
  const [toast, setToast] = React.useState(null);
  const cancelItem = (num, idx) => setPastOrders(o => o.map(ord => ord.num === num ? {
    ...ord,
    items: ord.items.map((it, i) => i === idx ? { ...it, status:'cancelled' } : it),
  } : ord));
  const counter = React.useRef(149);
  const sendOrder = () => {
    if (cart.length === 0) return;
    const num = 'A-' + (counter.current++);
    const newOrd = { num, sentAt: Date.now(),
      items: cart.map(r => ({ id:r.id, mod:r.mod, qty:r.qty, status:'queued' })) };
    setPastOrders(o => [newOrd, ...o]);
    setCart([]);
    setTab('past');
    // Simulate boufiya progress for demo
    setTimeout(() => setPastOrders(o => o.map(x => x.num === num ? {
      ...x, items: x.items.map((it, i) => i === 0 && it.status === 'queued' ? { ...it, status:'cooking' } : it),
    } : x)), 2500);
    setTimeout(() => {
      setPastOrders(o => o.map(x => x.num === num ? {
        ...x, items: x.items.map(it => it.status === 'cancelled' ? it : { ...it, status:'done' }),
      } : x));
      setToast({ num });
    }, 7000);
  };
  const readyCount = pastOrders.filter(o => !o.delivered && window.deriveOrderStatus(o.items) === 'ready').length;
  const total = cart.reduce((s,r)=>{
    const it=window.KAHWA_ITEMS.find(i=>i.id===r.id);
    return s + (it?it.price*r.qty:0);
  }, 0);

  // Responsive bits driven by the width passed in (the viewport width when
  // rendered full-screen): fewer columns and a slimmer cart on narrow screens.
  const cols = W < 700 ? 2 : 3;
  const cartW = W < 900 ? 240 : 290;

  return (
    <div dir="rtl" style={{
      width:'100%', height:'100%', background: T.bg, color: T.ink,
      fontFamily: '"Tajawal", system-ui, sans-serif',
      display:'flex', flexDirection:'column', position:'relative', overflow:'hidden',
    }}>
      {/* Top bar — minimal */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '12px 18px 8px',
      }}>
        <div style={{ display:'flex', alignItems:'baseline', gap: 10 }}>
          <div style={{
            fontWeight: 900, fontSize: 18, color: T.ink, letterSpacing:'-0.01em',
          }}>KahwaTech</div>
          <div style={{ fontSize: 12, color: T.inkSoft }}>أوردر #A-148</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <div style={{ fontSize: 12, color: T.inkSoft }}>الموظف</div>
          <div style={{
            background: T.pillBg, padding: '3px 10px', borderRadius: 999,
            fontWeight: 700, fontSize: 12, color: T.ink,
          }}>محمود ع.</div>
        </div>
      </div>

      {/* Category strip — plain text tabs, underline indicator */}
      <div style={{
        display:'flex', gap: 4, padding: '0 18px',
        borderBottom: `1px solid ${T.rule}`,
      }}>
        {cats.map(c => {
          const on = c.id === activeCat;
          return (
            <button key={c.id} onClick={()=>{ setActiveCat(c.id); setExpanded(null); }} style={{
              padding: `${10*buttonScale}px ${14*buttonScale}px`,
              background:'transparent',
              color: on ? T.accent : T.inkSoft,
              border:'none',
              borderBottom: `3px solid ${on ? T.accent : 'transparent'}`,
              marginBottom: -1,
              fontFamily:'inherit', fontWeight: on ? 800 : 600,
              fontSize: 15 * buttonScale, cursor:'pointer',
              letterSpacing:'-0.01em',
            }}>{c.ar}</button>
          );
        })}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display:'flex', minHeight: 0, padding: '10px 18px 14px', gap: 12 }}>
        {/* Items area */}
        {layout === 'grid' ? (
          <div style={{
            flex: 1, display:'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridAutoRows: '1fr',
            gap: 8, alignContent:'stretch', overflow:'hidden',
          }}>
            {items.slice(0, 6).map(item => {
              const hasMods = item.mods && item.mods.length;
              const isFlash = flashId === item.id;
              const inCart = cart.filter(r => r.id === item.id).reduce((s, r) => s + r.qty, 0);
              return (
                <button key={item.id} onClick={()=>{
                  if (hasMods) setModalItem(item);
                  else { addToCart(item, null); flash(item.id); }
                }} style={{
                  background: isFlash ? T.accent : T.surface,
                  border: `1px solid ${isFlash ? T.accent : T.rule}`,
                  borderRadius: 14, padding: '10px 8px 8px',
                  cursor:'pointer', fontFamily:'inherit',
                  display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
                  position:'relative',
                  transition:'background 200ms, border-color 200ms, transform 120ms',
                  transform: isFlash ? 'scale(0.97)' : 'scale(1)',
                  color: isFlash ? T.accentInk : T.ink,
                }}>
                  <window.ItemPhoto item={item} size={62 * Math.min(buttonScale, 1.2)} />
                  <div style={{
                    fontWeight: 700, fontSize: 14 * buttonScale,
                    color: isFlash ? T.accentInk : T.ink,
                    marginTop: 2, lineHeight: 1.1, textAlign:'center',
                    transition:'color 200ms',
                  }}>{item.ar}</div>
                  <div style={{
                    fontSize: 12,
                    color: isFlash ? T.accentInk : T.inkSoft,
                    opacity: isFlash ? 0.95 : 1,
                    fontWeight: isFlash ? 800 : 400,
                    transition:'color 200ms',
                  }}>{isFlash ? `✓ في السلة · ${inCart}` : `${item.price} ج`}</div>
                  {hasMods && !isFlash && (
                    <div style={{
                      position:'absolute', top: 6, left: 6,
                      fontSize: 9, color: T.accent,
                      background: T.pillBg, padding: '2px 7px', borderRadius: 999,
                      fontWeight: 800, letterSpacing: '0.02em',
                    }}>تخصيص</div>
                  )}
                  {inCart > 0 && !isFlash && (
                    <div style={{
                      position:'absolute', top: 6, right: 6,
                      fontSize: 11, fontWeight: 900, fontFamily:'system-ui',
                      color:'#fff', background: T.ink,
                      width: 20, height: 20, borderRadius: 999,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>{inCart}</div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
        <div style={{ flex: 1, display:'flex', flexDirection:'column', gap: 8, overflow:'hidden' }}>
          {items.slice(0, 4).map(item => {
            const isOpen = expanded === item.id;
            const hasMods = item.mods && item.mods.length;
            return (
              <div key={item.id} style={{
                background: T.surface, borderRadius: 14,
                border: `1px solid ${T.rule}`,
                overflow:'hidden',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap: 12, padding: 8 }}>
                  <window.ItemPhoto item={item} size={56} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 17 * buttonScale,
                      lineHeight: 1.1, color: T.ink,
                    }}>{item.ar}</div>
                    <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 2 }}>{item.price} جنيه</div>
                  </div>
                  {hasMods ? (
                    <button onClick={()=>setExpanded(isOpen ? null : item.id)} style={{
                      padding: `${8*buttonScale}px ${12*buttonScale}px`,
                      background:'transparent', color: T.ink,
                      border:`1px solid ${T.rule}`, borderRadius: 10,
                      fontFamily:'inherit', fontWeight: 700, fontSize: 13 * buttonScale,
                      cursor:'pointer',
                    }}>{isOpen ? 'إخفاء' : 'تخصيص'}</button>
                  ) : null}
                  <button onClick={()=>addToCart(item, null)} style={{
                    width: 44 * buttonScale, height: 44 * buttonScale, borderRadius: 12,
                    background: T.accent, color: T.accentInk,
                    border:'none', fontFamily:'inherit', fontWeight: 700,
                    fontSize: 24 * buttonScale, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    padding: 0, lineHeight: 1,
                  }}>+</button>
                </div>
                {isOpen && hasMods && (
                  <div style={{
                    display:'flex', gap: 6, flexWrap:'wrap',
                    padding: '8px 10px 10px',
                    borderTop: `1px dashed ${T.rule}`,
                  }}>
                    {item.mods.map(m => (
                      <button key={m} onClick={()=>{ addToCart(item, m); flash(item.id); setExpanded(null); }} style={{
                        padding: `${6*buttonScale}px ${10*buttonScale}px ${6*buttonScale}px ${6*buttonScale}px`,
                        background: T.bg, color: T.ink,
                        border:`1px solid ${T.rule}`, borderRadius: 999,
                        fontFamily:'inherit', fontWeight: 600, fontSize: 13 * buttonScale,
                        cursor:'pointer',
                        display:'flex', alignItems:'center', gap: 6,
                      }}>
                        <window.ModVisual item={item} mod={m} size={26} />
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {items.length > 4 && (
            <div style={{
              fontSize: 11, color: T.inkSoft, textAlign:'center',
              padding: '2px 0', opacity: 0.7,
            }}>⌄ {items.length - 4} أصناف تانية</div>
          )}
        </div>
        )}

        {/* Cart */}
        <div style={{
          width: cartW, background: T.surface,
          borderRadius: 14, padding: '10px 12px 12px',
          border: `1px solid ${T.rule}`,
          display:'flex', flexDirection:'column',
        }}>
          {/* Tabs */}
          <div style={{
            display:'flex', gap: 4, marginBottom: 8,
            background: T.bg, padding: 3, borderRadius: 10,
          }}>
            <button onClick={()=>setTab('current')} style={tabBtn(tab === 'current', T)}>
              الأوردر
            </button>
            <button onClick={()=>setTab('past')} style={tabBtn(tab === 'past', T)}>
              السابقة
              {readyCount > 0 && (
                <span style={{
                  marginInlineStart: 4,
                  background:'#3a8a4a', color:'#fff',
                  borderRadius: 999, padding:'1px 6px',
                  fontSize: 10, fontWeight: 900, fontFamily:'system-ui',
                }}>{readyCount}</span>
              )}
            </button>
          </div>

          {tab === 'past' ? (
            <window.PastOrdersPanel T={T} buttonScale={buttonScale}
              orders={pastOrders} onCancelItem={cancelItem} now={now} />
          ) : (
          <>
          {cart.length > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: T.inkSoft, fontWeight: 700 }}>
                {cart.reduce((s,r)=>s+r.qty,0)} صنف
              </div>
              <button onClick={clearCart} style={{
                background:'transparent', color: T.inkSoft,
                border:`1px solid ${T.rule}`, borderRadius: 8,
                padding: '3px 9px', cursor:'pointer',
                fontFamily:'inherit', fontSize: 11, fontWeight: 700,
                display:'flex', alignItems:'center', gap: 4,
              }}>
                <span style={{ fontSize: 13, lineHeight: 1 }}>⌫</span>
                فرّغ
              </button>
            </div>
          )}

          <div style={{ flex: 1, display:'flex', flexDirection:'column', gap: 2, overflow:'hidden' }}>
            {cart.length === 0 && (
              <div style={{
                fontSize:13, color: T.inkSoft, padding:30, textAlign:'center',
              }}>ضيف صنف من الشمال</div>
            )}
            {cart.map((row, i) => {
              const it = window.KAHWA_ITEMS.find(x => x.id === row.id);
              if (!it) return null;
              return (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap: 8, padding: '6px 0',
                  borderBottom: i < cart.length - 1 ? `1px solid ${T.rule}` : 'none',
                }}>
                  <div style={{
                    minWidth: 26, height: 22, borderRadius: 6,
                    background: T.pillBg, color: T.ink,
                    fontWeight: 800, fontSize: 12,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'system-ui',
                  }}>×{row.qty}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.15, color: T.ink }}>{it.ar}</div>
                    {row.mod && <div style={{ fontSize: 11, color: T.inkSoft }}>{row.mod}</div>}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{it.price * row.qty}</div>
                  <div style={{ display:'flex', gap: 4 }}>
                    <button onClick={()=>incQty(i,-1)} style={cleanQbtn(buttonScale, T, 'minus')}>−</button>
                    <button onClick={()=>incQty(i,+1)} style={cleanQbtn(buttonScale, T, 'plus')}>+</button>
                    <button onClick={()=>removeRow(i)} title="شيل الصنف" style={{
                      width: 26 * buttonScale, height: 26 * buttonScale, borderRadius: 7, padding: 0,
                      background:'transparent', color:'#b04a32',
                      border:`1px solid #b04a3244`,
                      fontFamily:'inherit', fontWeight: 700, fontSize: 13 * buttonScale,
                      cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', lineHeight: 1,
                    }}>×</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total + send */}
          <div style={{ marginTop: 8, paddingTop: 10, borderTop: `1px solid ${T.rule}` }}>
            <div style={{
              display:'flex', alignItems:'baseline', justifyContent:'space-between',
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 13, color: T.inkSoft }}>الإجمالي</span>
              <span style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing:'-0.02em' }}>
                {total} <span style={{ fontSize: 14, color: T.inkSoft, fontWeight: 600 }}>ج</span>
              </span>
            </div>
            <button onClick={sendOrder} disabled={cart.length === 0} style={{
              width: '100%', padding: `${12*buttonScale}px`,
              background: cart.length === 0 ? T.pillBg : T.accent,
              color: cart.length === 0 ? T.inkSoft : T.accentInk,
              border:'none',
              borderRadius: 12, fontFamily:'inherit', fontWeight: 800,
              fontSize: 16 * buttonScale,
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
            }}>إرسال للبوفية</button>
          </div>
          </>
          )}
        </div>
      </div>

      {/* Ready toast */}
      <window.ReadyToast T={T} order={toast} onDismiss={()=>setToast(null)} />

      {/* Modifier modal (grid layout uses this; list uses inline expand) */}
      {modalItem && (
        <div onClick={()=>setModalItem(null)} style={{
          position:'absolute', inset:0, background:'rgba(20,12,5,0.45)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex: 10,
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background: T.surface, borderRadius: 16,
            padding: 16, width: 460,
            border: `1px solid ${T.rule}`,
            boxShadow: '0 20px 60px -10px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 12 }}>
              <window.ItemPhoto item={modalItem} size={54} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, lineHeight: 1.1 }}>{modalItem.ar}</div>
                <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 2 }}>اختار التحضير</div>
              </div>
              <button onClick={()=>setModalItem(null)} style={{
                background:'transparent', border:`1px solid ${T.rule}`,
                borderRadius: 8, padding: '4px 10px', cursor:'pointer',
                color: T.inkSoft, fontFamily:'inherit', fontSize: 13,
              }}>×</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {modalItem.mods.map(m => (
                <button key={m} onClick={()=>{ addToCart(modalItem, m); flash(modalItem.id); setModalItem(null); }} style={{
                  padding: '10px 6px 10px',
                  minHeight: 108,
                  background: T.surface, color: T.ink,
                  border:`1px solid ${T.rule}`, borderRadius: 12,
                  fontFamily:'inherit', cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', gap: 6,
                  transition:'border-color 150ms, background 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.rule; }}
                >
                  <window.ModVisual item={modalItem} mod={m} size={52} />
                  <div style={{
                    fontWeight: 700, fontSize: 13 * buttonScale, color: T.ink,
                    lineHeight: 1.15, textAlign:'center', whiteSpace:'nowrap',
                  }}>{m}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function cleanQbtn(scale, T, kind) {
  return {
    width: 26 * scale, height: 26 * scale, borderRadius: 7, padding: 0,
    background: kind === 'plus' ? T.accent : 'transparent',
    color: kind === 'plus' ? T.accentInk : T.ink,
    border: kind === 'plus' ? 'none' : `1px solid ${T.rule}`,
    fontFamily:'inherit', fontWeight: 700, fontSize: 14 * scale, cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', lineHeight: 1,
  };
}

function tabBtn(active, T) {
  return {
    flex: 1, padding: '6px 8px',
    background: active ? T.surface : 'transparent',
    color: active ? T.ink : T.inkSoft,
    border:'none', borderRadius: 8,
    fontFamily:'inherit', fontWeight: active ? 800 : 700, fontSize: 13,
    cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', gap: 4,
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
  };
}

window.VariationFastClean = VariationFastClean;
window.FAST_THEMES = FAST_THEMES;
