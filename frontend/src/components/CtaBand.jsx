import { EVENT } from '../data/site.js';
import Button from './Button.jsx';
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
          <div className="cta-band__content">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="h2">{title}</h2>
            <p className="lead">{text}</p>
          </div>
          <div className="cta-band__actions">
            <Button to={primary.to} size="lg">
              {primary.label}
            </Button>
            {secondary && (
              <Button to={secondary.to} variant="ghost" size="lg">
                {secondary.label}
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
