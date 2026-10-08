import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FaLock as Lock,
  FaArrowsRotate as Refresh,
  FaDownload as Download,
  FaTriangleExclamation as Warning,
  FaCircleXmark as SoldOut,
  FaRightFromBracket as SignOut,
  FaTable as TableIcon,
  FaChartColumn as ChartIcon,
} from 'react-icons/fa6';

// Internal sales dashboard (/dashboard). Data comes from /api/sales (Paystack), password-protected.

interface Order {
  reference: string;
  paidAt: string;
  amount: number;
  fees: number;
  currency: string;
  tier: string;
  pool: 'general' | 'premium' | 'executive' | null;
  quantity: number;
  people: number;
  promoCode: string | null;
  community: string | null;
  name: string | null;
  email: string | null;
}

interface SalesData {
  generatedAt: string;
  limits: Record<'general' | 'premium' | 'executive', number>;
  orders: Order[];
}

type RangeId = 'all' | '30d' | '7d' | 'today';
const RANGES: { id: RangeId; label: string; days: number | null }[] = [
  { id: 'all', label: 'All time', days: null },
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: 'today', label: 'Today', days: 1 },
];

const POOL_LABELS = { general: 'General', premium: 'Premium', executive: 'Executive' } as const;
const NO_CODE = 'No code (direct sales)';
const KEY_STORAGE = 'p4i-dashboard-key';

// Chart colours (dark surface #10324B): one accent + a de-emphasis grey.
const ACCENT = '#83D318';
const MUTED_MARK = '#6B8799';

const money = (n: number) => `GHS ${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const int = (n: number) => n.toLocaleString('en-GB');
const dayKey = (iso: string) => iso.slice(0, 10); // Accra is UTC+0, so the UTC date is the local date
const dayLabel = (key: string) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const communityOf = (o: Order) => o.community ?? (o.promoCode ? `Code ${o.promoCode}` : NO_CODE);

const readStoredKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
};
const storeKey = (key: string | null) => {
  try {
    if (key) sessionStorage.setItem(KEY_STORAGE, key);
    else sessionStorage.removeItem(KEY_STORAGE);
  } catch {
    /* storage unavailable: stay signed in for this page view only */
  }
};

const niceTicks = (max: number) => {
  if (max <= 0) return [0];
  const raw = max / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw)!;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
};

const useWidth = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
};

const downloadCsv = (orders: Order[]) => {
  const cols: [string, (o: Order) => string | number][] = [
    ['Paid at', (o) => o.paidAt],
    ['Reference', (o) => o.reference],
    ['Name', (o) => o.name ?? ''],
    ['Email', (o) => o.email ?? ''],
    ['Tier', (o) => o.tier],
    ['Quantity', (o) => o.quantity],
    ['People admitted', (o) => o.people],
    ['Promo code', (o) => o.promoCode ?? ''],
    ['Community', (o) => communityOf(o)],
    ['Amount (GHS)', (o) => o.amount],
    ['Paystack fees (GHS)', (o) => o.fees],
  ];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [cols.map(([h]) => esc(h)).join(','), ...orders.map((o) => cols.map(([, f]) => esc(f(o))).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `p4i-sales-${dayKey(new Date().toISOString())}.csv` });
  a.click();
  URL.revokeObjectURL(url);
};

/* ---------- pieces ---------- */

const Card: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  subtitle,
  action,
  children,
}) => (
  <section className="rounded-2xl bg-[#10324B] border border-white/10 p-5 sm:p-6">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const StatTile: React.FC<{ label: string; value: string; note?: string }> = ({ label, value, note }) => (
  <div className="rounded-2xl bg-[#10324B] border border-white/10 p-5">
    <p className="text-xs font-semibold text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    {note && <p className="mt-1 text-xs text-slate-400">{note}</p>}
  </div>
);

const SlotMeter: React.FC<{ label: string; sold: number; limit: number }> = ({ label, sold, limit }) => {
  const ratio = limit ? Math.min(1, sold / limit) : 0;
  const full = sold >= limit;
  const nearlyFull = !full && ratio >= 0.9;
  const fill = full ? '#d03b3b' : nearlyFull ? '#fab219' : ACCENT;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-sm text-slate-300 tabular-nums">
          <strong className="text-white">{int(sold)}</strong> / {int(limit)} people
        </span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: `${fill}33` }}>
        <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, backgroundColor: fill }} />
      </div>
      <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1.5">
        {full ? (
          <>
            <SoldOut className="w-3 h-3 text-[#d03b3b]" /> Sold out
          </>
        ) : nearlyFull ? (
          <>
            <Warning className="w-3 h-3 text-[#fab219]" /> Almost full · {int(limit - sold)} left
          </>
        ) : (
          <>{int(limit - sold)} left</>
        )}
      </p>
    </div>
  );
};

const DailyRevenueChart: React.FC<{ days: { key: string; revenue: number; orders: number }[] }> = ({ days }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const width = useWidth(wrapRef);
  const [hover, setHover] = useState<number | null>(null);

  const height = 220;
  const pad = { top: 22, right: 8, bottom: 26, left: 64 };
  const plotW = Math.max(0, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;
  const ticks = niceTicks(Math.max(0, ...days.map((d) => d.revenue)));
  const top = ticks[ticks.length - 1] || 1;
  const band = days.length ? plotW / days.length : 0;
  const barW = Math.max(2, Math.min(24, band * 0.7));
  const y = (v: number) => pad.top + plotH - (v / top) * plotH;
  const labelEvery = Math.max(1, Math.ceil(days.length / Math.max(1, Math.floor(plotW / 60))));
  const peak = days.reduce((best, d, i) => (d.revenue > (days[best]?.revenue ?? -1) ? i : best), 0);

  const column = (x: number, yTop: number, w: number, h: number) => {
    const r = Math.min(4, h, w / 2);
    const yb = yTop + h;
    return `M${x},${yb} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + w - r} Q${x + w},${yTop} ${x + w},${yTop + r} V${yb} Z`;
  };

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Revenue per day">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? '#3A5C72' : '#1E4A66'} strokeWidth={1} />
              <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-slate-400 text-[11px] tabular-nums">
                {t >= 1000 ? `${(t / 1000).toLocaleString('en-GB')}k` : t}
              </text>
            </g>
          ))}
          {days.map((d, i) => {
            const cx = pad.left + band * i + band / 2;
            const h = Math.max(0, y(0) - y(d.revenue));
            return (
              <g key={d.key}>
                {d.revenue > 0 && (
                  <path d={column(cx - barW / 2, y(d.revenue), barW, h)} fill={ACCENT} opacity={hover === null || hover === i ? 1 : 0.55} />
                )}
                {i === peak && d.revenue > 0 && (
                  <text x={cx} y={y(d.revenue) - 6} textAnchor="middle" className="fill-white text-[11px] font-semibold">
                    {money(d.revenue)}
                  </text>
                )}
                {i % labelEvery === 0 && (
                  <text x={cx} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[11px]">
                    {dayLabel(d.key)}
                  </text>
                )}
                {/* hit area: the whole band, bigger than the mark */}
                <rect
                  x={pad.left + band * i}
                  y={pad.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${dayLabel(d.key)}: ${money(d.revenue)}, ${d.orders} orders`}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="outline-none"
                />
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && days[hover] && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-[#0A1F2E] border border-white/15 px-3 py-2 shadow-xl whitespace-nowrap"
          style={{
            left: Math.min(Math.max(pad.left + band * hover + band / 2, 70), width - 70),
            top: 0,
          }}
        >
          <p className="text-sm font-semibold text-white tabular-nums">{money(days[hover].revenue)}</p>
          <p className="text-xs text-slate-400">
            {dayLabel(days[hover].key)} · {days[hover].orders} {days[hover].orders === 1 ? 'order' : 'orders'}
          </p>
        </div>
      )}
    </div>
  );
};

/* ---------- page ---------- */

export const SalesDashboard: React.FC = () => {
  const [key, setKey] = useState(readStoredKey);
  const [keyInput, setKeyInput] = useState('');
  const [data, setData] = useState<SalesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<RangeId>('all');
  const [showDailyTable, setShowDailyTable] = useState(false);

  // keep this page out of search engines
  useEffect(() => {
    const meta = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex, nofollow' });
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Sales Dashboard | Play4Impact';
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);

  const load = useCallback(async (k: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sales', { headers: { 'x-dashboard-key': k } });
      const body = await res.json().catch(() => null);
      if (res.status === 401) {
        storeKey(null);
        setKey('');
        setError('Wrong password.');
        return;
      }
      if (!res.ok || !body?.orders) {
        setError(body?.error ?? 'Could not load sales. Is the dashboard deployed on Vercel?');
        return;
      }
      setData(body);
    } catch {
      setError('Could not reach the sales service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (key) load(key);
  }, [key, load]);

  const orders = useMemo(() => {
    if (!data) return [];
    const days = RANGES.find((r) => r.id === range)!.days;
    if (!days) return data.orders;
    const today = dayKey(new Date().toISOString());
    const from = new Date(`${today}T00:00:00Z`);
    from.setUTCDate(from.getUTCDate() - (days - 1));
    const fromKey = dayKey(from.toISOString());
    return data.orders.filter((o) => dayKey(o.paidAt) >= fromKey);
  }, [data, range]);

  const stats = useMemo(() => {
    const gross = orders.reduce((s, o) => s + o.amount, 0);
    const fees = orders.reduce((s, o) => s + o.fees, 0);
    const people = orders.reduce((s, o) => s + o.people, 0);
    const coded = orders.filter((o) => o.promoCode);
    const codedRevenue = coded.reduce((s, o) => s + o.amount, 0);

    const byCommunity = new Map<string, { orders: number; people: number; revenue: number }>();
    const byTier = new Map<string, { orders: number; people: number; revenue: number }>();
    for (const o of orders) {
      for (const [map, k] of [
        [byCommunity, communityOf(o)],
        [byTier, o.tier],
      ] as const) {
        const row = map.get(k) ?? { orders: 0, people: 0, revenue: 0 };
        row.orders += 1;
        row.people += o.people;
        row.revenue += o.amount;
        map.set(k, row);
      }
    }
    const sortRows = (m: typeof byTier) => [...m.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.revenue - a.revenue);

    // one column per day from the first sale (or range start) to today
    const today = dayKey(new Date().toISOString());
    const firstKey = orders.length ? orders.map((o) => dayKey(o.paidAt)).sort()[0] : today;
    const rangeDays = RANGES.find((r) => r.id === range)!.days;
    const start = new Date(`${rangeDays ? today : firstKey}T00:00:00Z`);
    if (rangeDays) start.setUTCDate(start.getUTCDate() - (rangeDays - 1));
    const days: { key: string; revenue: number; orders: number }[] = [];
    for (const d = start; dayKey(d.toISOString()) <= today; d.setUTCDate(d.getUTCDate() + 1)) {
      days.push({ key: dayKey(d.toISOString()), revenue: 0, orders: 0 });
    }
    const dayIndex = new Map(days.map((d, i) => [d.key, i]));
    for (const o of orders) {
      const i = dayIndex.get(dayKey(o.paidAt));
      if (i !== undefined) {
        days[i].revenue += o.amount;
        days[i].orders += 1;
      }
    }

    return {
      gross,
      net: gross - fees,
      fees,
      people,
      orderCount: orders.length,
      codedShare: gross ? codedRevenue / gross : 0,
      codedCount: coded.length,
      communities: sortRows(byCommunity),
      tiers: sortRows(byTier),
      days,
    };
  }, [orders, range]);

  // slot usage is always all-time (that's what the limits apply to)
  const poolSold = useMemo(() => {
    const sold = { general: 0, premium: 0, executive: 0 };
    for (const o of data?.orders ?? []) if (o.pool) sold[o.pool] += o.people;
    return sold;
  }, [data]);

  const signOut = () => {
    storeKey(null);
    setKey('');
    setData(null);
  };

  /* ----- sign-in ----- */
  if (!key || (!data && error && !loading)) {
    return (
      <div className="min-h-screen bg-[#0A1F2E] text-white font-sans flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!keyInput.trim()) return;
            storeKey(keyInput.trim());
            setKey(keyInput.trim());
          }}
          className="w-full max-w-sm rounded-2xl bg-[#10324B] border border-white/10 p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <img src="/images/p4i/logo.png" alt="Play4Impact" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-bold">Sales Dashboard</h1>
              <p className="text-xs text-slate-400">Play4Impact team only</p>
            </div>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-slate-300">Password</span>
            <input
              type="password"
              autoFocus
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="mt-1 w-full rounded-lg bg-[#0A1F2E] border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#83D318]"
            />
          </label>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#83D318] text-[#10324B] font-bold py-2.5 text-sm disabled:opacity-50 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" /> {loading ? 'Checking…' : 'Open dashboard'}
          </button>
        </form>
      </div>
    );
  }

  /* ----- dashboard ----- */
  const maxCommunityRevenue = Math.max(1, ...stats.communities.map((c) => c.revenue));

  return (
    <div className="min-h-screen bg-[#0A1F2E] text-white font-sans">
      <header className="border-b border-white/10 bg-[#005461]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/images/p4i/logo.png" alt="Play4Impact" className="h-9 w-auto" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Sales Dashboard</h1>
              <p className="text-xs text-slate-300">
                {data ? `Updated ${new Date(data.generatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}` : 'Loading…'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(key)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-50 cursor-pointer"
            >
              <Refresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={signOut} className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5 cursor-pointer">
              <SignOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 transition-opacity ${loading && data ? 'opacity-60' : ''}`}>
        {error && <p className="rounded-lg bg-rose-500/10 border border-rose-400/30 px-4 py-3 text-sm text-rose-200">{error}</p>}

        {/* Filters: one row, above everything they scope */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              aria-pressed={range === r.id}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold border cursor-pointer ${
                range === r.id ? 'bg-white text-[#10324B] border-white' : 'border-white/15 text-slate-200 hover:bg-white/5'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {!data ? (
          <p className="text-slate-400 text-sm">Loading sales…</p>
        ) : (
          <>
            {/* Headline numbers */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-2 lg:col-span-1 rounded-2xl bg-[#10324B] border border-white/10 p-6 lg:row-span-2 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-300">Total sales</p>
                  <p className="mt-2 text-5xl font-semibold text-white">{money(stats.gross)}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {money(stats.net)} after {money(stats.fees)} Paystack fees
                  </p>
                </div>
                <p className="mt-6 text-xs text-slate-400">{RANGES.find((r) => r.id === range)!.label}</p>
              </div>
              <StatTile label="Tickets sold" value={int(stats.people)} note="People admitted (group passes count each person)" />
              <StatTile label="Orders" value={int(stats.orderCount)} note={stats.orderCount ? `Avg ${money(Math.round(stats.gross / stats.orderCount))} per order` : undefined} />
              <StatTile
                label="From community codes"
                value={`${Math.round(stats.codedShare * 100)}%`}
                note={`${int(stats.codedCount)} of ${int(stats.orderCount)} orders used a code`}
              />
              <StatTile label="Communities driving sales" value={int(stats.communities.filter((c) => c.name !== NO_CODE).length)} />
            </div>

            {/* Slots */}
            <Card title="Ticket slots" subtitle="All-time · group passes use their parent tier's slots">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.keys(POOL_LABELS) as (keyof typeof POOL_LABELS)[]).map((p) => (
                  <SlotMeter key={p} label={POOL_LABELS[p]} sold={poolSold[p]} limit={data.limits[p]} />
                ))}
              </div>
            </Card>

            {/* Revenue over time */}
            <Card
              title="Sales per day"
              subtitle="GHS, after discounts"
              action={
                <button
                  onClick={() => setShowDailyTable((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white border border-white/15 rounded-lg px-2.5 py-1.5 cursor-pointer"
                >
                  {showDailyTable ? <ChartIcon className="w-3 h-3" /> : <TableIcon className="w-3 h-3" />}
                  {showDailyTable ? 'Show chart' : 'Show table'}
                </button>
              }
            >
              {stats.orderCount === 0 ? (
                <p className="text-sm text-slate-400 py-10 text-center">No sales in this period yet.</p>
              ) : showDailyTable ? (
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-slate-400 text-left">
                      <tr>
                        <th className="py-2 font-semibold">Date</th>
                        <th className="py-2 font-semibold text-right">Orders</th>
                        <th className="py-2 font-semibold text-right">Sales</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums">
                      {[...stats.days].reverse().map((d) => (
                        <tr key={d.key} className="border-t border-white/5">
                          <td className="py-1.5 text-slate-200">{dayLabel(d.key)}</td>
                          <td className="py-1.5 text-right text-slate-200">{d.orders}</td>
                          <td className="py-1.5 text-right text-white">{money(d.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <DailyRevenueChart days={stats.days} />
              )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Communities */}
              <div className="lg:col-span-3">
                <Card title="Sales by community" subtitle="Which discount codes are bringing in sales">
                  {stats.communities.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">No sales in this period yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-xs text-slate-400 text-left">
                          <tr>
                            <th className="py-2 font-semibold">Community</th>
                            <th className="py-2 font-semibold text-right">Orders</th>
                            <th className="py-2 font-semibold text-right">Tickets</th>
                            <th className="py-2 font-semibold text-right pr-4">Sales</th>
                            <th className="py-2 w-[28%]" aria-hidden="true"></th>
                          </tr>
                        </thead>
                        <tbody className="tabular-nums">
                          {stats.communities.map((c) => (
                            <tr key={c.name} className="border-t border-white/5 hover:bg-white/[0.03]">
                              <td className="py-2 pr-3 text-slate-100">{c.name}</td>
                              <td className="py-2 text-right text-slate-200">{c.orders}</td>
                              <td className="py-2 text-right text-slate-200">{c.people}</td>
                              <td className="py-2 text-right text-white font-semibold pr-4 whitespace-nowrap">{money(c.revenue)}</td>
                              <td className="py-2">
                                <div
                                  className="h-3 rounded-r-[4px]"
                                  style={{
                                    width: `${Math.max(2, (c.revenue / maxCommunityRevenue) * 100)}%`,
                                    backgroundColor: c.name === NO_CODE ? MUTED_MARK : ACCENT,
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>

              {/* Tiers */}
              <div className="lg:col-span-2">
                <Card title="Sales by pass">
                  {stats.tiers.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">No sales in this period yet.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="text-xs text-slate-400 text-left">
                        <tr>
                          <th className="py-2 font-semibold">Pass</th>
                          <th className="py-2 font-semibold text-right">Orders</th>
                          <th className="py-2 font-semibold text-right">Tickets</th>
                          <th className="py-2 font-semibold text-right">Sales</th>
                        </tr>
                      </thead>
                      <tbody className="tabular-nums">
                        {stats.tiers.map((t) => (
                          <tr key={t.name} className="border-t border-white/5">
                            <td className="py-2 pr-2 text-slate-100">{t.name}</td>
                            <td className="py-2 text-right text-slate-200">{t.orders}</td>
                            <td className="py-2 text-right text-slate-200">{t.people}</td>
                            <td className="py-2 text-right text-white font-semibold whitespace-nowrap">{money(t.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Card>
              </div>
            </div>

            {/* Orders */}
            <Card
              title="Orders"
              subtitle={`${int(orders.length)} in this period · newest first`}
              action={
                <button
                  onClick={() => downloadCsv(orders)}
                  disabled={!orders.length}
                  className="flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-[#83D318] text-[#10324B] px-3 py-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Download CSV
                </button>
              }
            >
              {orders.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">No orders in this period yet.</p>
              ) : (
                <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
                  <table className="w-full text-sm min-w-[760px]">
                    <thead className="text-xs text-slate-400 text-left sticky top-0 bg-[#10324B]">
                      <tr>
                        <th className="py-2 font-semibold">Date</th>
                        <th className="py-2 font-semibold">Reference</th>
                        <th className="py-2 font-semibold">Buyer</th>
                        <th className="py-2 font-semibold">Pass</th>
                        <th className="py-2 font-semibold text-right">Tickets</th>
                        <th className="py-2 pl-4 font-semibold">Code</th>
                        <th className="py-2 font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums">
                      {[...orders]
                        .sort((a, b) => b.paidAt.localeCompare(a.paidAt))
                        .map((o) => (
                          <tr key={o.reference} className="border-t border-white/5 align-top">
                            <td className="py-2 pr-3 text-slate-300 whitespace-nowrap">
                              {new Date(o.paidAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Accra' })}
                            </td>
                            <td className="py-2 pr-3 font-mono text-xs text-slate-200">{o.reference}</td>
                            <td className="py-2 pr-3">
                              <span className="text-slate-100 block">{o.name ?? '—'}</span>
                              <span className="text-xs text-slate-400">{o.email ?? ''}</span>
                            </td>
                            <td className="py-2 pr-3 text-slate-200">{o.tier}</td>
                            <td className="py-2 pr-3 text-right text-slate-200">{o.people}</td>
                            <td className="py-2 pl-4 pr-3 text-slate-300">{o.promoCode ?? '—'}</td>
                            <td className="py-2 text-right text-white font-semibold whitespace-nowrap">{money(o.amount)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default SalesDashboard;
