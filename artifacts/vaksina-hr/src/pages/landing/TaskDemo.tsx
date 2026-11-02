import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AtSign,
  Bell,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Maximize2,
  MessageCircle,
  Paperclip,
  Send,
  Smile,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const TITLE_FULL = 'Filiallar bo‘yicha haftalik hisobot';
const DESC_FULL = 'GPS hududda Face ID, savollar va foto. Bajarilgach KPI ga ta’sir qiladi.';

const PEOPLE = [
  { id: '1', name: 'Dilshod Karimov', role: 'Mudir' },
  { id: '2', name: 'Nilufar Yusupova', role: 'HR' },
  { id: '3', name: 'Jasur Aliyev', role: 'Koordinator' },
];

const STATUSES = [
  'Yangi',
  'Qabul qilingan',
  'Jarayonda',
  'Kechikkan',
  'Tekshiruvda',
  'Bajarilgan',
] as const;

type Phase = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Real /vazifalar «Yangi topshiriq qo‘shish» modalining to‘liq animatsiyasi
 * (3 ustun: asosiy · holat · chat)
 */
export function TaskDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(0);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [statusIdx, setStatusIdx] = useState(0);
  const [sent, setSent] = useState(false);
  const [chatMsg, setChatMsg] = useState(false);

  useEffect(() => {
    if (reduce) {
      setTitle(TITLE_FULL);
      setDesc(DESC_FULL);
      setPicked(PEOPLE.map((p) => p.id));
      setStatusIdx(5);
      setSent(true);
      setChatMsg(true);
      setPhase(5);
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const reset = () => {
      setPhase(0);
      setTitle('');
      setDesc('');
      setPicked([]);
      setStatusIdx(0);
      setSent(false);
      setChatMsg(false);
    };

    const play = () => {
      reset();
      /* 0 — sarlavha yoziladi */
      later(200, () => {
        if (cancelled) return;
        setPhase(0);
        let i = 0;
        const typeTitle = window.setInterval(() => {
          i += 1;
          setTitle(TITLE_FULL.slice(0, i));
          if (i >= TITLE_FULL.length) {
            clearInterval(typeTitle);
            /* 1 — tavsif */
            later(350, () => {
              if (cancelled) return;
              setPhase(1);
              let j = 0;
              const typeDesc = window.setInterval(() => {
                j += 1;
                setDesc(DESC_FULL.slice(0, j));
                if (j >= DESC_FULL.length) {
                  clearInterval(typeDesc);
                  /* 2 — xodimlar tanlanadi */
                  later(400, () => {
                    if (cancelled) return;
                    setPhase(2);
                    PEOPLE.forEach((p, idx) => {
                      later(380 * (idx + 1), () => {
                        if (cancelled) return;
                        setPicked((prev) => (prev.includes(p.id) ? prev : [...prev, p.id]));
                      });
                    });
                    /* 3 — eslatma / muddat */
                    later(380 * PEOPLE.length + 500, () => {
                      if (cancelled) return;
                      setPhase(3);
                      /* 4 — yuborish */
                      later(900, () => {
                        if (cancelled) return;
                        setPhase(4);
                        setSent(true);
                        setChatMsg(true);
                        /* 5 — holat oqimi */
                        later(700, () => {
                          if (cancelled) return;
                          setPhase(5);
                          [1, 2, 4, 5].forEach((s, idx) => {
                            later(550 * (idx + 1), () => {
                              if (cancelled) return;
                              setStatusIdx(s);
                            });
                          });
                        });
                      });
                    });
                  });
                }
              }, 18);
              timers.push(typeDesc as unknown as number);
            });
          }
        }, 28);
        timers.push(typeTitle as unknown as number);
      });
    };

    play();
    const loop = window.setInterval(play, 14000);
    timers.push(loop);

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
      clearInterval(loop);
    };
  }, [reduce]);

  return (
    <div className="landing-task-real" aria-label="Yangi topshiriq qo‘shish — real oyna namoyishi">
      <div className="landing-task-real-backdrop" aria-hidden />

      <div className="landing-task-real-modal">
        <header className="landing-task-real-head">
          <div className="landing-task-real-head-left">
            <span className="landing-task-real-badge">BERUVCHI</span>
            <h3>Yangi topshiriq qo‘shish</h3>
          </div>
          <div className="landing-task-real-head-right">
            <span className="landing-task-real-ghost">
              <Wand2 className="h-3.5 w-3.5" />
              Shablondan
            </span>
            <span className="landing-task-real-ico">
              <Maximize2 className="h-4 w-4" />
            </span>
            <span className="landing-task-real-ico">
              <X className="h-4 w-4" />
            </span>
          </div>
        </header>

        <div className="landing-task-real-grid">
          {/* —— Chap: asosiy —— */}
          <section className="landing-task-real-col">
            <div className="landing-task-real-card">
              <div className="landing-task-real-card-title">Asosiy ma’lumot</div>

              <label className="landing-task-real-label">Topshiriq nomi</label>
              <div className={cn('landing-task-real-field', phase === 0 && 'landing-task-real-field--focus')}>
                {title || <span className="landing-task-real-ph">Masalan: Filiallar bo‘yicha haftalik hisobot</span>}
                {phase === 0 && title.length < TITLE_FULL.length ? (
                  <span className="landing-task-real-caret" />
                ) : null}
              </div>
              <div className="landing-task-real-counter">{title.length}/200</div>

              <label className="landing-task-real-label">Tavsif</label>
              <div className="landing-task-real-toolbar">
                {['B', 'I', 'U', '•', '1.', '🔗'].map((t) => (
                  <span key={t}>{t}</span>
                ))}
                <span className="landing-task-real-ai">
                  <Sparkles className="h-3 w-3" /> AI
                </span>
              </div>
              <div className={cn('landing-task-real-area', phase === 1 && 'landing-task-real-field--focus')}>
                {desc || <span className="landing-task-real-ph">Topshiriq bo‘yicha batafsil ko‘rsatmalar…</span>}
                {phase === 1 && desc.length < DESC_FULL.length ? (
                  <span className="landing-task-real-caret" />
                ) : null}
              </div>
              <div className="landing-task-real-counter">{desc.length}/2000</div>
            </div>

            <div className="landing-task-real-card">
              <label className="landing-task-real-label">Mas’ul xodim</label>
              <div className="landing-task-real-select">
                Xodimni tanlang
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </div>
              <div className="landing-task-real-checks">
                <label>
                  <span className="landing-task-real-box landing-task-real-box--on" /> Ofis
                </label>
                <label>
                  <span className="landing-task-real-box landing-task-real-box--on" /> Dorixona
                </label>
              </div>

              <label className="landing-task-real-label">Mas’ul xodimlar (bir nechta)</label>
              <div className={cn('landing-task-real-multi', phase >= 2 && picked.length > 0 && 'landing-task-real-multi--on')}>
                {picked.length === 0 ? (
                  <span className="landing-task-real-ph">Bir nechta xodimni birga tanlang</span>
                ) : (
                  <div className="landing-task-real-chips">
                    <AnimatePresence>
                      {PEOPLE.filter((p) => picked.includes(p.id)).map((p) => (
                        <motion.span
                          key={p.id}
                          className="landing-task-real-chip"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                        >
                          <i>{p.name.slice(0, 1)}</i>
                          {p.name}
                          <Check className="h-3 w-3" />
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            <div className="landing-task-real-card landing-task-real-card--row">
              <div>
                <label className="landing-task-real-label">Muddat</label>
                <div className="landing-task-real-select">26.10.2026</div>
              </div>
              <div>
                <label className="landing-task-real-label">Vaqt</label>
                <div className="landing-task-real-select">18:00</div>
              </div>
            </div>
          </section>

          {/* —— O‘rta: holat —— */}
          <section className="landing-task-real-col">
            <div className="landing-task-real-card">
              <div className="landing-task-real-card-title">Beruvchi</div>
              <div className="landing-task-real-assigner">
                <span className="landing-task-real-av">A</span>
                <div>
                  <strong>Siz — PROOPEX Admin</strong>
                  <small>Topshiriq beruvchi</small>
                </div>
              </div>
            </div>

            <div className="landing-task-real-card">
              <div className="landing-task-real-card-title">Topshiriq holati</div>
              <ol className="landing-task-real-status">
                {STATUSES.map((s, i) => {
                  const on = i === statusIdx;
                  const done = i < statusIdx;
                  return (
                    <li key={s} className={cn(on && 'is-on', done && 'is-done')}>
                      <span className="landing-task-real-status-dot">
                        {done || (on && statusIdx === 5) ? <Check className="h-3 w-3" /> : null}
                      </span>
                      {s}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className={cn('landing-task-real-card', phase >= 3 && 'landing-task-real-card--pulse')}>
              <label className="landing-task-real-checkline">
                <span className={cn('landing-task-real-box', phase >= 3 && 'landing-task-real-box--on')} />
                Eslatma o‘rnatish
              </label>
              <div className="landing-task-real-select">
                <Bell className="h-3.5 w-3.5" />
                1 kun oldin · tizim + Telegram
              </div>
              <label className="landing-task-real-checkline" style={{ marginTop: '0.65rem' }}>
                <span className={cn('landing-task-real-box', phase >= 3 && 'landing-task-real-box--on')} />
                Takrorlanuvchi topshiriq
              </label>
              <div className="landing-task-real-select">Har hafta</div>
            </div>
          </section>

          {/* —— O‘ng: chat —— */}
          <section className="landing-task-real-col landing-task-real-col--chat">
            <div className="landing-task-real-tabs">
              <span className="is-on">
                <MessageCircle className="h-3.5 w-3.5" /> Chat
              </span>
              <span>Fayllar</span>
              <span>Tarix</span>
            </div>
            <div className="landing-task-real-chat">
              <AnimatePresence mode="wait">
                {!chatMsg ? (
                  <motion.div
                    key="empty"
                    className="landing-task-real-chat-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MessageCircle className="h-8 w-8 opacity-30" />
                    <p>Hali xabar yo‘q</p>
                    <small>Avval mas’ul xodimni tanlang</small>
                  </motion.div>
                ) : (
                  <motion.div
                    key="msg"
                    className="landing-task-real-bubble"
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                  >
                    <strong>Siz</strong>
                    <p>Topshiriq yuborildi. Muddat: bugun 18:00. Eslatma yoqilgan.</p>
                    <em>hozir</em>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="landing-task-real-composer">
              <Paperclip className="h-4 w-4 opacity-40" />
              <Smile className="h-4 w-4 opacity-40" />
              <AtSign className="h-4 w-4 opacity-40" />
              <span className="landing-task-real-composer-input">Xabar yozing…</span>
              <span className="landing-task-real-send">
                <Send className="h-3.5 w-3.5" />
              </span>
            </div>
          </section>
        </div>

        <footer className="landing-task-real-foot">
          <span className="landing-task-real-ghost">Bekor qilish</span>
          <motion.span
            className={cn('landing-task-real-submit', sent && 'landing-task-real-submit--ok')}
            animate={phase === 4 ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.45 }}
          >
            {sent ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Yuborildi
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Topshiriqni yuborish
              </>
            )}
          </motion.span>
        </footer>
      </div>
    </div>
  );
}
