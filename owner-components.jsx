// Shared owner-dashboard primitives — KPI card, bar chart, list rows.
// Single fixed sage palette (via FAST_THEMES), with an inline fallback.

const OWNER_T = (window.FAST_THEMES && window.FAST_THEMES.sage) || {
  bg:'#f4f4f0', surface:'#fff', ink:'#1a1a14', inkSoft:'#7a7a6a',
  accent:'#3a6a48', accentInk:'#fff', rule:'#e2e2dc', pillBg:'#eaeae2',
};
window.OWNER_T = OWNER_T;
const ownerFont = '"Tajawal", system-ui, sans-serif';

// ── KpiCard ────────────────────────────────────────────────
function KpiCard({ label, value, unit, prev, formatPct = false, invertDelta = false, hint, dense = false }) {
  // Compute delta vs prev
  let deltaPct = null;
  if (typeof prev === 'number' && prev > 0) {
    deltaPct = ((value - prev) / prev) * 100;
  }
  const isGood = deltaPct == null ? null : (invertDelta ? deltaPct < 0 : deltaPct > 0);
  const deltaColor = isGood == null ? OWNER_T.inkSoft : (isGood ? '#3a8a4a' : '#b03a20');
  const sign = deltaPct == null ? '' : (deltaPct > 0 ? '▲' : deltaPct < 0 ? '▼' : '·');

  return (
    <div style={{
      background: OWNER_T.surface, borderRadius: 16,
      border: `1px solid ${OWNER_T.rule}`,
      padding: dense ? '10px 12px' : '14px 16px',
      display:'flex', flexDirection:'column', gap: dense ? 2 : 4,
    }}>
      <div style={{ fontSize: dense ? 11 : 12, color: OWNER_T.inkSoft, fontWeight: 700 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap: 4 }}>
        <div style={{
          fontSize: dense ? 22 : 28, fontWeight: 900, color: OWNER_T.ink,
          letterSpacing:'-0.02em', lineHeight: 1, fontFamily:'system-ui',
        }}>{formatPct ? value.toFixed(1) : value.toLocaleString('ar-EG')}</div>
        {unit && <div style={{ fontSize: dense ? 12 : 14, color: OWNER_T.inkSoft, fontWeight: 700 }}>{unit}</div>}
      </div>
      {deltaPct != null && (
        <div style={{
          fontSize: dense ? 10 : 11, fontWeight: 700, color: deltaColor,
          display:'flex', alignItems:'center', gap: 4,
        }}>
          <span style={{ fontSize: dense ? 8 : 9 }}>{sign}</span>
          <span style={{ fontFamily:'system-ui' }}>{Math.abs(deltaPct).toFixed(0)}%</span>
          <span style={{ color: OWNER_T.inkSoft, fontWeight: 600 }}>{hint || 'عن إمبارح'}</span>
        </div>
      )}
    </div>
  );
}

// ── HourlyBars ─────────────────────────────────────────────
function HourlyBars({ data, height = 120 }) {
  const max = Math.max(...data.map(d => d.s));
  return (
    <div style={{
      display:'flex', alignItems:'flex-end', gap: 4,
      height, width:'100%',
    }}>
      {data.map(d => {
        const h = Math.max(4, (d.s / max) * (height - 24));
        return (
          <div key={d.h} style={{
            flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
          }}>
            <div style={{
              fontSize: 9, color: OWNER_T.inkSoft, fontWeight: 700,
              fontFamily:'system-ui', opacity: d.proj ? 0.5 : 1,
            }}>{d.s}</div>
            <div style={{
              width: '100%', height: h, borderRadius: '6px 6px 2px 2px',
              background: d.proj ? `repeating-linear-gradient(45deg, ${OWNER_T.pillBg} 0 4px, transparent 4px 8px), ${OWNER_T.rule}` : OWNER_T.accent,
              border: d.proj ? `1px dashed ${OWNER_T.rule}` : 'none',
              transition:'height 200ms',
            }} />
            <div style={{
              fontSize: 10, color: OWNER_T.inkSoft, fontWeight: 700,
              fontFamily:'system-ui',
            }}>{d.h}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── TopItemsList ──────────────────────────────────────────
function TopItemsList({ items, compact = false }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: compact ? 4 : 6 }}>
      {items.map((row, i) => {
        const data = window.KAHWA_ITEMS.find(x => x.id === row.id);
        if (!data) return null;
        const tColor = row.trend > 0 ? '#3a8a4a' : row.trend < 0 ? '#b03a20' : OWNER_T.inkSoft;
        return (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap: 10,
            padding: compact ? '4px 0' : '6px 0',
            borderBottom: i < items.length - 1 ? `1px solid ${OWNER_T.rule}` : 'none',
          }}>
            <div style={{
              width: 18, color: OWNER_T.inkSoft, fontWeight: 800,
              fontSize: 12, fontFamily:'system-ui', textAlign:'center',
            }}>{i + 1}</div>
            <window.ItemPhoto item={data} size={compact ? 32 : 38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <window.ItemName item={data} style={{ fontSize: compact ? 13 : 14, fontWeight: 700, color: OWNER_T.ink, lineHeight: 1.1 }} />
              <div style={{ fontSize: 11, color: OWNER_T.inkSoft, marginTop: 1 }}>{row.qty} كوب</div>
            </div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize: compact ? 13 : 14, fontWeight: 800, color: OWNER_T.ink, fontFamily:'system-ui' }}>{row.rev} <span style={{ fontSize: 10, color: OWNER_T.inkSoft }}>ج</span></div>
              <div style={{ fontSize: 10, fontWeight: 700, color: tColor, fontFamily:'system-ui', textAlign:'left' }}>
                {row.trend > 0 ? '▲' : row.trend < 0 ? '▼' : '·'} {Math.abs(row.trend)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── EmployeeRow ───────────────────────────────────────────
function EmployeeList({ employees, compact = false }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: compact ? 4 : 6 }}>
      {employees.map((e, i) => {
        const isBoufiya = e.status === 'boufiya';
        const initial = e.name.charAt(0);
        return (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap: 10,
            padding: compact ? '4px 0' : '6px 0',
            borderBottom: i < employees.length - 1 ? `1px solid ${OWNER_T.rule}` : 'none',
          }}>
            <div style={{
              width: compact ? 30 : 34, height: compact ? 30 : 34, borderRadius: 999,
              background: isBoufiya ? '#a87320' : OWNER_T.accent, color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight: 900, fontSize: 14, fontFamily:'system-ui',
              position:'relative',
            }}>
              {initial}
              <div style={{
                position:'absolute', bottom:-1, insetInlineEnd:-1,
                width: 9, height: 9, borderRadius:'50%',
                background:'#3a8a4a', border:`2px solid ${OWNER_T.surface}`,
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: compact ? 13 : 14, fontWeight: 700, color: OWNER_T.ink, lineHeight: 1.1 }}>{e.name}</div>
              <div style={{ fontSize: 11, color: OWNER_T.inkSoft, marginTop: 1 }}>
                {e.shift} {isBoufiya ? '· بوفية' : `· ${e.orders} أوردر`}
              </div>
            </div>
            {!isBoufiya && (
              <div style={{ textAlign:'left' }}>
                <div style={{ fontSize: compact ? 13 : 14, fontWeight: 800, color: OWNER_T.ink, fontFamily:'system-ui' }}>
                  {e.sales} <span style={{ fontSize: 10, color: OWNER_T.inkSoft }}>ج</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── RecentOrdersFeed ──────────────────────────────────────
const STATUS_BADGE = {
  cooking:   { ar:'بيتعمل',   bg:'#fff0c8', fg:'#a87320' },
  delivered: { ar:'اتسلم',    bg:'#e6f0e8', fg:'#3a8a4a' },
  cancelled: { ar:'ملغي',     bg:'#ffe2d8', fg:'#b03a20' },
};
function RecentOrdersFeed({ orders, compact = false }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 0 }}>
      {orders.map((o, i) => {
        const s = STATUS_BADGE[o.status];
        return (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap: 8,
            padding: compact ? '5px 0' : '7px 0',
            borderBottom: i < orders.length - 1 ? `1px solid ${OWNER_T.rule}` : 'none',
            fontSize: compact ? 12 : 13,
          }}>
            <div style={{ fontWeight: 900, fontFamily:'system-ui', color: OWNER_T.ink, minWidth: 48 }}>#{o.num}</div>
            <div style={{ color: OWNER_T.inkSoft, fontFamily:'system-ui', minWidth: 36 }}>{o.t}</div>
            <div style={{ flex: 1, fontWeight: 600 }}>{o.emp}</div>
            <div style={{ fontWeight: 800, fontFamily:'system-ui', color: OWNER_T.ink }}>{o.total} ج</div>
            <div style={{
              background: s.bg, color: s.fg,
              padding:'2px 8px', borderRadius: 999,
              fontSize: 10, fontWeight: 800, minWidth: 50, textAlign:'center',
            }}>{s.ar}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── AlertCard ─────────────────────────────────────────────
function AlertList({ alerts }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
      {alerts.map((a, i) => (
        <div key={i} style={{
          display:'flex', alignItems:'center', gap: 8,
          padding: '6px 10px',
          background: a.kind === 'late' ? '#ffe2d8' : '#fff0c8',
          borderRadius: 10,
          fontSize: 12, color: OWNER_T.ink, fontWeight: 700,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius:'50%',
            background: a.kind === 'late' ? '#b03a20' : '#a87320',
          }} />
          {a.msg}
        </div>
      ))}
    </div>
  );
}

// ── Panel wrapper ─────────────────────────────────────────
function Panel({ title, subtitle, action, children, dense = false }) {
  return (
    <div style={{
      background: OWNER_T.surface, borderRadius: 16,
      border: `1px solid ${OWNER_T.rule}`,
      padding: dense ? '10px 12px' : '14px 16px',
      display:'flex', flexDirection:'column',
      minHeight: 0,
    }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: dense ? 13 : 15, fontWeight: 800, color: OWNER_T.ink }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: OWNER_T.inkSoft, marginTop: 1 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow:'auto' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, {
  KpiCard, HourlyBars, TopItemsList, EmployeeList, RecentOrdersFeed, AlertList, Panel,
  OWNER_T, ownerFont,
});
