import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { BENIN, CHIFFRES, EVENT, MANIFESTE, PACKS, PARRAIN, SCENE } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Countdown from '../components/Countdown.jsx';
import Cowrie, { Ornament } from '../components/Cowrie.jsx';
import Icon from '../components/Icon.jsx';
import PavillonsTraversee from '../components/PavillonsTraversee.jsx';
import PackCard from '../components/PackCard.jsx';
import PartnersWall from '../components/PartnersWall.jsx';
import LeadersGallery from '../components/LeadersGallery.jsx';
import CtaBand from '../components/CtaBand.jsx';
import './Home.css';

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

function Manifeste() {
  return (
    <section className="section manifeste">
      <div className="container manifeste__grid">
        <div className="manifeste__intro">
          <Reveal as="p" className="eyebrow">
            {MANIFESTE.title}
          </Reveal>
          <Reveal as="h2" className="h2" delay={0.1}>
            La réappropriation du sens historique d’un <em className="text-gold">mot</em>
          </Reveal>
          <Reveal className="manifeste__word" delay={0.2}>
            <span className="manifeste__old">« Bois d’ébène »</span>
            <span className="manifeste__arrow" aria-hidden="true" />
            <span className="manifeste__new">ÉBËNA</span>
          </Reveal>
        </div>

        <div className="manifeste__body">
          <Reveal className="prose">
            {MANIFESTE.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal className="manifeste__shift" delay={0.15}>
            <div className="manifeste__from">
              <p className="manifeste__label">D’un imaginaire de</p>
              <p>{MANIFESTE.from.join(' · ')}</p>
            </div>
            <div className="manifeste__to">
              <p className="manifeste__label">à un imaginaire de</p>
              <ul>
                {MANIFESTE.to.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Link to="/le-salon" className="link-arrow">
              Découvrir le salon <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Chiffres() {
  return (
    <section className="chiffres" aria-label="ÉBËNA en chiffres">
      <div className="container chiffres__grid">
        {CHIFFRES.map((chiffre, index) => (
          <Reveal key={chiffre.label} className="chiffre" delay={index * 0.08}>
            <p className="chiffre__value text-gold">{chiffre.value}</p>
            <p className="chiffre__label">{chiffre.label}</p>
            <p className="chiffre__detail">{chiffre.detail}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Scene() {
  return (
    <section className="section section--alt scene">
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
        <div className="scene__grid">
          {SCENE.projets.map((projet, index) => (
            <Reveal as="article" key={projet.slug} className={`scene-card scene-card--${projet.slug}`} delay={index * 0.1}>
              <div className="scene-card__visual" aria-hidden="true">
                {projet.slug === 'leaders' ? (
                  <div className="scene-card__stack">
                    {['claudy-siar', 'fatou-jupiter-toure', 'marguerite-correa'].map((slug) => (
                      <img key={slug} src={`/images/leaders/${slug}.webp`} alt="" loading="lazy" />
                    ))}
                  </div>
                ) : projet.slug === 'voyage' ? (
                  <div className="scene-card__line">
                    {['Asili', 'Anw ka Fôli', 'Yéléma'].map((name) => (
                      <span key={name}>
                        <i />
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="scene-card__crown">
                    <Icon name="Crown" />
                    <span>Maguette Gueye</span>
                  </div>
                )}
              </div>
              <div className="scene-card__body">
                <p className="scene-card__kicker">
                  <Icon name={projet.icon} /> {projet.kicker}
                </p>
                <h3 className="h4">{projet.title}</h3>
                <p className="scene-card__quote">« {projet.quote} »</p>
                <p className="scene-card__excerpt">{projet.excerpt}</p>
                <Link to={`/programme#${projet.slug}`} className="link-arrow scene-card__link">
                  En savoir plus <ArrowUpRight />
                  <span className="sr-only"> sur {projet.title}</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benin() {
  return (
    <section className="section benin" id="benin">
      <div className="container benin__grid">
        <div className="benin__text">
          <Reveal as="p" className="eyebrow">
            Pays invité d’honneur
          </Reveal>
          <Reveal as="h2" className="h2" delay={0.08}>
            Le Bénin <em className="text-gold">en lumières</em>, l’Afrique en mouvement
          </Reveal>
          <Reveal className="benin__flag" delay={0.12} aria-hidden="true">
            <span />
            <span />
            <span />
          </Reveal>
          <Reveal as="p" className="lead" delay={0.16}>
            {BENIN.text}
          </Reveal>
        </div>

        <Reveal className="parrain" delay={0.15}>
          <div className="parrain__photo arch-frame">
            <div className="arch">
              <img src="/images/parrain-claudy-siar.webp" alt={`${PARRAIN.name}, parrain d’ÉBËNA 2027`} loading="lazy" width="768" height="1004" />
            </div>
          </div>
          <div className="parrain__text">
            <p className="eyebrow">{PARRAIN.title}</p>
            <blockquote className="quote">« {PARRAIN.quote} »</blockquote>
            <p className="parrain__name">{PARRAIN.name}</p>
            <p className="parrain__role">{PARRAIN.role}</p>
            <Link to="/le-salon#parrain" className="link-arrow">
              Lire le mot du parrain <ArrowRight />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Leaders() {
  return (
    <section className="section section--alt">
      <div className="container">
        <div className="leaders-head">
          <SectionHeading
            eyebrow="Cycle de conférences"
            title={
              <>
                La Méthode <em className="text-gold">des Leaders</em>
              </>
            }
            intro="Inspirer, entreprendre, transmettre : des dirigeants, créateurs et décideurs d’Afrique, de la diaspora et d’Europe partagent leurs parcours et leurs stratégies de réussite."
          />
          <Reveal className="leaders-head__link">
            <Link to="/programme#leaders" className="btn btn--ghost">
              Le cycle en détail <ArrowRight />
            </Link>
          </Reveal>
        </div>
        <LeadersGallery />
      </div>
    </section>
  );
}

function Exposants() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Exposants et sponsors"
          title={
            <>
              Devenez partenaire <em className="text-gold">de l’excellence</em>
            </>
          }
          intro="Choisissez le niveau de visibilité qui correspond à vos ambitions."
        />
        <div className="packs-grid">
          {PACKS.map((pack, index) => (
            <Reveal key={pack.id} delay={index * 0.1} style={{ display: 'flex' }}>
              <PackCard pack={pack} compact />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompteARebours() {
  return (
    <section className="section section--tight section--alt compte-a-rebours" aria-labelledby="compte-a-rebours-titre">
      <div className="compte-a-rebours__lattice" aria-hidden="true" />
      <div className="container compte-a-rebours__inner">
        <Reveal as="p" className="eyebrow eyebrow--center">
          Ouverture le 4 juin 2027
        </Reveal>
        <Reveal as="h2" className="h2" id="compte-a-rebours-titre" delay={0.08}>
          Le compte à rebours <em className="text-gold">est lancé</em>
        </Reveal>
        <Reveal delay={0.16}>
          <Countdown className="countdown--large" showTitle={false} />
        </Reveal>
      </div>
    </section>
  );
}

function Partenaires() {
  return (
    <section className="section section--tight partenaires-home">
      <div className="container">
        <div className="partenaires-home__head">
          <Ornament />
          <Reveal as="h2" className="h3">
            Ils accompagnent ÉBËNA
          </Reveal>
        </div>
        <PartnersWall />
        <Reveal className="partenaires-home__more">
          <Link to="/partenaires" className="link-arrow">
            Tous nos partenaires <ArrowRight />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  useDocumentMeta(
    null,
    'ÉBËNA, le grand rendez-vous de la création africaine en Europe : 4, 5 et 6 juin 2027 au Parc des Chantiers, Nantes. Six pavillons, la Scène ÉBËNA, le Bénin pays invité d’honneur.'
  );

  return (
    <>
      <Hero />
      <Marquee />
      <Manifeste />
      <Chiffres />
      <PavillonsTraversee />
      <Scene />
      <Benin />
      <Leaders />
      <Exposants />
      <Partenaires />
      <CompteARebours />
      <CtaBand />
    </>
  );
}
