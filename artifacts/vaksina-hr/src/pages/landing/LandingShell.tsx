import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { NAV, type NavId } from './data';
import { LandingEnter, LandingLang, LandingStart, LandingTheme } from './LandingControls';
import { LandingAmbient } from './LandingAmbient';
import { MegaMenu } from './MegaMenu';

function forceScrollTop(behavior: ScrollBehavior = 'auto') {
  if ('scrollRestoration' in history) {
    try {
      history.scrollRestoration = 'manual';
    } catch {
      /* ignore */
    }
  }
  const jump = () => {
    window.scrollTo({ top: 0, left: 0, behavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  jump();
  requestAnimationFrame(jump);
  window.setTimeout(jump, 0);
  window.setTimeout(jump, 50);
  window.setTimeout(jump, 120);
  window.setTimeout(jump, 280);
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    forceScrollTop('smooth');
    return;
  }
  history.replaceState(null, '', `#${id}`);
  const jump = () => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  jump();
  requestAnimationFrame(jump);
  window.setTimeout(jump, 40);
  window.setTimeout(jump, 160);
  window.setTimeout(jump, 320);
}

function navHref(id: string): string | undefined {
  const item = NAV.find((n) => n.id === id);
  return item && 'href' in item ? item.href : undefined;
}

export function LandingShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<NavId | ''>('');
  const base = import.meta.env.BASE_URL || '/';
  const isHome = location === '/' || location === '';

  useEffect(() => {
    if (!isLoading && isAuthenticated) setLocation('/dashboard');
  }, [isAuthenticated, isLoading, setLocation]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      setMegaOpen(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Bosganda ochiladi — boshqa joy / Escape → yopiladi */
  useEffect(() => {
    if (!megaOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const el = e.target as Element | null;
      if (!el?.closest?.('[data-landing-mega]')) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMegaOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [megaOpen]);

  /* Alohida sahifa / hash → active + doim tepadan */
  useEffect(() => {
    if (
      location.startsWith('/foydalanish-shartlari') ||
      location.startsWith('/maxfiylik-siyosati') ||
      location.startsWith('/terms') ||
      location.startsWith('/privacy')
    ) {
      setActive('');
      forceScrollTop('auto');
      return;
    }
    if (location.startsWith('/maqsadimiz')) {
      setActive('maqsadimiz');
      forceScrollTop('auto');
      return;
    }
    if (location.startsWith('/biz-haqimizda') || location.startsWith('/about')) {
      setActive('biz-haqimizda');
      forceScrollTop('auto');
      return;
    }
    if (!isHome) {
      setActive('');
      forceScrollTop('auto');
      return;
    }
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && NAV.some((n) => n.id === hash && !navHref(n.id))) {
      setActive(hash as NavId);
      window.setTimeout(() => scrollToId(hash), 60);
      return;
    }
    setActive('bosh-sahifa');
  }, [location, isHome]);

  useEffect(() => {
    if (!isHome) return;
    const sections = NAV.filter((n) => !navHref(n.id))
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target?.id as NavId | undefined;
        if (top) {
          setActive(top);
          return;
        }
        if (window.scrollY < 120) setActive('bosh-sahifa');
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.08, 0.2, 0.4] },
    );
    sections.forEach((s) => obs.observe(s));
    const onScrollTop = () => {
      if (window.scrollY < 80) setActive('bosh-sahifa');
    };
    window.addEventListener('scroll', onScrollTop, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', onScrollTop);
    };
  }, [isHome]);

  const goPage = useCallback(
    (href: string, activeId: NavId | '' = '') => {
      setMenuOpen(false);
      setMegaOpen(false);
      if (activeId) setActive(activeId);
      else setActive('');
      forceScrollTop('auto');
      setLocation(href);
      queueMicrotask(() => {
        forceScrollTop('auto');
        window.setTimeout(() => forceScrollTop('auto'), 80);
      });
    },
    [setLocation],
  );

  const goSection = useCallback(
    (id: string) => {
      setMenuOpen(false);
      setMegaOpen(false);

      const href = navHref(id);
      if (href) {
        // Bosh sahifa — doim asosiy landing (/) ochilsin
        if (id === 'bosh-sahifa' || href === '/') {
          setActive('bosh-sahifa');
          setLocation('/');
          const goHomeTop = () => {
            history.replaceState(null, '', '/');
            forceScrollTop('smooth');
            document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          };
          if (isHome) goHomeTop();
          else queueMicrotask(() => setTimeout(goHomeTop, 40));
          return;
        }
        goPage(href, id as NavId);
        return;
      }

      const finish = () => {
        if (NAV.some((n) => n.id === id)) setActive(id as NavId);
        scrollToId(id);
      };

      if (isHome) {
        // Footer pastidan — bo‘lim boshiga aniq olib chiqish
        finish();
        window.setTimeout(finish, 80);
        window.setTimeout(finish, 200);
        return;
      }

      setLocation('/');
      queueMicrotask(() => {
        history.replaceState(null, '', `/#${id}`);
        window.setTimeout(finish, 60);
      });
    },
    [goPage, isHome, setLocation],
  );

  if (isLoading) {
    return (
      <div className="landing-shell flex min-h-[100dvh] items-center justify-center">
        <div className="landing-loader" aria-hidden />
      </div>
    );
  }

  return (
    <div className="landing-shell">
      <div className="landing-aurora" aria-hidden />
      <div className="landing-grid" aria-hidden />
      <LandingAmbient />

      <header className={cn('landing-nav', scrolled && 'landing-nav--scrolled')} aria-label="PROOPEX">
        <div className="landing-nav-inner">
          <Link
            href="/"
            className="landing-brand shrink-0"
            aria-label="PROOPEX — asosiy sahifa"
            onClick={(e) => {
              e.preventDefault();
              setMegaOpen(false);
              setMenuOpen(false);
              setActive('bosh-sahifa');
              const goHome = () => {
                history.replaceState(null, '', '/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              };
              if (isHome) {
                goHome();
                return;
              }
              setLocation('/');
              queueMicrotask(() => setTimeout(goHome, 40));
            }}
          >
            <img
              src={`${base}logo.png`}
              alt="PROOPEX"
              className="landing-brand-img"
              width={520}
              height={130}
            />
          </Link>

          <nav className="landing-nav-links" aria-label="Asosiy">
            <div className="landing-nav-dock">
              {NAV.map((item) => {
                const isMega = 'mega' in item && item.mega;
                const isTarif = item.id === 'tariflar';
                const isOn = active === item.id || (isMega && megaOpen);
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-landing-mega={isMega ? '' : undefined}
                    className={cn(
                      'landing-nav-link',
                      isTarif && 'landing-nav-link--tarif',
                      isOn && (isTarif ? 'landing-nav-link--tarif-active' : 'landing-nav-link--active'),
                    )}
                    aria-expanded={isMega ? megaOpen : undefined}
                    aria-haspopup={isMega ? 'dialog' : undefined}
                    onClick={() => {
                      if (isMega) {
                        setMegaOpen((v) => !v);
                        return;
                      }
                      setMegaOpen(false);
                      goSection(item.id);
                    }}
                  >
                    {isTarif ? (
                      <>
                        <span className="landing-nav-tarif-glow" aria-hidden />
                        <span className="landing-nav-tarif-label">{item.label}</span>
                      </>
                    ) : (
                      item.label
                    )}
                    {isMega ? (
                      <ChevronDown className={cn('landing-nav-chevron', megaOpen && 'landing-nav-chevron--open')} />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="landing-nav-actions">
            <div className="landing-nav-actions-row">
              <div className="landing-nav-mobile-bar">
                <LandingLang />
                <LandingTheme />
                <LandingStart
                  className="landing-start--nav landing-nav-start-mobile"
                  label="7 kun bepul"
                  badge="Hoziroq"
                />
              </div>
              <div className="landing-nav-desk-tools">
                <LandingLang />
                <LandingTheme />
                <LandingEnter className="landing-nav-enter-desk" />
                <LandingStart
                  className="landing-nav-start-full"
                  label="7 kun bepul"
                  badge="Hoziroq"
                />
              </div>
              <button
                type="button"
                className="landing-nav-burger"
                aria-label={menuOpen ? 'Yopish' : 'Menyu'}
                aria-expanded={menuOpen}
                onClick={() => {
                  setMegaOpen(false);
                  setMenuOpen((v) => !v);
                }}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="landing-nav-mega-slot" data-landing-mega="">
          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} onGo={goSection} />
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="landing-nav-mobile"
            >
              <div className="landing-nav-mobile-sheet">
                <div className="landing-nav-mobile-tools">
                  <div className="landing-nav-mobile-tools-copy">
                    <span className="landing-nav-mobile-kicker">PROOPEX</span>
                    <span className="landing-nav-mobile-tools-label">Til va rejim</span>
                  </div>
                  <div className="landing-nav-mobile-tools-row">
                    <LandingLang />
                    <LandingTheme />
                  </div>
                </div>

                <div className="landing-nav-mobile-list" role="navigation" aria-label="Bo‘limlar">
                  {NAV.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className={cn(
                        'landing-nav-mobile-item',
                        item.id === 'tariflar' && 'landing-nav-mobile-item--tarif',
                        active === item.id &&
                          (item.id === 'tariflar'
                            ? 'landing-nav-mobile-active--tarif'
                            : 'landing-nav-mobile-active'),
                      )}
                      onClick={() => goSection(item.id)}
                    >
                      <span className="landing-nav-mobile-idx">{String(i + 1).padStart(2, '0')}</span>
                      <span className="landing-nav-mobile-label">{item.label}</span>
                      <span className="landing-nav-mobile-arrow" aria-hidden>
                        →
                      </span>
                    </button>
                  ))}
                </div>

                <div className="landing-nav-mobile-cta">
                  <LandingEnter className="landing-nav-mobile-enter" />
                  <LandingStart
                    className="landing-nav-mobile-start w-full justify-center"
                    label="7 kun bepul"
                    badge="Hoziroq"
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main id="top" className="landing-main">
        {children}
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-panel">
            <div className="landing-footer-top">
              <div className="landing-footer-brand">
                <Link
                  href="/"
                  className="landing-footer-logo"
                  aria-label="PROOPEX — asosiy sahifa"
                  onClick={(e) => {
                    e.preventDefault();
                    setMegaOpen(false);
                    setMenuOpen(false);
                    setActive('bosh-sahifa');
                    const goHome = () => {
                      history.replaceState(null, '', '/');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    };
                    if (isHome) {
                      goHome();
                      return;
                    }
                    setLocation('/');
                    queueMicrotask(() => setTimeout(goHome, 40));
                  }}
                >
                  <img
                    src={`${base}logo.png`}
                    alt="PROOPEX"
                    className="landing-footer-logo-img"
                    width={520}
                    height={130}
                  />
                </Link>
                <p className="landing-footer-kicker">Korporativ HR platforma</p>
                <p className="landing-footer-tag">HR · davomat · KPI · vazifalar</p>
                <p className="landing-footer-note">
                  Xodimlar, Face ID davomat, topshiriqlar va oylik hisob-kitob — bitta
                  premium boshqaruv muhitida.
                </p>
                <div className="landing-footer-cta">
                  <LandingStart label="Boshlash" className="landing-footer-start" />
                  <Link href="/login" className="landing-footer-enter">
                    Kirish
                  </Link>
                </div>
              </div>

              <nav className="landing-footer-cols" aria-label="Footer">
                <div className="landing-footer-col">
                  <h4 className="landing-footer-col-title">Platforma</h4>
                  <button type="button" className="landing-footer-link" onClick={() => goSection('bosh-sahifa')}>
                    Bosh sahifa
                  </button>
                  <button type="button" className="landing-footer-link" onClick={() => goSection('imkoniyatlar')}>
                    Imkoniyatlar
                  </button>
                  <button type="button" className="landing-footer-link" onClick={() => goSection('yechimlar')}>
                    Yechimlar
                  </button>
                </div>
                <div className="landing-footer-col">
                  <h4 className="landing-footer-col-title">Kompaniya</h4>
                  <button type="button" className="landing-footer-link" onClick={() => goSection('maqsadimiz')}>
                    Maqsadimiz
                  </button>
                  <button type="button" className="landing-footer-link" onClick={() => goSection('biz-haqimizda')}>
                    Biz haqimizda
                  </button>
                  <button type="button" className="landing-footer-link" onClick={() => goSection('tariflar')}>
                    Tariflar
                  </button>
                </div>
                <div className="landing-footer-col">
                  <h4 className="landing-footer-col-title">Kabinet</h4>
                  <Link
                    href="/login"
                    className="landing-footer-link"
                    onClick={() => forceScrollTop('auto')}
                  >
                    Kirish
                  </Link>
                  <button type="button" className="landing-footer-link" onClick={() => goSection('tariflar')}>
                    Narx kalkulyatori
                  </button>
                  <Link
                    href="/maqsadimiz"
                    className="landing-footer-link"
                    onClick={(e) => {
                      e.preventDefault();
                      goPage('/maqsadimiz', 'maqsadimiz');
                    }}
                  >
                    Maqsadimiz sahifasi
                  </Link>
                </div>
                <div className="landing-footer-col">
                  <h4 className="landing-footer-col-title">Huquqiy</h4>
                  <Link
                    href="/foydalanish-shartlari"
                    className="landing-footer-link"
                    onClick={(e) => {
                      e.preventDefault();
                      goPage('/foydalanish-shartlari');
                    }}
                  >
                    Foydalanish shartlari
                  </Link>
                  <Link
                    href="/maxfiylik-siyosati"
                    className="landing-footer-link"
                    onClick={(e) => {
                      e.preventDefault();
                      goPage('/maxfiylik-siyosati');
                    }}
                  >
                    Maxfiylik siyosati
                  </Link>
                </div>
              </nav>
            </div>

            <div className="landing-footer-bottom">
              <p className="landing-footer-copy">
                © {new Date().getFullYear()} PROOPEX. Barcha huquqlar himoyalangan.
              </p>
              <div className="landing-footer-legal-links">
                <Link
                  href="/foydalanish-shartlari"
                  onClick={(e) => {
                    e.preventDefault();
                    goPage('/foydalanish-shartlari');
                  }}
                >
                  Foydalanish shartlari
                </Link>
                <span aria-hidden>·</span>
                <Link
                  href="/maxfiylik-siyosati"
                  onClick={(e) => {
                    e.preventDefault();
                    goPage('/maxfiylik-siyosati');
                  }}
                >
                  Maxfiylik siyosati
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <div className="landing-section-head mx-auto max-w-3xl px-4 text-center sm:px-6">
      <p className="landing-eyebrow justify-center">{eyebrow}</p>
      <h2 className="landing-title">{title}</h2>
      <p className="landing-lead mx-auto">{lead}</p>
    </div>
  );
}
