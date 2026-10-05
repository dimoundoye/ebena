import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EVENT } from '../data/site.js';
import { CowriePair } from './Cowrie.jsx';
import { order } from './scene/order.js';
import './ClosingCta.css';

// Dernière section d'une page en scènes : appel à l'action, à placer dans une <Scene tone="soleil">.
export default function ClosingCta({
  eyebrow = 'Rendez-vous à Nantes',
  title = (
    <>
      Trois jours pour célébrer <em className="text-gold">l’Afrique créative</em>
    </>
  ),
  text = `${EVENT.datesLong} au ${EVENT.venue}, à ${EVENT.city}.`,
  primary = { to: '/inscription', label: 'Je m’inscris' },
  secondary = { to: '/exposants', label: 'Devenir exposant' },
}) {
  return (
    <div className="container closing-cta">
      <div className="build build--fade" style={order(0)} aria-hidden="true">
        <CowriePair className="closing-cta__cowries" />
      </div>
      <p className="eyebrow eyebrow--center build" style={order(1)}>
        {eyebrow}
      </p>
      <h2 className="scene-title build" style={order(2)}>
        {title}
      </h2>
      {text && (
        <p className="lead build" style={order(3)}>
          {text}
        </p>
      )}
      <div className="closing-cta__actions build" style={order(4)}>
        <Link to={primary.to} className="btn btn--dark">
          {primary.label} <ArrowRight />
        </Link>
        {secondary && (
          <Link to={secondary.to} className="btn btn--ghost">
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}
