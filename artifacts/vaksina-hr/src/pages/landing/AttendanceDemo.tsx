import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, MapPin, ScanFace, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

type Scene =
  | 'approach'
  | 'gps-ok'
  | 'scan'
  | 'success'
  | 'wink-scan'
  | 'fail-wink'
  | 'grimace-scan'
  | 'fail-face'
  | 'fail-gps';

type FaceExpr = 'normal' | 'wink' | 'grimace' | 'stranger';

const SCENES: { id: Scene; ms: number }[] = [
  { id: 'approach', ms: 1300 },
  { id: 'gps-ok', ms: 1500 },
  { id: 'scan', ms: 2000 },
  { id: 'success', ms: 2500 },
  { id: 'wink-scan', ms: 2000 },
  { id: 'fail-wink', ms: 2400 },
  { id: 'grimace-scan', ms: 2000 },
  { id: 'fail-face', ms: 2400 },
  { id: 'fail-gps', ms: 2400 },
];

const LABEL: Record<
  Scene,
  { title: string; sub: string; tone: 'neutral' | 'ok' | 'bad' | 'scan' }
> = {
  approach: {
    title: 'Kameraga qarang',
    sub: 'Yuz ochiq, ikkala ko‘z ko‘rinsin',
    tone: 'neutral',
  },
  'gps-ok': {
    title: 'Yashil hududda',
    sub: 'GPS ruxsat — yuz tekshiruvi boshlanadi',
    tone: 'ok',
  },
  scan: {
    title: 'Yuz tekshirilmoqda',
    sub: 'Nuqtalar solishtirilmoqda…',
    tone: 'scan',
  },
  success: {
    title: 'Tanildi · Kelish',
    sub: 'Dilshod K. — 09:02 · davomat belgilandi',
    tone: 'ok',
  },
  'wink-scan': {
    title: 'Tekshirilmoqda…',
    sub: 'Bir ko‘z yumilgan — mos kelmasligi mumkin',
    tone: 'scan',
  },
  'fail-wink': {
    title: 'Tanilmadi',
    sub: 'Bir ko‘z yumilgan — Face ID rad etdi',
    tone: 'bad',
  },
  'grimace-scan': {
    title: 'Tekshirilmoqda…',
    sub: 'Boshqacha qiyofa — solishtirilmoqda',
    tone: 'scan',
  },
  'fail-face': {
    title: 'Tanilmadi',
    sub: 'Boshqacha qiyofa — Face ID rad etdi',
    tone: 'bad',
  },
  'fail-gps': {
    title: 'Hududdan tashqarida',
    sub: 'Yashil hududda emas — belgilash yo‘q',
    tone: 'bad',
  },
};

function sceneFace(scene: Scene): FaceExpr {
  if (scene === 'wink-scan' || scene === 'fail-wink') return 'wink';
  if (scene === 'grimace-scan' || scene === 'fail-face') return 'grimace';
  return 'normal';
}

/** Xodim yuzi — normal / ko‘z yumiq / boshqacha qiyofa */
function EmployeeFace({ expr }: { expr: FaceExpr }) {
  const isStranger = expr === 'stranger';
  const skin = isStranger ? '#c4a484' : '#e8b896';
  const hair = isStranger ? '#4a3728' : '#2c1810';
  const lip = expr === 'grimace' ? '#a85a4a' : isStranger ? '#a87868' : '#c47a6a';
  const shirt = isStranger ? '#4b5563' : '#1e3a5f';

  return (
    <svg className="landing-att-face-svg" viewBox="0 0 160 200" aria-hidden>
      <defs>
        <radialGradient id={`attSkin-${expr}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f3d0b5" />
          <stop offset="55%" stopColor={skin} />
          <stop offset="100%" stopColor="#c9956f" />
        </radialGradient>
        <linearGradient id={`attHair-${expr}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hair} />
          <stop offset="100%" stopColor="#1a0f0a" />
        </linearGradient>
      </defs>

      <rect width="160" height="200" fill="#0f172a" opacity="0.12" />
      <ellipse cx="80" cy="72" rx="52" ry="58" fill={`url(#attHair-${expr})`} />
      <ellipse cx="32" cy="105" rx="9" ry="14" fill={skin} />
      <ellipse cx="128" cy="105" rx="9" ry="14" fill={skin} />
      <ellipse cx="80" cy="108" rx="46" ry="58" fill={`url(#attSkin-${expr})`} />
      <path
        d="M34 88c8-36 28-52 46-54 18 2 38 18 46 54-10-18-26-28-46-28s-36 10-46 28z"
        fill={`url(#attHair-${expr})`}
      />

      {/* Qosh — grimace da chimirilgan */}
      <path
        d={
          expr === 'grimace'
            ? 'M48 96c10-2 20 2 26 6M86 102c8-4 18-8 26-6'
            : 'M48 92c8-6 18-8 26-4M86 88c8-4 18-2 26 4'
        }
        fill="none"
        stroke={hair}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Chap ko‘z */}
      {expr === 'wink' ? (
        <path
          d="M52 108c6 4 14 4 20 0"
          fill="none"
          stroke="#3b2f2a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse
            cx="62"
            cy={expr === 'grimace' ? 110 : 108}
            rx="8"
            ry={expr === 'grimace' ? 3.5 : 5.5}
            fill="#fff"
          />
          <circle cx="63" cy={expr === 'grimace' ? 110 : 108} r="3.4" fill="#3b2f2a" />
          <circle cx="64.2" cy={expr === 'grimace' ? 108.8 : 106.8} r="1.1" fill="#fff" />
        </>
      )}

      {/* O‘ng ko‘z */}
      <ellipse
        cx="98"
        cy={expr === 'grimace' ? 110 : 108}
        rx="8"
        ry={expr === 'grimace' ? 3.5 : 5.5}
        fill="#fff"
      />
      <circle cx="99" cy={expr === 'grimace' ? 110 : 108} r="3.4" fill="#3b2f2a" />
      <circle cx="100.2" cy={expr === 'grimace' ? 108.8 : 106.8} r="1.1" fill="#fff" />

      {/* Burun */}
      <path
        d="M80 108c2 8 4 14 0 18"
        fill="none"
        stroke="#b8886a"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M74 126c4 3 8 3 12 0"
        fill="none"
        stroke="#b8886a"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Og‘iz */}
      {expr === 'grimace' ? (
        <path
          d="M66 148c4-6 24-6 28 0"
          fill="none"
          stroke={lip}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : expr === 'wink' ? (
        <path
          d="M68 144c5 3 19 3 24 0"
          fill="none"
          stroke={lip}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M66 142c6 8 22 8 28 0"
          fill="none"
          stroke={lip}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      <ellipse cx="80" cy="158" rx="18" ry="6" fill="#000" opacity="0.06" />
      <path d="M55 162c4 10 10 16 25 16s21-6 25-16" fill={skin} opacity="0.9" />
      <path d="M20 200c10-22 28-32 60-32s50 10 60 32" fill={shirt} />
    </svg>
  );
}

/** Real davomat: Face ID o‘tadi / ko‘z yumiq / boshqacha qiyofa / hudud xatosi */
export function AttendanceDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const scene = reduce ? 'success' : SCENES[step % SCENES.length].id;
  const meta = LABEL[scene];
  const expr = sceneFace(scene);

  useEffect(() => {
    if (reduce) return;
    const ms = SCENES[step % SCENES.length].ms;
    const t = window.setTimeout(() => setStep((s) => s + 1), ms);
    return () => clearTimeout(t);
  }, [reduce, step]);

  const outside = scene === 'fail-gps';
  const faceBad = scene === 'fail-wink' || scene === 'fail-face';
  const scanning =
    scene === 'scan' || scene === 'wink-scan' || scene === 'grimace-scan';
  const success = scene === 'success';
  const showWinkChip = scene === 'wink-scan' || scene === 'fail-wink';
  const showGrimChip = scene === 'grimace-scan' || scene === 'fail-face';
  const active =
    scanning || success || faceBad || scene === 'gps-ok' || scene === 'approach';

  return (
    <div className="landing-att" aria-label="Davomat jarayoni animatsiyasi">
      <div className="landing-att-stage">
        <div className={cn('landing-att-map', outside && 'landing-att-map--out')}>
          <div className="landing-att-zone" aria-hidden />
          <motion.div
            className="landing-att-pin"
            animate={
              reduce
                ? undefined
                : {
                    left: outside ? '82%' : '48%',
                    top: outside ? '72%' : '48%',
                  }
            }
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <MapPin className="h-4 w-4" />
          </motion.div>
          <span className="landing-att-map-label">
            {outside ? 'Tashqarida' : 'Yashil hudud (~50 m)'}
          </span>
        </div>

        <div className="landing-att-person-wrap">
          <div
            className={cn(
              'landing-att-phone-frame',
              success && 'landing-att-phone-frame--ok',
              faceBad && 'landing-att-phone-frame--bad',
              outside && 'landing-att-phone-frame--dim',
            )}
          >
            <div className="landing-att-phone-notch" />
            <div className="landing-att-cam">
              <AnimatePresence mode="wait">
                <motion.div
                  key={expr + (outside ? '-out' : '')}
                  className="landing-att-face-layer"
                  initial={reduce ? false : { opacity: 0.35, scale: 0.97 }}
                  animate={{ opacity: outside ? 0.45 : 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35 }}
                >
                  <EmployeeFace expr={expr} />
                </motion.div>
              </AnimatePresence>

              {active && !outside ? (
                <div
                  className={cn(
                    'landing-att-brackets',
                    scanning && 'landing-att-brackets--scan',
                    success && 'landing-att-brackets--ok',
                    faceBad && 'landing-att-brackets--bad',
                  )}
                >
                  <i /><i /><i /><i />
                </div>
              ) : null}

              {scanning ? <span className="landing-att-scanline" /> : null}

              {scanning ? (
                <div className="landing-att-dots" aria-hidden>
                  <span style={{ left: '38%', top: '42%' }} />
                  <span style={{ left: '58%', top: '42%' }} />
                  <span style={{ left: '48%', top: '52%' }} />
                  <span style={{ left: '40%', top: '62%' }} />
                  <span style={{ left: '56%', top: '62%' }} />
                  <span style={{ left: '48%', top: '70%' }} />
                </div>
              ) : null}

              <AnimatePresence>
                {showWinkChip ? (
                  <motion.span
                    className="landing-att-chip landing-att-chip--warn"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Ko‘z yumiq
                  </motion.span>
                ) : null}
                {showGrimChip ? (
                  <motion.span
                    className="landing-att-chip landing-att-chip--warn"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Boshqacha qiyofa
                  </motion.span>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {success ? (
                  <motion.div
                    className="landing-att-result landing-att-result--ok"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckCircle2 />
                  </motion.div>
                ) : null}
                {faceBad ? (
                  <motion.div
                    className="landing-att-result landing-att-result--bad"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <XCircle />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <p className="landing-att-phone-cap">Face ID · davomat</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            className={cn(
              'landing-att-status',
              meta.tone === 'ok' && 'landing-att-status--ok',
              meta.tone === 'bad' && 'landing-att-status--bad',
              meta.tone === 'scan' && 'landing-att-status--scan',
            )}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {meta.tone === 'ok' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : meta.tone === 'bad' ? (
              <XCircle className="h-5 w-5 shrink-0" />
            ) : (
              <ScanFace className="h-5 w-5 shrink-0" />
            )}
            <div>
              <p className="landing-att-status-title">{meta.title}</p>
              <p className="landing-att-status-sub">{meta.sub}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="landing-att-steps" aria-hidden>
        <span className={cn(!outside && !faceBad && 'on')}>1. Hudud</span>
        <span className={cn((scanning || success || faceBad) && 'on')}>2. Yuz</span>
        <span className={cn(success && 'on ok')}>3. Belgilash</span>
        <span className={cn(faceBad && 'on bad')}>Rad</span>
      </div>
    </div>
  );
}
