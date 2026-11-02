import { Router, type IRouter } from "express";
import { db, usersTable, departmentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { setSessionCookie } from "../lib/session";
import { clientIp } from "../lib/device-security";
import {
  consumeChallenge,
  createGoogleEmailChallenge,
  createPhoneChallenge,
  createTelegramChallenge,
  createTelegramUsernameChallenge,
  createTelegramVerifiedChallenge,
  findUserByTrialTarget,
  formatUzPhoneDisplay,
  getChallenge,
  makeOtpCode,
  maskTelegramTarget,
  normalizeGmail,
  normalizeTelegramUsername,
  normalizeUzPhone,
  publicAppOrigin,
  shouldExposeDevCode,
  telegramUsernameTarget,
  verifyChallengeCode,
  verifyChallengeLinkToken,
  verifyGoogleAccessToken,
  verifyGoogleIdToken,
} from "../lib/trial-auth";
import {
  buildTrialOtpSms,
  ESKIZ_TEST_SMS_TEXT,
  isEskizConfigured,
  isEskizTestMode,
  isEskizTestTextError,
  sendEskizSms,
} from "../lib/eskiz-sms";
import { sendTrialVerifyEmail } from "../lib/trial-email";
import {
  isForbiddenTelegramBot,
  isTelegramConfigured,
  resolveProopexBotUsername,
  verifyTelegramLoginWidget,
} from "../lib/telegram";
import {
  checkTelegramVerificationCode,
  isTelegramGatewayConfigured,
  sendTelegramVerificationCode,
} from "../lib/telegram-gateway";

const router: IRouter = Router();

async function getUserWithDept(userId: number) {
  const [user] = await db
    .select({
      id: usersTable.id,
      fullName: usersTable.fullName,
      role: usersTable.role,
      departmentId: usersTable.departmentId,
      departmentName: departmentsTable.name,
      login: usersTable.login,
      phone: usersTable.phone,
      status: usersTable.status,
      deviceSecurityEnforced: usersTable.deviceSecurityEnforced,
      assignedViloyat: usersTable.assignedViloyat,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .leftJoin(departmentsTable, eq(usersTable.departmentId, departmentsTable.id))
    .where(eq(usersTable.id, userId));
  return user ?? null;
}

/**
 * Rasmiy Telegram akkauntini bog‘lash:
 * Telegramda ochilgan telefon raqami → kod Telegram ilovasiga keladi → platformaga bog‘lanadi.
 */
router.post("/auth/trial/telegram/claim", async (req, res): Promise<void> => {
  try {
    const usernameRaw = String(req.body?.username || "").trim();
    const username = usernameRaw ? normalizeTelegramUsername(usernameRaw) : null;
    if (usernameRaw && !username) {
      res.status(400).json({
        error: "Telegram username noto‘g‘ri. Masalan: @ism_familiya (ixtiyoriy)",
      });
      return;
    }

    const phone = normalizeUzPhone(String(req.body?.phone || ""));
    if (!phone) {
      res.status(400).json({
        error: "Telegram akkauntingiz ochilgan raqamni kiriting (+998 …)",
      });
      return;
    }

    if (!isTelegramGatewayConfigured()) {
      res.status(503).json({
        error:
          "Telegram tasdiqlash sozlanmagan. gateway.telegram.org dan TELEGRAM_GATEWAY_TOKEN qo‘ying.",
      });
      return;
    }

    try {
      if (username) {
        const byTg = await findUserByTrialTarget("telegram", telegramUsernameTarget(username));
        if (byTg) {
          res.status(409).json({ error: "Bu Telegram allaqachon ro‘yxatdan o‘tgan — Kirishga o‘ting" });
          return;
        }
      }
      const byPhoneTg = await findUserByTrialTarget("telegram", `p:${phone}`);
      if (byPhoneTg) {
        res.status(409).json({ error: "Bu Telegram raqami allaqachon ro‘yxatdan o‘tgan — Kirishga o‘ting" });
        return;
      }
      const byPhone = await findUserByTrialTarget("phone", phone);
      if (byPhone) {
        res.status(409).json({ error: "Bu raqam allaqachon ro‘yxatdan o‘tgan — Kirishga o‘ting" });
        return;
      }
    } catch (dbErr) {
      console.error("[trial-tg] claim db:", dbErr);
      res.status(503).json({ error: "Baza bilan aloqa yo‘q — birozdan keyin qayta urinib ko‘ring" });
      return;
    }

    const code = makeOtpCode();
    const sent = await sendTelegramVerificationCode({ phoneE164Digits: phone, code, ttlSec: 600 });
    if (!sent.ok) {
      console.error("[trial-tg] gateway send:", sent.error);
      res.status(503).json({ error: sent.error });
      return;
    }

    const challengeId = createTelegramUsernameChallenge({
      username,
      phone,
      code,
      gatewayRequestId: sent.requestId,
    });
    console.info(
      `[trial-tg] claim phone=${phone} @${username || "—"} gateway=${sent.requestId.slice(0, 8)}…`,
    );

    const phoneMasked = formatUzPhoneDisplay(phone).replace(
      /(\d{2}) (\d{3}) (\d{2}) (\d{2})$/,
      "$1 *** ** $4",
    );
    res.json({
      challengeId,
      method: "telegram",
      verified: false,
      targetMasked: username ? `@${username}` : phoneMasked,
      phoneMasked,
      via: "telegram",
      expiresInSec: 600,
      ...(shouldExposeDevCode() ? { devCode: code } : {}),
      message: "Kod Telegramga yuborildi — ilovadagi xabarni ochib kodni kiriting",
    });
  } catch (err) {
    console.error("[trial-tg] claim:", err);
    res.status(503).json({ error: "Telegram ulanmadi — qayta urinib ko‘ring" });
  }
});

/** Telegram Login Widget — akkauntni ulash (faqat PROOPEX boti) */
router.post("/auth/trial/telegram/link", async (req, res): Promise<void> => {
  try {
    const botUsername = await resolveProopexBotUsername();
    if (!isTelegramConfigured() || !botUsername) {
      res.status(503).json({
        error: "Telegram PROOPEX boti sozlanmagan.",
      });
      return;
    }

    const body = (req.body || {}) as Record<string, unknown>;
    const verified = verifyTelegramLoginWidget({
      id: body.id,
      first_name: body.first_name,
      last_name: body.last_name,
      username: body.username,
      photo_url: body.photo_url,
      auth_date: body.auth_date,
      hash: body.hash,
    });
    if (!verified.ok) {
      res.status(400).json({ error: verified.error });
      return;
    }

    const existing = await findUserByTrialTarget("telegram", String(verified.user.id));
    if (existing) {
      res.status(409).json({ error: "Bu Telegram allaqachon ro‘yxatdan o‘tgan — Kirishga o‘ting" });
      return;
    }

    const challengeId = createTelegramVerifiedChallenge({
      id: verified.user.id,
      username: verified.user.username,
      firstName: verified.user.firstName,
      lastName: verified.user.lastName,
    });
    const challenge = getChallenge(challengeId)!;
    res.json({
      challengeId,
      method: "telegram",
      verified: true,
      targetMasked: maskTelegramTarget(challenge),
      fullName: challenge.telegramName || null,
      message: "Telegram ulandi — parol o‘rnating",
    });
  } catch (err) {
    console.error("[trial-tg] link:", err);
    res.status(503).json({ error: "Telegram ulanmadi — qayta urinib ko‘ring" });
  }
});

/** Eski deep-link — faqat PROOPEX boti bilan */
router.post("/auth/trial/telegram/start", async (_req, res): Promise<void> => {
  try {
    const botUsername = await resolveProopexBotUsername();
    if (!isTelegramConfigured() || !botUsername || isForbiddenTelegramBot(botUsername)) {
      res.status(503).json({
        error: "Telegram PROOPEX boti sozlanmagan.",
      });
      return;
    }

    const { id: challengeId, startToken } = createTelegramChallenge();
    const botUrl = `https://t.me/${botUsername}?start=trial_${encodeURIComponent(startToken)}`;
    res.json({
      challengeId,
      method: "telegram",
      botUsername: `@${botUsername}`,
      botUrl,
      expiresInSec: 600,
      message: "Telegram akkauntingizni ulang",
    });
  } catch (err) {
    console.error("[trial-tg] start:", err);
    res.status(503).json({ error: "Telegram sessiyasi ochilmadi" });
  }
});

/** Telegram tasdiq holati (eski poll) */
router.get("/auth/trial/telegram/status", async (req, res): Promise<void> => {
  const challengeId = String(req.query?.challengeId || "").trim();
  if (!challengeId) {
    res.status(400).json({ error: "challengeId kerak" });
    return;
  }
  const challenge = getChallenge(challengeId);
  if (!challenge || challenge.method !== "telegram") {
    res.status(400).json({ error: "Sessiya topilmadi yoki muddati tugagan" });
    return;
  }
  if (!challenge.verified || !challenge.target) {
    res.json({
      challengeId,
      verified: false,
      pending: true,
      message: "Telegram akkauntingizni ulang",
    });
    return;
  }

  try {
    const existing = await findUserByTrialTarget("telegram", challenge.target);
    if (existing) {
      consumeChallenge(challengeId);
      res.status(409).json({ error: "Bu Telegram allaqachon ro‘yxatdan o‘tgan — Kirishga o‘ting" });
      return;
    }
  } catch (err) {
    console.error("[trial-tg] status db:", err);
  }

  res.json({
    challengeId,
    verified: true,
    method: "telegram",
    targetMasked: maskTelegramTarget(challenge),
    fullName: challenge.telegramName || null,
    message: "Telegram tasdiqlandi — parol o‘rnating",
  });
});

/** Telefon OTP yuborish (eski API — UI Telegramga o‘tdi) */
router.post("/auth/trial/phone/start", async (req, res): Promise<void> => {
  try {
    const phone = normalizeUzPhone(String(req.body?.phone || ""));
    if (!phone) {
      res.status(400).json({ error: "O‘zbekiston raqamini to‘g‘ri kiriting (+998 …)" });
      return;
    }

    try {
      const existing = await findUserByTrialTarget("phone", phone);
      if (existing) {
        res.status(409).json({ error: "Bu raqam allaqachon ro‘yxatdan o‘tgan — Kirishga o‘ting" });
        return;
      }
    } catch (dbErr) {
      console.error("[trial-otp] db check failed:", dbErr);
      res.status(503).json({
        error: "Baza bilan aloqa yo‘q — birozdan keyin qayta urinib ko‘ring",
      });
      return;
    }

    const code = makeOtpCode();
    const challengeId = createPhoneChallenge(phone, code);
    console.info(`[trial-otp] phone=${phone} code=${code} eskiz=${isEskizConfigured()}`);

    let smsTestMode = isEskizTestMode();
    if (isEskizConfigured()) {
      const primaryMsg = smsTestMode ? ESKIZ_TEST_SMS_TEXT : buildTrialOtpSms(code);
      let sent = await sendEskizSms({ phoneE164: phone, message: primaryMsg });

      // Test akkaunt: faqat "Bu Eskiz dan test" o‘tadi — qayta yuboramiz
      if (!sent.ok && isEskizTestTextError(sent.error)) {
        console.warn("[trial-otp] eskiz test-mode — test matn bilan qayta yuboriladi");
        smsTestMode = true;
        sent = await sendEskizSms({ phoneE164: phone, message: ESKIZ_TEST_SMS_TEXT });
      }

      if (!sent.ok) {
        console.error("[trial-otp] eskiz failed:", sent.error);
        const credFail = /логин|пароль|password|credential|неправильно/i.test(sent.error);
        res.status(503).json({
          error: credFail
            ? "Eskiz SMS kaliti noto‘g‘ri. SMS shlyuz kabinetidan email va yashirin kalitni yangilang."
            : "SMS yuborilmadi. Birozdan keyin qayta urinib ko‘ring.",
          detail: process.env.NODE_ENV !== "production" ? sent.error : undefined,
        });
        return;
      }
    }

    const exposeCode = shouldExposeDevCode() || smsTestMode;
    res.json({
      challengeId,
      method: "phone",
      targetMasked: formatUzPhoneDisplay(phone).replace(/(\d{2}) (\d{3}) (\d{2}) (\d{2})$/, "$1 *** ** $4"),
      expiresInSec: 600,
      ...(exposeCode ? { devCode: code } : {}),
      testMode: smsTestMode || undefined,
      message: smsTestMode
        ? "SMS yuborildi (Eskiz test). Kod ekranda ko‘rsatildi."
        : isEskizConfigured()
          ? "Tasdiqlash kodi SMS orqali yuborildi"
          : "Tasdiqlash kodi yuborildi",
    });
  } catch (err) {
    console.error("[trial-otp] phone/start:", err);
    res.status(503).json({ error: "Server xatosi — qayta urinib ko‘ring" });
  }
});

function maskGmail(email: string) {
  return email.replace(/^(.{2}).+(@.+)$/, "$1***$2");
}

/** Gmail: Google token → emailga kod + havola; keyin OTP/havola */
router.post("/auth/trial/google/start", async (req, res): Promise<void> => {
  const idToken = String(req.body?.idToken || "").trim();
  const accessToken = String(req.body?.accessToken || "").trim();
  const emailRaw = String(req.body?.email || "").trim();
  // Email havolasi doim domen (PUBLIC_APP_URL / proopex.uz) — localhost emas
  const origin = publicAppOrigin(
    String(req.headers.origin || req.headers.referer || "") || null,
  );

  if (idToken || accessToken) {
    try {
      const verified = idToken
        ? await verifyGoogleIdToken(idToken)
        : await verifyGoogleAccessToken(accessToken);
      if (!verified.ok) {
        res.status(400).json({ error: verified.error });
        return;
      }
      const existing = await findUserByTrialTarget("google", verified.email);
      if (existing) {
        res.status(409).json({ error: "Bu Gmail allaqachon ro‘yxatdan o‘tgan — Kirishga o‘ting" });
        return;
      }

      const code = makeOtpCode();
      const { id: challengeId, linkToken } = createGoogleEmailChallenge(verified.email, code, {
        sub: verified.sub,
        name: verified.name,
      });
      // Emaildagi havola — real domen orqali API redirect (proopex.uz)
      const verifyLink = `${origin}/api/auth/trial/verify-link?token=${encodeURIComponent(linkToken)}`;
      console.info(`[trial-otp] gmail=${verified.email} code=${code} origin=${origin} link=${linkToken.slice(0, 8)}…`);

      // Haqiqiy xat: SMTP (Gmail App Password) yoki Resend
      const sent = await sendTrialVerifyEmail({
        to: verified.email,
        code,
        verifyLink,
      });
      if (!sent.ok) {
        console.warn("[trial-email] not sent:", sent.error);
      } else {
        console.info(`[trial-email] sent via=${sent.via} to=${verified.email}`);
      }

      res.json({
        challengeId,
        method: "google",
        verified: false,
        targetMasked: maskGmail(verified.email),
        fullName: verified.name || null,
        verifyLink,
        expiresInSec: 600,
        emailSent: sent.ok,
        // SMTP ishlamasa — kod ekranda (dev); SMTP ishlasa — faqat Gmailda
        ...(sent.ok ? {} : { devCode: code }),
        message: sent.ok
          ? "Gmailga kod va havola yuborildi — kodni kiriting yoki havolani bosing"
          : "Gmail SMTP sozlanmagan — hozircha kod ekranda. SMTP_PASS qo‘ying.",
      });
      return;
    } catch (err) {
      console.error("google/start token:", err);
      res.status(503).json({ error: "Google tekshiruvi ishlamadi" });
      return;
    }
  }

  const email = normalizeGmail(emailRaw);
  if (!email) {
    res.status(400).json({ error: "Faqat @gmail.com manzilini kiriting" });
    return;
  }

  const existing = await findUserByTrialTarget("google", email);
  if (existing) {
    res.status(409).json({ error: "Bu Gmail allaqachon ro‘yxatdan o‘tgan — Kirishga o‘ting" });
    return;
  }

  const code = makeOtpCode();
  const { id: challengeId, linkToken } = createGoogleEmailChallenge(email, code);
  const verifyLink = `${origin}/api/auth/trial/verify-link?token=${encodeURIComponent(linkToken)}`;
  console.info(`[trial-otp] gmail=${email} code=${code} origin=${origin}`);

  res.json({
    challengeId,
    method: "google",
    verified: false,
    targetMasked: maskGmail(email),
    verifyLink,
    expiresInSec: 600,
    ...(shouldExposeDevCode() ? { devCode: code } : {}),
    message: "Gmailga tasdiqlash kodi va havola yuborildi",
  });
});

/** OTP tasdiqlash (Telegram Gateway / telefon / Gmail) */
router.post("/auth/trial/verify", async (req, res): Promise<void> => {
  const challengeId = String(req.body?.challengeId || "").trim();
  const code = String(req.body?.code || "").trim();
  if (!challengeId || !code) {
    res.status(400).json({ error: "Kodni kiriting" });
    return;
  }

  const existing = getChallenge(challengeId);
  if (
    existing?.method === "telegram" &&
    existing.gatewayRequestId &&
    !existing.verified
  ) {
    const gw = await checkTelegramVerificationCode({
      requestId: existing.gatewayRequestId,
      code,
    });
    if (!gw.ok) {
      // Gateway rad etsa — lokal hash (biz yuborgan kod) bilan ham tekshiramiz
      const local = verifyChallengeCode(challengeId, code);
      if (!local.ok) {
        res.status(400).json({ error: gw.error || local.error });
        return;
      }
    } else {
      existing.verified = true;
    }
  } else {
    const result = verifyChallengeCode(challengeId, code);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
  }

  const challenge = getChallenge(challengeId);
  if (!challenge?.verified) {
    res.status(400).json({ error: "Kod tasdiqlanmadi" });
    return;
  }

  const masked =
    challenge.method === "phone"
      ? formatUzPhoneDisplay(challenge.target)
      : challenge.method === "telegram"
        ? maskTelegramTarget(challenge)
        : maskGmail(challenge.target);
  res.json({
    challengeId,
    verified: true,
    method: challenge.method,
    targetMasked: masked,
    fullName: challenge.googleName || challenge.telegramName || null,
    message: "Tasdiqlandi — parol o‘rnating",
  });
});

/** Magic link: Gmaildagi havola */
router.post("/auth/trial/verify-link", async (req, res): Promise<void> => {
  const token = String(req.body?.token || req.query?.token || "").trim();
  if (!token) {
    res.status(400).json({ error: "Havola tokeni yo‘q" });
    return;
  }
  const result = verifyChallengeLinkToken(token);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({
    challengeId: result.challenge.id,
    verified: true,
    method: result.challenge.method,
    targetMasked: maskGmail(result.challenge.target),
    fullName: result.challenge.googleName || null,
    message: "Havola orqali tasdiqlandi — parol o‘rnating",
  });
});

router.get("/auth/trial/verify-link", async (req, res): Promise<void> => {
  const token = String(req.query?.token || "").trim();
  const origin = publicAppOrigin(String(req.headers.origin || "") || null);
  if (!token) {
    res.redirect(302, `${origin}/login?mode=register&verifyError=1`);
    return;
  }
  const result = verifyChallengeLinkToken(token);
  if (!result.ok) {
    res.redirect(302, `${origin}/login?mode=register&verifyError=1`);
    return;
  }
  res.redirect(
    302,
    `${origin}/login?mode=register&verified=${encodeURIComponent(result.challenge.id)}&email=${encodeURIComponent(maskGmail(result.challenge.target))}`,
  );
});

/** Parol + akkaunt yaratish */
router.post("/auth/trial/complete", async (req, res): Promise<void> => {
  const challengeId = String(req.body?.challengeId || "").trim();
  const password = String(req.body?.password || "").replace(/[\s\u00a0\u200b\uFEFF]+/g, "");
  const fullNameIn = String(req.body?.fullName || "").trim();

  if (!challengeId) {
    res.status(400).json({ error: "Sessiya topilmadi" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Parol kamida 6 belgi bo‘lsin" });
    return;
  }

  const challenge = getChallenge(challengeId);
  if (!challenge) {
    res.status(400).json({ error: "Sessiya muddati tugagan — qaytadan boshlang" });
    return;
  }
  if (!challenge.verified) {
    res.status(400).json({ error: "Avval tasdiqlash kodini kiriting" });
    return;
  }

  const existing = await findUserByTrialTarget(challenge.method, challenge.target);
  if (existing) {
    consumeChallenge(challengeId);
    res.status(409).json({ error: "Bu akkaunt allaqachon bor — Kirishga o‘ting" });
    return;
  }

  const fullName =
    fullNameIn ||
    challenge.googleName ||
    challenge.telegramName ||
    (challenge.method === "phone"
      ? `Sinov ${formatUzPhoneDisplay(challenge.target)}`
      : challenge.method === "telegram"
        ? maskTelegramTarget(challenge)
        : challenge.target.split("@")[0]);

  const login =
    challenge.method === "telegram"
      ? challenge.telegramUsername
        ? `@${challenge.telegramUsername}`
        : challenge.phone
          ? `+${challenge.phone}`
          : `tg_${challenge.target}`
      : challenge.target;
  const phone =
    challenge.method === "phone"
      ? challenge.target
      : challenge.method === "telegram" && challenge.phone
        ? challenge.phone
        : null;
  const telegramId = challenge.method === "telegram" ? challenge.target : null;

  try {
    const [created] = await db
      .insert(usersTable)
      .values({
        fullName,
        role: "trial",
        login,
        password,
        phone,
        telegramId,
        status: "active",
      })
      .returning({ id: usersTable.id });

    consumeChallenge(challengeId);

    const ip = clientIp(req);
    const ua = String(req.headers["user-agent"] || "");
    await setSessionCookie(res, created.id, { ipAddress: ip, userAgent: ua });
    const user = await getUserWithDept(created.id);
    res.json({
      user,
      message: "7 kunlik bepul sinov ochildi",
      deviceSecurity: { enforced: false },
    });
  } catch (err) {
    console.error("trial/complete:", err);
    res.status(503).json({ error: "Akkaunt yaratilmadi — qayta urinib ko‘ring" });
  }
});

/** Google / Telegram (frontend) — botsiz Telegram doim yoqilgan */
router.get("/auth/trial/config", async (_req, res): Promise<void> => {
  const googleClientId = String(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || "").trim();
  const botUsername = await resolveProopexBotUsername();
  const botOk = Boolean(isTelegramConfigured() && botUsername && !isForbiddenTelegramBot(botUsername));
  res.json({
    googleClientId: googleClientId || null,
    phonePrefix: "+998",
    trialDays: 7,
    /** Telegram Gateway orqali raqam → Telegram ichida kod */
    telegramConfigured: true,
    telegramManual: true,
    telegramGateway: isTelegramGatewayConfigured(),
    botUsername: botOk && botUsername ? `@${botUsername}` : null,
  });
});

export default router;
