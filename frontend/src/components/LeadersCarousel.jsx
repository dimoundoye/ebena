import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { LEADERS, SCENE } from '../data/site.js';
import { order } from './scene/order.js';
import './LeadersCarousel.css';

const AUTOPLAY_DELAY = 6000;
// À partir de cette largeur, les intervenants défilent avec la page (voir LeadersCarousel.css)
const SCROLL_QUERY = '(min-width: 901px)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const position = (index, current) => (index < current ? 'before' : index === current ? 'current' : 'after');
const pad = (value) => String(value).padStart(2, '0');

// Nom découpé en lettres qui se recomposent ; le lecteur d'écran lit le nom entier.
function Letters({ text }) {
  let count = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="letters" aria-hidden="true">
        {text.split(' ').map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            {wordIndex > 0 && ' '}
            <span className="letters__word">
              {[...word].map((char) => (
                <span key={count} className="letters__char" style={{ '--l': count++ }}>
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}

// « La Méthode des Leaders ». Sur grand écran, les noms défilent avec la page et les affiches,
// fixées à côté, tournent vers l'intervenant qui passe au centre de l'écran : la molette ou le
// pavé tactile suffisent. Sur petit écran, c'est un carrousel qui défile tout seul quand il est
// à l'écran, jusqu'à ce que le visiteur s'en serve (flèches, glisser, clavier).
// `heading` : afficher le titre et la devise du cycle (sinon la page les donne déjà).
export default function LeadersCarousel({ heading = true }) {
  const count = LEADERS.length;
  const projet = SCENE.projets[2];
  const rootRef = useRef(null);
  const itemsRef = useRef([]);
  const pointer = useRef(null);
  const [current, setCurrent] = useState(0);
  const [scrollMode, setScrollMode] = useState(() => window.matchMedia(SCROLL_QUERY).matches);
  const [autoplay, setAutoplay] = useState(() => !window.matchMedia(REDUCED_MOTION).matches);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(SCROLL_QUERY);
    const onChange = () => setScrollMode(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Grand écran : l'intervenant en cours est celui dont le bloc couvre le milieu de l'écran.
  // Recalculé quand un bloc franchit ce milieu ou quand le carrousel entre à l'écran.
  useEffect(() => {
    if (!scrollMode) return undefined;
    const items = itemsRef.current;
    const sync = () => {
      const middle = window.innerHeight / 2;
      const reached = items.filter((item) => item.getBoundingClientRect().top <= middle).length;
      setCurrent(Math.max(0, reached - 1));
    };
    const midline = new IntersectionObserver(sync, { rootMargin: '-50% 0px -50% 0px' });
    const entering = new IntersectionObserver(sync);
    items.forEach((item) => midline.observe(item));
    entering.observe(rootRef.current);
    return () => {
      midline.disconnect();
      entering.disconnect();
    };
  }, [scrollMode]);

  // Petit écran : défilement automatique tant que le carrousel est à l'écran
  useEffect(() => {
    if (scrollMode) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [scrollMode]);

  useEffect(() => {
    if (scrollMode || !autoplay || !visible || hovered) return undefined;
    const timer = setTimeout(() => setCurrent((index) => (index + 1) % count), AUTOPLAY_DELAY);
    return () => clearTimeout(timer);
  }, [autoplay, count, current, hovered, scrollMode, visible]);

  const show = (index) => {
    const target = Math.min(count - 1, Math.max(0, index));
    if (scrollMode) {
      // La page défile jusqu'au nom choisi ; les affiches suivent
      const behavior = window.matchMedia(REDUCED_MOTION).matches ? 'auto' : 'smooth';
      itemsRef.current[target].scrollIntoView({ behavior, block: 'center' });
      return;
    }
    setCurrent(target);
    setAutoplay(false);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  };

  // Glisser horizontalement (doigt ou souris) pour changer d'intervenant
  const onPointerDown = (event) => {
    pointer.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(event.clientY - start.y)) show(current + (dx < 0 ? 1 : -1));
  };

  // Les éléments propres à chaque mode sont toujours rendus (le CSS masque les autres) :
  // SceneFlow ne repère les .build qu'une fois, au chargement de la page.
  return (
    <div
      ref={rootRef}
      className="leaders-show"
      data-mode={scrollMode ? 'scroll' : 'carousel'}
      style={{ '--f': current }}
      role="group"
      aria-roledescription={scrollMode ? undefined : 'carrousel'}
      aria-label="Les intervenants de la Méthode des Leaders"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="leaders-show__text">
        {heading && (
          <>
            <h2 className="eyebrow build" style={order(0)}>
              {projet.title}
            </h2>
            <p className="leaders-show__motto build" style={order(1)}>
              {projet.quote}
            </p>
          </>
        )}

        <p className="leaders-show__counter build" style={order(2)} aria-hidden="true">
          <span className="leaders-show__counter-label">Intervenant</span>
          <span className="leaders-show__digits">
            <span className="leaders-show__roll">
              {LEADERS.map((leader, index) => (
                <span key={leader.slug}>{pad(index + 1)}</span>
              ))}
            </span>
          </span>
          <span className="leaders-show__total">/ {pad(count)}</span>
        </p>

        <ol className="leaders-show__items" aria-live={scrollMode || autoplay ? 'off' : 'polite'}>
          {LEADERS.map((leader, index) => (
            <li
              key={leader.slug}
              ref={(element) => {
                itemsRef.current[index] = element;
              }}
              className="leaders-show__item"
              data-pos={position(index, current)}
              aria-hidden={!scrollMode && index !== current ? 'true' : undefined}
            >
              <p className="leaders-show__counter leaders-show__index" aria-hidden="true">
                <span className="leaders-show__counter-label">Intervenant</span>
                <span className="leaders-show__digits">{pad(index + 1)}</span>
                <span className="leaders-show__total">/ {pad(count)}</span>
              </p>
              <h3 className="leaders-show__name">
                <Letters text={leader.name} />
              </h3>
              <p className="leaders-show__role">{leader.role}</p>
              <p className="leaders-show__pays">{leader.pays}</p>
            </li>
          ))}
        </ol>

        <div className="leaders-show__controls build" style={order(3)}>
          <button
            type="button"
            className="leaders-show__button"
            onClick={() => show(current - 1)}
            disabled={current === 0}
            aria-label="Intervenant précédent"
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="leaders-show__button"
            onClick={() => show(current + 1)}
            disabled={current === count - 1}
            aria-label="Intervenant suivant"
          >
            <ArrowRight aria-hidden="true" />
          </button>
          <button
            type="button"
            className="leaders-show__play"
            onClick={() => setAutoplay((value) => !value)}
            aria-label={autoplay ? 'Arrêter le défilement automatique' : 'Relancer le défilement automatique'}
          >
            {autoplay ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
        </div>

        <Link to="/programme#leaders" className="link-arrow build" style={order(4)}>
          Le cycle en détail <ArrowRight />
        </Link>
      </div>

      {/* Une seule entrée en scène pour les affiches et les vignettes : sur grand écran, ce bloc
          reste fixe et des vignettes au bas de l'écran ne seraient jamais « entrées » */}
      <div className="leaders-show__stage build build--fade" style={order(1)}>
        <div className="leaders-show__viewport" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <div className="leaders-show__flow">
            {LEADERS.map((leader, index) => (
              <figure key={leader.slug} className="leaders-show__poster" style={{ '--i': index }} onClick={() => show(index)} aria-hidden="true">
                <img src={`/images/leaders/${leader.slug}.webp`} alt="" width="615" height="922" loading="lazy" decoding="async" draggable="false" />
              </figure>
            ))}
          </div>
        </div>

        <ol className="leaders-show__thumbs" aria-label="Choisir un intervenant">
          {LEADERS.map((leader, index) => (
            <li key={leader.slug}>
              <button
                type="button"
                className="leaders-show__thumb"
                onClick={() => show(index)}
                aria-current={index === current ? 'true' : undefined}
                title={leader.name}
              >
                <img src={`/images/leaders/${leader.slug}.webp`} alt="" width="615" height="922" loading="lazy" decoding="async" />
                <span className="sr-only">{leader.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
