import { useLayoutEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PAVILLONS } from '../../data/site.js';
import Button from '../../components/Button.jsx';
import Icon from '../../components/Icon.jsx';
import { order } from '../../components/scene/order.js';
import '../../components/PavillonDoor.css';
import './PavillonsCorridor.css';

// Le couloir des pavillons : chaque pavillon est derrière une porte en arche. En défilant, la porte
// s'approche, ses deux battants s'ouvrent, puis on la traverse et la salle du pavillon remplit
// l'écran ; son contenu défile ensuite normalement, jusqu'à la porte suivante, posée dans le mur
// du fond. Tout suit le défilement, sans jamais le bloquer. Variables posées sur chaque pavillon :
// --a (approche), --o (ouverture), --e (traversée), de 0 à 1 ; --k sur le couloir (agrandissement
// final de l'arche). Pour un défilement fluide, ces variables sont posées sur la scène seule et ne
// changent que des transformations et des opacités (rien à recalculer ni à redessiner).

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
// Salles sombres, où le texte est clair
const DARK_ROOMS = new Set(['memoire', 'numerique', 'musique', 'business']);
// Étapes du passage d'une porte, en fraction de son parcours (de courtes pauses entre elles)
const APPROCHE = [0, 0.38];
const OUVERTURE = [0.42, 0.72];
const TRAVERSEE = [0.76, 1];
// Hauteur du centre de la porte dans l'écran (même valeur que --door-y dans le CSS)
const DOOR_Y = 0.54;

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeInOut = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const progress = (p, [from, to]) => easeInOut(clamp01((p - from) / (to - from)));

// Agrandissement de l'arche à partir duquel elle dépasse les quatre coins de l'écran : on est entré
function traverseeScale(stageWidth, stageHeight, doorWidth, doorHeight) {
  const radius = doorWidth / 2;
  const archCenter = radius - doorHeight / 2;
  const corners = [-DOOR_Y, 1 - DOOR_Y].map((fraction) => [stageWidth / 2, fraction * stageHeight]);
  const covers = (scale) =>
    corners.every(([x, y]) => {
      const localX = x / scale;
      const localY = y / scale;
      if (localX > radius || localY > doorHeight / 2) return false;
      return localY >= archCenter || localX ** 2 + (localY - archCenter) ** 2 <= radius ** 2;
    });
  let low = 1;
  let high = 80;
  for (let i = 0; i < 30; i += 1) {
    const middle = (low + high) / 2;
    if (covers(middle)) high = middle;
    else low = middle;
  }
  // Marge : le cadre doré et les battants ouverts, collés aux montants, sortent eux aussi de l'écran
  return high * 1.3;
}

// Un battant : il porte sa moitié de la porte (la face fait deux fois sa largeur)
function DoorLeaf({ side, pavillon }) {
  return (
    <div className={`pav-walk__leaf pav-walk__leaf--${side}`}>
      <div className="pav-walk__face">
        <span className="pav-door__icon pav-walk__icon">
          <Icon name={pavillon.icon} />
        </span>
        <span className="pav-walk__handles" />
        <span className="pav-door__watermark pav-walk__number">{pavillon.numero}</span>
      </div>
    </div>
  );
}

function PavillonWalk({ pavillon, index }) {
  const previous = PAVILLONS[index - 1];
  const next = PAVILLONS[index + 1];
  const titleId = `${pavillon.slug}-titre`;

  return (
    <section
      id={pavillon.slug}
      className={`pav-walk pav-walk--${pavillon.slug} pav-tone--${pavillon.slug}`}
      data-room={DARK_ROOMS.has(pavillon.slug) ? 'dark' : 'light'}
      // Le mur de la porte est la salle précédente (le couloir, pour la première)
      style={previous ? { '--wall': `var(--room-${previous.slug})` } : undefined}
      aria-labelledby={titleId}
    >
      <div className="pav-walk__track">
        <div className="pav-walk__stage">
          <div className="pav-walk__room">
            <div className="pav-walk__heading">
              <span className="pav-walk__medal" aria-hidden="true">
                <Icon name={pavillon.icon} />
              </span>
              <p className="pav-walk__kicker">
                Pavillon {pavillon.numero} <span>/ {String(PAVILLONS.length).padStart(2, '0')}</span>
              </p>
              <h2 id={titleId} className="pav-walk__title">
                {pavillon.title}
              </h2>
              <p className="pav-walk__quote">« {pavillon.quote} »</p>
            </div>
          </div>

          <div className="pav-walk__door" aria-hidden="true">
            <div className="pav-walk__doorway">
              <DoorLeaf side="left" pavillon={pavillon} />
              <DoorLeaf side="right" pavillon={pavillon} />
            </div>
            <span className="pav-walk__glow" />
            <span className="pav-walk__frame" />
            <span className="pav-walk__ground" />
            <p className="pav-walk__plaque">
              <span>Pavillon {pavillon.numero}</span> {pavillon.short}
            </p>
          </div>
          <div className="pav-walk__vignette" aria-hidden="true" />
        </div>
      </div>

      <div className="pav-walk__content">
        <div className={`container pav-walk__body ${pavillon.list || pavillon.note ? '' : 'pav-walk__body--solo'}`}>
          <div className="prose pav-walk__prose build" style={order(0)}>
            {pavillon.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          {(pavillon.list || pavillon.note) && (
            <div className="pav-walk__extras build" style={order(1)}>
              {pavillon.list && (
                <div>
                  <p className="pav-walk__list-title">{pavillon.listTitle}</p>
                  <ul className="list-cowrie">
                    {pavillon.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {pavillon.note && <p className="pav-walk__note">{pavillon.note}</p>}
            </div>
          )}
        </div>

        <nav className="container pav-walk__nav build" style={order(0)} aria-label="Pavillons voisins">
          {previous ? (
            <Button to={`#${previous.slug}`} variant="link" icon={ArrowLeft} iconStart>
              {previous.short}
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button to={`#${next.slug}`} variant="link" icon={ArrowRight}>
              {next.short}
            </Button>
          ) : (
            <Button to="#scene" variant="link" icon={ArrowRight}>
              La Scène ÉBËNA
            </Button>
          )}
        </nav>
      </div>
    </section>
  );
}

export default function PavillonsCorridor() {
  const rootRef = useRef(null);

  // Mis en place avant l'affichage (et avant SceneFlow) : les portes prennent leur hauteur de parcours
  // sans saut visible, et les sections suivantes sont mesurées à leur vraie place.
  useLayoutEffect(() => {
    const root = rootRef.current;
    // Sans animation : les salles s'affichent directement, sans porte
    if (window.matchMedia(REDUCED_MOTION).matches) return undefined;

    root.dataset.ready = '';
    const walks = [...root.querySelectorAll('.pav-walk')].map((walk) => ({
      walk,
      track: walk.querySelector('.pav-walk__track'),
      stage: walk.querySelector('.pav-walk__stage'),
      values: {},
    }));
    const near = new Set(walks);
    let frame = 0;

    const measure = () => {
      const { stage, walk } = walks[0];
      const doorway = walk.querySelector('.pav-walk__doorway');
      const scale = traverseeScale(stage.clientWidth, stage.clientHeight, doorway.offsetWidth, doorway.offsetHeight);
      root.style.setProperty('--k', scale.toFixed(3));
    };

    const update = () => {
      frame = 0;
      const targets = [...near];
      // Lectures d'abord, écritures ensuite
      const positions = targets.map(({ track, stage }) => {
        const { top, height } = track.getBoundingClientRect();
        return clamp01(-top / Math.max(1, height - stage.offsetHeight));
      });
      // Posées sur la scène seule (pas sur le texte de la salle), et seulement quand elles changent
      targets.forEach(({ stage, values }, index) => {
        const p = positions[index];
        const next = {
          '--a': progress(p, APPROCHE).toFixed(4),
          '--o': progress(p, OUVERTURE).toFixed(4),
          '--e': progress(p, TRAVERSEE).toFixed(4),
        };
        Object.entries(next).forEach(([name, value]) => {
          if (values[name] === value) return;
          values[name] = value;
          stage.style.setProperty(name, value);
        });
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Seules les portes proches de l'écran sont recalculées au défilement, et ont leurs calques
    // préparés pour la carte graphique ([data-near])
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const part = walks.find(({ track }) => track === entry.target);
          if (entry.isIntersecting) near.add(part);
          else near.delete(part);
          part.walk.toggleAttribute('data-near', entry.isIntersecting);
        });
        schedule();
      },
      { rootMargin: '20% 0px 20% 0px' }
    );
    walks.forEach(({ track }) => observer.observe(track));

    const onResize = () => {
      measure();
      walks.forEach((part) => near.add(part));
      schedule();
    };

    measure();
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      walks.forEach(({ walk }) => walk.removeAttribute('data-near'));
      delete root.dataset.ready;
    };
  }, []);

  return (
    <div className="pav-corridor" ref={rootRef}>
      {PAVILLONS.map((pavillon, index) => (
        <PavillonWalk key={pavillon.slug} pavillon={pavillon} index={index} />
      ))}
    </div>
  );
}
