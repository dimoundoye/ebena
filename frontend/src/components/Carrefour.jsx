import { useEffect, useRef, useState } from 'react';
import { CARREFOUR } from '../data/site.js';
import { HEIGHT, WIDTH, project } from './carrefour/projection.js';
import './Carrefour.css';

const SMALL = '(max-width: 700px)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
// Sur petit écran, la carte se resserre sur l'Afrique et l'Europe (du milieu de l'Atlantique à la mer
// Rouge) : l'arc des Amériques entre par le bord
const [SMALL_LEFT] = project(-45, 0);
const [SMALL_RIGHT] = project(55, 0);
const VIEWS = { large: { x: 0, width: WIDTH }, small: { x: SMALL_LEFT, width: SMALL_RIGHT - SMALL_LEFT } };

const HUB = project(CARREFOUR.hub.lon, CARREFOUR.hub.lat);

// Arc jusqu'à Nantes, courbé à gauche du trajet : au-dessus de l'Atlantique depuis l'Afrique, vers le
// nord depuis les Amériques. Plus le départ est à l'ouest de Nantes, plus l'arc s'écarte : les routes
// venues d'Afrique de l'Ouest s'ouvrent en éventail au lieu de se superposer.
function arcTo([x1, y1], lon) {
  const [x2, y2] = HUB;
  const bend = Math.min(0.34, 0.1 + 0.016 * Math.max(0, CARREFOUR.hub.lon - lon));
  const cx = (x1 + x2) / 2 + (y2 - y1) * bend;
  const cy = (y1 + y2) / 2 - (x2 - x1) * bend;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

const COUNTRIES = CARREFOUR.pays.map((pays) => {
  const point = project(pays.lon, pays.lat);
  return { ...pays, point, arc: arcTo(point, pays.lon) };
});

// « Le Carrefour » : rien que la carte, d'un bord à l'autre de l'écran. Les pays d'où viennent
// intervenants, créateurs et institutions sont reliés à Nantes par des arcs dorés où filent des
// lueurs ; survoler ou toucher un pays fait ressortir sa route.
export default function Carrefour() {
  const rootRef = useRef(null);
  const [dots, setDots] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [reduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches);
  const [small, setSmall] = useState(() => window.matchMedia(SMALL).matches);

  // Points des continents : chargés à part (quelques Ko compressés) quand la section approche
  useEffect(() => {
    let alive = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import('../data/carrefour-carte.json').then(({ default: carte }) => {
          if (alive) setDots({ all: Object.values(carte.dots).join(''), byCode: carte.dots });
        });
      },
      { rootMargin: '100% 0px' }
    );
    observer.observe(rootRef.current);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia(SMALL);
    const onChange = () => setSmall(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const view = small ? VIEWS.small : VIEWS.large;
  const place = ([x, y]) => ({ left: `${((x - view.x) / view.width) * 100}%`, top: `${(y / HEIGHT) * 100}%` });
  const flag = (condition) => (condition ? '' : undefined);

  return (
    <div className="s-carrefour" ref={rootRef} data-selected={flag(hovered)}>
      <h2 className="sr-only">{CARREFOUR.title}</h2>
      <p className="sr-only">
        Pays reliés à Nantes sur la carte :{' '}
        {COUNTRIES.map((item) => (item.honneur ? `${item.name} (pays invité d’honneur)` : item.name)).join(', ')}.
      </p>

      <div className="s-carrefour__map build build--fade" onMouseLeave={() => setHovered(null)}>
        <svg className="s-carrefour__svg" viewBox={`${view.x} 0 ${view.width} ${HEIGHT}`} aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="carrefour-light">
              <stop offset="0" stopColor="#fff6dc" />
              <stop offset="0.35" stopColor="#f6cb74" stopOpacity="0.9" />
              <stop offset="1" stopColor="#f6cb74" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="s-carrefour__dots" data-loaded={flag(dots)}>
            {dots && <path className="s-carrefour__land" d={dots.all} />}
            {dots &&
              COUNTRIES.map((item) => (
                <path key={item.slug} className="s-carrefour__country" data-active={flag(hovered === item.slug)} d={dots.byCode[item.code] ?? ''} />
              ))}
          </g>

          {COUNTRIES.map((item, index) => (
            <g
              key={item.slug}
              className="s-carrefour__route"
              data-active={flag(hovered === item.slug)}
              data-honneur={flag(item.honneur)}
              style={{ '--i': index }}
            >
              <path className="s-carrefour__glow" d={item.arc} />
              <path className="s-carrefour__arc" d={item.arc} pathLength="1" />
              {/* Une lueur file vers Nantes ; départs décalés (débuts négatifs : déjà en route) */}
              {!reduced && (
                <g className="s-carrefour__light">
                  <circle r="7" fill="url(#carrefour-light)">
                    <animateMotion
                      dur="3.6s"
                      begin={`-${index * 0.7}s`}
                      repeatCount="indefinite"
                      path={item.arc}
                      keyPoints="0;1"
                      keyTimes="0;1"
                      calcMode="spline"
                      keySplines="0.45 0 0.25 1"
                    />
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="3.6s" begin={`-${index * 0.7}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </g>
          ))}

          <g className="s-carrefour__hub" transform={`translate(${HUB[0].toFixed(1)} ${HUB[1].toFixed(1)})`}>
            <circle className="s-carrefour__pulse" r="5" />
            <circle className="s-carrefour__pulse s-carrefour__pulse--late" r="5" />
            <circle className="s-carrefour__hub-dot" r="4" />
          </g>
        </svg>

        <div className="s-carrefour__markers" aria-hidden="true">
          {COUNTRIES.filter((item) => item.point[0] >= view.x).map((item) => (
            <button
              key={item.slug}
              type="button"
              tabIndex={-1}
              className="s-carrefour__marker"
              data-side={item.label}
              data-active={flag(hovered === item.slug)}
              style={place(item.point)}
              onMouseEnter={() => setHovered(item.slug)}
              onClick={() => setHovered((current) => (current === item.slug ? null : item.slug))}
            >
              <span className="s-carrefour__marker-label">{item.name}</span>
            </button>
          ))}
          <span className="s-carrefour__hub-label" style={place(HUB)}>
            {CARREFOUR.hub.name}
          </span>
        </div>
      </div>
    </div>
  );
}
