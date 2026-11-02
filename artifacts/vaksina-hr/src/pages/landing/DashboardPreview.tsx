import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  Download,
  RefreshCw,
  ScanFace,
  Store,
  Target,
  Users,
  Wallet,
} from 'lucide-react';
import { cn } from '../../lib/utils';

type ViewId = 'davomat' | 'kpi' | 'table';

type Org = { name: string; staff: string; pct: number; tone: 'ok' | 'good' | 'mid' };
type Kpi = { label: string; value: string; sub: string; tone: string };
type Insight = { label: string; value: string };

type DashView = {
  id: ViewId;
  title: string;
  meta: string;
  orgs: Org[];
  kpis: Kpi[];
  insights: Insight[];
  stack: { ok: number; late: number; miss: number; labels: [string, string, string] };
  donut: { pct: string; sub: string };
};

type TableRow = {
  n: number;
  name: string;
  role: string;
  status: string;
  statusTone: 'ok' | 'late' | 'miss' | 'warn' | 'excused';
  shift: string;
  inAt: string;
  outAt: string;
  worked: string;
  lateMin: string;
  earlyMin: string;
  kpi: string;
};

const LIVE_CHECKINS = [
  { name: 'Aziza Yusupova', time: '08:41', status: 'ok' as const },
  { name: 'Jasur Bekmurodov', time: '08:52', status: 'ok' as const },
  { name: 'Nilufar Olimova', time: '09:07', status: 'late' as const },
  { name: 'Sardor Tursunov', time: '08:38', status: 'ok' as const },
  { name: 'Madina Rahimova', time: '09:14', status: 'late' as const },
  { name: 'Dilshod Aliyev', time: '08:45', status: 'ok' as const },
];

/** Jadvaldagi daqiqani aniq yozish: 8′ → «8 daqiqa» */
function minLabel(v: string) {
  if (!v || v === '—') return '—';
  const n = v.replace(/[′'ʹʼ]/g, '').trim();
  if (!n) return '—';
  return `${n} daqiqa`;
}

/** 3-sahifa: ixcham jadval — asosiy ustunlar */
const TABLE_ROWS: TableRow[] = [
  {
    n: 1,
    name: 'Ismoilova Sevara',
    role: 'HR',
    status: 'Vaqtida',
    statusTone: 'ok',
    shift: '09–18',
    inAt: '08:52',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '8′',
    kpi: '96%',
  },
  {
    n: 2,
    name: 'Qodirov Bekzod',
    role: 'Moliya',
    status: 'Kechikdi',
    statusTone: 'late',
    shift: '09–18',
    inAt: '09:11',
    outAt: '—',
    worked: '',
    lateMin: '11′',
    earlyMin: '—',
    kpi: '88%',
  },
  {
    n: 3,
    name: 'Xolmatova Dilnoza',
    role: 'Mudir yord.',
    status: 'Ketish yo‘q',
    statusTone: 'warn',
    shift: '09–18',
    inAt: '08:47',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '13′',
    kpi: '94%',
  },
  {
    n: 4,
    name: 'Rustamov Javlon',
    role: 'Ombor',
    status: 'Kelmagan',
    statusTone: 'miss',
    shift: '09–18',
    inAt: '—',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '—',
    kpi: '71%',
  },
  {
    n: 5,
    name: 'Abdullayeva Malika',
    role: 'Sotuv',
    status: 'Vaqtida',
    statusTone: 'ok',
    shift: '09–18',
    inAt: '08:55',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '5′',
    kpi: '97%',
  },
  {
    n: 6,
    name: 'Ergashev Temur',
    role: 'IT',
    status: 'Vaqtida',
    statusTone: 'ok',
    shift: '09–18',
    inAt: '08:41',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '19′',
    kpi: '98%',
  },
  {
    n: 7,
    name: 'Karimova Nilufar',
    role: 'Marketing',
    status: 'Vaqtida',
    statusTone: 'ok',
    shift: '09–18',
    inAt: '08:48',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '12′',
    kpi: '95%',
  },
  {
    n: 8,
    name: 'Toshmatov Sardor',
    role: 'Logistika',
    status: 'Kechikdi',
    statusTone: 'late',
    shift: '09–18',
    inAt: '09:22',
    outAt: '—',
    worked: '',
    lateMin: '22′',
    earlyMin: '—',
    kpi: '82%',
  },
  {
    n: 9,
    name: 'Yusupova Aziza',
    role: 'HR',
    status: 'Ketish yo‘q',
    statusTone: 'warn',
    shift: '09–18',
    inAt: '08:39',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '21′',
    kpi: '99%',
  },
  {
    n: 10,
    name: 'Aliyev Dilshod',
    role: 'Sotuv',
    status: 'Vaqtida',
    statusTone: 'ok',
    shift: '09–18',
    inAt: '08:50',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '10′',
    kpi: '93%',
  },
  {
    n: 11,
    name: 'Rahimova Madina',
    role: 'Moliya',
    status: 'Kechikdi',
    statusTone: 'late',
    shift: '09–18',
    inAt: '09:08',
    outAt: '—',
    worked: '',
    lateMin: '8′',
    earlyMin: '—',
    kpi: '86%',
  },
  {
    n: 12,
    name: 'Bekmurodov Jasur',
    role: 'Ombor',
    status: 'Kelmagan',
    statusTone: 'miss',
    shift: '09–18',
    inAt: '—',
    outAt: '—',
    worked: '',
    lateMin: '—',
    earlyMin: '—',
    kpi: '68%',
  },
];

const TABLE_CHIPS = [
  { label: 'Jami', value: '86', tone: 'neutral' },
  { label: 'Ketish yo‘q', value: '54', tone: 'sky' },
  { label: 'Kech keldi', value: '19', tone: 'rose' },
  { label: 'Erta keldi', value: '28', tone: 'green' },
  { label: 'Erta ketdi', value: '3', tone: 'amber' },
  { label: 'Kech ketdi', value: '0', tone: 'violet' },
];

const CHART_VIEWS: DashView[] = [
  {
    id: 'davomat',
    title: 'Davomat tahlili',
    meta: '26-okt 2026 · 17:42 · Demo Admin',
    orgs: [
      { name: 'Bosh ofis', staff: '86 xodim', pct: 92.4, tone: 'ok' },
      { name: 'Filiallar', staff: '198 xodim', pct: 88.6, tone: 'good' },
      { name: 'Umumiy', staff: '284 xodim', pct: 90.1, tone: 'mid' },
    ],
    kpis: [
      { label: 'Davomat darajasi', value: '90.1%', sub: 'Maqsad 95%', tone: 'mid' },
      { label: 'Jami xodim', value: '284', sub: '+18 · oy', tone: 'ok' },
      { label: 'Bugun kelganlar', value: '256', sub: '228 vaqtida · 28 kech', tone: 'ok' },
      { label: 'Kechikkanlar', value: '28', sub: '9.9%', tone: 'warn' },
      { label: 'Kelmaganlar', value: '28', sub: '9.9%', tone: 'bad' },
    ],
    insights: [
      { label: 'O‘rtacha kelish', value: '08:49' },
      { label: 'Eng yaxshi bo‘lim', value: 'Marketing · 97%' },
      { label: 'E’tibor kerak', value: 'Logistika · 74%' },
      { label: 'Ko‘p kechikkan', value: 'Olimova N.' },
    ],
    stack: {
      ok: 228,
      late: 28,
      miss: 28,
      labels: ['Vaqtida 228', 'Kech 28', 'Kelmagan 28'],
    },
    donut: { pct: '90.1%', sub: '256 / 284' },
  },
  {
    id: 'kpi',
    title: 'KPI panel',
    meta: 'Oylik · Demo Admin · avtomatik hisob',
    orgs: [
      { name: 'Davomat ulushi', staff: '35%', pct: 94, tone: 'ok' },
      { name: 'Topshiriq ulushi', staff: '30%', pct: 89, tone: 'good' },
      { name: 'Checklist ulushi', staff: '35%', pct: 87, tone: 'mid' },
    ],
    kpis: [
      { label: 'Oylik KPI', value: '92.8%', sub: 'Maqsad 90%', tone: 'ok' },
      { label: 'Bajarilgan vazifa', value: '164', sub: '9 ochiq', tone: 'ok' },
      { label: 'Checklist ball', value: '4.7', sub: '5 dan', tone: 'ok' },
      { label: 'Kechikish ta’siri', value: '−1.4%', sub: 'KPI dan', tone: 'warn' },
      { label: 'Bonus / jarima', value: '+5.2%', sub: 'oylikka', tone: 'ok' },
    ],
    insights: [
      { label: 'Eng yuqori KPI', value: 'Yusupova A. · 99%' },
      { label: 'Bo‘lim yetakchi', value: 'Marketing' },
      { label: 'Og‘irliklar', value: '35 / 30 / 35' },
      { label: 'Hisobot', value: 'Excel tayyor' },
    ],
    stack: {
      ok: 164,
      late: 9,
      miss: 5,
      labels: ['Bajarilgan 164', 'Jarayonda 9', 'Kechikkan 5'],
    },
    donut: { pct: '92.8%', sub: 'oylik KPI' },
  },
];

const TABS: { id: ViewId; label: string }[] = [
  { id: 'davomat', label: 'Davomat' },
  { id: 'kpi', label: 'KPI' },
  { id: 'table', label: 'Tablitsa' },
];

function OrgIcon({ name, view }: { name: string; view: ViewId }) {
  if (view === 'kpi') {
    if (name.includes('Topshiriq')) return <Target className="h-3.5 w-3.5" />;
    if (name.includes('Checklist')) return <Wallet className="h-3.5 w-3.5" />;
    return <Users className="h-3.5 w-3.5" />;
  }
  if (name === 'Umumiy' || name === 'Jami') return <Users className="h-3.5 w-3.5" />;
  if (name.includes('Filial')) return <Store className="h-3.5 w-3.5" />;
  return <Building2 className="h-3.5 w-3.5" />;
}

function TableView() {
  return (
    <div className="landing-da-table-wrap">
      <div className="landing-da-table-head">
        <div>
          <h3 className="landing-da-title">Kunlik davomat</h3>
          <p className="landing-da-meta">2026-10-26 · Ofis · Demo</p>
        </div>
        <div className="landing-da-actions">
          <button type="button" className="landing-da-btn" tabIndex={-1}>
            <RefreshCw className="h-3.5 w-3.5" />
            Yangilash
          </button>
          <button type="button" className="landing-da-btn landing-da-btn--pdf" tabIndex={-1}>
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
        </div>
      </div>

      <div className="landing-da-chips">
        {TABLE_CHIPS.map((c) => (
          <span key={c.label} className={cn('landing-da-chip', `landing-da-chip--${c.tone}`)}>
            <em>{c.label}</em> <strong>{c.value}</strong>
          </span>
        ))}
      </div>

      <div className="landing-da-scroll">
        <table className="landing-da-table">
          <thead>
            <tr>
              <th>№</th>
              <th>F.I.SH.</th>
              <th>Lavozim</th>
              <th>Holat</th>
              <th>Kelish</th>
              <th>Kech / erta</th>
              <th>KPI</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map((r) => (
              <tr key={r.n}>
                <td>{r.n}</td>
                <td className="landing-da-td-name">{r.name}</td>
                <td>{r.role}</td>
                <td>
                  <span className={cn('landing-da-st', `landing-da-st--${r.statusTone}`)}>
                    {r.status}
                  </span>
                </td>
                <td>{r.inAt}</td>
                <td>
                  {r.lateMin !== '—' ? (
                    <span className="landing-da-td-late">{minLabel(r.lateMin)}</span>
                  ) : r.earlyMin !== '—' ? (
                    <span className="landing-da-td-early">{minLabel(r.earlyMin)}</span>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <strong className="landing-da-td-kpi">{r.kpi}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Hero: Davomat · KPI · Tablitsa (3) */
export function DashboardPreview() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<ViewId>('davomat');
  const [liveI, setLiveI] = useState(0);
  const [barsOn, setBarsOn] = useState(false);

  const chartView = CHART_VIEWS.find((v) => v.id === tab) ?? CHART_VIEWS[0];
  const live = LIVE_CHECKINS[liveI % LIVE_CHECKINS.length];
  const isTable = tab === 'table';
  const view = isTable ? null : chartView;

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => {
      setTab((cur) => {
        if (cur === 'davomat') return 'kpi';
        if (cur === 'kpi') return 'table';
        return 'davomat';
      });
    }, 8000);
    return () => clearInterval(t);
  }, [reduce]);

  useEffect(() => {
    if (isTable) return;
    setBarsOn(false);
    const id = window.setTimeout(() => setBarsOn(true), 80);
    return () => clearTimeout(id);
  }, [tab, isTable]);

  useEffect(() => {
    if (reduce || tab !== 'davomat') return;
    const t = window.setInterval(() => setLiveI((i) => i + 1), 2200);
    return () => clearInterval(t);
  }, [reduce, tab]);

  return (
    <div className="landing-dash landing-dash--analytics">
      <motion.div
        className={cn('landing-dash-card landing-dash-card--wide', isTable && 'landing-dash-card--table')}
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <div className="landing-da-tabs" role="tablist" aria-label="Dashboard ko‘rinishi">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={cn('landing-da-tab', tab === t.id && 'landing-da-tab--on')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isTable ? (
          <TableView />
        ) : view ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={view.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="landing-da-head">
                <div>
                  <h3 className="landing-da-title">{view.title}</h3>
                  <p className="landing-da-meta">{view.meta}</p>
                </div>
                <div className="landing-da-actions">
                  <span className="landing-da-pill landing-da-pill--on">
                    {view.id === 'davomat' ? 'Bugun' : 'Oy'}
                  </span>
                  <span className="landing-da-pill">{view.id === 'davomat' ? '7 kun' : 'Bo‘lim'}</span>
                  <button type="button" className="landing-da-btn" tabIndex={-1}>
                    <RefreshCw className={cn('h-3.5 w-3.5', !reduce && 'landing-da-spin')} />
                    Yangilash
                  </button>
                  <button type="button" className="landing-da-btn landing-da-btn--pdf" tabIndex={-1}>
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </button>
                </div>
              </div>

              <div className="landing-da-orgs">
                {view.orgs.map((o, oi) => (
                  <motion.div
                    key={o.name}
                    className="landing-da-org"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: oi * 0.08, duration: 0.35 }}
                  >
                    <div className="landing-da-org-top">
                      <OrgIcon name={o.name} view={view.id} />
                      <span>{o.name}</span>
                    </div>
                    <strong>{o.staff}</strong>
                    <div className="landing-da-org-track">
                      <motion.div
                        className={cn('landing-da-org-fill', `landing-da-org-fill--${o.tone}`)}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: barsOn || reduce ? o.pct / 100 : 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: oi * 0.1 }}
                      />
                    </div>
                    <em>{o.pct}%</em>
                  </motion.div>
                ))}
              </div>

              <div className="landing-da-kpis">
                {view.kpis.map((k, ki) => (
                  <motion.div
                    key={k.label}
                    className={cn('landing-da-kpi', `landing-da-kpi--${k.tone}`)}
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + ki * 0.05 }}
                  >
                    <span>{k.label}</span>
                    <strong>{k.value}</strong>
                    <em>{k.sub}</em>
                  </motion.div>
                ))}
              </div>

              <div className="landing-da-insights">
                {view.insights.map((x) => (
                  <div key={x.label} className="landing-da-insight">
                    <span>{x.label}</span>
                    <strong>{x.value}</strong>
                  </div>
                ))}
              </div>

              {view.id === 'davomat' ? (
                <div className="landing-da-live">
                  <div className="landing-da-live-head">
                    <ScanFace className="h-3.5 w-3.5" />
                    <span>Kunlik davomat · jonli</span>
                    <i className="landing-da-live-dot" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={live.name + live.time}
                      className={cn(
                        'landing-da-live-row',
                        live.status === 'late' && 'landing-da-live-row--late',
                      )}
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduce ? undefined : { opacity: 0, x: -12 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="landing-da-live-avatar">{live.name.slice(0, 1)}</div>
                      <div className="landing-da-live-info">
                        <strong>{live.name}</strong>
                        <span>Face ID · {live.time}</span>
                      </div>
                      <em>{live.status === 'ok' ? 'Vaqtida' : 'Kech'}</em>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : null}

              <div className="landing-da-charts">
                <div className="landing-da-chart-box">
                  <div className="landing-da-chart-label">
                    {view.id === 'davomat' ? 'Kunlik taqsimot' : 'Vazifa holati'}
                  </div>
                  <div className="landing-da-stack" aria-hidden>
                    {(() => {
                      const tot = view.stack.ok + view.stack.late + view.stack.miss || 1;
                      return (
                        <>
                          <motion.span
                            className="landing-da-stack--ok"
                            initial={{ width: 0 }}
                            animate={{ width: `${(view.stack.ok / tot) * 100}%` }}
                            transition={{ duration: 0.85, ease: 'easeOut' }}
                          />
                          <motion.span
                            className="landing-da-stack--late"
                            initial={{ width: 0 }}
                            animate={{ width: `${(view.stack.late / tot) * 100}%` }}
                            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.08 }}
                          />
                          <motion.span
                            className="landing-da-stack--miss"
                            initial={{ width: 0 }}
                            animate={{ width: `${(view.stack.miss / tot) * 100}%` }}
                            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.14 }}
                          />
                        </>
                      );
                    })()}
                  </div>
                  <div className="landing-da-legend">
                    <span><i className="ok" /> {view.stack.labels[0]}</span>
                    <span><i className="late" /> {view.stack.labels[1]}</span>
                    <span><i className="miss" /> {view.stack.labels[2]}</span>
                  </div>
                </div>
                <div className="landing-da-chart-box landing-da-donut-wrap">
                  <div className="landing-da-chart-label">
                    {view.id === 'davomat' ? 'Davomat ulushi' : 'KPI ulushi'}
                  </div>
                  <div className="landing-da-donut" aria-hidden>
                    <svg viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="5" />
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={view.id === 'davomat' ? '70 30' : '74 26'}
                        strokeDashoffset="25"
                        initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                        style={{ rotate: '-90deg', transformOrigin: '18px 18px' }}
                      />
                    </svg>
                    <div className="landing-da-donut-center">
                      <strong>{view.donut.pct}</strong>
                      <span>{view.donut.sub}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : null}
      </motion.div>
    </div>
  );
}
