// Owner dashboards — landscape (tablet/laptop) and portrait (phone).
// Both render the same data; layout differs.

const NAV_ITEMS = [
  { id:'home',     ar:'الرئيسية',  glyph:'home' },
  { id:'menu',     ar:'المنيو',    glyph:'menu' },
  { id:'orders',   ar:'الأوردرات', glyph:'orders' },
  { id:'staff',    ar:'الموظفين',  glyph:'staff' },
  { id:'reports',  ar:'التقارير',  glyph:'reports' },
  { id:'settings', ar:'الإعدادات', glyph:'settings' },
];

function NavGlyph({ kind, color, size = 18 }) {
  const sw = 1.8;
  const common = { fill:'none', stroke: color, strokeWidth: sw, strokeLinecap:'round', strokeLinejoin:'round' };
  if (kind === 'home') return (
    <svg width={size} height={size} viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-3v-6h-8v6H5a2 2 0 01-2-2v-9z" {...common}/></svg>
  );
  if (kind === 'menu') return (
    <svg width={size} height={size} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" {...common}/><path d="M8 9h8M8 13h8M8 17h5" {...common}/></svg>
  );
  if (kind === 'orders') return (
    <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 7h14l-1.5 11a2 2 0 01-2 1.7H8.5a2 2 0 01-2-1.7L5 7z" {...common}/><path d="M9 7V5a3 3 0 016 0v2" {...common}/></svg>
  );
  if (kind === 'staff') return (
    <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" {...common}/><circle cx="17" cy="10" r="2.5" {...common}/><path d="M3 19c0-3 3-5 6-5s6 2 6 5M14 19c0-2 2-3.5 4-3.5s3 1 4 3.5" {...common}/></svg>
  );
  if (kind === 'reports') return (
    <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 19V8M10 19v-6M16 19v-9M22 19H2" {...common}/></svg>
  );
  if (kind === 'settings') return (
    <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" {...common}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" {...common}/></svg>
  );
  return null;
}

// ────────────────────────────────────────────────────────────
// LANDSCAPE — tablet/laptop dashboard
// ────────────────────────────────────────────────────────────
function OwnerDashboardLandscape({ W = 1180, H = 820 }) {
  const T = window.OWNER_T;
  const d = window.OWNER_DATA;
  const [active, setActive] = React.useState('home');

  // The period toggle drives the KPI cards and the sales chart.
  const [period, setPeriod] = React.useState('today');
  const PERIODS = {
    today: {
      label:'اليوم', headerSub:'اليوم · 14:32', hint:'عن إمبارح',
      chartTitle:'مبيعات اليوم', chartSub:'بالساعة · من ٨ صباحاً · المتقطع = متوقع',
      revenue:1840, revenuePrev:1610, orders:87, ordersPrev:78,
      avgPrepSec:142, avgPrepSecPrev:168, cancel:3.1, cancelPrev:4.4,
      chart: d.hourly,
    },
    week: {
      label:'الأسبوع', headerSub:'آخر ٧ أيام', hint:'عن الأسبوع اللي فات',
      chartTitle:'مبيعات الأسبوع', chartSub:'باليوم · آخر ٧ أيام · المتقطع = متوقع',
      revenue:11680, revenuePrev:10240, orders:548, ordersPrev:511,
      avgPrepSec:150, avgPrepSecPrev:171, cancel:3.4, cancelPrev:4.1,
      chart: [
        { h:'سبت', s:1620 }, { h:'حد', s:1740 }, { h:'اتنين', s:1510 },
        { h:'تلات', s:1680 }, { h:'ربع', s:1920 }, { h:'خميس', s:2180 },
        { h:'جمعة', s:1030, proj:true },
      ],
    },
    month: {
      label:'الشهر', headerSub:'آخر ٣٠ يوم', hint:'عن الشهر اللي فات',
      chartTitle:'مبيعات الشهر', chartSub:'بالأسبوع · آخر ٤ أسابيع · المتقطع = متوقع',
      revenue:49600, revenuePrev:44100, orders:2320, ordersPrev:2140,
      avgPrepSec:155, avgPrepSecPrev:166, cancel:3.8, cancelPrev:4.6,
      chart: [
        { h:'أسبوع ١', s:11680 }, { h:'أسبوع ٢', s:12340 },
        { h:'أسبوع ٣', s:13110 }, { h:'أسبوع ٤', s:12470, proj:true },
      ],
    },
  };
  const P = PERIODS[period];

  // Responsive breakpoints driven by the live viewport width (undefined →
  // wide desktop defaults). The dashboard fills the viewport fluidly.
  const { w: vw } = window.useViewport();
  const collapsed = vw < 920;                       // sidebar → icons only
  const kpiCols   = vw < 720 ? 2 : 4;
  const chartCols = vw < 980 ? '1fr' : '1.5fr 1fr';
  const bottomCols = vw < 760 ? '1fr' : (vw < 1180 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)');
  const titleSize = vw < 980 ? 17 : 22;

  return (
    <div dir="rtl" style={{
      width:'100%', height:'100%', background: T.bg, color: T.ink,
      fontFamily: window.ownerFont, display:'flex', overflow:'hidden',
    }}>
      {/* Sidebar — collapses to icons on narrow widths */}
      <aside style={{
        width: collapsed ? 68 : 220, background: T.surface,
        borderInlineStart: `1px solid ${T.rule}`,
        display:'flex', flexDirection:'column', flexShrink: 0,
        padding: collapsed ? '18px 10px' : '18px 14px',
        transition: 'width 200ms ease',
      }}>
        <div style={{
          display:'flex', alignItems:'center', gap: 10, padding:'2px 4px 16px',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, flexShrink: 0,
            background: T.accent, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight: 900, fontSize: 18, fontFamily:'system-ui',
          }}>K</div>
          {!collapsed && (
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>{d.cafe.name}</div>
              <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 2 }}>{d.cafe.branch}</div>
            </div>
          )}
        </div>
        <nav style={{ display:'flex', flexDirection:'column', gap: 2 }}>
          {NAV_ITEMS.map(it => {
            const on = it.id === active;
            return (
              <button key={it.id} onClick={()=>setActive(it.id)} title={it.ar} style={{
                display:'flex', alignItems:'center', gap: 10,
                padding: collapsed ? '10px 0' : '10px 12px', borderRadius: 10,
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: on ? T.bg : 'transparent',
                color: on ? T.ink : T.inkSoft,
                border:'none', cursor:'pointer',
                fontFamily:'inherit', fontWeight: on ? 800 : 600, fontSize: 14,
                textAlign:'right',
              }}>
                <NavGlyph kind={it.glyph} color={on ? T.accent : T.inkSoft} size={18} />
                {!collapsed && <span style={{ flex: 1, textAlign:'right' }}>{it.ar}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ flex: 1 }} />
        {/* Owner profile pin */}
        <div style={{
          display:'flex', alignItems:'center', gap: 10,
          padding: collapsed ? '8px 0' : '10px 8px', borderRadius: 12,
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: T.bg, marginTop: 8,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999, background: T.ink, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
            fontWeight: 900, fontSize: 15, fontFamily:'system-ui',
          }}>ر</div>
          {!collapsed && (
            <div style={{ lineHeight: 1.1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{d.cafe.owner}</div>
              <div style={{ fontSize: 10, color: T.inkSoft, marginTop: 1 }}>صاحب القهوة</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <main style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          display:'flex', alignItems:'center', justifyContent:'space-between', gap: 12,
          padding: collapsed ? '12px 16px' : '14px 22px',
          borderBottom: `1px solid ${T.rule}`, background: T.surface,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: titleSize, fontWeight: 900, color: T.ink, letterSpacing:'-0.01em',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            }}>
              يومك الحلو يا {d.cafe.owner} 👋
            </div>
            <div style={{
              fontSize: 13, color: T.inkSoft, marginTop: 2,
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            }}>
              نظرة سريعة على القهوة · {P.headerSub}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 8, flexShrink: 0 }}>
            {['today','week','month'].map(k => {
              const on = k === period;
              return (
                <button key={k} onClick={()=>setPeriod(k)}
                  style={on ? ownerPill(T) : { ...ownerPill(T), background:'transparent', color: T.inkSoft }}>
                  {PERIODS[k].label}
                </button>
              );
            })}
            <div style={{
              width: 38, height: 38, borderRadius: 999, background: T.bg,
              border:`1px solid ${T.rule}`, color: T.ink,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 18, position:'relative',
            }}>
              🔔
              <div style={{
                position:'absolute', top: -2, insetInlineEnd: -2,
                background:'#b03a20', color:'#fff',
                width: 16, height: 16, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize: 10, fontWeight: 900, fontFamily:'system-ui',
              }}>{d.alerts.length}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: 18, overflow:'auto', display:'flex', flexDirection:'column', gap: 14 }}>
          {/* KPIs row */}
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${kpiCols}, 1fr)`, gap: 12 }}>
            <window.KpiCard label="الإيراد" value={P.revenue} unit="ج" prev={P.revenuePrev} hint={P.hint} />
            <window.KpiCard label="عدد الأوردرات" value={P.orders} unit="أوردر" prev={P.ordersPrev} hint={P.hint} />
            <window.KpiCard label="متوسط وقت التنفيذ" value={Math.round(P.avgPrepSec/60*10)/10} unit="دقيقة" prev={P.avgPrepSecPrev/60} invertDelta hint={P.hint} />
            <window.KpiCard label="نسبة الإلغاء" value={P.cancel} unit="%" prev={P.cancelPrev} invertDelta formatPct hint={P.hint} />
          </div>

          {/* Charts row */}
          <div style={{ display:'grid', gridTemplateColumns: chartCols, gap: 12 }}>
            <window.Panel title={P.chartTitle} subtitle={P.chartSub}
              action={<div style={{ display:'flex', gap: 12, alignItems:'center', fontSize: 11, color: T.inkSoft }}>
                <span style={{ display:'flex', alignItems:'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: T.accent }}/> فعلي
                </span>
                <span style={{ display:'flex', alignItems:'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: T.rule, border:`1px dashed ${T.inkSoft}` }}/> متوقع
                </span>
              </div>}>
              <window.HourlyBars data={P.chart} height={180} />
            </window.Panel>
            <window.Panel title="الأكثر مبيعاً" subtitle="اليوم · حسب الإيراد"
              action={<button style={ownerLink(T)}>الكل ←</button>}>
              <window.TopItemsList items={d.topItems.slice(0, 5)} />
            </window.Panel>
          </div>

          {/* Bottom row */}
          <div style={{ display:'grid', gridTemplateColumns: bottomCols, gap: 12 }}>
            <window.Panel title="الموظفين النهارده" subtitle={`${d.today.activeEmployees} شغّالين دلوقتي`}
              action={<button style={ownerLink(T)}>إدارة ←</button>}>
              <window.EmployeeList employees={d.employees} />
            </window.Panel>
            <window.Panel title="آخر الأوردرات" subtitle="فعلي · live"
              action={<button style={ownerLink(T)}>كل الأوردرات ←</button>}>
              <window.RecentOrdersFeed orders={d.recent} />
            </window.Panel>
            <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
              <window.Panel title="تنبيهات" dense>
                <window.AlertList alerts={d.alerts} />
              </window.Panel>
              <window.Panel title="إجراءات سريعة" dense>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 6, marginTop: 2 }}>
                  <button style={ownerAction(T)}>+ إضافة صنف</button>
                  <button style={ownerAction(T)}>+ موظف جديد</button>
                  <button style={ownerAction(T)}>تقرير اليوم</button>
                  <button style={ownerAction(T)}>المخزون</button>
                </div>
              </window.Panel>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ownerPill(T) {
  return {
    padding: '7px 14px', background: T.ink, color:'#fff',
    border:'none', borderRadius: 999,
    fontFamily:'inherit', fontWeight: 800, fontSize: 13, cursor:'pointer',
  };
}
function ownerLink(T) {
  return {
    background:'transparent', color: T.accent, border:'none',
    fontFamily:'inherit', fontWeight: 700, fontSize: 12, cursor:'pointer',
  };
}
function ownerAction(T) {
  return {
    padding: '8px 6px', background: T.bg, color: T.ink,
    border: `1px solid ${T.rule}`, borderRadius: 10,
    fontFamily:'inherit', fontWeight: 700, fontSize: 12, cursor:'pointer',
  };
}

// ────────────────────────────────────────────────────────────
// PORTRAIT — phone dashboard
// ────────────────────────────────────────────────────────────
function OwnerDashboardPortrait() {
  const T = window.OWNER_T;
  const d = window.OWNER_DATA;
  const [active, setActive] = React.useState('home');

  return (
    <div dir="rtl" style={{
      width:'100%', height:'100%', background: T.bg, color: T.ink,
      fontFamily: window.ownerFont,
      display:'flex', flexDirection:'column', overflow:'hidden', position:'relative',
    }}>
      {/* Top bar */}
      <div style={{
        padding:'8px 16px 10px', background: T.surface,
        borderBottom:`1px solid ${T.rule}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: T.accent, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight: 900, fontSize: 16, fontFamily:'system-ui',
          }}>K</div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 900, fontSize: 15 }}>{d.cafe.name}</div>
            <div style={{ fontSize: 10, color: T.inkSoft, marginTop: 2 }}>{d.cafe.branch}</div>
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 999, background: T.bg,
          border:`1px solid ${T.rule}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative', fontSize: 16,
        }}>
          🔔
          <div style={{
            position:'absolute', top: -2, insetInlineEnd: -2,
            background:'#b03a20', color:'#fff',
            width: 14, height: 14, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 9, fontWeight: 900, fontFamily:'system-ui',
          }}>{d.alerts.length}</div>
        </div>
      </div>

      {/* Scroll content */}
      <div style={{ flex: 1, overflow:'auto', padding: '12px 14px 78px', display:'flex', flexDirection:'column', gap: 12 }}>
        {/* Greeting */}
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.1, color: T.ink }}>
            يومك الحلو يا {d.cafe.owner} 👋
          </div>
          <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 3 }}>
            نظرة سريعة على القهوة · اليوم · 14:32
          </div>
        </div>

        {/* Period pill */}
        <div style={{ display:'flex', gap: 4, background: T.surface, padding: 4, borderRadius: 12, border:`1px solid ${T.rule}` }}>
          {['اليوم','الأسبوع','الشهر'].map((p, i) => (
            <button key={p} style={{
              flex: 1, padding: '8px 6px',
              background: i === 0 ? T.ink : 'transparent',
              color: i === 0 ? '#fff' : T.inkSoft,
              border:'none', borderRadius: 9,
              fontFamily:'inherit', fontWeight: i === 0 ? 800 : 700, fontSize: 13, cursor:'pointer',
            }}>{p}</button>
          ))}
        </div>

        {/* Big headline KPI */}
        <div style={{
          background: T.ink, color:'#fff',
          borderRadius: 18, padding: '14px 16px',
          position:'relative', overflow:'hidden',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 700 }}>إيراد اليوم</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 8, marginTop: 4 }}>
            <div style={{ fontSize: 44, fontWeight: 900, fontFamily:'system-ui', letterSpacing:'-0.03em', lineHeight: 1 }}>
              {d.today.revenue.toLocaleString('ar-EG')}
            </div>
            <div style={{ fontSize: 16, opacity: 0.6, fontWeight: 700 }}>جنيه</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 6, marginTop: 8 }}>
            <span style={{ background:'#3a8a4a', color:'#fff', padding:'2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 800, fontFamily:'system-ui' }}>
              ▲ {Math.round(((d.today.revenue - d.today.revenuePrev) / d.today.revenuePrev) * 100)}%
            </span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>عن إمبارح نفس الوقت</span>
          </div>
          {/* Mini sparkline */}
          <div style={{
            position:'absolute', bottom: 10, insetInlineStart: 14, opacity: 0.7,
            display:'flex', alignItems:'flex-end', gap: 2, height: 28,
          }}>
            {d.hourly.filter(h => !h.proj).map((h, i) => (
              <div key={i} style={{
                width: 4, height: `${(h.s / 365) * 28}px`,
                background:'#7fb78d', borderRadius: 2,
              }} />
            ))}
          </div>
        </div>

        {/* 3 mini-KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8 }}>
          <window.KpiCard label="أوردرات" value={d.today.orders} prev={d.today.ordersPrev} dense />
          <window.KpiCard label="متوسط ⏱" value={Math.round(d.today.avgPrepSec/60*10)/10} unit="د" prev={d.today.avgPrepSecPrev/60} invertDelta dense />
          <window.KpiCard label="إلغاء" value={d.today.cancelledPct} unit="%" prev={d.today.cancelledPctPrev} invertDelta formatPct dense />
        </div>

        {/* Alerts */}
        {d.alerts.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.inkSoft, marginBottom: 6, letterSpacing:'0.02em' }}>تنبيهات</div>
            <window.AlertList alerts={d.alerts} />
          </div>
        )}

        {/* Hourly chart */}
        <div style={{
          background: T.surface, borderRadius: 16,
          border: `1px solid ${T.rule}`, padding: '12px 14px',
        }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>مبيعات اليوم بالساعة</div>
            <div style={{ fontSize: 10, color: T.inkSoft }}>المتقطع = متوقع</div>
          </div>
          <window.HourlyBars data={d.hourly} height={120} />
        </div>

        {/* Top items */}
        <div style={{
          background: T.surface, borderRadius: 16,
          border: `1px solid ${T.rule}`, padding: '12px 14px',
        }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>الأكثر مبيعاً</div>
            <button style={ownerLink(T)}>الكل ←</button>
          </div>
          <window.TopItemsList items={d.topItems.slice(0, 4)} />
        </div>

        {/* Employees */}
        <div style={{
          background: T.surface, borderRadius: 16,
          border: `1px solid ${T.rule}`, padding: '12px 14px',
        }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>الموظفين النهارده</div>
            <button style={ownerLink(T)}>إدارة ←</button>
          </div>
          <window.EmployeeList employees={d.employees} />
        </div>

        {/* Recent */}
        <div style={{
          background: T.surface, borderRadius: 16,
          border: `1px solid ${T.rule}`, padding: '12px 14px',
        }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>آخر الأوردرات</div>
            <button style={ownerLink(T)}>الكل ←</button>
          </div>
          <window.RecentOrdersFeed orders={d.recent.slice(0, 5)} compact />
        </div>
      </div>

      {/* Bottom nav */}
      <nav style={{
        position:'absolute', bottom: 0, insetInline: 0,
        background: T.surface, borderTop:`1px solid ${T.rule}`,
        display:'flex', justifyContent:'space-around',
        padding: '6px 4px 10px',
      }}>
        {NAV_ITEMS.filter(it => it.id !== 'settings').slice(0, 5).map(it => {
          const on = it.id === active;
          return (
            <button key={it.id} onClick={()=>setActive(it.id)} style={{
              flex: 1, background:'transparent', border:'none',
              display:'flex', flexDirection:'column', alignItems:'center', gap: 2,
              padding: '4px 0', cursor:'pointer',
              color: on ? T.accent : T.inkSoft,
              fontFamily:'inherit',
            }}>
              <NavGlyph kind={it.glyph} color={on ? T.accent : T.inkSoft} size={20} />
              <span style={{ fontSize: 10, fontWeight: on ? 800 : 600 }}>{it.ar}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

Object.assign(window, { OwnerDashboardLandscape, OwnerDashboardPortrait, NAV_ITEMS });
