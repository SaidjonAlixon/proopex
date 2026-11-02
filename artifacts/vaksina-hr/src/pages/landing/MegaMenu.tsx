import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MEGA_FEATURE, MEGA_MODULES, type MegaItem } from './data';

const TONE: Record<MegaItem['tone'], string> = {
  cyan: 'landing-mega-ico--cyan',
  violet: 'landing-mega-ico--violet',
  magenta: 'landing-mega-ico--magenta',
  azure: 'landing-mega-ico--azure',
  emerald: 'landing-mega-ico--emerald',
  amber: 'landing-mega-ico--amber',
  rose: 'landing-mega-ico--rose',
  indigo: 'landing-mega-ico--indigo',
};

type Props = {
  open: boolean;
  onClose: () => void;
  onGo: (id: string) => void;
};

export function MegaMenu({ open, onClose, onGo }: Props) {
  if (!open) return null;

  const goAll = () => {
    onGo('imkoniyatlar');
    onClose();
  };

  return (
    <div className="landing-mega" role="dialog" aria-label="Imkoniyatlar menyusi" data-landing-mega="">
      <button
        type="button"
        className="landing-mega-backdrop"
        aria-label="Yopish"
        onClick={onClose}
      />
      <div className="landing-mega-panel" data-landing-mega="">
        <header className="landing-mega-head">
          <div className="landing-mega-head-copy">
            <span className="landing-mega-badge">{MEGA_FEATURE.badge}</span>
            <div>
              <h3 className="landing-mega-feature-title">{MEGA_FEATURE.title}</h3>
              <p className="landing-mega-feature-text">{MEGA_FEATURE.text}</p>
            </div>
          </div>
          <button type="button" className="landing-mega-feature-cta" onClick={goAll}>
            {MEGA_FEATURE.cta}
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <div className="landing-mega-grid">
          {MEGA_MODULES.map((m) => (
            <button
              key={m.title}
              type="button"
              className="landing-mega-item"
              onClick={goAll}
            >
              <span className={cn('landing-mega-ico', TONE[m.tone])}>
                <m.icon className="h-3.5 w-3.5" />
              </span>
              <span className="landing-mega-item-copy">
                <span className="landing-mega-item-title">{m.title}</span>
                <span className="landing-mega-item-desc">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
