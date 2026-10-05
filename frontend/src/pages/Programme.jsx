import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarClock } from 'lucide-react';
import { EXPOSITIONS, METHODE, PAVILLONS, SCENE, VOYAGE } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import PageHero from '../components/PageHero.jsx';
import SceneFlow, { Scene } from '../components/scene/SceneFlow.jsx';
import { order } from '../components/scene/order.js';
import Icon from '../components/Icon.jsx';
import PavillonDoor from '../components/PavillonDoor.jsx';
import SceneProjects from '../components/SceneProjects.jsx';
import CourRoyale from '../components/CourRoyale.jsx';
import TramLine from '../components/TramLine.jsx';
import LeadersCarousel from '../components/LeadersCarousel.jsx';
import ClosingCta from '../components/ClosingCta.jsx';
import './pages.css';
import './Programme.css';

function Introduction() {
  return (
    <div className="container prog-intro">
      <div className="prog-intro__head">
        <p className="eyebrow build" style={order(0)}>
          {EXPOSITIONS.title}
        </p>
        <h2 className="scene-title build" style={order(1)}>
          Six pavillons, <em className="text-gold">une traversée</em>
        </h2>
        <p className="prog-intro__ambition build" style={order(2)}>
          {EXPOSITIONS.ambition}
        </p>
      </div>
      <div className="prog-intro__note build" style={order(3)}>
        <CalendarClock aria-hidden="true" />
        <p>
          <strong>Programme détaillé jour par jour</strong> : horaires, intervenants et showcases seront publiés à
          l’approche du salon. <Link to="/inscription">Inscrivez-vous</Link> pour le recevoir en avant-première.
        </p>
      </div>
    </div>
  );
}

// Un pavillon : sa porte en arche reste à côté du texte pendant la lecture (grand écran)
function Pavillon({ pavillon, index }) {
  const previous = PAVILLONS[index - 1];
  const next = PAVILLONS[index + 1];
  return (
    <div className="container pav-detail">
      <div className="pav-detail__aside">
        <div className="pav-detail__door build build--zoom" style={order(0)}>
          <PavillonDoor pavillon={pavillon} />
        </div>
        <p className="pav-detail__count build" style={order(1)} aria-hidden="true">
          {pavillon.numero}
          <span> / {String(PAVILLONS.length).padStart(2, '0')}</span>
        </p>
      </div>

      <article className="pav-detail__body">
        <p className="scene-kicker build" style={order(0)}>
          Pavillon {pavillon.numero}
        </p>
        <h2 className="pav-detail__title build" style={order(1)}>
          {pavillon.title}
        </h2>
        <p className="scene-quote build" style={order(2)}>
          « {pavillon.quote} »
        </p>
        <div className="prose build" style={order(3)}>
          {pavillon.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
        {pavillon.list && (
          <div className="pav-detail__list build" style={order(0)}>
            <p className="pav-detail__list-title">{pavillon.listTitle}</p>
            <ul className="list-cowrie">
              {pavillon.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {pavillon.tags && (
          <ul className="tags build" style={order(0)}>
            {pavillon.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        )}
        {pavillon.note && (
          <p className="pav-detail__note build" style={order(0)}>
            {pavillon.note}
          </p>
        )}

        <nav className="pav-detail__nav build" style={order(0)} aria-label="Pavillons voisins">
          {previous ? (
            <Link to={`#${previous.slug}`} className="link-arrow pav-detail__prev">
              <ArrowLeft /> {previous.short}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`#${next.slug}`} className="link-arrow">
              {next.short} <ArrowRight />
            </Link>
          ) : (
            <Link to="#scene" className="link-arrow">
              La Scène ÉBËNA <ArrowRight />
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}

function Voyage() {
  const projet = SCENE.projets[1];
  return (
    <div className="container prog-voyage">
      <div className="prog-voyage__head">
        <p className="scene-kicker build" style={order(0)}>
          <Icon name={projet.icon} /> {projet.kicker} · trois stylistes africains
        </p>
        <h2 className="scene-title build" style={order(1)}>
          Le Voyage, <em className="text-gold">au fil du tramway</em>
        </h2>
        <p className="lead build" style={order(2)}>
          {VOYAGE.intro[0]}
        </p>
      </div>
      <TramLine />
      <p className="prog-voyage__outro build" style={order(0)}>
        {VOYAGE.outro}
      </p>
    </div>
  );
}

function Methode() {
  return (
    <div className="container prog-methode">
      <div className="prog-methode__head">
        <div className="prog-methode__title">
          <p className="eyebrow build" style={order(0)}>
            Cycle de conférences et talk-shows
          </p>
          <h2 className="scene-title build" style={order(1)}>
            La Méthode <em className="text-gold">des Leaders</em>
          </h2>
          <p className="scene-quote build" style={order(2)}>
            Inspirer, entreprendre, transmettre
          </p>
        </div>
        <div className="prose build" style={order(1)}>
          <p>{METHODE.intro}</p>
          <p>{METHODE.vocation}</p>
        </div>
      </div>

      <div className="prog-methode__objectifs">
        <p className="eyebrow build" style={order(0)}>
          Les objectifs
        </p>
        <ol>
          {METHODE.objectifs.map((objectif, index) => (
            <li key={objectif} className="build" style={order(1 + index)}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {objectif}
            </li>
          ))}
        </ol>
      </div>

      <LeadersCarousel heading={false} />

      <div className="prog-methode__cta build" style={order(0)}>
        <Link to="/exposants?pack=platinum#packs" className="btn btn--gold">
          Prendre la parole : pack Platinum <ArrowRight />
        </Link>
      </div>
    </div>
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

      {/* Chaque pavillon entre par une porte (ou un balayage), en alternant fonds sable et ivoire */}
      <SceneFlow>
        <Scene id="introduction">
          <Introduction />
        </Scene>
        {PAVILLONS.map((pavillon, index) => (
          <Scene
            key={pavillon.slug}
            id={pavillon.slug}
            tone={index % 2 === 0 ? 'sable' : 'ivoire'}
            transition={index % 2 === 0 ? 'porte' : 'balayage'}
          >
            <Pavillon pavillon={pavillon} index={index} />
          </Scene>
        ))}
        <Scene id="scene" tone="scene" transition="rideau">
          <SceneProjects />
        </Scene>
        <Scene id="cour-royale" tone="bordeaux" transition="stores">
          <CourRoyale full />
        </Scene>
        <Scene id="voyage" tone="sable" transition="poussee">
          <Voyage />
        </Scene>
        <Scene id="leaders" tone="ebene" transition="noir">
          <Methode />
        </Scene>
        <Scene id="rendez-vous" tone="soleil" transition="cercle">
          <ClosingCta />
        </Scene>
      </SceneFlow>
    </>
  );
}
