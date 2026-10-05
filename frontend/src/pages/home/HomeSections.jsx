import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  BENIN,
  CHIFFRES,
  EVENT,
  EXPOSITIONS,
  MANIFESTE,
  PACKS,
  PARRAIN,
  PARTENAIRES,
  SCENE,
  VOYAGE,
  formatPrix,
} from '../../data/site.js';
import Countdown from '../../components/Countdown.jsx';
import Icon from '../../components/Icon.jsx';
import TramLine from '../../components/TramLine.jsx';
import { CowriePair } from '../../components/Cowrie.jsx';
import { order } from '../../components/scene/order.js';
import PavillonsStory from './PavillonsStory.jsx';
import LeadersCarousel from '../../components/LeadersCarousel.jsx';

export function Pourquoi() {
  return (
    <div className="container s-pourquoi">
      <div className="s-pourquoi__intro">
        <p className="eyebrow build" style={order(0)}>
          {MANIFESTE.title}
        </p>
        <h2 className="scene-title build" style={order(1)}>
          La réappropriation du sens historique d’un <em className="text-gold">mot</em>
        </h2>
        <div className="s-pourquoi__word">
          <span className="s-pourquoi__old build build--fade" style={order(2)}>
            « Bois d’ébène »
          </span>
          <span className="s-pourquoi__arrow build build--fade" style={order(3)} aria-hidden="true" />
          <span className="sr-only">devient</span>
          <span className="s-pourquoi__new build build--zoom" style={order(4)}>
            ÉBËNA
          </span>
        </div>
      </div>
      <div className="s-pourquoi__text">
        <p className="s-pourquoi__paragraph build" style={order(1)}>
          {MANIFESTE.paragraphs[0]}
        </p>
        <Link to="/le-salon" className="link-arrow build" style={order(2)}>
          Lire le manifeste <ArrowRight />
        </Link>
      </div>
    </div>
  );
}

export function Imaginaire() {
  return (
    <div className="container s-imaginaire">
      <div className="s-imaginaire__head">
        <p className="eyebrow build" style={order(0)}>
          {MANIFESTE.title}
        </p>
        <h2 className="scene-title build" style={order(1)}>
          Un acte de <em className="text-gold">réappropriation</em>
        </h2>
        <p className="lead build" style={order(2)}>
          {MANIFESTE.paragraphs[1]}
        </p>
      </div>

      <div className="s-imaginaire__shift">
        <p className="s-imaginaire__label build" style={order(0)}>
          D’un imaginaire de
        </p>
        <ul className="s-imaginaire__from">
          {MANIFESTE.from.map((word, index) => (
            <li key={word} className="build build--fade" style={order(1 + index)}>
              {word}
            </li>
          ))}
        </ul>
        <p className="s-imaginaire__label build" style={order(0)}>
          à un imaginaire de
        </p>
        <ul className="s-imaginaire__to">
          {MANIFESTE.to.map((word, index) => (
            <li key={word} className="build build--wipe" style={order(1 + index * 1.5)}>
              {word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Chaque chiffre mène à la section qui le détaille
const CHIFFRE_ANCRES = ['#rendez-vous', '#pavillons', '#scene', '#benin'];

export function Chiffres() {
  return (
    <div className="container s-chiffres">
      <div className="s-chiffres__head">
        <p className="eyebrow eyebrow--center build" style={order(0)}>
          ÉBËNA en chiffres
        </p>
        <h2 className="scene-title build" style={order(1)}>
          Le grand rendez-vous de la création africaine <em className="text-gold">en Europe</em>
        </h2>
      </div>
      <ol className="s-chiffres__list">
        {CHIFFRES.map((chiffre, index) => (
          <li key={chiffre.label} className="build build--zoom" style={order(1 + index)}>
            <Link to={CHIFFRE_ANCRES[index]} className="s-chiffre">
              <span className="s-chiffre__value">{chiffre.value}</span>
              <span className="s-chiffre__label">{chiffre.label}</span>
              <span className="s-chiffre__detail">{chiffre.detail}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Pavillons() {
  return (
    <div className="container s-pavillons">
      <div className="s-pavillons__head">
        <p className="eyebrow build" style={order(0)}>
          {EXPOSITIONS.title}
        </p>
        <h2 className="scene-title build" style={order(1)}>
          Six univers,
          <br />
          <em className="text-gold">six portes d’entrée</em>
        </h2>
        <p className="lead build" style={order(2)}>
          {EXPOSITIONS.intro}
        </p>
      </div>
      <PavillonsStory />
      <p className="s-pavillons__ambition build" style={order(0)}>
        {EXPOSITIONS.ambition}
      </p>
    </div>
  );
}

export function Voyage() {
  const projet = SCENE.projets[1];
  return (
    <div className="container s-voyage">
      <div className="s-voyage__head">
        <p className="scene-kicker build" style={order(0)}>
          <Icon name={projet.icon} /> {projet.kicker}
        </p>
        <h2 className="scene-title build" style={order(1)}>
          {projet.title}
        </h2>
        <p className="scene-quote build" style={order(2)}>
          « {projet.quote} »
        </p>
        <p className="lead build" style={order(3)}>
          {VOYAGE.outro}
        </p>
      </div>

      <TramLine />

      <Link to="/programme#voyage" className="link-arrow build" style={order(0)}>
        Le parcours en détail <ArrowRight />
      </Link>
    </div>
  );
}

export function Leaders() {
  return (
    <div className="container s-leaders">
      <LeadersCarousel />
    </div>
  );
}

export function Benin() {
  return (
    <div className="container s-benin">
      <div className="s-benin__visual build build--zoom" style={order(0)} aria-hidden="true">
        <div className="s-benin__flag">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="s-benin__text">
        <p className="eyebrow build" style={order(1)}>
          Pays invité d’honneur
        </p>
        <h2 className="scene-title build" style={order(2)}>
          Le Bénin <em className="text-gold">en lumières</em>, l’Afrique en mouvement
        </h2>
        <p className="lead build" style={order(3)}>
          {BENIN.text}
        </p>
        <Link to="/le-salon#benin" className="link-arrow build" style={order(4)}>
          Le Bénin à ÉBËNA <ArrowRight />
        </Link>
      </div>
    </div>
  );
}

export function Parrain() {
  return (
    <div className="container s-parrain">
      <figure className="s-parrain__photo build build--zoom" style={order(0)}>
        <div className="arch-frame">
          <div className="arch">
            <img
              src="/images/parrain-claudy-siar.webp"
              alt={`${PARRAIN.name}, parrain d’ÉBËNA 2027`}
              width="768"
              height="1004"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </figure>
      <div className="s-parrain__text">
        <h2 className="eyebrow build" style={order(1)}>
          {PARRAIN.title}
        </h2>
        <blockquote className="s-parrain__quote build" style={order(2)}>
          <p>« {PARRAIN.quote} »</p>
        </blockquote>
        <p className="s-parrain__name build" style={order(3)}>
          {PARRAIN.name}
        </p>
        <p className="s-parrain__role build" style={order(4)}>
          {PARRAIN.role}
        </p>
        <p className="s-parrain__about build" style={order(5)}>
          {PARRAIN.paragraphs[0]}
        </p>
        <Link to="/le-salon#parrain" className="link-arrow build" style={order(6)}>
          Lire le mot du parrain <ArrowRight />
        </Link>
      </div>
    </div>
  );
}

export function Exposer() {
  return (
    <div className="container s-exposer">
      <div className="s-exposer__head">
        <p className="eyebrow build" style={order(0)}>
          Exposants et sponsors
        </p>
        <h2 className="scene-title build" style={order(1)}>
          Devenez partenaire <em className="text-gold">de l’excellence</em>
        </h2>
        <p className="lead build" style={order(2)}>
          Choisissez le niveau de visibilité qui correspond à vos ambitions.
        </p>
      </div>
      <ul className="s-packs">
        {PACKS.map((pack, index) => (
          <li key={pack.id} className={`s-pack s-pack--${pack.id} build`} style={order(1 + index)}>
            <p className="s-pack__name">
              <span>Pack</span> {pack.name}
            </p>
            <p className="s-pack__price">
              {formatPrix(pack.prix)} <small>HT</small>
            </p>
            <p className="s-pack__surface">Stand de {pack.surface}</p>
            <ul className="s-pack__features">
              {pack.features.slice(0, 3).map((feature) => (
                <li key={feature.title}>
                  <Icon name={feature.icon} />
                  <span>
                    <strong>{feature.title}</strong> {feature.detail}
                  </span>
                </li>
              ))}
            </ul>
            <p className="s-pack__accroche">{pack.accroche}</p>
            <Link
              to={`/exposants?pack=${pack.id}#reservation`}
              className={`btn btn--sm ${pack.featured ? 'btn--gold' : 'btn--ghost'} s-pack__cta`}
            >
              Réserver <span className="sr-only">le pack {pack.name}</span>
              <ArrowRight />
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/exposants" className="link-arrow build" style={order(0)}>
        Comparer les formules <ArrowRight />
      </Link>
    </div>
  );
}

export function Partenaires() {
  const logos = [...PARTENAIRES.institutions, ...PARTENAIRES.partenaires];
  return (
    <div className="container s-partenaires">
      <div className="s-partenaires__head">
        <div className="build build--fade" style={order(0)} aria-hidden="true">
          <CowriePair className="s-partenaires__cowries" />
        </div>
        <h2 className="scene-title build" style={order(1)}>
          Ils accompagnent <em className="text-gold">ÉBËNA</em>
        </h2>
      </div>
      <ul className="s-logos">
        {logos.map((partner, index) => (
          <li key={partner.slug} className="s-logos__item build build--zoom" style={order(index * 0.5)}>
            <img src={`/images/partenaires/${partner.slug}.webp`} alt={partner.name} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <Link to="/partenaires" className="link-arrow build" style={order(0)}>
        Tous nos partenaires <ArrowRight />
      </Link>
    </div>
  );
}

export function RendezVous() {
  return (
    <div className="container s-rdv">
      <p className="eyebrow eyebrow--center build" style={order(0)}>
        Ouverture le 4 juin 2027
      </p>
      <h2 className="scene-title build" style={order(1)}>
        Le compte à rebours <em className="text-gold">est lancé</em>
      </h2>
      <div className="build build--zoom" style={order(2)}>
        <Countdown className="countdown--large" showTitle={false} />
      </div>
      <p className="s-rdv__where build" style={order(3)}>
        {EVENT.datesLong} · {EVENT.venue}, {EVENT.city}
      </p>
      <div className="s-rdv__actions build" style={order(4)}>
        <Link to="/inscription" className="btn btn--dark">
          Je m’inscris <ArrowRight />
        </Link>
        <Link to="/exposants" className="btn btn--ghost">
          Devenir exposant
        </Link>
      </div>
    </div>
  );
}
