import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useSearch } from 'wouter';
import { Eye, EyeOff, ShieldAlert, ShieldQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import type { User } from '@workspace/api-client-react';
import { cn, compactCredential } from '../lib/utils';
import { ThemeToggle } from '../components/theme-toggle';
import { LanguageSwitcher } from '../components/language-switcher';
import {
  ForeignDeviceWarning,
  LastApprovalBanner,
  SupportContacts,
  type LastDeviceApproval,
  type PrimaryDeviceInfo,
} from '../components/SupportContacts';
import { useI18n } from '../i18n/I18nProvider';
import {
  isStajyor,
  isLimitedOfficeStaffRole,
  isReviziyaRole,
  isStudentRole,
  isPharmacyDeviceStaff,
  requiresMandatoryFaceEnroll,
} from '../lib/roles';
import { loginWithDevice, requestDeviceChange } from '../lib/device-security-api';
import { takeAfterLogin } from '../lib/conference/api';
import { fetchFaceIdStatus } from '../lib/face-id';
import { TrialLoginFields, TrialRegisterPanel } from '../components/auth/TrialRegisterPanel';
import type { TrialMethod } from '../lib/trial-auth-api';
import { uzPhoneToE164 } from '../lib/trial-auth-api';

type DeviceGate =
  | null
  | {
      code: 'DEVICE_PENDING' | 'DEVICE_NOT_AUTHORIZED';
      message: string;
      deviceName?: string;
      canRequestChange?: boolean;
      lastApproval?: LastDeviceApproval | null;
      foreignDevice?: boolean;
      primaryDevice?: PrimaryDeviceInfo | null;
    };

const DEVICE_GATE_KEY = 'vhr_device_gate';

export default function Login() {
  const search = useSearch();
  const initialMode = useMemo(() => {
    const q = new URLSearchParams(search);
    const mode = q.get('mode') || q.get('tab');
    if (mode === 'register' || mode === 'signup' || mode === 'trial') return 'register' as const;
    return 'login' as const;
  }, [search]);

  const [view, setView] = useState<'login' | 'register'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<TrialMethod>('google');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [gate, setGate] = useState<DeviceGate>(null);
  const [requesting, setRequesting] = useState(false);
  const { switchToUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const base = import.meta.env.BASE_URL || '/';

  useEffect(() => {
    setView(initialMode);
  }, [initialMode]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DEVICE_GATE_KEY);
      if (!raw) return;
      sessionStorage.removeItem(DEVICE_GATE_KEY);
      const parsed = JSON.parse(raw) as DeviceGate;
      if (parsed?.code === 'DEVICE_PENDING' || parsed?.code === 'DEVICE_NOT_AUTHORIZED') {
        setGate(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const goAfterLogin = async (user: User) => {
    switchToUser(user);
    if (user.role === 'trial') {
      setLocation('/dashboard');
      return;
    }
    if (isStudentRole(user.role)) {
      setLocation('/kirish');
      return;
    }
    const back = takeAfterLogin();
    if (back) {
      setLocation(back);
      return;
    }

    if (requiresMandatoryFaceEnroll(user.role)) {
      try {
        const face = await fetchFaceIdStatus();
        if (!face.registered) {
          setLocation('/davomat-face?enroll=1');
          return;
        }
        if (isPharmacyDeviceStaff(user.role)) {
          setLocation('/davomat-face');
          return;
        }
      } catch {
        setLocation('/davomat-face?enroll=1');
        return;
      }
    }

    if (isStajyor(user.role)) {
      setLocation('/kirish');
      return;
    }
    if (user.role === 'resepsion') {
      setLocation('/resepsion');
      return;
    }
    if (isLimitedOfficeStaffRole(user.role)) {
      setLocation('/vazifalar');
      return;
    }
    if (user.role === 'it_rahbar') {
      setLocation('/it');
      return;
    }
    if (isReviziyaRole(user.role)) {
      setLocation('/reviziya');
      return;
    }
    setLocation('/dashboard');
  };

  const resolveLoginId = () => {
    if (loginMethod === 'phone') {
      const e164 = uzPhoneToE164(login);
      return e164 || compactCredential(login);
    }
    return compactCredential(login).toLowerCase();
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const loginTrim = resolveLoginId();
    const passwordTrim = compactCredential(password);
    if (passwordTrim !== password) setPassword(passwordTrim);
    if (!loginTrim || !passwordTrim) return;

    setPending(true);
    setGate(null);
    try {
      const data = await loginWithDevice(loginTrim, passwordTrim);
      await goAfterLogin(data.user);
    } catch (err) {
      const data = (err as { data?: Record<string, unknown>; code?: string })?.data || {};
      const code = String((err as { code?: string }).code || data.code || '');
      const message = String(
        data.message || data.error || (err as Error).message || t('login.errorDefault'),
      );
      if (code === 'DEVICE_PENDING' || code === 'DEVICE_NOT_AUTHORIZED') {
        setGate({
          code: code as 'DEVICE_PENDING' | 'DEVICE_NOT_AUTHORIZED',
          message,
          deviceName: (data.device as { name?: string } | undefined)?.name,
          canRequestChange: Boolean(data.canRequestChange) || code === 'DEVICE_NOT_AUTHORIZED',
          lastApproval: (data.lastApproval as LastDeviceApproval | null | undefined) ?? null,
          foreignDevice: Boolean(data.foreignDevice) || code === 'DEVICE_NOT_AUTHORIZED',
          primaryDevice: (data.primaryDevice as PrimaryDeviceInfo | null | undefined) ?? null,
        });
      } else {
        toast({
          title: t('login.errorTitle'),
          description: message,
          variant: 'destructive',
        });
      }
    } finally {
      setPending(false);
    }
  };

  const handleRequestChange = async () => {
    setRequesting(true);
    try {
      await requestDeviceChange('Login sahifasidan so‘rov', {
        login: resolveLoginId(),
        password: compactCredential(password),
      });
      toast({
        title: 'So‘rov yuborildi',
        description: 'Administrator tasdig‘ini kuting. Tasdiqlansa shu telefon asosiy bo‘ladi.',
      });
    } catch (err) {
      toast({
        title: 'Yuborilmadi',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setRequesting(false);
    }
  };

  if (gate) {
    const pendingGate = gate.code === 'DEVICE_PENDING';
    return (
      <div className="login-proopex relative flex min-h-screen items-center justify-center p-4">
        <div className="absolute right-4 top-4 flex gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <Card className="login-proopex-card w-full max-w-md border-2 shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                pendingGate
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200'
              }`}
            >
              {pendingGate ? <ShieldQuestion className="h-7 w-7" /> : <ShieldAlert className="h-7 w-7" />}
            </div>
            <CardTitle className="text-xl">
              {pendingGate ? 'Yangi qurilma' : 'Qurilma tasdiqlanmagan'}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">{gate.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {gate.deviceName ? (
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <div className="text-xs text-muted-foreground">Qurilma</div>
                <div className="font-medium">{gate.deviceName}</div>
              </div>
            ) : null}
            {pendingGate ? (
              <p className="text-center text-xs text-muted-foreground">
                Status: Tasdiqlash kutilmoqda — admin panelga bildirishnoma yuborildi.
              </p>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Faqat asosiy telefongizdan kiring. Boshqa joydan kirish uchun admin ruxsati kerak.
              </p>
            )}
            <ForeignDeviceWarning
              show={gate.foreignDevice || gate.code === 'DEVICE_NOT_AUTHORIZED'}
              primaryName={gate.primaryDevice?.name || gate.lastApproval?.deviceName}
              currentName={gate.deviceName}
            />
            <LastApprovalBanner lastApproval={gate.lastApproval} />
            <SupportContacts />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {gate.canRequestChange ? (
              <Button
                className="w-full"
                variant="secondary"
                disabled={requesting}
                onClick={() => void handleRequestChange()}
              >
                Qurilmani almashtirish so‘rash
              </Button>
            ) : null}
            <Button className="w-full" variant="outline" onClick={() => setGate(null)}>
              Orqaga
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="login-proopex relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute left-4 top-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Bosh sahifa
          </Button>
        </Link>
      </div>
      <div className="absolute right-4 top-4 flex gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-md flex-col items-center gap-5 sm:gap-6">
        <div className="login-proopex-brand flex w-full flex-col items-center text-center">
          <img
            src={`${base}logo.png`}
            alt="PROOPEX"
            width={800}
            height={220}
            decoding="async"
            className="login-proopex-logo h-24 w-auto max-w-[min(100%,30rem)] object-contain sm:h-28 sm:max-w-[min(100%,36rem)] md:h-32 md:max-w-[min(100%,42rem)]"
          />
        </div>
        <Card className="login-proopex-card w-full shadow-lg">
          <CardHeader className={cn('text-center', view === 'register' ? 'trial-card-head space-y-4' : 'space-y-3')}>
            <div className="trial-view-tabs" role="tablist" aria-label="Kirish yoki ro‘yxat">
              <button
                type="button"
                role="tab"
                aria-selected={view === 'login'}
                className={cn('trial-view-tab', view === 'login' && 'trial-view-tab--on')}
                onClick={() => {
                  setView('login');
                  setLocation('/login', { replace: true });
                }}
              >
                Kirish
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'register'}
                className={cn('trial-view-tab', view === 'register' && 'trial-view-tab--on')}
                onClick={() => {
                  setView('register');
                  setLocation('/login?mode=register', { replace: true });
                }}
              >
                Ro‘yxatdan o‘tish
              </button>
            </div>

            {view === 'register' ? (
              <div className="trial-hero-copy">
                <CardTitle className="trial-hero-title">
                  <span className="trial-hero-title-accent">7 kun bepul</span>
                </CardTitle>
                <p className="trial-hero-lead">Kartasiz oching. Bir zumda tayyor.</p>
              </div>
            ) : (
              <>
                <CardTitle className="font-landing-display text-2xl font-bold tracking-tight">
                  {t('login.title')}
                </CardTitle>
                <CardDescription>Gmail yoki telefon raqamingiz bilan kiring</CardDescription>
              </>
            )}
          </CardHeader>

          {view === 'register' ? (
            <CardContent>
              <TrialRegisterPanel onRegistered={(user) => void goAfterLogin(user as User)} />
            </CardContent>
          ) : (
            <form onSubmit={(e) => void handleLogin(e)}>
              <CardContent className="space-y-4">
                <TrialLoginFields
                  method={loginMethod}
                  onMethodChange={(m) => {
                    setLoginMethod(m);
                    setLogin('');
                  }}
                  login={login}
                  onLoginChange={setLogin}
                />
                <div className="space-y-2">
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Yashirish' : 'Ko‘rsatish'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="login-proopex-submit w-full" disabled={pending}>
                  {pending ? t('login.submitting') : t('login.submit')}
                </Button>
                <button
                  type="button"
                  className="text-center text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
                  onClick={() => {
                    setView('register');
                    setLocation('/login?mode=register', { replace: true });
                  }}
                >
                  Akkaunt yo‘qmi? 7 kun bepul boshlang
                </button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
