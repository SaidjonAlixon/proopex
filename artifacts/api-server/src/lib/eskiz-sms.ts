/**
 * Eskiz.uz SMS Gateway
 * Docs: https://documenter.getpostman.com/view/663428/RzfmES4z
 */

const ESKIZ_BASE = "https://notify.eskiz.uz/api";

type TokenCache = { token: string; expiresAt: number };

let tokenCache: TokenCache | null = null;

function eskizEmail() {
  return String(process.env.ESKIZ_EMAIL || process.env.ESKIZ_LOGIN || "").trim();
}

function eskizPassword() {
  return String(process.env.ESKIZ_PASSWORD || process.env.ESKIZ_SECRET || "").trim();
}

function eskizFrom() {
  return String(process.env.ESKIZ_FROM || "4546").trim() || "4546";
}

export function isEskizConfigured() {
  return Boolean(eskizEmail() && eskizPassword());
}

async function loginEskiz(): Promise<string> {
  const email = eskizEmail();
  const password = eskizPassword();
  if (!email || !password) {
    throw new Error("Eskiz sozlanmagan (ESKIZ_EMAIL / ESKIZ_PASSWORD)");
  }

  const body = new FormData();
  body.set("email", email);
  body.set("password", password);

  const res = await fetch(`${ESKIZ_BASE}/auth/login`, {
    method: "POST",
    body,
  });
  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    data?: { token?: string };
  };
  const token = data?.data?.token;
  if (!res.ok || !token) {
    throw new Error(data?.message || "Eskiz token olinmadi");
  }
  // Token ~30 kun — 25 kunda yangilaymiz
  tokenCache = { token, expiresAt: Date.now() + 25 * 24 * 60 * 60 * 1000 };
  return token;
}

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }
  return loginEskiz();
}

async function refreshToken(): Promise<string> {
  if (!tokenCache?.token) return loginEskiz();
  const res = await fetch(`${ESKIZ_BASE}/auth/refresh`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${tokenCache.token}` },
  });
  const data = (await res.json().catch(() => ({}))) as {
    data?: { token?: string };
  };
  if (res.ok && data?.data?.token) {
    tokenCache = { token: data.data.token, expiresAt: Date.now() + 25 * 24 * 60 * 60 * 1000 };
    return tokenCache.token;
  }
  return loginEskiz();
}

export async function sendEskizSms(opts: {
  phoneE164: string; // 998901234567
  message: string;
}): Promise<{ ok: true; messageId?: string } | { ok: false; error: string }> {
  const phone = opts.phoneE164.replace(/\D/g, "");
  if (!/^998\d{9}$/.test(phone)) {
    return { ok: false, error: "Noto‘g‘ri telefon raqam" };
  }
  if (!isEskizConfigured()) {
    return { ok: false, error: "Eskiz sozlanmagan" };
  }

  const payload = () => {
    const body = new FormData();
    body.set("mobile_phone", phone);
    body.set("message", opts.message);
    body.set("from", eskizFrom());
    return body;
  };

  try {
    let token = await getToken();
    let res = await fetch(`${ESKIZ_BASE}/message/sms/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: payload(),
    });

    if (res.status === 401) {
      token = await refreshToken();
      res = await fetch(`${ESKIZ_BASE}/message/sms/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload(),
      });
    }

    const data = (await res.json().catch(() => ({}))) as {
      status?: string;
      id?: string | number;
      message?: string | Record<string, unknown>;
    };

    if (!res.ok || data.status === "error") {
      const msg =
        typeof data.message === "string"
          ? data.message
          : data.message
            ? JSON.stringify(data.message)
            : `Eskiz xato (${res.status})`;
      console.error("[eskiz-sms] send failed:", msg, data);
      return { ok: false, error: msg };
    }

    return { ok: true, messageId: data.id != null ? String(data.id) : undefined };
  } catch (err) {
    console.error("[eskiz-sms] send error:", err);
    return { ok: false, error: (err as Error).message || "SMS yuborilmadi" };
  }
}

export function buildTrialOtpSms(code: string) {
  // Production (tasdiqlangan shablon) — Latin, ASCII
  return `PROOPEX: tasdiqlash kodi ${code}. Kodni hech kimga bermang.`;
}

/** Eskiz test akkaunti faqat shu matnlarni qabul qiladi */
export const ESKIZ_TEST_SMS_TEXT = "Bu Eskiz dan test";

export function isEskizTestMode() {
  return process.env.ESKIZ_TEST_MODE === "1" || process.env.ESKIZ_TEST_MODE === "true";
}

export function isEskizTestTextError(err: string) {
  return /Для теста|test from Eskiz|Bu Eskiz dan test|только один из этих текстов/i.test(err);
}
