// ───────────────────────────────────────────────────────────────
// شاشة البوفية — Kitchen Display
// Horizontal row of order cards (oldest right → newest left, RTL).
// Each card: order #, live age timer (color-coded), checkable item
// list with photo+name+qty+mod, "تم جاهز" send button when complete.
// Footer strip: last 3 completed orders.
// ───────────────────────────────────────────────────────────────

const BOUF_THEMES = window.FAST_THEMES;  // reuse fast-clean palette

// Mock incoming-order generator
function makeOrders(now) {
  // ages in seconds, items: [{ id, mod, qty, done }]
  return [
    { num: 'A-151', employee: 'محمود', startedAt: now - 274, items: [
      { id:'nescafe', mod:null, qty:1, done:false },
      { id:'hot-choco', mod:null, qty:1, done:false },
    ]},
    { num: 'A-150', employee: 'أحمد', startedAt: now - 168, items: [
      { id:'sh-tof', mod:'تفاحتين', qty:1, done:true },
      { id:'pepsi', mod:null, qty:2, done:true },
    ]},
    { num: 'A-149', employee: 'محمود', startedAt: now - 72, items: [
      { id:'shay-nana', mod:null, qty:1, done:true },
      { id:'sahlab', mod:null, qty:1, done:false },
    ]},
    { num: 'A-148', employee: 'محمود', startedAt: now - 34, items: [
      { id:'shay', mod:null, qty:2, done:false },
      { id:'ahwa', mod:'مظبوط', qty:1, done:false },
      { id:'lib-ab', mod:null, qty:1, done:false },
    ]},
  ];
}

const RECENT_DONE = [
  { num: 'A-147', employee: 'أحمد', tookSec: 162, time: '14:18' },
  { num: 'A-146', employee: 'محمود', tookSec: 95,  time: '14:14' },
  { num: 'A-145', employee: 'أحمد', tookSec: 210, time: '14:11' },
];

function ageColor(sec, T) {
  if (sec >= 240) return { fg:'#b03a20', bg:'#ffe2d8', label:'متأخر' };
  if (sec >= 120) return { fg:'#a87320', bg:'#fff0c8', label:'استعجل' };
  return { fg:T.accent, bg:T.pillBg, label:'جديد' };
}

function fmtAge(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function VariationBoufiya({ buttonScale = 1, themeKey = 'sage', W = 932, H = 430 }) {
  const T = (window.FAST_THEMES || {})[themeKey] || (window.FAST_THEMES || {}).sage;
  const [now, setNow] = React.useState(() => Math.floor(Date.now()/1000));
  React.useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now()/1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const [orders, setOrders] = React.useState(() => makeOrders(Math.floor(Date.now()/1000)));
  const [done, setDone] = React.useState(RECENT_DONE);
  const [flashOrder, setFlashOrder] = React.useState(null);

  const toggleItem = (ordIdx, itemIdx) => {
    setOrders(o => {
      const n = [...o];
      const ord = { ...n[ordIdx] };
      ord.items = ord.items.map((it, i) => i === itemIdx ? { ...it, done: !it.done } : it);
      n[ordIdx] = ord;
      return n;
    });
  };

  const sendReady = (ordIdx) => {
    const ord = orders[ordIdx];
    setFlashOrder(ord.num);
    setTimeout(() => {
      setOrders(o => o.filter((_, i) => i !== ordIdx));
      setDone(d => [{
        num: ord.num, employee: ord.employee,
        tookSec: now - ord.startedAt,
        time: new Date().toLocaleTimeString('ar-EG', { hour:'2-digit', minute:'2-digit', hour12: false }),
      }, ...d].slice(0, 3));
      setFlashOrder(null);
    }, 600);
  };

  const totalPending = orders.length;

  // Vertical clock string
  const clockStr = new Date(now * 1000).toLocaleTimeString('ar-EG', {
    hour:'2-digit', minute:'2-digit', hour12: false,
  });

  return (
    <div dir="rtl" style={{
      width: W, height: H, background: T.bg, color: T.ink,
      fontFamily:'"Tajawal", system-ui, sans-serif',
      display:'flex', flexDirection:'column', position:'relative', overflow:'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '10px 18px 6px', borderBottom: `1px solid ${T.rule}`,
      }}>
        <div style={{ display:'flex', alignItems:'baseline', gap: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 900, letterSpacing:'-0.01em' }}>KahwaTech</div>
          <div style={{ fontSize: 13, color: T.inkSoft, fontWeight: 700 }}>شاشة البوفية</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{
            display:'flex', alignItems:'center', gap: 6,
            background: T.surface, padding:'3px 10px', borderRadius: 999,
            border: `1px solid ${T.rule}`,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: totalPending > 0 ? T.accent : T.inkSoft,
              boxShadow: totalPending > 0 ? `0 0 8px ${T.accent}aa` : 'none',
            }} />
            <span style={{ fontSize: 13, fontWeight: 800 }}>
              {totalPending} في الانتظار
            </span>
          </div>
          <div style={{
            fontSize: 18, fontWeight: 800, color: T.ink,
            fontFamily:'system-ui', letterSpacing: '0.02em',
          }}>{clockStr}</div>
        </div>
      </div>

      {/* Orders row */}
      <div style={{
        flex: 1, display:'flex', gap: 10, padding: '10px 18px',
        overflowX:'auto', alignItems:'stretch', minHeight: 0,
      }}>
        {orders.length === 0 && (
          <div style={{
            flex: 1, display:'flex', alignItems:'center', justifyContent:'center',
            color: T.inkSoft, fontSize: 18, fontWeight: 700,
          }}>مفيش أوردرات حالياً — مبروك 🎉</div>
        )}
        {orders.map((ord, oi) => {
          const age = Math.max(0, now - ord.startedAt);
          const allDone = ord.items.every(it => it.done);
          const ac = ageColor(age, T);
          const isFlash = flashOrder === ord.num;
          return (
            <div key={ord.num} style={{
              flex: '0 0 230px',
              background: isFlash ? T.accent : T.surface,
              borderRadius: 14,
              border: `1px solid ${isFlash ? T.accent : (allDone ? T.accent : T.rule)}`,
              display:'flex', flexDirection:'column',
              transition:'background 200ms, border-color 200ms, transform 200ms, opacity 300ms',
              transform: isFlash ? 'scale(0.97)' : 'scale(1)',
              opacity: isFlash ? 0.7 : 1,
              overflow:'hidden', position:'relative',
              boxShadow: allDone && !isFlash ? `0 0 0 2px ${T.accent}33` : 'none',
            }}>
              {/* Card header */}
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding: '8px 12px',
                borderBottom: `1px solid ${isFlash ? '#ffffff33' : T.rule}`,
              }}>
                <div>
                  <div style={{
                    fontSize: 15, fontWeight: 900,
                    color: isFlash ? T.accentInk : T.ink,
                    fontFamily:'system-ui', letterSpacing: '0.02em',
                  }}>#{ord.num}</div>
                  <div style={{
                    fontSize: 11, color: isFlash ? '#ffffff' : T.inkSoft,
                    marginTop: 1, opacity: isFlash ? 0.85 : 1,
                  }}>الموظف: {ord.employee}</div>
                </div>
                <div style={{
                  display:'flex', alignItems:'center', gap: 4,
                  background: isFlash ? '#ffffff22' : ac.bg,
                  color: isFlash ? '#ffffff' : ac.fg,
                  padding:'3px 8px', borderRadius: 999,
                  fontWeight: 800, fontSize: 12,
                  fontFamily:'system-ui',
                }}>
                  <span>{fmtAge(age)}</span>
                  <span style={{ fontSize: 10, fontFamily:'"Tajawal",system-ui', fontWeight:700, opacity:0.85 }}>{ac.label}</span>
                </div>
              </div>

              {/* Items */}
              <div style={{
                flex: 1, padding: '6px 8px', display:'flex', flexDirection:'column', gap: 4,
                overflow:'hidden',
              }}>
                {ord.items.map((it, ii) => {
                  const data = window.KAHWA_ITEMS.find(x => x.id === it.id);
                  if (!data) return null;
                  return (
                    <button key={ii} onClick={()=>toggleItem(oi, ii)} style={{
                      display:'flex', alignItems:'center', gap: 8,
                      padding: '4px 6px',
                      background: it.done ? (isFlash ? '#ffffff22' : T.pillBg) : 'transparent',
                      border: `1px solid ${it.done ? 'transparent' : (isFlash ? '#ffffff22' : T.rule)}`,
                      borderRadius: 8, cursor:'pointer', fontFamily:'inherit',
                      transition:'background 150ms',
                    }}>
                      {/* Photo */}
                      <window.ItemPhoto item={data} size={36} />
                      {/* Qty */}
                      <div style={{
                        minWidth: 22, height: 20, borderRadius: 5,
                        background: isFlash ? '#ffffff22' : T.ink,
                        color: isFlash ? '#ffffff' : T.surface,
                        fontWeight: 900, fontSize: 12, fontFamily:'system-ui',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>×{it.qty}</div>
                      {/* Name + mod */}
                      <div style={{
                        flex: 1, minWidth: 0, textAlign:'right',
                        textDecoration: it.done ? 'line-through' : 'none',
                        opacity: it.done ? 0.5 : 1,
                        display:'flex', alignItems:'center', gap: 6,
                      }}>
                        {!window.KAHWA_SHOW_ITEM_NAME(data) && <window.ItemPhoto item={data} size={36} />}
                        <div>
                        <window.ItemName item={data} style={{
                          fontSize: 13, fontWeight: 700,
                          color: isFlash ? T.accentInk : T.ink,
                          lineHeight: 1.1,
                        }} />
                        {it.mod && (
                          <div style={{
                            fontSize: 10,
                            color: isFlash ? '#ffffff' : T.accent,
                            fontWeight: 700, marginTop: 1,
                            opacity: isFlash ? 0.85 : 1,
                          }}>{it.mod}</div>
                        )}
                        </div>
                      </div>
                      {/* Check */}
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: it.done ? (isFlash ? '#ffffff' : T.accent) : 'transparent',
                        border: `1.5px solid ${it.done ? (isFlash ? '#ffffff' : T.accent) : (isFlash ? '#ffffff66' : T.rule)}`,
                        color: it.done ? (isFlash ? T.accent : T.accentInk) : 'transparent',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight: 900, fontSize: 14, lineHeight: 1,
                        transition:'background 150ms',
                      }}>✓</div>
                    </button>
                  );
                })}
              </div>

              {/* Send-ready bar */}
              <button onClick={()=> allDone && sendReady(oi)} disabled={!allDone} style={{
                margin: 8, padding: `${10*buttonScale}px`,
                background: allDone ? (isFlash ? '#ffffff' : T.accent) : 'transparent',
                color: allDone ? (isFlash ? T.accent : T.accentInk) : T.inkSoft,
                border: allDone ? 'none' : `1px dashed ${T.rule}`,
                borderRadius: 10, fontFamily:'inherit',
                fontWeight: 800, fontSize: 14 * buttonScale,
                cursor: allDone ? 'pointer' : 'not-allowed',
              }}>
                {isFlash ? '✓ اترسل للموظف' : allDone ? 'تم جاهز · ابعت' : `لسه ${ord.items.filter(i=>!i.done).length} أصناف`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Recently done strip */}
      <div style={{
        display:'flex', alignItems:'center', gap: 12,
        padding: '6px 18px 8px',
        borderTop: `1px solid ${T.rule}`,
        background: T.surface,
      }}>
        <div style={{ fontSize: 11, color: T.inkSoft, fontWeight: 800, letterSpacing:'0.02em' }}>
          آخر اللي اتنفذ:
        </div>
        <div style={{ display:'flex', gap: 8, flex: 1, overflow:'hidden' }}>
          {done.map((d, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: 6,
              padding: '3px 10px',
              background: T.pillBg, borderRadius: 999,
              fontSize: 11, color: T.ink,
            }}>
              <span style={{ fontWeight: 800, fontFamily:'system-ui' }}>#{d.num}</span>
              <span style={{ color: T.inkSoft }}>·</span>
              <span>{d.employee}</span>
              <span style={{ color: T.inkSoft }}>·</span>
              <span style={{ fontFamily:'system-ui', color: T.inkSoft }}>{fmtAge(d.tookSec)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.VariationBoufiya = VariationBoufiya;
