import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { LandingShell } from './LandingShell';
import { MissionSection } from './MissionSection';

export default function MaqsadimizPage() {
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
      <section className="landing-anchor landing-section landing-section--soft landing-page-section">
        <div className="landing-page-wide mx-auto">
          <MissionSection onGo={onGo} />
        </div>
      </section>
    </LandingShell>
  );
}
