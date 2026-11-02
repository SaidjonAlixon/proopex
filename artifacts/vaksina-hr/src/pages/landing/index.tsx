import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  BadgePercent,
  Crown,
  Handshake,
  Minus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { LandingShell, SectionHead } from './LandingShell';
import { LandingStart } from './LandingControls';
import { DashboardPreview } from './DashboardPreview';
import { MorphOrb } from './MorphOrb';
import { Reveal, RevealItem } from './Reveal';
import { AttendanceDemo } from './AttendanceDemo';
import { IntegratsiyaApiContent } from './IntegratsiyaApiContent';
import { LoginDemo } from './LoginDemo';
import { PricingCalculator } from './PricingCalculator';
import { HeroOrbitCards } from './HeroOrbitCards';
import { SolutionsSector } from './SolutionsSector';
import { SyncChannelsDemo } from './SyncChannelsDemo';
import { TaskDemo } from './TaskDemo';
import {
  FAQS,
  INTEGRATIONS,
  MEGA_MODULES,
  PLANS,
  AI_AGENTS,
  SECURITY_POINTS,
  STEPS,
  TASK_CAPABILITIES,
  isCustomPlan,
  type PlanId,
} from './data';

/** Uzunligi yaqin — sarlavha doim 2 qator, pastki matn siljimaydi */
const HERO_WORDS = [
  'to‘liq siklda',
  'bitta joyda',
  'aniq nazoratda',
  'har bir sohada',
  'bir oqimda',
] as const;

const HERO_POINTS = [
  '16 modul — arizadan oylikkacha',
  'Face ID + barmoq + GPS + qurilma',
  'Vazifa bajarilsa → KPI ga tushadi',
  'Har soha · har jamoa · bir platforma',
] as const;

function scrollHash(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

function HeroRotatingWord({ reduce }: { reduce: boolean | null }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % HERO_WORDS.length), 2800);
    return () => clearInterval(t);
  }, [reduce]);

  const word = HERO_WORDS[reduce ? 0 : i];

  return (
    <span className="landing-hero-rotate" aria-live="polite">
      <span className="landing-hero-rotate-sizer" aria-hidden>
        {HERO_WORDS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          className="landing-accent landing-hero-rotate-word"
          style={{ overflow: 'visible' }}
          initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduce ? undefined : { opacity: 0, y: -6, filter: 'blur(4px)' }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function LandingHome() {
  const reduce = useReducedMotion();
  const [faqOpen, setFaqOpen] = useState(0);
  const [billing, setBilling] = useState<'month' | 'year'>('month');
  const [calcPlanId, setCalcPlanId] = useState<PlanId>('business');
  const base = import.meta.env.BASE_URL || '/';
  const yearly = billing === 'year';

  return (
    <LandingShell>
      <section className="landing-hero">
        <div className="landing-hero-glow" aria-hidden />
        <div className="landing-hero-inner">
          <motion.div
            className="landing-hero-copy"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="landing-eyebrow"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45 }}
            >
              PROOPEX · HR platforma
            </motion.p>
            <h1 className="landing-hero-title">
              <span className="landing-hero-title-static">Xodimlar ishi</span>
              <HeroRotatingWord reduce={reduce} />
            </h1>
            <motion.div
              className="landing-hero-lead"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.55 }}
            >
              <p className="landing-hero-lead-hook">
                Har soha va jamoa uchun — <strong>PROOPEX siz uchun.</strong>
              </p>
              <p className="landing-hero-lead-body landing-hero-lead-body--full">
                Xodimlarni boshqarishdan davomat va vazifalar nazoratigacha, kundalik
                jarayonlardan KPI, tahlil va hisobotlargacha — barcha muhim ishlaringiz yagona
                platformada. PROOPEX biznesingizning o‘ziga xos jarayonlariga moslashib,
                boshqaruvni soddalashtiradi, nazoratni kuchaytiradi va rivojlanishingiz uchun
                mustahkam poydevor yaratadi.
              </p>
              <p className="landing-hero-lead-body landing-hero-lead-body--short">
                Xodimlar, davomat, vazifalar, KPI va hisobot — hammasi bitta platformada.
                Boshqaruv sodda, nazorat aniq.
              </p>
              <p className="landing-hero-lead-tag">
                Har biznesga mos boshqaruv tizimi.
              </p>
            </motion.div>
            <motion.div
              className="landing-hero-fill"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.45 }}
            >
              <div className="landing-hero-stat">
                <strong>16</strong>
                <span>modul</span>
              </div>
              <div className="landing-hero-stat">
                <strong>90%+</strong>
                <span>davomat</span>
              </div>
              <div className="landing-hero-stat">
                <strong>KPI</strong>
                <span>avto hisob</span>
              </div>
              <div className="landing-hero-stat">
                <strong>1</strong>
                <span>platforma</span>
              </div>
            </motion.div>
            <motion.div
              className="landing-hero-actions"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
            >
              <LandingStart label="7 kun bepul" badge="Hoziroq" className="landing-start--hero" />
              <Link href="/maqsadimiz" className="landing-btn-outline landing-btn-outline--hero">
                Maqsadimiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.ul
              className="landing-hero-checks"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {HERO_POINTS.map((t) => (
                <li key={t}>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-400" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div
            className="landing-hero-visual"
            initial={reduce ? false : { opacity: 0, x: 28, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="landing-hero-morph">
              <MorphOrb src={`${base}proopex-icon.png`} size="xl" />
            </div>
            <div className="landing-hero-stage">
              <HeroOrbitCards />
              <div className="landing-hero-stage-core">
                <DashboardPreview />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Imkoniyatlar */}
      <section id="imkoniyatlar" className="landing-anchor landing-section">
        <Reveal>
          <SectionHead
            eyebrow="Imkoniyatlar"
            title="Kerakli hamma narsa — bir joyda"
            lead="Qabul, davomat, vazifa, nazorat, KPI va hisobot — har bir modul aniq vazifa uchun. Takror yo‘q, chalkashlik yo‘q: oching va ishlating."
          />
        </Reveal>

        <div className="landing-card-grid mx-auto mt-10 max-w-6xl px-4 sm:px-6">
          {MEGA_MODULES.map((m, i) => (
            <RevealItem key={m.title} index={i}>
              <article className="landing-uni-card h-full">
                <span className={cn('landing-mega-ico', `landing-mega-ico--${m.tone}`)}>
                  <m.icon className="h-4 w-4" />
                </span>
                <h3 className="landing-uni-card-title">{m.title}</h3>
                <p className="landing-uni-card-text">{m.desc}</p>
              </article>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Yechimlar — soha almashuvi */}
      <section id="yechimlar" className="landing-anchor landing-section landing-section--soft landing-yechimlar">
        <Reveal>
          <SectionHead
            eyebrow="Yechimlar"
            title="Har soha uchun boshqacha rollar"
            lead="Har qanday soha egasi uchun: PROOPEX rollarni sizning jarayoningizga moslaydi. Qabul, davomat, vazifa, nazorat va hisobot — barchasi bitta platformada, o‘zingizniki dek his qilasiz."
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
          <SolutionsSector />
        </div>

        <Reveal>
          <div className="landing-agents-head mx-auto mt-14 max-w-7xl px-4 sm:px-6">
            <p className="landing-eyebrow">AI agentlar</p>
            <h3 className="landing-agents-title">AI agentlar — yordamdan to‘liq ishchigacha</h3>
            <p className="landing-agents-lead">
              Yordamchi AI matn va navigatsiyada yordam beradi. Premiumdagi Ishchi AI agent esa topshiriqni og‘zaki yoki yozma oladi va odam o‘rniga platformada ishlaydi. Muhim tasdiq va Face ID — odam nazoratida.
            </p>
          </div>
        </Reveal>
        <div className="landing-agents-grid mx-auto mt-8 max-w-7xl px-4 sm:px-6">
          {AI_AGENTS.map((a, i) => (
            <RevealItem key={a.title} index={i}>
              <article className="landing-audience landing-audience--agent h-full">
                <div className="landing-agent-card-top">
                  <div className="landing-feature-icon">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  {a.badge ? <span className="landing-agent-badge">{a.badge}</span> : null}
                </div>
                <h3 className="landing-audience-title">{a.title}</h3>
                <p className="landing-audience-text">{a.text}</p>
                <ul className="landing-audience-list">
                  {a.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Vazifalar / topshiriqlar */}
      <section id="vazifalar" className="landing-anchor landing-section">
        <Reveal>
          <SectionHead
            eyebrow="Vazifalar"
            title="Topshiriq qo‘yish, bajarish va tekshirish — bitta joyda"
            lead="Bir yoki bir nechta xodimga vazifa, muddat, eslatma va tasdiq. Holat KPI ga bog‘lanadi — xuddi platformadagi /vazifalar oynasidek."
          />
        </Reveal>

        <div className="landing-task-caps mx-auto mt-10 max-w-6xl px-4 sm:px-6">
          {TASK_CAPABILITIES.map((c, i) => (
            <RevealItem key={c.title} index={i}>
              <article className="landing-uni-card h-full">
                <div className="landing-feature-icon">
                  <c.icon className="h-4 w-4" />
                </div>
                <h3 className="landing-uni-card-title">{c.title}</h3>
                <p className="landing-uni-card-text">{c.text}</p>
              </article>
            </RevealItem>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
          <Reveal>
            <TaskDemo />
          </Reveal>
        </div>
      </section>

      {/* Qanday ishlaydi */}
      <section id="qanday-ishlaydi" className="landing-anchor landing-section landing-section--soft">
        <Reveal>
          <SectionHead
            eyebrow="Qanday ishlaydi"
            title="Kirishdan hisobotgacha — 4 bosqich"
            lead="Avval real kirish oqimi: login, qurilma, Face ID. Keyin kundalik ish va hisobot."
          />
        </Reveal>
        <ol className="mx-auto mt-10 grid max-w-6xl gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 sm:px-6">
          {STEPS.map((s, i) => (
            <RevealItem key={s.n} index={i}>
              <li className="landing-step h-full list-none">
                <span className="font-landing-display text-3xl font-semibold landing-gradient-text">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold landing-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed landing-muted-strong">{s.text}</p>
              </li>
            </RevealItem>
          ))}
        </ol>
        <div className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
          <Reveal>
            <LoginDemo />
          </Reveal>
        </div>
      </section>

      {/* Xavfsizlik / davomat jonli demo */}
      <section id="xavfsizlik" className="landing-anchor landing-section">
        <Reveal>
          <SectionHead
            eyebrow="Davomat · xavfsizlik"
            title="Davomat qanday ishlaydi — jonli misol"
            lead="Avval GPS: xodim belgilangan yashil hududda bo‘lishi shart. Keyin Face ID: yuz ochiq, ikkala ko‘z ko‘rinsa — tizim tanib, kelishni belgilaydi. Bir ko‘z yumiq, boshqacha qiyofa yoki begona yuz — tanimaydi. Hududdan tashqarida — umuman belgilash bo‘lmaydi."
          />
        </Reveal>
        <div className="landing-security mx-auto mt-10 grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <ul className="space-y-4">
              {SECURITY_POINTS.map((t, i) => (
                <motion.li
                  key={t}
                  className="flex gap-3 text-sm landing-muted-strong sm:text-base"
                  initial={reduce ? false : { opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                  {t}
                </motion.li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <AttendanceDemo />
          </Reveal>
        </div>
      </section>

      {/* Integratsiya — to‘liq shu sahifada */}
      <section id="integratsiya" className="landing-anchor landing-section landing-section--soft">
        <Reveal>
          <SectionHead
            eyebrow="Integratsiya"
            title="Web, Telegram va API"
            lead="Brauzer va Mini App — bitta baza. Pastda ma’lumot olish, API berish, hujjat va ulanish kartalari — hammasi shu yerda."
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SyncChannelsDemo />
          </Reveal>
        </div>
        <div className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {INTEGRATIONS.map((it, i) => (
            <RevealItem key={it.title} index={i}>
              <article className="landing-feature h-full">
                <div className="landing-feature-icon">
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold landing-fg">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed landing-muted-strong">{it.text}</p>
              </article>
            </RevealItem>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
          <IntegratsiyaApiContent />
        </div>
      </section>

      {/* Tariflar */}
      <section id="tariflar" className="landing-anchor landing-section landing-section--soft">
        <Reveal>
          <SectionHead
            eyebrow="Tariflar"
            title="Aniq narx — aniq imtiyozlar"
            lead="Oyiga, xodim boshiga. Yillik to‘lovda: Start $1 · Business $1.5 · Premium $2.5."
          />
        </Reveal>

        <div className="landing-billing mx-auto mt-8 flex flex-col items-center gap-3 px-4">
          <div className="landing-billing-toggle" role="group" aria-label="To‘lov davri">
            <button
              type="button"
              className={cn('landing-billing-opt', !yearly && 'landing-billing-opt--on')}
              onClick={() => setBilling('month')}
            >
              Oylik
            </button>
            <button
              type="button"
              className={cn('landing-billing-opt', yearly && 'landing-billing-opt--on')}
              onClick={() => setBilling('year')}
            >
              Yillik
              <span className="landing-billing-save">Chegirma</span>
            </button>
          </div>
          <p className="landing-billing-hint">
            {yearly
              ? 'Yillik to‘lov — xodim boshiga oyiga arzonroq narx'
              : 'Oylik to‘lov — istalgan vaqtda o‘zgartirasiz'}
          </p>
        </div>

        <div className="landing-pricing-layout mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <div className="landing-pricing-plans">
            {PLANS.map((plan, i) => {
              const custom = isCustomPlan(plan);
              const price = yearly ? plan.yearlyPrice : plan.price;
              const priceLabel =
                typeof price === 'number' && price % 1 !== 0 ? price.toFixed(1) : String(price ?? '');
              const selected = calcPlanId === plan.id;
              return (
                <RevealItem key={plan.id} index={i}>
                  <article
                    className={cn(
                      'landing-plan h-full',
                      plan.highlight && 'landing-plan--featured',
                      custom && 'landing-plan--custom',
                      selected && 'landing-plan--selected',
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCalcPlanId(plan.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCalcPlanId(plan.id);
                      }
                    }}
                  >
                    {plan.highlight ? (
                      <div className="landing-plan-badge-wrap">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={billing}
                            className={cn(
                              'landing-plan-badge',
                              yearly ? 'landing-plan-badge--year' : 'landing-plan-badge--month',
                            )}
                            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={reduce ? undefined : { opacity: 0, y: 6, scale: 0.9 }}
                            transition={{ duration: 0.25 }}
                          >
                            {yearly ? (
                              <>
                                <BadgePercent className="h-3.5 w-3.5" />
                                Eng tejamkor
                              </>
                            ) : (
                              <>
                                <Crown className="h-3.5 w-3.5" />
                                Eng ommabop
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    ) : null}
                    {custom ? (
                      <div className="landing-plan-badge-wrap">
                        <div className="landing-plan-badge landing-plan-badge--custom">
                          <Handshake className="h-3.5 w-3.5" />
                          Korporativ
                        </div>
                      </div>
                    ) : null}
                    <h3 className="font-landing-display text-lg font-semibold landing-fg sm:text-xl">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm landing-muted-strong">{plan.tagline}</p>
                    <div className="mt-5">
                      {custom ? (
                        <>
                          <p className="landing-plan-custom-price">Kelishuv asosida</p>
                          <p className="landing-plan-was landing-plan-was--soft">
                            {yearly
                              ? 'Yillik shartnoma — hajm va muddatga qarab'
                              : 'Oylik shartnoma — hajm va muddatga qarab'}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-end gap-1">
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={`${plan.id}-${billing}`}
                                className="font-landing-display text-4xl font-bold tracking-tight landing-gradient-text sm:text-5xl"
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                                transition={{ duration: 0.22 }}
                              >
                                ${priceLabel}
                              </motion.span>
                            </AnimatePresence>
                            <span className="mb-1.5 text-sm landing-muted">/ oy · xodim</span>
                          </div>
                          {yearly ? (
                            <p className="landing-plan-was">
                              Oylik <s>${plan.price}</s> · yillikda tejasiz
                            </p>
                          ) : (
                            <p className="landing-plan-was landing-plan-was--soft">
                              Yillikda $
                              {plan.yearlyPrice != null && plan.yearlyPrice % 1 !== 0
                                ? plan.yearlyPrice.toFixed(1)
                                : plan.yearlyPrice}{' '}
                              / oy
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <ul className="mt-5 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm landing-fg">
                          <span className="landing-plan-check mt-0.5">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          {f}
                        </li>
                      ))}
                      {plan.notIncluded.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm landing-muted line-through opacity-60"
                        >
                          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                            <Minus className="h-3 w-3 opacity-50" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <Button
                        type="button"
                        className={cn(
                          'h-11 w-full rounded-full',
                          selected || plan.highlight || custom ? 'landing-cta' : 'landing-btn-ghost',
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCalcPlanId(plan.id);
                        }}
                      >
                        {selected ? 'Tanlangan' : custom ? 'Kelishuv so‘rash' : `${plan.name} ni tanlash`}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                </RevealItem>
              );
            })}
          </div>

          <Reveal delay={0.12} className="landing-pricing-calc-col">
            <PricingCalculator
              billing={billing}
              selectedPlanId={calcPlanId}
              onSelectPlan={setCalcPlanId}
            />
          </Reveal>
        </div>
      </section>

      {/* Savollar */}
      <section id="savollar" className="landing-anchor landing-section">
        <Reveal>
          <SectionHead
            eyebrow="Savollar"
            title="Tez-tez so‘raladigan savollar"
            lead="Platforma, davomat, vazifa, KPI va tariflar haqida qisqa javoblar."
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl space-y-2 px-4 sm:px-6">
          {FAQS.map((item, i) => {
            const isOpen = faqOpen === i;
            return (
              <RevealItem key={item.q} index={Math.min(i, 5)}>
                <div className="landing-faq">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
                    onClick={() => setFaqOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-medium landing-fg sm:text-base">{item.q}</span>
                    <ChevronDown
                      className={cn(
                        'mt-0.5 h-4 w-4 shrink-0 landing-muted transition-transform duration-300',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden"
                      >
                        <p className="landing-faq-body border-t px-4 pb-4 pt-3 text-sm leading-relaxed sm:px-5">
                          {item.a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </RevealItem>
            );
          })}
        </div>
      </section>

      <section className="landing-final-cta">
        <Reveal>
          <div className="landing-final-cta-inner">
            <p className="landing-eyebrow justify-center">PROOPEX</p>
            <h2 className="landing-title text-center">Bitta sahifa — to‘liq platforma</h2>
            <p className="landing-lead mx-auto mt-3 max-w-xl text-center">
              Imkoniyatlar, yechimlar va ish oqimi shu yerda. Boshlash uchun kiring.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LandingStart label="7 kun bepul" badge="Hoziroq" />
              <Link href="/login" className="landing-btn-outline">
                Tizimga kirish
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </LandingShell>
  );
}
