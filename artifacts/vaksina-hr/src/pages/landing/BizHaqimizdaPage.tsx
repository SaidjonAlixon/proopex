import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { LandingShell } from './LandingShell';
import { AboutSection } from './AboutSection';

export default function BizHaqimizdaPage() {
  const [, setLocation] = useLocation();

  const onGo = useCallback(
    (id: string) => {
      setLocation('/');
      queueMicrotask(() => {
        history.replaceState(null, '', `/#${id}`);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [setLocation],
  );

  return (
    <LandingShell>
      <section className="landing-anchor landing-section landing-page-section">
        <div className="landing-page-wide mx-auto">
          <AboutSection onGo={onGo} />
        </div>
      </section>
    </LandingShell>
  );
}
