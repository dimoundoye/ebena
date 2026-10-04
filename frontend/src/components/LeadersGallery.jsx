import { LEADERS } from '../data/site.js';
import Reveal from './Reveal.jsx';
import './LeadersGallery.css';

// Affiches « La Méthode des Leaders » en galerie décalée.
export default function LeadersGallery() {
  return (
    <ul className="leaders">
      {LEADERS.map((leader, index) => (
        <Reveal as="li" key={leader.slug} className="leader" delay={(index % 3) * 0.1}>
          <figure>
            <div className="leader__poster">
              <img
                src={`/images/leaders/${leader.slug}.webp`}
                alt={`${leader.name} — ${leader.role}`}
                loading="lazy"
                width="615"
                height="922"
              />
            </div>
            <figcaption className="leader__caption">
              <span className="leader__name">{leader.name}</span>
              <span className="leader__meta">
                {leader.role} · <strong>{leader.pays}</strong>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
