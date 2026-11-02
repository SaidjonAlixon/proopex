import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2,
  Eye,
  LayoutDashboard,
  Loader2,
  ScanFace,
  ShieldAlert,
  Smartphone,
  XCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

type Phase =
  | 'idle'
  | 'typing-login'
  | 'typing-pass'
  | 'submit'
  | 'device-ok'
  | 'face'
  | 'success'
  | 'panel'
  | 'new-phone'
  | 'blocked';

const FLOW: { phase: Phase; ms: number }[] = [
  { phase: 'idle', ms: 900 },
  { phase: 'typing-login', ms: 1600 },
  { phase: 'typing-pass', ms: 1400 },
  { phase: 'submit', ms: 900 },
  { phase: 'device-ok', ms: 1200 },
  { phase: 'face', ms: 2200 },
  { phase: 'success', ms: 1600 },
  { phase: 'panel', ms: 2800 },
  { phase: 'idle', ms: 700 },
  { phase: 'typing-login', ms: 1000 },
  { phase: 'typing-pass', ms: 900 },
  { phase: 'submit', ms: 800 },
  { phase: 'new-phone', ms: 1600 },
  { phase: 'blocked', ms: 2800 },
];

const LOGIN_FULL = 'dilshod.k';
const PASS_FULL = '••••••••';

function LoginFace({ scanning, ok }: { scanning: boolean; ok: boolean }) {
  return (
    <div className={cn('landing-login-face', ok && 'landing-login-face--ok')}>
      <svg viewBox="0 0 120 140" aria-hidden className="landing-login-face-svg">
        <defs>
          <radialGradient id="llSkin" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f3d0b5" />
            <stop offset="60%" stopColor="#e8b896" />
            <stop offset="100%" stopColor="#c9956f" />
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="48" rx="40" ry="44" fill="#2c1810" />
        <ellipse cx="60" cy="72" rx="34" ry="42" fill="url(#llSkin)" />
        <path d="M28 58c6-26 20-38 32-40 12 2 26 14 32 40-8-14-18-22-32-22s-24 8-32 22z" fill="#2c1810" />
        <ellipse cx="46" cy="70" rx="6" ry="4.2" fill="#fff" />
        <ellipse cx="74" cy="70" rx="6" ry="4.2" fill="#fff" />
        <circle cx="47" cy="70" r="2.5" fill="#3b2f2a" />
        <circle cx="75" cy="70" r="2.5" fill="#3b2f2a" />
        <path d="M60 70c1.5 6 3 10 0 13" fill="none" stroke="#b8886a" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 98c5 6 15 6 20 0" fill="none" stroke="#c47a6a" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M38 118c4 8 10 12 22 12s18-4 22-12" fill="url(#llSkin)" />
        <path d="M10 140c8-16 22-24 50-24s42 8 50 24" fill="#1e3a5f" />
      </svg>
      {scanning ? <span className="landing-login-scanline" /> : null}
      <div className={cn('landing-login-brackets', ok && 'ok')}>
        <i /><i /><i /><i />
      </div>
      {ok ? (
        <span className="landing-login-face-ok">
          <CheckCircle2 />
        </span>
      ) : null}
    </div>
  );
}

/** Real /login oynasi: login → qurilma → Face ID → panel / yangi telefon rad */
export function LoginDemo() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const phase = reduce ? 'panel' : FLOW[i % FLOW.length].phase;

  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    if (reduce) {
      setLogin(LOGIN_FULL);
      setPass(PASS_FULL);
      return;
    }
    const cur = FLOW[i % FLOW.length];
    const t = window.setTimeout(() => setI((v) => v + 1), cur.ms);
    return () => clearTimeout(t);
  }, [reduce, i]);

  useEffect(() => {
    if (reduce) return;
    if (phase === 'idle' || phase === 'blocked' || phase === 'new-phone') {
      if (phase === 'idle') {
        setLogin('');
        setPass('');
      }
      return;
    }
    if (phase === 'typing-login') {
      setLogin('');
      setPass('');
      let n = 0;
      const id = window.setInterval(() => {
        n += 1;
        setLogin(LOGIN_FULL.slice(0, n));
        if (n >= LOGIN_FULL.length) clearInterval(id);
      }, 70);
      return () => clearInterval(id);
    }
    if (phase === 'typing-pass') {
      setLogin(LOGIN_FULL);
      let n = 0;
      const id = window.setInterval(() => {
        n += 1;
        setPass(PASS_FULL.slice(0, n));
        if (n >= PASS_FULL.length) clearInterval(id);
      }, 55);
      return () => clearInterval(id);
    }
    setLogin(LOGIN_FULL);
    setPass(PASS_FULL);
  }, [phase, reduce]);

  const showFace = phase === 'face' || phase === 'success';
  const showPanel = phase === 'panel';
  const showGate = phase === 'new-phone' || phase === 'blocked';
  const pending = phase === 'submit' || phase === 'device-ok';

  const status =
    phase === 'device-ok'
      ? { tone: 'ok' as const, text: 'Qurilma tanildi — asosiy telefon' }
      : phase === 'face'
        ? { tone: 'scan' as const, text: 'Face ID: yuz tekshirilmoqda…' }
        : phase === 'success'
          ? { tone: 'ok' as const, text: 'Kirish muvaffaqiyatli' }
          : phase === 'panel'
            ? { tone: 'ok' as const, text: 'Rolga mos panel ochildi' }
            : phase === 'new-phone'
              ? { tone: 'warn' as const, text: 'Yangi telefon aniqlandi' }
              : phase === 'blocked'
                ? { tone: 'bad' as const, text: 'Admin tasdig‘isiz kirish yo‘q' }
                : pending
                  ? { tone: 'scan' as const, text: 'Tekshirilmoqda…' }
                  : { tone: 'neutral' as const, text: 'PROOPEX · real kirish oynasi' };

  return (
    <div className="landing-login-demo" aria-label="Kirish jarayoni animatsiyasi">
      <div className="landing-login-demo-head">
        <p className="landing-login-demo-eyebrow">Real platforma · /login</p>
        <h3 className="landing-login-demo-title">Kirish qanday bo‘ladi — to‘liq oqim</h3>
        <p className="landing-login-demo-lead">
          Login va parol → qurilma tekshiruvi → Face ID → panel. Yangi telefonda admin
          tasdig‘isiz kirish rad etiladi.
        </p>
      </div>

      <div className="landing-login-demo-body">
        <div className="landing-login-window">
          <div className="landing-login-window-bar">
            <span /><span /><span />
            <em>proopex.uz/login</em>
          </div>

          <div className="landing-login-window-inner">
            <AnimatePresence mode="wait">
              {showGate ? (
                <motion.div
                  key="gate"
                  className="landing-login-gate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ShieldAlert className="landing-login-gate-icon" />
                  <h4>Yangi qurilma</h4>
                  <p>
                    Faqat asosiy telefongizdan kiring. Boshqa joydan kirish uchun admin
                    ruxsati kerak.
                  </p>
                  <div className="landing-login-gate-row">
                    <Smartphone className="h-4 w-4" />
                    <span>iPhone 15 · yangi</span>
                  </div>
                  {phase === 'blocked' ? (
                    <div className="landing-login-gate-bad">
                      <XCircle className="h-4 w-4" />
                      Kirish cheklangan — admin tasdiqlashi kerak
                    </div>
                  ) : (
                    <div className="landing-login-gate-wait">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Qurilma tekshirilmoqda…
                    </div>
                  )}
                </motion.div>
              ) : showPanel ? (
                <motion.div
                  key="panel"
                  className="landing-login-panel"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="landing-login-panel-top">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Mudir paneli</span>
                    <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="landing-login-panel-grid">
                    <div><b>Davomat</b><span>Bugun 12/14</span></div>
                    <div><b>Vazifalar</b><span>3 ta ochiq</span></div>
                    <div><b>Jamoa</b><span>14 xodim</span></div>
                    <div><b>KPI</b><span>87%</span></div>
                  </div>
                </motion.div>
              ) : showFace ? (
                <motion.div
                  key="face"
                  className="landing-login-face-wrap"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoginFace scanning={phase === 'face'} ok={phase === 'success'} />
                  <p className="landing-login-face-cap">
                    {phase === 'success' ? 'Yuz tanildi' : 'Kameraga qarang'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="landing-login-form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="landing-login-brand">
                    <span className="landing-login-brand-mark">P</span>
                    <strong>PROOPEX</strong>
                  </div>
                  <p className="landing-login-form-title">Tizimga kirish</p>
                  <p className="landing-login-form-sub">Login, parol yoki Face ID</p>

                  <label className="landing-login-label">Login</label>
                  <div className="landing-login-input">
                    {login}
                    {phase === 'typing-login' ? <i className="landing-login-caret" /> : null}
                  </div>

                  <label className="landing-login-label">Parol</label>
                  <div className="landing-login-input landing-login-input--pass">
                    <span>{pass}</span>
                    <Eye className="h-3.5 w-3.5 opacity-40" />
                    {phase === 'typing-pass' ? <i className="landing-login-caret" /> : null}
                  </div>

                  <button
                    type="button"
                    className={cn(
                      'landing-login-btn',
                      pending && 'landing-login-btn--pending',
                    )}
                  >
                    {pending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Tekshirilmoqda…
                      </>
                    ) : (
                      'Kirish'
                    )}
                  </button>

                  <div className="landing-login-alt">
                    <ScanFace className="h-3.5 w-3.5" />
                    Face ID bilan kirish
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="landing-login-aside">
          <AnimatePresence mode="wait">
            <motion.div
              key={status.text}
              className={cn(
                'landing-login-status',
                status.tone === 'ok' && 'landing-login-status--ok',
                status.tone === 'bad' && 'landing-login-status--bad',
                status.tone === 'warn' && 'landing-login-status--warn',
                status.tone === 'scan' && 'landing-login-status--scan',
              )}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              {status.text}
            </motion.div>
          </AnimatePresence>

          <ol className="landing-login-steps">
            <li className={cn(phase !== 'idle' && 'on')}>1. Login / parol</li>
            <li className={cn((phase === 'device-ok' || showFace || showPanel) && 'on')}>
              2. Qurilma tekshiruvi
            </li>
            <li className={cn((showFace || showPanel) && 'on')}>3. Face ID</li>
            <li className={cn(showPanel && 'on ok')}>4. Panel</li>
            <li className={cn(showGate && 'on bad')}>Yangi telefon → rad</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
