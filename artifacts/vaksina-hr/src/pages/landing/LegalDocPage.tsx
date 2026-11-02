import { useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { LandingShell } from './LandingShell';
import type { LegalDoc } from './legal';
import { PRIVACY_POLICY, TERMS_OF_USE } from './legal';

function scrollPageToTop() {
  if ('scrollRestoration' in history) {
    try {
      history.scrollRestoration = 'manual';
    } catch {
      /* ignore */
    }
  }
  const jump = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById('landing-legal-top')?.scrollIntoView({ block: 'start', behavior: 'auto' });
  };
  jump();
  requestAnimationFrame(jump);
  window.setTimeout(jump, 0);
  window.setTimeout(jump, 50);
  window.setTimeout(jump, 120);
}

function LegalContent({ doc }: { doc: LegalDoc }) {
  const [location] = useLocation();
  const other =
    doc.slug === 'foydalanish-shartlari' ? PRIVACY_POLICY : TERMS_OF_USE;
  const Icon = doc.slug === 'maxfiylik-siyosati' ? Shield : FileText;

  useLayoutEffect(() => {
    scrollPageToTop();
  }, [doc.slug, location]);

  useEffect(() => {
    document.title = `${doc.title} — PROOPEX`;
    scrollPageToTop();
    return () => {
      document.title = 'PROOPEX — HR platforma';
    };
  }, [doc.slug, doc.title, location]);

  return (
    <article id="landing-legal-top" className="landing-legal" tabIndex={-1}>
      <header className="landing-legal-head">
        <div className="landing-legal-nav">
          <Link href="/" className="landing-legal-back">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Bosh sahifa
          </Link>
        </div>
        <p className="landing-eyebrow landing-legal-eyebrow">
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {doc.eyebrow}
        </p>
        <h1 className="landing-legal-title">{doc.title}</h1>
        <p className="landing-legal-updated">Yangilangan: {doc.updated}</p>
        <p className="landing-legal-intro">{doc.intro}</p>
      </header>

      <div className="landing-legal-body">
        {doc.sections.map((section) => (
          <section key={section.title} className="landing-legal-section">
            <h2 className="landing-legal-h">{section.title}</h2>
            {section.paragraphs?.map((p, i) => (
              <p key={`${section.title}-p-${i}`} className="landing-legal-p">
                {p}
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="landing-legal-list">
                {section.bullets.map((b, i) => (
                  <li key={`${section.title}-b-${i}`}>{b}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <aside className="landing-legal-note" aria-label="Qo‘shimcha">
        <p>{doc.contactNote}</p>
        <Link href={`/${other.slug}`} className="landing-legal-other">
          {other.title} →
        </Link>
      </aside>
    </article>
  );
}

export function FoydalanishShartlariPage() {
  return (
    <LandingShell>
      <section className="landing-anchor landing-section landing-page-section landing-legal-page">
        <div className="landing-page-wide mx-auto">
          <LegalContent doc={TERMS_OF_USE} />
        </div>
      </section>
    </LandingShell>
  );
}

export function MaxfiylikSiyosatiPage() {
  return (
    <LandingShell>
      <section className="landing-anchor landing-section landing-page-section landing-legal-page">
        <div className="landing-page-wide mx-auto">
          <LegalContent doc={PRIVACY_POLICY} />
        </div>
      </section>
    </LandingShell>
  );
}

export default FoydalanishShartlariPage;
