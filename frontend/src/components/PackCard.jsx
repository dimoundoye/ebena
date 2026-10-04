import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { formatPrix } from '../data/site.js';
import Icon from './Icon.jsx';
import './PackCard.css';

// Carte d'une formule exposant (Silver, Gold, Platinum) reprenant les rubans métalliques des flyers.
export default function PackCard({ pack, compact = false, selected = false, onSelect }) {
  const features = compact ? pack.features.slice(0, 4) : pack.features;
  const hidden = pack.features.length - features.length;

  return (
    <article className={`pack-card pack-card--${pack.id} ${pack.featured ? 'is-featured' : ''} ${selected ? 'is-selected' : ''}`.trim()}>
      <header className="pack-card__head">
        <p className="pack-card__kicker">Formule exposant</p>
        <h3 className="pack-card__ribbon">
          <span className="pack-card__ribbon-light">Pack</span> {pack.name}
        </h3>
        <p className="pack-card__price">
          {formatPrix(pack.prix)} <small>HT</small>
        </p>
        <p className="pack-card__surface">Stand de {pack.surface}</p>
      </header>

      <ul className="pack-card__features">
        {features.map((feature) => (
          <li key={feature.title}>
            <span className="pack-card__icon">
              <Icon name={feature.icon} />
            </span>
            <span>
              <strong>{feature.title}</strong> {feature.detail}
            </span>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <p className="pack-card__more">
          + {hidden} {hidden > 1 ? 'autres avantages inclus' : 'autre avantage inclus'}
        </p>
      )}

      <p className="pack-card__accroche">{pack.accroche}</p>

      <div className="pack-card__footer">
        {onSelect ? (
          <button
            type="button"
            className={`btn ${selected ? 'btn--dark' : pack.featured ? 'btn--gold' : 'btn--ghost'} btn--block`}
            onClick={() => onSelect(pack.id)}
            aria-pressed={selected}
          >
            {selected ? (
              <>
                <Check /> Pack sélectionné
              </>
            ) : (
              <>
                Choisir le pack {pack.name} <ArrowRight />
              </>
            )}
          </button>
        ) : (
          <Link to={`/exposants?pack=${pack.id}#reservation`} className={`btn ${pack.featured ? 'btn--gold' : 'btn--ghost'} btn--block`}>
            Réserver ce pack <ArrowRight />
          </Link>
        )}
      </div>
    </article>
  );
}
