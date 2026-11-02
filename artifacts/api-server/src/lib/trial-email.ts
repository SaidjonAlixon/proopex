/**
 * Trial Gmail tasdiqlash xati — SMTP / Resend / Gmail API.
 */
import { sendSmtpMail } from "./smtp-send";

function toBase64Url(raw: string) {
  return Buffer.from(raw, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function buildTrialVerifyEmail(opts: {
  to: string;
  code: string;
  verifyLink: string;
}) {
  const subject = "PROOPEX — Gmail tasdiqlash kodi";
  const text = [
    "PROOPEX ro‘yxatdan o‘tish",
    "",
    `Tasdiqlash kodingiz: ${opts.code}`,
    "",
    "Yoki shu havolani bosing (10 daqiqa amal qiladi):",
    opts.verifyLink,
    "",
    "Agar bu siz bo‘lmasangiz — xabarni e’tiborsiz qoldiring.",
  ].join("\n");
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 12px;color:#2563eb">PROOPEX — tasdiqlash</h2>
      <p style="margin:0 0 16px">Ro‘yxatdan o‘tishni yakunlash uchun kodni kiriting yoki havolani bosing.</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:0.2em;margin:0 0 20px">${opts.code}</p>
      <p style="margin:0 0 8px"><a href="${opts.verifyLink}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600">Havola orqali tasdiqlash</a></p>
      <p style="font-size:12px;color:#64748b;word-break:break-all">${opts.verifyLink}</p>
      <p style="font-size:12px;color:#94a3b8;margin-top:20px">Havola 10 daqiqa amal qiladi.</p>
    </div>
  `.trim();
  return { subject, text, html };
}

/** Foydalanuvchi Google access tokeni orqali o‘z Gmailiga yuboradi */
export async function sendViaGmailApi(opts: {
  accessToken: string;
  to: string;
  code: string;
  verifyLink: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { subject, text, html } = buildTrialVerifyEmail(opts);
  const mime = [
    `To: ${opts.to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="proopex_boundary"',
    "",
    "--proopex_boundary",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    text,
    "",
    "--proopex_boundary",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
    "",
    "--proopex_boundary--",
  ].join("\r\n");

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: toBase64Url(mime) }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: body.slice(0, 280) || `Gmail API ${res.status}` };
  }
  return { ok: true };
}

export async function sendViaResend(opts: {
  to: string;
  code: string;
  verifyLink: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = String(process.env.RESEND_API_KEY || "").trim();
  if (!key) return { ok: false, error: "RESEND_API_KEY yo‘q" };
  const from = String(process.env.RESEND_FROM || "PROOPEX <onboarding@resend.dev>").trim();
  const { subject, html, text } = buildTrialVerifyEmail(opts);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [opts.to], subject, html, text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: body.slice(0, 280) || `Resend ${res.status}` };
  }
  return { ok: true };
}

/** Gmail SMTP (App Password) — haqiqiy xat istalgan Gmailga */
export function isSmtpConfigured() {
  const user = String(process.env.SMTP_USER || process.env.GMAIL_SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || process.env.GMAIL_SMTP_PASS || "").trim().replace(/\s+/g, "");
  return Boolean(user && pass);
}

export async function sendViaSmtp(opts: {
  to: string;
  code: string;
  verifyLink: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = String(process.env.SMTP_USER || process.env.GMAIL_SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || process.env.GMAIL_SMTP_PASS || "").trim().replace(/\s+/g, "");
  if (!user || !pass) return { ok: false, error: "SMTP_USER / SMTP_PASS yo‘q" };

  const host = String(process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const fromName = String(process.env.SMTP_FROM_NAME || "PROOPEX").trim() || "PROOPEX";
  const { subject, html, text } = buildTrialVerifyEmail(opts);

  try {
    await sendSmtpMail({
      host,
      port,
      user,
      pass,
      from: `"${fromName}" <${user}>`,
      to: opts.to,
      subject,
      text,
      html,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function sendTrialVerifyEmail(opts: {
  to: string;
  code: string;
  verifyLink: string;
  accessToken?: string;
}): Promise<{ ok: true; via: string } | { ok: false; error: string }> {
  if (isSmtpConfigured()) {
    const s = await sendViaSmtp(opts);
    if (s.ok) return { ok: true, via: "smtp" };
    console.warn("[trial-email] smtp:", s.error);
    return { ok: false, error: s.error };
  }
  if (String(process.env.RESEND_API_KEY || "").trim()) {
    const r = await sendViaResend(opts);
    if (r.ok) return { ok: true, via: "resend" };
    console.warn("[trial-email] resend:", r.error);
  }
  if (opts.accessToken) {
    const g = await sendViaGmailApi({ ...opts, accessToken: opts.accessToken });
    if (g.ok) return { ok: true, via: "gmail-api" };
    console.warn("[trial-email] gmail-api:", g.error);
    return { ok: false, error: g.error };
  }
  return { ok: false, error: "Email yuborish sozlanmagan (SMTP_PASS / Resend)" };
}
