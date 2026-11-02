export type TrialMethod = 'phone' | 'google' | 'telegram';

type ApiErr = { error?: string; message?: string };

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & ApiErr;
  if (!res.ok) {
    throw new Error(data.error || data.message || 'So‘rov bajarilmadi');
  }
  return data;
}

export async function fetchTrialConfig() {
  const res = await fetch('/api/auth/trial/config', { credentials: 'include' });
  if (!res.ok) {
    return {
      googleClientId: null as string | null,
      phonePrefix: '+998',
      trialDays: 7,
      telegramConfigured: true,
      telegramManual: true,
      botUsername: null as string | null,
    };
  }
  return (await res.json()) as {
    googleClientId: string | null;
    phonePrefix: string;
    trialDays: number;
    telegramConfigured?: boolean;
    telegramManual?: boolean;
    botUsername?: string | null;
  };
}

export function startPhoneTrial(phone: string) {
  return postJson<{
    challengeId: string;
    targetMasked: string;
    devCode?: string;
    message: string;
  }>('/auth/trial/phone/start', { phone });
}

export type TelegramLoginPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

/** Telegram raqami → Gateway orqali Telegramga kod → akkaunt bog‘lash */
export function claimTelegramTrial(opts: { username?: string; phone: string }) {
  return postJson<{
    challengeId: string;
    verified: boolean;
    targetMasked: string;
    phoneMasked?: string;
    via?: string;
    fullName?: string | null;
    devCode?: string;
    message: string;
  }>('/auth/trial/telegram/claim', opts);
}

/** Telegram Login Widget — akkaunt ulash (ixtiyoriy bot) */
export function linkTelegramTrial(auth: TelegramLoginPayload) {
  return postJson<{
    challengeId: string;
    verified: boolean;
    targetMasked: string;
    fullName?: string | null;
    message: string;
  }>('/auth/trial/telegram/link', auth as unknown as Record<string, unknown>);
}

export function startGoogleTrial(opts: { idToken?: string; accessToken?: string; email?: string }) {
  return postJson<{
    challengeId: string;
    verified?: boolean;
    targetMasked: string;
    fullName?: string | null;
    verifyLink?: string;
    emailSent?: boolean;
    devCode?: string;
    message: string;
  }>('/auth/trial/google/start', opts);
}

export function verifyTrialCode(challengeId: string, code: string) {
  return postJson<{
    challengeId: string;
    verified: boolean;
    method: TrialMethod;
    fullName?: string | null;
    message: string;
  }>('/auth/trial/verify', { challengeId, code });
}

export function verifyTrialLink(token: string) {
  return postJson<{
    challengeId: string;
    verified: boolean;
    method: TrialMethod;
    targetMasked: string;
    fullName?: string | null;
    message: string;
  }>('/auth/trial/verify-link', { token });
}

export function completeTrial(opts: { challengeId: string; password: string; fullName?: string }) {
  return postJson<{
    user: {
      id: number;
      fullName: string;
      role: string;
      login: string;
      phone?: string | null;
      [key: string]: unknown;
    };
    message: string;
  }>('/auth/trial/complete', opts);
}

/** +998 XX XXX XX XX — faqat 9 raqam qismi */
export function formatUzPhoneInput(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 9);
  const a = d.slice(0, 2);
  const b = d.slice(2, 5);
  const c = d.slice(5, 7);
  const e = d.slice(7, 9);
  return [a, b, c, e].filter(Boolean).join(' ');
}

export function uzPhoneToE164(local9: string) {
  const d = local9.replace(/\D/g, '').slice(0, 9);
  return d.length === 9 ? `998${d}` : '';
}
