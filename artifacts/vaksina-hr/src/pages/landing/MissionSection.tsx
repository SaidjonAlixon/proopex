import { ArrowRight, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MISSION } from './data';
import { Reveal, RevealItem } from './Reveal';

type Props = {
  onGo?: (id: string) => void;
};

export function MissionSection({ onGo }: Props) {
  return (
    <div className="landing-mission">
      {/* A. Hero pillars */}
      <Reveal>
        <header className="landing-mission-hero">
          <p className="landing-eyebrow">{MISSION.eyebrow}</p>
          <h2 className="landing-title landing-mission-hero-title">{MISSION.title}</h2>
          <p className="landing-lead landing-mission-hero-lead">{MISSION.lead}</p>
        </header>
      </Reveal>

      <div className="landing-mission-pillars">
        {MISSION.pillars.map((p, i) => (
          <RevealItem key={p.title} index={i}>
            <article className="landing-mission-card h-full">
              <span className="landing-mission-ico">
                <p.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="landing-mission-card-title">{p.title}</h3>
              <p className="landing-mission-card-text">{p.text}</p>
            </article>
          </RevealItem>
        ))}
      </div>

      {/* B. Compare */}
      <Reveal>
        <div className="landing-mission-block">
          <h3 className="landing-mission-h">{MISSION.compareTitle}</h3>
          <div className="landing-mission-compare">
            <article className="landing-mission-compare-card landing-mission-compare-card--old">
              <h4>{MISSION.traditional.title}</h4>
              <ul>
                {MISSION.traditional.items.map((t) => (
                  <li key={t}>
                    <X className="h-4 w-4 shrink-0 text-rose-500" aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="landing-mission-compare-card landing-mission-compare-card--new">
              <h4>{MISSION.modern.title}</h4>
              <ul>
                {MISSION.modern.items.map((t) => (
                  <li key={t}>
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </Reveal>

      {/* C. Modules */}
      <Reveal>
        <div className="landing-mission-block">
          <h3 className="landing-mission-h">{MISSION.modulesTitle}</h3>
          <div className="landing-mission-modules">
            {MISSION.modules.map((m, i) => (
              <RevealItem key={m.title} index={i}>
                <article className="landing-mission-mod h-full">
                  <span className="landing-mission-mod-ico">
                    <m.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h4>{m.title}</h4>
                  <p>{m.text}</p>
                </article>
              </RevealItem>
            ))}
          </div>
        </div>
      </Reveal>

      {/* D. Flow timeline */}
      <Reveal>
        <div className="landing-mission-block">
          <h3 className="landing-mission-h">{MISSION.flowTitle}</h3>
          <ol className="landing-mission-flow" aria-label="Ish oqimi">
            {MISSION.flow.map((step, i) => (
              <li key={step.title} className="landing-mission-flow-step">
                <span className="landing-mission-flow-n" aria-hidden>
                  <step.icon className="h-3.5 w-3.5" />
                </span>
                <strong>
                  <span className="sr-only">{i + 1}. </span>
                  {step.title}
                </strong>
                <em>{step.text}</em>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* E. Sectors */}
      <Reveal>
        <div className="landing-mission-block">
          <h3 className="landing-mission-h">{MISSION.sectorsTitle}</h3>
          <div className="landing-mission-sectors">
            {MISSION.sectors.map((s, i) => (
              <RevealItem key={s.title} index={i}>
                <article className="landing-mission-sector h-full">
                  <span className="landing-mission-mod-ico">
                    <s.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </article>
              </RevealItem>
            ))}
          </div>
        </div>
      </Reveal>

      {/* F. Audience */}
      <Reveal>
        <div className="landing-mission-block">
          <h3 className="landing-mission-h">{MISSION.audienceTitle}</h3>
          <div className="landing-mission-audience">
            {MISSION.audiences.map((a, i) => (
              <RevealItem key={a.title} index={i}>
                <article className="landing-mission-aud h-full">
                  <div className="landing-mission-aud-top">
                    <span className="landing-mission-ico">
                      <a.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h4>{a.title}</h4>
                  </div>
                  <ul>
                    {a.items.map((t) => (
                      <li key={t}>
                        <Check className="h-3.5 w-3.5 shrink-0 text-sky-500" aria-hidden />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            ))}
          </div>
        </div>
      </Reveal>

      {/* G. Future / AI */}
      <Reveal>
        <div className="landing-mission-block">
          <h3 className="landing-mission-h">{MISSION.futureTitle}</h3>
          <div className="landing-mission-future">
            <div className="landing-mission-future-col">
              <p className="landing-mission-future-label">Ishlayotgan</p>
              <ul>
                {MISSION.futureReady.map((f) => (
                  <li key={f.title}>
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="landing-mission-future-col landing-mission-future-col--build">
              <p className="landing-mission-future-label">Rivojlantirilmoqda</p>
              <ul>
                {MISSION.futureBuilding.map((f) => (
                  <li key={f.title}>
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      {/* H. Closing */}
      <Reveal>
        <div className="landing-mission-close">
          <h3 className="landing-mission-close-title">{MISSION.closingTitle}</h3>
          <p className="landing-mission-close-text">{MISSION.closingText}</p>
          <p className="landing-mission-close-line">{MISSION.closingLine}</p>
          {onGo ? (
            <div className="landing-mission-ctas">
              <button type="button" className="landing-cta landing-mission-cta" onClick={() => onGo('imkoniyatlar')}>
                Imkoniyatlar
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                type="button"
                className={cn('landing-btn-outline landing-mission-cta-ghost')}
                onClick={() => onGo('tariflar')}
              >
                Tariflar
              </button>
            </div>
          ) : null}
        </div>
      </Reveal>
    </div>
  );
}
