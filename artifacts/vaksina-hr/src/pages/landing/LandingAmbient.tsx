import { useEffect, useRef, useState } from 'react';

/** Boshlang‘ich joylashuv (foiz) — hammasi kursoridan qochadi */
const P_ICONS = [
  { hx: 0.1, hy: 0.14, size: 7.8, rot: -6 },
  { hx: 0.88, hy: 0.16, size: 6.4, rot: 8 },
  { hx: 0.12, hy: 0.62, size: 5.6, rot: -10 },
  { hx: 0.78, hy: 0.72, size: 5.2, rot: 5 },
  { hx: 0.42, hy: 0.38, size: 4.6, rot: -3 },
];

type Agent = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  rot: number;
  baseRot: number;
  scale: number;
  size: number;
  phase: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  hue: number;
};

type Drop = { x: number; y: number; t: number; max: number };

/** Hira P lar (qochadi) + kursor izi + tomchi */
export function LandingAmbient() {
  const base = import.meta.env.BASE_URL || '/';
  const icon = `${base}proopex-icon.png`;
  const [reduce, setReduce] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const agents = useRef<Agent[]>([]);
  const sparks = useRef<Spark[]>([]);
  const drops = useRef<Drop[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, px: -9999, py: -9999 });
  const lastSpawn = useRef(0);
  const raf = useRef(0);
  const ok = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(pointer: fine)');
    const sync = () => {
      setReduce(mq.matches);
      ok.current = fine.matches && !mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    fine.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      fine.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const placeHomes = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const next = P_ICONS.map((p, i) => {
        const prev = agents.current[i];
        const homeX = p.hx * w;
        const homeY = p.hy * h;
        return {
          x: prev?.x ?? homeX,
          y: prev?.y ?? homeY,
          vx: prev?.vx ?? 0,
          vy: prev?.vy ?? 0,
          homeX,
          homeY,
          rot: prev?.rot ?? p.rot,
          baseRot: p.rot,
          scale: prev?.scale ?? 1,
          size: p.size,
          phase: prev?.phase ?? i * 1.7,
        } satisfies Agent;
      });
      agents.current = next;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      placeHomes();
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: PointerEvent) => {
      if (!ok.current) return;
      mouse.current.px = mouse.current.x;
      mouse.current.py = mouse.current.y;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const now = performance.now();
      if (now - lastSpawn.current < 18) return;
      lastSpawn.current = now;

      const dx = mouse.current.x - mouse.current.px;
      const dy = mouse.current.y - mouse.current.py;
      const spd = Math.min(Math.hypot(dx, dy), 40);
      const n = spd > 2 ? 2 : 1;

      for (let i = 0; i < n; i++) {
        const ang = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.9;
        const jitter = (Math.random() - 0.5) * 4;
        sparks.current.push({
          x: mouse.current.x + jitter,
          y: mouse.current.y + jitter,
          vx: Math.cos(ang + Math.PI) * (0.15 + Math.random() * 0.35) + (Math.random() - 0.5) * 0.2,
          vy: Math.sin(ang + Math.PI) * (0.15 + Math.random() * 0.35) - 0.12 - Math.random() * 0.25,
          life: 0,
          max: 380 + Math.random() * 280,
          r: 1.1 + Math.random() * 1.8 + spd * 0.02,
          hue: Math.random() > 0.45 ? 198 : 268,
        });
      }
      if (sparks.current.length > 48) sparks.current.splice(0, sparks.current.length - 48);
    };

    const onDown = (e: MouseEvent) => {
      drops.current.push({ x: e.clientX, y: e.clientY, t: 0, max: 720 });
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 + Math.random() * 0.4;
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * (0.4 + Math.random() * 0.7),
          vy: Math.sin(a) * (0.4 + Math.random() * 0.7) - 0.2,
          life: 0,
          max: 420 + Math.random() * 200,
          r: 1.4 + Math.random() * 1.2,
          hue: i % 2 ? 198 : 275,
        });
      }
      if (drops.current.length > 4) drops.current.shift();

      for (const s of agents.current) {
        const ddx = s.x - e.clientX;
        const ddy = s.y - e.clientY;
        if (Math.hypot(ddx, ddy) < 170) {
          const ang = Math.atan2(ddy || 0.01, ddx || 0.01);
          s.vx += Math.cos(ang) * 10;
          s.vy += Math.sin(ang) * 10;
          s.scale = 1.14;
        }
      }
    };

    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - prev, 32);
      prev = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = dt / 16.67;
      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const fearRadius = 155;

      for (let i = 0; i < agents.current.length; i++) {
        const s = agents.current[i];
        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.hypot(dx, dy) || 1;

        if (dist < fearRadius && ok.current) {
          const force = ((fearRadius - dist) / fearRadius) * 3.1;
          s.vx += (dx / dist) * force * t;
          s.vy += (dy / dist) * force * t;
          s.scale += (1.1 - s.scale) * 0.1 * t;
          s.rot += ((dx > 0 ? 16 : -16) - s.rot) * 0.07 * t;
        } else {
          const breatheX = Math.sin(now * 0.001 + s.phase) * 8;
          const breatheY = Math.cos(now * 0.00085 + s.phase) * 6;
          s.vx += (s.homeX + breatheX - s.x) * 0.032 * t;
          s.vy += (s.homeY + breatheY - s.y) * 0.032 * t;
          s.scale += (1 - s.scale) * 0.06 * t;
          s.rot += (s.baseRot + Math.sin(now * 0.0014 + s.phase) * 5 - s.rot) * 0.04 * t;
        }

        /* Bir-biridan ozgina itarilish */
        for (let j = i + 1; j < agents.current.length; j++) {
          const o = agents.current[j];
          const ox = s.x - o.x;
          const oy = s.y - o.y;
          const od = Math.hypot(ox, oy) || 1;
          if (od < 90) {
            const push = ((90 - od) / 90) * 0.35 * t;
            s.vx += (ox / od) * push;
            s.vy += (oy / od) * push;
            o.vx -= (ox / od) * push;
            o.vy -= (oy / od) * push;
          }
        }

        s.vx *= Math.pow(0.87, t);
        s.vy *= Math.pow(0.87, t);
        s.x += s.vx * t;
        s.y += s.vy * t;

        const margin = 36;
        s.x = Math.max(margin, Math.min(w - margin, s.x));
        s.y = Math.max(margin + 40, Math.min(h - margin, s.y));

        const el = imgRefs.current[i];
        if (el) {
          const rem = s.size;
          el.style.width = `${rem}rem`;
          el.style.height = `${rem}rem`;
          el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) rotate(${s.rot}deg) scale(${s.scale})`;
        }
      }

      drops.current = drops.current.filter((d) => {
        d.t += dt;
        const p = Math.min(d.t / d.max, 1);
        const ease = 1 - Math.pow(1 - p, 2.4);
        const dark = document.documentElement.classList.contains('dark');

        for (let ring = 0; ring < 2; ring++) {
          const lag = ring * 0.12;
          const rp = Math.max(0, Math.min(1, (p - lag) / (1 - lag)));
          if (rp <= 0) continue;
          const radius = 6 + ease * (38 + ring * 18);
          const alpha = (1 - rp) * (dark ? 0.38 : 0.28) * (ring === 0 ? 1 : 0.55);
          ctx.beginPath();
          ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = dark
            ? `hsla(${198 + ring * 40}, 90%, 70%, ${alpha})`
            : `hsla(${205 + ring * 35}, 85%, 52%, ${alpha})`;
          ctx.lineWidth = 1.1 - rp * 0.6;
          ctx.stroke();
        }

        const coreA = (1 - ease) * (dark ? 0.22 : 0.16);
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, 10 + ease * 16);
        g.addColorStop(0, dark ? `rgba(56,189,248,${coreA})` : `rgba(0,127,255,${coreA})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 10 + ease * 16, 0, Math.PI * 2);
        ctx.fill();

        return p < 1;
      });

      sparks.current = sparks.current.filter((s) => {
        s.life += dt;
        const p = s.life / s.max;
        if (p >= 1) return false;

        const wobble = Math.sin(now * 0.012 + s.x * 0.05) * 0.35;
        s.x += s.vx * (dt * 0.06) + wobble * 0.08;
        s.y += s.vy * (dt * 0.06);
        s.vy -= 0.004 * dt * 0.06;
        s.vx *= 0.992;

        const fade = Math.sin(Math.min(p, 1) * Math.PI);
        const alpha = fade * 0.42;
        const dark = document.documentElement.classList.contains('dark');
        const r = s.r * (1 - p * 0.55);

        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `hsla(${s.hue}, 90%, 72%, ${alpha * 0.22})`
          : `hsla(${s.hue}, 85%, 55%, ${alpha * 0.18})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `hsla(${s.hue}, 95%, 78%, ${alpha})`
          : `hsla(${s.hue}, 90%, 58%, ${alpha * 0.9})`;
        ctx.fill();

        return true;
      });

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mousedown', onDown);
    };
  }, [reduce]);

  return (
    <div className="landing-ambient" aria-hidden>
      {!reduce &&
        P_ICONS.map((_, i) => (
          <img
            key={i}
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            src={icon}
            alt=""
            className="landing-ambient-agent"
            width={120}
            height={120}
            draggable={false}
          />
        ))}
      {!reduce && <canvas ref={canvasRef} className="landing-ambient-canvas" />}
    </div>
  );
}
