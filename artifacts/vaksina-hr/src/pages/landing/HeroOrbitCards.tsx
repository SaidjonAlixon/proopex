import { motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  FolderKanban,
  MapPin,
  MessageSquare,
  ScanFace,
  ShieldCheck,
  Target,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { cn } from '../../lib/utils';

type OrbitCard = {
  id: string;
  pos: string;
  icon: typeof Clock3;
  tone: string;
  title: string;
  lines?: { label: string; meta?: string; ok?: boolean }[];
  delay: number;
};

const CARDS: OrbitCard[] = [
  {
    id: 'late',
    pos: 'top-a',
    icon: Clock3,
    tone: 'rose',
    title: 'Kechikish va kelmaganlik nazorati',
    lines: [
      { label: 'Kechikish', meta: '28' },
      { label: 'Kelmagan', meta: '12' },
    ],
    delay: 0.3,
  },
  {
    id: 'letter',
    pos: 'top-b',
    icon: FileText,
    tone: 'violet',
    title: 'Tushuntirish xati',
    lines: [
      { label: 'Yangi so‘rov', meta: '3' },
      { label: 'Ko‘rib chiqilmoqda', meta: '5' },
    ],
    delay: 0.38,
  },
  {
    id: 'tasks',
    pos: 'top-c',
    icon: ClipboardList,
    tone: 'blue',
    title: 'Vazifalar va eslatmalar',
    lines: [
      { label: 'KPI hisobotini yuborish', meta: '09:30' },
      { label: 'Filial checklist', meta: '11:00' },
      { label: 'Yangi xodim onboarding', meta: '15:20' },
    ],
    delay: 0.46,
  },
  {
    id: 'kpi',
    pos: 'top-d',
    icon: Target,
    tone: 'amber',
    title: 'Oylik KPI',
    lines: [
      { label: 'Jamoa', meta: '92.8%' },
      { label: 'Maqsad', meta: '95%' },
    ],
    delay: 0.5,
  },
  {
    id: 'face',
    pos: 'mid-l',
    icon: ScanFace,
    tone: 'cyan',
    title: 'Face ID orqali davomat',
    lines: [
      { label: 'Aziza Yusupova', meta: '08:41', ok: true },
      { label: 'Jasur Bekmurodov', meta: '08:52', ok: true },
    ],
    delay: 0.4,
  },
  {
    id: 'chat',
    pos: 'mid-l2',
    icon: MessageSquare,
    tone: 'blue',
    title: 'Chat va xabarlar',
    lines: [
      { label: 'Yangi xabar', meta: '8' },
      { label: 'Guruh', meta: 'HR' },
    ],
    delay: 0.48,
  },
  {
    id: 'reception',
    pos: 'mid-r',
    icon: MapPin,
    tone: 'emerald',
    title: 'Qabulxona · Keldi-ketdi',
    lines: [
      { label: 'Mehmon — HR', meta: '10:12' },
      { label: 'Yetkazib berish', meta: '11:40' },
      { label: 'Hamkor uchrashuv', meta: '14:05' },
    ],
    delay: 0.44,
  },
  {
    id: 'secure',
    pos: 'mid-r2',
    icon: ShieldCheck,
    tone: 'violet',
    title: 'Javob olish va tasdiqlashlar',
    lines: [
      { label: 'Javob kutilyapti', meta: '6' },
      { label: 'Tasdiqlash', meta: '4' },
      { label: 'Tasdiqlangan', meta: '18', ok: true },
    ],
    delay: 0.52,
  },
  {
    id: 'hire',
    pos: 'bot-a',
    icon: UserPlus,
    tone: 'violet',
    title: 'Ishga qabul qilish',
    lines: [
      { label: 'Namzodlar', meta: '12' },
      { label: 'Suhbat jarayoni', meta: '4' },
      { label: 'Onboarding', meta: '2' },
    ],
    delay: 0.56,
  },
  {
    id: 'apps',
    pos: 'bot-b',
    icon: FolderKanban,
    tone: 'amber',
    title: 'Ariza va so‘rovlar',
    lines: [
      { label: 'Ta’til arizasi', meta: '7' },
      { label: 'Maosh oldindan', meta: '3' },
      { label: 'Xizmat safari', meta: '2' },
    ],
    delay: 0.62,
  },
  {
    id: 'branch',
    pos: 'bot-c',
    icon: Building2,
    tone: 'blue',
    title: 'Filiallar va bo‘limlar nazorati',
    lines: [
      { label: 'Toshkent', meta: '96%' },
      { label: 'Samarqand', meta: '91%' },
      { label: 'Buxoro', meta: '88%' },
    ],
    delay: 0.68,
  },
  {
    id: 'reports',
    pos: 'bot-d',
    icon: CheckCircle2,
    tone: 'emerald',
    title: 'Hisobotlar va tahlil',
    lines: [
      { label: 'Oylik hisobot', meta: 'PDF' },
      { label: 'Bo‘limlar bo‘yicha', meta: 'OK' },
      { label: 'Excel eksport', meta: 'CSV' },
    ],
    delay: 0.74,
  },
  {
    id: 'pay',
    pos: 'bot-e',
    icon: Wallet,
    tone: 'cyan',
    title: 'Oylik hisob-kitob',
    lines: [
      { label: 'Hisoblangan', meta: '284' },
      { label: 'Bonus', meta: '+5.2%' },
    ],
    delay: 0.8,
  },
];

function OrbitCardView({
  card,
  reduce,
  className,
}: {
  card: OrbitCard;
  reduce: boolean | null;
  className?: string;
}) {
  const Icon = card.icon;
  return (
    <motion.div
      className={cn(
        'landing-orbit-card',
        `landing-orbit-card--${card.pos}`,
        `landing-orbit-card--${card.tone}`,
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: card.delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="landing-orbit-card-top">
        <span className="landing-orbit-ico">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <strong>{card.title}</strong>
      </div>
      {card.lines?.length ? (
        <ul className="landing-orbit-list">
          {card.lines.map((line) => (
            <li key={line.label}>
              <span>
                {line.ok ? <i className="landing-orbit-ok" /> : null}
                {line.label}
              </span>
              {line.meta ? <em>{line.meta}</em> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}

export function HeroOrbitCards() {
  const reduce = useReducedMotion();

  return (
    <>
      <div className="landing-orbit" aria-hidden>
        {CARDS.map((card) => (
          <OrbitCardView key={card.id} card={card} reduce={reduce} />
        ))}
      </div>

      <div className="landing-orbit-mobile" aria-label="Platforma imkoniyatlari">
        <div className="landing-orbit-mobile-track">
          {CARDS.map((card) => (
            <OrbitCardView
              key={`m-${card.id}`}
              card={card}
              reduce={reduce}
              className="landing-orbit-card--mobile"
            />
          ))}
        </div>
      </div>
    </>
  );
}
