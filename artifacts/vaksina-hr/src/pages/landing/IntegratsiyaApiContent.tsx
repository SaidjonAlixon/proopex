import { BookOpen, CheckCircle2, Shield } from 'lucide-react';
import { INTEGRATION_BRIDGES } from './data';
import { ApiFlowDemo } from './ApiFlowDemo';
import { Reveal, RevealItem } from './Reveal';

const DOCS = [
  {
    id: 'kirish',
    title: 'Kirish',
    body: 'PROOPEX integratsiya va API — boshqa dastur yoki platformadan ma’lumot olish va PROOPEX bazasidan API orqali ma’lumot berish uchun. Hammasi bitta baza atrofida.',
  },
] as const;

/** Integratsiya/API — landing ichida to‘liq ko‘rinadi */
export function IntegratsiyaApiContent() {
  return (
    <div className="landing-api-inline">
      <Reveal>
        <div className="landing-bridge-head mx-auto max-w-3xl text-center">
          <p className="landing-eyebrow justify-center">Integratsiya va API</p>
          <h3 className="landing-bridge-title">Ma’lumot olish va API berish</h3>
          <p className="landing-bridge-lead mx-auto">
            Platforma boshqa joydan ma’lumot oladi va bazadan boshqa dastur hamda
            platformalarga API beradi — oqim, hujjat va jadval shu yerda.
          </p>
        </div>
      </Reveal>

      <div className="mt-8">
        <Reveal>
          <ApiFlowDemo />
        </Reveal>
      </div>

      <div className="mt-10">
        <h4 className="api-docs-h2 justify-center sm:justify-start">
          <BookOpen className="h-5 w-5" />
          Qisqa hujjat
        </h4>
        <div className="api-docs-blocks mt-4">
          {DOCS.map((d, i) => (
            <RevealItem key={d.id} index={i}>
              <article className="api-docs-block">
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </article>
            </RevealItem>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h4 className="api-docs-h2 justify-center sm:justify-start">
          <Shield className="h-5 w-5" />
          Boshqa dastur va platforma
        </h4>
        <div className="api-docs-bridges mt-4">
          {INTEGRATION_BRIDGES.map((it, i) => (
            <RevealItem key={it.title} index={i}>
              <article className="landing-bridge-card h-full">
                <div className="landing-feature-icon">
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="landing-bridge-card-title">{it.title}</h3>
                <p className="landing-bridge-card-text">{it.text}</p>
                <ul className="landing-bridge-list">
                  {it.points.map((p) => (
                    <li key={p}>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </div>
      </div>
    </div>
  );
}
