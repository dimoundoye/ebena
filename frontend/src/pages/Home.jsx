import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { EVENT } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Cowrie from '../components/Cowrie.jsx';
import SceneFlow, { Scene } from '../components/scene/SceneFlow.jsx';
import CourRoyale from '../components/CourRoyale.jsx';
import SceneProjects from '../components/SceneProjects.jsx';
import {
  Benin,
  Chiffres,
  Exposer,
  Imaginaire,
  Leaders,
  Parrain,
  Partenaires,
  Pavillons,
  Pourquoi,
  RendezVous,
  Voyage,
} from './home/HomeSections.jsx';
import './Home.css';
import './home/HomeSections.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__lattice" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__text">
          <h1 className="hero__title hero-in" style={{ '--d': '0.15s' }}>
            <img src="/images/logo-ebena.webp" alt="ÉBËNA — Carrefour des talents, des identités et de l’avenir" width="1184" height="330" fetchPriority="high" />
          </h1>

          <p className="hero__script script hero-in" style={{ '--d': '0.45s' }}>
            {EVENT.signature}
            <svg className="hero__stroke" viewBox="0 0 320 24" preserveAspectRatio="none" aria-hidden="true">
              <path d="M4 18 C 90 6, 200 2, 316 10" />
            </svg>
          </p>

          <p className="lead hero__lead hero-in" style={{ '--d': '0.6s' }}>
            {EVENT.baseline} : trois jours dédiés à l’excellence, à l’innovation et à la créativité africaines et afro-descendantes.
          </p>

          <div className="hero__meta hero-in" style={{ '--d': '0.7s' }}>
            <div>
              <p className="hero__date">{EVENT.dates}</p>
              <p className="hero__meta-label">Du vendredi au dimanche</p>
            </div>
            <span className="hero__meta-sep" aria-hidden="true" />
            <div>
              <p className="hero__venue">
                <MapPin aria-hidden="true" /> {EVENT.venue}
              </p>
              <p className="hero__meta-label">{EVENT.city}</p>
            </div>
          </div>

          <div className="hero__actions hero-in" style={{ '--d': '0.8s' }}>
            <Link to="/inscription" className="btn btn--dark">
              Je m’inscris <ArrowRight />
            </Link>
            <Link to="/exposants" className="btn btn--ghost">
              Devenir exposant
            </Link>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__sun" aria-hidden="true" />
          <div className="hero__band band-zigzag-v" aria-hidden="true" />
          <div className="hero__arch-frame arch-frame">
            <div className="arch hero__arch">
              <img
                src="/images/hero-portrait.webp"
                alt="Visage d’une femme orné de motifs africains peints en blanc, visuel officiel d’ÉBËNA 2027"
                width="570"
                height="1091"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...EVENT.themes, ...EVENT.themes];
  return (
    <div className="marquee" aria-label={`Thèmes du salon : ${EVENT.themes.join(', ')}`}>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {items.map((theme, index) => (
              <span className="marquee__item" key={`${copy}-${index}`}>
                {theme}
                <Cowrie className="marquee__cowrie" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Après le hero, la page défile normalement ; chaque section arrive avec sa propre transition
// (balayage, porte en arche, rideau, cercle doré…) qui avance au rythme du défilement.
export default function Home() {
  useDocumentMeta(
    null,
    'ÉBËNA, le grand rendez-vous de la création africaine en Europe : 4, 5 et 6 juin 2027 au Parc des Chantiers, Nantes. Six pavillons, la Scène ÉBËNA, le Bénin pays invité d’honneur.'
  );

  return (
    <>
      <Hero />
      <Marquee />
      <SceneFlow>
        <Scene id="pourquoi">
          <Pourquoi />
        </Scene>
        <Scene id="imaginaire" tone="sable" transition="balayage">
          <Imaginaire />
        </Scene>
        <Scene id="en-chiffres" transition="zoom">
          <Chiffres />
        </Scene>
        <Scene id="pavillons" tone="sable" transition="porte">
          <Pavillons />
        </Scene>
        <Scene id="scene" tone="scene" transition="rideau">
          <SceneProjects />
        </Scene>
        <Scene id="cour-royale" tone="bordeaux" transition="stores">
          <CourRoyale />
        </Scene>
        <Scene id="voyage" tone="sable" transition="poussee">
          <Voyage />
        </Scene>
        <Scene id="leaders" tone="ebene" transition="noir">
          <Leaders />
        </Scene>
        <Scene id="benin" transition="drapeau">
          <Benin />
        </Scene>
        <Scene id="parrain" tone="sable" transition="fondu">
          <Parrain />
        </Scene>
        <Scene id="exposants" transition="balayage">
          <Exposer />
        </Scene>
        <Scene id="partenaires" tone="sable" transition="fondu">
          <Partenaires />
        </Scene>
        <Scene id="rendez-vous" tone="soleil" transition="cercle">
          <RendezVous />
        </Scene>
      </SceneFlow>
    </>
  );
}
