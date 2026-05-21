// ───────────────────────────────────────────────────────────────
// Past Orders + Ready Toast
// Used by the waiter's screen so they can:
//  1. See their previous orders with per-item status (queued/cooking/done)
//  2. Cancel an item that hasn't been started yet
//  3. Get a toast notification when an order becomes ready
// ───────────────────────────────────────────────────────────────

// itemStatus: 'queued' (لسه) | 'cooking' (بيتعمل) | 'done' (جاهز) | 'cancelled'
// orderStatus derived: if all items done → 'ready'; if any cooking → 'cooking'; else 'queued'

function deriveOrderStatus(items) {
  const active = items.filter(i => i.status !== 'cancelled');
  if (active.length === 0) return 'cancelled';
  if (active.every(i => i.status === 'done')) return 'ready';
  if (active.some(i => i.status === 'cooking' || i.status === 'done')) return 'cooking';
  return 'queued';
}

const STATUS_LABEL = {
  queued:    { ar: 'لسه ما بدأش',  fg: '#8a7355' },
  cooking:   { ar: 'بيتعمل',        fg: '#a87320' },
  done:      { ar: 'جاهز',          fg: '#3a8a4a' },
  cancelled: { ar: 'ملغي',          fg: '#b03a20' },
  ready:     { ar: 'الأوردر جاهز ✓', fg: '#3a8a4a' },
  delivered: { ar: 'اتسلم للزبون',   fg: '#7a7a6a' },
};

function fmtSince(now, ts) {
  const sec = Math.max(0, Math.floor((now - ts) / 1000));
  if (sec < 60) return `من ${sec} ثانية`;
  const m = Math.floor(sec / 60);
  return `من ${m} دقيقة`;
}

// ── PastOrdersPanel ──────────────────────────────────────────────
function PastOrdersPanel({ T, buttonScale = 1, orders, onCancelItem, now }) {
  return (
    <div style={{ flex: 1, display:'flex', flexDirection:'column', gap: 8, overflow:'auto', minHeight: 0, paddingLeft: 2 }}>
      {orders.length === 0 && (
        <div style={{ fontSize: 13, color: T.inkSoft, padding: 30, textAlign:'center' }}>
          لسه ما بعتش أي أوردر
        </div>
      )}
      {orders.map(ord => {
        const status = ord.delivered ? 'delivered' : deriveOrderStatus(ord.items);
        const meta = STATUS_LABEL[status];
        return (
          <div key={ord.num} style={{
            border: `1px solid ${status === 'ready' ? T.accent : T.rule}`,
            background: status === 'ready' ? `${T.accent}11` : 'transparent',
            borderRadius: 12, padding: '8px 10px',
          }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap: 6 }}>
                <span style={{ fontFamily:'system-ui', fontWeight: 900, fontSize: 13 }}>#{ord.num}</span>
                <span style={{ fontSize: 10, color: T.inkSoft }}>{fmtSince(now, ord.sentAt)}</span>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 800, color: meta.fg,
              }}>{meta.ar}</div>
            </div>
            <div style={{ marginTop: 6, display:'flex', flexDirection:'column', gap: 3 }}>
              {ord.items.map((it, ii) => {
                const data = window.KAHWA_ITEMS.find(x => x.id === it.id);
                if (!data) return null;
                const sMeta = STATUS_LABEL[it.status];
                const canCancel = it.status === 'queued';
                const isCancelled = it.status === 'cancelled';
                return (
                  <div key={ii} style={{
                    display:'flex', alignItems:'center', gap: 6,
                    fontSize: 12, opacity: isCancelled ? 0.5 : 1,
                  }}>
                    <window.ItemPhoto item={data} size={22} />
                    <div style={{
                      flex: 1, minWidth: 0,
                      textDecoration: isCancelled ? 'line-through' : 'none',
                    }}>
                      <span style={{ fontWeight: 700, color: T.ink }}>×{it.qty} {data.ar}</span>
                      {it.mod && <span style={{ color: T.inkSoft, fontSize: 11 }}> · {it.mod}</span>}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: sMeta.fg, minWidth: 44, textAlign:'center' }}>
                      {sMeta.ar}
                    </span>
                    {canCancel ? (
                      <button onClick={()=>onCancelItem(ord.num, ii)} style={{
                        padding: '2px 8px', borderRadius: 6,
                        background:'transparent', color: '#b03a20',
                        border: '1px solid #b03a2044',
                        fontFamily:'inherit', fontSize: 10, fontWeight: 700, cursor:'pointer',
                      }}>إلغاء</button>
                    ) : (
                      <span style={{ width: 38 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ReadyToast ───────────────────────────────────────────────────
function ReadyToast({ T, order, onDismiss }) {
  React.useEffect(() => {
    if (!order) return;
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [order, onDismiss]);
  if (!order) return null;
  return (
    <div style={{
      position:'absolute', top: 10, left:'50%', transform:'translateX(-50%)',
      zIndex: 20,
      background: T.accent, color: T.accentInk,
      borderRadius: 12,
      padding: '8px 14px 8px 10px',
      display:'flex', alignItems:'center', gap: 10,
      boxShadow: '0 12px 30px -6px rgba(0,0,0,0.3)',
      animation: 'kahwaToastIn 240ms cubic-bezier(.2,.9,.3,1.2)',
      fontFamily:'inherit',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: '#ffffff33',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize: 18, fontWeight: 900,
      }}>✓</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 900, lineHeight: 1.1 }}>
          الأوردر <span style={{ fontFamily:'system-ui' }}>#{order.num}</span> جاهز
        </div>
        <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
          روح خد التراي من البوفية
        </div>
      </div>
      <button onClick={onDismiss} style={{
        background:'#ffffff33', border:'none', color: T.accentInk,
        borderRadius: 6, padding: '3px 8px',
        fontFamily:'inherit', fontWeight: 800, fontSize: 11, cursor:'pointer',
      }}>تمام</button>
      <style>{`
        @keyframes kahwaToastIn {
          from { transform: translate(-50%, -10px); opacity: 0; }
          to   { transform: translate(-50%, 0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { PastOrdersPanel, ReadyToast, deriveOrderStatus, STATUS_LABEL, fmtSince });
