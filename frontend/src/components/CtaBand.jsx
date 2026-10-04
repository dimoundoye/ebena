import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EVENT } from '../data/site.js';
import Reveal from './Reveal.jsx';
import './CtaBand.css';

export default function CtaBand({
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
    <section className="cta-band">
      <div className="container">
        <Reveal className="cta-band__panel">
          <div className="cta-band__band band-zigzag-v" aria-hidden="true" />
          <div className="cta-band__content">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="h2">{title}</h2>
            <p className="lead">{text}</p>
          </div>
          <div className="cta-band__actions">
            <Link to={primary.to} className="btn btn--dark">
              {primary.label} <ArrowRight />
            </Link>
            {secondary && (
              <Link to={secondary.to} className="btn btn--ghost">
                {secondary.label}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
