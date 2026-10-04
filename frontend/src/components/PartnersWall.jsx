import { PARTENAIRES } from '../data/site.js';
import Reveal from './Reveal.jsx';
import './PartnersWall.css';

const GROUP_TITLES = {
  institutions: 'Institutions',
  partenaires: 'Partenaires et médias',
};

function Logos({ items }) {
  return (
    <ul className="partners__grid">
      {items.map((partner, index) => (
        <Reveal as="li" key={partner.slug} className="partners__item" delay={(index % 6) * 0.05}>
          <img src={`/images/partenaires/${partner.slug}.webp`} alt={partner.name} loading="lazy" />
        </Reveal>
      ))}
    </ul>
  );
}

// Mur de logos : une seule grille continue, ou des groupes titrés (page Partenaires).
export default function PartnersWall({ groups = ['institutions', 'partenaires'], titles = false }) {
  if (!titles) {
    return <Logos items={groups.flatMap((group) => PARTENAIRES[group])} />;
  }
  return (
    <div className="partners">
      {groups.map((group) => (
        <div key={group}>
          <h3 className="partners__title">{GROUP_TITLES[group]}</h3>
          <Logos items={PARTENAIRES[group]} />
        </div>
      ))}
    </div>
  );
}
