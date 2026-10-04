import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { EXPOSITIONS, PAVILLONS } from '../data/site.js';
import SectionHeading from './SectionHeading.jsx';
import Icon from './Icon.jsx';
import './PavillonsTraversee.css';

// « La traversée » : les six pavillons se parcourent horizontalement, comme une enfilade de portes.
export default function PavillonsTraversee() {
  const trackRef = useRef(null);
  const [state, setState] = useState({ progress: 0, canPrev: false, canNext: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setState({
        progress: max > 0 ? track.scrollLeft / max : 1,
        canPrev: track.scrollLeft > 4,
        canNext: track.scrollLeft < max - 4,
      });
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const go = (direction) => {
    const track = trackRef.current;
    const card = track?.querySelector('.pavillon-card');
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track?.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section className="traversee section" aria-labelledby="traversee-titre">
      <div className="container traversee__head">
        <SectionHeading
          eyebrow={EXPOSITIONS.title}
          title={
            <span id="traversee-titre">
              Six univers, <em className="text-gold">six portes d’entrée</em>
            </span>
          }
          intro={EXPOSITIONS.intro}
        />
        <div className="traversee__controls">
          <button type="button" className="round-button" onClick={() => go(-1)} disabled={!state.canPrev} aria-label="Pavillon précédent">
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" className="round-button" onClick={() => go(1)} disabled={!state.canNext} aria-label="Pavillon suivant">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="traversee__track" ref={trackRef} tabIndex={0} role="region" aria-label="Les six pavillons thématiques (défilement horizontal)">
        {PAVILLONS.map((pavillon) => (
          <article key={pavillon.slug} className="pavillon-card">
            <div className="pavillon-card__top">
              <span className="pavillon-card__number" aria-hidden="true">
                {pavillon.numero}
              </span>
              <span className="icon-medallion">
                <Icon name={pavillon.icon} />
              </span>
            </div>
            <p className="pavillon-card__kicker">Pavillon {pavillon.numero}</p>
            <h3 className="pavillon-card__title">{pavillon.short}</h3>
            <p className="pavillon-card__quote">« {pavillon.quote} »</p>
            <p className="pavillon-card__excerpt">{pavillon.excerpt}</p>
            <Link to={`/programme#${pavillon.slug}`} className="pavillon-card__link link-arrow">
              Explorer <ArrowUpRight />
              <span className="sr-only"> le pavillon {pavillon.short}</span>
            </Link>
          </article>
        ))}
        <article className="pavillon-card pavillon-card--cta">
          <p className="pavillon-card__kicker">Exposants</p>
          <h3 className="pavillon-card__title">Exposez dans l’un des six pavillons</h3>
          <p className="pavillon-card__excerpt">
            Artisans, créateurs, entreprises, start-up : choisissez la formule qui correspond à vos ambitions.
          </p>
          <Link to="/exposants" className="btn btn--dark pavillon-card__cta">
            Réserver un stand <ArrowRight />
          </Link>
        </article>
      </div>

      <div className="container">
        <div className="traversee__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(0.08, state.progress)})` }} />
        </div>
        <p className="traversee__ambition">{EXPOSITIONS.ambition}</p>
      </div>
    </section>
  );
}
