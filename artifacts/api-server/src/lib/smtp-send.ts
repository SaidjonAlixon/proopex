/**
 * Minimal SMTP over TLS (Gmail App Password). nodemailer kerak emas.
 */
import { connect as tlsConnect, type TLSSocket } from "tls";

export type SmtpMail = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

function encodeSubject(subject: string) {
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function buildMime(opts: SmtpMail) {
  const boundary = `proopex_${Date.now().toString(36)}`;
  return [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${encodeSubject(opts.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    opts.text,
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    opts.html,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

export async function sendSmtpMail(opts: SmtpMail): Promise<void> {
  const socket: TLSSocket = await new Promise((resolve, reject) => {
    const s = tlsConnect({ host: opts.host, port: opts.port, servername: opts.host }, () => resolve(s));
    s.setEncoding("utf8");
    s.on("error", reject);
  });

  let buf = "";
  const readReply = (): Promise<string> =>
    new Promise((resolve, reject) => {
      const finish = (line: string) => {
        socket.off("data", onData);
        socket.off("error", onErr);
        resolve(line);
      };
      const onErr = (e: Error) => reject(e);
      const onData = (chunk: string) => {
        buf += chunk;
        const parts = buf.split(/\r?\n/);
        // keep incomplete last chunk
        buf = parts.pop() || "";
        for (let i = 0; i < parts.length; i++) {
          const line = parts[i];
          if (/^\d{3} /.test(line)) {
            // leftover lines stay in buf for next read — prepend remaining
            buf = [...parts.slice(i + 1), buf].filter(Boolean).join("\n") + (buf && !buf.endsWith("\n") ? "" : "");
            // Actually simpler: put unused lines back
            const unused = parts.slice(i + 1);
            buf = unused.length ? `${unused.join("\n")}\n${buf}` : buf;
            finish(line);
            return;
          }
        }
      };
      socket.on("data", onData);
      socket.once("error", onErr);
      // already buffered?
      if (buf) onData("");
    });

  const cmd = async (line: string, expectCode: number) => {
    socket.write(`${line}\r\n`);
    const reply = await readReply();
    if (!reply.startsWith(String(expectCode))) {
      throw new Error(`SMTP ${expectCode} kutilgan: ${reply}`);
    }
    return reply;
  };

  try {
    const greet = await readReply();
    if (!greet.startsWith("220")) throw new Error(`SMTP greeting: ${greet}`);

    socket.write("EHLO localhost\r\n");
    // drain 250- lines until 250 space
    for (;;) {
      const line = await readReply();
      if (line.startsWith("250 ")) break;
      if (!line.startsWith("250-")) throw new Error(`EHLO: ${line}`);
    }

    await cmd("AUTH LOGIN", 334);
    await cmd(Buffer.from(opts.user, "utf8").toString("base64"), 334);
    await cmd(Buffer.from(opts.pass, "utf8").toString("base64"), 235);

    const fromAddr = opts.from.match(/<([^>]+)>/)?.[1] || opts.from;
    await cmd(`MAIL FROM:<${fromAddr}>`, 250);
    await cmd(`RCPT TO:<${opts.to}>`, 250);
    await cmd("DATA", 354);

    const mime = buildMime(opts).replace(/^\./gm, "..");
    socket.write(`${mime}\r\n.\r\n`);
    const dataReply = await readReply();
    if (!dataReply.startsWith("250")) throw new Error(`DATA: ${dataReply}`);

    socket.write("QUIT\r\n");
  } finally {
    socket.end();
  }
}
