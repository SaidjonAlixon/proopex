import { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import {
  completeTrial,
  fetchTrialConfig,
  pollTelegramTrial,
  startGoogleTrial,
  startTelegramTrial,
  verifyTrialCode,
  verifyTrialLink,
  type TrialMethod,
} from '../../lib/trial-auth-api';
import { cn } from '../../lib/utils';

/** Faqat asosiy scope — gmail.send Google tekshiruvisiz 403 beradi */
const GOOGLE_SCOPES = 'openid email profile';

type TrialUser = Awaited<ReturnType<typeof completeTrial>>['user'];

type GoogleTokenClient = {
  requestAccessToken: (override?: { prompt?: string }) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: Record<string, unknown>) => void;
          prompt: (cb?: (n: { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean }) => void) => void;
          renderButton: (el: HTMLElement, cfg: Record<string, unknown>) => void;
        };
        oauth2: {
          initTokenClient: (cfg: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string; error_description?: string }) => void;
            error_callback?: (err: { type?: string; message?: string }) => void;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  const existing = document.getElementById('google-gsi');
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      if (window.google?.accounts?.oauth2) resolve();
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.id = 'google-gsi';
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Google skript yuklanmadi'));
    document.head.appendChild(s);
  });
}

type Step = 'method' | 'telegram' | 'otp' | 'password';

export function TrialRegisterPanel({ onRegistered }: { onRegistered: (user: TrialUser) => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<TrialMethod | null>(null);
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [verifyLink, setVerifyLink] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [targetMasked, setTargetMasked] = useState('');
  const [botUrl, setBotUrl] = useState<string | null>(null);
  const [botUsername, setBotUsername] = useState('@vaksinahrbot');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const tokenClientRef = useRef<GoogleTokenClient | null>(null);
  const linkHandledRef = useRef(false);
  const pollStopRef = useRef(false);

  useEffect(() => {
    const fromVite = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
    void fetchTrialConfig().then((c) => {
      setGoogleClientId(c.googleClientId || fromVite || null);
      if (c.botUsername) setBotUsername(c.botUsername);
    });
  }, []);

  /** Gmail havolasi: ?verify=token yoki server redirect ?verified=challengeId; Telegram: ?tg= */
  useEffect(() => {
    if (linkHandledRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verify');
    const verifiedId = params.get('verified');
    const verifyError = params.get('verifyError');
    const tgChallenge = params.get('tg');
    if (verifyError) {
      linkHandledRef.current = true;
      toast({
        title: 'Havola',
        description: 'Havola muddati tugagan yoki yaroqsiz — qayta Google orqali kiring',
        variant: 'destructive',
      });
      return;
    }
    if (tgChallenge) {
      linkHandledRef.current = true;
      setChallengeId(tgChallenge);
      setMethod('telegram');
      setPending(true);
      void pollTelegramTrial(tgChallenge)
        .then((res) => {
          if (res.verified) {
            setTargetMasked(res.targetMasked || 'Telegram');
            if (res.fullName) setFullName(res.fullName);
            setStep('password');
            toast({ title: 'Tasdiqlandi', description: 'Telegram — endi parol o‘rnating' });
          } else {
            setStep('telegram');
          }
        })
        .catch((err) => {
          toast({ title: 'Telegram', description: (err as Error).message, variant: 'destructive' });
          setStep('method');
        })
        .finally(() => setPending(false));
      return;
    }
    if (verifiedId) {
      linkHandledRef.current = true;
      setChallengeId(verifiedId);
      setMethod('google');
      setTargetMasked(params.get('email') || '');
      setStep('password');
      toast({ title: 'Tasdiqlandi', description: 'Havola orqali — endi parol o‘rnating' });
      return;
    }
    if (!token) return;
    linkHandledRef.current = true;
    setPending(true);
    void verifyTrialLink(token)
      .then((res) => {
        setChallengeId(res.challengeId);
        setTargetMasked(res.targetMasked);
        if (res.fullName) setFullName(res.fullName);
        setMethod('google');
        setStep('password');
        toast({ title: 'Tasdiqlandi', description: 'Havola orqali — endi parol o‘rnating' });
        const url = new URL(window.location.href);
        url.searchParams.delete('verify');
        url.searchParams.set('mode', 'register');
        window.history.replaceState({}, '', url.toString());
      })
      .catch((err) => {
        toast({ title: 'Havola', description: (err as Error).message, variant: 'destructive' });
      })
      .finally(() => setPending(false));
  }, [toast]);

  const finishGoogleAccess = useCallback(
    async (accessToken: string) => {
      setPending(true);
      try {
        const res = await startGoogleTrial({ accessToken });
        setChallengeId(res.challengeId);
        setTargetMasked(res.targetMasked);
        if (res.fullName) setFullName(res.fullName);
        setMethod('google');
        setDevCode(res.devCode || null);
        setVerifyLink(res.verifyLink || null);
        setEmailSent(Boolean(res.emailSent));
        setOtp('');
        setStep('otp');
        toast({
          title: res.emailSent ? 'Gmailga yuborildi' : 'Tasdiqlash',
          description: res.message,
        });
      } catch (err) {
        toast({ title: 'Gmail', description: (err as Error).message, variant: 'destructive' });
      } finally {
        setPending(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    if (!googleClientId) {
      tokenClientRef.current = null;
      return;
    }
    let cancelled = false;
    void loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.oauth2) return;
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: GOOGLE_SCOPES,
          callback: (resp) => {
            if (resp.error) {
              toast({
                title: 'Google',
                description: resp.error_description || resp.error,
                variant: 'destructive',
              });
              return;
            }
            if (resp.access_token) void finishGoogleAccess(resp.access_token);
          },
          error_callback: (err) => {
            if (err?.type === 'popup_closed') return;
            toast({
              title: 'Google',
              description: err?.message || 'Akkaunt tanlash bekor qilindi',
              variant: 'destructive',
            });
          },
        });
      })
      .catch((err) => {
        toast({ title: 'Google', description: (err as Error).message, variant: 'destructive' });
      });
    return () => {
      cancelled = true;
    };
  }, [googleClientId, finishGoogleAccess, toast]);

  const openGoogleSignIn = () => {
    setMethod('google');
    if (!googleClientId) {
      toast({
        title: 'Google sozlanmagan',
        description: 'VITE_GOOGLE_CLIENT_ID qo‘ying — keyin Gmail akkauntlari chiqadi',
        variant: 'destructive',
      });
      return;
    }
    const run = (client: GoogleTokenClient) => {
      client.requestAccessToken({ prompt: 'select_account' });
    };
    if (tokenClientRef.current) {
      run(tokenClientRef.current);
      return;
    }
    setPending(true);
    void loadGoogleScript()
      .then(() => {
        if (!window.google?.accounts?.oauth2 || !googleClientId) {
          toast({
            title: 'Google',
            description: 'Akkaunt oynasi ochilmadi — Client ID ni tekshiring',
            variant: 'destructive',
          });
          return;
        }
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: GOOGLE_SCOPES,
          callback: (resp) => {
            if (resp.error) {
              toast({
                title: 'Google',
                description: resp.error_description || resp.error,
                variant: 'destructive',
              });
              return;
            }
            if (resp.access_token) void finishGoogleAccess(resp.access_token);
          },
        });
        tokenClientRef.current = client;
        run(client);
      })
      .catch((err) => {
        toast({ title: 'Google', description: (err as Error).message, variant: 'destructive' });
      })
      .finally(() => setPending(false));
  };

  const beginTelegram = async () => {
    setMethod('telegram');
    setPending(true);
    pollStopRef.current = false;
    try {
      const res = await startTelegramTrial();
      setChallengeId(res.challengeId);
      setBotUrl(res.botUrl);
      setBotUsername(res.botUsername || botUsername);
      setStep('telegram');
      window.open(res.botUrl, '_blank', 'noopener,noreferrer');
      toast({ title: 'Telegram', description: res.message });
    } catch (err) {
      toast({ title: 'Telegram', description: (err as Error).message, variant: 'destructive' });
      setStep('method');
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (step !== 'telegram' || !challengeId || method !== 'telegram') return;
    pollStopRef.current = false;
    let ticks = 0;
    const tick = async () => {
      if (pollStopRef.current) return;
      ticks += 1;
      if (ticks > 90) {
        toast({
          title: 'Vaqt tugadi',
          description: 'Telegramda Start bosing yoki qayta urinib ko‘ring',
          variant: 'destructive',
        });
        return;
      }
      try {
        const res = await pollTelegramTrial(challengeId);
        if (res.verified) {
          pollStopRef.current = true;
          setTargetMasked(res.targetMasked || 'Telegram');
          if (res.fullName) setFullName(res.fullName);
          setStep('password');
          toast({ title: 'Tasdiqlandi', description: 'Endi parol o‘rnating' });
          return;
        }
      } catch (err) {
        pollStopRef.current = true;
        toast({ title: 'Telegram', description: (err as Error).message, variant: 'destructive' });
        setStep('method');
        return;
      }
      window.setTimeout(() => void tick(), 2000);
    };
    const t = window.setTimeout(() => void tick(), 1500);
    return () => {
      pollStopRef.current = true;
      window.clearTimeout(t);
    };
  }, [step, challengeId, method, toast]);

  const confirmOtp = async () => {
    if (otp.trim().length < 4) {
      toast({ title: 'Kod', description: 'Tasdiqlash kodini kiriting', variant: 'destructive' });
      return;
    }
    setPending(true);
    try {
      await verifyTrialCode(challengeId, otp.trim());
      setStep('password');
      toast({ title: 'Tasdiqlandi', description: 'Endi parol o‘rnating' });
    } catch (err) {
      toast({ title: 'Kod xato', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setPending(false);
    }
  };

  const submitPassword = async () => {
    if (password.length < 6) {
      toast({ title: 'Parol', description: 'Kamida 6 belgi', variant: 'destructive' });
      return;
    }
    if (password !== password2) {
      toast({ title: 'Parol', description: 'Parollar mos emas', variant: 'destructive' });
      return;
    }
    setPending(true);
    try {
      const res = await completeTrial({
        challengeId,
        password,
        fullName: fullName.trim() || undefined,
      });
      toast({ title: 'Tayyor', description: res.message || 'Ro‘yxatdan o‘tdingiz' });
      onRegistered(res.user);
    } catch (err) {
      toast({ title: 'Xato', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === 'method' ? (
        <div className="trial-auth-stack">
          <button type="button" className="trial-google-btn" disabled={pending} onClick={openGoogleSignIn}>
            <span className="trial-google-btn-ico">
              <GoogleGlyph />
            </span>
            <span className="trial-google-btn-copy">
              <strong>Google orqali kirish</strong>
              <small>Akkauntingizni tanlang</small>
            </span>
          </button>

          <div className="trial-or" role="separator">
            <span>yoki</span>
          </div>

          <div className="trial-tg-card">
            <div className="trial-tg-card-head">
              <TelegramGlyph className="trial-tg-ico trial-tg-ico--lg" />
              <div>
                <div className="trial-tg-card-title">Telegram orqali</div>
                <div className="trial-tg-card-hint">Botda Start — akkaunt tasdiqlanadi</div>
              </div>
            </div>
            <p className="trial-tg-help">
              {botUsername} ochiladi. Start bosing, keyin saytda parol o‘rnating.
            </p>
            <Button
              type="button"
              className="login-proopex-submit w-full"
              disabled={pending}
              onClick={() => void beginTelegram()}
            >
              {pending && method === 'telegram' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Telegram orqali ro‘yxatdan o‘tish
            </Button>
          </div>
        </div>
      ) : null}

      {step === 'telegram' ? (
        <div className="trial-auth-stack">
          <div className="trial-tg-card">
            <div className="trial-tg-card-head">
              <TelegramGlyph className="trial-tg-ico trial-tg-ico--lg" />
              <div>
                <div className="trial-tg-card-title">Telegramni tasdiqlang</div>
                <div className="trial-tg-card-hint">Botda Start tugmasini bosing</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-sky-200/80 bg-sky-50/90 px-3 py-2.5 text-sm text-sky-950 dark:border-sky-500/30 dark:bg-sky-950/40 dark:text-sky-100">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              <span>Telegram javobini kutmoqdamiz…</span>
            </div>
            <p className="trial-tg-help">
              Agar oyna ochilmasa, quyidagi tugma bilan {botUsername} ga o‘ting.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                pollStopRef.current = true;
                setStep('method');
              }}
            >
              Orqaga
            </Button>
            <Button
              type="button"
              className="login-proopex-submit flex-1"
              onClick={() => botUrl && window.open(botUrl, '_blank', 'noopener,noreferrer')}
              disabled={!botUrl}
            >
              Botni ochish
            </Button>
          </div>
        </div>
      ) : null}

      {step === 'otp' ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/80 px-3 py-2.5 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-100">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-semibold">Gmailni tasdiqlang</div>
              <div className="text-xs opacity-90">
                {emailSent
                  ? `${targetMasked} ga kod va havola yuborildi — kodni kiriting yoki Gmaildagi havolani bosing`
                  : `${targetMasked} — kodni kiriting yoki havolani oching`}
              </div>
              {devCode ? (
                <div className="mt-1 rounded-md bg-white/70 px-2 py-1 font-mono text-xs dark:bg-black/30">
                  Kod: <strong>{devCode}</strong>
                </div>
              ) : null}
              {verifyLink ? (
                <a
                  href={verifyLink}
                  className="mt-2 inline-block text-xs font-semibold underline underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  Havola orqali tasdiqlash
                </a>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial-otp">6 xonali kod</Label>
            <Input
              id="trial-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-[0.35em]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setOtp('');
                setVerifyLink(null);
                setDevCode(null);
                setStep('method');
              }}
            >
              Orqaga
            </Button>
            <Button type="button" className="login-proopex-submit flex-1" disabled={pending} onClick={() => void confirmOtp()}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tasdiqlash'}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 'password' ? (
        <div className="space-y-3">
          <div className="rounded-xl border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {method === 'telegram' ? (
              <span className="inline-flex items-center gap-1.5">
                <TelegramGlyph className="h-3.5 w-3.5" /> {targetMasked}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {targetMasked}
              </span>
            )}
            <span className="mx-1.5">·</span>
            Tasdiqlandi — parol o‘rnating
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial-name">Ism familiya (ixtiyoriy)</Label>
            <Input id="trial-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ismingiz" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial-pass">Yangi parol</Label>
            <div className="relative">
              <Input
                id="trial-pass"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 6 belgi"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial-pass2">Parolni takrorlang</Label>
            <Input
              id="trial-pass2"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          <Button type="button" className="login-proopex-submit w-full" disabled={pending} onClick={() => void submitPassword()}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Ro‘yxatdan o‘tish
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function TrialLoginFields({
  method,
  onMethodChange,
  login,
  onLoginChange,
}: {
  method: TrialMethod;
  onMethodChange: (m: TrialMethod) => void;
  login: string;
  onLoginChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="trial-login-tabs" role="tablist" aria-label="Kirish usuli">
        <button
          type="button"
          role="tab"
          aria-selected={method === 'google'}
          className={cn('trial-login-tab', method === 'google' && 'trial-login-tab--on')}
          onClick={() => onMethodChange('google')}
        >
          <GoogleGlyph className="h-3.5 w-3.5" />
          Gmail
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={method === 'telegram'}
          className={cn('trial-login-tab', method === 'telegram' && 'trial-login-tab--on')}
          onClick={() => onMethodChange('telegram')}
        >
          <TelegramGlyph className="h-3.5 w-3.5" />
          Telegram
        </button>
      </div>

      {method === 'telegram' ? (
        <div className="trial-tg-card trial-tg-card--compact">
          <div className="trial-tg-card-head">
            <TelegramGlyph className="trial-tg-ico trial-tg-ico--lg" />
            <div>
              <div className="trial-tg-card-title">Telegram login</div>
              <div className="trial-tg-card-hint">@username yoki tg_…</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-tg">Login</Label>
            <Input
              id="login-tg"
              autoComplete="username"
              placeholder="@username"
              value={login}
              onChange={(e) => onLoginChange(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="login-gmail">Gmail</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-gmail"
              type="email"
              autoComplete="username"
              placeholder="ism@gmail.com"
              className="pl-9"
              value={login}
              onChange={(e) => onLoginChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TelegramGlyph({ className }: { className?: string }) {
  return (
    <svg className={className || 'h-5 w-5'} viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="12" fill="#229ED9" />
      <path
        fill="#fff"
        d="M17.6 7.2 15.9 16c-.1.5-.4.6-.9.4l-2.5-1.9-1.2 1.2c-.1.1-.3.3-.5.3l.2-2.6 4.7-4.3c.2-.2 0-.3-.3-.1l-5.8 3.7-2.5-.8c-.5-.1-.5-.5.1-.8l9.8-3.8c.4-.2.8.1.6.7z"
      />
    </svg>
  );
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className || 'h-5 w-5'} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7 12.9 19.6C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 36.3 44 31 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}
