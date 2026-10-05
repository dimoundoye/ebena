import { Link } from 'react-router-dom';
import { ArrowRight, Crown } from 'lucide-react';
import { COUR_ROYALE, SCENE } from '../data/site.js';
import Icon from './Icon.jsx';
import { order } from './scene/order.js';
import './CourRoyale.css';

// La Cour Royale de Maam, sur fond bordeaux. `full` : texte complet (page Programme),
// sinon un résumé et un lien vers le programme (accueil).
export default function CourRoyale({ full = false }) {
  const projet = SCENE.projets[0];
  return (
    <div className="container s-cour">
      <div className="s-cour__crest build build--zoom" style={order(0)} aria-hidden="true">
        <div className="s-cour__arch">
          <Crown />
          <span className="s-cour__maison">{COUR_ROYALE.maison}</span>
        </div>
      </div>
      <div className="s-cour__text">
        <p className="scene-kicker build" style={order(1)}>
          <Icon name={projet.icon} /> {projet.kicker} · {COUR_ROYALE.artiste}
        </p>
        <h2 className="scene-title build" style={order(2)}>
          {projet.title}
        </h2>
        <p className="scene-quote build" style={order(3)}>
          « {projet.quote} »
        </p>
        {full ? (
          <div className="prose s-cour__prose build" style={order(4)}>
            {COUR_ROYALE.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="lead build" style={order(4)}>
            {COUR_ROYALE.paragraphs[1]}
          </p>
        )}
        <div className="s-cour__vetement">
          <p className="s-cour__label build" style={order(0)}>
            Le vêtement comme
          </p>
          <ul>
            {COUR_ROYALE.vetement.map((item, index) => (
              <li key={item} className="build build--left" style={order(1 + index)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {!full && (
          <Link to="/programme#cour-royale" className="link-arrow build" style={order(2)}>
            Découvrir l’exposition <ArrowRight />
          </Link>
        )}
      </div>
    </div>
  );
}
