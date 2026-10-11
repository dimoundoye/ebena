import { useEffect, useRef, useState } from 'react';
import { ARCH_CLOSED, ARCH_OPEN, EASE_IN, EASE_IN_OUT, EASE_OUT } from './arch.js';
import './PageDoor.css';
import './Intro.css';

const STORAGE_KEY = 'ebena-intro';
const LOGO = '/images/logo-ebena.webp';
// Lueur du logo sur fond ébène, puis ombre du logo de l'accueil (.hero__title) à l'arrivée
const GLOW = 'drop-shadow(0 0 28px rgba(246, 203, 116, 0.3))';
const HERO_SHADOW = 'drop-shadow(0 18px 26px rgba(138, 84, 18, 0.22))';

// Chute d'un cauri sur le Ë : il accélère en tombant, puis rebondit un peu
const DROP = [
  { opacity: 0, transform: 'translateY(-170%)', easing: 'cubic-bezier(0.5, 0, 0.9, 0.4)' },
  { opacity: 1, transform: 'translateY(0)', offset: 0.6, easing: 'cubic-bezier(0.1, 0.6, 0.4, 1)' },
  { opacity: 1, transform: 'translateY(-12%)', offset: 0.8, easing: 'cubic-bezier(0.5, 0, 0.9, 0.4)' },
  { opacity: 1, transform: 'translateY(0)' },
];

// Ouverture du site, à la première arrivée sur l'accueil d'une visite : « bois d'ébène » se barre
// et s'efface, le logo ÉBËNA apparaît, ses deux cauris tombent sur le Ë, puis le logo rejoint sa
// place dans l'accueil pendant qu'une arche s'ouvre sur la page. index.html décide de la jouer
// (html[data-intro="play"]) avant le chargement de React ; un clic, une touche ou un défilement la
// fait passer directement à l'arrivée.
export default function Intro() {
  const [active] = useState(() => document.documentElement.dataset.intro === 'play');
  const [over, setOver] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const html = document.documentElement;
    const root = rootRef.current;
    const $ = (selector) => root.querySelector(selector);
    const running = new Set();
    let skipping = false;
    let cancelled = false;
    let timer = 0;
    let wake = () => {};

    // Réaffirmé ici : en développement, React rejoue l'effet après un premier nettoyage
    html.dataset.intro = 'play';
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Stockage indisponible (navigation privée stricte) : l'ouverture sera rejouée
    }

    const animate = (element, keyframes, options) => {
      const animation = element.animate(keyframes, { easing: EASE_OUT, fill: 'both', ...options });
      running.add(animation);
      const forget = () => running.delete(animation);
      animation.finished.then(forget, forget);
      if (skipping) animation.finish();
      return animation;
    };

    // Pause du scénario ; « Passer » la termine aussitôt, le démontage la laisse en suspens
    const wait = (ms) =>
      new Promise((resolve) => {
        if (skipping) {
          resolve();
          return;
        }
        timer = setTimeout(resolve, ms);
        wake = () => {
          clearTimeout(timer);
          resolve();
        };
      });

    const skip = () => {
      if (skipping || html.dataset.intro !== 'play') return;
      skipping = true;
      running.forEach((animation) => animation.finish());
      wake();
    };

    const land = async () => {
      skipping = false; // l'arrivée reste animée, même après « Passer »
      html.dataset.intro = 'landing';
      const logo = $('.intro__logo');
      const target = document.querySelector('.hero__title img');
      const duration = 1050;
      const moves = [
        animate($('.intro__glow'), [{ opacity: 1 }, { opacity: 0 }], { duration: 500 }),
        animate($('.arch-window'), [ARCH_CLOSED, ARCH_OPEN], { duration, easing: EASE_IN_OUT }),
      ];
      if (target) {
        // Le logo vole jusqu'à celui de l'accueil, qui prend le relais une fois posé
        const from = logo.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const move = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})`;
        moves.push(
          animate(logo, [{ transform: 'none', filter: GLOW }, { transform: move, filter: HERO_SHADOW }], { duration, easing: EASE_IN_OUT })
        );
      } else {
        moves.push(animate(logo, [{ opacity: 1 }, { opacity: 0 }], { duration: 500 }));
      }
      await Promise.all(moves.map((animation) => animation.finished)).catch(() => {});
      if (cancelled) return;
      html.dataset.intro = 'landed';
      setOver(true);
    };

    const play = async () => {
      const phrase = $('.intro__phrase');
      animate(phrase, [{ opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], {
        duration: 700,
        delay: 150,
      });
      await wait(950);
      animate($('.intro__strike'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 450, easing: EASE_IN_OUT });
      await wait(600);
      animate(phrase, [{ opacity: 1, transform: 'none', filter: 'blur(0px)' }, { opacity: 0, transform: 'translateY(-12px)', filter: 'blur(10px)' }], {
        duration: 500,
        easing: EASE_IN,
      });
      await wait(250);
      animate($('.intro__reveal'), [{ clipPath: 'inset(-30% 100% -30% 0)' }, { clipPath: 'inset(-30% 0% -30% 0)' }], {
        duration: 900,
        easing: EASE_IN_OUT,
      });
      animate($('.intro__sheen span'), [{ transform: 'translateX(-60%)' }, { transform: 'translateX(60%)' }], {
        duration: 1500,
        delay: 300,
        easing: EASE_IN_OUT,
      });
      await wait(750);
      const [left, right] = root.querySelectorAll('.intro__cowrie');
      animate(left, DROP, { duration: 720, easing: 'linear' });
      await wait(150);
      animate(right, DROP, { duration: 720, easing: 'linear' });
      await wait(900);
      await land();
    };

    const onKeyDown = (event) => {
      if (!event.ctrlKey && !event.metaKey && !event.altKey) skip();
    };
    const onVisibility = () => document.hidden && skip();
    root.addEventListener('click', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', onVisibility);

    play();
    // Site ouvert dans un onglet en arrière-plan : personne ne la verrait
    if (document.hidden) skip();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      running.forEach((animation) => animation.cancel());
      root.removeEventListener('click', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', onVisibility);
      // En quittant l'accueil (même en pleine ouverture) : défilement rendu et logo de l'accueil
      // de nouveau animé à la prochaine visite de la page
      delete html.dataset.intro;
    };
  }, [active]);

  if (!active || over) return null;

  return (
    <div className="intro" ref={rootRef}>
      <span className="arch-window" aria-hidden="true" />
      <span className="intro__glow" aria-hidden="true" />

      <p className="intro__phrase" aria-hidden="true">
        « bois d’ébène »
        <span className="intro__strike" />
      </p>

      <div className="intro__logo" aria-hidden="true">
        <div className="intro__reveal">
          <img className="intro__base" src={LOGO} alt="" width="1184" height="330" />
          <span className="intro__sheen">
            <span />
          </span>
        </div>
        <img className="intro__cowrie intro__cowrie--left" src={LOGO} alt="" width="1184" height="330" />
        <img className="intro__cowrie intro__cowrie--right" src={LOGO} alt="" width="1184" height="330" />
      </div>

      {/* Un clic n'importe où fait aussi passer l'ouverture (écouteur posé sur .intro) */}
      <button type="button" className="intro__skip">
        Passer l’introduction
      </button>
    </div>
  );
}
