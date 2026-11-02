import { useEffect, useState } from 'react';
import { ArrowRight, Check, Quote, Sparkles, X, ZoomIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ABOUT } from './data';
import { Reveal, RevealItem } from './Reveal';

type Props = {
  onGo?: (id: string) => void;
};

type Lightbox = { src: string; alt: string } | null;

export function AboutSection({ onGo }: Props) {
  const base = import.meta.env.BASE_URL || '/';
  const f = ABOUT.founder;
  const [lightbox, setLightbox] = useState<Lightbox>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [lightbox]);

  const openPhoto = (src: string, alt: string) => setLightbox({ src, alt });

  return (
    <div className="landing-about">
      <Reveal>
        <header className="landing-about-hero">
          <p className="landing-eyebrow">{ABOUT.eyebrow}</p>
          <h2 className="landing-title landing-about-title">{ABOUT.title}</h2>
          <p className="landing-lead landing-about-lead">{ABOUT.lead}</p>
        </header>
      </Reveal>

      <Reveal>
        <div className="landing-about-story">
          <h3 className="landing-about-h">{ABOUT.storyTitle}</h3>
          <p className="landing-about-story-text">{ABOUT.story}</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="landing-about-block">
          <h3 className="landing-about-h">{ABOUT.valuesTitle}</h3>
          <div className="landing-about-values">
            {ABOUT.values.map((v, i) => (
              <RevealItem key={v.title} index={i}>
                <article className="landing-about-card h-full">
                  <span className="landing-about-ico">
                    <v.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h4>{v.title}</h4>
                  <p>{v.text}</p>
                </article>
              </RevealItem>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="landing-about-block">
          <h3 className="landing-about-h">{ABOUT.approachTitle}</h3>
          <ol className="landing-about-steps">
            {ABOUT.approach.map((step, i) => (
              <li key={step.title} className="landing-about-step">
                <span className="landing-about-step-n" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Asoschi */}
      <Reveal>
        <section className="landing-founder" aria-labelledby="founder-name">
          <div className="landing-founder-grid">
            <figure className="landing-founder-photo">
              <button
                type="button"
                className="landing-founder-photo-btn"
                onClick={() => openPhoto(`${base}${f.photo}`, f.name)}
                aria-label={`${f.name} rasmini kattalashtirish`}
              >
                <img
                  src={`${base}${f.photo}`}
                  alt={f.name}
                  width={720}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
                <span className="landing-founder-zoom" aria-hidden>
                  <ZoomIn className="h-4 w-4" />
                </span>
              </button>
              <figcaption className="landing-founder-caption">
                <span className="landing-founder-caption-brand">{f.company}</span>
                <strong>{f.name}</strong>
              </figcaption>
            </figure>

            <div className="landing-founder-copy">
              <p className="landing-eyebrow">CEO · Asoschi</p>
              <h2 id="founder-name" className="landing-founder-name">
                {f.name}
              </h2>
              <p className="landing-founder-role">{f.role}</p>

              <blockquote className="landing-founder-quote">
                <Quote className="landing-founder-quote-ico" aria-hidden />
                <p>{f.quote}</p>
              </blockquote>

              <div className="landing-founder-body">
                {f.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="landing-founder-approach">
            <h3 className="landing-about-h">{f.approachTitle}</h3>
            <div className="landing-founder-approach-grid">
              {f.approach.map((item, i) => (
                <RevealItem key={item.title} index={i}>
                  <article className="landing-founder-approach-card h-full">
                    <span className="landing-founder-approach-n" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </article>
                </RevealItem>
              ))}
            </div>
          </div>

          <div className="landing-founder-vision">
            <h3 className="landing-founder-vision-title">{f.visionTitle}</h3>
            <p className="landing-founder-vision-text">{f.vision}</p>
            <p className="landing-founder-goal">{f.goal}</p>
          </div>
        </section>
      </Reveal>

      {/* Qo‘shimcha platforma dasturchilari */}
      <Reveal>
        <section className="landing-team" aria-labelledby="team-heading">
          <h3 id="team-heading" className="landing-about-h">
            {ABOUT.teamTitle}
          </h3>
          <p className="landing-team-lead">
            PROOPEX ni birgalikda rivojlantirayotgan qo‘shimcha platforma dasturchilari.
          </p>
          {ABOUT.team.map((member) => (
            <article key={member.id} className="landing-founder landing-founder--member">
              <div className="landing-founder-grid">
                <figure className="landing-founder-photo">
                  <button
                    type="button"
                    className="landing-founder-photo-btn"
                    onClick={() => openPhoto(`${base}${member.photo}`, member.name)}
                    aria-label={`${member.name} rasmini kattalashtirish`}
                  >
                    <img
                      src={`${base}${member.photo}`}
                      alt={member.name}
                      width={720}
                      height={900}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="landing-founder-zoom" aria-hidden>
                      <ZoomIn className="h-4 w-4" />
                    </span>
                  </button>
                  <figcaption className="landing-founder-caption">
                    <span className="landing-founder-caption-brand">PROOPEX</span>
                    <strong>{member.name}</strong>
                    <em>{member.role}</em>
                  </figcaption>
                </figure>

                <div className="landing-founder-copy">
                  <span className="landing-team-badge landing-team-badge--inline">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    {member.badge}
                  </span>
                  <h2 className="landing-founder-name">{member.name}</h2>
                  <p className="landing-founder-role">{member.role}</p>

                  <blockquote className="landing-founder-quote">
                    <Quote className="landing-founder-quote-ico" aria-hidden />
                    <p>{member.quote}</p>
                  </blockquote>

                  <div className="landing-founder-body">
                    {member.paragraphs.map((p) => (
                      <p key={p.slice(0, 48)}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="landing-founder-approach">
                <h3 className="landing-about-h">{member.approachTitle}</h3>
                <div className="landing-founder-approach-grid">
                  {member.approach.map((item, i) => (
                    <RevealItem key={item.title} index={i}>
                      <article className="landing-founder-approach-card h-full">
                        <span className="landing-founder-approach-n" aria-hidden>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                      </article>
                    </RevealItem>
                  ))}
                </div>
              </div>

              <div className="landing-team-duties-block">
                <h3 className="landing-about-h">{member.dutiesTitle}</h3>
                <ul className="landing-team-duties-grid">
                  {member.duties.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="landing-founder-vision">
                <h3 className="landing-founder-vision-title">{member.visionTitle}</h3>
                <p className="landing-founder-vision-text">{member.vision}</p>
                <p className="landing-founder-goal">{member.goal}</p>
              </div>
            </article>
          ))}
        </section>
      </Reveal>

      <Reveal>
        <div className="landing-about-close">
          <h3 className="landing-about-close-title">{ABOUT.closingTitle}</h3>
          <p className="landing-about-close-text">{ABOUT.closingText}</p>
          {onGo ? (
            <div className="landing-about-ctas">
              <button type="button" className="landing-cta landing-about-cta" onClick={() => onGo('imkoniyatlar')}>
                Imkoniyatlar
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                type="button"
                className={cn('landing-btn-outline landing-about-cta-ghost')}
                onClick={() => onGo('tariflar')}
              >
                Tariflar
              </button>
            </div>
          ) : (
            <ul className="landing-about-close-points">
              {['Imkoniyatlar', 'Tariflar'].map((t) => (
                <li key={t}>
                  <Check className="h-4 w-4 shrink-0 text-sky-500" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      {lightbox ? (
        <div
          className="landing-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="landing-lightbox-close"
            aria-label="Yopish"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="landing-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
