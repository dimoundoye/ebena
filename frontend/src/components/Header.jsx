import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, MapPin } from 'lucide-react';
import { CONTACTS, EVENT, NAV } from '../data/site.js';
import { CowriePair } from './Cowrie.jsx';
import './Header.css';

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const classes = ['site-header', scrolled && 'is-scrolled', open && 'is-open', isHome && 'is-home'].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="ÉBËNA, retour à l’accueil">
          <img src="/images/logo-ebena-sm.webp" alt="ÉBËNA" width="480" height="134" />
        </Link>

        <nav className="main-nav" aria-label="Navigation principale">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `main-nav__link ${isActive ? 'is-active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link to="/inscription" className="btn btn--dark btn--sm site-header__cta">
            Je m’inscris
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="menu-toggle__bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
          </button>
        </div>
      </div>

      <div id="menu-mobile" className="mobile-menu" inert={!open}>
        <div className="mobile-menu__band band-zigzag-v" aria-hidden="true" />
        <div className="container mobile-menu__inner">
          <nav aria-label="Navigation mobile">
            <ul className="mobile-menu__list">
              <li style={{ '--i': 0 }}>
                <NavLink to="/" end>
                  Accueil
                </NavLink>
              </li>
              {NAV.map((item, index) => (
                <li key={item.to} style={{ '--i': index + 1 }}>
                  <NavLink to={item.to}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mobile-menu__footer">
            <CowriePair className="mobile-menu__cowries" />
            <p className="mobile-menu__date">
              {EVENT.dates} · {EVENT.venue}, {EVENT.city}
            </p>
            <div className="mobile-menu__actions">
              <Link to="/inscription" className="btn btn--dark">
                Je m’inscris <ArrowRight />
              </Link>
              <Link to="/exposants" className="btn btn--ghost">
                Devenir exposant
              </Link>
            </div>
            <p className="mobile-menu__contact">
              <Mail aria-hidden="true" /> <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
            </p>
            <p className="mobile-menu__contact">
              <MapPin aria-hidden="true" /> {EVENT.address}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
