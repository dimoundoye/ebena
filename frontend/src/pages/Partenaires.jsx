import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PARTENAIRES } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import PartnersWall from '../components/PartnersWall.jsx';
import CtaBand from '../components/CtaBand.jsx';
import './pages.css';

export default function Partenaires() {
  useDocumentMeta('Partenaires', 'Les institutions, partenaires et organisations associées qui accompagnent ÉBËNA 2027 à Nantes.');

  return (
    <>
      <PageHero
        eyebrow="Ils nous accompagnent"
        title={
          <>
            Nos <em className="text-gold">partenaires</em>
          </>
        }
        intro="Institutions françaises et africaines, associations nantaises, médias et programmes de coopération : ensemble, ils font d’ÉBËNA un pont entre Nantes, l’Afrique et le monde."
      />

      <section className="section">
        <div className="container">
          <PartnersWall titles />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split">
          <div className="split__aside">
            <Reveal as="p" className="eyebrow">
              Organisations associées
            </Reveal>
            <Reveal as="h2" className="h2" delay={0.08}>
              Un projet porté <em className="text-gold">collectivement</em>
            </Reveal>
          </div>
          <div className="split__body">
            <Reveal as="p" className="lead">
              ÉBËNA est un projet de l’association Art à Conter, construit avec des structures engagées dans la vie culturelle et
              associative nantaise.
            </Reveal>
            <Reveal as="ul" className="list-cowrie partenaires-associees" delay={0.1}>
              {PARTENAIRES.associees.map((organisation) => (
                <li key={organisation}>{organisation}</li>
              ))}
            </Reveal>
            <Reveal delay={0.15}>
              <Link to="/contact?sujet=partenariat" className="link-arrow">
                Rejoindre les partenaires <ArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Devenir partenaire"
        title={
          <>
            Associez votre image <em className="text-gold">à l’excellence africaine</em>
          </>
        }
        text="Institutions, entreprises, médias : construisons ensemble un partenariat à la hauteur de vos ambitions."
        primary={{ to: '/contact?sujet=partenariat', label: 'Proposer un partenariat' }}
        secondary={{ to: '/exposants', label: 'Voir les packs exposants' }}
      />
    </>
  );
}
