import { Link } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';
import { EXPOSITIONS, METHODE, SCENE, VOYAGE } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Button from '../components/Button.jsx';
import PageHero from '../components/PageHero.jsx';
import SceneFlow, { Scene } from '../components/scene/SceneFlow.jsx';
import { order } from '../components/scene/order.js';
import Icon from '../components/Icon.jsx';
import SceneProjects from '../components/SceneProjects.jsx';
import CourRoyale from '../components/CourRoyale.jsx';
import TramLine from '../components/TramLine.jsx';
import LeadersCarousel from '../components/LeadersCarousel.jsx';
import ClosingCta from '../components/ClosingCta.jsx';
import PavillonsCorridor from './programme/PavillonsCorridor.jsx';
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
        <Button to="/exposants?pack=platinum#packs" variant="gold">
          Prendre la parole : pack Platinum
        </Button>
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
      />

      <SceneFlow>
        <Scene id="introduction">
          <Introduction />
        </Scene>
        {/* Le couloir des pavillons : une porte s'approche et s'ouvre sur chaque pavillon */}
        <Scene id="pavillons" tone="couloir" transition="fondu" className="scene--flush">
          <PavillonsCorridor />
        </Scene>
        <Scene id="scene" transition="rideau">
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
