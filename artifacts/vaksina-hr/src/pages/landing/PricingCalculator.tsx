import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calculator, Minus, Plus, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { PLANS, formatUsd, isCustomPlan, type PlanId } from './data';

const PRESETS = [10, 25, 50, 100, 150, 300] as const;
const SLIDER_MAX = 1500;
const SLIDER_MIN = 1;

type Props = {
  billing: 'month' | 'year';
  selectedPlanId: PlanId;
  onSelectPlan: (id: PlanId) => void;
};

export function PricingCalculator({ billing, selectedPlanId, onSelectPlan }: Props) {
  const reduce = useReducedMotion();
  const [staff, setStaff] = useState(25);
  /** Natija faqat «Hisoblash» dan keyin yangilanadi */
  const [resultStaff, setResultStaff] = useState(25);
  /** Yozish paytida bo‘sh / 0 qoldirish mumkin — Hisoblash / blur da clamp */
  const [staffDraft, setStaffDraft] = useState<string | null>(null);
  const [calcTick, setCalcTick] = useState(0);
  const yearly = billing === 'year';
  const plan = PLANS.find((p) => p.id === selectedPlanId) ?? PLANS[1];
  const custom = isCustomPlan(plan);
  const cap = plan.maxStaff ?? SLIDER_MAX;

  useEffect(() => {
    setStaff((n) => Math.min(Math.max(SLIDER_MIN, n), cap));
    setResultStaff((n) => Math.min(Math.max(SLIDER_MIN, n), cap));
    setStaffDraft(null);
  }, [cap]);

  const calc = useMemo(() => {
    if (custom || plan.price == null || plan.yearlyPrice == null) {
      return {
        perMonth: 0,
        monthTotal: 0,
        yearPay: 0,
        monthPayYear: 0,
        saveYear: 0,
        savePct: 0,
        overLimit: false,
        limitLabel: 'Cheksiz · kelishuv',
      };
    }
    const perMonth = yearly ? plan.yearlyPrice : plan.price;
    const monthTotal = perMonth * resultStaff;
    const yearPay = plan.yearlyPrice * resultStaff * 12;
    const monthPayYear = plan.price * resultStaff * 12;
    const saveYear = Math.max(0, monthPayYear - yearPay);
    const savePct = monthPayYear > 0 ? Math.round((saveYear / monthPayYear) * 100) : 0;
    const overLimit = plan.maxStaff != null && resultStaff > plan.maxStaff;
    return {
      perMonth,
      monthTotal,
      yearPay,
      monthPayYear,
      saveYear,
      savePct,
      overLimit,
      limitLabel: plan.maxStaff == null ? 'Cheksiz' : `${plan.maxStaff} tagacha`,
    };
  }, [plan, resultStaff, yearly, custom]);

  const setStaffClamped = (n: number) => {
    const v = Math.round(Number.isFinite(n) ? n : SLIDER_MIN);
    setStaff(Math.min(Math.max(SLIDER_MIN, v), cap));
    setStaffDraft(null);
  };

  const staffInputValue = staffDraft ?? String(staff);

  const onStaffInputChange = (raw: string) => {
    if (!(raw === '' || /^\d{0,5}$/.test(raw))) return;
    if (raw === '') {
      setStaffDraft('');
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    if (n > cap) {
      setStaff(cap);
      setStaffDraft(String(cap));
      return;
    }
    setStaffDraft(raw);
    if (n >= SLIDER_MIN) setStaff(n);
  };

  const onStaffInputBlur = () => {
    const raw = staffDraft;
    if (raw == null) return;
    if (raw === '' || raw === '0') {
      setStaffDraft(String(SLIDER_MIN));
      setStaff(SLIDER_MIN);
      return;
    }
    const n = Number(raw);
    const v = Math.min(Math.max(SLIDER_MIN, Math.round(Number.isFinite(n) ? n : SLIDER_MIN)), cap);
    setStaff(v);
    setStaffDraft(String(v));
  };

  const runCalc = () => {
    const raw = (staffDraft ?? String(staff)).trim();
    let n = Number(raw);
    if (!Number.isFinite(n) || raw === '' || n < SLIDER_MIN) n = SLIDER_MIN;
    n = Math.min(Math.max(SLIDER_MIN, Math.round(n)), cap);
    setStaff(n);
    setStaffDraft(null);
    setResultStaff(n);
    setCalcTick((t) => t + 1);
  };

  return (
    <aside className="landing-calc" aria-label="Narx kalkulyatori">
      <div className="landing-calc-head">
        <span className="landing-calc-icon">
          <Calculator className="h-4 w-4" />
        </span>
        <div>
          <h3 className="landing-calc-title">Narx kalkulyatori</h3>
          <p className="landing-calc-sub">
            {custom
              ? 'Kartadan Maxsus tanlangan — narx kelishuv asosida'
              : 'Xodim sonini yozing → Hisoblash'}
          </p>
        </div>
      </div>

      <div className="landing-calc-block">
        <span className="landing-calc-label">Tarif</span>
        <div className="landing-calc-plans" role="radiogroup" aria-label="Tarif tanlash">
          {PLANS.filter((p) => !isCustomPlan(p)).map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selectedPlanId === p.id}
              className={cn('landing-calc-plan', selectedPlanId === p.id && 'landing-calc-plan--on')}
              onClick={() => onSelectPlan(p.id)}
            >
              <strong>{p.name}</strong>
              <em>
                $
                {yearly
                  ? p.yearlyPrice! % 1
                    ? p.yearlyPrice!.toFixed(1)
                    : p.yearlyPrice
                  : p.price}
                /oy
              </em>
            </button>
          ))}
        </div>
      </div>

      {!custom ? (
        <div className="landing-calc-block">
          <div className="landing-calc-label-row">
            <span className="landing-calc-label">
              <Users className="h-3.5 w-3.5" />
              Xodimlar soni
            </span>
            <span className="landing-calc-limit">{calc.limitLabel}</span>
          </div>

          <div className="landing-calc-stepper">
            <button
              type="button"
              className="landing-calc-step"
              aria-label="Kamaytirish"
              onClick={() => setStaffClamped(staff - 1)}
              disabled={staff <= SLIDER_MIN}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="landing-calc-input"
              value={staffInputValue}
              onChange={(e) => onStaffInputChange(e.target.value)}
              onBlur={onStaffInputBlur}
              onFocus={(e) => {
                setStaffDraft(String(Math.min(staff, cap)));
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  runCalc();
                }
              }}
              aria-label={`Xodimlar soni, maksimal ${cap}`}
              aria-valuemax={cap}
            />
            <button
              type="button"
              className="landing-calc-step"
              aria-label="Ko‘paytirish"
              onClick={() => setStaffClamped(staff + 1)}
              disabled={staff >= cap}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <input
            type="range"
            className="landing-calc-range"
            min={SLIDER_MIN}
            max={cap}
            value={Math.min(staff, cap)}
            onChange={(e) => setStaffClamped(Number(e.target.value))}
            aria-label={`Xodimlar slayderi, maksimal ${cap}`}
          />

          <div className="landing-calc-presets">
            {PRESETS.filter((n) => n <= cap).map((n) => (
              <button
                key={n}
                type="button"
                className={cn('landing-calc-preset', staff === n && 'landing-calc-preset--on')}
                onClick={() => setStaffClamped(n)}
              >
                {n}
              </button>
            ))}
            {!PRESETS.includes(cap as (typeof PRESETS)[number]) && cap <= SLIDER_MAX ? (
              <button
                type="button"
                className={cn('landing-calc-preset', staff === cap && 'landing-calc-preset--on')}
                onClick={() => setStaffClamped(cap)}
              >
                {cap}
              </button>
            ) : null}
          </div>

          <button type="button" className="landing-calc-run" onClick={runCalc}>
            <Calculator className="h-4 w-4" aria-hidden />
            Hisoblash
          </button>
        </div>
      ) : null}

      <div className="landing-calc-result" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedPlanId}-${resultStaff}-${billing}-${calcTick}-${custom ? 'c' : 'n'}`}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {custom ? (
              <div className="landing-calc-custom">
                <p className="landing-calc-custom-price">Kelishuv asosida</p>
                <p className="landing-calc-custom-text">
                  Narx xodimlar, modullar, integratsiya va xizmat talablariga qarab belgilanadi —
                  oylik yoki uzoq muddatli shartnoma.
                </p>
                <ul className="landing-calc-custom-list">
                  <li>Holding + white-label</li>
                  <li>Park / SLA / 1C–ERP</li>
                  <li>{yearly ? 'Yillik' : 'Oylik'} kelishuv</li>
                </ul>
              </div>
            ) : (
              <>
                <div className="landing-calc-formula">
                  {resultStaff} xodim × {formatUsd(calc.perMonth)}
                  <span> / oy · xodim</span>
                </div>

                <div className="landing-calc-rows">
                  <div className="landing-calc-row landing-calc-row--main">
                    <span>Oyiga</span>
                    <strong>{formatUsd(calc.monthTotal)}</strong>
                  </div>
                  <div className="landing-calc-row">
                    <span>Yiliga {yearly ? '(to‘lov)' : '(agar oylik)'}</span>
                    <strong>{formatUsd(yearly ? calc.yearPay : calc.monthPayYear)}</strong>
                  </div>
                  {yearly ? (
                    <div className="landing-calc-row landing-calc-row--save">
                      <span>Yillikda tejaysiz</span>
                      <strong>
                        −{formatUsd(calc.saveYear)}
                        <em> ({calc.savePct}%)</em>
                      </strong>
                    </div>
                  ) : (
                    <div className="landing-calc-row landing-calc-row--hint">
                      <span>Yillik tarifda oyiga</span>
                      <strong>{formatUsd((plan.yearlyPrice ?? 0) * resultStaff)}</strong>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {calc.overLimit ? (
        <p className="landing-calc-warn">
          {plan.name} limitu — {plan.maxStaff} xodim. Ko‘proq uchun yuqori tarifni tanlang.
        </p>
      ) : (
        <p className="landing-calc-note">
          {custom
            ? 'Narx shartnomada belgilanadi — oylik yoki yillik, ikkalasi ham mumkin.'
            : 'Raqamni yozing yoki tanlang, keyin «Hisoblash» — natija shu son bo‘yicha.'}
        </p>
      )}

      <div className="landing-calc-spacer" aria-hidden />

      <Link href="/login" className="landing-calc-cta">
        <Button className="landing-cta h-11 w-full rounded-full">
          {custom ? 'Maxsus · kelishuv so‘rash' : `${plan.name} · ${resultStaff} xodim`}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </aside>
  );
}
