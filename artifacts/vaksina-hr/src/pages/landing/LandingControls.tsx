import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useTheme } from 'next-themes';
import { ArrowRight, LogIn, Moon, Sun } from 'lucide-react';
import { useI18n, type Locale } from '../../i18n/I18nProvider';
import { cn } from '../../lib/utils';

export function LandingLang() {
  const { locale, setLocale } = useI18n();

  const opt = (code: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(code)}
      aria-pressed={locale === code}
      className={cn('landing-lang-opt', locale === code && 'landing-lang-opt--on')}
    >
      {label}
    </button>
  );

  return (
    <div className="landing-lang" role="group" aria-label="Til">
      {opt('uz', 'UZ')}
      {opt('ru', 'RU')}
    </div>
  );
}

export function LandingTheme({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <button
      type="button"
      className={cn('landing-theme', isDark && 'landing-theme--dark', className)}
      aria-label={isDark ? 'Kunduzgi rejim' : 'Kechki rejim'}
      title={isDark ? 'Kunduzgi rejim' : 'Kechki rejim'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <Sun className="landing-theme-ico landing-theme-ico--sun" />
      <Moon className="landing-theme-ico landing-theme-ico--moon" />
      <span className="landing-theme-knob" aria-hidden />
    </button>
  );
}

/** Navbar «Kirish» */
export function LandingEnter({ className }: { className?: string }) {
  return (
    <Link href="/login" className={cn('landing-enter-link', className)}>
      <LogIn className="landing-enter-ico" aria-hidden />
      Kirish
    </Link>
  );
}

/** Brand CTA — «Boshlash» / «7 kun bepul» + ixtiyoriy status */
export function LandingStart({
  className,
  label = 'Boshlash',
  badge,
}: {
  className?: string;
  label?: string;
  badge?: string;
}) {
  const isHero = className?.includes('landing-start--hero');
  const isNav = className?.includes('landing-start--nav') || className?.includes('landing-nav-start');

  const href = badge ? '/login?mode=register' : '/login';

  if (!badge) {
    return (
      <Link href={href} className={cn('landing-start', className)}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  if (isHero) {
    return (
      <div className={cn('landing-trial-cta', className)}>
        <span className="landing-trial-cta-badge" aria-label={badge}>
          <span className="landing-trial-cta-live" aria-hidden />
          {badge}
        </span>
        <Link href={href} className="landing-trial-cta-btn">
          <span className="landing-trial-cta-shine" aria-hidden />
          <span className="landing-trial-cta-copy">
            <span className="landing-trial-cta-kicker">Bepul sinov</span>
            <span className="landing-trial-cta-label">{label}</span>
          </span>
          <span className="landing-trial-cta-arrow" aria-hidden>
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'landing-start-wrap',
        isNav && 'landing-start-wrap--nav',
        className,
      )}
    >
      <span className="landing-start-badge" aria-label={badge}>
        <span className="landing-start-badge-dot" aria-hidden />
        {badge}
      </span>
      <Link
        href={href}
        className={cn(
          'landing-start',
          className?.includes('landing-start--nav') && 'landing-start--nav',
        )}
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
