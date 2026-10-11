import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { CowriePair } from './Cowrie.jsx';
import { ARCH_CLOSED, ARCH_OPEN } from './arch.js';
import './PageDoor.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
// Rythme du passage (1,3 s en tout) : l'arche se referme, reste un instant fermée, puis s'ouvre
// en douceur (départ progressif, sans à-coup)
const CLOSE = { duration: 450, easing: 'cubic-bezier(0.55, 0, 0.45, 1)', fill: 'forwards' };
const HOLD_MS = 100;
const OPEN = { duration: 750, easing: 'cubic-bezier(0.45, 0, 0.15, 1)', fill: 'forwards' };

const isAdmin = (pathname) => pathname.startsWith('/admin');
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Changement de page : une arche dorée (la forme des portes des pavillons) se referme sur la page
// quittée, puis s'ouvre sur la nouvelle. `children(location)` affiche les routes : la page ne change
// que lorsque l'arche est fermée. Sans arche : ancres et paramètres d'une même page, back-office,
// et « réduire les animations ».
export default function PageDoor({ children }) {
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const doorRef = useRef(null);
  const shownRef = useRef(location);
  const latestRef = useRef(location);
  const busyRef = useRef(false);

  useEffect(() => {
    latestRef.current = location;
    // Une transition est en cours : elle affichera la dernière page demandée en se refermant
    if (busyRef.current || location === shownRef.current) return;

    const show = (next) => {
      shownRef.current = next;
      setShown(next);
    };

    const from = shownRef.current.pathname;
    if (from === location.pathname || isAdmin(from) || isAdmin(location.pathname) || window.matchMedia(REDUCED_MOTION).matches) {
      show(location);
      return;
    }

    const passThrough = async () => {
      busyRef.current = true;
      const door = doorRef.current;
      const arch = door.querySelector('.arch-window');
      door.hidden = false;
      try {
        while (latestRef.current.pathname !== shownRef.current.pathname) {
          await arch.animate([ARCH_OPEN, ARCH_CLOSED], CLOSE).finished;
          // Rendu immédiat de la nouvelle page, pendant que l'arche est fermée
          const next = latestRef.current;
          shownRef.current = next;
          flushSync(() => setShown(next));
          // La nouvelle page s'installe (défilement en haut, entrées en scène) avant l'ouverture
          await nextFrame();
          await pause(HOLD_MS);
          await arch.animate([ARCH_CLOSED, ARCH_OPEN], OPEN).finished;
        }
      } finally {
        door.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
        door.hidden = true;
        busyRef.current = false;
      }
      // Ancre ou paramètres changés pendant la transition, sur la même page
      if (latestRef.current !== shownRef.current) show(latestRef.current);
    };

    passThrough();
  }, [location]);

  return (
    <>
      {children(shown)}
      <div className="page-door" ref={doorRef} hidden aria-hidden="true">
        <span className="arch-window">
          <CowriePair className="page-door__cowries" />
        </span>
      </div>
    </>
  );
}
