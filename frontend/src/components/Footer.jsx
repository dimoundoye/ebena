import { Link } from 'react-router-dom';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACTS, EVENT, NAV, SOCIALS } from '../data/site.js';
import NewsletterForm from './NewsletterForm.jsx';
import { CowriePair } from './Cowrie.jsx';
import './Footer.css';

export default function Footer() {
  const socials = SOCIALS.filter((social) => social.url);
  return (
    <footer className="site-footer">
      <div className="site-footer__band band-zigzag-h" aria-hidden="true" />

      <div className="container site-footer__top">
        <div className="site-footer__newsletter">
          <p className="eyebrow">Newsletter</p>
          <h2 className="h3">Ne manquez rien d’ÉBËNA</h2>
          <p className="site-footer__text">
            Programme, invités, ouverture des réservations : recevez les actualités du salon en avant-première.
          </p>
          <NewsletterForm source="footer" />
        </div>

        <div className="site-footer__rdv">
          <CowriePair className="site-footer__cowries" />
          <p className="site-footer__script script">Rendez-vous à Nantes</p>
          <p className="site-footer__dates">{EVENT.dates}</p>
          <p className="site-footer__venue">
            {EVENT.venue} · {EVENT.city}
          </p>
          <Link to="/inscription" className="btn btn--gold">
            Je m’inscris
          </Link>
        </div>
      </div>

      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src="/images/logo-ebena-sm.webp" alt="ÉBËNA" width="480" height="134" loading="lazy" />
          <p>{EVENT.baseline}. Un projet de l’association Art à Conter.</p>
        </div>

        <nav aria-label="Le salon">
          <p className="site-footer__title">Le salon</p>
          <ul>
            {NAV.slice(0, 3).map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/partenaires">Partenaires</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Participer">
          <p className="site-footer__title">Participer</p>
          <ul>
            <li>
              <Link to="/inscription">S’inscrire en tant que visiteur</Link>
            </li>
            <li>
              <Link to="/exposants">Réserver un stand</Link>
            </li>
            <li>
              <Link to="/contact?sujet=partenariat">Devenir partenaire</Link>
            </li>
            <li>
              <Link to="/contact?sujet=presse">Espace presse</Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="site-footer__title">Contact</p>
          <ul className="site-footer__contact">
            <li>
              <Mail aria-hidden="true" />
              <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
            </li>
            <li>
              <Phone aria-hidden="true" />
              <a href={`tel:${CONTACTS.coordination.tel}`}>{CONTACTS.coordination.phone}</a>
            </li>
            <li>
              <CalendarDays aria-hidden="true" />
              <span>{EVENT.datesLong}</span>
            </li>
            <li>
              <MapPin aria-hidden="true" />
              <a href={EVENT.mapUrl} target="_blank" rel="noreferrer">
                {EVENT.address}
              </a>
            </li>
          </ul>
          {socials.length > 0 && (
            <ul className="site-footer__socials">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.url} target="_blank" rel="noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>
          © {new Date().getFullYear()} ÉBËNA — {EVENT.organizer}. Tous droits réservés.
        </p>
        <p>
          <Link to="/mentions-legales">Mentions légales et confidentialité</Link>
        </p>
      </div>
    </footer>
  );
}
