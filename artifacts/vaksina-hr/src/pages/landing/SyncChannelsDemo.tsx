import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Database, Globe2, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

type EventId = 'davomat' | 'vazifa' | 'chat' | 'kpi';

const EVENTS: {
  id: EventId;
  web: string;
  tg: string;
  db: string;
  ms: number;
}[] = [
  {
    id: 'davomat',
    web: 'Brauzer: Face ID · kelish 09:02',
    tg: 'Mini App: davomat yangilandi',
    db: 'davomat_log · yozildi',
    ms: 3200,
  },
  {
    id: 'vazifa',
    web: 'Brauzer: vazifa «Bajarildi»',
    tg: 'Mini App: eslatma keldi',
    db: 'tasks · status=done',
    ms: 3000,
  },
  {
    id: 'chat',
    web: 'Brauzer: chat xabari',
    tg: 'Telegram: xabar ochildi',
    db: 'messages · sync',
    ms: 3000,
  },
  {
    id: 'kpi',
    web: 'Brauzer: KPI hisoblandi',
    tg: 'Mini App: oylik ko‘rinadi',
    db: 'kpi_month · bitta manba',
    ms: 3200,
  },
];

/** Web + Telegram Mini App — bir vaqtda, bitta baza */
export function SyncChannelsDemo() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [pulse, setPulse] = useState(0);
  const ev = EVENTS[idx % EVENTS.length];

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => {
      setIdx((i) => (i + 1) % EVENTS.length);
      setPulse((p) => p + 1);
    }, ev.ms);
    return () => clearTimeout(t);
  }, [reduce, idx, ev.ms]);

  return (
    <div className="landing-sync" aria-label="Web va Telegram bir bazadan">
      <div className="landing-sync-head">
        <p className="landing-sync-eyebrow">Bitta baza · ikki kanal</p>
        <h3 className="landing-sync-title">Brauzer va Telegram — bir vaqtda</h3>
        <p className="landing-sync-lead">
          Web (PWA) va Telegram Mini App parallel ishlaydi. Har ikkisi bir xil PROOPEX
          bazasiga yozadi va o‘qiydi — ma’lumot darhol ikkala joyda ko‘rinadi.
        </p>
      </div>

      <div className="landing-sync-stage">
        {/* Web */}
        <div className={cn('landing-sync-card landing-sync-card--web')}>
          <div className="landing-sync-card-bar">
            <Globe2 className="h-3.5 w-3.5" />
            <span>Web · brauzer / PWA</span>
          </div>
          <div className="landing-sync-card-body">
            <div className="landing-sync-fake-ui">
              <span className="landing-sync-dot" />
              <span className="landing-sync-dot" />
              <span className="landing-sync-line" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`web-${ev.id}-${pulse}`}
                className="landing-sync-event landing-sync-event--web"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{ev.web}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Markaz: baza + oqimlar */}
        <div className="landing-sync-center">
          <div className="landing-sync-rails" aria-hidden>
            <span className="landing-sync-rail landing-sync-rail--l" />
            <span className="landing-sync-rail landing-sync-rail--r" />
            {!reduce ? (
              <>
                <motion.span
                  key={`p-l-${pulse}`}
                  className="landing-sync-packet landing-sync-packet--l"
                  initial={{ left: '12%', opacity: 0 }}
                  animate={{ left: ['12%', '46%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                />
                <motion.span
                  key={`p-r-${pulse}`}
                  className="landing-sync-packet landing-sync-packet--r"
                  initial={{ right: '12%', opacity: 0 }}
                  animate={{ right: ['12%', '46%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.15 }}
                />
                <motion.span
                  key={`p-l2-${pulse}`}
                  className="landing-sync-packet landing-sync-packet--l2"
                  initial={{ left: '46%', opacity: 0 }}
                  animate={{ left: ['46%', '12%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.35, ease: 'easeInOut', delay: 1.5 }}
                />
                <motion.span
                  key={`p-r2-${pulse}`}
                  className="landing-sync-packet landing-sync-packet--r2"
                  initial={{ right: '46%', opacity: 0 }}
                  animate={{ right: ['46%', '12%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.35, ease: 'easeInOut', delay: 1.65 }}
                />
              </>
            ) : null}
          </div>

          <motion.div
            key={`db-${pulse}`}
            className="landing-sync-db"
            animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>
        </div>

        {/* Telegram */}
        <div className={cn('landing-sync-card landing-sync-card--tg')}>
          <div className="landing-sync-card-bar">
            <Send className="h-3.5 w-3.5" />
            <span>Telegram Mini App</span>
          </div>
          <div className="landing-sync-card-body">
            <div className="landing-sync-fake-ui landing-sync-fake-ui--tg">
              <span className="landing-sync-tg-bubble" />
              <span className="landing-sync-tg-bubble landing-sync-tg-bubble--short" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`tg-${ev.id}-${pulse}`}
                className="landing-sync-event landing-sync-event--tg"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{ev.tg}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="landing-sync-foot" aria-hidden>
        <span className={cn(ev.id === 'davomat' && 'on')}>Davomat</span>
        <span className={cn(ev.id === 'vazifa' && 'on')}>Vazifa</span>
        <span className={cn(ev.id === 'chat' && 'on')}>Chat</span>
        <span className={cn(ev.id === 'kpi' && 'on')}>KPI</span>
      </div>
    </div>
  );
}
