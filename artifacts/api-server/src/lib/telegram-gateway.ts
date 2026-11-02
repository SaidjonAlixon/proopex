/**
 * Telegram Gateway — telefon raqamiga Telegram ichida tasdiqlash kodi.
 * https://core.telegram.org/gateway/api
 *
 * Token: https://gateway.telegram.org → Access token
 * Env: TELEGRAM_GATEWAY_TOKEN
 */
const GATEWAY_BASE = "https://gatewayapi.telegram.org";

export function isTelegramGatewayConfigured(): boolean {
  return Boolean(String(process.env.TELEGRAM_GATEWAY_TOKEN || "").trim());
}

function gatewayToken(): string | null {
  const t = String(process.env.TELEGRAM_GATEWAY_TOKEN || "").trim();
  return t || null;
}

type GatewayOk<T> = { ok: true; result: T };
type GatewayErr = { ok: false; error: string };

type RequestStatus = {
  request_id: string;
  phone_number?: string;
  request_cost?: number;
  delivery_status?: { status?: string; updated_at?: number };
  verification_status?: {
    status?: string;
    updated_at?: number;
    code_entered?: string;
  };
};

async function gatewayCall<T>(
  method: string,
  params: Record<string, string | number | undefined>,
): Promise<GatewayOk<T> | GatewayErr> {
  const token = gatewayToken();
  if (!token) return { ok: false, error: "TELEGRAM_GATEWAY_TOKEN sozlanmagan" };

  const body: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") body[k] = v;
  }

  try {
    const res = await fetch(`${GATEWAY_BASE}/${method}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      result?: T;
      error?: string;
    };
    if (!data.ok) {
      return { ok: false, error: String(data.error || `Gateway HTTP ${res.status}`) };
    }
    return { ok: true, result: data.result as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gateway ulanmadi" };
  }
}

/** E.164: +998901234567 */
export function toE164Plus(phoneDigits998: string): string {
  const d = String(phoneDigits998 || "").replace(/\D/g, "");
  return d.startsWith("+") ? d : `+${d}`;
}

/**
 * Telegram akkauntiga (shu raqam bilan ochilgan) tasdiqlash kodi yuboradi.
 * Kodni o‘zimiz beramiz — keyin checkVerificationStatus bilan tasdiqlaymiz.
 */
export async function sendTelegramVerificationCode(opts: {
  phoneE164Digits: string;
  code: string;
  ttlSec?: number;
}): Promise<{ ok: true; requestId: string } | { ok: false; error: string }> {
  const phone = toE164Plus(opts.phoneE164Digits);
  const code = String(opts.code || "").replace(/\D/g, "");
  if (code.length < 4 || code.length > 8) {
    return { ok: false, error: "Kod 4–8 raqam bo‘lishi kerak" };
  }

  const sent = await gatewayCall<RequestStatus>("sendVerificationMessage", {
    phone_number: phone,
    code,
    ttl: opts.ttlSec ?? 600,
    payload: "proopex-trial",
  });
  if (!sent.ok) {
    const err = sent.error;
    if (/PHONE_NUMBER_NOT_FOUND|PHONE_NUMBER_INVALID|FLOOD|BALANCE/i.test(err)) {
      return {
        ok: false,
        error:
          /NOT_FOUND/i.test(err)
            ? "Bu raqam Telegramda topilmadi — Telegram akkauntingizdagi raqamni kiriting"
            : /BALANCE|PAYMENT/i.test(err)
              ? "Telegram Gateway balansi yetarli emas"
              : /FLOOD/i.test(err)
                ? "Juda ko‘p urinish — birozdan keyin qayta urinib ko‘ring"
                : `Telegram kod yuborilmadi: ${err}`,
      };
    }
    return { ok: false, error: `Telegram kod yuborilmadi: ${err}` };
  }
  const requestId = String(sent.result?.request_id || "").trim();
  if (!requestId) return { ok: false, error: "Telegram request_id yo‘q" };
  return { ok: true, requestId };
}

/** Foydalanuvchi kiritgan kodni Telegram Gateway orqali tekshiradi */
export async function checkTelegramVerificationCode(opts: {
  requestId: string;
  code: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const checked = await gatewayCall<RequestStatus>("checkVerificationStatus", {
    request_id: opts.requestId,
    code: String(opts.code || "").replace(/\D/g, ""),
  });
  if (!checked.ok) {
    return { ok: false, error: checked.error || "Kod tekshirilmadi" };
  }
  const status = String(checked.result?.verification_status?.status || "");
  if (status === "code_valid") return { ok: true };
  if (status === "code_invalid") return { ok: false, error: "Tasdiqlash kodi noto‘g‘ri" };
  if (status === "code_max_attempts_exceeded") {
    return { ok: false, error: "Urinishlar limiti — qayta kod oling" };
  }
  if (status === "expired") {
    return { ok: false, error: "Kod muddati tugagan — qayta yuboring" };
  }
  // Ba’zan status kechikadi — lokal hash ham tekshiriladi
  return { ok: false, error: status ? `Kod holati: ${status}` : "Kod tasdiqlanmadi" };
}
