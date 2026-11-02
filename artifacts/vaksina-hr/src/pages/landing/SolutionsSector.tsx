import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SOLUTION_SECTORS } from './data';
import { RevealItem } from './Reveal';

/** Soha tabari: dorixona → zavod → yetkazish → savdo → klinika */
export function SolutionsSector() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const sector = SOLUTION_SECTORS[idx];

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % SOLUTION_SECTORS.length);
    }, 7000);
    return () => clearInterval(t);
  }, [reduce, idx]);

  return (
    <div className="landing-sector-wrap">
      <div className="landing-sector-tabs" role="tablist" aria-label="Soha yechimlari">
        {SOLUTION_SECTORS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={cn('landing-sector-tab', i === idx && 'landing-sector-tab--on')}
            onClick={() => setIdx(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="landing-sector-blurb">{sector.blurb}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={sector.id}
          className="landing-yechimlar-grid"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.32 }}
        >
          {sector.roles.map((role, i) => (
            <RevealItem key={`${sector.id}-${role.title}`} index={i}>
              <article className="landing-audience landing-audience--wide h-full">
                <h3 className="landing-audience-title">{role.title}</h3>
                <p className="landing-audience-text">{role.text}</p>
                <ul className="landing-audience-list">
                  {role.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
