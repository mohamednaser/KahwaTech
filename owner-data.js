// Mock data for the owner dashboard. Numbers feel "today around 14:00".
window.OWNER_DATA = {
  cafe: { name: 'قهوة الأهلي', branch: 'فرع الزمالك', owner: 'حاج رمضان' },
  today: {
    revenue: 1840,       // EGP
    revenuePrev: 1610,   // yesterday-same-time
    orders: 87,
    ordersPrev: 78,
    avgPrepSec: 142,
    avgPrepSecPrev: 168,
    cancelledPct: 3.1,
    cancelledPctPrev: 4.4,
    activeEmployees: 3,
  },
  // Hourly sales today (8am open → 14:00 now → projected dim)
  hourly: [
    { h: 8,  s: 90,  proj:false },
    { h: 9,  s: 145, proj:false },
    { h: 10, s: 210, proj:false },
    { h: 11, s: 280, proj:false },
    { h: 12, s: 320, proj:false },
    { h: 13, s: 365, proj:false },
    { h: 14, s: 180, proj:false },
    { h: 15, s: 280, proj:true },
    { h: 16, s: 340, proj:true },
    { h: 17, s: 410, proj:true },
    { h: 18, s: 470, proj:true },
    { h: 19, s: 520, proj:true },
  ],
  topItems: [
    { id:'shay',       qty: 24, rev: 360, trend:+18 },
    { id:'ahwa',       qty: 18, rev: 360, trend:+5  },
    { id:'sh-tof',     qty: 12, rev: 720, trend:+30 },
    { id:'nescafe',    qty: 11, rev: 275, trend:-8  },
    { id:'shay-nana',  qty: 9,  rev: 162, trend:+12 },
    { id:'karkade',    qty: 7,  rev: 154, trend:+22 },
  ],
  employees: [
    { name:'محمود علي',   shift:'صباحي', orders: 38, sales: 720, status:'active' },
    { name:'أحمد رفعت',   shift:'صباحي', orders: 31, sales: 640, status:'active' },
    { name:'كريم محسن',   shift:'مسائي', orders: 18, sales: 480, status:'active' },
    { name:'حسام شاهين',  shift:'بوفية', orders: 0,  sales: 0,   status:'boufiya' },
  ],
  recent: [
    { num:'A-149', t:'14:32', emp:'محمود', total: 42, status:'cooking' },
    { num:'A-148', t:'14:30', emp:'محمود', total: 58, status:'cooking' },
    { num:'A-147', t:'14:28', emp:'أحمد',  total: 36, status:'delivered' },
    { num:'A-146', t:'14:25', emp:'محمود', total: 25, status:'delivered' },
    { num:'A-145', t:'14:23', emp:'أحمد',  total: 70, status:'delivered' },
    { num:'A-144', t:'14:18', emp:'كريم',  total: 22, status:'cancelled' },
  ],
  alerts: [
    { kind:'low_stock', msg:'الـ بيبسي قارب يخلص (٤ علب)' },
    { kind:'late',      msg:'الأوردر #A-149 معدّى ٤ دقائق' },
  ],
};
