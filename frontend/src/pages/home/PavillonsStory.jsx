import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PAVILLONS } from '../../data/site.js';
import Icon from '../../components/Icon.jsx';
import '../../components/PavillonDoor.css';

// Les six pavillons défilent normalement ; sur grand écran, une porte en arche reste à côté
// du texte et change de panneau quand un nouveau pavillon passe au centre de l'écran.
export default function PavillonsStory() {
  const [active, setActive] = useState(0);
  const itemsRef = useRef([]);

  useEffect(() => {
    // Le pavillon actif est celui qui croise la ligne médiane de l'écran
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    itemsRef.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pav-story" style={{ '--f': active }}>
      <div className="pav-story__visual" aria-hidden="true">
        <div className="pav-story__frame arch-frame">
          <div className="arch pav-story__arch">
            {PAVILLONS.map((pavillon, index) => (
              <div key={pavillon.slug} className={`pav-story__panel pav-tone--${pavillon.slug}`} style={{ '--i': index }}>
                <span className="pav-door__watermark">{pavillon.numero}</span>
                <span className="pav-door__icon">
                  <Icon name={pavillon.icon} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="pav-story__counter">
          <span className="pav-story__digits">
            <span className="pav-story__roll">
              {PAVILLONS.map((pavillon) => (
                <span key={pavillon.slug}>{pavillon.numero}</span>
              ))}
            </span>
          </span>
          <span className="pav-story__total">/ {String(PAVILLONS.length).padStart(2, '0')}</span>
        </p>
      </div>

      <ol className="pav-story__items">
        {PAVILLONS.map((pavillon, index) => (
          <li
            key={pavillon.slug}
            id={`pavillon-${pavillon.slug}`}
            ref={(element) => {
              itemsRef.current[index] = element;
            }}
            data-index={index}
            className={`pav-story__item ${index === active ? 'is-active' : ''}`.trim()}
          >
            {/* Petite porte propre à chaque pavillon, affichée sur mobile à la place de la grande */}
            <span className={`pav-story__mini pav-tone--${pavillon.slug}`} aria-hidden="true">
              <Icon name={pavillon.icon} />
            </span>
            <p className="scene-kicker">Pavillon {pavillon.numero}</p>
            <h3 className="pav-story__title">{pavillon.short}</h3>
            <p className="scene-quote">« {pavillon.quote} »</p>
            <p className="pav-story__excerpt">{pavillon.excerpt}</p>
            <Link to={`/programme#${pavillon.slug}`} className="link-arrow">
              Explorer le pavillon <ArrowUpRight />
              <span className="sr-only"> {pavillon.short}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
