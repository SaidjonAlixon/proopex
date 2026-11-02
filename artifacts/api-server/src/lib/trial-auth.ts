import { createHash, randomBytes, randomInt } from "crypto";
import { eq, or, sql } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

export type TrialMethod = "phone" | "google" | "telegram";

type TrialChallenge = {
  id: string;
  method: TrialMethod;
  target: string;
  codeHash: string;
  verified: boolean;
  googleSub?: string;
  googleName?: string;
  /** Magic link token (Gmail havolasi) */
  linkToken?: string;
  /** Bot /start payload (Telegram trial) */
  startToken?: string;
  telegramUsername?: string;
  telegramName?: string;
  expiresAt: number;
  attempts: number;
};

const challenges = new Map<string, TrialChallenge>();
/** linkToken → challengeId */
const linkIndex = new Map<string, string>();
/** startToken → challengeId (Telegram bot deep-link) */
const telegramStartIndex = new Map<string, string>();
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

function newId() {
  return randomBytes(18).toString("base64url");
}

function pruneExpired() {
  const now = Date.now();
  for (const [id, c] of challenges) {
    if (c.expiresAt <= now) {
      challenges.delete(id);
      if (c.linkToken) linkIndex.delete(c.linkToken);
      if (c.startToken) telegramStartIndex.delete(c.startToken);
    }
  }
}

export function normalizeUzPhone(raw: string): string | null {
  const digits = String(raw || "").replace(/\D/g, "");
  let n = digits;
  if (n.startsWith("998") && n.length === 12) {
    /* ok */
  } else if (n.startsWith("0") && n.length === 10) {
    n = `998${n.slice(1)}`;
  } else if (n.length === 9) {
    n = `998${n}`;
  } else {
    return null;
  }
  if (!/^998(33|55|77|88|90|91|93|94|95|97|98|99)\d{7}$/.test(n)) return null;
  return n;
}

export function formatUzPhoneDisplay(e164Digits: string) {
  const d = e164Digits.replace(/\D/g, "");
  if (d.length !== 12) return `+${d}`;
  return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
}

export function normalizeGmail(raw: string): string | null {
  const email = String(raw || "").trim().toLowerCase();
  if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(email)) return null;
  return email;
}

export function makeOtpCode() {
  return String(randomInt(100000, 999999));
}

export function createPhoneChallenge(phone: string, code: string) {
  pruneExpired();
  const id = newId();
  challenges.set(id, {
    id,
    method: "phone",
    target: phone,
    codeHash: hashCode(code),
    verified: false,
    expiresAt: Date.now() + CODE_TTL_MS,
    attempts: 0,
  });
  return id;
}

/** Telegram bot deep-link: saytda challenge yaratiladi, botda /start trial_<token> bilan tasdiqlanadi */
export function createTelegramChallenge() {
  pruneExpired();
  const id = newId();
  const startToken = newId().slice(0, 24);
  challenges.set(id, {
    id,
    method: "telegram",
    target: "",
    codeHash: hashCode(startToken),
    verified: false,
    startToken,
    expiresAt: Date.now() + CODE_TTL_MS,
    attempts: 0,
  });
  telegramStartIndex.set(startToken, id);
  return { id, startToken };
}

export function confirmTelegramChallenge(
  startToken: string,
  tg: { id: number | string; username?: string; firstName?: string; lastName?: string },
): { ok: true; challenge: TrialChallenge } | { ok: false; error: string } {
  pruneExpired();
  const token = String(startToken || "").trim();
  if (!token) return { ok: false, error: "Token yo‘q" };
  const id = telegramStartIndex.get(token);
  if (!id) return { ok: false, error: "Havola yaroqsiz yoki muddati tugagan" };
  const c = getChallenge(id);
  if (!c || c.method !== "telegram") {
    telegramStartIndex.delete(token);
    return { ok: false, error: "Havola muddati tugagan — saytdan qayta boshlang" };
  }
  const tgId = String(tg.id || "").trim();
  if (!tgId) return { ok: false, error: "Telegram foydalanuvchi topilmadi" };
  const name = [tg.firstName, tg.lastName].filter(Boolean).join(" ").trim();
  c.target = tgId;
  c.telegramUsername = tg.username ? String(tg.username).replace(/^@/, "") : undefined;
  c.telegramName = name || undefined;
  c.verified = true;
  return { ok: true, challenge: c };
}

export function maskTelegramTarget(c: Pick<TrialChallenge, "telegramUsername" | "telegramName" | "target">) {
  if (c.telegramUsername) return `@${c.telegramUsername}`;
  if (c.telegramName) return c.telegramName;
  if (c.target) return `Telegram ···${String(c.target).slice(-4)}`;
  return "Telegram";
}

export function createGoogleEmailChallenge(
  email: string,
  code: string,
  opts?: { sub?: string; name?: string },
) {
  pruneExpired();
  const id = newId();
  const linkToken = newId();
  challenges.set(id, {
    id,
    method: "google",
    target: email,
    codeHash: hashCode(code),
    verified: false,
    googleSub: opts?.sub,
    googleName: opts?.name,
    linkToken,
    expiresAt: Date.now() + CODE_TTL_MS,
    attempts: 0,
  });
  linkIndex.set(linkToken, id);
  return { id, linkToken };
}

/** @deprecated — endi Google ham OTP/havola talab qiladi */
export function createGoogleVerifiedChallenge(opts: {
  email: string;
  sub: string;
  name?: string;
}) {
  const code = makeOtpCode();
  const { id } = createGoogleEmailChallenge(opts.email, code, {
    sub: opts.sub,
    name: opts.name,
  });
  const c = challenges.get(id);
  if (c) c.verified = true;
  return id;
}

export function verifyChallengeLinkToken(
  linkToken: string,
): { ok: true; challenge: TrialChallenge } | { ok: false; error: string } {
  pruneExpired();
  const id = linkIndex.get(String(linkToken || "").trim());
  if (!id) return { ok: false, error: "Havola yaroqsiz yoki muddati tugagan" };
  const c = getChallenge(id);
  if (!c) {
    linkIndex.delete(linkToken);
    return { ok: false, error: "Havola muddati tugagan — qayta kod oling" };
  }
  c.verified = true;
  return { ok: true, challenge: c };
}

export function getChallenge(id: string) {
  pruneExpired();
  const c = challenges.get(id);
  if (!c) return null;
  if (c.expiresAt <= Date.now()) {
    challenges.delete(id);
    return null;
  }
  return c;
}

export function verifyChallengeCode(id: string, code: string): { ok: true; challenge: TrialChallenge } | { ok: false; error: string } {
  const c = getChallenge(id);
  if (!c) return { ok: false, error: "Kod muddati tugagan — qayta yuboring" };
  if (c.verified) return { ok: true, challenge: c };
  c.attempts += 1;
  if (c.attempts > MAX_ATTEMPTS) {
    challenges.delete(id);
    return { ok: false, error: "Urinishlar limiti — qayta kod oling" };
  }
  if (hashCode(String(code || "").trim()) !== c.codeHash) {
    return { ok: false, error: "Tasdiqlash kodi noto‘g‘ri" };
  }
  c.verified = true;
  return { ok: true, challenge: c };
}

export function consumeChallenge(id: string) {
  const c = getChallenge(id);
  if (!c) return null;
  challenges.delete(id);
  if (c.linkToken) linkIndex.delete(c.linkToken);
  if (c.startToken) telegramStartIndex.delete(c.startToken);
  return c;
}

function isLocalOrigin(url: string) {
  try {
    const u = new URL(url);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "[::1]";
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

/**
 * Email/Telegram havolalari uchun — avvalo PUBLIC_APP_URL (proopex.uz).
 * Localhost origin emailga tushmasin.
 */
export function publicAppOrigin(reqOrigin?: string | null) {
  const fromEnv = String(process.env.PUBLIC_APP_URL || "").trim().replace(/\/$/, "");
  const fromReq = String(reqOrigin || "").trim().replace(/\/$/, "");

  if (fromEnv && /^https?:\/\//i.test(fromEnv) && !isLocalOrigin(fromEnv)) {
    return fromEnv;
  }
  if (fromReq && /^https?:\/\//i.test(fromReq) && !isLocalOrigin(fromReq)) {
    return fromReq;
  }
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) return fromEnv;
  if (fromReq && /^https?:\/\//i.test(fromReq)) return fromReq;
  return "https://proopex.uz";
}

export async function findUserByTrialTarget(method: TrialMethod, target: string) {
  if (method === "phone") {
    const [byPhone] = await db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.phone, target), eq(usersTable.login, target), eq(usersTable.login, `+${target}`)))
      .limit(1);
    if (byPhone) return byPhone;
  }
  if (method === "telegram") {
    const tgId = String(target || "").trim();
    if (!tgId) return null;
    const [byTg] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.telegramId, tgId))
      .limit(1);
    if (byTg) return byTg;
    const loginCandidates = [`tg_${tgId}`, `@${tgId}`];
    const [byLoginTg] = await db
      .select()
      .from(usersTable)
      .where(
        or(
          eq(usersTable.login, loginCandidates[0]!),
          sql`lower(${usersTable.login}) = lower(${loginCandidates[1]!})`,
        ),
      )
      .limit(1);
    if (byLoginTg) return byLoginTg;
    return null;
  }
  const [byLogin] = await db
    .select()
    .from(usersTable)
    .where(sql`lower(${usersTable.login}) = lower(${target})`)
    .limit(1);
  return byLogin ?? null;
}

type GoogleIdentity = {
  ok: true;
  email: string;
  sub: string;
  name?: string;
};

function parseGoogleIdentity(data: {
  email?: string;
  email_verified?: string | boolean;
  sub?: string;
  name?: string;
  aud?: string;
}): GoogleIdentity | { ok: false; error: string } {
  const email = normalizeGmail(data.email || "");
  if (!email) return { ok: false, error: "Faqat Gmail akkaunt qabul qilinadi" };
  const verified = data.email_verified === true || data.email_verified === "true";
  if (!verified) return { ok: false, error: "Gmail tasdiqlanmagan" };
  if (!data.sub) return { ok: false, error: "Google sub yo‘q" };
  return {
    ok: true,
    email,
    sub: data.sub,
    name: String(data.name || "").trim() || undefined,
  };
}

export async function verifyGoogleIdToken(idToken: string) {
  const clientId = String(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || "").trim();
  if (!clientId) {
    return { ok: false as const, error: "Google kirish sozlanmagan (GOOGLE_CLIENT_ID)" };
  }
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  const res = await fetch(url);
  if (!res.ok) return { ok: false as const, error: "Google token yaroqsiz" };
  const data = (await res.json()) as {
    aud?: string;
    email?: string;
    email_verified?: string | boolean;
    sub?: string;
    name?: string;
  };
  if (data.aud !== clientId) return { ok: false as const, error: "Google client mos emas" };
  return parseGoogleIdentity(data);
}

/** OAuth access_token orqali (akkaunt tanlash oynasi) */
export async function verifyGoogleAccessToken(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return { ok: false as const, error: "Google akkaunt o‘qilmadi" };
  const data = (await res.json()) as {
    email?: string;
    email_verified?: string | boolean;
    sub?: string;
    name?: string;
  };
  return parseGoogleIdentity({
    ...data,
    email_verified: data.email_verified ?? true,
  });
}

export function shouldExposeDevCode() {
  // SMS/email gateway ulanmaguncha kodni UI da ko‘rsatamiz (test uchun)
  if (process.env.TRIAL_AUTH_DEV_CODE === "0") return false;
  if (process.env.TRIAL_AUTH_DEV_CODE === "1") return true;
  if (
    process.env.SMS_PROVIDER ||
    process.env.SMTP_URL ||
    process.env.SMTP_PASS ||
    process.env.GMAIL_SMTP_PASS ||
    process.env.RESEND_API_KEY ||
    process.env.ESKIZ_EMAIL ||
    process.env.ESKIZ_PASSWORD
  ) {
    return false;
  }
  return true;
}
