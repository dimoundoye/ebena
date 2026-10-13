import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Nouvelle page : remonte en haut, ou saute directement à l'ancre (#…) demandée.
// Même page : défile en douceur jusqu'à l'ancre.
// Avant l'affichage, et avant les effets de la page (placée avant elle dans l'arbre) : la page
// sait d'emblée ce qui est à l'écran à son arrivée, qu'elle montre alors sans animation.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(null);

  useLayoutEffect(() => {
    const samePage = previousPath.current === pathname;

    if (!hash) {
      if (!samePage) window.scrollTo({ top: 0, behavior: 'instant' });
      previousPath.current = pathname;
      return undefined;
    }

    // La page n'est mémorisée qu'une fois le défilement effectué : le double appel des effets
    // en mode développement (StrictMode) ne transforme donc pas un saut direct en défilement doux.
    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let timer;
    const scrollToTarget = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: samePage ? 'smooth' : 'instant', block: 'start' });
        previousPath.current = pathname;
      } else if (attempts++ < 20) {
        timer = setTimeout(scrollToTarget, 50);
      }
    };
    timer = setTimeout(scrollToTarget, 30);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <ScrollManager />
      <Header />
      <main id="contenu" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
