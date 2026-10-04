import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { COUR_ROYALE, EXPOSITIONS, METHODE, PAVILLONS, SCENE, VOYAGE } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Icon from '../components/Icon.jsx';
import TramLine from '../components/TramLine.jsx';
import LeadersGallery from '../components/LeadersGallery.jsx';
import CtaBand from '../components/CtaBand.jsx';
import './pages.css';
import './Programme.css';

function Pavillon({ pavillon }) {
  return (
    <article className="pavillon" id={pavillon.slug}>
      <Reveal className="pavillon__aside">
        <span className="pavillon__number" aria-hidden="true">
          {pavillon.numero}
        </span>
        <span className="icon-medallion pavillon__icon">
          <Icon name={pavillon.icon} />
        </span>
        <p className="pavillon__kicker">Pavillon {pavillon.numero}</p>
      </Reveal>
      <div className="pavillon__body">
        <Reveal as="h3" className="h3">
          {pavillon.title}
        </Reveal>
        <Reveal as="p" className="pavillon__quote" delay={0.06}>
          « {pavillon.quote} »
        </Reveal>
        <Reveal className="prose" delay={0.1}>
          {pavillon.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Reveal>
        {pavillon.list && (
          <Reveal className="stack" delay={0.12} style={{ '--stack-gap': '0.9rem' }}>
            <p className="pavillon__list-title">{pavillon.listTitle}</p>
            <ul className="list-cowrie">
              {pavillon.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        )}
        {pavillon.tags && (
          <Reveal as="ul" className="tags" delay={0.12}>
            {pavillon.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </Reveal>
        )}
        {pavillon.note && (
          <Reveal as="p" className="pavillon__note" delay={0.14}>
            {pavillon.note}
          </Reveal>
        )}
      </div>
    </article>
  );
}

export default function Programme() {
  useDocumentMeta(
    'Programme',
    'Les six pavillons thématiques d’ÉBËNA 2027 et la Scène ÉBËNA : La Cour Royale de Maam, les défilés Le Voyage et La Méthode des Leaders.'
  );

  return (
    <>
      <PageHero
        eyebrow="ÉBËNA 2027"
        title={
          <>
            Le <em className="text-gold">programme</em>
          </>
        }
        intro={EXPOSITIONS.intro}
      >
        <nav className="toc" aria-label="Sommaire du programme">
          {PAVILLONS.map((pavillon) => (
            <a key={pavillon.slug} href={`#${pavillon.slug}`}>
              <span>{pavillon.numero}</span> {pavillon.short}
            </a>
          ))}
          <a href="#scene">
            <span>✦</span> La Scène ÉBËNA
          </a>
        </nav>
      </PageHero>

      <section className="section programme-intro">
        <div className="container programme-intro__grid">
          <Reveal as="p" className="programme-intro__ambition">
            {EXPOSITIONS.ambition}
          </Reveal>
          <Reveal className="programme-intro__note" delay={0.1}>
            <CalendarClock aria-hidden="true" />
            <p>
              <strong>Programme détaillé jour par jour</strong> : horaires, intervenants et showcases seront publiés à
              l’approche du salon. <Link to="/inscription">Inscrivez-vous</Link> pour le recevoir en avant-première.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt pavillons" aria-labelledby="pavillons-titre">
        <div className="container">
          <SectionHeading
            eyebrow="Des expositions"
            title={
              <span id="pavillons-titre">
                Six pavillons, <em className="text-gold">une traversée</em>
              </span>
            }
          />
          <div className="pavillons__list">
            {PAVILLONS.map((pavillon) => (
              <Pavillon key={pavillon.slug} pavillon={pavillon} />
            ))}
          </div>
        </div>
      </section>

      {/* La Scène ÉBËNA */}
      <section className="section" id="scene">
        <div className="container">
          <SectionHeading
            eyebrow={SCENE.subtitle}
            title={
              <>
                La Scène <em className="text-gold">ÉBËNA</em>
              </>
            }
            intro={SCENE.intro}
          />

          <div className="scene-index">
            {SCENE.projets.map((projet, index) => (
              <Reveal as="a" key={projet.slug} href={`#${projet.slug}`} className="scene-index__item" delay={index * 0.08}>
                <span className="icon-medallion">
                  <Icon name={projet.icon} />
                </span>
                <span>
                  <small>{projet.kicker}</small>
                  {projet.title}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* La Cour Royale de Maam */}
      <section className="section section--alt" id="cour-royale">
        <div className="container feature">
          <Reveal className="feature__media">
            <div className="cour-royale__visual">
              <div className="cour-royale__band band-zigzag-v" aria-hidden="true" />
              <Icon name="Crown" />
              <p className="cour-royale__artist script">{COUR_ROYALE.artiste}</p>
              <p className="cour-royale__maison">{COUR_ROYALE.maison}</p>
            </div>
          </Reveal>
          <div className="feature__text">
            <Reveal as="p" className="eyebrow">
              Exposition immersive · Artiste invitée
            </Reveal>
            <Reveal as="h2" className="h2" delay={0.08}>
              La Cour Royale <em className="text-gold">de Maam</em>
            </Reveal>
            <Reveal as="p" className="quote" delay={0.12}>
              « Une mémoire vestimentaire sénégalaise mise en scène »
            </Reveal>
            <Reveal className="prose" delay={0.16}>
              {COUR_ROYALE.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Le Voyage */}
      <section className="section" id="voyage">
        <div className="container">
          <SectionHeading
            eyebrow="Défilés de mode · trois stylistes africains"
            title={
              <>
                Le Voyage, <em className="text-gold">au fil du tramway</em>
              </>
            }
            intro={VOYAGE.intro[0]}
          />
          <TramLine />
          <Reveal as="p" className="voyage__outro" delay={0.1}>
            {VOYAGE.outro}
          </Reveal>
        </div>
      </section>

      {/* La Méthode des Leaders */}
      <section className="section section--alt" id="leaders">
        <div className="container">
          <div className="split leaders-split">
            <div className="split__aside">
              <Reveal as="p" className="eyebrow">
                Cycle de conférences et talk-shows
              </Reveal>
              <Reveal as="h2" className="h2" delay={0.08}>
                La Méthode <em className="text-gold">des Leaders</em>
              </Reveal>
              <Reveal as="p" className="quote" delay={0.12}>
                Inspirer, entreprendre, transmettre
              </Reveal>
            </div>
            <div className="split__body">
              <Reveal className="prose lead">
                <p>{METHODE.intro}</p>
                <p>{METHODE.vocation}</p>
              </Reveal>
              <Reveal className="objectifs" delay={0.1}>
                <p className="eyebrow">Les objectifs</p>
                <ol>
                  {METHODE.objectifs.map((objectif, index) => (
                    <li key={objectif}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {objectif}
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
          <div className="leaders-wrap">
            <LeadersGallery />
          </div>
          <Reveal className="programme-cta">
            <Link to="/exposants?pack=platinum#packs" className="btn btn--dark">
              Prendre la parole : pack Platinum <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
