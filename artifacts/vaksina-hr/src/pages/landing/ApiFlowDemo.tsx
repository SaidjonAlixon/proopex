import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Database, Download, Plug, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

type Mode = 'in' | 'out';

const IN_EVENTS = [
  { src: 'HR dasturi', tip: 'POST /api/import/employees', db: 'employees · yozildi' },
  { src: 'Excel / CSV', tip: 'POST /api/import/attendance', db: 'davomat · sync' },
  { src: 'CRM', tip: 'POST /api/import/candidates', db: 'candidates · yangilandi' },
];

const OUT_EVENTS = [
  { dst: 'Moliya dasturi', tip: 'GET /api/kpi/monthly', db: 'kpi_month · o‘qildi' },
  { dst: 'Korporativ sayt', tip: 'GET /api/staff/status', db: 'users · eksport' },
  { dst: 'Boshqa platforma', tip: 'GET /api/tasks/export', db: 'tasks · API' },
];

/** Hujjat sahifasi: baza ← import / baza → API */
export function ApiFlowDemo() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>('in');
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => {
      setI((v) => {
        const list = mode === 'in' ? IN_EVENTS : OUT_EVENTS;
        const next = (v + 1) % list.length;
        if (next === 0) setMode((m) => (m === 'in' ? 'out' : 'in'));
        return next;
      });
    }, 3200);
    return () => clearInterval(t);
  }, [reduce, mode]);

  const inbound = mode === 'in';
  const ev = inbound ? IN_EVENTS[i % IN_EVENTS.length] : OUT_EVENTS[i % OUT_EVENTS.length];

  return (
    <div className="api-flow" aria-label="API ma’lumot oqimi">
      <div className="api-flow-tabs">
        <button
          type="button"
          className={cn('api-flow-tab', inbound && 'api-flow-tab--on')}
          onClick={() => {
            setMode('in');
            setI(0);
          }}
        >
          <Download className="h-3.5 w-3.5" />
          Ma’lumot olish
        </button>
        <button
          type="button"
          className={cn('api-flow-tab', !inbound && 'api-flow-tab--on')}
          onClick={() => {
            setMode('out');
            setI(0);
          }}
        >
          <Upload className="h-3.5 w-3.5" />
          API berish
        </button>
      </div>

      <div className={cn('api-flow-stage', !inbound && 'api-flow-stage--out')}>
        {/* Chap */}
        <div className="api-flow-node">
          <Plug className="h-4 w-4" />
          <strong>{inbound ? ('src' in ev ? ev.src : '') : 'PROOPEX baza'}</strong>
          <span>{inbound ? 'Tashqi dastur' : 'Ichki manba'}</span>
        </div>

        {/* O‘rta — oqim */}
        <div className="api-flow-mid">
          <div className="api-flow-rail" aria-hidden>
            {!reduce ? (
              <motion.span
                key={`${mode}-${i}`}
                className="api-flow-packet"
                initial={inbound ? { left: '8%', opacity: 0 } : { left: '78%', opacity: 0 }}
                animate={
                  inbound
                    ? { left: ['8%', '78%'], opacity: [0, 1, 1, 0] }
                    : { left: ['78%', '8%'], opacity: [0, 1, 1, 0] }
                }
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
            ) : null}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-tip-${i}`}
              className="api-flow-tip"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <code>{ev.tip}</code>
            </motion.div>
          </AnimatePresence>
          <div className="api-flow-db">
            <Database className="h-5 w-5" />
            <div>
              <strong>Bitta baza</strong>
              <AnimatePresence mode="wait">
                <motion.span
                  key={ev.db}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {ev.db}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* O‘ng */}
        <div className="api-flow-node api-flow-node--end">
          <Database className="h-4 w-4" />
          <strong>{inbound ? 'PROOPEX baza' : 'dst' in ev ? ev.dst : ''}</strong>
          <span>{inbound ? 'Ichki saqlash' : 'Tashqi dastur / sayt'}</span>
        </div>
      </div>

      <p className="api-flow-caption">
        {inbound
          ? 'Boshqa joydan kelgan ma’lumot PROOPEX bazasiga yoziladi — keyin o‘zingiz mustaqil ishlaysiz.'
          : 'Boshqa platforma PROOPEX API orqali bazadan kerakli ma’lumotni oladi — ruxsat va qoidalar bilan.'}
      </p>
    </div>
  );
}
