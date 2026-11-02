// pm2 start deploy/ecosystem.config.cjs
// Faqat BITTA nusxa: fon ishlari (eslatmalar, davomat, eskalatsiya) jarayon ichida setInterval bilan
// ishlaydi — 2+ nusxa bo‘lsa har bildirishnoma ikki marta ketadi. cluster / instances>1 qo‘ymang.
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function loadDotEnv(filePath) {
  const out = {};
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i <= 0) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      out[key] = val;
    }
  } catch {
    /* .env optional at parse time */
  }
  return out;
}

const fileEnv = loadDotEnv(path.join(root, ".env"));

module.exports = {
  apps: [
    {
      name: "hr-api",
      cwd: path.join(root, "artifacts/api-server"),
      script: "dist/index.mjs",
      // Serverda IPv6 marshruti yo‘q: ipv4first + uzunroq kutish bo‘lmasa yuklama paytida Telegramga ulanish ETIMEDOUT bo‘ladi
      node_args:
        "--enable-source-maps --max-old-space-size=2048 --dns-result-order=ipv4first --network-family-autoselection-attempt-timeout=1000",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_restarts: 20,
      min_uptime: "10s",
      restart_delay: 3000,
      max_memory_restart: "3200M",
      kill_timeout: 10000,
      time: true,
      env: {
        ...fileEnv,
        NODE_ENV: "production",
        PORT: "8080",
        TZ: "Asia/Tashkent",
        // Gmail verify / Telegram deep-link — doim real domen
        PUBLIC_APP_URL: fileEnv.PUBLIC_APP_URL || "https://proopex.uz",
      },
    },
  ],
};
