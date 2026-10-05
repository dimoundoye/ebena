import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { SCENE } from '../data/site.js';
import Icon from './Icon.jsx';
import { order } from './scene/order.js';
import './SceneProjects.css';

const pad = (value) => String(value).padStart(2, '0');

// La Scène ÉBËNA et ses trois projets ; chacun mène à sa section de la page (#cour-royale…).
export default function SceneProjects() {
  return (
    <div className="container s-scene">
      <div className="s-scene__head">
        <p className="eyebrow build" style={order(0)}>
          {SCENE.subtitle}
        </p>
        <h2 className="scene-title build" style={order(1)}>
          La Scène <em className="text-gold">ÉBËNA</em>
        </h2>
        <p className="lead build" style={order(2)}>
          {SCENE.intro}
        </p>
      </div>
      <ol className="s-scene__list">
        {SCENE.projets.map((projet, index) => (
          <li key={projet.slug} className="build build--left" style={order(1 + index)}>
            <Link to={`#${projet.slug}`} className="s-scene__item">
              <span className="s-scene__num" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <span className="s-scene__text">
                <span className="scene-kicker">
                  <Icon name={projet.icon} /> {projet.kicker}
                </span>
                <span className="s-scene__title">{projet.title}</span>
              </span>
              <ArrowDown className="s-scene__arrow" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
