import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BENIN, CONCEPT, EVENT, MANIFESTE, PARRAIN, PARTENAIRES } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { Ornament } from '../components/Cowrie.jsx';
import CtaBand from '../components/CtaBand.jsx';
import './pages.css';
import './Salon.css';

export default function Salon() {
  useDocumentMeta(
    'Le salon',
    'Pourquoi ÉBËNA, le concept du salon, le Parc des Chantiers, le Bénin pays invité d’honneur et le mot du parrain Claudy Siar.'
  );

  return (
    <>
      <PageHero
        eyebrow="Le salon"
        title={
          <>
            Un carrefour des <em className="text-gold">talents</em>, des identités et de l’avenir
          </>
        }
        intro={CONCEPT.lead}
        aside={
          <figure className="salon-poster">
            <img src="/images/affiche-ebena.webp" alt="Affiche officielle d’ÉBËNA 2027" width="922" height="1383" />
            <figcaption>L’affiche officielle</figcaption>
          </figure>
        }
      />

      {/* Pourquoi ÉBËNA */}
      <section className="section">
        <div className="container split">
          <div className="split__aside">
            <Reveal as="p" className="eyebrow">
              {MANIFESTE.title}
            </Reveal>
            <Reveal as="h2" className="h2" delay={0.08}>
              La réappropriation du sens historique d’un <em className="text-gold">mot</em>
            </Reveal>
          </div>
          <div className="split__body">
            <Reveal className="prose dropcap lead">
              {MANIFESTE.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Reveal>
            <Reveal as="blockquote" className="pullquote" delay={0.1}>
              <p>
                C’est le passage d’un imaginaire de marchandisation et de déshumanisation à un imaginaire de création, d’excellence,
                de dignité et de fraternité.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Le concept */}
      <section className="section section--alt">
        <div className="container split">
          <div className="split__aside">
            <Reveal as="p" className="eyebrow">
              {CONCEPT.title}
            </Reveal>
            <Reveal as="h2" className="h2" delay={0.08}>
              Une Afrique plurielle, <em className="text-gold">tournée vers l’avenir</em>
            </Reveal>
          </div>
          <div className="split__body">
            <Reveal className="prose lead">
              {CONCEPT.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Reveal>
            <Reveal className="stack" delay={0.1}>
              <p className="eyebrow">Qui se croisera à ÉBËNA</p>
              <ul className="publics" aria-label="Publics attendus">
                {CONCEPT.publics.map((publicCible) => (
                  <li key={publicCible} className="tag">
                    {publicCible}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="salon-themes" delay={0.15}>
              {EVENT.themes.map((theme, index) => (
                <span key={theme}>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  {theme}
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Le lieu */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow={`${EVENT.venue} · ${EVENT.city}`}
            title={
              <>
                D’un héritage de souffrance <em className="text-gold">à un espace d’espérance</em>
              </>
            }
          />
          <div className="salon-lieu">
            <Reveal className="prose lead">
              {CONCEPT.lieu.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Reveal>
            <Reveal className="gold-panel" delay={0.12}>
              <div className="gold-panel__band band-zigzag-v" aria-hidden="true" />
              <p className="eyebrow">Au cœur du salon</p>
              <h3 className="h3">{CONCEPT.mat.title}</h3>
              <p className="lead">{CONCEPT.mat.text}</p>
              <Link to="/programme" className="link-arrow">
                Découvrir les pavillons et la scène <ArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Bénin */}
      <section className="section section--alt" id="benin">
        <div className="container salon-benin">
          <div className="salon-benin__flag" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="salon-benin__text">
            <Reveal as="p" className="eyebrow">
              Pays invité d’honneur
            </Reveal>
            <Reveal as="h2" className="h2" delay={0.08}>
              {BENIN.title}
            </Reveal>
            <Reveal as="p" className="quote" delay={0.12}>
              {BENIN.slogan}
            </Reveal>
            <Reveal as="p" className="lead" delay={0.16}>
              {BENIN.text}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Le mot du parrain */}
      <section className="section" id="parrain">
        <div className="container feature">
          <Reveal className="feature__media">
            <div className="arch-frame salon-parrain__photo">
              <div className="arch">
                <img src="/images/parrain-claudy-siar.webp" alt={`${PARRAIN.name}, parrain d’ÉBËNA 2027`} loading="lazy" width="768" height="1004" />
              </div>
            </div>
          </Reveal>
          <div className="feature__text">
            <Reveal as="p" className="eyebrow">
              {PARRAIN.title}
            </Reveal>
            <Reveal as="h2" className="h2" delay={0.08}>
              {PARRAIN.name}
            </Reveal>
            <Reveal as="p" className="salon-parrain__role" delay={0.1}>
              {PARRAIN.role}
            </Reveal>
            <Reveal as="blockquote" className="pullquote" delay={0.14}>
              <p>{PARRAIN.quote}</p>
            </Reveal>
            <Reveal className="prose" delay={0.18}>
              {PARRAIN.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Porteurs du projet */}
      <section className="section section--tight section--alt">
        <div className="container salon-porteurs">
          <Ornament />
          <Reveal as="p" className="eyebrow eyebrow--center">
            Un projet de l’association
          </Reveal>
          <Reveal as="h2" className="h2" delay={0.08}>
            Art à Conter
          </Reveal>
          <Reveal as="p" className="lead" delay={0.12}>
            Avec les organisations associées
          </Reveal>
          <Reveal as="ul" className="salon-porteurs__list" delay={0.16}>
            {PARTENAIRES.associees.map((organisation) => (
              <li key={organisation}>{organisation}</li>
            ))}
          </Reveal>
          <Reveal delay={0.2}>
            <Link to="/equipe" className="btn btn--ghost">
              Rencontrer l’équipe <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
