// Mobile portrait versions (iPhone 402×874)
// - KahwaWaiterMobile: menu grid → floating cart fab → bottom sheet cart + past orders
// - KahwaBoufiyaMobile: vertical stack of order cards

// Single fixed sage palette (via FAST_THEMES); danger/warn accents are constant.
const MOB_T = Object.assign(
  { bg:'#f4f4f0', surface:'#fff', ink:'#1a1a14', inkSoft:'#7a7a6a',
    accent:'#3a6a48', accentInk:'#fff', rule:'#e2e2dc', pillBg:'#eaeae2' },
  (window.FAST_THEMES && window.FAST_THEMES.sage) || {},
  { danger:'#b03a20', warn:'#a87320' },
);
const fontStack = '"Tajawal", system-ui, sans-serif';

// ────────────────────────────────────────────────────────────
// Header bar shared
function MobHeader({ title, sub, right }) {
  return (
    <div style={{
      padding: '6px 16px 8px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      borderBottom: `1px solid ${MOB_T.rule}`, background: MOB_T.surface,
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 900, color: MOB_T.ink, lineHeight: 1 }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: MOB_T.inkSoft, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// ── Modifier sheet ──────────────────────────────────────────
function ModSheet({ item, onPick, onClose }) {
  if (!item) return null;
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(20,12,5,0.45)',
      display:'flex', alignItems:'flex-end', zIndex: 30,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background: MOB_T.surface,
        borderRadius: '20px 20px 0 0', padding: 16,
        animation: 'kahwaSheetUp 200ms cubic-bezier(.2,.9,.3,1.05)',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: MOB_T.rule, margin: '0 auto 12px',
        }} />
        <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12 }}>
          <window.ItemPhoto item={item} size={48} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: MOB_T.ink, lineHeight: 1 }}>{item.ar}</div>
            <div style={{ fontSize: 12, color: MOB_T.inkSoft, marginTop: 2 }}>اختار التحضير</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 8 }}>
          {item.mods.map(m => (
            <button key={m} onClick={()=>onPick(m)} style={{
              padding: '10px 6px', background: MOB_T.bg,
              border:`1px solid ${MOB_T.rule}`, borderRadius: 14, cursor:'pointer',
              display:'flex', flexDirection:'column', alignItems:'center', gap: 6,
              fontFamily: fontStack,
            }}>
              <window.ModVisual item={item} mod={m} size={48} />
              <div style={{ fontWeight: 700, fontSize: 15, color: MOB_T.ink }}>{m}</div>
            </button>
          ))}
        </div>
        <style>{`@keyframes kahwaSheetUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
      </div>
    </div>
  );
}

// ── Cart sheet (bottom drawer with tabs) ────────────────────
function CartSheet({ cart, pastOrders, now, onClose, onChangeQty, onRemove, onClear, onSend, onCancelItem }) {
  const [tab, setTab] = React.useState('current');
  const total = cart.reduce((s,r)=>{ const it=window.KAHWA_ITEMS.find(i=>i.id===r.id); return s+(it?it.price*r.qty:0); }, 0);
  const readyCount = pastOrders.filter(o => !o.delivered && window.deriveOrderStatus(o.items) === 'ready').length;

  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(20,12,5,0.45)',
      display:'flex', alignItems:'flex-end', zIndex: 25,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', height: '82%', background: MOB_T.surface,
        borderRadius:'20px 20px 0 0',
        display:'flex', flexDirection:'column',
        animation: 'kahwaSheetUp 220ms cubic-bezier(.2,.9,.3,1.05)',
        fontFamily: fontStack,
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: MOB_T.rule, margin: '8px auto 6px',
        }} />
        {/* Tabs */}
        <div style={{ padding: '4px 14px 6px', display:'flex', gap: 6 }}>
          <button onClick={()=>setTab('current')} style={mobTab(tab==='current')}>
            الأوردر الحالي
            {cart.length > 0 && <span style={mobBadge(MOB_T.ink, MOB_T.surface)}>{cart.reduce((s,r)=>s+r.qty,0)}</span>}
          </button>
          <button onClick={()=>setTab('past')} style={mobTab(tab==='past')}>
            السابقة
            {readyCount > 0 && <span style={mobBadge(MOB_T.accent, '#fff')}>{readyCount}</span>}
          </button>
        </div>

        {tab === 'current' ? (
          <>
            <div style={{ flex: 1, overflow:'auto', padding: '4px 14px', display:'flex', flexDirection:'column', gap: 6 }}>
              {cart.length === 0 && (
                <div style={{ fontSize: 14, color: MOB_T.inkSoft, textAlign:'center', padding: 32 }}>
                  لسه ما اخترتش حاجة
                </div>
              )}
              {cart.map((row, i) => {
                const it = window.KAHWA_ITEMS.find(x => x.id === row.id);
                if (!it) return null;
                return (
                  <div key={i} style={{
                    display:'flex', alignItems:'center', gap: 10, padding: 8,
                    background: MOB_T.bg, borderRadius: 12,
                  }}>
                    <window.ItemPhoto item={it} size={44} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: MOB_T.ink, lineHeight: 1.1 }}>{it.ar}</div>
                      {row.mod && <div style={{ fontSize: 12, color: MOB_T.accent, fontWeight: 700 }}>{row.mod}</div>}
                      <div style={{ fontSize: 12, color: MOB_T.inkSoft, marginTop: 2 }}>{it.price * row.qty} ج</div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                      <button onClick={()=>onChangeQty(i,-1)} style={mobQbtn('minus')}>−</button>
                      <div style={{ minWidth: 18, textAlign:'center', fontWeight: 900, fontSize: 16, fontFamily:'system-ui' }}>{row.qty}</div>
                      <button onClick={()=>onChangeQty(i,+1)} style={mobQbtn('plus')}>+</button>
                      <button onClick={()=>onRemove(i)} style={{
                        width: 32, height: 32, borderRadius: 8, padding: 0,
                        background:'transparent', color: MOB_T.danger,
                        border:`1px solid ${MOB_T.danger}33`,
                        fontFamily: fontStack, fontWeight: 700, fontSize: 16, cursor:'pointer',
                      }}>×</button>
                    </div>
                  </div>
                );
              })}
              {cart.length > 0 && (
                <button onClick={onClear} style={{
                  alignSelf:'flex-end', marginTop: 4,
                  background:'transparent', color: MOB_T.inkSoft,
                  border:`1px solid ${MOB_T.rule}`, borderRadius: 10,
                  padding: '6px 12px', cursor:'pointer',
                  fontFamily: fontStack, fontSize: 12, fontWeight: 700,
                }}>⌫ فرّغ السلة</button>
              )}
            </div>
            <div style={{
              padding: '10px 14px 18px', borderTop: `1px solid ${MOB_T.rule}`,
              display:'flex', alignItems:'center', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: MOB_T.inkSoft }}>الإجمالي</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: MOB_T.ink, lineHeight: 1, letterSpacing:'-0.02em' }}>
                  {total} <span style={{ fontSize: 14, color: MOB_T.inkSoft, fontWeight: 700 }}>ج</span>
                </div>
              </div>
              <button onClick={onSend} disabled={cart.length === 0} style={{
                padding: '14px 22px',
                background: cart.length === 0 ? MOB_T.pillBg : MOB_T.accent,
                color: cart.length === 0 ? MOB_T.inkSoft : '#fff',
                border:'none', borderRadius: 14,
                fontFamily: fontStack, fontWeight: 900, fontSize: 17,
                cursor: cart.length === 0 ? 'not-allowed':'pointer',
                boxShadow: cart.length === 0 ? 'none' : `0 6px 14px -4px ${MOB_T.accent}66`,
              }}>إرسال للبوفية ←</button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, overflow:'auto', padding: '6px 14px 18px' }}>
            <window.PastOrdersPanel T={MOB_T} buttonScale={1.1}
              orders={pastOrders} onCancelItem={onCancelItem} now={now} />
          </div>
        )}
      </div>
    </div>
  );
}

function mobTab(active) {
  return {
    flex: 1, padding: '10px 8px',
    background: active ? MOB_T.bg : 'transparent',
    color: active ? MOB_T.ink : MOB_T.inkSoft,
    border:`1px solid ${active ? MOB_T.rule : 'transparent'}`,
    borderRadius: 12, cursor:'pointer',
    fontFamily: fontStack, fontWeight: active ? 800 : 700, fontSize: 14,
    display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
  };
}
function mobBadge(bg, fg) {
  return {
    background: bg, color: fg, borderRadius: 999,
    padding:'1px 7px', fontSize: 11, fontWeight: 900, fontFamily:'system-ui',
  };
}
function mobQbtn(kind) {
  return {
    width: 32, height: 32, borderRadius: 8, padding: 0,
    background: kind === 'plus' ? MOB_T.accent : MOB_T.surface,
    color: kind === 'plus' ? '#fff' : MOB_T.ink,
    border: kind === 'plus' ? 'none' : `1px solid ${MOB_T.rule}`,
    fontFamily: fontStack, fontWeight: 800, fontSize: 18, cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', lineHeight: 1,
  };
}

// ────────────────────────────────────────────────────────────
// KahwaWaiterMobile
// ────────────────────────────────────────────────────────────
function KahwaWaiterMobile() {
  const [cart, setCart] = React.useState([
    { id:'ahwa', mod:'مظبوط', qty:2 },
    { id:'shay-nana', mod:null, qty:1 },
  ]);
  const [cat, setCat] = React.useState('hot');
  const [modItem, setModItem] = React.useState(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [flashId, setFlashId] = React.useState(null);
  const flash = (id) => { setFlashId(id); clearTimeout(window.__kahwaMobFT); window.__kahwaMobFT = setTimeout(()=>setFlashId(null), 700); };

  const [now, setNow] = React.useState(()=>Date.now());
  React.useEffect(()=>{ const t=setInterval(()=>setNow(Date.now()), 5000); return ()=>clearInterval(t); }, []);
  const [pastOrders, setPastOrders] = React.useState(() => [
    { num:'A-147', sentAt: Date.now() - 2*60*1000, items:[
      { id:'shay', mod:null, qty:2, status:'cooking' },
      { id:'ahwa', mod:'مظبوط', qty:1, status:'queued' },
    ]},
    { num:'A-145', sentAt: Date.now() - 11*60*1000, items:[
      { id:'shay-nana', mod:null, qty:1, status:'done' },
      { id:'sodani', mod:null, qty:1, status:'done' },
    ], delivered: true },
  ]);
  const [toast, setToast] = React.useState(null);
  const counter = React.useRef(149);

  const addToCart = (item, mod) => {
    setCart(c => {
      const i = c.findIndex(x => x.id === item.id && x.mod === mod);
      if (i >= 0) { const n=[...c]; n[i]={...n[i], qty:n[i].qty+1}; return n; }
      return [...c, { id:item.id, mod, qty:1 }];
    });
    flash(item.id);
  };
  const tap = (item) => {
    if (item.mods && item.mods.length) setModItem(item);
    else addToCart(item, null);
  };
  const changeQty = (i, d) => setCart(c => {
    const n = [...c]; n[i] = { ...n[i], qty: Math.max(0, n[i].qty + d) };
    return n.filter(r => r.qty > 0);
  });
  const removeRow = (i) => setCart(c => c.filter((_, j) => j !== i));
  const clearCart = () => setCart([]);
  const cancelItem = (num, idx) => setPastOrders(o => o.map(ord => ord.num === num ? {
    ...ord, items: ord.items.map((it, i) => i === idx ? { ...it, status:'cancelled' } : it),
  } : ord));
  const sendOrder = () => {
    if (cart.length === 0) return;
    const num = 'A-' + (counter.current++);
    setPastOrders(o => [{ num, sentAt: Date.now(),
      items: cart.map(r => ({ id:r.id, mod:r.mod, qty:r.qty, status:'queued' })) }, ...o]);
    setCart([]);
    setSheetOpen(false);
    setTimeout(() => setPastOrders(o => o.map(x => x.num === num ? {
      ...x, items: x.items.map((it, i) => i === 0 && it.status==='queued' ? {...it, status:'cooking'} : it),
    } : x)), 2500);
    setTimeout(() => {
      setPastOrders(o => o.map(x => x.num === num ? {
        ...x, items: x.items.map(it => it.status === 'cancelled' ? it : { ...it, status:'done' }),
      } : x));
      setToast({ num });
    }, 7000);
  };

  const cats = window.KAHWA_CATEGORIES;
  const items = window.KAHWA_BY_CAT(cat);
  const qtyTotal = cart.reduce((s,r)=>s+r.qty, 0);
  const total = cart.reduce((s,r)=>{ const it=window.KAHWA_ITEMS.find(i=>i.id===r.id); return s+(it?it.price*r.qty:0); }, 0);

  return (
    <div dir="rtl" style={{
      width:'100%', height:'100%', background: MOB_T.bg,
      fontFamily: fontStack, color: MOB_T.ink,
      display:'flex', flexDirection:'column', position:'relative', overflow:'hidden',
    }}>
      <MobHeader
        title="KahwaTech"
        sub="أوردر مفتوح · الموظف: محمود"
        right={<div style={{
          padding:'4px 10px', background: MOB_T.pillBg, color: MOB_T.ink,
          borderRadius: 999, fontSize: 12, fontWeight: 800,
        }}>14:32</div>}
      />

      {/* Categories — horizontal scroll */}
      <div style={{
        display:'flex', gap: 6, padding: '10px 14px 6px',
        overflowX:'auto', flexShrink: 0,
      }}>
        {cats.map(c => {
          const on = c.id === cat;
          return (
            <button key={c.id} onClick={()=>setCat(c.id)} style={{
              flex:'0 0 auto', padding: '10px 16px',
              background: on ? MOB_T.ink : MOB_T.surface,
              color: on ? '#fff' : MOB_T.ink,
              border: on ? 'none' : `1px solid ${MOB_T.rule}`,
              borderRadius: 999, fontFamily: fontStack,
              fontWeight: 800, fontSize: 15, cursor:'pointer',
            }}>{c.ar}</button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{
        flex: 1, overflow:'auto', padding: '6px 14px 90px',
        display:'grid', gridTemplateColumns:'repeat(2, 1fr)',
        gap: 10, alignContent:'start',
      }}>
        {items.map(item => {
          const isFlash = flashId === item.id;
          const hasMods = item.mods && item.mods.length;
          const inCart = cart.filter(r => r.id === item.id).reduce((s, r) => s + r.qty, 0);
          return (
            <button key={item.id} onClick={()=>tap(item)} style={{
              background: isFlash ? MOB_T.accent : MOB_T.surface,
              border: `1px solid ${isFlash ? MOB_T.accent : MOB_T.rule}`,
              color: isFlash ? '#fff' : MOB_T.ink,
              borderRadius: 16, padding: '10px 8px 12px',
              cursor:'pointer', fontFamily: fontStack,
              display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
              position:'relative',
              transition:'background 200ms, border-color 200ms, transform 120ms',
              transform: isFlash ? 'scale(0.97)' : 'scale(1)',
            }}>
              <window.ItemPhoto item={item} size={92} />
              <div style={{ fontWeight: 800, fontSize: 16, marginTop: 4, lineHeight: 1.1, textAlign:'center' }}>{item.ar}</div>
              <div style={{ fontSize: 13, color: isFlash ? '#fff' : MOB_T.inkSoft, opacity: isFlash ? 0.95 : 1, fontWeight: isFlash ? 800 : 400 }}>
                {isFlash ? `✓ في السلة · ${inCart}` : `${item.price} ج`}
              </div>
              {hasMods && !isFlash && (
                <div style={{
                  position:'absolute', top: 8, insetInlineStart: 8,
                  fontSize: 9, fontWeight: 800, letterSpacing:'0.04em',
                  color: MOB_T.accent, background: MOB_T.pillBg,
                  padding: '2px 8px', borderRadius: 999,
                }}>تخصيص</div>
              )}
              {inCart > 0 && !isFlash && (
                <div style={{
                  position:'absolute', top: 8, insetInlineEnd: 8,
                  fontSize: 11, fontWeight: 900, fontFamily:'system-ui',
                  color:'#fff', background: MOB_T.ink,
                  width: 22, height: 22, borderRadius: 999,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{inCart}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating cart FAB */}
      <button onClick={()=>setSheetOpen(true)} style={{
        position:'absolute', bottom: 18, insetInlineStart: 16, insetInlineEnd: 16,
        background: MOB_T.ink, color:'#fff', border:'none',
        borderRadius: 18, padding: '14px 16px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        boxShadow: '0 12px 30px -6px rgba(0,0,0,0.35)',
        fontFamily: fontStack, cursor:'pointer',
        zIndex: 10,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{
            background: MOB_T.accent, color:'#fff',
            minWidth: 28, height: 28, borderRadius: 9,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight: 900, fontSize: 14, fontFamily:'system-ui',
            padding:'0 8px',
          }}>{qtyTotal}</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            {qtyTotal === 0 ? 'السلة فاضية' : `${qtyTotal} صنف في السلة`}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>{total} <span style={{ fontSize: 13, opacity: 0.7 }}>ج</span></div>
          <div style={{ fontSize: 18, opacity: 0.6 }}>‹</div>
        </div>
      </button>

      <ModSheet item={modItem} onPick={(m)=>{ addToCart(modItem, m); setModItem(null); }} onClose={()=>setModItem(null)} />
      {sheetOpen && <CartSheet
        cart={cart} pastOrders={pastOrders} now={now}
        onChangeQty={changeQty} onRemove={removeRow} onClear={clearCart}
        onSend={sendOrder} onCancelItem={cancelItem}
        onClose={()=>setSheetOpen(false)}
      />}
      <window.ReadyToast T={MOB_T} order={toast} onDismiss={()=>setToast(null)} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// KahwaBoufiyaMobile — vertical list of order cards
// ────────────────────────────────────────────────────────────
function KahwaBoufiyaMobile() {
  const [now, setNow] = React.useState(() => Math.floor(Date.now()/1000));
  React.useEffect(() => { const t=setInterval(()=>setNow(Math.floor(Date.now()/1000)),1000); return ()=>clearInterval(t); }, []);

  const [orders, setOrders] = React.useState(() => {
    const t = Math.floor(Date.now()/1000);
    return [
      { num:'A-151', employee:'محمود', startedAt:t-274, items:[
        { id:'nescafe', mod:null, qty:1, done:false },
        { id:'hot-choco', mod:null, qty:1, done:false },
      ]},
      { num:'A-150', employee:'أحمد', startedAt:t-168, items:[
        { id:'sh-tof', mod:'تفاحتين', qty:1, done:true },
        { id:'pepsi', mod:null, qty:2, done:true },
      ]},
      { num:'A-149', employee:'محمود', startedAt:t-72, items:[
        { id:'shay-nana', mod:null, qty:1, done:true },
        { id:'sahlab', mod:null, qty:1, done:false },
      ]},
      { num:'A-148', employee:'محمود', startedAt:t-34, items:[
        { id:'shay', mod:null, qty:2, done:false },
        { id:'ahwa', mod:'مظبوط', qty:1, done:false },
        { id:'lib-ab', mod:null, qty:1, done:false },
      ]},
    ];
  });
  const [done, setDone] = React.useState([
    { num:'A-147', employee:'أحمد', tookSec:162 },
    { num:'A-146', employee:'محمود', tookSec:95 },
  ]);
  const [flashNum, setFlashNum] = React.useState(null);

  const ageColor = (sec) => {
    if (sec >= 240) return { fg:'#b03a20', bg:'#ffe2d8', label:'متأخر' };
    if (sec >= 120) return { fg:'#a87320', bg:'#fff0c8', label:'استعجل' };
    return { fg: MOB_T.accent, bg: MOB_T.pillBg, label:'جديد' };
  };
  const fmt = (sec) => {
    const m = Math.floor(sec/60); const s = sec%60;
    return `${m}:${String(s).padStart(2,'0')}`;
  };

  const toggle = (oi, ii) => setOrders(o => {
    const n = [...o]; const ord = { ...n[oi] };
    ord.items = ord.items.map((it, i) => i === ii ? { ...it, done: !it.done } : it);
    n[oi] = ord; return n;
  });
  const send = (oi) => {
    const ord = orders[oi];
    setFlashNum(ord.num);
    setTimeout(() => {
      setOrders(o => o.filter((_, i) => i !== oi));
      setDone(d => [{ num: ord.num, employee: ord.employee, tookSec: now - ord.startedAt }, ...d].slice(0, 3));
      setFlashNum(null);
    }, 500);
  };

  return (
    <div dir="rtl" style={{
      width:'100%', height:'100%', background: MOB_T.bg,
      fontFamily: fontStack, color: MOB_T.ink,
      display:'flex', flexDirection:'column', overflow:'hidden',
    }}>
      <MobHeader title="شاشة البوفية" sub={`${orders.length} أوردر في الانتظار`}
        right={<div style={{
          padding:'4px 10px', background: orders.length ? MOB_T.accent : MOB_T.pillBg,
          color: orders.length ? '#fff' : MOB_T.inkSoft, borderRadius: 999,
          fontSize: 12, fontWeight: 900, fontFamily:'system-ui',
        }}>{new Date(now*1000).toLocaleTimeString('ar-EG', { hour:'2-digit', minute:'2-digit', hour12: false })}</div>}
      />

      <div style={{ flex: 1, overflow:'auto', padding: '10px 14px 6px', display:'flex', flexDirection:'column', gap: 10 }}>
        {orders.length === 0 && (
          <div style={{ padding: 40, textAlign:'center', color: MOB_T.inkSoft, fontWeight: 700 }}>
            مفيش أوردرات حالياً 🎉
          </div>
        )}
        {orders.map((ord, oi) => {
          const age = Math.max(0, now - ord.startedAt);
          const allDone = ord.items.every(it => it.done);
          const ac = ageColor(age);
          const isFlash = flashNum === ord.num;
          return (
            <div key={ord.num} style={{
              background: isFlash ? MOB_T.accent : MOB_T.surface,
              border: `1px solid ${isFlash ? MOB_T.accent : (allDone ? MOB_T.accent : MOB_T.rule)}`,
              borderRadius: 16, overflow:'hidden',
              transition:'background 200ms, border-color 200ms, opacity 300ms, transform 200ms',
              opacity: isFlash ? 0.6 : 1,
              transform: isFlash ? 'scale(0.98)' : 'scale(1)',
              boxShadow: allDone && !isFlash ? `0 0 0 2px ${MOB_T.accent}33` : 'none',
            }}>
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding: '10px 14px',
                borderBottom: `1px solid ${isFlash ? '#ffffff33' : MOB_T.rule}`,
              }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: isFlash ? '#fff' : MOB_T.ink, fontFamily:'system-ui' }}>#{ord.num}</div>
                  <div style={{ fontSize: 12, color: isFlash ? '#fff' : MOB_T.inkSoft, opacity: isFlash ? 0.8 : 1 }}>الموظف: {ord.employee}</div>
                </div>
                <div style={{
                  display:'flex', alignItems:'center', gap: 6,
                  background: isFlash ? '#ffffff22' : ac.bg,
                  color: isFlash ? '#fff' : ac.fg,
                  padding:'4px 10px', borderRadius: 999,
                  fontWeight: 800, fontSize: 13, fontFamily:'system-ui',
                }}>
                  <span>{fmt(age)}</span>
                  <span style={{ fontSize: 11, fontFamily: fontStack, opacity: 0.85 }}>{ac.label}</span>
                </div>
              </div>
              <div style={{ padding: '6px 8px', display:'flex', flexDirection:'column', gap: 4 }}>
                {ord.items.map((it, ii) => {
                  const data = window.KAHWA_ITEMS.find(x => x.id === it.id);
                  if (!data) return null;
                  return (
                    <button key={ii} onClick={()=>toggle(oi, ii)} style={{
                      display:'flex', alignItems:'center', gap: 10, padding: '6px 8px',
                      background: it.done ? (isFlash ? '#ffffff22' : MOB_T.pillBg) : 'transparent',
                      border:`1px solid ${it.done ? 'transparent' : (isFlash ? '#ffffff22' : MOB_T.rule)}`,
                      borderRadius: 10, cursor:'pointer', fontFamily: fontStack,
                    }}>
                      <window.ItemPhoto item={data} size={40} />
                      <div style={{
                        minWidth: 28, height: 24, borderRadius: 6,
                        background: isFlash ? '#ffffff22' : MOB_T.ink,
                        color: isFlash ? '#fff' : '#fff',
                        fontWeight: 900, fontSize: 13, fontFamily:'system-ui',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>×{it.qty}</div>
                      <div style={{
                        flex: 1, minWidth: 0, textAlign:'right',
                        textDecoration: it.done ? 'line-through' : 'none',
                        opacity: it.done ? 0.5 : 1,
                      }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: isFlash ? '#fff' : MOB_T.ink, lineHeight: 1.1 }}>{data.ar}</div>
                        {it.mod && <div style={{ fontSize: 12, color: isFlash ? '#fff' : MOB_T.accent, fontWeight: 700, marginTop: 1 }}>{it.mod}</div>}
                      </div>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: it.done ? (isFlash ? '#fff' : MOB_T.accent) : 'transparent',
                        border:`1.5px solid ${it.done ? (isFlash ? '#fff' : MOB_T.accent) : (isFlash ? '#ffffff66' : MOB_T.rule)}`,
                        color: it.done ? (isFlash ? MOB_T.accent : '#fff') : 'transparent',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight: 900, fontSize: 16,
                      }}>✓</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={()=>allDone && send(oi)} disabled={!allDone} style={{
                margin: '4px 10px 12px',
                padding: '12px',
                background: allDone ? (isFlash ? '#fff' : MOB_T.accent) : 'transparent',
                color: allDone ? (isFlash ? MOB_T.accent : '#fff') : MOB_T.inkSoft,
                border: allDone ? 'none' : `1px dashed ${MOB_T.rule}`,
                borderRadius: 12, fontFamily: fontStack, fontWeight: 800, fontSize: 15,
                cursor: allDone ? 'pointer':'not-allowed',
                width:'calc(100% - 20px)',
              }}>
                {isFlash ? '✓ اترسل للموظف' : allDone ? 'تم جاهز · ابعت للموظف' : `لسه ${ord.items.filter(i=>!i.done).length} أصناف`}
              </button>
            </div>
          );
        })}
      </div>
      {/* recent strip */}
      <div style={{
        padding: '8px 14px 14px',
        borderTop: `1px solid ${MOB_T.rule}`, background: MOB_T.surface,
        display:'flex', alignItems:'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{ fontSize: 11, color: MOB_T.inkSoft, fontWeight: 800, whiteSpace:'nowrap' }}>آخر اللي اتنفذ:</div>
        <div style={{ display:'flex', gap: 6, flex: 1, overflow:'auto' }}>
          {done.map((d, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: 5, padding: '3px 10px',
              background: MOB_T.pillBg, borderRadius: 999, fontSize: 11, color: MOB_T.ink,
              flexShrink: 0,
            }}>
              <span style={{ fontWeight: 800, fontFamily:'system-ui' }}>#{d.num}</span>
              <span style={{ color: MOB_T.inkSoft }}>·</span>
              <span>{d.employee}</span>
              <span style={{ color: MOB_T.inkSoft, fontFamily:'system-ui' }}>{Math.floor(d.tookSec/60)}:{String(d.tookSec%60).padStart(2,'0')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KahwaWaiterMobile, KahwaBoufiyaMobile });
